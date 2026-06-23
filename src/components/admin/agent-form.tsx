"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import { Button }  from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const agentFormSchema = z.object({
  name:       z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName:   z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email:      z.string().email("Email inválido"),
  phone:      z.string().min(10, "Teléfono inválido"),
  whatsapp:   z.string().optional(),
  specialty:  z.string().optional(),
  bio:        z.string().max(500, "Máximo 500 caracteres").optional(),
  linkedinUrl:z.string().url("URL inválida").optional().or(z.literal("")),
  instagramUrl:z.string().url("URL inválida").optional().or(z.literal("")),
  licenseNumber:z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-obsidian-100 bg-ivory">
        <h3 className="font-inter font-semibold text-body-md text-obsidian">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

interface AgentFormProps {
  defaultValues?: Partial<AgentFormValues>;
  mode:           "create" | "edit";
}

export function AgentForm({ defaultValues, mode }: AgentFormProps) {
  const router   = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: AgentFormValues) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    console.log("Agent data:", data);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/admin/agentes"), 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormSection title="Datos personales">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre *"   error={errors.name?.message}     {...register("name")} />
          <Input label="Apellidos *"error={errors.lastName?.message}  {...register("lastName")} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email *"    type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Teléfono *" type="tel"   error={errors.phone?.message} {...register("phone")} />
        </div>
        <Input label="WhatsApp" type="tel" hint="Con código de país: +52 55..." {...register("whatsapp")} />
      </FormSection>

      <FormSection title="Perfil profesional">
        <Input label="Especialidad" placeholder="Ej. Propiedades de lujo, Desarrollos, Inversiones" {...register("specialty")} />
        <Input label="Cédula profesional / Licencia" {...register("licenseNumber")} />
        <Textarea label="Biografía" rows={4} hint="Máximo 500 caracteres" error={errors.bio?.message} placeholder="Describe la trayectoria, logros y especialidades del agente…" {...register("bio")} />
      </FormSection>

      <FormSection title="Redes sociales">
        <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." error={errors.linkedinUrl?.message} {...register("linkedinUrl")} />
        <Input label="Instagram" placeholder="https://instagram.com/..." error={errors.instagramUrl?.message} {...register("instagramUrl")} />
      </FormSection>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 text-center">
          <p className="text-emerald-700 font-medium">
            ✓ Agente {mode === "create" ? "registrado" : "actualizado"} exitosamente. Redirigiendo…
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" size="lg" loading={loading} leftIcon={<Save className="h-4 w-4" />}>
            {mode === "create" ? "Registrar agente" : "Guardar cambios"}
          </Button>
          <Button type="button" variant="ghost" size="lg" leftIcon={<X className="h-4 w-4" />} onClick={() => router.back()}>
            Cancelar
          </Button>
          {isDirty && <p className="text-body-xs text-obsidian-400 ml-auto">Cambios sin guardar</p>}
        </div>
      )}
    </form>
  );
}
