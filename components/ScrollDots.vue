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
    </div>

    <div class="flex flex-col items-center gap-1 mt-4">
      <span class="font-mono text-[11px] font-bold text-[#00F0FF] tabular-nums">
        {{ String(active + 1).padStart(2, '0') }}
      </span>
      <div class="w-2 h-[1px] bg-white/10"></div>
      <span class="font-mono text-[11px] text-white/20 tabular-nums">
        {{ String(total).padStart(2, '0') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.vertical-text {
  writing-mode: vertical-rl;
}
</style>
