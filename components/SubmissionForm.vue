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
  <UModal v-model="isOpen" :ui="{ overlay: { background: 'bg-black/80 backdrop-blur-sm' } }">
    <div class="relative overflow-hidden rounded-2xl ">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-2xl font-bold text-white tracking-tight">
            {{ isEdit ? 'Editar Dica' : 'Nova Dica' }}
          </h3>
          <UButton color="white" variant="ghost" icon="i-heroicons-x-mark" class="hover:bg-white/10 rounded-full" @click="isOpen = false" />
        </div>

        <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
          <UFormGroup label="Título" name="title" :ui="{ label: { base: 'text-gray-300 font-medium' } }">
            <UInput 
              v-model="state.title" 
              placeholder="Ex: O melhor croissant..." 
              size="lg"
              :ui="{ 
                base: 'bg-white/5 border-white/10 text-white focus:ring-purple-500 focus:border-purple-500 rounded-xl',
                placeholder: 'placeholder-gray-500'
              }"
            />
          </UFormGroup>

          <UFormGroup label="Categoria" name="category" :ui="{ label: { base: 'text-gray-300 font-medium' } }">
            <USelect 
              v-model="state.category" 
              :options="categories" 
              placeholder="Selecione..." 
              size="lg"
              :ui="{ 
                base: 'bg-white/5 border-white/10 text-white focus:ring-purple-500 focus:border-purple-500 rounded-xl',
                color: { gray: { outline: 'shadow-sm bg-transparent text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500 dark:ring-gray-700 dark:text-white dark:focus:ring-primary-500' } }
              }"
            />
          </UFormGroup>

          <UFormGroup label="Descrição" name="description" :ui="{ label: { base: 'text-gray-300 font-medium' } }">
            <UTextarea 
              v-model="state.description" 
              placeholder="Conte os detalhes..." 
              :rows="4" 
              size="lg"
              :ui="{ 
                base: 'bg-white/5 border-white/10 text-white focus:ring-purple-500 focus:border-purple-500 rounded-xl',
                placeholder: 'placeholder-gray-500'
              }"
            />
          </UFormGroup>

          <UFormGroup label="Seu Email" name="email" :ui="{ label: { base: 'text-gray-300 font-medium' } }">
            <UInput 
              v-model="state.email" 
              type="email" 
              placeholder="para validação da dica" 
              size="lg"
              :ui="{ 
                base: 'bg-white/5 border-white/10 text-white focus:ring-purple-500 focus:border-purple-500 rounded-xl',
                placeholder: 'placeholder-gray-500'
              }"
            />
          </UFormGroup>

          <div class="pt-2 border-t border-white/10 mt-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-300 font-medium text-sm">Highlights (Palavras-chave)</span>
              <UButton 
                size="xs" 
                color="primary" 
                variant="soft" 
                icon="i-heroicons-plus" 
                @click="addHighlight"
                label="Adicionar"
              />
            </div>
            
            <div v-for="(item, index) in state.highlights" :key="index" class="flex gap-2 mb-2 items-start">
              <UFormGroup :name="`highlights.${index}.keyword`" class="flex-1">
                <UInput v-model="item.keyword" placeholder="Palavra" size="sm" :ui="{ base: 'bg-white/5 border-white/10 text-white' }" />
              </UFormGroup>
              <UFormGroup :name="`highlights.${index}.info`" class="flex-[2]">
                <UInput v-model="item.info" placeholder="Explicação..." size="sm" :ui="{ base: 'bg-white/5 border-white/10 text-white' }" />
              </UFormGroup>
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" size="sm" @click="removeHighlight(index)" class="mt-1" />
            </div>
          </div>

          <div class="pt-4">
            <UButton 
              type="submit" 
              block 
              size="xl"
              :loading="isLoading"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 border-none"
            >
              {{ isEdit ? 'Salvar Alterações' : 'Enviar Dica' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </UModal>
</template>
