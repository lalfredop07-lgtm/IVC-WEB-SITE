import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/env";

/**
 * Mientras la web sea una versión de revisión, se bloquea a todos los rastreadores.
 * Al lanzar (SITE_INDEXABLE=true en producción) se abre el rastreo y se publica el sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
