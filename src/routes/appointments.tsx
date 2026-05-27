import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { apptStore, type Appointment, type AppointmentStatus } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { CalendarDays, Clock, CalendarPlus } from "lucide-react";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Mis turnos — Morena Hair Design" }] }),
  component: AppointmentsPage,
});

const statusStyle: Record<AppointmentStatus, string> = {
  Confirmado: "bg-gold-soft/60 text-gold",
  Completado: "bg-secondary text-muted-foreground",
  Cancelado: "bg-destructive/10 text-destructive",
};

function AppointmentsPage() {
  const [list, setList] = useState<Appointment[]>(() => apptStore.list());
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = list.filter((a) => a.date >= today && a.status === "Confirmado").sort((a,b) => a.date.localeCompare(b.date));
  const past = list.filter((a) => a.date < today || a.status !== "Confirmado").sort((a,b) => b.date.localeCompare(a.date));

  function cancel(id: string) {
    setList(apptStore.cancel(id));
  }

  return (
    <div>
      <SectionHeader eyebrow="Agenda" title="Mis turnos" />
      <div className="px-5 space-y-8 pb-6">
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Próximos</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl bg-card border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">No tenés turnos próximos.</p>
              <Link to="/book" className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm px-5 py-2.5">
                <CalendarPlus size={16}/> Reservar ahora
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((a) => <ApptCard key={a.id} a={a} onCancel={cancel} />)}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Historial</h2>
            <div className="space-y-2.5">
              {past.map((a) => <ApptCard key={a.id} a={a} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ApptCard({ a, onCancel }: { a: Appointment; onCancel?: (id: string) => void }) {
  const d = new Date(a.date + "T00:00:00");
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] text-muted-foreground">{a.category}</div>
          <div className="text-sm font-medium mt-0.5">{a.service}</div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 font-medium ${statusStyle[a.status]}`}>
          {a.status}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><CalendarDays size={13}/> {d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}</span>
        <span className="flex items-center gap-1.5"><Clock size={13}/> {a.time} hs</span>
      </div>
      {onCancel && a.status === "Confirmado" && (
        <button
          onClick={() => onCancel(a.id)}
          className="mt-3 text-xs text-destructive hover:underline"
        >
          Cancelar turno
        </button>
      )}
    </div>
  );
}
