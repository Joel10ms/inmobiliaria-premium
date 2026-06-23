"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Schema ───────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
type LoginValues = z.infer<typeof loginSchema>;

// ─── Field component ──────────────────────────────────────────────
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-obsidian-600">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/admin";

  const [showPwd,   setShowPwd]   = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginValues) => {
    setAuthError(null);
    const result = await signIn("credentials", {
      email:    data.email,
      password: data.password,
      redirect: false,
    });

    if (!result?.ok) {
      setAuthError("Credenciales inválidas. Verifica tu email y contraseña.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* ─── Auth error ──────────────────────────────────── */}
      {authError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
          <span>{authError}</span>
        </div>
      )}

      {/* ─── Email ───────────────────────────────────────── */}
      <Field label="Correo electrónico" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="admin@elitepropiedades.com"
          className={cn(
            "w-full h-11 px-4 rounded-xl border bg-white text-sm text-obsidian",
            "placeholder:text-obsidian-300 outline-none transition-all duration-150",
            "focus:ring-2 focus:ring-crimson/20 focus:border-crimson",
            errors.email ? "border-red-400 ring-1 ring-red-200" : "border-obsidian-200"
          )}
          {...register("email")}
        />
      </Field>

      {/* ─── Password ────────────────────────────────────── */}
      <Field label="Contraseña" error={errors.password?.message}>
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={cn(
              "w-full h-11 pl-4 pr-11 rounded-xl border bg-white text-sm text-obsidian",
              "placeholder:text-obsidian-300 outline-none transition-all duration-150",
              "focus:ring-2 focus:ring-crimson/20 focus:border-crimson",
              errors.password ? "border-red-400 ring-1 ring-red-200" : "border-obsidian-200"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-obsidian-400 hover:text-obsidian transition-colors"
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      {/* ─── Submit ──────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full h-11 rounded-xl font-semibold text-sm text-white transition-all duration-200",
          "flex items-center justify-center gap-2",
          "bg-crimson hover:bg-crimson-600 active:scale-[0.98]",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
          "shadow-sm hover:shadow-crimson/30 hover:shadow-lg"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando…
          </>
        ) : (
          "Iniciar sesión"
        )}
      </button>

      {/* ─── Dev credentials hint ────────────────────────── */}
      <div className="border border-dashed border-obsidian-200 rounded-xl p-4 bg-obsidian-50/30">
        <p className="text-[11px] font-semibold text-obsidian-400 uppercase tracking-wider mb-2">
          Credenciales de desarrollo
        </p>
        <div className="space-y-1">
          {[
            { label: "Super Admin", email: "admin@elitepropiedades.com",     pwd: "Admin@1234!" },
            { label: "Agente",      email: "alejandro@elitepropiedades.com", pwd: "Agente@1234!" },
          ].map((c) => (
            <button
              key={c.email}
              type="button"
              onClick={() => {
                // Using a form helper isn't available here, so we trigger submit manually
                const form = document.querySelector("form");
                const emailInput    = form?.querySelector<HTMLInputElement>("input[type='email']");
                const passwordInput = form?.querySelector<HTMLInputElement>("input[type='password'], input[type='text']");
                if (emailInput && passwordInput) {
                  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
                    ?.set?.call(emailInput, c.email);
                  emailInput.dispatchEvent(new Event("input", { bubbles: true }));
                  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
                    ?.set?.call(passwordInput, c.pwd);
                  passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
                }
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white border border-obsidian-100 hover:border-crimson/30 hover:bg-crimson/5 transition-all duration-150 group"
            >
              <span className="text-[11px] font-semibold text-crimson/70 group-hover:text-crimson block">{c.label}</span>
              <span className="text-xs text-obsidian-500 font-mono block leading-tight">{c.email}</span>
              <span className="text-xs text-obsidian-300 font-mono">{c.pwd}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-obsidian-300 mt-2">Haz clic en un perfil para completar los campos automáticamente.</p>
      </div>
    </form>
  );
}
