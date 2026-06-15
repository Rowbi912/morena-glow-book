import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  apptStore,
  receptionSession,
  checkInClient,
  setArrivalStatus,
  rescheduleAppt,
  logProductsUsed,
  createWalkIn,
  SERVICE_CATEGORIES,
  STAFF,
  ROLE_LABEL,
  SALON_OPEN_MIN,
  SALON_CLOSE_MIN,
  hhmmToMin,
  addMinutes,
  formatPrice,
  getNowMin,
  waitlistStore,
  getNoShowCountByName,
  type Appointment,
  type ArrivalStatus,
  type Staff,
  type WaitlistEntry,
} from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Lock,
  LogOut,
  UserPlus,
  Check,
  Clock,
  Phone as PhoneIcon,
  X,
  CalendarClock,
  Package,
  MessageCircle,
  TrendingUp,
  Users,
  AlertCircle,
  Package,
  AlertTriangle,

} from "lucide-react";

export const Route = createFileRoute("/reception")({
  head: () => ({ meta: [{ title: "Recepción — Morena Hair Design" }] }),
  component: ReceptionPage,
});

function ReceptionPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => { setAuthed(receptionSession.isOn()); }, []);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 15000);
    const h = () => setTick((t) => t + 1);
    window.addEventListener("storage", h);
    return () => { clearInterval(i); window.removeEventListener("storage", h); };
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = receptionSession.login(pin);
    if (!r.ok) { setErr(r.error ?? "Error"); return; }
    setAuthed(true); setErr(""); setPin("");
  }

  if (!authed) {
    return (
      <div>
        <SectionHeader eyebrow="Front desk" title="Recepción" subtitle="Ingresá el PIN para coordinar el día." />
        <form onSubmit={submit} className="px-5">
          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-gold">
              <Lock size={16}/><span className="text-xs uppercase tracking-[0.2em]">PIN</span>
            </div>
            <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" inputMode="numeric" maxLength={6} placeholder="• • • •"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-gold" />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-foreground text-background text-sm py-3">Ingresar</button>
            <p className="text-[11px] text-muted-foreground text-center">Demo · PIN: 9999</p>
            <div className="text-center text-[11px] pt-1">
              <Link to="/staff" className="text-gold mr-3">Profesional</Link>
              <Link to="/admin" className="text-gold">Dueña</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
  return <ReceptionDashboard tick={tick} onLogout={() => { receptionSession.logout(); setAuthed(false); }} onRefresh={() => setTick(tick + 1)} />;
}

function ReceptionDashboard({ tick, onLogout, onRefresh }: { tick: number; onLogout: () => void; onRefresh: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const nowMin = getNowMin();

  const todays = useMemo(() => apptStore.list()
    .filter((a) => a.date === today && a.status !== "Cancelado")
    .sort((a, b) => hhmmToMin(a.time) - hhmmToMin(b.time)),
  [today, tick]);

  // Upcoming arrivals window: now → +2h, plus already-arrived
  const queue = useMemo(() => todays.filter((a) => {
    const start = hhmmToMin(a.time);
    return (a.arrival ?? "pending") !== "done" && start <= nowMin + 120 && start >= nowMin - 30;
  }), [todays, nowMin]);

  // Daily summary
  const attended = todays.filter((a) => (a.arrival ?? "pending") !== "pending").length;
  const revenue = todays.filter((a) => a.arrival !== "pending" || a.status === "Completado").reduce((s, a) => s + a.price, 0);
  const noShows = todays.filter((a) => (a.arrival ?? "pending") === "pending" && hhmmToMin(a.time) < nowMin - 30).length;
  const waits = todays.filter((a) => a.arrival === "arrived" || a.arrival === "in_progress")
    .map((a) => Math.max(0, hhmmToMin(a.arrivedAt ?? a.time) - hhmmToMin(a.time)));
  const avgWait = waits.length ? Math.round(waits.reduce((s, n) => s + n, 0) / waits.length) : 0;

  const [walkInOpen, setWalkInOpen] = useState(false);
  const [productModal, setProductModal] = useState<Appointment | null>(null);
  const [reschedAppt, setReschedAppt] = useState<Appointment | null>(null);

  return (
    <div className="pb-10">
      <div className="px-5 pt-8 pb-2 flex items-end justify-between">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-gold">Recepción</div>
          <h1 className="font-serif text-3xl">Front desk</h1>
          <p className="text-[11px] text-muted-foreground mt-1">Actualizado en vivo</p>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <LogOut size={13}/> Salir
        </button>
      </div>

      {/* Summary */}
      <div className="px-5 mt-5 grid grid-cols-4 gap-2">
        <KStat icon={Users} label="Atendidas" value={String(attended)} />
        <KStat icon={TrendingUp} label="Estimado" value={formatPrice(revenue)} small />
        <KStat icon={AlertCircle} label="No-shows" value={String(noShows)} />
        <KStat icon={Clock} label="Espera prom." value={`${avgWait}'`} />
      </div>

      {/* Arrivals queue */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Próximas 2 horas</h2>
          <button onClick={() => setWalkInOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-gold">
            <UserPlus size={13}/> Walk-in
          </button>
        </div>
        {queue.length === 0 ? (
          <div className="rounded-2xl bg-card border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No hay clientas en cola.
          </div>
        ) : (
          <div className="space-y-2.5">
            {queue.map((a) => (
              <QueueRow key={a.id} appt={a}
                onCheckIn={() => { checkInClient(a.id); onRefresh(); }}
                onStart={() => { setArrivalStatus(a.id, "in_progress"); onRefresh(); }}
                onDone={() => { setArrivalStatus(a.id, "done"); onRefresh(); }}
                onCancel={() => { if (confirm(`¿Cancelar turno de ${a.name}?`)) { apptStore.cancel(a.id); onRefresh(); } }}
                onResched={() => setReschedAppt(a)}
                onProducts={() => setProductModal(a)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Occupancy timeline */}
      <section className="px-5 mt-7">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Ocupación del salón</h2>
        <OccupancyTimeline appts={todays} nowMin={nowMin} />
      </section>

      {/* Modals */}
      {walkInOpen && <WalkInModal onClose={() => setWalkInOpen(false)} onDone={() => { setWalkInOpen(false); onRefresh(); }} />}
      {productModal && <ProductModal appt={productModal} onClose={() => setProductModal(null)} onSave={(p) => { logProductsUsed(productModal.id, p); setProductModal(null); onRefresh(); }} />}
      {reschedAppt && <RescheduleModal appt={reschedAppt} onClose={() => setReschedAppt(null)} onSave={(d, t) => { rescheduleAppt(reschedAppt.id, d, t); setReschedAppt(null); onRefresh(); }} />}
    </div>
  );
}

function KStat({ icon: Icon, label, value, small }: { icon: any; label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-3 shadow-soft">
      <div className="h-7 w-7 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold mb-2">
        <Icon size={13} strokeWidth={1.7}/>
      </div>
      <div className={`font-serif tabular-nums leading-tight ${small ? "text-sm" : "text-lg"}`}>{value}</div>
      <div className="text-[9px] text-muted-foreground tracking-wide uppercase mt-0.5">{label}</div>
    </div>
  );
}

const STATUS_LABEL: Record<ArrivalStatus, string> = {
  pending: "Pendiente",
  arrived: "Llegó",
  in_progress: "En curso",
  done: "Finalizado",
};
const STATUS_CLASS: Record<ArrivalStatus, string> = {
  pending: "bg-secondary text-muted-foreground",
  arrived: "bg-gold-soft text-gold",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

function QueueRow({ appt, onCheckIn, onStart, onDone, onCancel, onResched, onProducts }: {
  appt: Appointment;
  onCheckIn: () => void;
  onStart: () => void;
  onDone: () => void;
  onCancel: () => void;
  onResched: () => void;
  onProducts: () => void;
}) {
  const status: ArrivalStatus = appt.arrival ?? "pending";
  const staffIds = Array.from(new Set((appt.items ?? []).map((i) => i.staffId).filter(Boolean) as string[]));
  const staff = staffIds.map((id) => STAFF.find((s) => s.id === id)?.name.split(" ")[0]).filter(Boolean).join(", ");
  const wa = `https://api.whatsapp.com/send?phone=549${appt.phone}`;
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gold text-xs font-medium tabular-nums">{appt.time}</span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_CLASS[status]}`}>
              {STATUS_LABEL[status]}
            </span>
            {appt.walkIn && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground text-background">Walk-in</span>}
          </div>
          <div className="text-sm font-medium mt-1.5 truncate">{appt.name}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{appt.service}</div>
          {staff && <div className="text-[11px] text-muted-foreground mt-0.5">Con {staff}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="font-serif text-sm tabular-nums">{formatPrice(appt.price)}</div>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] text-gold">
            <MessageCircle size={11}/> WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {status === "pending" && (
          <Action onClick={onCheckIn} primary><Check size={12}/> Check-in</Action>
        )}
        {status === "arrived" && (
          <Action onClick={onStart} primary><Clock size={12}/> Iniciar</Action>
        )}
        {status === "in_progress" && (
          <Action onClick={onDone} primary><Check size={12}/> Finalizar</Action>
        )}
        <Action onClick={onProducts}><Package size={12}/> Productos</Action>
        <Action onClick={onResched}><CalendarClock size={12}/> Mover</Action>
        <Action onClick={onCancel} danger><X size={12}/> Cancelar</Action>
      </div>
    </div>
  );
}

function Action({ children, onClick, primary, danger }: { children: React.ReactNode; onClick: () => void; primary?: boolean; danger?: boolean }) {
  const base = "inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border transition";
  const style = primary
    ? "bg-foreground text-background border-foreground"
    : danger
    ? "bg-background text-destructive border-destructive/30 hover:bg-destructive/5"
    : "bg-background text-foreground border-border hover:border-gold hover:text-gold";
  return <button onClick={onClick} className={`${base} ${style}`}>{children}</button>;
}

function OccupancyTimeline({ appts, nowMin }: { appts: Appointment[]; nowMin: number }) {
  const day = new Date().getDay();
  const workingStaff = STAFF.filter((s) => !s.daysOff.includes(day));
  const totalMin = SALON_CLOSE_MIN - SALON_OPEN_MIN;
  const pct = (m: number) => `${Math.max(0, Math.min(100, ((m - SALON_OPEN_MIN) / totalMin) * 100))}%`;

  type Block = { staffId: string; start: number; end: number; client: string; status: ArrivalStatus };
  const blocks: Block[] = [];
  for (const a of appts) {
    const base = hhmmToMin(a.time);
    for (const it of a.items ?? []) {
      if (!it.staffId) continue;
      blocks.push({ staffId: it.staffId, start: base + it.startMinutes, end: base + it.startMinutes + it.durationMinutes, client: a.name, status: a.arrival ?? "pending" });
    }
  }

  const colorFor = (b: Block) => {
    if (b.status === "in_progress") return "bg-blue-500/80 text-white";
    if (b.status === "done") return "bg-green-500/70 text-white";
    if (b.status === "arrived") return "bg-gold text-background";
    return "bg-foreground/70 text-background";
  };

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <div className="min-w-[640px]">
        <div className="relative h-5 mb-2">
          {Array.from({ length: 10 }).map((_, i) => {
            const h = 9 + i;
            return (
              <div key={h} className="absolute -translate-x-1/2 text-[10px] text-muted-foreground tabular-nums" style={{ left: pct(h * 60) }}>
                {String(h).padStart(2, "0")}
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          {workingStaff.map((s) => (
            <StaffRow key={s.id} staff={s} blocks={blocks.filter((b) => b.staffId === s.id)} colorFor={colorFor} pct={pct} nowMin={nowMin} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <Legend cls="bg-foreground/70" label="Reservado" />
          <Legend cls="bg-gold" label="Llegó" />
          <Legend cls="bg-blue-500/80" label="En curso" />
          <Legend cls="bg-green-500/70" label="Finalizado" />
        </div>
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return <span className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${cls}`}/> {label}</span>;
}

function StaffRow({ staff, blocks, colorFor, pct, nowMin }: {
  staff: Staff;
  blocks: { staffId: string; start: number; end: number; client: string; status: ArrivalStatus }[];
  colorFor: (b: any) => string;
  pct: (m: number) => string;
  nowMin: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 shrink-0 flex items-center gap-2">
        <img src={staff.photo} alt={staff.name} className="h-7 w-7 rounded-full ring-1 ring-border"/>
        <div className="min-w-0">
          <div className="text-[11px] font-medium truncate">{staff.name.split(" ")[0]}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{ROLE_LABEL[staff.role]}</div>
        </div>
      </div>
      <div className="relative flex-1 h-10 rounded-xl bg-secondary/70 border border-border/60 overflow-hidden">
        {/* now indicator */}
        {nowMin >= SALON_OPEN_MIN && nowMin <= SALON_CLOSE_MIN && (
          <div className="absolute top-0 bottom-0 w-px bg-destructive" style={{ left: pct(nowMin) }} title="Ahora" />
        )}
        {blocks.map((b, i) => (
          <div key={i} className={`absolute top-1 bottom-1 rounded-md px-1.5 text-[9px] flex items-center overflow-hidden shadow-sm ${colorFor(b)}`}
            style={{ left: pct(b.start), width: `calc(${pct(b.end)} - ${pct(b.start)})` }}
            title={`${addMinutes("00:00", b.start)}–${addMinutes("00:00", b.end)} · ${b.client}`}>
            <span className="truncate">{b.client.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalkInModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICE_CATEGORIES[0].services[0].name);
  const [err, setErr] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Falta el nombre"); return; }
    const r = createWalkIn(service, name.trim(), phone.trim() || "—");
    if (!r.ok) { setErr(r.error); return; }
    onDone();
  }
  return (
    <Modal title="Walk-in" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Cliente"><input value={name} onChange={(e) => setName(e.target.value)} className="input"/></Field>
        <Field label="Teléfono"><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="input"/></Field>
        <Field label="Servicio">
          <select value={service} onChange={(e) => setService(e.target.value)} className="input">
            {SERVICE_CATEGORIES.map((c) => (
              <optgroup key={c.id} label={c.name}>
                {c.services.map((s) => <option key={s.name} value={s.name}>{s.name} · {formatPrice(s.price)}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button type="submit" className="w-full rounded-full bg-foreground text-background text-sm py-3">Asignar y check-in</button>
        <p className="text-[10px] text-muted-foreground text-center">Se asigna automáticamente al primer profesional disponible.</p>
      </form>
    </Modal>
  );
}

function ProductModal({ appt, onClose, onSave }: { appt: Appointment; onClose: () => void; onSave: (p: string[]) => void }) {
  const [text, setText] = useState((appt.productsUsed ?? []).join("\n"));
  return (
    <Modal title={`Productos · ${appt.name}`} onClose={onClose}>
      <p className="text-xs text-muted-foreground mb-2">Un producto por línea (ej.: L'Oréal INOA 7.5).</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="input resize-none" />
      <button onClick={() => onSave(text.split("\n").map((s) => s.trim()).filter(Boolean))}
        className="mt-3 w-full rounded-full bg-foreground text-background text-sm py-3">Guardar</button>
    </Modal>
  );
}

function RescheduleModal({ appt, onClose, onSave }: { appt: Appointment; onClose: () => void; onSave: (d: string, t: string) => void }) {
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);
  return (
    <Modal title={`Mover turno · ${appt.name}`} onClose={onClose}>
      <Field label="Fecha"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input"/></Field>
      <Field label="Hora"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input mt-2"/></Field>
      <button onClick={() => onSave(date, time)} className="mt-4 w-full rounded-full bg-foreground text-background text-sm py-3">Reprogramar</button>
      <p className="text-[10px] text-muted-foreground text-center mt-2">Se enviará una notificación al cliente por WhatsApp.</p>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-background rounded-3xl shadow-elegant p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"><X size={14}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}
