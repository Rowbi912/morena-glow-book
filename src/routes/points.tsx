import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { getPointsInfo } from "@/lib/salon-data";
import { Gift, Check, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/points")({
  head: () => ({ meta: [{ title: "Mis puntos — Morena Hair Design" }] }),
  component: PointsPage,
});

function PointsPage() {
  const { current, goal, rewards, history } = getPointsInfo();
  const pct = Math.min(100, (current / goal) * 100);
  const remaining = goal - current;

  return (
    <div>
      <SectionHeader eyebrow="Programa fidelidad" title="Mis puntos" subtitle="Acumulá visitas y ganá premios exclusivos del salón." />

      <div className="px-5">
        <div className="rounded-3xl bg-foreground text-background p-6 shadow-elegant relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-gold">
              <Gift size={16} />
              <span className="text-[11px] tracking-[0.25em] uppercase">Próximo premio</span>
            </div>
            <p className="font-serif text-2xl mt-3 leading-snug">
              {current >= goal
                ? "¡Tenés un corte de regalo disponible! 🎉"
                : `${current} de ${goal} visitas completadas`}
            </p>
            <p className="text-sm text-background/70 mt-2">
              {remaining > 0
                ? `Te faltan ${remaining} visita${remaining===1?"":"s"} para tu próximo corte gratis.`
                : "Canjéalo en tu próxima reserva."}
            </p>

            <div className="mt-5 h-2 bg-background/15 rounded-full overflow-hidden">
              <div className="h-full bg-gold transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px] tracking-wider uppercase text-background/60">
              <span>{current} visitas</span>
              <span>{goal} = corte gratis</span>
            </div>
          </div>
        </div>

        {rewards > 0 && (
          <div className="mt-4 rounded-2xl bg-gold-soft/40 border border-gold/30 p-4 text-sm flex items-center gap-3">
            <Check size={16} className="text-gold" />
            <span>Ya ganaste <strong>{rewards}</strong> premio{rewards===1?"":"s"} acumulado{rewards===1?"":"s"}.</span>
          </div>
        )}
      </div>

      <div className="px-5 mt-8 pb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Historial de visitas</h2>
        {history.length === 0 ? (
          <div className="rounded-2xl bg-card border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">Todavía no tenés visitas registradas.</p>
            <Link to="/book" className="mt-4 inline-flex items-center rounded-full bg-foreground text-background text-sm px-5 py-2.5">
              Reservar primera visita
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((a, idx) => (
              <div key={a.id} className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold text-xs font-medium tabular-nums">
                  {String(history.length - idx).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.service}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <CalendarDays size={12} />
                    {new Date(a.date+"T00:00:00").toLocaleDateString("es-AR",{day:"numeric",month:"short",year:"numeric"})}
                  </div>
                </div>
                <Check size={16} className="text-gold" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
