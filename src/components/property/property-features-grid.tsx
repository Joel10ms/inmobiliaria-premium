import {
  Waves, Dumbbell, Building2, Shield, Star, Car,
  Archive, Eye, Trees, Sun, ArrowUp, Film,
  Wifi, Coffee, Utensils, Flame, Wind,
  CheckCircle2,
} from "lucide-react";
import type { PropertyFeature } from "@/types";

// Map feature names to icons
const ICON_MAP: Record<string, React.ElementType> = {
  "Alberca":           Waves,
  "Gimnasio":          Dumbbell,
  "Roof Garden":       Building2,
  "Seguridad 24h":     Shield,
  "Concierge":         Star,
  "Estacionamiento":   Car,
  "Bodega":            Archive,
  "Vista a la Ciudad": Eye,
  "Jardín":            Trees,
  "Terraza":           Sun,
  "Elevador":          ArrowUp,
  "Sala de Cine":      Film,
  "Wi-Fi":             Wifi,
  "Cafetería":         Coffee,
  "Cocina":            Utensils,
  "Chimenea":          Flame,
  "Aire Acondicionado":Wind,
};

// Mock features when property.features is empty (demo)
const DEMO_FEATURES: PropertyFeature[] = [
  { id: "f1",  name: "Alberca",            icon: "pool",     category: "amenidad"  },
  { id: "f2",  name: "Gimnasio",           icon: "dumbbell", category: "amenidad"  },
  { id: "f3",  name: "Roof Garden",        icon: "building", category: "exterior"  },
  { id: "f4",  name: "Seguridad 24h",      icon: "shield",   category: "seguridad" },
  { id: "f5",  name: "Concierge",          icon: "star",     category: "amenidad"  },
  { id: "f6",  name: "Estacionamiento",    icon: "car",      category: "interior"  },
  { id: "f7",  name: "Bodega",             icon: "box",      category: "interior"  },
  { id: "f8",  name: "Vista a la Ciudad",  icon: "eye",      category: "exterior"  },
  { id: "f9",  name: "Jardín",             icon: "leaf",     category: "exterior"  },
  { id: "f10", name: "Terraza",            icon: "sun",      category: "exterior"  },
  { id: "f11", name: "Elevador",           icon: "arrow-up", category: "amenidad"  },
  { id: "f12", name: "Sala de Cine",       icon: "film",     category: "amenidad"  },
];

const categoryLabels: Record<string, string> = {
  interior:  "Interior",
  exterior:  "Exterior y vistas",
  amenidad:  "Amenidades",
  seguridad: "Seguridad",
};

interface PropertyFeaturesGridProps {
  features: PropertyFeature[];
}

export function PropertyFeaturesGrid({ features }: PropertyFeaturesGridProps) {
  const list = features.length > 0 ? features : DEMO_FEATURES;

  // Group by category
  const grouped = list.reduce<Record<string, PropertyFeature[]>>((acc, f) => {
    const key = f.category ?? "amenidad";
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {});

  return (
    <div className="mt-10">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-8" />

      <h2 className="font-playfair font-semibold text-display-sm text-obsidian mb-6">
        Amenidades y características
      </h2>

      <div className="space-y-7">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            {/* Category label */}
            <p className="text-label-sm text-obsidian-400 tracking-widest mb-3">
              {categoryLabels[category] ?? category}
            </p>

            {/* Feature chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {items.map((feat) => {
                const Icon = ICON_MAP[feat.name] ?? CheckCircle2;
                return (
                  <div
                    key={feat.id}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-ivory border border-obsidian-100 hover:border-gold/30 transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4 text-crimson shrink-0" />
                    <span className="text-body-sm text-obsidian">{feat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
