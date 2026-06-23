"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, Grid2x2, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertyImage } from "@/types";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title:  string;
}

// ─── Lightbox ─────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images:     PropertyImage[];
  startIndex: number;
  onClose:    () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex });
  const [current, setCurrent] = React.useState(startIndex);

  React.useEffect(() => {
    emblaApi?.on("select", () => setCurrent(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian/97 flex flex-col" role="dialog" aria-modal>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Grid2x2 className="h-4 w-4 text-gold" />
          <span className="text-white/70 text-body-sm">
            {current + 1} <span className="text-white/30">/ {images.length}</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
          aria-label="Cerrar galería"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Carousel */}
      <div className="flex-1 flex items-center relative overflow-hidden">
        <div ref={emblaRef} className="overflow-hidden w-full h-full">
          <div className="flex h-full">
            {images.map((img, i) => (
              <div key={img.id} className="relative flex-[0_0_100%] h-full px-4 lg:px-16">
                <Image
                  src={img.url}
                  alt={img.alt || `Imagen ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={i === startIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-150 backdrop-blur-sm"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-150 backdrop-blur-sm"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="shrink-0 px-6 py-4 border-t border-white/10">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "relative shrink-0 h-14 w-20 rounded-md overflow-hidden transition-all duration-150",
                  i === current
                    ? "ring-2 ring-gold ring-offset-1 ring-offset-obsidian opacity-100"
                    : "opacity-50 hover:opacity-75"
                )}
                aria-label={`Ir a imagen ${i + 1}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main gallery grid ────────────────────────────────────────────
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [startIndex,   setStartIndex]   = React.useState(0);

  const open = (idx: number) => { setStartIndex(idx); setLightboxOpen(true); };

  if (images.length === 0) {
    return (
      <div className="aspect-property-lg rounded-2xl bg-gradient-luxury flex items-center justify-center">
        <p className="text-white/40 text-body-sm">Sin imágenes</p>
      </div>
    );
  }

  const main    = images[0];
  const sides   = images.slice(1, 5);
  const hasMore = images.length > 5;
  const extra   = images.length - 5;

  return (
    <>
      {/* ─── Grid ────────────────────────────────────────────── */}
      <div
        className={cn(
          "rounded-2xl overflow-hidden",
          sides.length > 0
            ? "grid gap-1.5"
            : ""
        )}
        style={sides.length > 0 ? { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(2, 1fr)", height: "520px" } : {}}
      >
        {/* Main image */}
        <button
          onClick={() => open(0)}
          className={cn(
            "relative overflow-hidden group",
            sides.length > 0 ? "row-span-2" : "w-full aspect-property-lg"
          )}
          aria-label="Ver galería"
        >
          <Image
            src={main.url}
            alt={main.alt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/15 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="glass p-3 rounded-full">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
          </div>
        </button>

        {/* Side images */}
        {sides.map((img, i) => {
          const isLast = i === 3;
          return (
            <button
              key={img.id}
              onClick={() => open(i + 1)}
              className="relative overflow-hidden group"
              aria-label={`Imagen ${i + 2}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${title} — imagen ${i + 2}`}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
              />

              {/* "Ver todas" overlay on last visible side image */}
              {isLast && hasMore ? (
                <div className="absolute inset-0 bg-obsidian/60 flex flex-col items-center justify-center gap-1">
                  <span className="font-playfair font-bold text-white text-display-sm">
                    +{extra}
                  </span>
                  <span className="text-white/70 text-body-xs tracking-wide">fotos</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-colors duration-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* "Ver todas" button below grid */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => open(0)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-obsidian-200 text-body-sm text-obsidian hover:bg-obsidian hover:text-white hover:border-obsidian transition-all duration-200"
        >
          <Grid2x2 className="h-4 w-4" />
          Ver las {images.length} fotos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={startIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
