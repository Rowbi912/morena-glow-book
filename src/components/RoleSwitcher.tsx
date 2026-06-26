import { useNavigate, useRouterState } from "@tanstack/react-router";
import { User, Scissors, Bell, Crown } from "lucide-react";
import { adminStore, receptionSession, staffSession, STAFF } from "@/lib/salon-data";

type RoleKey = "client" | "staff" | "reception" | "owner";

const ROLES: { key: RoleKey; label: string; icon: any; to: string }[] = [
  { key: "client", label: "Cliente", icon: User, to: "/" },
  { key: "staff", label: "Staff", icon: Scissors, to: "/staff" },
  { key: "reception", label: "Recepción", icon: Bell, to: "/reception" },
  { key: "owner", label: "Dueña", icon: Crown, to: "/admin" },
];

export function RoleSwitcher() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const active: RoleKey = pathname.startsWith("/staff")
    ? "staff"
    : pathname.startsWith("/reception")
    ? "reception"
    : pathname.startsWith("/admin") || pathname.startsWith("/inventory")
    ? "owner"
    : "client";

  function activate(role: RoleKey, to: string) {
    if (role === "reception") receptionSession.login("9999");
    if (role === "owner") adminStore.set(true);
    if (role === "staff") staffSession.login(STAFF[0].id, STAFF[0].pin);
    navigate({ to });
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-2 z-50 flex flex-col gap-1.5">
      <div className="rounded-2xl bg-background/90 backdrop-blur border border-border/70 shadow-soft p-1.5 flex flex-col gap-1">
        <div className="text-[8px] uppercase tracking-[0.18em] text-muted-foreground text-center px-1 pt-0.5 pb-1">
          Demo
        </div>
        {ROLES.map(({ key, label, icon: Icon, to }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => activate(key, to)}
              aria-label={label}
              title={label}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1.5 rounded-xl transition ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={14} strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="text-[9px] tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
