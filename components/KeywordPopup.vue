<script setup lang="ts">
const props = defineProps<{
  text: string
  info: string
}>()
</script>

<template>
  <UPopover mode="click" :popper="{ placement: 'top-start', offsetDistance: 0 }" class="inline-block">
    <button class="font-black text-white hover:text-[#FF4D00] cursor-pointer border-b-2 border-white/20 hover:border-[#FF4D00] active:scale-95 transition-all duration-300 inline uppercase text-xs tracking-widest px-1">
      {{ text }}
    </button>

    <template #panel>
      <div class="px-6 py-4 max-w-xs sm:max-w-sm text-xs font-black tracking-widest uppercase text-white bg-black border border-white/20 shadow-[20px_20px_50px_rgba(0,0,0,0.5)]">
        {{ info }}
      </div>
    </template>
  </UPopover>
</template>
