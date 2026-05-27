import { useEffect, useState } from "react";
import { authStore } from "@/lib/salon-data";
import logo from "@/assets/logo.png";
import { Sparkles } from "lucide-react";

type Mode = "login" | "signup";

export function AuthScreen({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<Mode>("signup");
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // If there are existing accounts, default to login
    if (typeof window !== "undefined" && authStore.listUsers().length > 0) {
      setMode("login");
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup") {
      if (!name.trim() || !phone.trim() || !email.trim() || password.length < 4) {
        setError("Completá todos los campos. La contraseña debe tener 4+ caracteres.");
        return;
      }
      const res = authStore.signup({ name: name.trim(), phone: phone.trim(), email: email.trim().toLowerCase(), password });
      if (!res.ok) { setError(res.error ?? "Error"); return; }
      onDone();
    } else {
      const res = authStore.login(email.trim().toLowerCase(), password);
      if (!res.ok) { setError(res.error ?? "Error"); return; }
      onDone();
    }
  }

  return (
    <div className={`fixed inset-0 z-50 bg-background overflow-y-auto transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <div className="min-h-full flex flex-col items-center justify-center px-7 py-12">
        <img src={logo} alt="Morena Hair Design" className="h-20 w-20 rounded-full object-cover ring-1 ring-border shadow-soft" />
        <div className="mt-6 text-[11px] tracking-[0.3em] uppercase text-gold">Bienvenida</div>
        <h1 className="font-serif text-4xl text-center mt-3 leading-tight">
          Animate a cambiar<br/>tu <em className="italic text-gold">look</em>.
        </h1>

        <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1 text-sm">
          <button onClick={() => { setMode("signup"); setError(null); }} className={`px-5 py-1.5 rounded-full transition ${mode === "signup" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Crear cuenta</button>
          <button onClick={() => { setMode("login"); setError(null); }} className={`px-5 py-1.5 rounded-full transition ${mode === "login" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Ingresar</button>
        </div>

        <form onSubmit={submit} className="w-full max-w-sm mt-6 space-y-3">
          {mode === "signup" && (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" maxLength={60}
                className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm focus:outline-none focus:border-gold" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" inputMode="tel" maxLength={20}
                className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm focus:outline-none focus:border-gold" />
            </>
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email"
            className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm focus:outline-none focus:border-gold" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm focus:outline-none focus:border-gold" />

          {error && <p className="text-xs text-destructive text-center">{error}</p>}

          <button type="submit"
            className="w-full rounded-full bg-foreground text-background text-sm py-4 inline-flex items-center justify-center gap-2 shadow-elegant">
            <Sparkles size={16} /> {mode === "signup" ? "Crear cuenta" : "Ingresar"}
          </button>
        </form>
        <p className="mt-8 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Morena Hair Design</p>
      </div>
    </div>
  );
}
