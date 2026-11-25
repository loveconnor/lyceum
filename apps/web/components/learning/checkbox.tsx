"use client";

import { Check } from "honestui/icons";
import { useState } from "react";
import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Checkbox({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const [checked, setChecked] = useState(!!props.checked);

  return (
    <label
      className={`flex items-center gap-2 text-xs cursor-pointer ${baseClass} ${customClass}`}
      onClick={() => setChecked((prev) => !prev)}
    >
      <div
        className={`w-3.5 h-3.5 border border-border rounded-sm flex items-center justify-center transition-colors ${checked ? "bg-foreground" : "bg-background"}`}
      >
        {checked && (
          <Check aria-hidden="true" className="size-2.5 text-background" strokeWidth={3} />
        )}
      </div>
      {props.label as string}
    </label>
  );
}
