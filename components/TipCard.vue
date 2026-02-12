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

const isVoted = computed(() => store.votedTips.has(props.tip?.id || ''))

const toggleVote = () => {
  if (!props.tip?.id) return
  if (isVoted.value) {
    voteTip(props.tip.id, -1)
    props.tip.votes = (props.tip.votes || 0) - 1 // Optimistic
  } else {
    voteTip(props.tip.id, 1)
    props.tip.votes = (props.tip.votes || 0) + 1 // Optimistic
  }
}

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

// Smart Color Logic
const categoryColor = computed(() => getCategoryColor(props.tip?.category).color)

// Parsed description segments for highlighting
const segments = computed(() => {
  const text = props.tip?.description || ''
  const highlights = props.tip?.highlights || []
  
  let result: any[] = [{ type: 'text', content: text }]
  
  highlights.forEach((h: any) => {
    const newResult: any[] = []
    result.forEach(item => {
      if (item.type === 'text') {
        const parts = item.content.split(new RegExp(`(${h.keyword})`, 'gi'))
        parts.forEach((part: string) => {
          if (part.toLowerCase() === (h.keyword?.toLowerCase() || '')) {
            newResult.push({ type: 'highlight', content: part, info: h.info })
          } else if (part) {
            newResult.push({ type: 'text', content: part })
          }
        })
      } else {
        newResult.push(item)
      }
    })
    result = newResult
  })
  
  return result
})

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
</script>

<template>
  <div class="h-[100dvh] w-full flex items-center justify-center p-4 md:p-8 lg:p-12 snap-start shrink-0 relative bg-black/20">
    
    <div 
      ref="cardRef"
      class="w-full max-w-[1600px] h-full grid grid-cols-1 md:grid-cols-12 transition-all duration-1000 ease-out border-x border-white/5"
      :class="[
        isVisible ? 'opacity-100' : 'opacity-0'
      ]"
    >
      <!-- Meta Rail (Col 1-2) -->
      <div class="md:col-span-2 border-r border-white/10 p-6 flex flex-col justify-between items-start font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
        <div 
          class="transition-all duration-700 delay-100 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          <div class="mb-2 text-white/20">Sector</div>
          <div 
            class="font-bold tracking-[0.4em] origin-top-left rotate-90 translate-x-3 translate-y-6 whitespace-nowrap border-b pb-1 transition-colors duration-700"
            :style="{ color: categoryColor, borderColor: categoryColor }"
          >
            {{ tip.category }}
          </div>
        </div>
        <div 
          class="transition-all duration-700 delay-500 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          <div class="text-white/20 mb-1">Entry ID</div>
          <div class="text-white/60">{{ tip.id.split('-')[0] }}</div>
        </div>
      </div>

      <!-- Content Area (Col 3-10) -->
      <div class="md:col-span-8 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <div 
          class="transition-all duration-1000 delay-200 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'"
        >
          <h2 class="text-[clamp(2rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-white mb-12 max-w-4xl break-words">
            {{ tip.title }}
          </h2>
          
          <div 
            class="max-w-xl text-lg md:text-xl text-white/50 leading-relaxed font-light transition-all duration-1000 delay-400 transform"
            :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
          >
            <template v-for="(segment, i) in segments" :key="i">
              <span v-if="segment.type === 'text'">{{ segment.content }}</span>
              <KeywordPopup v-else-if="segment.type === 'highlight'" :text="segment.content" :info="segment.info!" :color="categoryColor" />
              <span v-else-if="segment.type === 'bold'" class="text-white font-bold">{{ segment.content }}</span>
              <span v-else v-html="segment.content"></span>
            </template>
          </div>
        </div>
      </div>

      <!-- Action Rail (Col 11-12) -->
      <div class="md:col-span-2 border-l border-white/10 p-6 flex flex-col justify-between items-end font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
        <div 
          class="transition-all duration-700 delay-300 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          <div class="text-white/20 mb-4 text-right">Verification</div>
          <button 
            @click="toggleVote"
            class="group/btn flex items-center justify-center w-16 h-16 border border-white/20 transition-all duration-300 active:scale-95"
            :style="{ borderColor: isVoted ? categoryColor : '' }"
            :aria-label="isVoted ? 'Remove Star' : 'Add Star'"
          >
            <UIcon 
              :name="isVoted ? 'i-heroicons-star-solid' : 'i-heroicons-star'" 
              class="w-6 h-6 transition-all duration-500"
              :style="{ color: isVoted ? categoryColor : '#fff' }"
            />
          </button>
        </div>

        <div 
          class="transition-all duration-700 delay-600 transform text-right"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
        >
          <div class="text-white/20 mb-1">Index</div>
          <div 
            class="text-4xl font-black tabular-nums transition-colors duration-1000"
            :style="{ color: isVisible ? `${categoryColor}22` : 'rgba(255,255,255,0.05)' }"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
