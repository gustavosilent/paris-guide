import { z } from 'zod'
import { deleteTip } from '~/server/utils/db'

const deleteSchema = z.object({
    id: z.string(),
    lang: z.string().optional().default('ptbr')
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = await deleteSchema.safeParseAsync(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid input'
        })
    }

    const { id, lang } = result.data
    const success = deleteTip(id, lang)

    if (!success) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Tip not found'
        })
    }

    return { success: true }
})
