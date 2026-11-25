"use client";

import { useEffect, useState, type ComponentProps } from "react";

import { cn } from "../../utils/cn";
import { copyToClipboard } from "../../utils/copy";
import { Check as CheckIcon, Copy as CopyIcon } from "honestui/icons";

interface CopyButtonProps extends ComponentProps<"button"> {
  content: string;
  iconSize?: number;
}

const CopyButton = ({ content, iconSize = 14, className, ...props }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  const handleCopy = async () => {
    await copyToClipboard(content);
    setIsCopied(true);
  };

  return (
    <button
      title="Copy to clipboard"
      className={cn(
        "cursor-pointer rounded-hui-item text-hui-muted hover:text-hui-ink",
        "motion-safe:[transition:var(--hui-transition-interactive)] focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2",
        className,
      )}
      onClick={handleCopy}
      {...props}
    >
      {isCopied ? (
        <CheckIcon
          size={iconSize}
          className="animate-in zoom-in-50 text-green-900 duration-200 dark:text-green-400"
        />
      ) : (
        <CopyIcon
          size={iconSize}
          className="animate-in zoom-in-50 duration-200"
        />
      )}
    </button>
  );
};

export { CopyButton };
