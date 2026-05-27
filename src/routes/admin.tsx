import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminStore, apptStore, reviewStore } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, CalendarDays, Star, Clock, Lock, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Panel — Morena Hair Design" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { setAuthed(adminStore.isOn()); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Mock PIN — owner code
    if (pin === "2828") {
      adminStore.set(true);
      setAuthed(true);
      setErr("");
    } else {
      setErr("PIN incorrecto. Probá 2828.");
    }
  }

  if (!authed) {
    return (
      <div>
        <SectionHeader eyebrow="Acceso restringido" title="Panel de la dueña" subtitle="Ingresá el PIN del salón para continuar." />
        <form onSubmit={submit} className="px-5">
          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-gold">
              <Lock size={16}/>
              <span className="text-xs uppercase tracking-[0.2em]">PIN</span>
            </div>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="• • • •"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-gold"
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-foreground text-background text-sm py-3">Ingresar</button>
            <p className="text-[11px] text-muted-foreground text-center">Demo · PIN: 2828</p>
          </div>
        </form>
      </div>
    );
  }

  const today = apptStore.todayForAdmin();
  const reviews = reviewStore.list().slice(0, 4);
  // Mock weekly count
  const weekTotal = 32;

  function logout() {
    adminStore.set(false);
    setAuthed(false);
  }

  return (
    <div>
      <div className="px-5 pt-8 pb-2 flex items-end justify-between">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-gold">Panel</div>
          <h1 className="font-serif text-3xl">Hola, Morena</h1>
        </div>
        <button onClick={logout} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <LogOut size={13}/> Salir
        </button>
      </div>

      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        <Stat icon={CalendarDays} label="Turnos hoy" value={String(today.length)} />
        <Stat icon={Users} label="Esta semana" value={String(weekTotal)} />
      </div>

      <section className="px-5 mt-8">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Agenda de hoy</h2>
        <div className="space-y-2.5">
          {today.map((a) => (
            <div key={a.id} className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft flex items-center gap-4">
              <div className="text-center w-14 shrink-0">
                <div className="font-serif text-xl text-gold">{a.time}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">hs</div>
              </div>
              <div className="flex-1 border-l border-border/60 pl-4">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.service}</div>
              </div>
              <Clock size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-8 pb-6">
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

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
      <div className="h-9 w-9 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold">
        <Icon size={17} strokeWidth={1.6} />
      </div>
      <div className="font-serif text-3xl mt-3">{value}</div>
      <div className="text-[11px] text-muted-foreground tracking-wide uppercase">{label}</div>
    </div>
  );
}
