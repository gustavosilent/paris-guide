<script setup lang="ts">
import { useTipsStore } from '~/stores/tips'

const store = useTipsStore()
const { sortMode, language } = storeToRefs(store)

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const toggleSort = () => {
  if (sortMode.value === 'relevant') {
    store.shuffle()
  } else {
    sortMode.value = 'relevant'
  }
}

const toggleLanguage = () => {
  const newLang = language.value === 'ptbr' ? 'en' : 'ptbr'
  store.setLanguage(newLang)
}
</script>

<template>
    <div 
      class="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none flex justify-end p-6 md:p-12 transition-all duration-500"
      :class="modelValue ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'"
    >
      <div class="pointer-events-auto flex items-stretch gap-0 bg-black border border-white/10 shadow-[20px_20px_50px_rgba(0,0,0,0.5)]">
          <button 
            @click="toggleSort"
            class="flex items-center justify-center p-4 hover:bg-white hover:text-black transition-all duration-300 border-r border-white/5"
            aria-label="Sort Order"
          >
            <UIcon :name="sortMode === 'relevant' ? 'i-heroicons-star' : 'i-heroicons-sparkles'" class="w-6 h-6" />
          </button>
          
          <button 
            @click="toggleLanguage"
            class="flex items-center justify-center px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 border-r border-white/5"
            aria-label="Language"
          >
            {{ language === 'ptbr' ? 'PT' : 'EN' }}
          </button>

          <button 
            @click="emit('update:modelValue', true)"
            class="flex items-center justify-center p-4 hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Submit New Tip"
            disabled
          >
            <UIcon name="i-heroicons-plus" class="w-6 h-6" />
          </button>
      </div>
    </div>
</template>
