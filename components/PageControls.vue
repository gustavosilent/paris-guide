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
      class="fixed bottom-12 left-0 right-0 z-[100] pointer-events-none flex justify-center transition-all duration-700 delay-300"
      :class="modelValue ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'"
    >
      <div class="pointer-events-auto flex items-stretch gap-0 bg-[#0A0A0A] border border-white/10 font-mono text-[9px] tracking-[0.3em] uppercase transition-all duration-500 hover:border-white/20">
          <button 
            @click="toggleSort"
            class="flex items-center justify-center p-4 border-r border-white/5 hover:bg-white/5 transition-all duration-300 group"
            aria-label="Sort Order"
          >
            <UIcon :name="sortMode === 'relevant' ? 'i-heroicons-star' : 'i-heroicons-sparkles'" class="w-5 h-5 transition-colors" :class="sortMode === 'relevant' ? 'text-[#00F0FF]' : 'text-white/40 group-hover:text-white'" />
          </button>
          
          <button 
            @click="toggleLanguage"
            class="flex items-center justify-center px-6 py-4 border-r border-white/5 hover:bg-white/5 transition-all duration-300 text-white/40 hover:text-white"
            aria-label="Language Toggle"
          >
            LANG / {{ language === 'ptbr' ? 'PT' : 'EN' }}
          </button>

          <button 
            @click="emit('update:modelValue', true)"
            class="flex items-center justify-center px-6 py-4 hover:bg-white/5 transition-all duration-300 text-white/40 hover:text-white"
            aria-label="Submit New Tip"
          >
            <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-3" />
            NEW_TIP
          </button>
      </div>
    </div>
</template>
