import { z } from 'zod'
import { updateTipStatus } from '~/server/utils/db'
import { sendEmail } from '~/server/utils/email'

const actionSchema = z.object({
    id: z.string(),
    status: z.enum(['approved', 'rejected']),
    lang: z.string().optional().default('ptbr')
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const result = actionSchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid input'
        })
    }

    const { id, status, lang } = result.data
    const updatedTip = updateTipStatus(id, status, lang)

    if (!updatedTip) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Tip not found'
        })
    }

    if (updatedTip.email) {
        const emailTemplates = {
            ptbr: {
                subject: `Atualização da sua Dica: ${updatedTip.title}`,
                body: `Olá!\n\nSua dica "${updatedTip.title}" foi atualizada para o status: ${status.toUpperCase()}.\n\n${status === 'approved' ? 'Ela já está visível para todos os visitantes!' : 'Infelizmente ela não foi aceita desta vez.'}\n\nMerci!`
            },
            en: {
                subject: `Tip Update: ${updatedTip.title}`,
                body: `Hello!\n\nYour tip "${updatedTip.title}" has been updated to status: ${status.toUpperCase()}.\n\n${status === 'approved' ? 'It\'s now visible to all visitors!' : 'Unfortunately it was not accepted this time.'}\n\nMerci!`
            }
        }
        const template = emailTemplates[lang as keyof typeof emailTemplates] || emailTemplates.ptbr
        await sendEmail(updatedTip.email, template.subject, template.body)
    }

    return { success: true, tip: updatedTip }
})
