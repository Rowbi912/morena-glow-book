import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { inventoryStore, type Product } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertTriangle, Package, RefreshCw, CheckCircle2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventario — Morena Hair Design" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => { setProducts(inventoryStore.list()); }, [tick]);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("storage", h);
    const i = setInterval(h, 5000);
    return () => { window.removeEventListener("storage", h); clearInterval(i); };
  }, []);

  function reorder(p: Product) {
    inventoryStore.reorder(p.id, 6);
    setTick(tick + 1);
    toast.success("Pedido enviado al distribuidor L'Oréal", { description: `${p.brand} ${p.name} · 6 ${p.unit}s` });
  }

  return (
    <div className="pb-10">
      <SectionHeader
        eyebrow="Inventario — Simulación Matisse"
        title="Stock en tiempo real"
        subtitle="Las unidades se descuentan automáticamente al completar servicios."
      />
      <div className="px-5 -mt-3 mb-4 flex items-center justify-between">
        <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ChevronLeft size={13}/> Volver al panel</Link>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold inline-flex items-center gap-1"><Package size={11}/> Prototipo</span>
      </div>

      <section className="px-5">
        <div className="space-y-2.5">
          {products.map((p) => {
            const out = p.stock === 0;
            const low = p.stock > 0 && p.stock < p.minStock;
            return (
              <div key={p.id} className={`rounded-2xl border p-4 shadow-soft ${
                out ? "bg-rose-50 border-rose-300" : low ? "bg-amber-50 border-amber-300" : "bg-card border-border/60"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.brand}</div>
                    <div className="text-sm font-medium mt-0.5">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Mínimo {p.minStock} {p.unit}s</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-serif text-2xl tabular-nums ${out ? "text-rose-700" : low ? "text-amber-700" : "text-foreground"}`}>
                      {p.stock}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.unit}s</div>
                  </div>
                </div>
                {(out || low) && (
                  <div className={`mt-3 rounded-xl px-3 py-2 text-[11px] flex items-center gap-1.5 ${
                    out ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                  }`}>
                    <AlertTriangle size={12}/>
                    {out ? "Stock 0 — problema detectado en Matisse" : "Stock bajo — reposición recomendada"}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CheckCircle2 size={11} className="text-gold"/> Sincronizado con turnos completados
                  </div>
                  <button onClick={() => reorder(p)}
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-foreground text-background">
                    <RefreshCw size={11}/> Reordenar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground text-center px-4 leading-relaxed">
          Panel demostrativo de lo que sería una integración real con <strong>Matisse</strong>.
          Resuelve el problema actual de stock negativo (ver INOA 8.0 en 0).
        </p>
      </section>
    </div>
  );
}
