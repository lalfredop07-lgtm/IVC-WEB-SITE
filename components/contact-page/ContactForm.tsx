"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";
import { INQUIRY_TYPES, LIMITS, validateContact, type ContactPayload, type ContactResponse, type FieldErrors } from "@/lib/contact";
import { IconArrowRight, IconMail } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ErrorText, Field } from "@/components/ui/FormField";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not_configured" }
  | { kind: "error"; message: string };

const empty = { nombre: "", empresa: "", email: "", telefono: "", tipo: "", mensaje: "", privacidad: false, website: "" };
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Formulario de contacto. Valida en el navegador y en el servidor, incluye protección
 * antispam (campo trampa + tiempo mínimo + límite por IP) y solo confirma el envío
 * cuando el servidor responde que el correo salió. Sin proveedor configurado,
 * lo comunica y ofrece abrir el mensaje en el cliente de correo del usuario.
 */
export function ContactForm() {
  const id = useId();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validateContact(next));
  };
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateContact(values));
  };

  const mailto = () => {
    const body = [
      `Nombre: ${values.nombre}`,
      values.empresa && `Empresa: ${values.empresa}`,
      values.telefono && `Teléfono: ${values.telefono}`,
      `Tipo de consulta: ${values.tipo}`,
      "",
      values.mensaje,
    ]
      .filter((x): x is string => typeof x === "string")
      .join("\n")
      .slice(0, 1800);
    return `mailto:${site.contact.email}?subject=${encodeURIComponent(`[Web IVC] ${values.tipo || "Consulta"} — ${values.nombre}`)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    setTouched({ nombre: true, empresa: true, email: true, telefono: true, tipo: true, mensaje: true, privacidad: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const payload: ContactPayload = { ...values, startedAt: startedAt.current };
      const res = await fetch("/api/contacto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;
      if (data?.ok) {
        setStatus({ kind: "sent" });
        setValues(empty);
        setTouched({});
        window.setTimeout(() => sentRef.current?.focus(), 450);
        return;
      }
      if (data && !data.ok && data.code === "validation") {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        return;
      }
      if (data && !data.ok && data.code === "not_configured") {
        setStatus({ kind: "not_configured" });
        return;
      }
      setStatus({ kind: "error", message: data && !data.ok && "message" in data ? data.message : "No pudimos enviar su mensaje. Su mensaje no se ha enviado." });
    } catch {
      setStatus({ kind: "error", message: "No hay conexión con el servidor. Su mensaje no se ha enviado." });
    }
  };

  const err = (k: keyof FieldErrors) => (touched[k] ? errors[k] : undefined);
  const sending = status.kind === "sending";

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status.kind === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
            exit={{ opacity: 0 }}
            className="flex min-h-[520px] flex-col items-start justify-center"
          >
            <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true" className="text-blue">
              <motion.circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease }} />
              <motion.path d="M22 37l9 9 19-20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6, ease }} />
            </svg>
            <h3 ref={sentRef} tabIndex={-1} className="mt-8 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] text-navy outline-none">
              Mensaje enviado.
            </h3>
            <p className="mt-4 max-w-[30rem] text-muted">
              Su mensaje fue entregado al equipo de IVC Contratistas Generales. Responderemos al correo que nos indicó.
            </p>
            <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-8 text-sm font-semibold text-blue underline-offset-4 hover:underline">
              Enviar otra consulta
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={submit}
            noValidate
            aria-describedby={`${id}-req`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-x-6 gap-y-7 sm:grid-cols-2"
          >
            <p id={`${id}-req`} className="text-[13px] text-muted sm:col-span-2">
              Los campos marcados con <span className="text-blue">*</span> son obligatorios.
            </p>

            <Field id={`${id}-nombre`} label="Nombre y apellidos" required error={err("nombre")}>
              <input name="nombre" autoComplete="name" maxLength={LIMITS.nombre} value={values.nombre} onChange={(e) => set("nombre", e.target.value)} onBlur={() => blur("nombre")} disabled={sending} />
            </Field>
            <Field id={`${id}-empresa`} label="Empresa o entidad" error={err("empresa")}>
              <input name="empresa" autoComplete="organization" maxLength={LIMITS.empresa} value={values.empresa} onChange={(e) => set("empresa", e.target.value)} onBlur={() => blur("empresa")} disabled={sending} />
            </Field>
            <Field id={`${id}-email`} label="Correo electrónico" required error={err("email")}>
              <input name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} disabled={sending} />
            </Field>
            <Field id={`${id}-telefono`} label="Teléfono" error={err("telefono")}>
              <input name="telefono" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.telefono} value={values.telefono} onChange={(e) => set("telefono", e.target.value)} onBlur={() => blur("telefono")} disabled={sending} />
            </Field>
            <Field id={`${id}-tipo`} label="Tipo de consulta" required error={err("tipo")} className="sm:col-span-2" filled={!!values.tipo}>
              <select name="tipo" value={values.tipo} onChange={(e) => set("tipo", e.target.value)} onBlur={() => blur("tipo")} disabled={sending} className="appearance-none pr-10">
                <option value="" disabled hidden></option>
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={`${id}-mensaje`} label="Mensaje" required error={err("mensaje")} className="sm:col-span-2" counter={`${values.mensaje.length} / ${LIMITS.mensaje}`}>
              <textarea name="mensaje" rows={5} maxLength={LIMITS.mensaje} value={values.mensaje} onChange={(e) => set("mensaje", e.target.value)} onBlur={() => blur("mensaje")} disabled={sending} />
            </Field>

            {/* Campo trampa antispam: invisible para personas */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${id}-website`}>No rellenar</label>
              <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
            </div>

            <div className="sm:col-span-2">
              <label className="group flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
                <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
                  <input
                    type="checkbox"
                    name="privacidad"
                    checked={values.privacidad}
                    onChange={(e) => {
                      set("privacidad", e.target.checked);
                      setTouched((t) => ({ ...t, privacidad: true }));
                    }}
                    disabled={sending}
                    aria-invalid={!!err("privacidad")}
                    aria-describedby={err("privacidad") ? `${id}-privacidad-err` : undefined}
                    className="peer absolute inset-0 cursor-pointer appearance-none rounded-md ring-1 ring-inset ring-navy/30 transition-colors checked:bg-navy checked:ring-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  />
                  <svg viewBox="0 0 16 16" className="pointer-events-none relative size-3.5 scale-0 text-white transition-transform duration-300 ease-out-expo peer-checked:scale-100" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  He leído y acepto la{" "}
                  <a href={site.officialLinks.privacy} target="_blank" rel="noopener noreferrer" className="font-medium text-blue underline underline-offset-4">
                    política de privacidad
                  </a>{" "}
                  de IVC Contratistas Generales para el tratamiento de mis datos con el fin de atender esta consulta.<span className="text-blue"> *</span>
                </span>
              </label>
              <ErrorText id={`${id}-privacidad-err`} message={err("privacidad")} />
            </div>

            <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-navy px-8 text-[14px] font-semibold text-white transition-transform active:scale-[0.97] disabled:cursor-wait"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-blue transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                {sending ? (
                  <>
                    <span className="relative size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                    <span className="relative">Enviando…</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Enviar mensaje</span>
                    <IconArrowRight size={18} className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
                  </>
                )}
              </button>
              <p className="text-[13px] text-muted">
                Para denuncias utilice los{" "}
                <TransitionLink href="/transparencia#denuncias" className="font-medium text-blue underline-offset-4 hover:underline">
                  canales oficiales
                </TransitionLink>
                .
              </p>
            </div>

            <AnimatePresence>
              {(status.kind === "not_configured" || status.kind === "error") && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto", transition: { duration: 0.5, ease } }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden sm:col-span-2"
                >
                  <div className="rounded-[18px] bg-paper p-6 ring-1 ring-navy/10">
                    <p className="font-semibold text-navy">
                      {status.kind === "not_configured" ? "El envío en línea todavía no está activado." : "No se pudo enviar el mensaje."}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {status.kind === "not_configured"
                        ? "Su mensaje no se ha enviado. Mientras se configura este servicio, puede enviarlo desde su propio correo: hemos preparado un borrador con lo que escribió."
                        : status.message}
                    </p>
                    <a href={mailto()} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy ring-1 ring-navy/15 transition-colors hover:bg-navy hover:text-white">
                      <IconMail size={16} /> Escribir a {site.contact.email}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
