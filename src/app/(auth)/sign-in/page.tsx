"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { PromptifyLogo } from "~/components/share/promptify-logo"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInInput } from "~/lib/validations/auth"

export default function SignIn() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Invalid email or password")
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
          <h1 className="mb-12 text-3xl font-bold text-center">Sign in to Promtify</h1>

          <Button
            variant="outline"
            className="mb-4 w-full flex items-center justify-center gap-2 h-12 border border-gray-300"
            onClick={() => {
              void signIn("google", {
                callbackUrl: "/dashboard",
              })
            }}
          >
            <Image src="/icon/google.svg" alt="Google" width={20} height={20} />
            Log in with Google
          </Button>

          <div className="my-4 flex w-full items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

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
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
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
      </div>
    </div>
  )
}

