'use client'

import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Github, Mail, Facebook, ArrowLeft } from 'lucide-react'
import { signIn } from "next-auth/react";


export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Link href="/dashboard">
        <button className="absolute top-5 left-5 flex items-center hover:text-foreground/80 transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
      </Link>
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl q font-bold tracking-tight">Create an account</h1>
          <p className="text-lg text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Username"
              className="h-12 bg-background text-lg"
            />
            <Input
              type="email"
              placeholder="name@example.com"
              className="h-12 bg-background text-lg"
            />
            <Input
              type="password"
              placeholder="Create a password"
              className="h-12 bg-background text-lg"
            />
          </div>
          <Button type="submit" className="h-12 w-full text-lg" size="lg">
            Sign Up
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-12" size="lg">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
            <Button variant="outline" className="h-12" size="lg" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
              <Mail className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button variant="outline" className="h-12" size="lg">
              <Facebook className="mr-2 h-5 w-5" />
              Facebook
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
