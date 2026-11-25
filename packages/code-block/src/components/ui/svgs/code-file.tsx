import { FileCode } from "honestui/icons";
import type { ComponentPropsWithoutRef } from "react";

export function CodeFile({ strokeWidth, ...props }: ComponentPropsWithoutRef<"svg">) {
  return <FileCode strokeWidth={typeof strokeWidth === "number" ? strokeWidth : 1.8} {...props} />;
}
