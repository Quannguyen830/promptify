"use client"

import type { SignUpInput } from "~/lib/validations/auth"

import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "~/lib/validations/auth"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { PromptifyLogo } from "~/components/share/promptify-logo"
import { useState } from "react"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
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
        const errorData = await response.json() as { message: string | undefined }
        throw new Error(errorData.message ?? "Registration failed")
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Failed to sign in after registration")
      }

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-xl">
        <div className="mb-16">
          <PromptifyLogo />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="mb-12 text-3xl font-bold text-center">Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
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

          <div className="mt-6 mb-4 text-center">
            <span className="text-sm">Or sign up with:</span>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-12 border border-gray-300"
            onClick={() => {
              void signIn("google", {
                callbackUrl: "/dashboard",
              })
            }}
          >
            <Image src="/icon/google.svg" alt="Google" width={20} height={20} />
            Sign up with Google
          </Button>

          <div className="mt-6 text-center">
            <span className="text-sm">Already have an account? </span>
            <Link href="/sign-in" className="text-sm text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

