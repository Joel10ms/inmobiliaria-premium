"use client";

import * as React       from "react";
import Image            from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus, Star, X, GripVertical, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────
export interface UploadedImage {
  id:        string;
  url:       string;
  publicId:  string;
  alt:       string;
  isPrimary: boolean;
  order:     number;
}

interface ImageUploadProps {
  value:     UploadedImage[];
  onChange:  (images: UploadedImage[]) => void;
  maxImages?: number;
}

// ─── Single image tile ────────────────────────────────────────────
function ImageTile({
  image, index, total,
  onSetPrimary, onRemove, onMoveUp, onMoveDown,
}: {
  image:        UploadedImage;
  index:        number;
  total:        number;
  onSetPrimary: () => void;
  onRemove:     () => void;
  onMoveUp:     () => void;
  onMoveDown:   () => void;
}) {
  return (
    <div className={cn(
      "relative group rounded-xl overflow-hidden bg-obsidian-100 border-2 transition-all duration-150",
      image.isPrimary ? "border-gold shadow-gold/30 shadow-md" : "border-transparent hover:border-obsidian-200"
    )}>
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-all duration-200" />

        {/* Primary badge */}
        {image.isPrimary && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-gold text-obsidian text-[10px] font-bold rounded-full">
            <Star className="h-2.5 w-2.5 fill-current" />
            Principal
          </div>
        )}

        {/* Actions — visible on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {!image.isPrimary && (
            <button
              type="button"
              onClick={onSetPrimary}
              title="Establecer como principal"
              className="p-1.5 rounded-lg bg-gold text-obsidian text-[10px] font-bold hover:bg-gold/90 transition-colors flex items-center gap-1"
            >
              <Star className="h-3 w-3 fill-current" />
              Principal
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            title="Eliminar imagen"
            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Order controls */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-white border-t border-obsidian-100">
        <span className="text-[10px] text-obsidian-400 font-medium">#{index + 1}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-0.5 text-obsidian-400 hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Mover hacia arriba"
          >
            <GripVertical className="h-3 w-3 rotate-90" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-0.5 text-obsidian-400 hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-colors rotate-180"
            title="Mover hacia abajo"
          >
            <GripVertical className="h-3 w-3 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const MAX_DEFAULT = 15;

export function ImageUpload({ value, onChange, maxImages = MAX_DEFAULT }: ImageUploadProps) {
  const isCloudinaryConfigured = Boolean(CLOUD_NAME);

  const addImage = React.useCallback((info: CloudinaryUploadWidgetInfo) => {
    const newImage: UploadedImage = {
      id:        info.public_id,
      url:       info.secure_url,
      publicId:  info.public_id,
      alt:       (info as any).original_filename ?? "Imagen de propiedad",
      isPrimary: value.length === 0, // first upload is primary
      order:     value.length,
    };
    onChange([...value, newImage]);
  }, [value, onChange]);

  const handleSuccess = React.useCallback((results: CloudinaryUploadWidgetResults) => {
    if (results.event !== "success") return;
    addImage(results.info as CloudinaryUploadWidgetInfo);
  }, [addImage]);

  const setPrimary = (id: string) => {
    onChange(value.map((img) => ({ ...img, isPrimary: img.id === id })));
  };

  const removeImage = (id: string) => {
    const filtered = value
      .filter((img) => img.id !== id)
      .map((img, i) => ({ ...img, order: i }));
    // Ensure at least one primary
    if (filtered.length > 0 && !filtered.some((i) => i.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const arr = [...value];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange(arr.map((img, i) => ({ ...img, order: i })));
  };

  // ── Cloudinary not configured — show informational placeholder ──
  if (!isCloudinaryConfigured) {
    return (
      <div className="space-y-3">
        <div className="border-2 border-dashed border-obsidian-200 rounded-xl p-8 text-center bg-ivory">
          <ImagePlus className="h-8 w-8 text-obsidian-300 mx-auto mb-3" />
          <p className="text-body-sm text-obsidian-500 font-medium mb-1">Carga de imágenes</p>
          <p className="text-body-xs text-obsidian-400">
            Configura <code className="bg-obsidian-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>,{" "}
            <code className="bg-obsidian-100 px-1 rounded">CLOUDINARY_API_KEY</code> y{" "}
            <code className="bg-obsidian-100 px-1 rounded">CLOUDINARY_API_SECRET</code> en tu{" "}
            <code className="bg-obsidian-100 px-1 rounded">.env.local</code> para habilitar la carga de imágenes.
          </p>
        </div>
        <div className="flex items-start gap-2 p-3 bg-gold/10 rounded-lg border border-gold/20">
          <Info className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
          <p className="text-body-xs text-obsidian-600">
            Crea una cuenta gratuita en{" "}
            <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline text-crimson">
              cloudinary.com
            </a>{" "}
            y configura un <strong>upload preset</strong> con nombre{" "}
            <code className="bg-obsidian-100 px-1 rounded">inmobiliaria_premium</code> para el widget.
          </p>
        </div>
      </div>
    );
  }

  const canUploadMore = value.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload button */}
      {canUploadMore && (
        <CldUploadWidget
          signatureEndpoint="/api/upload"
          onSuccess={handleSuccess}
          options={{
            sources:              ["local", "url", "camera"],
            multiple:             true,
            maxFiles:             maxImages - value.length,
            maxFileSize:          10_000_000, // 10 MB
            resourceType:         "image",
            folder:               "inmobiliaria-premium/properties",
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            cropping:             false,
            showCompletedButton:  true,
            styles: {
              palette: {
                window:         "#F8F8F8",
                windowBorder:   "#E0E0E0",
                tabIcon:        "#960018",
                menuIcons:      "#757575",
                textDark:       "#121212",
                textLight:      "#FFFFFF",
                link:           "#960018",
                action:         "#960018",
                inactiveTabIcon:"#9E9E9E",
                error:          "#F44235",
                inProgress:     "#960018",
                complete:       "#20B832",
                sourceBg:       "#F8F8F8",
              },
            },
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className={cn(
                "w-full border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center group",
                value.length === 0
                  ? "border-obsidian-200 hover:border-crimson/50 hover:bg-crimson/5"
                  : "border-obsidian-100 hover:border-crimson/30 hover:bg-crimson/5 py-5"
              )}
            >
              <ImagePlus className="h-7 w-7 text-obsidian-300 group-hover:text-crimson mx-auto mb-2 transition-colors" />
              <p className="text-body-sm font-medium text-obsidian-500 group-hover:text-crimson transition-colors">
                {value.length === 0 ? "Subir imágenes" : "Agregar más imágenes"}
              </p>
              <p className="text-body-xs text-obsidian-400 mt-0.5">
                JPG, PNG, WebP · Máx. {(10_000_000 / 1_000_000).toFixed(0)} MB por archivo ·{" "}
                {maxImages - value.length} restantes
              </p>
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* Image limit reached */}
      {!canUploadMore && (
        <div className="flex items-center gap-2 p-3 bg-obsidian-50 rounded-lg border border-obsidian-100">
          <AlertCircle className="h-4 w-4 text-obsidian-400 shrink-0" />
          <p className="text-body-xs text-obsidian-500">
            Límite de {maxImages} imágenes alcanzado. Elimina alguna para subir más.
          </p>
        </div>
      )}

      {/* Image grid */}
      {value.length > 0 && (
        <div>
          <p className="text-body-xs font-medium text-obsidian-400 mb-3">
            {value.length} imagen{value.length !== 1 ? "es" : ""} · Haz clic en una imagen para ver las opciones
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {value.map((img, index) => (
              <ImageTile
                key={img.id}
                image={img}
                index={index}
                total={value.length}
                onSetPrimary={() => setPrimary(img.id)}
                onRemove={() => removeImage(img.id)}
                onMoveUp={() => moveImage(index, "up")}
                onMoveDown={() => moveImage(index, "down")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
