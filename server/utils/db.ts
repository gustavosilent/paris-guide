import fs from 'node:fs'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'

const getDBPath = (lang: string = 'ptbr') => {
    return path.resolve(process.cwd(), `data/tips-${lang}.json`)
}

import type { KeywordHighlight } from '~/types'

export interface Tip {
    id: string
    title: string
    category: string
    description: string
    votes: number
    highlights: KeywordHighlight[]
    status: 'pending' | 'approved' | 'rejected'
    email?: string // Private field
}

export const getTips = (lang: string = 'ptbr'): { tips: Tip[] } => {
    const DB_PATH = getDBPath(lang)
    if (!fs.existsSync(DB_PATH)) {
        return { tips: [] }
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(content)
}

export const saveTips = (tips: Tip[], lang: string = 'ptbr') => {
    const DB_PATH = getDBPath(lang)
    fs.writeFileSync(DB_PATH, JSON.stringify({ tips }, null, 2))
}

export const addTip = (tip: Omit<Tip, 'id' | 'votes' | 'status'>, lang: string = 'ptbr') => {
    const data = getTips(lang)
    const newTip: Tip = {
        ...tip,
        id: uuidv4(),
        votes: 0,
        status: 'pending' // Default status
    }
    data.tips.push(newTip)
    saveTips(data.tips, lang)
    return newTip
}

export const updateTipStatus = (id: string, status: 'approved' | 'rejected', lang: string = 'ptbr') => {
    const data = getTips(lang)
    const tip = data.tips.find(t => t.id === id)
    if (tip) {
        tip.status = status
        saveTips(data.tips, lang)
        return tip
    }
    return null
}

export const updateTipVotes = (id: string, delta: number, lang: string = 'ptbr') => {
    const data = getTips(lang)
    const tip = data.tips.find(t => t.id === id)
    if (tip) {
        tip.votes = (tip.votes || 0) + delta
        saveTips(data.tips, lang)
        return tip.votes
    }
    return null
}

export const deleteTip = (id: string, lang: string = 'ptbr') => {
    const data = getTips(lang)
    const initialLength = data.tips.length
    data.tips = data.tips.filter(t => t.id !== id)
    if (data.tips.length !== initialLength) {
        saveTips(data.tips, lang)
        return true
    }
    return false
}

export const updateTip = (id: string, updates: Partial<Tip>, lang: string = 'ptbr') => {
    const data = getTips(lang)
    const tip = data.tips.find(t => t.id === id)
    if (tip) {
        Object.assign(tip, updates)
        saveTips(data.tips, lang)
        return tip
    }
    return null
}
