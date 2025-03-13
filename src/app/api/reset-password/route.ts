import { db } from "~/server/db"
import { resetPasswordSchema } from "~/lib/validations/auth"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json() as { newPassword: string, token: string }
    
    try {
      const { newPassword, token } = resetPasswordSchema.parse(body)

      if (!token) {
        return NextResponse.json(
          { message: "Invalid token" },
          { status: 400 }
        )
      }

      // Find user with valid reset token that hasn't expired
      const user = await db.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      })

      if (!user) {
        return NextResponse.json(
          { message: "Invalid or expired reset token. Please request a new password reset." },
          { status: 400 }
        )
      }

      const hashedPassword = await hash(newPassword, 12)

      // Update password and clear reset token
      await db.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      })

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      )
    } catch (error) {
      console.error("Validation error:", error)
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 