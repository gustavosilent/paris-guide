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
  <!-- Desktop Dots (Sliding Window) -->
  <div class="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 items-center w-4">
    <div 
      v-for="dot in visibleDots" 
      :key="dot.index"
      @click="emit('scrollTo', dot.index)"
      class="rounded-full transition-all duration-300 cursor-pointer"
      :class="[
        dot.active ? 'w-4 h-4 bg-primary-500 scale-110' : 'w-2 h-2 bg-gray-500 hover:bg-gray-300',
        dot.small ? 'opacity-50 scale-75' : 'opacity-100'
      ]"
      :aria-label="`Go to tip ${dot.index + 1}`"
    ></div>
  </div>

  <!-- Mobile Counter -->
  <div class="fixed top-6 right-6 z-40 flex md:hidden pointer-events-none">
    <div class="px-3 py-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white/60 font-medium text-xs shadow-xl">
      {{ active + 1 }} / {{ total }}
    </div>
  </div>
</template>
