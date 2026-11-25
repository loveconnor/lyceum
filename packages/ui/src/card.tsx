import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={[
        "block rounded-hui-panel border-[0.5px] border-hui-line bg-hui-surface p-6 text-hui-ink shadow-hui-soft",
        "focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2",
        className,
      ].filter(Boolean).join(" ")}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2>
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
