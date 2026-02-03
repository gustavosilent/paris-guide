import { getTips } from '~/server/utils/db'

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const lang = (query.lang as string) || 'ptbr'
    const { tips } = getTips(lang)
    return tips
})
