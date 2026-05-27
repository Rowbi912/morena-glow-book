import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SERVICE_CATEGORIES, getAvailableSlots, apptStore, userStore, formatPrice, type Service } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Check, ChevronLeft, CalendarDays, Clock, User, Plus, X } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Reservar turno — Morena Hair Design" }] }),
  component: BookPage,
});

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type PickedService = Service & { category: string };

function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PickedService[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState(() => userStore.get() ?? "");
  const [phone, setPhone] = useState("");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);

  const totalPrice = selected.reduce((s, x) => s + x.price, 0);
  const totalDuration = selected.reduce((s, x) => s + x.duration, 0);

  function toggleService(s: Service, catName: string) {
    setSelected((prev) => {
      const exists = prev.find((p) => p.name === s.name);
      if (exists) return prev.filter((p) => p.name !== s.name);
      return [...prev, { ...s, category: catName }];
    });
  }

  function removeService(name: string) {
    setSelected((prev) => prev.filter((p) => p.name !== name));
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

  const slots = date ? getAvailableSlots(date) : [];

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
    });
    setConfirmedId(id);
    setStep(6);
  }

  return (
    <div className="pb-32">
      <SectionHeader eyebrow={`Paso ${Math.min(step, 5)} de 5`} title="Reservar turno" />

      <div className="px-5 mb-6">
        <div className="h-1 bg-border/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          />
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
                <button
                  key={c.id}
                  onClick={() => { setCategoryId(c.id); setStep(2); }}
                  className="w-full rounded-2xl bg-card border border-border/60 p-4 text-left shadow-soft hover:border-gold transition flex items-center justify-between"
                >
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
              <button
                onClick={() => setStep(3)}
                className="mt-4 w-full rounded-full bg-foreground text-background text-sm py-3.5"
              >
                Continuar con {selected.length} servicio{selected.length > 1 ? "s" : ""} · {formatPrice(totalPrice)}
              </button>
            )}
          </div>
        )}

        {step === 2 && category && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Elegí uno o más servicios</p>
              <button onClick={() => setStep(1)} className="text-xs text-gold">
                + Otra categoría
              </button>
            </div>
            {category.services.map((s) => {
              const isSel = selected.some((p) => p.name === s.name);
              return (
                <button
                  key={s.name}
                  onClick={() => toggleService(s, category.name)}
                  className={`w-full rounded-2xl border p-4 text-left shadow-soft transition flex items-center justify-between gap-3 ${
                    isSel ? "bg-gold-soft/40 border-gold" : "bg-card border-border/60 hover:border-gold"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${isSel ? "bg-gold border-gold text-background" : "border-border"}`}>
                      {isSel ? <Check size={14} /> : <Plus size={14} className="text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.duration} min</div>
                    </div>
                  </div>
                  <div className="text-sm text-gold font-medium tabular-nums">{formatPrice(s.price)}</div>
                </button>
              );
            })}
            <button
              disabled={selected.length === 0}
              onClick={() => setStep(3)}
              className="mt-4 w-full rounded-full bg-foreground text-background text-sm py-3.5 disabled:opacity-40 transition"
            >
              {selected.length === 0
                ? "Elegí al menos un servicio"
                : `Continuar · ${selected.length} servicio${selected.length > 1 ? "s" : ""}`}
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full rounded-full border border-border/60 text-sm py-3 text-muted-foreground"
            >
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
                  <button
                    key={d.toISOString()}
                    onClick={() => { setDate(d); setTime(null); setStep(4); }}
                    className={`rounded-2xl border p-3 text-center transition ${
                      isSel ? "bg-foreground text-background border-foreground" : "bg-card border-border/60 hover:border-gold"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider opacity-70">
                      {d.toLocaleDateString("es-AR", { weekday: "short" })}
                    </div>
                    <div className="font-serif text-xl mt-1">{d.getDate()}</div>
                    <div className="text-[10px] opacity-70">
                      {d.toLocaleDateString("es-AR", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && date && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Horarios disponibles — {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTime(t); setStep(5); }}
                  className="rounded-full border border-border/60 bg-card py-2.5 text-sm hover:border-gold hover:text-gold transition"
                >
                  {t}
                </button>
              ))}
            </div>
            {slots.length === 0 && <p className="text-sm text-muted-foreground">Sin disponibilidad este día.</p>}
          </div>
        )}

        {step === 5 && date && time && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft space-y-2 text-sm">
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Servicios</div>
              {selected.map((s) => (
                <div key={s.name} className="flex items-baseline justify-between gap-2">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-gold tabular-nums">{formatPrice(s.price)}</div>
                </div>
              ))}
              <div className="pt-2 mt-1 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total · {totalDuration} min</span>
                <span className="font-medium text-gold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 pt-2"><CalendarDays size={14}/> {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="text-muted-foreground flex items-center gap-2"><Clock size={14}/> {time} hs</div>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-muted-foreground">Nombre y apellido</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  placeholder="Ej. María García"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Teléfono</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  placeholder="Ej. 11 5307 4500"
                />
              </label>
            </div>
            <button
              disabled={!name.trim() || !phone.trim()}
              onClick={confirm}
              className="w-full rounded-full bg-foreground text-background text-sm py-3.5 disabled:opacity-40 transition"
            >
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
            <div className="mt-6 rounded-2xl bg-card border border-border/60 p-5 text-left text-sm space-y-1.5 shadow-soft">
              <div className="font-medium">{selected.map((s) => s.name).join(" + ")}</div>
              <div className="text-muted-foreground flex items-center gap-2"><CalendarDays size={14}/> {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="text-muted-foreground flex items-center gap-2"><Clock size={14}/> {time} hs · {totalDuration} min</div>
              <div className="text-muted-foreground flex items-center gap-2"><User size={14}/> {name}</div>
              <div className="text-gold font-medium pt-1">{formatPrice(totalPrice)}</div>
            </div>
            <button
              onClick={() => navigate({ to: "/appointments" })}
              className="mt-6 w-full rounded-full bg-foreground text-background text-sm py-3.5"
            >
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
                  {selected.length} servicio{selected.length > 1 ? "s" : ""} · {totalDuration} min
                </div>
                <div className="text-gold font-medium text-sm tabular-nums">{formatPrice(totalPrice)}</div>
              </div>
              <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
                {selected.slice(0, 3).map((s) => (
                  <button
                    key={s.name}
                    onClick={() => removeService(s.name)}
                    className="inline-flex items-center gap-1 text-[10px] bg-background/10 text-background rounded-full px-2 py-1"
                  >
                    {s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name}
                    <X size={10} />
                  </button>
                ))}
                {selected.length > 3 && (
                  <span className="text-[10px] text-background/60 self-center">+{selected.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
