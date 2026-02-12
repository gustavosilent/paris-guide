<script setup lang="ts">
import { z } from 'zod'
import { reactive, computed, ref } from 'vue'
import { useTipsStore } from '~/stores/tips'

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

watch(() => props.initialData, (val) => {
  if (val) {
    state.title = val.title
    state.description = val.description
    state.category = val.category
    state.email = val.email
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
  try {
    const endpoint = props.isEdit ? '/api/admin/edit' : '/api/submit'
    const payload = props.isEdit 
      ? { ...state, id: props.initialData?.id, lang: language.value } 
      : { ...state, lang: language.value }
    
    const response = await $fetch<{ success: boolean }>(endpoint, {
      method: 'POST',
      body: payload
    })
    
    if (response && response.success) {
      toast.add({ 
        title: props.isEdit ? 'Dica Atualizada!' : 'Dica Enviada!', 
        description: props.isEdit ? 'Alterações salvas com sucesso.' : 'Obrigado por contribuir. Sua dica será revisada.', 
        color: 'green', 
        icon: 'i-heroicons-check-circle' 
      })
      isOpen.value = false
      
      state.title = ''
      state.description = ''
      state.category = ''
      state.email = ''
      state.highlights = []
    }
  } catch (err) {
    toast.add({ title: 'Erro', description: 'Falha ao enviar dica.', color: 'red' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal v-model="isOpen" :ui="{ 
    overlay: { background: 'bg-black/95' },
    base: 'bg-black border border-white/10 rounded-none shadow-[40px_40px_100px_rgba(0,0,0,1)]'
  }">
    <div class="relative overflow-hidden p-0">
      <div class="absolute top-0 left-0 right-0 h-1 bg-[#FF4D00]"></div>
      
      <div class="p-8 md:p-12">
        <div class="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
          <h3 class="text-4xl font-black text-white tracking-tighter uppercase italic">
            {{ isEdit ? 'Modify Tip' : 'New Entry' }}
          </h3>
          <button @click="isOpen = false" class="text-white/40 hover:text-white transition-colors">
            <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
          </button>
        </div>

        <UForm :schema="schema" :state="state" class="space-y-10" @submit="onSubmit">
          <UFormGroup name="title">
            <template #label>
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4D00] mb-2 block">01 / Title</label>
            </template>
            <UInput 
              v-model="state.title" 
              placeholder="THE ULTIMATE CROISSANT..." 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white focus:border-[#FF4D00] transition-all duration-300 font-bold placeholder:text-white/10',
                rounded: 'rounded-none'
              }"
            />
          </UFormGroup>

          <UFormGroup name="category">
            <template #label>
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4D00] mb-2 block">02 / Category</label>
            </template>
            <USelect 
              v-model="state.category" 
              :options="categories" 
              placeholder="SELECT SECTOR..." 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white focus:border-[#FF4D00] transition-all duration-300 font-bold',
                rounded: 'rounded-none',
                color: { gray: { outline: 'bg-transparent ring-0 border-white/10' } }
              }"
            />
          </UFormGroup>

          <UFormGroup name="description">
            <template #label>
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4D00] mb-2 block">03 / Detailed Intelligence</label>
            </template>
            <UTextarea 
              v-model="state.description" 
              placeholder="PROVIDE THE FULL CONTEXT..." 
              :rows="4" 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white focus:border-[#FF4D00] transition-all duration-300 font-bold placeholder:text-white/10',
                rounded: 'rounded-none'
              }"
            />
          </UFormGroup>

          <UFormGroup name="email">
            <template #label>
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4D00] mb-2 block">04 / Operator Auth (Email)</label>
            </template>
            <UInput 
              v-model="state.email" 
              type="email" 
              placeholder="AGENT@PARIS-GUIDE.COM" 
              size="xl"
              :ui="{ 
                base: 'bg-transparent border-white/10 text-white focus:border-[#FF4D00] transition-all duration-300 font-bold placeholder:text-white/10',
                rounded: 'rounded-none'
              }"
            />
          </UFormGroup>

          <div class="pt-4 border-t border-white/10 mt-12">
            <div class="flex items-center justify-between mb-8">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">05 / Tactical Highlights</span>
              <button 
                type="button"
                @click="addHighlight"
                class="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#FF4D00] transition-colors flex items-center gap-2"
              >
                <UIcon name="i-heroicons-plus" /> Add Highlight
              </button>
            </div>
            
            <div v-for="(item, index) in state.highlights" :key="index" class="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-white/5 last:border-0">
              <div class="flex-1">
                <UFormGroup :name="`highlights.${index}.keyword`">
                  <UInput v-model="item.keyword" placeholder="KEYWORD" size="md" :ui="{ base: 'bg-transparent border-white/10 text-white', rounded: 'rounded-none' }" />
                </UFormGroup>
              </div>
              <div class="flex-[2]">
                <UFormGroup :name="`highlights.${index}.info`">
                  <UInput v-model="item.info" placeholder="INTELLIGENCE..." size="md" :ui="{ base: 'bg-transparent border-white/10 text-white', rounded: 'rounded-none' }" />
                </UFormGroup>
              </div>
              <button @click="removeHighlight(index)" class="text-white/40 hover:text-red-500 transition-colors p-2">
                <UIcon name="i-heroicons-trash" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="pt-8">
            <UButton 
              type="submit" 
              block 
              size="xl"
              :loading="isLoading"
              class="rounded-none bg-white text-black hover:bg-[#FF4D00] hover:text-white font-black uppercase tracking-[0.3em] transition-all duration-300 h-16"
            >
              {{ isEdit ? 'Commit Changes' : 'Submit Intel' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </UModal>
</template>
