"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { BOLSA_IVC_URL, publishedJobs, PROFESSIONAL_AREAS } from "@/data/jobs";
import { site } from "@/data/site";
import {
  APP_LIMITS,
  CV_LIMITS,
  SPONTANEOUS,
  checkCvMeta,
  formatBytes,
  isPdfSignature,
  validateApplication,
  type ApplicationErrors,
  type ApplicationResponse,
} from "@/lib/application";
import { ErrorText, Field } from "@/components/ui/FormField";
import { IconArrowRight, IconArrowUpRight, IconClose } from "@/components/ui/Icons";
import { APPLY_EVENT } from "./JobBoard";

type Channel = "checking" | "ready" | "off";
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "blocked" } | { kind: "error"; message: string };

const empty = { nombre: "", email: "", telefono: "", especialidad: "", puesto: SPONTANEOUS, mensaje: "", consentimiento: false, website: "" };
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Formulario de postulación con CV en PDF.
 * - Consulta si el canal de recepción está configurado y lo indica ANTES de escribir.
 * - Valida campos y archivo (extensión, tipo, tamaño, firma %PDF-) en el navegador;
 *   el servidor repite todas las comprobaciones.
 * - Si el canal no está activo, no envía nada: ni datos ni archivo.
 * - Solo confirma el envío cuando el servidor responde que la postulación salió.
 */
export function ApplicationForm({ position = SPONTANEOUS }: { position?: string }) {
  const id = useId();
  const [channel, setChannel] = useState<Channel>("checking");
  const [values, setValues] = useState({ ...empty, puesto: position });
  const sentRef = useRef<HTMLHeadingElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [drag, setDrag] = useState(false);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    let alive = true;
    fetch("/api/postulacion", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => alive && setChannel(d.configured ? "ready" : "off"))
      .catch(() => alive && setChannel("off"));
    const onApply = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, puesto: title }));
      setStatus({ kind: "idle" });
    };
    window.addEventListener(APPLY_EVENT, onApply);
    return () => {
      alive = false;
      window.removeEventListener(APPLY_EVENT, onApply);
    };
  }, []);

  const allErrors = (v = values, f = file, fileErr?: string | null): ApplicationErrors => {
    const e = validateApplication(v);
    const cvErr = fileErr !== undefined ? fileErr : checkCvMeta(f);
    if (cvErr) e.cv = cvErr;
    return e;
  };

  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(allErrors(next));
  };
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(allErrors());
  };

  // Comprobación del archivo: metadatos + firma real de PDF leída en el navegador.
  const pickFile = async (f: File | null) => {
    setTouched((t) => ({ ...t, cv: true }));
    if (!f) {
      setFile(null);
      setErrors(allErrors(values, null));
      return;
    }
    let err = checkCvMeta(f);
    if (!err) {
      const head = new Uint8Array(await f.slice(0, 5).arrayBuffer());
      if (!isPdfSignature(head)) err = "El archivo no es un PDF válido.";
    }
    setFile(err ? null : f);
    setErrors(allErrors(values, err ? null : f, err));
    if (err && fileInput.current) fileInput.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = allErrors();
    setErrors(errs);
    setTouched({ nombre: true, email: true, telefono: true, especialidad: true, puesto: true, mensaje: true, consentimiento: true, cv: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Sin canal configurado no se transmite ningún dato personal.
    if (channel !== "ready") {
      setStatus({ kind: "blocked" });
      return;
    }
    setStatus({ kind: "sending" });
    const body = new FormData();
    Object.entries(values).forEach(([k, v]) => body.append(k, String(v)));
    body.append("startedAt", String(startedAt.current));
    body.append("cv", file!, file!.name);
    try {
      const res = await fetch("/api/postulacion", { method: "POST", body });
      const data = (await res.json().catch(() => null)) as ApplicationResponse | null;
      if (data?.ok) {
        setStatus({ kind: "sent" });
        setValues({ ...empty, puesto: position });
        setFile(null);
        setTouched({});
        window.setTimeout(() => sentRef.current?.focus(), 100);
        return;
      }
      if (data && !data.ok && data.code === "validation") {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        return;
      }
      if (data && !data.ok && data.code === "not_configured") {
        setChannel("off");
        setStatus({ kind: "blocked" });
        return;
      }
      setStatus({ kind: "error", message: data && !data.ok && "message" in data ? data.message : "No pudimos enviar su postulación. No se ha recibido." });
    } catch {
      setStatus({ kind: "error", message: "No hay conexión con el servidor. Su postulación no se ha enviado." });
    }
  };

  const err = (k: keyof ApplicationErrors) => (touched[k] ? errors[k] : undefined);
  const sending = status.kind === "sending";
  const positions = [SPONTANEOUS, ...publishedJobs.map((j) => j.title)];
  if (!positions.includes(values.puesto)) positions.push(values.puesto);

  if (status.kind === "sent") {
    return (
      <motion.div role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }} className="flex min-h-[480px] flex-col justify-center">
        <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true" className="text-blue">
          <motion.circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease }} />
          <motion.path d="M22 37l9 9 19-20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6, ease }} />
        </svg>
        <h3 ref={sentRef} tabIndex={-1} className="mt-8 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] text-navy outline-none">
          Postulación enviada.
        </h3>
        <p className="mt-4 max-w-[30rem] text-muted">Su candidatura y su CV fueron entregados al equipo de selección de IVC.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-8 w-max text-sm font-semibold text-blue underline-offset-4 hover:underline">
          Enviar otra postulación
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
      <Field id={`${id}-nombre`} label="Nombre completo" required error={err("nombre")}>
        <input name="nombre" autoComplete="name" maxLength={APP_LIMITS.nombre} value={values.nombre} onChange={(e) => set("nombre", e.target.value)} onBlur={() => blur("nombre")} disabled={sending} />
      </Field>
      <Field id={`${id}-email`} label="Correo electrónico" required error={err("email")}>
        <input name="email" type="email" inputMode="email" autoComplete="email" maxLength={APP_LIMITS.email} value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} disabled={sending} />
      </Field>
      <Field id={`${id}-telefono`} label="Teléfono" required error={err("telefono")}>
        <input name="telefono" type="tel" inputMode="tel" autoComplete="tel" maxLength={APP_LIMITS.telefono} value={values.telefono} onChange={(e) => set("telefono", e.target.value)} onBlur={() => blur("telefono")} disabled={sending} />
      </Field>
      <Field id={`${id}-especialidad`} label="Especialidad profesional" required error={err("especialidad")} filled={!!values.especialidad}>
        <select name="especialidad" value={values.especialidad} onChange={(e) => set("especialidad", e.target.value)} onBlur={() => blur("especialidad")} disabled={sending} className="appearance-none pr-10">
          <option value="" disabled hidden></option>
          {PROFESSIONAL_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-puesto`} label="Puesto de interés" required error={err("puesto")} className="sm:col-span-2" filled>
        <select name="puesto" value={values.puesto} onChange={(e) => set("puesto", e.target.value)} onBlur={() => blur("puesto")} disabled={sending} className="appearance-none pr-10">
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-mensaje`} label="Mensaje de presentación" required error={err("mensaje")} className="sm:col-span-2" counter={`${values.mensaje.length} / ${APP_LIMITS.mensaje}`}>
        <textarea name="mensaje" rows={5} maxLength={APP_LIMITS.mensaje} value={values.mensaje} onChange={(e) => set("mensaje", e.target.value)} onBlur={() => blur("mensaje")} disabled={sending} />
      </Field>

      {/* CV en PDF */}
      <div className="sm:col-span-2">
        <p id={`${id}-cv-label`} className="text-[15px] text-muted">
          Currículum vitae (PDF) <span className="text-blue">*</span>
        </p>
        <label
          htmlFor={`${id}-cv`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void pickFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`relative mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[20px] border-2 border-dashed px-6 py-10 text-center transition-all duration-500 ${
            drag ? "scale-[1.01] border-blue bg-blue/5" : err("cv") ? "border-red-600/40 bg-red-50/40" : "border-navy/15 bg-paper hover:border-blue/50"
          }`}
        >
          <motion.span animate={{ y: drag ? -6 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="grid size-14 place-items-center rounded-full bg-white text-blue shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
          </motion.span>
          <span className="font-semibold text-navy">{drag ? "Suelte el archivo aquí" : "Arrastre su CV o haga clic para seleccionarlo"}</span>
          <span className="text-[13px] text-muted">Solo PDF · máximo {formatBytes(CV_LIMITS.maxBytes)}</span>
          <input
            ref={fileInput}
            id={`${id}-cv`}
            name="cv"
            type="file"
            accept="application/pdf,.pdf"
            disabled={sending}
            aria-labelledby={`${id}-cv-label`}
            aria-invalid={!!err("cv")}
            aria-describedby={err("cv") ? `${id}-cv-err` : undefined}
            onChange={(e) => void pickFile(e.target.files?.[0] ?? null)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 flex items-center justify-between gap-4 rounded-full bg-navy px-5 py-3 text-sm text-white"
            >
              <span className="truncate">
                {file.name} · {formatBytes(file.size)}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (fileInput.current) fileInput.current.value = "";
                  void pickFile(null);
                }}
                aria-label="Quitar archivo"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white hover:text-navy"
              >
                <IconClose size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <ErrorText id={`${id}-cv-err`} message={err("cv")} />
      </div>

      {/* Campo trampa antispam */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>No rellenar</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
          <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
            <input
              type="checkbox"
              name="consentimiento"
              checked={values.consentimiento}
              onChange={(e) => {
                set("consentimiento", e.target.checked);
                setTouched((t) => ({ ...t, consentimiento: true }));
              }}
              disabled={sending}
              aria-invalid={!!err("consentimiento")}
              aria-describedby={err("consentimiento") ? `${id}-consent-err` : undefined}
              className="peer absolute inset-0 cursor-pointer appearance-none rounded-md ring-1 ring-inset ring-navy/30 transition-colors checked:bg-navy checked:ring-navy"
            />
            <svg viewBox="0 0 16 16" className="pointer-events-none relative size-3.5 scale-0 text-white transition-transform duration-300 ease-out-expo peer-checked:scale-100" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            Autorizo a {site.legalName} a tratar mis datos personales y mi CV con la finalidad de evaluar mi candidatura, conforme a su{" "}
            <a href={site.officialLinks.privacy} target="_blank" rel="noopener noreferrer" className="font-medium text-blue underline underline-offset-4">
              política de privacidad
            </a>
            .<span className="text-blue"> *</span>
          </span>
        </label>
        <ErrorText id={`${id}-consent-err`} message={err("consentimiento")} />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={sending || channel === "checking"}
          aria-busy={sending}
          className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-navy px-8 text-[14px] font-semibold text-white transition-transform active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
        >
          <span className="absolute inset-0 translate-y-full rounded-full bg-blue transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
          {sending ? (
            <>
              <span className="relative size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
              <span className="relative">Enviando…</span>
            </>
          ) : (
            <>
              <span className="relative">Enviar postulación</span>
              <IconArrowRight size={18} className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {(status.kind === "blocked" || status.kind === "error") && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 0.5, ease } }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden sm:col-span-2"
          >
            <div className="rounded-[18px] bg-paper p-6 ring-1 ring-navy/10">
              <p className="font-semibold text-navy">{status.kind === "blocked" ? "Su postulación no se ha enviado." : "No se pudo enviar la postulación."}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {status.kind === "blocked"
                  ? "La recepción de candidaturas en esta web todavía no está activa, así que no hemos transmitido sus datos ni su CV. Puede postular a través de la bolsa de trabajo del sitio actual de IVC."
                  : status.message}
              </p>
              <a
                href={BOLSA_IVC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy ring-1 ring-navy/15 transition-colors hover:bg-navy hover:text-white"
              >
                Bolsa de trabajo IVC <IconArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
