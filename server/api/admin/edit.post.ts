import { z } from 'zod'
import { updateTip } from '~/server/utils/db'

const editSchema = z.object({
    id: z.string(),
    title: z.string().min(5),
    description: z.string().min(20),
    category: z.string(),
    email: z.string().email(),
    highlights: z.array(z.object({
        keyword: z.string().min(1),
        info: z.string().min(5)
    })).default([]),
    lang: z.string().optional().default('ptbr')
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = await editSchema.safeParseAsync(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid input',
            data: result.error.errors
        })
    }

    const { id, lang, ...updates } = result.data
    const updated = updateTip(id, updates, lang)

    if (!updated) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Tip not found'
        })
    }

    return { success: true, tip: updated }
})
