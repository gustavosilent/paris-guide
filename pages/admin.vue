<script setup lang="ts">
import { useTipsStore } from '~/stores/tips'
import type { Tip } from '~/server/utils/db'

const store = useTipsStore()
const { language } = storeToRefs(store)

const tips = ref<Tip[]>([])
const isLoading = ref(true)
const filter = ref('all')
const filters = ['all', 'pending', 'approved', 'rejected']

const editingTip = ref<Tip | null>(null)
const isEditModalOpen = ref(false)

const fetchTips = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<Tip[]>(`/api/admin/all_tips?lang=${language.value}`)
    tips.value = data || []
  } catch (e) {
    console.error('Failed to fetch tips', e)
  } finally {
    isLoading.value = false
  }
}

const filteredTips = computed(() => {
  if (filter.value === 'all') return tips.value
  return tips.value.filter(t => t.status === filter.value)
})

const stats = computed(() => [
  { label: 'TOTAL_RECORDS', value: tips.value.length },
  { label: 'PENDING_REVIEWS', value: tips.value.filter(t => t.status === 'pending').length },
  { label: 'LIVE_ENTRIES', value: tips.value.filter(t => t.status === 'approved').length },
  { label: 'REJECTED_FILES', value: tips.value.filter(t => t.status === 'rejected').length }
])

const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
  try {
    await $fetch('/api/admin/approve', {
      method: 'POST',
      body: { id, status, lang: language.value }
    })
    const tip = tips.value.find(t => t.id === id)
    if (tip) tip.status = status
    useToast().add({ title: `Tip ${status}`, color: 'green' })
  } catch (e: any) {
    useToast().add({ title: 'Error', description: e.message, color: 'red' })
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this tip?')) return
  
  try {
    await $fetch('/api/admin/delete', {
      method: 'POST',
      body: { id, lang: language.value }
    })
    tips.value = tips.value.filter(t => t.id !== id)
    useToast().add({ title: 'Tip Deleted', color: 'green' })
  } catch (e: any) {
    useToast().add({ title: 'Error', description: e.message, color: 'red' })
  }
}

const handleEdit = (tip: Tip) => {
  editingTip.value = tip
  isEditModalOpen.value = true
}

watch(isEditModalOpen, (isOpen) => {
  if (!isOpen) { 
      fetchTips()
      editingTip.value = null
  }
})

watch(language, () => {
  fetchTips()
})

onMounted(() => {
  fetchTips()
})
</script>

<template>
  <div class="h-[100dvh] bg-[#0A0A0A] text-white flex flex-col font-sans overflow-hidden">
    <!-- Admin Header -->
    <header class="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
      <div class="flex items-center gap-6">
        <div class="w-1 h-8 bg-[#00F0FF]"></div>
        <div>
          <h1 class="text-2xl font-black tracking-tighter uppercase tabular-nums">ADMIN_PANEL</h1>
          <div class="font-mono text-[9px] text-white/40 tracking-[0.3em] uppercase mt-1">
            System Operational // {{ language === 'ptbr' ? 'LOC_PT' : 'LOC_EN' }}
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <UButton 
          icon="i-heroicons-arrow-left" 
          variant="ghost" 
          color="white" 
          to="/"
          class="font-mono text-[10px] tracking-widest hover:text-[#00F0FF]"
        >
          BACK_TO_ROOT
        </UButton>
        <button 
          @click="store.setLanguage(language === 'ptbr' ? 'en' : 'ptbr')"
          class="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#00F0FF] hover:text-white transition-all duration-300"
        >
          {{ language === 'ptbr' ? 'PORTUGUESE' : 'ENGLISH' }}
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-hidden flex flex-col p-6 lg:p-12">
      <!-- Filters / Stats -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="p-6 border border-white/5 bg-white/[0.01]"
        >
          <div class="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase mb-2">{{ stat.label }}</div>
          <div class="text-3xl font-black tabular-nums">{{ stat.value }}</div>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="mb-4 flex items-center gap-4">
        <div class="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">Filter_By:</div>
        <div class="flex border border-white/10 font-mono text-[9px] tracking-[0.2em] uppercase">
          <button 
            v-for="f in filters" 
            :key="f"
            @click="filter = f"
            class="px-4 py-2 border-r border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            :class="filter === f ? 'text-[#00F0FF] bg-white/5' : 'text-white/40'"
          >
            {{ f }}
          </button>
        </div>
      </div>

      <!-- Tips List -->
      <div class="flex-1 border border-white/10 overflow-hidden flex flex-col bg-white/[0.01]">
        <div class="p-4 border-b border-white/10 bg-white/[0.02] flex items-center font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
          <div class="w-24 px-4">STATUS</div>
          <div class="flex-1 px-4">IDENTIFIER_TITLE</div>
          <div class="w-32 px-4 shrink-0">SECTOR</div>
          <div class="w-32 px-4 shrink-0">ACTIONS</div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-if="isLoading" class="p-20 flex justify-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-white/20" />
          </div>

          <div v-else>
            <div 
              v-for="tip in filteredTips" 
              :key="tip.id"
              class="flex items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
            >
              <div class="w-24 px-4 py-6 shrink-0">
                <span 
                  class="font-mono text-[9px] border px-2 py-0.5"
                  :class="tip.status === 'approved' ? 'border-green-500/20 text-green-500 bg-green-500/5' : tip.status === 'pending' ? 'border-[#00F0FF]/20 text-[#00F0FF] bg-[#00F0FF]/5' : 'border-red-500/20 text-red-500 bg-red-500/5'"
                >
                  {{ tip.status?.toUpperCase() || 'UNKNOWN' }}
                </span>
              </div>
              
              <div class="flex-1 px-4 py-6 overflow-hidden">
                <div class="text-white font-bold uppercase transition-colors group-hover:text-[#00F0FF] truncate">
                  {{ tip.title }}
                </div>
                <div class="font-mono text-[9px] text-white/20 mt-1 uppercase truncate">ID: {{ tip.id }}</div>
              </div>

              <div class="w-32 px-4 py-6 shrink-0">
                 <span class="font-mono text-[9px] text-white/40 border border-white/10 px-2 py-0.5 uppercase">
                   {{ tip.category }}
                 </span>
              </div>

              <div class="w-32 px-4 py-6 flex items-center gap-2 shrink-0">
                <button 
                  v-if="tip.status === 'pending'" 
                  @click="handleStatus(tip.id, 'approved')"
                  class="p-2 hover:bg-green-500/10 text-white/20 hover:text-green-500 transition-all border border-transparent hover:border-green-500/20"
                  title="Approve"
                >
                  <UIcon name="i-heroicons-check" class="w-5 h-5" />
                </button>
                <button 
                  @click="handleEdit(tip)"
                  class="p-2 hover:bg-[#00F0FF]/10 text-white/20 hover:text-[#00F0FF] transition-all border border-transparent hover:border-[#00F0FF]/20"
                  title="Edit"
                >
                  <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
                </button>
                <button 
                  @click="handleDelete(tip.id)"
                  class="p-2 hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                  title="Delete"
                >
                  <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <SubmissionForm 
      v-model="isEditModalOpen" 
      :is-edit="true" 
      :initial-data="editingTip" 
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.3);
}
</style>
