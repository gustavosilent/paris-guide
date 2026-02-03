export interface KeywordHighlight {
    keyword: string
    info: string
}

export interface Tip {
    id: string
    title: string
    description: string
    category: string
    votes: number
    highlights: KeywordHighlight[]
    status?: 'pending' | 'approved' | 'rejected'  // Optional for client-side only
}

export interface TipsResponse {
    tips: Tip[]
}
