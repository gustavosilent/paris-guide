import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'demetrius.wyman26@ethereal.email', // Placeholder, creates fresh on startup if needed or uses fixed for dev
        pass: 'j8Kx1X2Y3Z4' // Placeholder
    }
});

// We'll create a test account dynamically if needed, or better, just log the preview URL
// For this demo, let's create a test account on the fly if we want, but that's slow.
// Hardcoding a real Ethereal account is safer for persistence, but for an agent run, dynamic is safest.

let readyTransporter: any = null

const initMailer = async () => {
    if (readyTransporter) return readyTransporter

    const testAccount = await nodemailer.createTestAccount()
    console.log('Ethereal Account Created:', testAccount.user, testAccount.pass)

    readyTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })
    return readyTransporter
}

export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailer = await initMailer()
    const info = await mailer.sendMail({
        from: '"Paris Guide Admin" <admin@parisguide.local>',
        to,
        subject,
        text
    })

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    return nodemailer.getTestMessageUrl(info)
}
