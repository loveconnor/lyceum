'use client'

import { Github, Google1Filled, Eye as EyeIcon, EyeOff as EyeOffIcon } from "honestui/icons";
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signInWithGoogle, signInWithGitHub } from "@/app/auth/actions"

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const isGoogleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true'
  const isGitHubEnabled = process.env.NEXT_PUBLIC_ENABLE_GITHUB_AUTH === 'true'
  const hasOAuthProviders = isGoogleEnabled || isGitHubEnabled

  return (
    <section className="flex min-h-screen bg-background px-4 py-16 md:py-24">
      <div className="m-auto w-full max-w-xs">
        <div className="text-center">
          <h1 className="mt-3 text-4xl font-medium">Sign in</h1>
        </div>
        <form action={login} className="mt-12 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                required 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
        {hasOAuthProviders && (
          <div className="mt-6 space-y-3 border-t pt-6">
            {isGoogleEnabled && (
              <form action={signInWithGoogle}>
                <Button type="submit" variant="outline" className="w-full">
            <Google1Filled aria-hidden="true" className="size-4" />
            <span>Google</span>
                </Button>
              </form>
            )}
            {isGitHubEnabled && (
              <form action={signInWithGitHub}>
                <Button type="submit" variant="outline" className="w-full">
            <Github aria-hidden="true" className="size-4" />
            <span>GitHub</span>
                </Button>
              </form>
            )}
          </div>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}
