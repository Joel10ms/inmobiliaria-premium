import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Star } from "lucide-react";
import { buildAgentUrl, buildWhatsAppUrl } from "@/lib/utils";
import type { Agent } from "@/types";

interface PropertyAgentSidebarProps {
  agent: Agent;
}

export function PropertyAgentSidebar({ agent }: PropertyAgentSidebarProps) {
  const href        = buildAgentUrl(agent.slug);
  const whatsappUrl = agent.whatsapp
    ? buildWhatsAppUrl(
        agent.whatsapp,
        `Hola ${agent.name}, vi una propiedad en su portal y me gustaría recibir más información.`
      )
    : undefined;

  return (
    <div className="bg-white rounded-2xl border border-obsidian-100 shadow-card overflow-hidden">
      {/* Header strip */}
      <div className="bg-obsidian px-5 py-4 flex items-center gap-3">
        <Star className="h-4 w-4 text-gold fill-gold" />
        <p className="text-label-sm text-white tracking-wide">Asesor asignado</p>
      </div>

      <div className="p-5">
        {/* Agent info */}
        <div className="flex items-start gap-4 mb-5">
          {/* Photo */}
          <Link href={href} className="shrink-0">
            {agent.photo ? (
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-gold/30 ring-2 ring-white shadow-md">
                <Image
                  src={agent.photo}
                  alt={`${agent.name} ${agent.lastName}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-obsidian-100 flex items-center justify-center border-2 border-gold/30">
                <span className="font-playfair font-bold text-display-sm text-obsidian-400">
                  {agent.name[0]}{agent.lastName[0]}
                </span>
              </div>
            )}
          </Link>

          {/* Name + specialty */}
          <div className="min-w-0">
            <Link href={href}>
              <p className="font-playfair font-semibold text-body-xl text-obsidian hover:text-crimson transition-colors leading-tight">
                {agent.name} {agent.lastName}
              </p>
            </Link>
            {agent.specialty && (
              <p className="text-body-xs text-obsidian-400 mt-0.5 line-clamp-2 leading-relaxed">
                {agent.specialty}
              </p>
            )}
            {agent.properties != null && (
              <p className="text-body-xs text-gold mt-1 font-medium">
                {agent.properties} propiedades
              </p>
            )}
          </div>
        </div>

        {/* Bio excerpt */}
        {agent.bio && (
          <>
            <div className="h-px bg-obsidian-100 mb-4" />
            <p className="text-body-sm text-obsidian-400 line-clamp-3 leading-relaxed mb-4">
              {agent.bio}
            </p>
          </>
        )}

        {/* Contact buttons */}
        <div className="flex flex-col gap-2.5">
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-lg border border-obsidian-200 text-label-sm text-obsidian hover:bg-obsidian hover:text-white hover:border-obsidian transition-all duration-200"
          >
            <Phone className="h-4 w-4" />
            {agent.phone}
          </a>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-emerald-600 text-white text-label-sm hover:bg-emerald-700 transition-colors duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </div>

        {/* Profile link */}
        <div className="mt-3 text-center">
          <Link
            href={href}
            className="text-body-xs text-obsidian-400 hover:text-crimson underline underline-offset-2 transition-colors"
          >
            Ver perfil completo
          </Link>
        </div>
      </div>
    </div>
  );
}
