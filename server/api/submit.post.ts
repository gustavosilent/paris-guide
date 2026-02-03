import { z } from 'zod'
import { addTip } from '~/server/utils/db'
import { sendEmail } from '~/server/utils/email'

const submitSchema = z.object({
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
    const result = submitSchema.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid input',
            data: result.error.errors
        })
    }

    const { title, description, category, email, highlights, lang } = result.data

    const newTip = addTip({
        title,
        description,
        category,
        email,
        highlights
    }, lang)

    const emailTemplates = {
        ptbr: {
            subject: 'Dica Recebida! - Paris Guide',
            body: `Olá!\n\nRecebemos sua dica "${title}".\nStatus atual: PENDING.\n\nID para referência: ${newTip.id}\n\nVocê será notificado quando/se ela for aprovada.\n\nMerci!`
        },
        en: {
            subject: 'Tip Received! - Paris Guide',
            body: `Hello!\n\nWe received your tip "${title}".\nCurrent status: PENDING.\n\nReference ID: ${newTip.id}\n\nYou will be notified when/if it is approved.\n\nMerci!`
        }
    }
    const template = emailTemplates[lang as keyof typeof emailTemplates] || emailTemplates.ptbr
    await sendEmail(email, template.subject, template.body)

    return { success: true, id: newTip.id }
})
