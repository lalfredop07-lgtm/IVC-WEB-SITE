import {
  CV_LIMITS,
  checkCvMeta,
  isPdfSignature,
  validateApplication,
  type ApplicationFields,
  type ApplicationResponse,
} from "@/lib/application";
import { cleanLine, cleanText, clientIp, createRateLimiter, isSameOrigin } from "@/lib/security";

/**
 * Recepción de postulaciones con CV en PDF.
 *
 * Variables de entorno (solo servidor, ver docs/INTEGRACION-POSTULACIONES.md):
 *   RESEND_API_KEY        clave de API de Resend
 *   CAREERS_TO_EMAIL      buzón de selección autorizado por IVC (distinto del comercial)
 *   CAREERS_FROM_EMAIL    remitente de un dominio verificado
 *
 * Política de datos: el CV se valida en memoria y se reenvía como adjunto;
 * no se escribe en disco ni se guarda en esta aplicación. Sin configuración
 * no se lee el cuerpo de la petición (no se procesa ningún dato personal).
 */

const MIN_FILL_MS = 5000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const rateLimited = createRateLimiter(30 * 60 * 1000, 3);

const configured = () => Boolean(process.env.RESEND_API_KEY && process.env.CAREERS_TO_EMAIL && process.env.CAREERS_FROM_EMAIL);

function json(body: ApplicationResponse | { configured: boolean }, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Estado del canal: el formulario lo consulta para avisar antes de que el usuario escriba. */
export async function GET() {
  return json({ configured: configured() }, 200);
}

export async function POST(request: Request) {
  if (!configured()) {
    return json(
      { ok: false, code: "not_configured", message: "La recepción de candidaturas en línea todavía no está activa. No se ha enviado ni guardado ningún dato." },
      503,
    );
  }

  if (!isSameOrigin(request)) {
    return json({ ok: false, code: "bad_request", message: "Solicitud no válida." }, 403);
  }
  // Se exige la longitud declarada para poder rechazar archivos grandes antes de leerlos.
  const length = Number(request.headers.get("content-length") ?? 0);
  if (!length) return json({ ok: false, code: "bad_request", message: "Solicitud no válida." }, 411);
  if (length > CV_LIMITS.maxRequestBytes) {
    return json({ ok: false, code: "too_large", message: "El envío supera el tamaño permitido (CV de 4 MB como máximo)." }, 413);
  }

  const now = Date.now();
  if (rateLimited(clientIp(request))) {
    return json({ ok: false, code: "rate_limited", message: "Ha enviado varias postulaciones seguidas. Inténtelo de nuevo más tarde." }, 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, code: "bad_request", message: "Solicitud no válida." }, 400);
  }

  // Antispam: campo trampa y tiempo mínimo de cumplimentación.
  const startedAt = Number(form.get("startedAt"));
  if (cleanText(form.get("website"), 200) !== "" || !Number.isFinite(startedAt) || now - startedAt < MIN_FILL_MS || now - startedAt > MAX_FILL_MS) {
    return json({ ok: false, code: "spam", message: "No se pudo procesar la postulación. Inténtelo de nuevo en unos segundos." }, 400);
  }

  const fields: ApplicationFields = {
    nombre: cleanLine(form.get("nombre"), 120),
    email: cleanLine(form.get("email"), 160),
    telefono: cleanLine(form.get("telefono"), 20),
    especialidad: cleanLine(form.get("especialidad"), 80),
    puesto: cleanLine(form.get("puesto"), 160),
    mensaje: cleanText(form.get("mensaje"), 2000),
    consentimiento: form.get("consentimiento") === "true",
  };
  const errors = validateApplication(fields);

  // Comprobaciones de seguridad del archivo.
  const cv = form.get("cv");
  let bytes: Uint8Array | null = null;
  if (!(cv instanceof File)) {
    errors.cv = "Adjunte su CV en formato PDF.";
  } else {
    const metaError = checkCvMeta(cv);
    if (metaError) errors.cv = metaError;
    else {
      bytes = new Uint8Array(await cv.arrayBuffer());
      const raw = new TextDecoder("latin1").decode(bytes);
      if (!isPdfSignature(bytes)) errors.cv = "El archivo no es un PDF válido.";
      // PDF con acciones activas (scripts o ejecución de archivos): se rechaza.
      else if (/\/(JavaScript|JS|Launch|EmbeddedFile)\b/.test(raw)) errors.cv = "El PDF contiene elementos activos no permitidos. Exporte su CV como PDF simple.";
    }
  }
  if (Object.keys(errors).length) return json({ ok: false, code: "validation", errors }, 422);

  const safeName = `CV-${fields.nombre.normalize("NFD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "candidato"}.pdf`;
  const text = [
    `Nombre: ${fields.nombre}`,
    `Correo: ${fields.email}`,
    `Teléfono: ${fields.telefono}`,
    `Especialidad profesional: ${fields.especialidad}`,
    `Puesto de interés: ${fields.puesto}`,
    "",
    fields.mensaje,
    "",
    "— Postulación enviada desde la web de IVC. El candidato autorizó el tratamiento de sus datos personales con fines de selección.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CAREERS_FROM_EMAIL,
        to: [process.env.CAREERS_TO_EMAIL],
        reply_to: fields.email,
        subject: `[Postulación] ${fields.puesto} — ${fields.nombre}`,
        text,
        attachments: [{ filename: safeName, content: Buffer.from(bytes!).toString("base64") }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  } catch (err) {
    console.error("[postulacion] fallo de envío", err instanceof Error ? err.message : "error desconocido");
    return json({ ok: false, code: "send_failed", message: "No pudimos enviar su postulación. No se ha recibido; inténtelo más tarde." }, 502);
  }

  return json({ ok: true }, 200);
}
