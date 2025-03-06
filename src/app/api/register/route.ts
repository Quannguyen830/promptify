import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { db } from "~/server/db"

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json() as { email: string, password: string, firstName: string, lastName: string }

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      },
    })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}