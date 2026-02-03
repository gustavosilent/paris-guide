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
  <div class="min-h-screen pt-24 px-6 md:px-12 bg-black/90">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-white">Admin Panel</h1>
      <div class="flex gap-4 items-center">
        <UButton 
          :label="language === 'ptbr' ? 'PT' : 'EN'"
          variant="soft"
          color="primary"
          size="lg"
          @click="store.setLanguage(language === 'ptbr' ? 'en' : 'ptbr')"
          :ui="{ rounded: 'rounded-full' }"
        />
        <div class="flex bg-white/10 rounded-lg p-1">
          <button 
            v-for="f in filters" 
            :key="f"
            @click="filter = f"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize"
            :class="filter === f ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'"
          >
            {{ f }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="text-white">Loading...</div>
    
    <div v-else-if="filteredTips.length === 0" class="text-gray-400">
      No tips found for this filter.
    </div>
    
    <div v-else class="grid gap-6">
      <div v-for="tip in filteredTips" :key="tip.id" class="flex flex-col md:flex-row gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md transition-all hover:bg-white/10">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border" :class="getCategoryColor(tip.category)?.badge || 'bg-gray-500 text-white'">{{ tip.category }}</span>
            <span class="text-xs text-gray-500">{{ tip.id }}</span>
            <UBadge :color="tip.status === 'approved' ? 'green' : tip.status === 'pending' ? 'yellow' : 'red'" variant="subtle" size="xs">{{ tip.status }}</UBadge>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">{{ tip.title }}</h3>
          <p class="text-gray-300 text-sm mb-4 line-clamp-2">{{ tip.description }}</p>
          <div class="text-xs text-blue-400 mb-2">Submitted by: {{ tip.email }}</div>
          <div class="flex gap-2">
              <span v-for="h in tip.highlights" :key="h.keyword" class="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">{{ h.keyword }}</span>
          </div>
        </div>
        
        <div class="flex md:flex-col gap-2 justify-center min-w-[120px]">
            <template v-if="tip.status === 'pending'">
                <UButton color="green" variant="solid" icon="i-heroicons-check" block @click="handleStatus(tip.id, 'approved')" disabled>Approve</UButton>
                <UButton color="red" variant="ghost" icon="i-heroicons-x-mark" block @click="handleStatus(tip.id, 'rejected')" disabled>Reject</UButton>
            </template>
            <div class="h-px bg-white/10 my-1" v-if="tip.status === 'pending'"></div>
            <UButton color="blue" variant="soft" icon="i-heroicons-pencil-square" block @click="handleEdit(tip)" disabled>Edit</UButton>
            <UButton color="red" variant="soft" icon="i-heroicons-trash" block @click="handleDelete(tip.id)" disabled>Delete</UButton>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <SubmissionForm v-model="isEditModalOpen" :initial-data="editingTip" :is-edit="true" />
  </div>
</template>
