// Utilidades de protección compartidas por las rutas /api (solo servidor).

/**
 * Acepta solo envíos hechos desde esta misma web. Los navegadores incluyen la cabecera
 * Origin en todo POST con fetch; si falta o es de otro dominio, se rechaza (CSRF y
 * envíos automatizados desde otros sitios).
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** IP del cliente tras el proxy de la plataforma (Vercel fija x-forwarded-for). */
export const clientIp = (request: Request) =>
  request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

/**
 * Límite de envíos por IP en una ventana de tiempo, en memoria de la instancia.
 * Purga las entradas caducadas para que el mapa no crezca indefinidamente.
 * En producción con varias instancias conviene un almacén compartido (ver docs/).
 */
export function createRateLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  let lastSweep = Date.now();
  return (key: string): boolean => {
    const now = Date.now();
    if (now - lastSweep > windowMs) {
      for (const [k, list] of hits) if (!list.some((t) => now - t < windowMs)) hits.delete(k);
      lastSweep = now;
    }
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > max;
  };
}

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Texto multilínea: elimina caracteres de control (conserva saltos de línea) y recorta. */
export const cleanText = (s: unknown, max: number) =>
  String(typeof s === "string" ? s : "")
    .replace(CONTROL, "")
    .trim()
    .slice(0, max);

/** Campo de una sola línea (nombre, asunto, correo): sin saltos de línea ni caracteres de control. */
export const cleanLine = (s: unknown, max: number) => cleanText(s, max * 2).replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").slice(0, max);
