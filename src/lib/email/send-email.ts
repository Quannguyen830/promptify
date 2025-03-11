import { Resend } from 'resend'
import { EmailTemplate } from '~/components/auth/EmailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTemporaryPasswordEmail(
  email: string,
  temporaryPassword: string,
  name: string
) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Temporary Password',
      react: EmailTemplate({ temporaryPassword, name })
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}