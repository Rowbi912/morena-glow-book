import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/SectionHeader";
import { MapPin, Phone, Clock, Mail, Instagram, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto — Morena Hair Design" },
      { name: "description", content: "J.S. Fernández 28, Lomas de San Isidro. Tel 4735-3623 / 15-5307-4500." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div>
      <SectionHeader eyebrow="Encontranos" title="Contacto" subtitle="Estamos para ayudarte. Escribinos o pasá por el salón." />

      <div className="px-5 space-y-3 pb-6">
        <Card icon={MapPin} title="Dirección">
          J.S. Fernández 28<br/>Lomas de San Isidro, Buenos Aires
        </Card>

        <Card icon={Phone} title="Teléfono">
          <a href="tel:+541147353623" className="block hover:text-gold">4735-3623</a>
          <a href="tel:+5491153074500" className="block hover:text-gold">15-5307-4500</a>
        </Card>

        <Card icon={Clock} title="Horarios">
          Lunes a Sábados<br/>9:00 a 18:00 hs
        </Card>

        <Card icon={Mail} title="Email">
          <a href="mailto:mrnhairdesign@gmail.com" className="hover:text-gold">mrnhairdesign@gmail.com</a>
        </Card>

        <Card icon={Instagram} title="Instagram">
          <a href="https://instagram.com/morenahairdesign" target="_blank" rel="noopener noreferrer" className="hover:text-gold">@morenahairdesign</a>
        </Card>

        <a
          href="https://api.whatsapp.com/send?phone=5491153074500"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-4 text-sm shadow-elegant hover:opacity-90 transition"
        >
          <MessageCircle size={18} /> Escribinos por WhatsApp
        </a>

        <div className="mt-6 rounded-2xl overflow-hidden border border-border/60 shadow-soft">
          <iframe
            title="Mapa Morena Hair Design"
            src="https://www.google.com/maps?q=J.S.+Fernandez+28,+Lomas+de+San+Isidro&output=embed"
            className="w-full h-56 border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-gold-soft/50 flex items-center justify-center text-gold shrink-0">
        <Icon size={18} strokeWidth={1.6} />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
        <div className="text-sm text-foreground mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
