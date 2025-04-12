"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { type SignUpInput, signUpSchema } from "~/constants/types"

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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: SignUpInput) => {
    try {
      setError("")
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json() as { message: string }
        setError(errorData.message || "Registration failed")
        return
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Failed to sign in after registration")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      setError("An unexpected error occurred")
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
            <h1 className="mb-8 text-3xl font-bold text-center">Sign Up to Promtify</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              {error && (
                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    className={`w-full h-12 bg-gray-50 ${errors.firstName ? "border-red-500" : ""}`}
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    className={`w-full h-12 bg-gray-50 ${errors.lastName ? "border-red-500" : ""}`}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`w-full h-12 bg-gray-50 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center mb-6">
                <Checkbox
                  id="acceptTerms"
                  checked={watch("acceptTerms")}
                  onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
                  className={`mr-2 h-4 w-4 ${errors.acceptTerms ? "border-red-500" : ""}`}
                />
                <label htmlFor="acceptTerms" className="text-sm">
                  Accept terms and conditions
                </label>
                {errors.acceptTerms && (
                  <p className="ml-2 text-xs text-red-500">{errors.acceptTerms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-2 rounded-md border-2 border-blue-600 bg-white px-4 py-3 text-md font-medium hover:bg-gray-50 text-blue-600"
            >
              <svg className="h-5 w-5 text-blue-600 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              Sign up with Google
            </button>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link href="/sign-in" className="text-sm text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </FormAnimationWrapper>
      </div>
    </div>
  )
}

