
import { updateTipVotes } from '~/server/utils/db'
import { z } from 'zod'

const voteSchema = z.object({
    id: z.string(),
    delta: z.number().int().min(-1).max(1),
    lang: z.string().optional().default('ptbr')
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = voteSchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid vote data'
        })
    }

    const { id, delta, lang } = result.data
    const newVotes = updateTipVotes(id, delta, lang)

    if (newVotes === null) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Tip not found'
        })
    }

    return { votes: newVotes }
})
