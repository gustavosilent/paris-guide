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
}

export interface TipsResponse {
    tips: Tip[]
}
