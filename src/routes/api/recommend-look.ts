import { createFileRoute } from "@tanstack/react-router";
import { SERVICE_CATEGORIES } from "@/lib/salon-data";

const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((c) => c.services.map((s) => s.name));

const SYSTEM = `Sos un asistente profesional de colorismo capilar para el salón Morena Hair Design en Lomas de San Isidro.
Analizá la foto del pelo actual de la clienta y la referencia o descripción del look deseado.
Recomendá los servicios más apropiados de esta lista exacta (usá los nombres tal cual):
${ALL_SERVICES.map((s) => `- ${s}`).join("\n")}

Sé específica sobre la técnica (por ej. reflejos con papel vs cabeza completa, color de raíces vs cambio total).
Mantené un tono cálido, profesional y conciso — máximo 3 oraciones en español rioplatense.

Devolvé SOLO un JSON válido con esta forma exacta:
{"text":"<recomendación en español, máx 3 oraciones>","services":["<nombre exacto>", "..."]}`;

export const Route = createFileRoute("/api/recommend-look")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { current?: string; desired?: string | null; desiredText?: string | null };
          if (!body.current) {
            return Response.json({ error: "Falta la foto actual." }, { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) {
            return Response.json({ error: "LOVABLE_API_KEY no configurada." }, { status: 500 });
          }

          const userContent: any[] = [
            { type: "text", text: "Foto del pelo actual de la clienta:" },
            { type: "image_url", image_url: { url: body.current } },
          ];
          if (body.desired) {
            userContent.push({ type: "text", text: "Foto del look deseado:" });
            userContent.push({ type: "image_url", image_url: { url: body.desired } });
          }
          if (body.desiredText) {
            userContent.push({ type: "text", text: `Descripción del look deseado: ${body.desiredText}` });
          }

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: SYSTEM },
                { role: "user", content: userContent },
              ],
              response_format: { type: "json_object" },
            }),
          });

          if (!upstream.ok) {
            if (upstream.status === 429) return Response.json({ error: "Estamos recibiendo muchas consultas, probá en unos segundos." }, { status: 429 });
            if (upstream.status === 402) return Response.json({ error: "Crédito de IA agotado." }, { status: 402 });
            const text = await upstream.text();
            console.error("AI gateway error:", upstream.status, text);
            return Response.json({ error: "El asistente no pudo responder." }, { status: 502 });
          }

          const data = await upstream.json();
          const content = data?.choices?.[0]?.message?.content ?? "{}";
          let parsed: { text?: string; services?: string[] } = {};
          try { parsed = JSON.parse(content); } catch { parsed = { text: content }; }

          // Filter services to canonical list
          const filtered = (parsed.services ?? []).filter((s) => ALL_SERVICES.includes(s));
          return Response.json({
            text: parsed.text ?? "Recomendación generada.",
            services: filtered,
          });
        } catch (e) {
          console.error("recommend-look error", e);
          return Response.json({ error: "Error inesperado." }, { status: 500 });
        }
      },
    },
  },
});
