import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SERVICE_CATEGORIES, formatPrice } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import * as Icons from "lucide-react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Servicios — Morena Hair Design" },
      { name: "description", content: "Cortes, color, tratamientos, peinados, manos y pies, maquillaje y spa." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [open, setOpen] = useState<string | null>(SERVICE_CATEGORIES[0].id);
  return (
    <div>
      <SectionHeader eyebrow="Carta" title="Nuestros servicios" subtitle="Precios de referencia. Consultá por combos y promociones." />
      <div className="px-5 space-y-3 pb-6">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = (Icons as any)[cat.icon] ?? Icons.Sparkles;
          const isOpen = open === cat.id;
          return (
            <div key={cat.id} className="rounded-2xl bg-card border border-border/60 shadow-soft overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : cat.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="h-10 w-10 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">{cat.services.length} servicios</div>
                </div>
                <ChevronDown size={18} className={`text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-2.5 border-t border-border/60 pt-3">
                  {cat.services.map((s) => (
                    <div key={s.name} className="flex items-baseline justify-between gap-3 py-1">
                      <div>
                        <div className="text-sm text-foreground">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.duration} min</div>
                      </div>
                      <div className="flex-1 border-b border-dashed border-border/70 mx-2 translate-y-[-3px]" />
                      <div className="text-sm text-gold font-medium tabular-nums">{formatPrice(s.price)}</div>
                    </div>
                  ))}
                  <Link
                    to="/book"
                    search={{ category: cat.id } as any}
                    className="mt-3 inline-flex items-center justify-center w-full rounded-full bg-foreground text-background text-sm py-2.5"
                  >
                    Reservar en {cat.name.split(" ")[0]}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
