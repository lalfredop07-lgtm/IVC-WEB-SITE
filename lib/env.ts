// Configuración de entorno compartida (servidor y compilación). Ver docs/DESPLIEGUE-VERCEL.md.

/** Dominio público definitivo. Solo se usa para URLs canónicas, sitemap y Open Graph. */
export const SITE_URL = (process.env.SITE_URL || "https://www.ivccontratistas.pe").replace(/\/+$/, "");

/**
 * La web solo es indexable si se activa expresamente (SITE_INDEXABLE=true) y, en Vercel,
 * únicamente en el entorno de producción. Las vistas previas, staging y desarrollo
 * quedan siempre con noindex aunque la variable se haya copiado por error.
 */
export const INDEXABLE =
  process.env.SITE_INDEXABLE === "true" && (process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === "production");
