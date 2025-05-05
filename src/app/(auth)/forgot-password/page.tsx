"use client"

import { Button } from "~/components/ui/button"
import { forgotPasswordSchema, type ForgotPasswordInput } from "~/constants/types"
import { FormAnimationWrapper } from "~/components/share/form-animation-wrapper"
import { Input } from "~/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<{ email?: string }>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/send-forgot-password-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json() as { message: string | undefined }

      if (result.message) {
        setError({ email: result.message })
      }

      setEmail(data.email)
      setIsSubmitted(true)
    } catch (error) {
      setError({ email: error instanceof Error ? error.message : "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormAnimationWrapper>
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-3xl font-bold text-center">Reset Password</h1>

        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full h-12 bg-gray-50"
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              {error.email && (
                <p className="text-red-500 text-sm">{error.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
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
    </FormAnimationWrapper>
  )
}

