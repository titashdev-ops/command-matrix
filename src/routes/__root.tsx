import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Command Matrix — Architecture case studies";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#07090E" },
      {
        name: "description",
        content:
          "Portfolio of systems architecture case studies by Titash Deb. Prototype simulations of fleet command, clinical systems, and decision records. Not a live operations platform.",
      },
      { name: "author", content: "Titash Deb" },
    ],
    links: [
      { rel: "canonical", href: "https://command-matrix-nine.vercel.app" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@600;700;800&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-obsidian text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Titash Deb",
              jobTitle: "Systems Architect",
              email: "mailto:titashdev@gmail.com",
              url: "https://command-matrix-nine.vercel.app",
              sameAs: [
                "https://github.com/titashdev-ops",
                "https://www.linkedin.com/in/titashdeb",
              ],
            }),
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
