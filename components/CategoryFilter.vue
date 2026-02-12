<script setup lang="ts">
import { getCategoryColor } from '~/utils/colors'

const props = defineProps<{
  categories: string[]
  modelValue: string | null
  visible?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const select = (cat: string) => {
  if (props.modelValue === cat) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', cat)
  }
}
</script>

<template>
  <div 
    class="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform duration-700"
    :class="visible === false ? '-translate-y-24' : 'translate-y-0'"
  >
    <div class="flex gap-0 p-0 bg-[#0A0A0A] border border-white/10 pointer-events-auto overflow-x-auto max-w-full no-scrollbar items-stretch font-mono text-[9px] tracking-[0.3em] uppercase transition-all duration-500 hover:border-white/20">
      <button 
        @click="emit('update:modelValue', null)"
        class="px-6 py-3 transition-all duration-300 border-r border-white/5 hover:bg-white/5"
        :class="!modelValue ? 'text-[#00F0FF]' : 'text-white/40 hover:text-white'"
      >
        ALL
      </button>
      
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="select(cat)"
        class="relative px-6 py-3 transition-all duration-300 border-r border-white/5 last:border-0 shrink-0 select-none hover:bg-white/5"
        :style="{ 
          color: modelValue === cat ? getCategoryColor(cat).color : '',
          backgroundColor: modelValue === cat ? `${getCategoryColor(cat).color}05` : ''
        }"
        :class="modelValue !== cat ? 'text-white/40 hover:text-white' : ''"
        :aria-label="`Filter by ${cat}`"
      >
        <span class="relative z-10">{{ cat }}</span>
        <div 
          v-if="modelValue === cat"
          class="absolute bottom-0 left-0 h-[2px] w-full transition-colors duration-500"
          :style="{ backgroundColor: getCategoryColor(cat).color }"
        ></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
