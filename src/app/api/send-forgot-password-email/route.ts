import { NextResponse } from "next/server"
import { db } from "~/server/db"
import { randomBytes } from "crypto"
import { sendResetPasswordEmail } from "~/lib/email/send-email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email: string }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "This email is not registered. Please sign up first." },
        { status: 400 }
      )
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    await db.user.update({
      where: { email },
      data: { 
        resetToken,
        resetTokenExpiry,
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    const emailResult = await sendResetPasswordEmail(
      email,
      resetUrl,
      user.name ?? 'User'
    )

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error)
      return NextResponse.json(
        { message: "Failed to send password reset email" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "If an account exists, you will receive an email with instructions" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}