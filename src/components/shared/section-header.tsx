import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?:          string;
  eyebrow?:    string;
  title:       string;
  description?: string;
  align?:      "left" | "center" | "right";
  titleClass?: string;
  light?:      boolean;
  className?:  string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  titleClass,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "right"  && "items-end text-right",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "section-label",
            light && "text-gold"
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        id={id}
        className={cn(
          "font-playfair font-bold text-display-lg max-w-3xl",
          light ? "text-white" : "text-obsidian",
          titleClass
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-body-lg max-w-2xl",
            light ? "text-white/70" : "text-obsidian-400"
          )}
        >
          {description}
        </p>
      )}

      {/* Gold accent line */}
      <div
        className={cn(
          "h-0.5 w-12 bg-gold rounded-full mt-1",
          align === "center" && "self-center",
          align === "right"  && "self-end"
        )}
      />
    </div>
  );
}
