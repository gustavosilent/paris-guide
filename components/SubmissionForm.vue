<script setup lang="ts">
import { z } from 'zod'
import { reactive, computed, ref } from 'vue'
import { useTipsStore } from '~/stores/tips'
import { getCategoryColor } from '~/utils/colors'

const store = useTipsStore()
const { language } = storeToRefs(store)

const props = defineProps<{
  modelValue: boolean
  isEdit?: boolean
  initialData?: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const schema = z.object({
  title: z.string().min(5, 'Título muito curto (mín. 5)'),
  description: z.string().min(20, 'Descrição muito curta (mín. 20)'),
  category: z.string().min(1, 'Selecione uma categoria'),
  email: z.string().email('Email inválido'),
  highlights: z.array(z.object({
    keyword: z.string().min(1, 'Palavra-chave obrigatória'),
    info: z.string().min(5, 'Explicação muito curta')
  })).optional().default([])
})

const state = reactive({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  category: props.initialData?.category || '',
  email: props.initialData?.email || '',
  highlights: props.initialData?.highlights ? JSON.parse(JSON.stringify(props.initialData.highlights)) : []
})

// Dynamic Color Mapping
const categoryColor = computed(() => getCategoryColor(state.category).color)

watch(() => props.initialData, (val) => {
  if (val) {
    state.title = val.title || ''
    state.description = val.description || ''
    state.category = val.category || ''
    state.email = val.email || ''
    state.highlights = JSON.parse(JSON.stringify(val.highlights || []))
  } else if (!props.isEdit) {
      state.title = ''
      state.description = ''
      state.category = ''
      state.email = ''
      state.highlights = []
  }
})

const addHighlight = () => {
  state.highlights.push({ keyword: '', info: '' })
}

const removeHighlight = (index: any) => {
  state.highlights.splice(index, 1)
}

const categories = ['FOOD', 'TRANSPORTATION', 'CULTURE', 'SAFETY', 'CITY']

const toast = useToast()
const isLoading = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const onSubmit = async () => {
  isLoading.value = true
  try {
    const endpoint = props.isEdit ? '/api/admin/edit' : '/api/submit'
    const payload = props.isEdit 
      ? { ...state, id: props.initialData?.id, lang: language.value } 
      : { ...state, lang: language.value }
    
    // Validate schema before sending
    const validation = schema.safeParse(state)
    if (!validation.success) {
      toast.add({ title: 'VALIDATION_ERROR', description: validation.error.errors[0].message, color: 'red' })
      return
    }

    const response = await $fetch<{ success: boolean }>(endpoint, {
      method: 'POST',
      body: payload
    })
    
    if (response && response.success) {
      toast.add({ 
        title: props.isEdit ? 'INTEL UPDATED' : 'INTEL COMMITTED', 
        description: props.isEdit ? 'Sector data synchronized.' : 'Your intelligence is being processed.', 
        color: 'green', 
        icon: 'i-heroicons-check-circle' 
      })
      isOpen.value = false
      
      if (!props.isEdit) {
        state.title = ''
        state.description = ''
        state.category = ''
        state.email = ''
        state.highlights = []
      }
    }
  } catch (err: any) {
    toast.add({ title: 'ERROR', description: err.data?.message || 'Failed to commit intelligence.', color: 'red' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal v-model="isOpen" :ui="{ 
    overlay: { background: 'bg-black/90 backdrop-blur-sm' },
    base: 'bg-[#0A0A0A] border border-white/10 rounded-none overflow-hidden max-w-2xl'
  }">
    <div class="relative p-0 flex flex-col h-full max-h-[90vh]">
      <div class="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div class="flex items-center gap-4">
          <div class="w-1 h-6 transition-colors duration-500" :style="{ backgroundColor: categoryColor }"></div>
          <h3 class="text-2xl font-black text-white tracking-tighter uppercase tabular-nums">
            {{ isEdit ? 'DATA_EDIT' : 'NEW_ENTRY' }}
          </h3>
        </div>
        <button @click="isOpen = false" class="text-white/20 hover:text-white transition-colors p-2">
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
        <UForm :schema="schema" :state="state" class="space-y-8" @submit="onSubmit">
          <UFormGroup name="title">
            <template #label>
              <label class="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3 block">01 // Identifier Title</label>
            </template>
            <UInput 
              v-model="state.title" 
              placeholder="ENTRY_NAME..." 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white transition-all duration-300 font-bold placeholder:text-white/10',
                rounded: 'rounded-none'
              }"
              :style="{ borderColor: state.title ? categoryColor : '', '--tw-ring-color': categoryColor }"
            />
          </UFormGroup>

          <UFormGroup name="category">
            <template #label>
              <label class="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3 block">02 // Operational Sector</label>
            </template>
            <USelect 
              v-model="state.category" 
              :options="categories" 
              placeholder="SELECT_SECTOR..." 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white transition-all duration-300 font-bold',
                rounded: 'rounded-none',
                color: { gray: { outline: 'bg-transparent ring-0 border-white/10' } }
              }"
              :style="{ borderColor: state.category ? categoryColor : '' }"
            />
          </UFormGroup>

          <UFormGroup name="description">
            <template #label>
              <label class="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3 block">03 // Intelligence Context</label>
            </template>
            <UTextarea 
              v-model="state.description" 
              placeholder="PROVIDE_CONTEXTUAL_DATA..." 
              :rows="4" 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white transition-all duration-300 font-bold placeholder:text-white/10 leading-relaxed',
                rounded: 'rounded-none'
              }"
              :style="{ borderColor: state.description ? categoryColor : '' }"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UFormGroup name="email">
              <template #label>
                <label class="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3 block">04 // Operator_Auth</label>
              </template>
              <UInput 
                v-model="state.email" 
                type="email" 
                placeholder="AGENT_ID@PARIS" 
                size="xl"
                :ui="{ 
                  base: 'bg-transparent border-white/10 text-white transition-all duration-300 font-bold placeholder:text-white/10',
                  rounded: 'rounded-none'
                }"
                :style="{ borderColor: state.email ? categoryColor : '' }"
              />
            </UFormGroup>
          </div>

          <div class="pt-8 border-t border-white/5">
            <div class="flex items-center justify-between mb-8 font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase">
              <span>05 // Precision Highlights</span>
              <button 
                type="button"
                @click="addHighlight"
                class="hover:text-white transition-colors flex items-center gap-2"
              >
                <UIcon name="i-heroicons-plus" /> ADD_TAG
              </button>
            </div>
            
            <div 
              v-for="(item, index) in state.highlights" 
              :key="index" 
              class="flex flex-col md:flex-row gap-4 mb-6 p-4 border border-white/5 bg-white/[0.01]"
              :style="{ borderLeftColor: categoryColor, borderLeftWidth: '2px' }"
            >
              <div class="flex-1">
                <UFormGroup :name="`highlights.${index}.keyword`" :ui="{ label: { base: 'hidden' } }">
                  <UInput v-model="item.keyword" placeholder="KEY_REF" size="sm" :ui="{ base: 'bg-transparent border-white/10 text-white font-bold', rounded: 'rounded-none' }" />
                </UFormGroup>
              </div>
              <div class="flex-[3]">
                <UFormGroup :name="`highlights.${index}.info`" :ui="{ label: { base: 'hidden' } }">
                  <UInput v-model="item.info" placeholder="TECHNICAL_SPEC..." size="sm" :ui="{ base: 'bg-transparent border-white/10 text-white font-bold', rounded: 'rounded-none' }" />
                </UFormGroup>
              </div>
              <button @click="removeHighlight(index)" class="text-white/20 hover:text-red-500 transition-colors px-2">
                <UIcon name="i-heroicons-trash" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="pt-8 sticky bottom-0 bg-[#0A0A0A]">
            <UButton 
              type="submit" 
              block 
              size="xl"
              :loading="isLoading"
              class="rounded-none font-black uppercase tracking-[0.4em] transition-all duration-500 h-16 shadow-lg shadow-black"
              :style="{ backgroundColor: categoryColor, color: '#000' }"
            >
              {{ isEdit ? 'EXECUTE_COMMIT' : 'INITIALIZE_SUBMISSION' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </UModal>
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
