// Validación compartida entre el formulario (cliente) y la ruta /api/contacto (servidor).

export const INQUIRY_TYPES = [
  "Proyecto u obra pública",
  "Proyecto u obra privada",
  "Proveedores y alianzas",
  "Información institucional",
  "Otra consulta",
] as const;

export type ContactPayload = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  tipo: string;
  mensaje: string;
  privacidad: boolean;
  /** Campo trampa: debe llegar vacío (los bots suelen rellenarlo). */
  website: string;
  /** Marca de tiempo de apertura del formulario, para descartar envíos instantáneos. */
  startedAt: number;
};

export type FieldErrors = Partial<Record<"nombre" | "email" | "telefono" | "tipo" | "mensaje" | "privacidad" | "empresa", string>>;

// Dirección simple: sin espacios, comas, comillas ni <> (evita listas o cabeceras inyectadas en reply_to).
const EMAIL = /^[^\s@,;:<>()[\]"']+@[^\s@,;:<>()[\]"']+\.[^\s@,;:<>()[\]"']{2,}$/;
const PHONE = /^[+()\d\s.-]{6,20}$/;

export const LIMITS = { nombre: 120, empresa: 160, email: 160, telefono: 20, mensaje: 3000, mensajeMin: 20 } as const;

export function validateContact(p: Partial<ContactPayload>): FieldErrors {
  const e: FieldErrors = {};
  const nombre = (p.nombre ?? "").trim();
  const email = (p.email ?? "").trim();
  const telefono = (p.telefono ?? "").trim();
  const mensaje = (p.mensaje ?? "").trim();
  const empresa = (p.empresa ?? "").trim();

  if (nombre.length < 2) e.nombre = "Indique su nombre.";
  else if (nombre.length > LIMITS.nombre) e.nombre = "El nombre es demasiado largo.";
  if (empresa.length > LIMITS.empresa) e.empresa = "El nombre de la empresa es demasiado largo.";
  if (!EMAIL.test(email) || email.length > LIMITS.email) e.email = "Indique un correo electrónico válido.";
  if (telefono && !PHONE.test(telefono)) e.telefono = "Indique un teléfono válido (solo números, espacios y + ( ) -).";
  if (!INQUIRY_TYPES.includes(p.tipo as (typeof INQUIRY_TYPES)[number])) e.tipo = "Seleccione el tipo de consulta.";
  if (mensaje.length < LIMITS.mensajeMin) e.mensaje = `Cuéntenos un poco más (mínimo ${LIMITS.mensajeMin} caracteres).`;
  else if (mensaje.length > LIMITS.mensaje) e.mensaje = `El mensaje supera los ${LIMITS.mensaje} caracteres.`;
  if (p.privacidad !== true) e.privacidad = "Debe aceptar la política de privacidad para enviar el mensaje.";
  return e;
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; code: "validation"; errors: FieldErrors }
  | { ok: false; code: "not_configured" | "rate_limited" | "spam" | "send_failed" | "bad_request"; message: string };
