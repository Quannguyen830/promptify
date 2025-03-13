"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { PromptifyLogo } from "~/components/share/promptify-logo"
import { resetPasswordSchema } from "~/lib/validations/auth"
import type { ResetPasswordInput } from "~/lib/validations/auth"
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    console.log("Form submitted with data:", data);
    try {
      console.log("onSubmit", data)
      setError(null)

      if (!token) {
        throw new Error("Reset token is missing")
      }

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          token,
        }),
      })

      const result = await response.json() as { message: string | undefined }

      if (!response.ok) {
        setError(result.message ?? "Failed to reset password")
        return
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Reset password error:", error)
      setError("Something went wrong. Please try again.")
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
          <Button asChild>
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <PromptifyLogo className="h-8 w-auto" />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <h1 className="mb-8 text-3xl font-bold text-center">Create New Password</h1>

          {!isSubmitted ? (
            <>
              <p className="text-center text-gray-600 mb-6">
                Your new password must be different from previously used passwords.
              </p>

              {error && (
                <div className="mb-6 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block mb-2 text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full h-12 bg-gray-50 pr-10"
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.
                  </p>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full h-12 bg-gray-50 pr-10"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="w-full text-center p-6 bg-green-50 rounded-lg border border-green-200 mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">Password Reset Successful!</h3>
              <p className="text-green-700 mb-4">Your password has been successfully reset.</p>
              <Button
                onClick={() => router.push("/sign-in")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In with New Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

