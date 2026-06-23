"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Base Input ───────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  leftIcon?:    React.ReactNode;
  rightIcon?:   React.ReactNode;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconClick,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-sm text-obsidian-700 tracking-wide"
          >
            {label}
            {props.required && <span className="text-crimson ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full h-11 bg-white",
              "border border-obsidian-200 rounded-md",
              "font-inter text-body-sm text-obsidian placeholder:text-obsidian-400",
              "transition-all duration-200",
              "focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/15",
              "disabled:bg-ivory-200 disabled:text-obsidian-400 disabled:cursor-not-allowed",
              "read-only:bg-ivory-100",
              error && "border-red-400 focus:border-red-500 focus:ring-red-500/15",
              leftIcon  ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={cn(
                "absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian-400",
                "hover:text-obsidian transition-colors",
                onRightIconClick ? "cursor-pointer" : "pointer-events-none"
              )}
              tabIndex={onRightIconClick ? 0 : -1}
            >
              {rightIcon}
            </button>
          )}
        </div>

        {error && (
          <p className="text-body-xs text-red-600">{error}</p>
        )}
        {hint && !error && (
          <p className="text-body-xs text-obsidian-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ─── Textarea ─────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-sm text-obsidian-700 tracking-wide"
          >
            {label}
            {props.required && <span className="text-crimson ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 bg-white",
            "border border-obsidian-200 rounded-md",
            "font-inter text-body-sm text-obsidian placeholder:text-obsidian-400",
            "transition-all duration-200 resize-y",
            "focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/15",
            "disabled:bg-ivory-200 disabled:cursor-not-allowed",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/15",
            className
          )}
          {...props}
        />

        {error && <p className="text-body-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-body-xs text-obsidian-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ─── Select ───────────────────────────────────────────────────────
export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  placeholder?: string;
  options:      { value: string; label: string }[];
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, label, error, hint, placeholder, options, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-sm text-obsidian-700 tracking-wide"
          >
            {label}
            {props.required && <span className="text-crimson ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-11 pl-4 pr-10 bg-white",
            "border border-obsidian-200 rounded-md appearance-none cursor-pointer",
            "font-inter text-body-sm text-obsidian",
            "transition-all duration-200",
            "focus:outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/15",
            "disabled:bg-ivory-200 disabled:cursor-not-allowed",
            error && "border-red-400",
            // Custom arrow
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235A5A5A%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')]",
            "bg-no-repeat bg-[right_12px_center]",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className="text-body-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-body-xs text-obsidian-400">{hint}</p>}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export { Input, Textarea, SelectInput };
