import type { NextConfig } from "next";
import { INDEXABLE } from "./lib/env";

const isProd = process.env.NODE_ENV === "production";
// La barra de comentarios de Vercel solo existe en las vistas previas.
const vercelPreview = process.env.VERCEL_ENV === "preview";

/**
 * Política de seguridad de contenidos. Todo se sirve desde el propio dominio (fuentes
 * autoalojadas por next/font, imágenes locales, formularios por fetch a /api).
 * 'unsafe-inline' en scripts es necesario para los scripts de arranque de Next sin
 * nonces (que obligarían a renderizar cada página bajo demanda); no se admite ningún
 * origen externo de scripts. En desarrollo no se aplica (React Refresh usa eval y websockets).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${vercelPreview ? " https://vercel.live" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${vercelPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src ${vercelPreview ? "https://vercel.live" : "'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Solo donde el sitio se sirve siempre por HTTPS (en http://localhost rompería los recursos).
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Sin includeSubDomains: no se conocen todos los subdominios de ivccontratistas.pe.
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }] : []),
  // Versión de revisión: además de la meta robots, cabecera para cualquier recurso (imágenes, API).
  ...(INDEXABLE ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
];

const nextConfig: NextConfig = {
  // Cache Components queda desactivado: el sitio es institucional y estático, y el modo
  // <Activity> mantendría montadas rutas ocultas con ScrollTriggers activos.
  poweredByHeader: false,
  images: {
    qualities: [70, 80],
    formats: ["image/avif", "image/webp"],
    // Las fotografías cambian solo con un nuevo despliegue: 31 días de caché para las optimizadas.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
