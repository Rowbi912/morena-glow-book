import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Sparkles, Upload, Wand2 } from "lucide-react";

export const Route = createFileRoute("/look")({
  head: () => ({ meta: [{ title: "Find Your Look — Morena Hair Design" }] }),
  component: LookPage,
});

type Recommendation = {
  text: string;
  services: string[];
};

function LookPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<string | null>(null);
  const [desired, setDesired] = useState<string | null>(null);
  const [desiredText, setDesiredText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    };
  }

  async function analyze() {
    if (!current) { setError("Subí una foto de tu pelo actual."); return; }
    if (!desired && !desiredText.trim()) { setError("Subí una foto de referencia o describí tu look ideal."); return; }
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const res = await fetch("/api/recommend-look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, desired, desiredText: desiredText.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error analizando");
      setRecommendation(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo analizar la imagen.");
    } finally {
      setLoading(false);
    }
  }

  function bookSuggestion() {
    if (!recommendation) return;
    const services = encodeURIComponent(recommendation.services.join("|"));
    navigate({ to: "/book", search: { suggested: services } as any });
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Inteligencia artificial"
        title="Find Your Look"
        subtitle="Subí dos fotos y te recomendamos los servicios ideales."
      />
      <div className="px-5 pb-10 space-y-5">
        <PhotoCard step="1" title="Tu pelo actual" image={current} onPick={handleFile(setCurrent)} />
        <PhotoCard step="2" title="Tu look ideal" image={desired} onPick={handleFile(setDesired)} />

        <div>
          <span className="text-[11px] tracking-wider uppercase text-muted-foreground">…o describí lo que querés</span>
          <textarea
            value={desiredText}
            onChange={(e) => setDesiredText(e.target.value)}
            rows={3}
            placeholder="Ej. mechas californianas suaves, tono caramelo"
            className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          onClick={analyze}
          disabled={loading}
          className="w-full rounded-full bg-foreground text-background text-sm py-3.5 inline-flex items-center justify-center gap-2 shadow-elegant disabled:opacity-50"
        >
          <Wand2 size={15} /> {loading ? "Analizando…" : "Recomendar servicios"}
        </button>

        {recommendation && (
          <div className="rounded-2xl bg-gold-soft/40 border border-gold/30 p-5 shadow-soft">
            <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-[0.25em]">
              <Sparkles size={12} /> Recomendación
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{recommendation.text}</p>
            {recommendation.services.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recommendation.services.map((s) => (
                  <span key={s} className="text-xs rounded-full bg-background border border-border px-3 py-1.5">{s}</span>
                ))}
              </div>
            )}
            <button
              onClick={bookSuggestion}
              className="mt-5 w-full rounded-full bg-foreground text-background text-sm py-3"
            >
              Reservar estos servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoCard({ step, title, image, onPick }: { step: string; title: string; image: string | null; onPick: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block rounded-2xl bg-card border border-border/60 p-4 shadow-soft cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="h-7 w-7 rounded-full bg-gold-soft/60 text-gold text-xs font-medium flex items-center justify-center">{step}</span>
        <div className="flex-1 text-sm font-medium">{title}</div>
        <Upload size={15} className="text-muted-foreground" />
      </div>
      {image ? (
        <img src={image} alt="" className="mt-3 w-full h-48 object-cover rounded-xl" />
      ) : (
        <div className="mt-3 h-32 rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
          Tocá para subir foto
        </div>
      )}
      <input type="file" accept="image/*" onChange={onPick} className="hidden" />
    </label>
  );
}
