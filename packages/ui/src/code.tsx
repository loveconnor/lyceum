import { type JSX } from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <code className={["rounded-hui-item bg-hui-subtle px-1.5 py-0.5 font-mono text-hui-ink", className].filter(Boolean).join(" ")}>
      {children}
    </code>
  );
}
