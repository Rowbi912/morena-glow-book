import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  STAFF,
  ROLE_LABEL,
  staffSession,
  getStaffAgenda,
  setItemCompleted,
  addMinutes,
  formatPrice,
  notifStore,
  type Staff,
  type Notification,
} from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Lock, LogOut, Check, Clock, User as UserIcon, StickyNote, Sparkles, Bell, X } from "lucide-react";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Mi agenda — Morena Hair Design" }] }),
  component: StaffPage,
});

function StaffPage() {
  const [me, setMe] = useState<Staff | null>(null);
  const [staffId, setStaffId] = useState<string>(STAFF[0].id);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0); // force refresh after mutations

  useEffect(() => { setMe(staffSession.current()); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = staffSession.login(staffId, pin);
    if (!res.ok) { setErr(res.error ?? "Error"); return; }
    setMe(staffSession.current());
    setErr("");
    setPin("");
  }

  if (!me) {
    return (
      <div>
        <SectionHeader eyebrow="Acceso profesional" title="Mi agenda" subtitle="Ingresá con tu PIN para ver tus turnos del día." />
        <form onSubmit={submit} className="px-5">
          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft space-y-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Profesional</span>
              <select value={staffId} onChange={(e) => setStaffId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold">
                {STAFF.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {ROLE_LABEL[s.role]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1"><Lock size={11}/> PIN</span>
              <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" inputMode="numeric" maxLength={6} placeholder="• • • •"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-gold" />
            </label>
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-foreground text-background text-sm py-3">Ingresar</button>
            <p className="text-[11px] text-muted-foreground text-center">Demo · PINs: 1111 / 2222 / 3333 / 4444 / 5555</p>
          </div>
        </form>
      </div>
    );
  }

  return <StaffAgenda me={me} onLogout={() => { staffSession.logout(); setMe(null); }} tick={tick} onChange={() => setTick(tick + 1)} />;
}

function StaffAgenda({ me, onLogout, tick, onChange }: { me: Staff; onLogout: () => void; tick: number; onChange: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const agenda = useMemo(() => getStaffAgenda(me.id, today), [me.id, today, tick]);

  const completed = agenda.filter((x) => x.item.completed).length;
  const revenue = agenda.reduce((s, x) => s + x.item.price, 0);

  return (
    <div className="pb-10">
      <div className="px-5 pt-8 pb-2 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <img src={me.photo} alt={me.name} className="h-12 w-12 rounded-full object-cover ring-1 ring-border" />
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold">Hoy</div>
            <h1 className="font-serif text-2xl">{me.name.split(" ")[0]}</h1>
            <div className="text-[11px] text-muted-foreground">{me.specialty}</div>
          </div>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <LogOut size={13}/> Salir
        </button>
      </div>

      <div className="px-5 mt-5 grid grid-cols-3 gap-2">
        <MiniStat label="Turnos" value={String(agenda.length)} />
        <MiniStat label="Hechos" value={`${completed}/${agenda.length || 0}`} />
        <MiniStat label="Estimado" value={formatPrice(revenue)} />
      </div>

      <section className="px-5 mt-7">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Mi agenda</h2>
        {agenda.length === 0 ? (
          <div className="rounded-2xl bg-card border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No tenés turnos asignados hoy.
          </div>
        ) : (
          <div className="space-y-2.5">
            {agenda.map(({ appt, item, index }) => {
              const start = addMinutes(appt.time, item.startMinutes);
              const end = addMinutes(appt.time, item.startMinutes + item.durationMinutes);
              return (
                <div key={appt.id + index} className={`rounded-2xl border p-4 shadow-soft transition ${
                  item.completed ? "bg-gold-soft/30 border-gold/40" : "bg-card border-border/60"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-gold text-xs font-medium tabular-nums">
                        <Clock size={12}/> {start}–{end} hs
                      </div>
                      <div className="text-sm font-medium mt-1">{item.serviceName}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <UserIcon size={11}/> {appt.name}
                      </div>
                      {item.notes && (
                        <div className="mt-2 rounded-xl bg-gold-soft/30 border border-gold/20 px-2.5 py-1.5 text-[11px] text-foreground/80 flex items-start gap-1.5">
                          <StickyNote size={11} className="text-gold mt-0.5 shrink-0"/> {item.notes}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { setItemCompleted(appt.id, index, !item.completed); onChange(); }}
                      className={`h-9 w-9 rounded-full flex items-center justify-center border transition shrink-0 ${
                        item.completed
                          ? "bg-gold border-gold text-background"
                          : "bg-background border-border text-muted-foreground hover:border-gold hover:text-gold"
                      }`}
                      aria-label="Marcar completado"
                    >
                      <Check size={16}/>
                    </button>
                  </div>
                  {item.completed && item.role === "colorist" && (
                    <div className="mt-3 text-[11px] text-gold flex items-center gap-1.5">
                      <Sparkles size={11}/> Procesado iniciado — se libera el sillón al estilista al finalizar.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-3 shadow-soft text-center">
      <div className="font-serif text-lg tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
