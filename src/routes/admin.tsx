import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  adminStore,
  apptStore,
  reviewStore,
  STAFF,
  ROLE_LABEL,
  SALON_OPEN_MIN,
  SALON_CLOSE_MIN,
  hhmmToMin,
  addMinutes,
  formatPrice,
  type Staff,
} from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { CalendarDays, Star, Lock, LogOut, TrendingUp, Gauge } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Panel — Morena Hair Design" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => { setAuthed(adminStore.isOn()); }, []);
  // Re-render every 30s and on storage changes for "real-time" feel
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30000);
    const h = () => setTick((t) => t + 1);
    window.addEventListener("storage", h);
    return () => { clearInterval(i); window.removeEventListener("storage", h); };
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === "2828") { adminStore.set(true); setAuthed(true); setErr(""); }
    else setErr("PIN incorrecto. Probá 2828.");
  }

  if (!authed) {
    return (
      <div>
        <SectionHeader eyebrow="Acceso restringido" title="Panel de la dueña" subtitle="Ingresá el PIN del salón para continuar." />
        <form onSubmit={submit} className="px-5">
          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-gold">
              <Lock size={16}/><span className="text-xs uppercase tracking-[0.2em]">PIN</span>
            </div>
            <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" inputMode="numeric" maxLength={6} placeholder="• • • •"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-gold" />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-foreground text-background text-sm py-3">Ingresar</button>
            <p className="text-[11px] text-muted-foreground text-center">Demo · PIN: 2828</p>
            <Link to="/staff" className="block text-center text-[11px] text-gold mt-2">Soy profesional · entrar acá</Link>
            <Link to="/reception" className="block text-center text-[11px] text-gold mt-1">Soy recepción · entrar acá</Link>
          </div>
        </form>
      </div>
    );
  }

  return <Dashboard tick={tick} onLogout={() => { adminStore.set(false); setAuthed(false); }} />;
}

type Block = { staffId: string; start: number; end: number; client: string; service: string };

function Dashboard({ tick, onLogout }: { tick: number; onLogout: () => void }) {
  const today = new Date().toISOString().slice(0, 10);

  const { blocks, revenue, occupancy, idleGapsByStaff } = useMemo(() => {
    const appts = apptStore.list().filter((a) => a.date === today && a.status !== "Cancelado");
    const blocks: Block[] = [];
    let revenue = 0;
    for (const a of appts) {
      revenue += a.price;
      const base = hhmmToMin(a.time);
      for (const it of a.items ?? []) {
        if (!it.staffId) continue;
        blocks.push({
          staffId: it.staffId,
          start: base + it.startMinutes,
          end: base + it.startMinutes + it.durationMinutes,
          client: a.name,
          service: it.serviceName,
        });
      }
    }

    const workingStaff = STAFF.filter((s) => !s.daysOff.includes(new Date().getDay()));
    const workMinPerStaff = SALON_CLOSE_MIN - SALON_OPEN_MIN;
    const totalCapacity = workingStaff.length * workMinPerStaff;
    const totalBooked = blocks
      .filter((b) => workingStaff.some((s) => s.id === b.staffId))
      .reduce((s, b) => s + (b.end - b.start), 0);
    const occupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    // Idle gaps >= 45 min per working staff
    const idleGapsByStaff: Record<string, { start: number; end: number }[]> = {};
    for (const s of workingStaff) {
      const mine = blocks.filter((b) => b.staffId === s.id).sort((a, b) => a.start - b.start);
      const gaps: { start: number; end: number }[] = [];
      let cursor = SALON_OPEN_MIN;
      for (const b of mine) {
        if (b.start - cursor >= 45) gaps.push({ start: cursor, end: b.start });
        cursor = Math.max(cursor, b.end);
      }
      if (SALON_CLOSE_MIN - cursor >= 45) gaps.push({ start: cursor, end: SALON_CLOSE_MIN });
      idleGapsByStaff[s.id] = gaps;
    }

    return { blocks, revenue, occupancy, idleGapsByStaff };
  }, [today, tick]);

  const reviews = reviewStore.list().slice(0, 3);

  return (
    <div className="pb-10">
      <div className="px-5 pt-8 pb-2 flex items-end justify-between">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-gold">Panel</div>
          <h1 className="font-serif text-3xl">Hola, Morena</h1>
          <p className="text-[11px] text-muted-foreground mt-1">Actualizado en vivo</p>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <LogOut size={13}/> Salir
        </button>
      </div>

      <div className="px-5 mt-5 grid grid-cols-3 gap-2">
        <KStat icon={CalendarDays} label="Turnos hoy" value={String(new Set(blocks.map((b) => b.client + b.service)).size)} />
        <KStat icon={Gauge} label="Ocupación" value={`${occupancy}%`} />
        <KStat icon={TrendingUp} label="Estimado" value={formatPrice(revenue)} />
      </div>

      <section className="px-5 mt-7">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Agenda del equipo</h2>
        <TeamTimeline blocks={blocks} idleGaps={idleGapsByStaff} />
      </section>

      <section className="px-5 mt-7">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Espacios libres a llenar</h2>
        <IdleSummary idleGaps={idleGapsByStaff} />
      </section>

      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Últimas reseñas</h2>
          <Link to="/reviews" className="text-[11px] text-gold">Ver todas</Link>
        </div>
        <div className="space-y-2.5">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="inline-flex items-center gap-0.5 text-gold">
                  {Array.from({length: r.rating}).map((_,i) => <Star key={i} size={12} className="fill-gold"/>)}
                </div>
              </div>
              {r.service && <div className="text-[11px] text-muted-foreground mt-0.5">{r.service}</div>}
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function KStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-3 shadow-soft">
      <div className="h-7 w-7 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold mb-2">
        <Icon size={14} strokeWidth={1.7}/>
      </div>
      <div className="font-serif text-xl tabular-nums leading-tight">{value}</div>
      <div className="text-[10px] text-muted-foreground tracking-wide uppercase mt-0.5">{label}</div>
    </div>
  );
}

function TeamTimeline({ blocks, idleGaps }: { blocks: Block[]; idleGaps: Record<string, { start: number; end: number }[]> }) {
  const day = new Date().getDay();
  const workingStaff = STAFF.filter((s) => !s.daysOff.includes(day));
  const totalMin = SALON_CLOSE_MIN - SALON_OPEN_MIN;
  const pct = (m: number) => `${((m - SALON_OPEN_MIN) / totalMin) * 100}%`;

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <div className="min-w-[640px]">
        {/* Hour axis */}
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
            <StaffRow key={s.id} staff={s}
              blocks={blocks.filter((b) => b.staffId === s.id)}
              gaps={idleGaps[s.id] ?? []}
              pct={pct} />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold"/> Turno</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-400/70"/> Tiempo libre &gt;45'</span>
        </div>
      </div>
    </div>
  );
}

function StaffRow({ staff, blocks, gaps, pct }: {
  staff: Staff;
  blocks: Block[];
  gaps: { start: number; end: number }[];
  pct: (m: number) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 flex items-center gap-2">
        <img src={staff.photo} alt={staff.name} className="h-7 w-7 rounded-full ring-1 ring-border"/>
        <div className="min-w-0">
          <div className="text-[11px] font-medium truncate">{staff.name.split(" ")[0]}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{ROLE_LABEL[staff.role]}</div>
        </div>
      </div>
      <div className="relative flex-1 h-10 rounded-xl bg-secondary/70 border border-border/60 overflow-hidden">
        {gaps.map((g, i) => (
          <div key={"g" + i} className="absolute top-0 bottom-0 bg-amber-400/25 border-x border-amber-400/40"
            style={{ left: pct(g.start), width: `calc(${pct(g.end)} - ${pct(g.start)})` }}
            title={`Libre ${minToHHMM(g.start)}–${minToHHMM(g.end)}`} />
        ))}
        {blocks.map((b, i) => (
          <div key={i} className="absolute top-1 bottom-1 bg-gold text-background rounded-md px-1.5 text-[9px] flex items-center overflow-hidden shadow-sm"
            style={{ left: pct(b.start), width: `calc(${pct(b.end)} - ${pct(b.start)})` }}
            title={`${minToHHMM(b.start)}–${minToHHMM(b.end)} · ${b.client} · ${b.service}`}>
            <span className="truncate">{b.client.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdleSummary({ idleGaps }: { idleGaps: Record<string, { start: number; end: number }[]> }) {
  const rows = STAFF.flatMap((s) => (idleGaps[s.id] ?? []).map((g) => ({ s, g }))).sort((a, b) => (b.g.end - b.g.start) - (a.g.end - a.g.start));
  if (rows.length === 0) {
    return <div className="rounded-2xl bg-card border border-dashed border-border p-4 text-sm text-muted-foreground text-center">Agenda llena. ¡Buen trabajo!</div>;
  }
  return (
    <div className="space-y-2">
      {rows.slice(0, 5).map(({ s, g }, i) => (
        <div key={i} className="rounded-2xl bg-amber-50/60 border border-amber-300/40 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={s.photo} alt={s.name} className="h-7 w-7 rounded-full"/>
            <div>
              <div className="text-xs font-medium">{s.name}</div>
              <div className="text-[10px] text-muted-foreground">{ROLE_LABEL[s.role]}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs tabular-nums text-amber-700 font-medium">{minToHHMM(g.start)}–{minToHHMM(g.end)}</div>
            <div className="text-[10px] text-muted-foreground">{g.end - g.start} min libres</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function minToHHMM(m: number) {
  return addMinutes("00:00", m);
}
