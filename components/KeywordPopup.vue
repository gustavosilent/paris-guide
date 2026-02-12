<script setup lang="ts">
const props = defineProps<{
  text: string
  info: string
  color?: string
}>()
</script>

<template>
  <UPopover mode="click" :popper="{ placement: 'top-start', offsetDistance: 0 }" class="inline-block">
    <button 
      class="font-black text-white cursor-pointer border-b-2 border-white/20 active:scale-95 transition-all duration-300 inline uppercase text-xs tracking-widest px-1"
      :style="{ color: color + 'CC', borderBottomColor: (color || '#fff') + '44' }"
      @mouseenter="$el.style.color = color; $el.style.borderBottomColor = color"
      @mouseleave="$el.style.color = color + 'CC'; $el.style.borderBottomColor = (color || '#fff') + '44'"
    >
      {{ text }}
    </button>

    <template #panel>
      <div 
        class="px-6 py-4 max-w-xs sm:max-w-sm text-xs font-black tracking-widest uppercase text-white bg-black border shadow-[20px_20px_50px_rgba(0,0,0,0.5)]"
        :style="{ borderColor: (color || '#fff') + '33' }"
      >
        <div class="mb-2 w-1 h-3" :style="{ backgroundColor: color }"></div>
        {{ info }}
      </div>
    </template>
  </UPopover>
</template>
