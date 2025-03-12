import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { db } from "~/server/db"
import { generateTemporaryPassword } from "~/lib/email/generate-password"
import { sendTemporaryPasswordEmail } from "~/lib/email/send-email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email: string }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, you will receive an email with instructions" },
        { status: 200 }
      )
    }

    const temporaryPassword = generateTemporaryPassword(12);
    const hashedPassword = await hash(temporaryPassword, 12)

    await db.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
      },
    })

    const emailResult = await sendTemporaryPasswordEmail(
      email,
      temporaryPassword,
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