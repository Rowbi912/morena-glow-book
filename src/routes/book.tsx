import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  SERVICE_CATEGORIES,
  getSlotsForDate,
  apptStore,
  authStore,
  buildSchedule,
  addMinutes,
  formatPrice,
  ROLE_LABEL,
  type Service,
} from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Check, ChevronLeft, CalendarDays, Clock, Plus, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Reservar turno — Morena Hair Design" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    suggested: typeof s.suggested === "string" ? s.suggested : undefined,
  }),
  component: BookPage,
});

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type PickedService = Service & { category: string };

function BookPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/book" }) as { suggested?: string };
  const [step, setStep] = useState<Step>(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PickedService[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  // Pre-fill from auth
  useEffect(() => {
    const u = authStore.current();
    if (u) { setName(u.name); setPhone(u.phone); }
  }, []);

  // Pre-fill suggested services from /look
  useEffect(() => {
    if (!search.suggested) return;
    const names = decodeURIComponent(search.suggested).split("|");
    const picked: PickedService[] = [];
    for (const cat of SERVICE_CATEGORIES) {
      for (const s of cat.services) {
        if (names.includes(s.name)) picked.push({ ...s, category: cat.name });
      }
    }
    if (picked.length) setSelected(picked);
  }, [search.suggested]);

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  const schedule = useMemo(() => buildSchedule(selected), [selected]);
  const totalPrice = selected.reduce((s, x) => s + x.price, 0);

  const hasColor = selected.some((s) => s.role === "colorist");
  const hasNail = selected.some((s) => s.role === "nail");
  const showNailSuggestion = hasColor && !hasNail;

  function toggleService(s: Service, catName: string) {
    setSelected((prev) => {
      const exists = prev.find((p) => p.name === s.name);
      if (exists) return prev.filter((p) => p.name !== s.name);
      return [...prev, { ...s, category: catName }];
    });
  }

  function removeService(svcName: string) {
    setSelected((prev) => prev.filter((p) => p.name !== svcName));
  }

  function addNailQuick(svcName: string) {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === "manos-pies");
    if (!cat) return;
    const svc = cat.services.find((s) => s.name === svcName);
    if (svc) toggleService(svc, cat.name);
  }

  const days = useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) arr.push(d);
    }
    return arr;
  }, []);

  const slots = date ? getSlotsForDate(date) : [];

  function confirm() {
    if (selected.length === 0 || !date || !time) return;
    const id = `a${Date.now()}`;
    const categories = Array.from(new Set(selected.map((s) => s.category))).join(", ");
    apptStore.add({
      id,
      service: selected.map((s) => s.name).join(" + "),
      category: categories,
      date: date.toISOString().slice(0, 10),
      time,
      name,
      phone,
      status: "Confirmado",
      price: totalPrice,
      totalDuration: schedule.totalMinutes,
      items: schedule.items,
    });
    setConfirmedId(id);
    setStep(6);
  }

  return (
    <div className="pb-32">
      <SectionHeader eyebrow={`Paso ${Math.min(step, 5)} de 5`} title="Reservar turno" />

      <div className="px-5 mb-6">
        <div className="h-1 bg-border/70 rounded-full overflow-hidden">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }} />
        </div>
      </div>

      <div className="px-5">
        {step > 1 && step < 6 && (
          <button onClick={() => setStep((s) => (s - 1) as Step)} className="inline-flex items-center text-sm text-muted-foreground mb-4 gap-1">
            <ChevronLeft size={16} /> Atrás
          </button>
        )}

        {step === 1 && (
          <div className="space-y-2.5">
            <p className="text-sm text-muted-foreground mb-2">Elegí una categoría</p>
            {SERVICE_CATEGORIES.map((c) => {
              const count = selected.filter((s) => s.category === c.name).length;
              return (
                <button key={c.id} onClick={() => { setCategoryId(c.id); setStep(2); }}
                  className="w-full rounded-2xl bg-card border border-border/60 p-4 text-left shadow-soft hover:border-gold transition flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.services.length} servicios</div>
                  </div>
                  {count > 0 && (
                    <span className="text-[10px] tracking-wider uppercase bg-gold-soft/60 text-gold rounded-full px-2 py-1">
                      {count} elegido{count > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
            {selected.length > 0 && (
              <button onClick={() => setStep(3)}
                className="mt-4 w-full rounded-full bg-foreground text-background text-sm py-3.5">
                Continuar · {formatPrice(totalPrice)}
              </button>
            )}
          </div>
        )}

        {step === 2 && category && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Elegí uno o más servicios</p>
              <button onClick={() => setStep(1)} className="text-xs text-gold">+ Otra categoría</button>
            </div>
            {category.services.map((s) => {
              const isSel = selected.some((p) => p.name === s.name);
              return (
                <button key={s.name} onClick={() => toggleService(s, category.name)}
                  className={`w-full rounded-2xl border p-4 text-left shadow-soft transition flex items-center justify-between gap-3 ${
                    isSel ? "bg-gold-soft/40 border-gold" : "bg-card border-border/60 hover:border-gold"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${isSel ? "bg-gold border-gold text-background" : "border-border"}`}>
                      {isSel ? <Check size={14} /> : <Plus size={14} className="text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {s.duration} min · {ROLE_LABEL[s.role]}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gold font-medium tabular-nums">{formatPrice(s.price)}</div>
                </button>
              );
            })}

            {showNailSuggestion && category.id !== "manos-pies" && (
              <div className="rounded-2xl bg-gold-soft/40 border border-gold/30 p-4">
                <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.2em]">
                  <Sparkles size={12} /> Aprovechá el tiempo de procesado
                </div>
                <p className="text-sm mt-2 leading-snug">
                  Mientras tu color procesa, ¿querés agregar una manicura o pedicura? Lo agendamos en el mismo turno sin esperar más.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => addNailQuick("Manicuría")} className="rounded-full bg-background border border-border text-xs px-3 py-1.5">+ Manicuría</button>
                  <button onClick={() => addNailQuick("Semipermanente OPI")} className="rounded-full bg-background border border-border text-xs px-3 py-1.5">+ Semipermanente OPI</button>
                  <button onClick={() => addNailQuick("Pedicuría")} className="rounded-full bg-background border border-border text-xs px-3 py-1.5">+ Pedicuría</button>
                </div>
              </div>
            )}

            <button disabled={selected.length === 0} onClick={() => setStep(3)}
              className="mt-4 w-full rounded-full bg-foreground text-background text-sm py-3.5 disabled:opacity-40 transition">
              {selected.length === 0 ? "Elegí al menos un servicio" : `Continuar · ${selected.length} servicio${selected.length > 1 ? "s" : ""}`}
            </button>
            <button onClick={() => setStep(1)} className="w-full rounded-full border border-border/60 text-sm py-3 text-muted-foreground">
              Agregar de otra categoría
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">Elegí un día</p>
            <div className="grid grid-cols-4 gap-2">
              {days.map((d) => {
                const isSel = date && d.toDateString() === date.toDateString();
                return (
                  <button key={d.toISOString()} onClick={() => { setDate(d); setTime(null); setStep(4); }}
                    className={`rounded-2xl border p-3 text-center transition ${
                      isSel ? "bg-foreground text-background border-foreground" : "bg-card border-border/60 hover:border-gold"
                    }`}>
                    <div className="text-[10px] uppercase tracking-wider opacity-70">{d.toLocaleDateString("es-AR", { weekday: "short" })}</div>
                    <div className="font-serif text-xl mt-1">{d.getDate()}</div>
                    <div className="text-[10px] opacity-70">{d.toLocaleDateString("es-AR", { month: "short" })}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && date && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Horarios — {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s) => {
                const isSel = time === s.time;
                const occupied = s.status === "occupied";
                return (
                  <button
                    key={s.time}
                    disabled={occupied}
                    onClick={() => { if (!occupied) { setTime(s.time); setStep(5); } }}
                    className={`rounded-full py-2.5 text-sm border transition ${
                      occupied
                        ? "bg-muted text-muted-foreground/50 border-border/50 line-through cursor-not-allowed"
                        : isSel
                          ? "bg-gold text-background border-gold"
                          : "bg-card border-border/60 hover:border-gold hover:text-gold"
                    }`}
                  >
                    {s.time}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-border bg-card" /> Disponible</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-muted" /> Ocupado</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-gold" /> Seleccionado</span>
            </div>
            {slots.length === 0 && <p className="text-sm text-muted-foreground mt-4">Sin disponibilidad este día.</p>}
          </div>
        )}

        {step === 5 && date && time && (
          <div className="space-y-4">
            <ScheduleBreakdown items={schedule.items} startTime={time} totalMinutes={schedule.totalMinutes} totalPrice={totalPrice} />

            <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2"><CalendarDays size={14}/> {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="flex items-center gap-2"><Clock size={14}/> Llegada {time} hs · Salida estimada {addMinutes(time, schedule.totalMinutes)} hs</div>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-muted-foreground">Nombre y apellido</span>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Teléfono</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </label>
            </div>
            <button disabled={!name.trim() || !phone.trim()} onClick={confirm}
              className="w-full rounded-full bg-foreground text-background text-sm py-3.5 disabled:opacity-40 transition">
              Confirmar reserva
            </button>
          </div>
        )}

        {step === 6 && confirmedId && date && time && (
          <div className="text-center pt-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gold-soft/60 flex items-center justify-center text-gold">
              <Check size={28} strokeWidth={2} />
            </div>
            <h2 className="font-serif text-2xl mt-5">¡Turno confirmado!</h2>
            <p className="text-sm text-muted-foreground mt-2">Te esperamos en Morena Hair Design.</p>
            <div className="mt-6 text-left">
              <ScheduleBreakdown items={schedule.items} startTime={time} totalMinutes={schedule.totalMinutes} totalPrice={totalPrice} />
            </div>
            <button onClick={() => navigate({ to: "/appointments" })}
              className="mt-6 w-full rounded-full bg-foreground text-background text-sm py-3.5">
              Ver mis turnos
            </button>
          </div>
        )}
      </div>

      {/* Sticky running total */}
      {step < 5 && selected.length > 0 && (
        <div className="fixed bottom-16 inset-x-0 z-40 px-5 pb-3 pointer-events-none">
          <div className="mx-auto max-w-md rounded-2xl bg-foreground text-background shadow-elegant p-3 pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs">
                <div className="text-background/60 text-[10px] tracking-wider uppercase">
                  {selected.length} servicio{selected.length > 1 ? "s" : ""} · {schedule.totalMinutes} min
                </div>
                <div className="text-gold font-medium text-sm tabular-nums">{formatPrice(totalPrice)}</div>
              </div>
              <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                {selected.slice(0, 3).map((s) => (
                  <button key={s.name} onClick={() => removeService(s.name)}
                    className="inline-flex items-center gap-1 text-[10px] bg-background/10 text-background rounded-full px-2 py-1">
                    {s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name}
                    <X size={10} />
                  </button>
                ))}
                {selected.length > 3 && <span className="text-[10px] text-background/60 self-center">+{selected.length - 3}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleBreakdown({ items, startTime, totalMinutes, totalPrice }: {
  items: ReturnType<typeof buildSchedule>["items"];
  startTime: string;
  totalMinutes: number;
  totalPrice: number;
}) {
  const sorted = [...items].sort((a, b) => a.startMinutes - b.startMinutes);
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
      <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Detalle del turno</div>
      <ul className="space-y-3">
        {sorted.map((it, i) => {
          const start = addMinutes(startTime, it.startMinutes);
          const end = addMinutes(startTime, it.startMinutes + it.durationMinutes);
          return (
            <li key={i} className="flex items-start gap-3">
              <div className="text-[10px] tabular-nums text-gold font-medium mt-0.5 w-12 shrink-0">{start}</div>
              <div className="flex-1">
                <div className="text-sm font-medium leading-tight">{it.serviceName}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {ROLE_LABEL[it.role]} · {start}–{end} hs · {it.durationMinutes} min
                </div>
              </div>
              <div className="text-xs text-gold tabular-nums">{formatPrice(it.price)}</div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Total · {totalMinutes} min</span>
        <span className="font-medium text-gold">{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}
