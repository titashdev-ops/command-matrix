import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Command Matrix — Architecture case studies";
const APP_DESCRIPTION =
  "Portfolio of architecture case studies and modeled systems by Titash Deb. The home page features selected studies. A prototype — not a live operations platform.";
const CANONICAL_URL = "https://command-matrix-nine.vercel.app";
const SHARE_IMAGE_URL = `${CANONICAL_URL}/og.jpg`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#07090E" },
      {
        name: "description",
        content: APP_DESCRIPTION,
      },
      { name: "author", content: "Titash Deb" },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: APP_DESCRIPTION },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:image", content: SHARE_IMAGE_URL },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Command Matrix" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: APP_NAME },
      { name: "twitter:description", content: APP_DESCRIPTION },
      { name: "twitter:image", content: SHARE_IMAGE_URL },
    ],
    links: [
      { rel: "canonical", href: CANONICAL_URL },
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
              url: CANONICAL_URL,
              sameAs: [
                "https://github.com/titashdev-ops/command-matrix",
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
