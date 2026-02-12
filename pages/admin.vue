<script setup lang="ts">
import { useTipsStore } from '~/stores/tips'
import type { Tip } from '~/server/utils/db'

const store = useTipsStore()
const { language } = storeToRefs(store)

const tips = ref<Tip[]>([])
const isLoading = ref(true)
const filter = ref('pending')
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
  <div class="min-h-screen pt-24 px-6 md:px-12 bg-[#050505] text-white">
    <div class="flex flex-col md:flex-row items-start justify-between mb-16 border-b border-white/10 pb-12 gap-8">
      <div>
        <h1 class="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">Admin Panel</h1>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 leading-none">Security Clearance: Alpha-Zero</p>
      </div>
      
      <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <button 
          @click="store.setLanguage(language === 'ptbr' ? 'en' : 'ptbr')"
          class="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#FF4D00] hover:text-white transition-all duration-300"
        >
          {{ language === 'ptbr' ? 'PORTUGUESE' : 'ENGLISH' }}
        </button>
        
        <div class="flex bg-white/5 border border-white/10 p-0">
          <button 
            v-for="f in filters" 
            :key="f"
            @click="filter = f"
            class="px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-r border-white/5 last:border-0"
            :class="filter === f ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'"
          >
            {{ f }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="text-white font-black uppercase tracking-widest animate-pulse">Synchronizing Data...</div>
    
    <div v-else-if="filteredTips.length === 0" class="text-white/20 font-black uppercase tracking-widest">
      Zero Entries Found.
    </div>
    
    <div v-else class="grid gap-0 border-t border-l border-white/10">
      <div v-for="tip in filteredTips" :key="tip.id" class="flex flex-col md:grid md:grid-cols-12 gap-0 border-r border-b border-white/10 group transition-all duration-300 hover:bg-white/[0.02]">
        
        <!-- Grid Col: Status & Metadata -->
        <div class="md:col-span-3 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
          <div class="flex flex-col gap-4">
            <span class="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-current" :class="getCategoryColor(tip.category)?.badge.replace('bg-', 'text-').replace('-200', '').replace('/10', '') || 'text-gray-500'">
              {{ tip.category }}
            </span>
            <div class="text-[9px] font-black tracking-widest text-white/20 uppercase">{{ tip.id }}</div>
          </div>
          <div class="mt-8">
            <div class="text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">Status</div>
            <div class="text-xs font-black uppercase tracking-widest" :class="tip.status === 'approved' ? 'text-green-500' : tip.status === 'pending' ? 'text-yellow-500' : 'text-red-500'">
              // {{ tip.status }}
            </div>
          </div>
        </div>

        <!-- Grid Col: Content -->
        <div class="md:col-span-6 p-8 border-b md:border-b-0 md:border-r border-white/10">
          <h3 class="text-3xl font-black text-white mb-6 uppercase leading-tight">{{ tip.title }}</h3>
          <p class="text-gray-400 text-sm mb-8 leading-relaxed max-w-xl">{{ tip.description }}</p>
          <div class="flex flex-wrap gap-4 items-center">
            <div class="text-[10px] font-black uppercase tracking-widest text-white/20">Keywords:</div>
            <div class="flex gap-2">
              <span v-for="h in tip.highlights" :key="h.keyword" class="text-[9px] border border-white/10 text-white/60 px-2 py-1 uppercase font-black tracking-widest">{{ h.keyword }}</span>
            </div>
          </div>
          <div class="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4D00]">Source: {{ tip.email }}</div>
        </div>
        
        <!-- Grid Col: Actions -->
        <div class="md:col-span-3 flex flex-col bg-white/[0.01]">
          <template v-if="tip.status === 'pending'">
            <button 
              @click="handleStatus(tip.id, 'approved')"
              class="flex-1 flex items-center justify-center gap-4 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 font-black uppercase tracking-widest text-[10px] border-b border-white/5"
              disabled
            >
              <UIcon name="i-heroicons-check" class="w-5 h-5" /> Approve
            </button>
            <button 
              @click="handleStatus(tip.id, 'rejected')"
              class="flex-1 flex items-center justify-center gap-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-300 font-black uppercase tracking-widest text-[10px] border-b border-white/5"
              disabled
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" /> Reject
            </button>
          </template>
          
          <button 
            @click="handleEdit(tip)"
            class="flex-1 flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all duration-300 font-black uppercase tracking-widest text-[10px] border-b border-white/5"
            disabled
          >
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" /> Edit
          </button>
          <button 
            @click="handleDelete(tip.id)"
            class="flex-1 flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
            disabled
          >
            <UIcon name="i-heroicons-trash" class="w-5 h-5" /> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <SubmissionForm v-model="isEditModalOpen" :initial-data="editingTip" :is-edit="true" />
  </div>
</template>
