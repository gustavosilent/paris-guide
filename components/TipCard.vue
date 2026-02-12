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
  <div class="h-screen w-full flex items-center justify-center p-4 md:p-12 snap-start shrink-0 relative overflow-hidden">
    
    <div 
      ref="cardRef"
      class="w-full max-w-[1400px] h-full flex flex-col md:grid md:grid-cols-12 gap-0 transition-all duration-700 ease-out"
      :class="[
        isVisible ? 'opacity-100' : 'opacity-0'
      ]"
    >
      <!-- Left Column: High-Impact Title & Category -->
      <div class="md:col-span-7 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-12 bg-black/20">
        <div class="mb-8 overflow-hidden">
          <span 
            class="inline-block px-0 py-1 text-xs font-black uppercase tracking-[0.3em] transition-all duration-700 delay-100 transform border-b-2"
            :class="[
              colors?.badge.replace('bg-', 'text-').replace('/10', '').replace('text-', 'border-'),
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            ]"
          >
            {{ tip.category }}
          </span>
        </div>
        
        <h2 
          class="text-5xl md:text-[10rem] font-black tracking-[calc(-0.05em)] leading-[0.85] uppercase transition-all duration-700 delay-200 transform"
          :class="[
            colors?.gradient,
            'text-transparent bg-clip-text bg-gradient-to-br',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          ]"
        >
          {{ tip.title }}
        </h2>

        <!-- Action Section (Floating in the asymmetric grid) -->
        <div 
          class="mt-12 flex items-center gap-6 transition-all duration-700 delay-500 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
        >
          <div class="flex flex-col items-center">
            <button 
              @click="toggleVote"
              class="group/btn flex items-center justify-center w-24 h-24 border border-white transition-all duration-300 hover:bg-white hover:text-black"
              :aria-label="isVoted ? 'Remove Star' : 'Add Star'"
            >
              <UIcon 
                :name="isVoted ? 'i-heroicons-star-solid' : 'i-heroicons-star'" 
                class="w-8 h-8 transition-transform duration-500 group-hover/btn:scale-125"
                :class="isVoted ? 'text-yellow-400' : 'text-white'"
              />
            </button>
            <span class="mt-2 text-[10px] font-black tracking-widest uppercase opacity-40">Stars</span>
          </div>
          <div class="text-4xl font-black tabular-nums opacity-20 border-l border-white/10 pl-6 h-full flex items-center">
            {{ String(tip.votes || 0).padStart(2, '0') }}
          </div>
        </div>
      </div>

      <!-- Right Column: Description -->
      <div class="md:col-span-5 flex flex-col justify-end p-6 md:p-12 bg-white/[0.02]">
        <div 
          class="text-xl md:text-3xl font-medium leading-[1.4] text-gray-400 tracking-tight transition-all duration-700 delay-300 transform max-w-xl self-end text-right"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'"
        >
          <template v-for="(seg, i) in segments" :key="i">
            <KeywordPopup v-if="seg.type === 'highlight' && seg.info" :text="seg.content" :info="seg.info" />
            <span v-else-if="seg.type === 'bold'" class="text-white font-black underline decoration-[3px] decoration-primary-500 underline-offset-4 px-1">{{ seg.content }}</span>
            <span v-else-if="seg.type === 'italic'" class="italic text-gray-200 font-serif opacity-90">{{ seg.content }}</span>
            <span v-else v-html="seg.content"></span>
          </template>
        </div>
        
        <!-- Decorative Index -->
        <div 
          class="mt-12 text-[12rem] font-black leading-none opacity-[0.03] select-none pointer-events-none absolute -bottom-12 -right-12 transition-all duration-1000"
          :class="isVisible ? 'translate-y-0 opacity-5' : 'translate-y-20 opacity-0'"
        >
          {{ String(index + 1).padStart(2, '0') }}
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* Optional specific styles */
</style>
