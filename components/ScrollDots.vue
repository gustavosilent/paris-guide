<script setup lang="ts">
const props = defineProps<{
  total: number
  active: number
}>()

const emit = defineEmits<{
  (e: 'scrollTo', index: number): void
}>()

const visibleDots = computed(() => {
  const range = 3 // Dots before and after
  const dots = []
  
  for (let i = -range; i <= range; i++) {
    const targetIndex = props.active + i
    if (targetIndex >= 0 && targetIndex < props.total) {
      dots.push({
        index: targetIndex,
        active: targetIndex === props.active,
        small: Math.abs(i) === range // Check if it's an edge dot
      })
    }
  }
  return dots
})
</script>

<template>
  <!-- Desktop Indicators (Technical Bars) -->
  <div class="fixed right-0 top-0 bottom-0 z-40 hidden md:flex flex-col w-[1px] bg-white/5">
    <div 
      v-for="i in total" 
      :key="i-1"
      @click="emit('scrollTo', i-1)"
      class="flex-1 transition-all duration-500 cursor-pointer relative group border-b border-white/5"
      :class="active === i-1 ? 'bg-white/10' : 'hover:bg-white/[0.02]'"
    >
      <div 
        v-if="active === i-1"
        class="absolute right-0 top-0 bottom-0 w-1 bg-white"
      ></div>
      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black tracking-widest opacity-0 group-hover:opacity-20 transition-opacity">
        {{ String(i).padStart(2, '0') }}
      </span>
    </div>
  </div>

  <!-- Mobile Counter -->
  <div class="fixed top-20 right-0 z-40 flex md:hidden pointer-events-none">
    <div class="px-4 py-2 bg-black border border-white/10 text-white font-black text-[10px] tracking-widest uppercase shadow-2xl">
      {{ active + 1 }} / {{ total }}
    </div>
  </div>
</template>
