import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authStore, type UserAccount } from "@/lib/salon-data";
import { SectionHeader } from "@/components/SectionHeader";
import { LogOut, Save, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Mi cuenta — Morena Hair Design" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setUser(authStore.current()); }, []);

  if (!user) {
    return (
      <div className="px-5 py-10 text-center text-sm text-muted-foreground">
        No hay sesión activa.
      </div>
    );
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    authStore.update({ name: user.name, phone: user.phone, email: user.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function logout() {
    authStore.logout();
    navigate({ to: "/" });
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <div>
      <SectionHeader eyebrow="Cuenta" title="Mi perfil" />
      <div className="px-5 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-14 w-14 rounded-full bg-gold-soft/60 flex items-center justify-center text-gold">
            <UserIcon size={22} />
          </div>
          <div>
            <div className="font-serif text-xl">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <form onSubmit={save} className="space-y-3">
          <Field label="Nombre">
            <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold" />
          </Field>
          <Field label="Teléfono">
            <input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} inputMode="tel"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold" />
          </Field>
          <Field label="Email">
            <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} type="email"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold" />
          </Field>

          <button type="submit" className="w-full rounded-full bg-foreground text-background text-sm py-3.5 inline-flex items-center justify-center gap-2">
            <Save size={15} /> {saved ? "Guardado ✓" : "Guardar cambios"}
          </button>
        </form>

        <button onClick={logout} className="mt-8 w-full rounded-full border border-border text-sm py-3 inline-flex items-center justify-center gap-2 text-destructive">
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-wider uppercase text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
