import type { Metadata } from "next";
import { Settings }     from "lucide-react";

export const metadata: Metadata = { title: "Configuración | Admin" };

export default function ConfiguracionPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="h-14 w-14 rounded-2xl bg-obsidian-100 flex items-center justify-center mb-5">
        <Settings className="h-7 w-7 text-obsidian-400" />
      </div>
      <h2 className="font-playfair font-bold text-display-sm text-obsidian mb-2">Configuración</h2>
      <p className="text-body-sm text-obsidian-400 max-w-sm">
        Esta sección estará disponible en una próxima fase. Incluirá ajustes del sitio,
        integraciones de terceros y gestión de roles.
      </p>
    </div>
  );
}
