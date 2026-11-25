"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-9 cursor-pointer items-center justify-center rounded-hui-control bg-primary px-3 text-sm font-medium text-primary-foreground shadow-hui-key hover:bg-primary/90",
        "focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2 motion-safe:[transition:var(--hui-transition-interactive)]",
        className,
      ].filter(Boolean).join(" ")}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
