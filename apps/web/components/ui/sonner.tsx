"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { toastIcons } from "@/app/design-playground/ui/toast-icons"

const Toaster = ({ icons, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--hui-color-background-overlay)",
          "--normal-text": "var(--hui-color-foreground-base-primary)",
          "--normal-border": "var(--hui-color-border-overlay)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: { toast: "rounded-hui-control! shadow-hui-lifted!" },
      }}
      {...props}
      icons={{ ...toastIcons, ...icons }}
    />
  )
}

export { Toaster }
