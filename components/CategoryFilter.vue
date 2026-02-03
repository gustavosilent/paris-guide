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
    class="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform duration-300"
    :class="visible === false ? '-translate-y-24 md:translate-y-0' : 'translate-y-0'"
  >
    <div class="flex gap-2 p-2 px-4 md:px-2 bg-black/40 md:bg-black/20 backdrop-blur-2xl border border-white/5 md:border-white/5 border-b-white/10 rounded-b-2xl md:rounded-full shadow-2xl pointer-events-auto overflow-x-auto max-w-full md:max-w-[90vw] w-full md:w-auto no-scrollbar items-center justify-start md:justify-center">
      <UButton 
        v-for="cat in categories" 
        :key="cat"
        :label="cat" 
        :color="modelValue === cat ? 'white' : 'white'" 
        :variant="modelValue === cat ? 'solid' : 'ghost'" 
        size="xs"
        class="capitalize shrink-0 rounded-full transition-all duration-300 border border-transparent select-none md:text-sm"
        :class="modelValue === cat 
           ? [getCategoryColor(cat)?.badge.replace('bg-', 'bg-').replace('/20', '/30'), getCategoryColor(cat)?.glow, 'scale-105 border-white/40 font-bold px-4 py-1.5 shadow-lg backdrop-blur-md'] 
           : 'text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5'"
        @click="select(cat)"
      />
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
