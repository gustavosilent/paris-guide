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
      class="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none flex justify-center pb-8 md:pb-4 transition-all duration-300"
      :class="modelValue ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'"
    >
      <div class="pointer-events-auto flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 shadow-2xl">
          <UButton 
            :icon="sortMode === 'relevant' ? 'i-heroicons-star' : 'i-heroicons-sparkles'"
            variant="ghost"
            color="white"
            size="xl"
            @click="toggleSort"
            :ui="{ rounded: 'rounded-full' }"
            aria-label="Sort Order"
          />
          
          <div class="h-6 w-px bg-white/20"></div>

          <UButton 
            :label="language === 'ptbr' ? 'PT' : 'EN'"
            variant="ghost"
            color="white"
            size="xl"
            @click="toggleLanguage"
            :ui="{ rounded: 'rounded-full' }"
            aria-label="Language"
          />

          <div class="h-6 w-px bg-white/20"></div>

          <UButton 
            icon="i-heroicons-plus" 
            variant="ghost"
            color="white"
            size="xl" 
            @click="emit('update:modelValue', true)"
            :ui="{ rounded: 'rounded-full' }"
            aria-label="Add Tip"
          />
      </div>
    </div>
</template>
