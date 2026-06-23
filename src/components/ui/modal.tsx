"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  title?:       string;
  description?: string;
  children:     React.ReactNode;
  size?:        "sm" | "md" | "lg" | "xl" | "full";
  className?:   string;
}

const sizeMap = {
  sm:   "max-w-md",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-[95vw]",
};

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-sm",
            "data-[state=open]:animate-fade-in",
            "data-[state=closed]:opacity-0 transition-opacity duration-300"
          )}
        />

        {/* Content */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "bg-white rounded-2xl shadow-luxury-xl",
            "data-[state=open]:animate-slide-up",
            "focus:outline-none",
            "max-h-[90vh] overflow-y-auto",
            sizeMap[size],
            className
          )}
        >
          {/* Close button */}
          <Dialog.Close
            className={cn(
              "absolute right-4 top-4 z-10",
              "p-1.5 rounded-full text-obsidian-400",
              "hover:bg-ivory-200 hover:text-obsidian",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-crimson"
            )}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Dialog.Close>

          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-4 border-b border-obsidian-100">
              {title && (
                <Dialog.Title className="font-playfair text-display-sm font-semibold text-obsidian pr-8">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-body-sm text-obsidian-400">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Modal };
