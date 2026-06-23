import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildAgentUrl, buildWhatsAppUrl } from "@/lib/utils";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent:      Agent;
  className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
  const href        = buildAgentUrl(agent.slug);
  const whatsappUrl = agent.whatsapp
    ? buildWhatsAppUrl(agent.whatsapp, `Hola ${agent.name}, me gustaría recibir asesoría sobre propiedades de lujo.`)
    : undefined;

  return (
    <article
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-obsidian-100 shadow-card",
        "hover:shadow-card-hover transition-all duration-400 ease-luxury hover:-translate-y-1",
        className
      )}
    >
      {/* Photo */}
      <Link href={href} className="block relative h-72 overflow-hidden bg-obsidian-100">
        {agent.photo ? (
          <Image
            src={agent.photo}
            alt={`${agent.name} ${agent.lastName}`}
            fill
            className="object-cover object-center transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian-100">
            <span className="font-playfair font-bold text-display-md text-obsidian-400">
              {agent.name[0]}{agent.lastName[0]}
            </span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Properties badge */}
        {agent.properties != null && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <p className="text-label-sm text-obsidian">
              <span className="font-bold text-crimson">{agent.properties}</span> props.
            </p>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-5">
        {/* Gold accent line */}
        <div className="w-8 h-0.5 bg-gold mb-3" />

        {/* Name */}
        <Link href={href}>
          <h3 className="font-playfair font-semibold text-body-xl text-obsidian hover:text-crimson transition-colors duration-200 leading-snug">
            {agent.name} {agent.lastName}
          </h3>
        </Link>

        {/* Specialty */}
        {agent.specialty && (
          <p className="text-body-sm text-obsidian-400 mt-1 line-clamp-2 leading-relaxed">
            {agent.specialty}
          </p>
        )}

        {/* Bio */}
        {agent.bio && (
          <p className="text-body-xs text-obsidian-400 mt-3 line-clamp-3 leading-relaxed border-t border-obsidian-100 pt-3">
            {agent.bio}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center gap-3">
        <a
          href={`tel:${agent.phone}`}
          className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-obsidian-200 text-label-sm text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-white transition-all duration-200"
          aria-label={`Llamar a ${agent.name}`}
        >
          <Phone className="h-4 w-4" />
          Llamar
        </a>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-600 text-white text-label-sm hover:bg-emerald-700 transition-colors duration-200"
            aria-label={`WhatsApp a ${agent.name}`}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
