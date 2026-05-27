import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SERVICE_CATEGORIES, getAvailableSlots, apptStore, formatPrice, type Service } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Check, ChevronLeft, CalendarDays, Clock, User } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Reservar turno — Morena Hair Design" }] }),
  component: BookPage,
});

type Step = 1 | 2 | 3 | 4 | 5 | 6;

function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);

  const days = useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) arr.push(d); // skip sundays
    }
    return arr;
  }, []);

  const slots = date ? getAvailableSlots(date) : [];

  function confirm() {
    if (!service || !date || !time || !category) return;
    const id = `a${Date.now()}`;
    apptStore.add({
      id,
      service: service.name,
      category: category.name,
      date: date.toISOString().slice(0, 10),
      time,
      name,
      phone,
      status: "Confirmado",
      price: service.price,
    });
    setConfirmedId(id);
    setStep(6);
  }

  return (
    <div>
      <SectionHeader eyebrow={`Paso ${Math.min(step, 5)} de 5`} title="Reservar turno" />

      {/* progress */}
      <div className="px-5 mb-6">
        <div className="h-1 bg-border/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-5 pb-6">
        {step > 1 && step < 6 && (
          <button onClick={() => setStep((s) => (s - 1) as Step)} className="inline-flex items-center text-sm text-muted-foreground mb-4 gap-1">
            <ChevronLeft size={16} /> Atrás
          </button>
        )}

        {step === 1 && (
          <div className="space-y-2.5">
            <p className="text-sm text-muted-foreground mb-2">Elegí una categoría</p>
            {SERVICE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategoryId(c.id); setStep(2); }}
                className="w-full rounded-2xl bg-card border border-border/60 p-4 text-left shadow-soft hover:border-gold transition"
              >
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.services.length} servicios</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && category && (
          <div className="space-y-2.5">
            <p className="text-sm text-muted-foreground mb-2">Elegí un servicio</p>
            {category.services.map((s) => (
              <button
                key={s.name}
                onClick={() => { setService(s); setStep(3); }}
                className="w-full rounded-2xl bg-card border border-border/60 p-4 text-left shadow-soft hover:border-gold transition flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.duration} min</div>
                </div>
                <div className="text-sm text-gold font-medium tabular-nums">{formatPrice(s.price)}</div>
              </button>
            ))}
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

        {step === 5 && service && date && time && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft space-y-1.5 text-sm">
              <div className="font-medium">{service.name}</div>
              <div className="text-muted-foreground flex items-center gap-2"><CalendarDays size={14}/> {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="text-muted-foreground flex items-center gap-2"><Clock size={14}/> {time} hs</div>
              <div className="text-gold font-medium">{formatPrice(service.price)}</div>
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

        {step === 6 && confirmedId && service && date && time && (
          <div className="text-center pt-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gold-soft/60 flex items-center justify-center text-gold">
              <Check size={28} strokeWidth={2} />
            </div>
            <h2 className="font-serif text-2xl mt-5">¡Turno confirmado!</h2>
            <p className="text-sm text-muted-foreground mt-2">Te esperamos en Morena Hair Design.</p>
            <div className="mt-6 rounded-2xl bg-card border border-border/60 p-5 text-left text-sm space-y-1.5 shadow-soft">
              <div className="font-medium">{service.name}</div>
              <div className="text-muted-foreground flex items-center gap-2"><CalendarDays size={14}/> {date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="text-muted-foreground flex items-center gap-2"><Clock size={14}/> {time} hs</div>
              <div className="text-muted-foreground flex items-center gap-2"><User size={14}/> {name}</div>
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
    </div>
  );
}
