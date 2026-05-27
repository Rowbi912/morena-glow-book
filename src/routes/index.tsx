import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, CalendarDays, CreditCard, Car, ArrowRight } from "lucide-react";
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

const highlights = [
  { icon: Sparkles, title: "Servicio integral", desc: "Cabello, manos, pies y spa." },
  { icon: CalendarDays, title: "Lunes a Sábados", desc: "9:00 a 18:00 hs." },
  { icon: CreditCard, title: "Medios de pago", desc: "Efectivo, débito y crédito." },
  { icon: Car, title: "Estacionamiento", desc: "Gratuito para clientes." },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="px-5 pt-10 pb-12 text-center">
        <img src={logo} alt="Morena Hair Design" className="mx-auto h-24 w-24 rounded-full object-cover ring-1 ring-border shadow-soft" />
        <div className="mt-6 text-[11px] tracking-[0.3em] uppercase text-gold">Hair Design Studio</div>
        <h1 className="font-serif text-[2.6rem] leading-[1.05] text-foreground mt-3">
          Animate a cambiar<br/>tu <em className="italic text-gold">look</em>.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Un espacio íntimo en Lomas de San Isidro donde cuidamos cada detalle de tu belleza.
        </p>
        <Link
          to="/book"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm px-7 py-3.5 hover:opacity-90 transition shadow-elegant"
        >
          Reservar turno <ArrowRight size={16} />
        </Link>
      </section>

      {/* Highlights */}
      <section className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
              <div className="h-9 w-9 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold">
                <Icon size={18} strokeWidth={1.6} />
              </div>
              <div className="mt-3 text-sm font-medium text-foreground">{title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="px-5 mt-10">
        <div className="rounded-3xl bg-foreground text-background p-7 shadow-elegant overflow-hidden relative">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/30 blur-2xl" />
          <div className="relative">
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold">Nuevo</div>
            <h2 className="font-serif text-2xl mt-2">Ritual Morena</h2>
            <p className="text-sm text-background/70 mt-2 max-w-[16rem]">
              Tratamiento exclusivo con peinado incluido. Una experiencia completa.
            </p>
            <Link to="/services" className="inline-flex items-center gap-2 mt-5 text-sm text-gold border-b border-gold/60 pb-0.5">
              Ver servicios <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 mt-8 text-center">
        <div className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">Visitanos</div>
        <p className="font-serif text-lg mt-2">J.S. Fernández 28</p>
        <p className="text-sm text-muted-foreground">Lomas de San Isidro, Buenos Aires</p>
      </section>
    </div>
  );
}
