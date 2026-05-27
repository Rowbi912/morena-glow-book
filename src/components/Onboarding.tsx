import { useEffect, useState } from "react";
import { userStore } from "@/lib/salon-data";
import logo from "@/assets/logo.png";
import { Sparkles } from "lucide-react";

export function Onboarding({ onDone }: { onDone: (name: string) => void }) {
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    userStore.set(trimmed);
    onDone(trimmed);
  }

  return (
    <div className={`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-7 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <img src={logo} alt="Morena Hair Design" className="h-20 w-20 rounded-full object-cover ring-1 ring-border shadow-soft" />
      <div className="mt-6 text-[11px] tracking-[0.3em] uppercase text-gold">Bienvenida</div>
      <h1 className="font-serif text-4xl text-center mt-3 leading-tight">
        Animate a cambiar<br/>tu <em className="italic text-gold">look</em>.
      </h1>
      <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
        Para empezar, contanos cómo te llamás. Vamos a personalizar tu experiencia.
      </p>

      <form onSubmit={submit} className="w-full max-w-sm mt-8 space-y-3">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          maxLength={40}
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-base text-center focus:outline-none focus:border-gold transition"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-full bg-foreground text-background text-sm py-4 disabled:opacity-40 inline-flex items-center justify-center gap-2 shadow-elegant"
        >
          <Sparkles size={16} /> Comenzar
        </button>
      </form>
      <p className="mt-8 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Morena Hair Design</p>
    </div>
  );
}
