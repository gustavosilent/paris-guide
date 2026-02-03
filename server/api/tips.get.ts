
import { getTips } from '~/server/utils/db'
import { getQuery, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const isAdmin = query.admin === 'true' // Simple admin check for now
    const lang = (query.lang as string) || 'ptbr' // Default to Portuguese

    const data = getTips(lang)

    if (isAdmin) {
        // Admin sees all or filtering by status
        return { tips: data.tips }
    }

    // Public only sees approved
    return {
        tips: data.tips.filter(t => t.status !== 'pending' && t.status !== 'rejected')
    }
})
