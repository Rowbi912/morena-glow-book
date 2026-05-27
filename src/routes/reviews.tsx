import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { reviewStore, userStore, SERVICE_CATEGORIES, type Review } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reseñas — Morena Hair Design" }] }),
  component: ReviewsPage,
});

const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((c) => c.services.map((s) => s.name));

function Stars({ value, size = 14, onSelect }: { value: number; size?: number; onSelect?: (n: number) => void }) {
  return (
    <div className="inline-flex gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect?.(n)}
          className={onSelect ? "cursor-pointer" : "cursor-default"}
          aria-label={`${n} estrellas`}
        >
          <Star
            size={size}
            className={n <= value ? "fill-gold text-gold" : "text-border"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const [list, setList] = useState<Review[]>(() => reviewStore.list());
  const [rating, setRating] = useState(5);
  const [name, setName] = useState(() => userStore.get() ?? "");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const r: Review = {
      id: `r${Date.now()}`,
      name: name.trim().slice(0, 60),
      rating,
      comment: comment.trim().slice(0, 400),
      service: service || undefined,
      date: new Date().toISOString().slice(0, 10),
    };
    setList(reviewStore.add(r));
    setComment(""); setRating(5); setService("");
  }

  return (
    <div>
      <SectionHeader eyebrow="Opiniones" title="Reseñas" />

      <div className="px-5">
        <div className="rounded-3xl bg-foreground text-background p-6 text-center shadow-elegant">
          <div className="font-serif text-5xl">{avg.toFixed(1)}</div>
          <div className="mt-2"><Stars value={Math.round(avg)} size={18} /></div>
          <div className="text-xs text-background/60 mt-2">Basado en {list.length} reseñas</div>
        </div>
      </div>

      <form onSubmit={submit} className="px-5 mt-6">
        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft space-y-3">
          <div className="text-sm font-medium">Dejá tu reseña</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Puntuación</span>
            <Stars value={rating} size={22} onSelect={setRating} />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={60}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold"
          />
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold"
          >
            <option value="">Servicio (opcional)</option>
            {ALL_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Contanos tu experiencia..."
            rows={3}
            maxLength={400}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
          />
          <button
            type="submit"
            disabled={!name.trim() || !comment.trim()}
            className="w-full rounded-full bg-foreground text-background text-sm py-3 disabled:opacity-40"
          >
            Publicar reseña
          </button>
        </div>
      </form>

      <div className="px-5 mt-8 space-y-3 pb-6">
        {list.map((r) => (
          <div key={r.id} className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{r.name}</div>
              <Stars value={r.rating} />
            </div>
            {r.service && <div className="text-[11px] text-gold mt-0.5">{r.service}</div>}
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>
            <div className="text-[11px] text-muted-foreground/70 mt-2">
              {new Date(r.date + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
