import * as React from "react"
import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Buttons are flat. A filled variant sets --button-fill and --button-hover;
// the shared classes paint the fill, add the short contact shadow every
// raised control has, and flatten the button when it is disabled.
const FILLED = [
  "bg-[var(--button-fill)] shadow-hui-key",
  "hover:bg-[var(--button-hover)] not-disabled:active:bg-[var(--button-hover)] data-popup-open:bg-[var(--button-hover)] data-[state=open]:bg-[var(--button-hover)] data-[state=on]:bg-[var(--button-hover)]",
  // Lighter than the secondary fill, so a disabled filled button does not
  // read as a secondary button.
  "disabled:bg-[var(--hui-color-background-neutral-primary)]",
]

const buttonVariants = cva(
  [
    // Layout
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap border-0 bg-transparent outline-none select-none",
    // Label
    "font-[var(--hui-font-weight-medium)]",
    // Motion: colors ease over 200ms, the press acknowledges within 100ms.
    "motion-safe:[transition:var(--hui-transition-interactive)] motion-safe:active:[transition:var(--hui-transition-pressed)] motion-safe:not-disabled:active:scale-[var(--hui-scale-pressed)]",
    // Focus: an accent ring, offset so it clears a filled button.
    "focus-visible:[outline:var(--hui-focus-ring)] focus-visible:outline-offset-[var(--hui-focus-ring-offset-accent)]",
    // Disabled: drops its elevation and keeps the disabled cursor.
    "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-[var(--hui-color-foreground-base-tertiary)] disabled:shadow-none",
    // Forced colors replace fills, so the shape needs a real border.
    "forced-colors:border forced-colors:border-[ButtonText] forced-colors:disabled:border-[GrayText]",
    // Touch: an invisible layer brings every size up to a 44px target.
    "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
    // Icons
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // The primary action is neutral ink: near-black on the light page and
        // near-white on the dark one. It leads a dense screen without adding a
        // color. The hover tone moves 14% toward the page background, which is
        // lighter in light mode and darker in dark mode.
        default: [
          "[--button-fill:var(--hui-color-background-neutral-emphasis)] [--button-hover:color-mix(in_oklch,var(--hui-color-background-neutral-emphasis)_86%,var(--hui-color-background-base-primary))] text-[var(--hui-color-foreground-base-emphasis)]",
          ...FILLED,
        ],
        // The theme accent. Use it for the one action on a screen that should
        // stand out in color, such as a marketing call to action.
        accent: [
          "[--button-fill:var(--hui-color-background-accent-emphasis)] [--button-hover:var(--hui-color-background-accent-emphasis-hover)] text-[var(--hui-color-foreground-accent-emphasis)]",
          ...FILLED,
        ],
        // The danger fill is darkened 10% so the white label reaches 4.5:1
        // (it is 3.9:1 on the raw token).
        destructive: [
          "[--button-fill:color-mix(in_oklch,var(--hui-color-background-danger-emphasis)_90%,black)] [--button-hover:color-mix(in_oklch,var(--hui-color-background-danger-emphasis)_80%,black)] text-[var(--hui-color-foreground-danger-emphasis)]",
          ...FILLED,
          "focus-visible:[outline-color:var(--hui-color-border-danger-emphasis)]",
        ],
        // A flat tint with no elevation: one step below the outline button in
        // a row of actions.
        secondary: [
          "bg-hui-subtle text-hui-ink",
          "hover:bg-[var(--hui-color-background-neutral-secondary-hover)] not-disabled:active:bg-[var(--hui-color-background-neutral-secondary-hover)] data-popup-open:bg-[var(--hui-color-background-neutral-secondary-hover)] data-[state=open]:bg-[var(--hui-color-background-neutral-secondary-hover)] data-[state=on]:bg-[var(--hui-color-background-neutral-secondary-hover)]",
          "disabled:bg-[var(--hui-color-background-neutral-primary)]",
        ],
        // The everyday button: a hairline edge on the page surface, with the
        // same edge and shadow as an input so the two line up in a toolbar.
        outline: [
          "border-[0.5px] border-[var(--hui-color-border-field,var(--hui-color-border-base-tertiary))] bg-[var(--hui-color-background-base-primary)] text-[var(--hui-color-foreground-base-primary)] shadow-hui-feather",
          "hover:border-[var(--hui-color-border-field-hover,var(--hui-color-border-base-focus))] hover:bg-[var(--hui-color-background-base-primary-hover)] not-disabled:active:bg-[var(--hui-color-background-base-primary-hover)] data-popup-open:bg-[var(--hui-color-background-base-primary-hover)] data-[state=open]:bg-[var(--hui-color-background-base-primary-hover)] data-[state=on]:bg-[var(--hui-color-background-base-primary-hover)]",
          "disabled:border-[var(--hui-color-border-base-primary)] disabled:bg-transparent",
        ],
        // A soft red edge at rest; the strong edge and the tint arrive on
        // hover, so the button warns without shouting in a quiet toolbar.
        "destructive-outline": [
          "border-[0.5px] border-[var(--hui-color-border-danger-primary)] bg-[var(--hui-color-background-base-primary)] text-[var(--hui-color-foreground-danger-primary)] shadow-hui-feather",
          "hover:border-[var(--hui-color-border-danger-emphasis)] hover:bg-[var(--hui-danger-3)] not-disabled:active:border-[var(--hui-color-border-danger-emphasis)] not-disabled:active:bg-[var(--hui-danger-3)] data-popup-open:bg-[var(--hui-danger-3)] data-[state=open]:bg-[var(--hui-danger-3)] data-[state=on]:bg-[var(--hui-danger-3)]",
          "focus-visible:[outline-color:var(--hui-color-border-danger-emphasis)]",
          "disabled:border-[var(--hui-color-border-base-primary)] disabled:bg-transparent",
        ],
        ghost: [
          "border-[0.5px] border-[var(--hui-color-border-ghost,var(--hui-color-border-base-primary))] text-[var(--hui-color-foreground-base-primary)]",
          "hover:border-[var(--hui-color-border-ghost-hover,var(--hui-color-border-base-secondary))] hover:bg-[var(--hui-color-background-base-primary-hover)] not-disabled:active:bg-[var(--hui-color-background-neutral-secondary)] data-popup-open:bg-[var(--hui-color-background-base-primary-hover)] data-[state=open]:bg-[var(--hui-color-background-base-primary-hover)] data-[state=on]:bg-[var(--hui-color-background-base-primary-hover)]",
        ],
        link: [
          "text-[var(--hui-color-foreground-base-primary)] underline-offset-4 hover:underline",
          "hover:bg-[var(--hui-color-background-base-primary-hover)] not-disabled:active:bg-[var(--hui-color-background-neutral-secondary)] data-popup-open:bg-[var(--hui-color-background-base-primary-hover)] data-[state=open]:bg-[var(--hui-color-background-base-primary-hover)] data-[state=on]:bg-[var(--hui-color-background-base-primary-hover)]",
        ],
      },
      // Each size sets its own height, inline padding, corner radius, label
      // size, and icon size. The radius grows with the height so the corner
      // keeps the same proportion from 24px to 48px.
      size: {
        xs: "h-6 gap-[var(--hui-space-2)] rounded-[var(--hui-radius-1)] px-[var(--hui-space-3)] py-[var(--hui-space-1)] text-xs tracking-[var(--hui-letter-spacing-micro)] leading-4 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-[var(--hui-space-2)] rounded-[calc(var(--hui-radius-2)-2px)] px-2.5 py-[var(--hui-space-1)] text-[length:var(--hui-font-size-control-sm,var(--hui-font-size-mini))] tracking-[var(--hui-letter-spacing-mini)] leading-[var(--hui-line-height-control-sm,var(--hui-line-height-mini))] [&_svg:not([class*='size-'])]:size-3.5",
        default:
          "h-9 gap-1.5 rounded-[var(--hui-radius-2)] px-[var(--hui-density-control-padding-inline,var(--hui-space-4))] py-[calc(var(--hui-density-control-padding-block,var(--hui-space-3))-1px)] text-[length:var(--hui-font-size-control,13px)] tracking-[var(--hui-letter-spacing-control,-0.003em)] leading-[var(--hui-line-height-control,16px)] [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 gap-[var(--hui-space-3)] rounded-[var(--hui-radius-3)] px-[var(--hui-space-6)] py-[calc(var(--hui-space-3)-1px)] text-[length:var(--hui-font-size-regular)] tracking-[var(--hui-letter-spacing-regular)] leading-[var(--hui-line-height-regular)] [&_svg:not([class*='size-'])]:size-4",
        xl: "h-12 gap-[var(--hui-space-3)] rounded-[var(--hui-radius-3)] px-[var(--hui-space-7)] py-[var(--hui-space-4)] text-[length:var(--hui-font-size-large)] tracking-[var(--hui-letter-spacing-large)] leading-[var(--hui-line-height-large)] [&_svg:not([class*='size-'])]:size-4.5",
        icon: "size-9 rounded-[var(--hui-radius-2)] p-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm":
          "size-7 rounded-[calc(var(--hui-radius-2)-2px)] p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg":
          "size-11 rounded-[var(--hui-radius-3)] p-0 [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  render,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const renderValue = asChild
    ? (React.Children.only(children) as React.ReactElement<
        Record<string, unknown>
      >)
    : render

  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    renderValue ? undefined : "button"

  const defaultProps = {
    "data-slot": "button",
    className: cn(buttonVariants({ variant, size, className })),
    type: typeValue,
  }

  return useRender({
    defaultTagName: "button",
    render: renderValue,
    props: mergeProps<"button">(defaultProps, asChild ? props : { ...props, children }),
  })
}

export { Button, buttonVariants }
