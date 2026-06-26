import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-6xl text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esta página no existe.</p>
        <Link to="/" className="mt-6 inline-flex items-center rounded-full bg-foreground text-background text-sm px-5 py-2.5">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-foreground">Algo salió mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Por favor intentá nuevamente.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-5 rounded-full bg-foreground text-background text-sm px-5 py-2.5"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Morena Hair Design — Salón en Lomas de San Isidro" },
      { name: "description", content: "Salón de belleza premium en Lomas de San Isidro. Reservá tu turno online." },
      { name: "theme-color", content: "#FAF8F5" },
      { property: "og:title", content: "Morena Hair Design — Salón en Lomas de San Isidro" },
      { name: "twitter:title", content: "Morena Hair Design — Salón en Lomas de San Isidro" },
      { property: "og:description", content: "Salón de belleza premium en Lomas de San Isidro. Reservá tu turno online." },
      { name: "twitter:description", content: "Salón de belleza premium en Lomas de San Isidro. Reservá tu turno online." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/60c51f12-4aa9-42f5-8733-91d99364e065/id-preview-07bba5bd--cc135084-543d-4fb2-a0e6-a2217fb23dda.lovable.app-1781567472554.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/60c51f12-4aa9-42f5-8733-91d99364e065/id-preview-07bba5bd--cc135084-543d-4fb2-a0e6-a2217fb23dda.lovable.app-1781567472554.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
