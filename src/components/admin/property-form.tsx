"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X }                  from "lucide-react";
import { ImageUpload }              from "@/components/admin/image-upload";
import type { UploadedImage }       from "@/components/admin/image-upload";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Textarea, SelectInput } from "@/components/ui/input";
import { mockAgents } from "@/lib/mock-data";
import { ZONES } from "@/lib/filter-properties";

// ─── Zod schema ───────────────────────────────────────────────────
const propertyFormSchema = z.object({
  title:          z.string().min(10, "El título debe tener al menos 10 caracteres"),
  description:    z.string().min(30, "La descripción debe tener al menos 30 caracteres"),
  type:           z.string().min(1, "Selecciona el tipo de propiedad"),
  listingType:    z.string().min(1, "Selecciona el tipo de operación"),
  price:          z.coerce.number().positive("El precio debe ser mayor a 0"),
  currency:       z.enum(["MXN", "USD"]),
  zoneSlug:       z.string().min(1, "Selecciona una zona"),
  address:        z.string().optional(),
  bedrooms:       z.coerce.number().min(0).optional(),
  bathrooms:      z.coerce.number().min(0).optional(),
  halfBathrooms:  z.coerce.number().min(0).optional(),
  parkingSpaces:  z.coerce.number().min(0).optional(),
  totalArea:      z.coerce.number().positive().optional(),
  builtArea:      z.coerce.number().positive().optional(),
  landArea:       z.coerce.number().positive().optional(),
  floors:         z.coerce.number().min(1).optional(),
  agentId:        z.string().min(1, "Selecciona un asesor"),
  status:         z.string().min(1, "Selecciona el estado"),
  isFeatured:     z.boolean(),
  isNew:          z.boolean(),
  isExclusive:    z.boolean(),
  videoUrl:       z.string().url("URL inválida").optional().or(z.literal("")),
  virtualTourUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  metaTitle:      z.string().max(70, "Máximo 70 caracteres").optional(),
  metaDescription:z.string().max(160, "Máximo 160 caracteres").optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

// ─── Form section wrapper ─────────────────────────────────────────
function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-obsidian-100 bg-ivory">
        <h3 className="font-inter font-semibold text-body-md text-obsidian">{title}</h3>
        {description && <p className="text-body-xs text-obsidian-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group p-3 rounded-lg hover:bg-ivory transition-colors">
      <div>
        <p className="text-body-sm font-medium text-obsidian">{label}</p>
        {description && <p className="text-body-xs text-obsidian-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2",
          checked ? "bg-crimson" : "bg-obsidian-200"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5",
            checked ? "translate-x-4.5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

// ─── Main form ────────────────────────────────────────────────────
interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>;
  mode:           "create" | "edit";
  propertyId?:    string;
}

export function PropertyForm({ defaultValues, mode, propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [success,   setSuccess]   = React.useState(false);
  const [apiError,  setApiError]  = React.useState<string | null>(null);
  const [images,    setImages]    = React.useState<UploadedImage[]>([]);

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isDirty },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      currency:    "MXN",
      status:      "ACTIVA",
      isFeatured:  false,
      isNew:       false,
      isExclusive: false,
      ...defaultValues,
    },
  });

  const watchedFlags = {
    isFeatured:  watch("isFeatured"),
    isNew:       watch("isNew"),
    isExclusive: watch("isExclusive"),
  };

  const onSubmit = async (data: PropertyFormValues) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const url    = mode === "create"
        ? "/api/admin/properties"
        : `/api/admin/properties/${propertyId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, images }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json.error ?? "Error al guardar la propiedad."
        );
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        router.push("/admin/propiedades");
      }, 1500);
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : "Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const agentOptions = [
    { value: "", label: "Selecciona un asesor…" },
    ...mockAgents.map((a) => ({ value: a.id, label: `${a.name} ${a.lastName}` })),
  ];

  const zoneOptions = [
    { value: "", label: "Selecciona una zona" },
    ...ZONES.map((z) => ({ value: z.slug, label: z.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* ─── Basic info ─────────────────────────────────────── */}
      <FormSection title="Información básica" description="Datos principales de la propiedad">
        <Input
          label="Título *"
          placeholder="Ej. Penthouse Residencial en Polanco con Vista Panorámica"
          error={errors.title?.message}
          {...register("title")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="Tipo de propiedad *"
            error={errors.type?.message}
            options={[
              { value: "", label: "Selecciona..." },
              "Casa","Departamento","Penthouse","Villa","Desarrollo","Oficina","Terreno","Suite"
            ].map((t) => typeof t === "string" ? { value: t, label: t } : t)}
            {...register("type")}
          />
          <SelectInput
            label="Tipo de operación *"
            error={errors.listingType?.message}
            options={[
              { value: "",            label: "Selecciona..." },
              { value: "VENTA",       label: "Venta" },
              { value: "RENTA",       label: "Renta" },
              { value: "VENTA_O_RENTA", label: "Venta o Renta" },
            ]}
            {...register("listingType")}
          />
        </div>
        <Textarea
          label="Descripción *"
          placeholder="Describe detalladamente la propiedad: características, acabados, entorno, amenidades exclusivas…"
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />
      </FormSection>

      {/* ─── Price ──────────────────────────────────────────── */}
      <FormSection title="Precio">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Precio *"
              type="number"
              placeholder="15000000"
              error={errors.price?.message}
              {...register("price")}
            />
          </div>
          <SelectInput
            label="Moneda *"
            options={[
              { value: "MXN", label: "MXN — Peso mexicano" },
              { value: "USD", label: "USD — Dólar americano" },
            ]}
            {...register("currency")}
          />
        </div>
      </FormSection>

      {/* ─── Location ───────────────────────────────────────── */}
      <FormSection title="Ubicación">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="Zona *"
            error={errors.zoneSlug?.message}
            options={zoneOptions}
            {...register("zoneSlug")}
          />
          <Input
            label="Dirección"
            placeholder="Calle y número (no se mostrará públicamente)"
            hint="Esta dirección es interna. La zona es lo que se muestra en el sitio."
            {...register("address")}
          />
        </div>
      </FormSection>

      {/* ─── Specs ──────────────────────────────────────────── */}
      <FormSection title="Especificaciones" description="Características físicas de la propiedad">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input label="Recámaras"   type="number" placeholder="3" {...register("bedrooms")} />
          <Input label="Baños"       type="number" placeholder="3" {...register("bathrooms")} />
          <Input label="Medios baños"type="number" placeholder="1" {...register("halfBathrooms")} />
          <Input label="Estacionamiento" type="number" placeholder="2" {...register("parkingSpaces")} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Área total (m²)"     type="number" placeholder="450" {...register("totalArea")} />
          <Input label="Área construida (m²)"type="number" placeholder="380" {...register("builtArea")} />
          <Input label="Terreno (m²)"        type="number" placeholder="600" {...register("landArea")} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Niveles / pisos" type="number" placeholder="3" {...register("floors")} />
        </div>
      </FormSection>

      {/* ─── Agent + status ─────────────────────────────────── */}
      <FormSection title="Asignación y estado">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="Asesor asignado"
            options={agentOptions}
            {...register("agentId")}
          />
          <SelectInput
            label="Estado *"
            error={errors.status?.message}
            options={[
              { value: "ACTIVA",          label: "Activa — publicada" },
              { value: "EN_NEGOCIACION",  label: "En negociación" },
              { value: "VENDIDA",         label: "Vendida" },
              { value: "RENTADA",         label: "Rentada" },
              { value: "PAUSADA",         label: "Pausada — no publicada" },
            ]}
            {...register("status")}
          />
        </div>
      </FormSection>

      {/* ─── Flags ──────────────────────────────────────────── */}
      <FormSection title="Etiquetas destacadas">
        <div className="divide-y divide-obsidian-100 -my-2">
          <Toggle
            label="Propiedad Destacada"
            description="Aparece en la sección de propiedades destacadas en el inicio"
            checked={watchedFlags.isFeatured}
            onChange={(v) => setValue("isFeatured", v, { shouldDirty: true })}
          />
          <Toggle
            label="Propiedad Nueva"
            description="Muestra badge 'Nuevo' en la tarjeta de la propiedad"
            checked={watchedFlags.isNew}
            onChange={(v) => setValue("isNew", v, { shouldDirty: true })}
          />
          <Toggle
            label="Exclusiva"
            description="Propiedad en exclusiva — muestra badge 'Exclusiva'"
            checked={watchedFlags.isExclusive}
            onChange={(v) => setValue("isExclusive", v, { shouldDirty: true })}
          />
        </div>
      </FormSection>

      {/* ─── Media ──────────────────────────────────────────── */}
      <FormSection title="Multimedia" description="Fotos, video y recorrido virtual">
        <div>
          <label className="block text-body-sm font-medium text-obsidian mb-2">
            Imágenes
          </label>
          <ImageUpload value={images} onChange={setImages} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="URL de video (YouTube / Vimeo)"
            placeholder="https://youtube.com/watch?v=..."
            error={errors.videoUrl?.message}
            {...register("videoUrl")}
          />
          <Input
            label="URL de recorrido virtual"
            placeholder="https://my.matterport.com/..."
            error={errors.virtualTourUrl?.message}
            {...register("virtualTourUrl")}
          />
        </div>
      </FormSection>

      {/* ─── SEO ────────────────────────────────────────────── */}
      <FormSection title="SEO (opcional)" description="Optimización para motores de búsqueda">
        <Input
          label="Meta título"
          placeholder="Se usará el título de la propiedad si se deja vacío"
          hint="Máximo 70 caracteres"
          error={errors.metaTitle?.message}
          {...register("metaTitle")}
        />
        <Textarea
          label="Meta descripción"
          placeholder="Descripción para resultados de búsqueda (máx. 160 caracteres)"
          rows={2}
          hint="Máximo 160 caracteres"
          error={errors.metaDescription?.message}
          {...register("metaDescription")}
        />
      </FormSection>

      {/* ─── API error ──────────────────────────────────────── */}
      {apiError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-600 text-body-sm font-medium">✕ {apiError}</span>
        </div>
      )}

      {/* ─── Footer actions ─────────────────────────────────── */}
      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 text-center">
          <p className="text-emerald-700 font-medium">
            ✓ Propiedad {mode === "create" ? "creada" : "actualizada"} exitosamente. Redirigiendo…
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {mode === "create" ? "Crear propiedad" : "Guardar cambios"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            leftIcon={<X className="h-4 w-4" />}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          {isDirty && (
            <p className="text-body-xs text-obsidian-400 ml-auto">
              Tienes cambios sin guardar
            </p>
          )}
        </div>
      )}
    </form>
  );
}
