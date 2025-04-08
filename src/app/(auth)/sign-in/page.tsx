"use client"

import { type SignInInput, signInSchema } from "~/constants/types"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { FormAnimationWrapper } from "~/components/share/form-animation-wrapper"
import { Input } from "~/components/ui/input"
import Link from "next/link"
import { PromptifyLogo } from "~/components/share/promptify-logo"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

export default function SignIn() {
  const router = useRouter()
  const [error, setError] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    try {
      setError("");
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <PromptifyLogo className="h-8 w-auto" />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4">
        <FormAnimationWrapper>
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-3xl font-bold text-center">Sign in to Promtify</h1>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="mb-8 flex w-full items-center justify-center gap-2 rounded-md border-2 border-blue-600 bg-white text-blue-600 font-medium px-4 py-3 text-md hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-blue-600 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              Log in with Google
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">or</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  className={`w-full h-12 bg-gray-50 ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  className={`w-full h-12 bg-gray-50 ${errors.password ? "border-red-500" : ""}`}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-4">
                It must be a combination of minimum 8 letters, numbers, and symbols.
              </p>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    checked={false}
                    onCheckedChange={(checked) => { console.log(checked) }}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="remember-me" className="text-sm">
                    Remember me
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-md text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Log In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm">No account? </span>
              <Link href="/sign-up" className="text-sm text-blue-600 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </FormAnimationWrapper>
      </div>
    </div>
  )
}

