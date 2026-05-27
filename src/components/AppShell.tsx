import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Scissors, CalendarPlus, CalendarCheck, Gift, Phone, User as UserIcon } from "lucide-react";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/services", label: "Servicios", icon: Scissors },
  { to: "/book", label: "Reservar", icon: CalendarPlus },
  { to: "/appointments", label: "Turnos", icon: CalendarCheck },
  { to: "/points", label: "Puntos", icon: Gift },
  { to: "/contact", label: "Contacto", icon: Phone },
] as const;

export function AppShell() {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-2xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Morena Hair Design" className="h-9 w-9 rounded-full object-cover ring-1 ring-border" />
            <div className="leading-tight">
              <div className="font-serif text-base text-foreground">Morena</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground -mt-0.5">Hair Design</div>
            </div>
          </Link>
          <Link
            to="/profile"
            aria-label="Mi cuenta"
            className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition"
          >
            <UserIcon size={16} strokeWidth={1.7} />
          </Link>
        </div>
      </header>

      <main key={location.pathname} className="flex-1 page-fade pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-2xl grid grid-cols-6">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition ${
                  active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                }`}>
                <Icon size={18} strokeWidth={active ? 2.2 : 1.6} />
                <span className="tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
