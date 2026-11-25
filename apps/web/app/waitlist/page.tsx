"use client";

import { Check, LoaderCircle } from "honestui/icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gooey } from "@/components/ui/custom/gooey-toast";

interface WaitlistResponse {
  success?: boolean
  error?: string
}

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      gooey.error({ 
        title: "Email required", 
        description: "Please enter your email address to join the waitlist." 
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      gooey.error({ 
        title: "Invalid email format", 
        description: "Please check your email address and try again." 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
      
      const response = await fetch(`${apiUrl}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: 'web-app',
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page: 'web-waitlist',
          },
        }),
      })

      const data: WaitlistResponse = await response.json()

      if (response.ok && data.success) {
        setIsSubmitted(true)
        gooey.success({ 
          title: "You're on the list!", 
          description: "We'll notify you as soon as we launch. Get ready for something special." 
        })
      } else {
        // Handle specific error messages from the API
        if (response.status === 409) {
          gooey.error({ 
            title: "Already signed up", 
            description: "You're already on our waitlist. We'll be in touch soon!" 
          })
        } else {
          gooey.error({ 
            title: "Signup failed", 
            description: data.error || "Something went wrong. Please try again in a moment." 
          })
        }
      }
    } catch (error) {
      console.error('Waitlist submission error:', error)
      gooey.error({ 
        title: "Connection error", 
        description: "Unable to connect. Please check your internet connection and try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Lyceum
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern learning platform powered by AI
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isSubmitted ? "You're on the list!" : "Join the Waitlist"}
            </CardTitle>
            <CardDescription>
              {isSubmitted
                ? "We'll notify you when we launch. Check your email for confirmation."
                : "Be the first to know when we launch. Enter your email to join our waitlist."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="h-12"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                      Joining...
                    </div>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check aria-hidden="true" className="size-8 text-primary" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            We&apos;re working hard to bring you the best learning experience.
          </p>
        </div>
      </div>
    </div>
  );
}
