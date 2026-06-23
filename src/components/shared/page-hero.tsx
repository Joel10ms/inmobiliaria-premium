import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title:        string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  className?:   string;
  compact?:     boolean;
}

export function PageHero({
  title,
  description,
  breadcrumbs,
  className,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative bg-obsidian overflow-hidden",
        compact ? "py-16 mt-20" : "py-24 mt-20",
        className
      )}
    >
      {/* Decorative background gradient */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, #C9A86A 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold" />

      {/* Content */}
      <div className="relative z-10 container-luxury section-padding py-0">

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Ruta de navegación" className="mb-5">
            <ol className="flex items-center gap-1.5 flex-wrap">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="text-label-sm text-white/40 hover:text-gold transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={cn("text-label-sm", isLast ? "text-gold" : "text-white/40")}>
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight className="h-3 w-3 text-white/25" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Title + accent */}
        <div className="flex items-start gap-5">
          <div className="w-1 self-stretch bg-gradient-to-b from-gold to-transparent rounded-full hidden sm:block" />
          <div>
            <h1 className="font-playfair italic font-bold text-white leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-body-lg text-white/55 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
