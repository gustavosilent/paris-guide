<script setup lang="ts">
import { useTipsStore } from '~/stores/tips'

const store = useTipsStore()
const { sortedTips, isLoading } = storeToRefs(store)
const { fetchTips } = store

const activeCategory = ref<string | null>(null)
const activeIndex = ref(0)
const scrollContainer = ref<HTMLElement | null>(null)
const showControls = ref(true)
const lastScrollTop = ref(0)

// Computed filtered tips
const displayedTips = computed(() => {
  if (!activeCategory.value) return sortedTips.value
  return sortedTips.value.filter(t => t.category === activeCategory.value)
})

// Categories from data or fixed list
const categories = ['FOOD', 'TRANSPORTATION', 'CULTURE', 'SAFETY', 'CITY']

// Scroll handling
const handleScroll = () => {
  if (!scrollContainer.value) return
  const h = window.innerHeight
  const scrollTop = scrollContainer.value.scrollTop
  const index = Math.round(scrollTop / h)
  if (activeIndex.value !== index) {
    activeIndex.value = index
  }
  
  const currentScroll = scrollContainer.value.scrollTop
  if (currentScroll > lastScrollTop.value && currentScroll > 100) {
      showControls.value = false
  } else {
      showControls.value = true
  }
  lastScrollTop.value = currentScroll
}

const scrollTo = (index: number) => {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollTo({
    top: index * window.innerHeight,
    behavior: 'smooth'
  })
}

watch(activeCategory, () => {
  scrollTo(0)
})

const isSubmissionOpen = ref(false)

const { data, error } = await useAsyncData('tips', () => fetchTips())

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden">
    <CategoryFilter 
      :categories="categories" 
      v-model="activeCategory" 
      :visible="showControls"
    />

    <!-- Scroll Container -->
    <div 
      ref="scrollContainer"
      class="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      <div v-if="isLoading" class="h-screen w-full flex items-center justify-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-10 h-10 text-primary-500" />
      </div>

      <template v-else>
        <TipCard 
          v-for="(tip, index) in displayedTips" 
          :key="tip.id" 
          :tip="tip" 
          :index="index"
        />
        
        <!-- Empty State -->
        <div v-if="displayedTips.length === 0" class="h-screen flex items-center justify-center snap-start">
           <p class="text-xl text-gray-500">Nenhuma dica encontrada nesta categoria.</p>
        </div>
      </template>
    </div>

    <!-- Navigation Dots -->
    <ScrollDots 
      v-if="displayedTips.length > 0"
      :total="displayedTips.length" 
      :active="activeIndex" 
      @scroll-to="scrollTo" 
    />

    <!-- Bottom Controls -->
    <PageControls v-model="isSubmissionOpen" />

    <SubmissionForm v-model="isSubmissionOpen" />
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  display: none;
}
div {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
