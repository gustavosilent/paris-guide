<script setup lang="ts">
import type { Tip, KeywordHighlight } from '~/types'
import { getCategoryColor } from '~/utils/colors'
import { parseDescription } from '~/utils/text-parser'

const props = defineProps<{
  tip: Tip
  index: number
}>()

const store = useTipsStore()
const { voteTip } = store

// Helper to handle text rendering with highlights
// We split the description by highlights.
// This is a simplified approach. For complex HTML nesting, a library might be needed.
// But assuming description is flat HTML or text with bold tags.
// We remove HTML tags for the split logic if we want to be safe, or we try to match text.
// Given strict JSON input, we can try to find the keyword and replace it.

const segments = computed(() => {
  return parseDescription(props.tip.description, props.tip.highlights)
})

  const isVoted = computed(() => store.votedTips.has(props.tip.id))

  const toggleVote = () => {
    if (isVoted.value) {
      voteTip(props.tip.id, -1)
      props.tip.votes = (props.tip.votes || 0) - 1 // Optimistic
    } else {
      voteTip(props.tip.id, 1)
      props.tip.votes = (props.tip.votes || 0) + 1 // Optimistic
    }
  }

  const colors = computed(() => getCategoryColor(props.tip.category))

  const cardRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    
    if (cardRef.value) {
      observer.observe(cardRef.value)
    }
  })

  // Parallax Tilt Effect
  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -5 // Max 5 deg rotation
    const rotateY = ((x - centerX) / centerX) * 5

    cardRef.value.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.value) return
    cardRef.value.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }
</script>

<template>
  <div class="h-screen w-full flex items-center justify-center p-6 snap-start shrink-0 relative overflow-hidden">
    <!-- Background element (could be dynamic color/image) -->
    <div class="absolute inset-0 -z-10 opacity-10 bg-gradient-to-br from-primary-500/20 to-gray-500/20"></div>
    
    <div 
      ref="cardRef"
      class="w-full max-w-4xl backdrop-blur-3xl bg-black/30 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/10 shadow-2xl flex flex-col gap-6 md:gap-10 transition-all duration-500 ease-out perspective-1000"
      :class="[
        colors?.glow,
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'
      ]"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      
      <div class="flex justify-between items-start">
        <div class="flex-1 pr-8">
          <div class="mb-4 overflow-hidden">
            <span 
              class="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-inner backdrop-blur-md transition-all duration-500 delay-75 transform"
              :class="[
                colors?.badge,
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              ]"
            >
              {{ tip.category }}
            </span>
          </div>
          <h2 
            class="text-4xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r leading-tight transition-all duration-500 delay-100 transform"
            :class="[
              colors?.gradient,
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            ]"
          >
            {{ tip.title }}
          </h2>
        </div>
        <div 
          class="flex flex-col items-center rounded-full p-3 transition-all duration-500 delay-150 transform"
          :class="isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'"
        >
          <UButton 
            :icon="isVoted ? 'i-heroicons-star-solid' : 'i-heroicons-star'" 
            variant="ghost" 
            :color="isVoted ? 'yellow' : 'white'" 
            size="xl" 
            @click="toggleVote" 
            class="hover:bg-white/20 rounded-full transition-colors duration-300" 
            disabled
          />
          <span 
             class="text-sm font-bold transition-colors duration-300"
             :class="isVoted ? 'text-yellow-400' : 'text-gray-400'"
          >
            {{ tip.votes || 0 }}
          </span>
        </div>
      </div>

      <div 
        class="text-lg md:text-3xl font-light leading-relaxed text-gray-300 tracking-wide transition-all duration-500 delay-200 transform"
        :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
      >
        <template v-for="(seg, i) in segments" :key="i">
          <KeywordPopup v-if="seg.type === 'highlight' && seg.info" :text="seg.content" :info="seg.info" />
          <span v-else-if="seg.type === 'bold'" class="text-yellow-200 font-semibold drop-shadow-sm px-1">{{ seg.content }}</span>
          <span v-else-if="seg.type === 'italic'" class="italic text-gray-200 font-serif opacity-90">{{ seg.content }}</span>
          <span v-else v-html="seg.content"></span>
        </template>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* Optional specific styles */
</style>
