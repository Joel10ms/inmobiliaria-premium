import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="font-playfair italic text-[120px] font-bold text-obsidian/10 leading-none select-none">
          404
        </p>
        <h1 className="font-playfair text-display-md font-bold text-obsidian -mt-4 mb-4">
          Página no encontrada
        </h1>
        <div className="h-px w-12 bg-gold mx-auto mb-6" />
        <p className="text-body-lg text-obsidian-400 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/propiedades">Ver propiedades</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
