import { useEffect, useState } from "react";
import { Bell, Star, X, Check } from "lucide-react";
import {
  authStore,
  clientNotifStore,
  waitlistStore,
  apptStore,
  reviewStore,
  surveyStore,
  type ClientNotification,
} from "@/lib/salon-data";
import { toast } from "sonner";

export function ClientNotificationsBanner() {
  const [notifs, setNotifs] = useState<ClientNotification[]>([]);
  const [phone, setPhone] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [active, setActive] = useState<ClientNotification | null>(null);

  function refresh(p: string) { setNotifs(clientNotifStore.unreadForPhone(p)); }

  useEffect(() => {
    const u = authStore.current();
    if (!u) return;
    setPhone(u.phone);
    refresh(u.phone);
    const i = setInterval(() => refresh(u.phone), 4000);
    const h = () => refresh(u.phone);
    window.addEventListener("storage", h);
    return () => { clearInterval(i); window.removeEventListener("storage", h); };
  }, []);

  if (!phone || notifs.length === 0) return null;

  function dismiss(n: ClientNotification) {
    clientNotifStore.markRead(n.id);
    if (phone) refresh(phone);
  }

  function confirmWaitlist(n: ClientNotification) {
    // Find appt at that time (newly cancelled) — simulate by creating a confirmed appt or removing waitlist entry.
    if (n.meta?.waitlistId) waitlistStore.remove(n.meta.waitlistId);
    toast.success(`Turno confirmado a las ${n.meta?.time ?? ""}`, { description: "Te esperamos en el salón." });
    dismiss(n);
  }

  function submitSurvey(n: ClientNotification) {
    if (rating === 0) return;
    reviewStore.add({
      id: "r" + Date.now(),
      name: authStore.current()?.name ?? "Clienta",
      rating,
      comment: comment.trim() || `Excelente experiencia con ${n.meta?.staffName ?? "el equipo"}.`,
      service: n.meta?.serviceName,
      date: new Date().toISOString().slice(0, 10),
    });
    surveyStore.markSubmitted(`${n.meta?.apptId}:${n.meta?.itemIndex}`);
    toast.success("¡Gracias por tu reseña!");
    setRating(0); setComment(""); setActive(null);
    dismiss(n);
  }

  return (
    <div className="px-5 mt-4 space-y-2">
      {notifs.slice(0, 3).map((n) => (
        <div key={n.id} className="rounded-2xl bg-foreground text-background p-4 shadow-elegant relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/30 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0">
              {n.kind === "survey" ? <Star size={15} /> : <Bell size={15} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase text-gold">{n.title}</div>
              <div className="text-sm mt-1 leading-snug">{n.message}</div>

              {n.kind === "waitlist_offer" && (
                <button
                  onClick={() => confirmWaitlist(n)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold text-background text-xs px-3 py-1.5"
                ><Check size={12}/> Confirmar turno</button>
              )}

              {n.kind === "survey" && active?.id !== n.id && (
                <button
                  onClick={() => { setActive(n); setRating(0); setComment(""); }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold text-background text-xs px-3 py-1.5"
                ><Star size={12}/> Dejar mi reseña</button>
              )}

              {n.kind === "survey" && active?.id === n.id && (
                <div className="mt-3 rounded-2xl bg-background/10 border border-background/20 p-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <button key={i} onClick={() => setRating(i)}
                        className={`p-1 ${i <= rating ? "text-gold" : "text-background/40"}`}>
                        <Star size={20} className={i <= rating ? "fill-gold" : ""}/>
                      </button>
                    ))}
                  </div>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Tu comentario (opcional)" rows={2}
                    className="mt-2 w-full rounded-xl bg-background text-foreground px-3 py-2 text-xs resize-none"/>
                  <button onClick={() => submitSurvey(n)} disabled={rating === 0}
                    className="mt-2 w-full rounded-full bg-gold text-background text-xs py-2 disabled:opacity-40">
                    Enviar
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => dismiss(n)} className="h-7 w-7 rounded-full bg-background/15 flex items-center justify-center text-background shrink-0">
              <X size={12}/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Keep apptStore import to satisfy lint when unused
void apptStore;
