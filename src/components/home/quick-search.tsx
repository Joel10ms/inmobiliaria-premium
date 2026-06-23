"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const zones = [
  "Polanco",
  "Lomas de Chapultepec",
  "Santa Fe",
  "Condesa",
  "Roma Norte",
  "Pedregal",
  "Interlomas",
  "Bosques de las Lomas",
];

const priceRanges = [
  { label: "Hasta $5M",    value: "0-5000000" },
  { label: "$5M – $15M",   value: "5000000-15000000" },
  { label: "$15M – $35M",  value: "15000000-35000000" },
  { label: "$35M – $70M",  value: "35000000-70000000" },
  { label: "+$70M",        value: "70000000-" },
];

export function QuickSearch() {
  const router  = useRouter();
  const [type,       setType]       = React.useState("");
  const [listingType,setListingType]= React.useState("");
  const [zone,       setZone]       = React.useState("");
  const [priceRange, setPriceRange] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type)        params.set("type", type);
    if (listingType) params.set("listingType", listingType);
    if (zone)        params.set("zone", zone);
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      if (min) params.set("priceMin", min);
      if (max) params.set("priceMax", max);
    }
    router.push(`/propiedades?${params.toString()}`);
  };

  const selectClass = cn(
    "h-full w-full bg-transparent border-none outline-none cursor-pointer",
    "font-inter text-body-sm text-obsidian appearance-none",
    "placeholder:text-obsidian-400"
  );

  return (
    <div className="relative z-20 -mt-8 container-luxury section-padding">
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-luxury-lg border border-obsidian-100"
      >
        <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-obsidian-100">

          {/* Tipo de propiedad */}
          <div className="flex-1 px-6 py-4 group hover:bg-ivory-100 rounded-2xl lg:rounded-none lg:rounded-l-2xl transition-colors duration-150">
            <p className="text-label-sm text-obsidian-400 mb-1.5 tracking-wide">Tipo</p>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
              aria-label="Tipo de propiedad"
            >
              <option value="">Todas las propiedades</option>
              {siteConfig.propertyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Operación */}
          <div className="flex-1 px-6 py-4 hover:bg-ivory-100 transition-colors duration-150">
            <p className="text-label-sm text-obsidian-400 mb-1.5 tracking-wide">Operación</p>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className={selectClass}
              aria-label="Tipo de operación"
            >
              <option value="">Venta y Renta</option>
              <option value="VENTA">En Venta</option>
              <option value="RENTA">En Renta</option>
            </select>
          </div>

          {/* Zona */}
          <div className="flex-1 px-6 py-4 hover:bg-ivory-100 transition-colors duration-150">
            <p className="text-label-sm text-obsidian-400 mb-1.5 tracking-wide">Zona</p>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className={selectClass}
              aria-label="Zona"
            >
              <option value="">Cualquier zona</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="flex-1 px-6 py-4 hover:bg-ivory-100 transition-colors duration-150">
            <p className="text-label-sm text-obsidian-400 mb-1.5 tracking-wide">Precio</p>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className={selectClass}
              aria-label="Rango de precio"
            >
              <option value="">Cualquier precio</option>
              {priceRanges.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* CTA */}
          <div className="px-4 py-3 flex items-center rounded-2xl lg:rounded-none lg:rounded-r-2xl">
            <Button type="submit" variant="primary" size="lg" leftIcon={<Search className="h-4 w-4" />} className="w-full lg:w-auto whitespace-nowrap">
              Buscar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
