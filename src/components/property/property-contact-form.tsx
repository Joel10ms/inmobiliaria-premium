"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { inquirySchema, type InquiryFormData } from "@/lib/validations";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PropertyContactFormProps {
  propertyId:    string;
  propertyTitle: string;
}

export function PropertyContactForm({ propertyId, propertyTitle }: PropertyContactFormProps) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      propertyId,
      source:  "WEB",
      message: `Hola, me interesa la propiedad "${propertyTitle}". ¿Podrían enviarme más información?`,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // ─── Success state ───────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-obsidian-100 shadow-card p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-7 w-7 text-emerald-600" />
        </div>
        <div className="w-8 h-0.5 bg-gold mx-auto mb-3" />
        <h3 className="font-playfair font-semibold text-display-sm text-obsidian mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-body-sm text-obsidian-400 mb-5 leading-relaxed">
          Un asesor se pondrá en contacto con usted a la brevedad para atender su solicitud.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-body-sm text-crimson hover:underline transition-colors"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-obsidian-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-obsidian-100 flex items-center gap-2.5">
        <MessageSquare className="h-4 w-4 text-crimson" />
        <p className="font-inter font-semibold text-body-md text-obsidian">Solicitar información</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4" noValidate>
        {/* Name */}
        <Input
          label="Nombre completo"
          placeholder="Ej. Juan García"
          required
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Email */}
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="juan@ejemplo.com"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Phone */}
        <Input
          label="Teléfono"
          type="tel"
          placeholder="+52 55 0000 0000"
          hint="Opcional — para contacto más rápido"
          error={errors.phone?.message}
          {...register("phone")}
        />

        {/* Message */}
        <Textarea
          label="Mensaje"
          rows={3}
          error={errors.message?.message}
          {...register("message")}
        />

        {/* Hidden fields */}
        <input type="hidden" {...register("propertyId")} />
        <input type="hidden" {...register("source")} />

        {/* Error banner */}
        {status === "error" && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-body-xs text-red-600">
              Ocurrió un error al enviar su mensaje. Por favor inténtelo de nuevo.
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={status === "loading"}
          className="w-full"
        >
          {status === "loading" ? "Enviando…" : "Enviar consulta"}
        </Button>

        {/* Privacy */}
        <p className="text-body-xs text-obsidian-300 text-center leading-relaxed">
          Al enviar, acepta nuestra{" "}
          <a href="/privacidad" className="underline hover:text-obsidian transition-colors">
            Política de privacidad
          </a>
          . Sus datos son confidenciales.
        </p>
      </form>
    </div>
  );
}
