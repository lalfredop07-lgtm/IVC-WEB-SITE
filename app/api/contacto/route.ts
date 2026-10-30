import { validateContact, type ContactPayload, type ContactResponse } from "@/lib/contact";
import { cleanLine, cleanText, clientIp, createRateLimiter, isSameOrigin } from "@/lib/security";

/**
 * Envío del formulario de contacto.
 *
 * Proveedor: Resend (API HTTP, sin dependencias). Variables de entorno necesarias
 * (solo en el servidor, nunca con prefijo NEXT_PUBLIC_):
 *   RESEND_API_KEY      clave de API de Resend
 *   CONTACT_TO_EMAIL    destinatario autorizado por IVC (p. ej. recepcion@ivc.pe)
 *   CONTACT_FROM_EMAIL  remitente de un dominio verificado en Resend
 *
 * Sin estas variables la ruta responde 503 "not_configured" y el formulario lo
 * comunica al usuario: nunca se simula un envío. Ver docs/INTEGRACION-CONTACTO.md.
 *
 * Privacidad: los datos solo se reenvían por correo al destinatario; no se guardan
 * ni se registran (los registros de error no incluyen datos personales).
 */

const MIN_FILL_MS = 3000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
/** Un mensaje válido ocupa unos pocos KB: cualquier cuerpo mayor se rechaza sin procesarlo. */
const MAX_BODY_BYTES = 16 * 1024;
const rateLimited = createRateLimiter(10 * 60 * 1000, 5);

function json(body: ContactResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, code: "bad_request", message: "Solicitud no válida." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, code: "bad_request", message: "Solicitud no válida." }, 415);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, code: "bad_request", message: "El mensaje es demasiado largo." }, 413);
  }

  let data: Partial<ContactPayload>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, code: "bad_request", message: "El mensaje es demasiado largo." }, 413);
    data = JSON.parse(raw);
    if (!data || typeof data !== "object") throw new Error("cuerpo no válido");
  } catch {
    return json({ ok: false, code: "bad_request", message: "Solicitud no válida." }, 400);
  }

  // Antispam: campo trampa y tiempo de cumplimentación plausible (ni instantáneo ni de hace más de un día).
  const elapsed = typeof data.startedAt === "number" ? Date.now() - data.startedAt : -1;
  if (cleanText(data.website, 200) !== "" || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return json({ ok: false, code: "spam", message: "No se pudo procesar el envío. Inténtelo de nuevo en unos segundos." }, 400);
  }

  if (rateLimited(clientIp(request))) {
    return json({ ok: false, code: "rate_limited", message: "Ha enviado varios mensajes seguidos. Inténtelo de nuevo más tarde." }, 429);
  }

  const errors = validateContact(data);
  if (Object.keys(errors).length) return json({ ok: false, code: "validation", errors }, 422);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    return json(
      { ok: false, code: "not_configured", message: "El envío en línea todavía no está activado. Su mensaje no se ha enviado." },
      503,
    );
  }

  const nombre = cleanLine(data.nombre, 120);
  const email = cleanLine(data.email, 160);
  const tipo = cleanLine(data.tipo, 80);
  const text = [
    `Nombre: ${nombre}`,
    `Empresa: ${cleanLine(data.empresa, 160) || "—"}`,
    `Correo: ${email}`,
    `Teléfono: ${cleanLine(data.telefono, 20) || "—"}`,
    `Tipo de consulta: ${tipo}`,
    "",
    cleanText(data.mensaje, 3000),
    "",
    "— Enviado desde el formulario de contacto de la web de IVC. El remitente aceptó la política de privacidad.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Web IVC] ${tipo} — ${nombre}`,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  } catch (err) {
    console.error("[contacto] fallo de envío", err instanceof Error ? err.message : "error desconocido");
    return json({ ok: false, code: "send_failed", message: "No pudimos enviar su mensaje en este momento. Su mensaje no se ha enviado." }, 502);
  }

  return json({ ok: true }, 200);
}
