<script setup lang="ts">
const props = defineProps<{
  text: string
  info: string
}>()
</script>

<template>
  <UPopover mode="click" :popper="{ placement: 'top-start', offsetDistance: 0 }" class="inline-block">
    <button class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 cursor-pointer border-b-2 border-dashed border-pink-500/30 hover:border-pink-400 active:scale-95 transition-all duration-300 inline">
      {{ text }}
    </button>

    <template #panel>
      <div class="px-4 py-3 max-w-xs sm:max-w-sm text-sm font-medium text-white  shadow-2xl rounded-xl">
        {{ info }}
      </div>
    </template>
  </UPopover>
</template>
