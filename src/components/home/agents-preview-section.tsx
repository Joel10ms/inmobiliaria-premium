import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { AgentCard } from "@/components/agent/agent-card";
import { Button } from "@/components/ui/button";
import { mockAgents } from "@/lib/mock-data";

export function AgentsPreviewSection() {
  return (
    <section className="section-padding bg-ivory" aria-labelledby="agents-heading">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHeader
            id="agents-heading"
            eyebrow="Nuestro equipo"
            title="Asesores de élite a su servicio"
            description="Especialistas con trayectoria comprobada en el mercado inmobiliario premium."
            align="left"
            className="max-w-lg"
          />
          <Button variant="outline" size="md" asChild className="shrink-0">
            <Link href="/agentes">
              Conocer a todos los agentes
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
        </div>

        {/* Agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mockAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}
