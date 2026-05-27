import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarPlus, CalendarCheck, Star, Gift, Bell, ArrowRight, Sparkles } from "lucide-react";
import { userStore, apptStore, reviewStore, getPointsInfo } from "@/lib/salon-data";
import { Onboarding } from "@/components/Onboarding";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Morena Hair Design — Salón premium en Lomas de San Isidro" },
      { name: "description", content: "Animate a cambiar tu look. Reservá tu turno online en Morena Hair Design." },
      { property: "og:title", content: "Morena Hair Design" },
      { property: "og:description", content: "Animate a cambiar tu look." },
    ],
  }),
  component: Home,
});

function Home() {
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setName(userStore.get());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!name) return <Onboarding onDone={(n) => setName(n)} />;

  const upcoming = apptStore.list()
    .filter((a) => a.status === "Confirmado" && a.date >= new Date().toISOString().slice(0,10))
    .sort((a,b) => a.date.localeCompare(b.date))[0];
  const reviews = reviewStore.list();
  const latestReview = reviews[0];
  const points = getPointsInfo();

  const banner = upcoming
    ? {
        icon: Bell,
        title: "Recordatorio",
        body: `Tenés un turno de ${upcoming.service} el ${new Date(upcoming.date+"T00:00:00").toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"})} a las ${upcoming.time} hs.`,
      }
    : latestReview
    ? {
        icon: Star,
        title: "Nueva reseña",
        body: `${latestReview.name} dejó ${latestReview.rating} estrellas: "${latestReview.comment.slice(0,60)}${latestReview.comment.length>60?"…":""}"`,
      }
    : null;

  return (
    <div>
      {/* Greeting */}
      <section className="px-5 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-border" />
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold">Bienvenida</div>
            <h1 className="font-serif text-2xl leading-tight">{name} <span className="text-gold">✨</span></h1>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 mt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-elegant aspect-[16/11]">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80"
            alt="Interior del salón"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-background">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold">Animate a cambiar</div>
            <div className="font-serif text-2xl mt-1">tu <em className="italic text-gold">look</em>.</div>
            <Link
              to="/book"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-background text-foreground text-xs px-4 py-2.5 shadow-soft"
            >
              Reservar turno <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner notification */}
      {banner && (
        <section className="px-5 mt-5">
          <div className="rounded-2xl bg-gold-soft/40 border border-gold/30 p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center text-gold shrink-0">
              <banner.icon size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.2em] uppercase text-gold">{banner.title}</div>
              <p className="text-sm text-foreground mt-1 leading-snug">{banner.body}</p>
            </div>
          </div>
        </section>
      )}

      {/* Quick access */}
      <section className="px-5 mt-6">
        <div className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Acceso rápido</div>
        <div className="grid grid-cols-2 gap-3">
          <QuickCard to="/book" icon={CalendarPlus} title="Reservar turno" desc="Elegí día y hora" />
          <QuickCard to="/appointments" icon={CalendarCheck} title="Mis turnos" desc={upcoming ? "1 próximo" : "Ver historial"} />
          <QuickCard to="/points" icon={Gift} title="Mis puntos" desc={`${points.current} de ${points.goal} visitas`} accent />
          <QuickCard to="/reviews" icon={Star} title="Reseñas" desc={`${reviews.length} opiniones`} />
        </div>
      </section>

      {/* Featured */}
      <section className="px-5 mt-6 pb-2">
        <div className="rounded-3xl bg-foreground text-background p-6 shadow-elegant overflow-hidden relative">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/30 blur-2xl" />
          <div className="relative">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold inline-flex items-center gap-1.5">
              <Sparkles size={12} /> Destacado
            </div>
            <h2 className="font-serif text-2xl mt-2">Ritual Morena</h2>
            <p className="text-sm text-background/70 mt-2 max-w-[18rem]">
              Tratamiento exclusivo con peinado incluido. Una experiencia completa.
            </p>
            <Link to="/services" className="inline-flex items-center gap-2 mt-4 text-sm text-gold border-b border-gold/60 pb-0.5">
              Ver servicios <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickCard({ to, icon: Icon, title, desc, accent }: { to: string; icon: any; title: string; desc: string; accent?: boolean }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-4 border shadow-soft transition hover:border-gold ${
        accent ? "bg-gold-soft/30 border-gold/30" : "bg-card border-border/60"
      }`}
    >
      <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center text-gold">
        <Icon size={17} strokeWidth={1.6} />
      </div>
      <div className="mt-3 text-sm font-medium">{title}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
    </Link>
  );
}
