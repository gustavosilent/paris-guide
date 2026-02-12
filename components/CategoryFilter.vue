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
    class="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform duration-500"
    :class="visible === false ? '-translate-y-full md:translate-y-0' : 'translate-y-0'"
  >
    <div class="flex gap-0 p-0 bg-black border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto overflow-x-auto max-w-full w-full no-scrollbar items-stretch justify-start md:justify-center">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="select(cat)"
        class="relative px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-r border-white/5 shrink-0 select-none group"
        :class="modelValue === cat ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'"
        :aria-label="`Filter by ${cat}`"
      >
        <span class="relative z-10">{{ cat }}</span>
        <div 
          v-if="modelValue === cat"
          class="absolute bottom-0 left-0 h-1 w-full"
          :class="getCategoryColor(cat)?.badge.replace('bg-', 'bg-').replace('/10', '')"
        ></div>
      </button>
      
      <!-- Reset/All Button -->
      <button 
        @click="emit('update:modelValue', null)"
        class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shrink-0 select-none bg-white/5 hover:bg-white/10"
        v-if="modelValue"
        aria-label="Clear Filter"
      >
        ✕
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
