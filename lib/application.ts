// Validación compartida del formulario de postulación (cliente y /api/postulacion).
import { PROFESSIONAL_AREAS } from "@/data/jobs";

export const SPONTANEOUS = "Candidatura espontánea";

export const CV_LIMITS = {
  // 4 MB: el cuerpo de una función de Vercel admite 4,5 MB en total (CV + campos).
  maxBytes: 4 * 1024 * 1024,
  minBytes: 1024, // 1 KB: descarta archivos vacíos o corruptos
  maxRequestBytes: 4.4 * 1024 * 1024,
} as const;

export const APP_LIMITS = { nombre: 120, email: 160, telefono: 20, puesto: 160, mensajeMin: 30, mensaje: 2000 } as const;

export type ApplicationFields = {
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  puesto: string;
  mensaje: string;
  consentimiento: boolean;
};

export type ApplicationErrors = Partial<Record<keyof ApplicationFields | "cv", string>>;

// Dirección simple: sin espacios, comas, comillas ni <> (evita listas o cabeceras inyectadas en reply_to).
const EMAIL = /^[^\s@,;:<>()[\]"']+@[^\s@,;:<>()[\]"']+\.[^\s@,;:<>()[\]"']{2,}$/;
const PHONE = /^[+()\d\s.-]{6,20}$/;

export function validateApplication(f: Partial<ApplicationFields>): ApplicationErrors {
  const e: ApplicationErrors = {};
  const nombre = (f.nombre ?? "").trim();
  const mensaje = (f.mensaje ?? "").trim();
  if (nombre.length < 3) e.nombre = "Indique su nombre completo.";
  else if (nombre.length > APP_LIMITS.nombre) e.nombre = "El nombre es demasiado largo.";
  if (!EMAIL.test((f.email ?? "").trim())) e.email = "Indique un correo electrónico válido.";
  if (!PHONE.test((f.telefono ?? "").trim())) e.telefono = "Indique un teléfono válido.";
  if (!PROFESSIONAL_AREAS.includes(f.especialidad as (typeof PROFESSIONAL_AREAS)[number])) e.especialidad = "Seleccione su especialidad profesional.";
  const puesto = (f.puesto ?? "").trim();
  if (!puesto) e.puesto = "Indique el puesto de interés.";
  else if (puesto.length > APP_LIMITS.puesto) e.puesto = "El puesto es demasiado largo.";
  if (mensaje.length < APP_LIMITS.mensajeMin) e.mensaje = `Preséntese brevemente (mínimo ${APP_LIMITS.mensajeMin} caracteres).`;
  else if (mensaje.length > APP_LIMITS.mensaje) e.mensaje = `El mensaje supera los ${APP_LIMITS.mensaje} caracteres.`;
  if (f.consentimiento !== true) e.consentimiento = "Debe autorizar el tratamiento de sus datos para postular.";
  return e;
}

/** Comprobaciones del CV que no requieren leer el contenido. */
export function checkCvMeta(file: { name: string; size: number; type: string } | null | undefined): string | null {
  if (!file) return "Adjunte su CV en formato PDF.";
  if (!/\.pdf$/i.test(file.name)) return "El CV debe ser un archivo .pdf.";
  if (file.type && file.type !== "application/pdf") return "El archivo no es un PDF válido.";
  if (file.size < CV_LIMITS.minBytes) return "El archivo parece vacío o dañado.";
  if (file.size > CV_LIMITS.maxBytes) return "El CV supera el tamaño máximo de 4 MB.";
  return null;
}

/** Firma de archivo PDF: los primeros bytes deben ser "%PDF-". */
export const isPdfSignature = (bytes: Uint8Array) =>
  bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;

export const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB`);

export type ApplicationResponse =
  | { ok: true }
  | { ok: false; code: "validation"; errors: ApplicationErrors }
  | { ok: false; code: "not_configured" | "too_large" | "rate_limited" | "spam" | "send_failed" | "bad_request"; message: string };
