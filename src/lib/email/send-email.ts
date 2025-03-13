import { Resend } from 'resend'
import { EmailTemplate } from '~/components/auth/EmailTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendResetPasswordEmail(
  email: string,
  resetUrl: string,
  name: string
) {
  try {
    console.log("Sending email to:", email)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password for Promptify',
      react: EmailTemplate({ name, resetUrl })
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}