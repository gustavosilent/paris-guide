import { getTips } from '~/server/utils/db'

export default defineEventHandler((event) => {
    const { tips } = getTips()
    return tips.filter(t => t.status === 'pending')
})
