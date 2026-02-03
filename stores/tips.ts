import { defineStore } from 'pinia'
import type { Tip, TipsResponse } from '~/types'


export const useTipsStore = defineStore('tips', () => {
    const tips = ref<Tip[]>([])
    const isLoading = ref(false)
    const language = ref<'ptbr' | 'en'>('ptbr')

    // Initialize language from localStorage
    if (process.client) {
        const stored = localStorage.getItem('language')
        if (stored === 'en' || stored === 'ptbr') {
            language.value = stored
        }
    }

    const setLanguage = async (lang: 'ptbr' | 'en') => {
        language.value = lang
        if (process.client) {
            localStorage.setItem('language', lang)
        }
        await fetchTips() // Reload tips in new language
    }

    const fetchTips = async () => {
        isLoading.value = true
        try {
            const data = await $fetch<TipsResponse>(`/api/tips?lang=${language.value || 'ptbr'}`)
            if (data) {
                tips.value = data.tips
            }
        } catch (error) {
            console.error('Failed to fetch tips:', error)
        } finally {
            isLoading.value = false
        }
    }

    const sortMode = ref<'relevant' | 'random'>('relevant')
    const randomOrder = ref<string[]>([])

    const shuffle = () => {
        randomOrder.value = [...tips.value].sort(() => Math.random() - 0.5).map(t => t.id)
        sortMode.value = 'random'
    }

    const sortedTips = computed(() => {
        if (sortMode.value === 'random' && randomOrder.value.length > 0) {
            return randomOrder.value.map(id => tips.value.find(t => t.id === id)).filter(Boolean) as Tip[]
        }
        return [...tips.value].sort((a, b) => b.votes - a.votes)
    })

    const votedTips = ref<Set<string>>(new Set())

    const initVotes = () => {
        if (process.client) {
            const stored = localStorage.getItem('votedTips')
            if (stored) {
                votedTips.value = new Set(JSON.parse(stored))
            }
        }
    }

    const voteTip = async (id: string, delta: number) => {
        if (delta === 1 && votedTips.value.has(id)) return
        if (delta === -1 && !votedTips.value.has(id)) return

        const tip = tips.value.find(t => t.id === id)
        if (tip) {
            tip.votes += delta

            if (delta === 1) votedTips.value.add(id)
            else votedTips.value.delete(id)

            if (process.client) {
                localStorage.setItem('votedTips', JSON.stringify([...votedTips.value]))
            }

            try {
                const { votes } = await $fetch<{ votes: number }>('/api/vote', {
                    method: 'POST',
                    body: { id, delta, lang: language.value }
                })
                tip.votes = votes
            } catch (err) {
                console.error('Vote failed', err)
                tip.votes -= delta
                if (delta === 1) votedTips.value.delete(id)
                else votedTips.value.add(id)
            }
        }
    }

    if (process.client) {
        initVotes()
    }

    return {
        tips,
        isLoading,
        fetchTips,
        sortedTips,
        sortMode,
        shuffle,
        voteTip,
        votedTips,
        language,
        setLanguage
    }
})
