"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-2",
    "font-inter font-medium tracking-wide",
    "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        // Primary — Rojo Carmesí
        primary: [
          "bg-crimson text-white",
          "hover:bg-crimson-600 hover:shadow-crimson",
          "active:bg-crimson-700 active:scale-[0.98]",
        ],
        // Secondary — Borde dorado
        secondary: [
          "bg-transparent text-gold border border-gold",
          "hover:bg-gold hover:text-obsidian",
          "active:scale-[0.98]",
        ],
        // Ghost — Texto
        ghost: [
          "bg-transparent text-obsidian",
          "hover:bg-ivory-200 hover:text-obsidian",
          "active:scale-[0.98]",
        ],
        // Outline — Borde obsidiana
        outline: [
          "bg-transparent text-obsidian border border-obsidian-200",
          "hover:bg-obsidian hover:text-white hover:border-obsidian",
          "active:scale-[0.98]",
        ],
        // Dark — Fondo oscuro
        dark: [
          "bg-obsidian text-white",
          "hover:bg-obsidian-700 hover:shadow-luxury",
          "active:scale-[0.98]",
        ],
        // Gold — Dorado sólido
        gold: [
          "bg-gold text-obsidian font-semibold",
          "hover:bg-gold-500 hover:shadow-gold",
          "active:scale-[0.98]",
        ],
        // Destructive
        destructive: [
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "active:scale-[0.98]",
        ],
        // Link
        link: [
          "bg-transparent text-crimson underline-offset-4",
          "hover:underline hover:text-crimson-600",
          "p-0 h-auto",
        ],
      },
      size: {
        xs:   "h-8  px-3   text-xs  rounded",
        sm:   "h-9  px-4   text-sm  rounded-md",
        md:   "h-11 px-6   text-sm  rounded-md",
        lg:   "h-12 px-8   text-base rounded-lg",
        xl:   "h-14 px-10  text-base rounded-lg",
        icon: "h-10 w-10              rounded-md",
        "icon-sm": "h-8 w-8          rounded",
        "icon-lg": "h-12 w-12        rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // When asChild=true, Slot clones the single child element and merges
    // className into it. Wrapping in a Fragment would make Slot try to pass
    // className to the Fragment itself, which React rejects.
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
