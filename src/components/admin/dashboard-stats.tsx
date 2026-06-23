import { Building2, Users, MessageSquare, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

interface Stat {
  label:       string;
  value:       string;
  change:      number;
  changeLabel: string;
  icon:        React.ElementType;
  accent:      string;
}

const stats: Stat[] = [
  {
    label:       "Propiedades activas",
    value:       "24",
    change:      +12,
    changeLabel: "vs. mes anterior",
    icon:        Building2,
    accent:      "bg-crimson/10 text-crimson",
  },
  {
    label:       "Leads este mes",
    value:       "47",
    change:      +23,
    changeLabel: "vs. mes anterior",
    icon:        MessageSquare,
    accent:      "bg-gold/10 text-gold-600",
  },
  {
    label:       "Propiedades vendidas",
    value:       "8",
    change:      -2,
    changeLabel: "vs. mes anterior",
    icon:        TrendingUp,
    accent:      "bg-emerald-50 text-emerald-700",
  },
  {
    label:       "Agentes activos",
    value:       "3",
    change:      0,
    changeLabel: "sin cambios",
    icon:        Users,
    accent:      "bg-obsidian-100 text-obsidian-600",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon   = stat.icon;
        const isPos  = stat.change > 0;
        const isNeg  = stat.change < 0;
        const TrendIcon = isPos ? ArrowUp : ArrowDown;

        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-obsidian-100 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-body-sm text-obsidian-400">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="font-playfair font-bold text-display-md text-obsidian leading-none mb-2">
              {stat.value}
            </p>

            <div className={`flex items-center gap-1 text-body-xs ${
              isPos ? "text-emerald-600" : isNeg ? "text-red-500" : "text-obsidian-400"
            }`}>
              {stat.change !== 0 && <TrendIcon className="h-3 w-3" />}
              <span>
                {stat.change !== 0 ? `${isPos ? "+" : ""}${stat.change}%` : "—"}{" "}
                <span className="text-obsidian-300">{stat.changeLabel}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
