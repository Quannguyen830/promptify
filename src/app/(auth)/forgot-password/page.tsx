"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { PromptifyLogo } from "~/components/share/promptify-logo"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log({ email })
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-xl">
        <div className="mb-16">
          <PromptifyLogo />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="mb-2 text-3xl font-bold text-center">Reset Password</h1>

          <p className="text-center text-gray-600 mb-6">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-gray-50"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
                Send Reset Instructions
              </Button>
            </form>
          ) : (
            <div className="w-full text-center p-6 bg-green-50 rounded-lg border border-green-200 mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">Check your email</h3>
              <p className="text-green-700">We&apos;ve sent password reset instructions to {email}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/sign-in" className="text-sm text-blue-600 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

