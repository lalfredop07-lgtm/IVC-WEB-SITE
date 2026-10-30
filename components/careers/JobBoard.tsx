"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { BOLSA_IVC_URL, formatJobDate, publishedJobs, jobSpecialtyLabel, type Job } from "@/data/jobs";
import { exampleJobs } from "@/data/jobs.example";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowRight, IconArrowUpRight, IconHelmet, IconPin } from "@/components/ui/Icons";

export const APPLY_EVENT = "ivc:apply";

// Los ejemplos de diseño se muestran solo en desarrollo; en producción esta constante es false.
const DEV_PREVIEW = process.env.NODE_ENV !== "production";
const ease = [0.16, 1, 0.3, 1] as const;

const fmtDate = formatJobDate;

/**
 * Ofertas laborales: filtros por ubicación y especialidad, tarjetas desplegables
 * con descripción, requisitos y «Postular ahora». Sin vacantes confirmadas,
 * muestra un estado vacío y la vía de candidatura espontánea.
 */
export function JobBoard() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const [location, setLocation] = useState("todas");
  const [specialty, setSpecialty] = useState("todas");
  const [open, setOpen] = useState<string | null>(null);

  const source = DEV_PREVIEW ? exampleJobs : publishedJobs;
  const locations = useMemo(() => [...new Set(source.map((j) => j.location))].sort(), [source]);
  const specs = useMemo(() => [...new Set(source.map((j) => j.specialty))], [source]);
  const list = source.filter((j) => (location === "todas" || j.location === location) && (specialty === "todas" || j.specialty === specialty));
  const empty = source.length === 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-jb-bar]", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: "[data-jb-bar]", start: "top 90%", once: true } });
        gsap.from("[data-jb-empty] [data-draw]", {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: { trigger: "[data-jb-empty]", start: "top 80%", once: true },
        });
        gsap.to("[data-jb-orbit]", { rotate: 360, duration: 40, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [empty] },
  );

  const apply = (title: string) => {
    window.dispatchEvent(new CustomEvent(APPLY_EVENT, { detail: title }));
    scrollTo("postular");
  };

  return (
    <section ref={root} id="ofertas" aria-labelledby="ofertas-title" className="relative scroll-mt-24 bg-paper py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> 02 — Ofertas laborales
            </p>
            <SplitReveal as="h2" id="ofertas-title" variant="chars" stagger={0.012} className="mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1] text-navy">
              Vacantes publicadas
            </SplitReveal>
          </div>
          <p className="text-[15px] leading-relaxed text-muted lg:col-span-5">
            Solo se publican vacantes confirmadas por IVC, con su fecha de publicación. Puede filtrar por ubicación y especialidad.
          </p>
        </div>

        {/* Filtros */}
        <div data-jb-bar className="mt-12 flex flex-col gap-3 rounded-[22px] bg-white p-3 shadow-[0_24px_60px_-40px_rgb(0_27_49/0.5)] ring-1 ring-navy/5 md:flex-row md:items-center">
          <FilterSelect label="Ubicación" value={location} onChange={setLocation} disabled={empty} options={locations.map((l) => ({ value: l, label: l }))} all="Todas las ubicaciones" />
          <FilterSelect
            label="Especialidad"
            value={specialty}
            onChange={setSpecialty}
            disabled={empty}
            options={specs.map((s) => ({ value: s, label: jobSpecialtyLabel(s) }))}
            all="Todas las especialidades"
          />
          <p className="px-3 text-sm text-muted md:ml-auto" aria-live="polite">
            {empty ? "0 vacantes publicadas" : `${list.length} ${list.length === 1 ? "vacante" : "vacantes"}`}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {empty ? (
            <motion.div
              key="empty"
              data-jb-empty
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
              exit={{ opacity: 0, y: -20 }}
              className="relative mt-8 grid overflow-hidden rounded-[28px] bg-navy-950 text-white lg:grid-cols-12"
            >
              <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
              <div className="relative grid place-items-center py-14 lg:col-span-5 lg:py-20">
                <div className="relative grid size-56 place-items-center md:size-64">
                  <svg data-jb-orbit viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
                    <circle cx="100" cy="100" r="96" fill="none" stroke="rgb(167 207 230 / 0.25)" strokeDasharray="2 10" />
                    <circle cx="196" cy="100" r="4" fill="#a7cfe6" />
                  </svg>
                  <span className="grid size-36 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <IconHelmet size={64} className="text-sky" strokeWidth={1.1} />
                  </span>
                </div>
              </div>
              <div className="relative p-8 md:p-12 lg:col-span-7 lg:py-20 lg:pl-0">
                <p className="kicker text-sky">Estado actual</p>
                <h3 className="mt-4 max-w-[20ch] text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.05]">Actualmente no hay ofertas publicadas.</h3>
                <p className="mt-5 max-w-[34rem] text-white/70">
                  Cuando IVC confirme nuevas vacantes, aparecerán aquí. Mientras tanto, puede dejarnos una candidatura espontánea o consultar la bolsa de
                  trabajo del sitio actual de IVC.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => apply("Candidatura espontánea")}
                    className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[13px] font-semibold text-navy transition-colors hover:bg-sky"
                  >
                    Enviar candidatura espontánea
                    <IconArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                  </button>
                  <a
                    href={BOLSA_IVC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[13px] font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10"
                  >
                    Bolsa de trabajo IVC (sitio actual) <IconArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8">
              <LayoutGroup>
                <motion.ul layout className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {list.map((j, i) => (
                      <JobCard key={j.slug} job={j} index={i} open={open === j.slug} onToggle={() => setOpen(open === j.slug ? null : j.slug)} onApply={() => apply(j.title)} />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </LayoutGroup>
              {list.length === 0 && (
                <p className="mt-6 rounded-[18px] bg-white p-6 text-center text-muted ring-1 ring-navy/5">No hay vacantes con esos filtros.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  all,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  all: string;
  disabled: boolean;
}) {
  return (
    <label className={`relative flex min-w-[240px] flex-col items-start rounded-[18px] bg-paper px-5 pt-2.5 md:flex-row md:items-center md:gap-3 md:rounded-full md:py-0.5 ${disabled ? "opacity-55" : ""}`}>
      <span className="kicker text-[10px] text-navy/65">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-10 w-full cursor-pointer appearance-none bg-transparent pr-8 text-[16px] md:min-h-11 md:pr-6 font-medium text-navy outline-none disabled:cursor-not-allowed md:text-[14px]"
      >
        <option value="todas">{all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-navy/50" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

function JobCard({ job: j, index, open, onToggle, onApply }: { job: Job; index: number; open: boolean; onToggle: () => void; onApply: () => void }) {
  const panelId = `job-${j.slug}`;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease, delay: index * 0.06 } }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      className={`group relative overflow-hidden rounded-[24px] bg-navy text-white ring-1 transition-shadow duration-500 ${open ? "shadow-[0_40px_90px_-40px_rgb(0_27_49/0.7)] ring-sky/40" : "ring-white/10 hover:shadow-[0_30px_70px_-40px_rgb(0_27_49/0.7)]"}`}
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 origin-top bg-sky transition-transform duration-700 ease-out-expo ${open ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`} />
      {j.ejemplo && (
        <span className="kicker ml-6 mt-6 inline-block rounded-full bg-white/10 px-3 py-1 text-[9px] text-sky md:absolute md:right-5 md:top-5 md:m-0">Ejemplo ficticio</span>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`grid w-full gap-5 p-6 text-left md:grid-cols-[1fr_auto] md:items-center md:p-8 ${j.ejemplo ? "pt-4 md:pt-8" : ""}`}
      >
        <div>
          <h3 className="font-display text-[clamp(1.25rem,2vw,1.7rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">{j.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-white/70">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <IconPin size={14} /> {j.location}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{jobSpecialtyLabel(j.specialty)}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{j.mode}</span>
            <span className="px-1 py-1.5">Publicada el {fmtDate(j.publishedAt)}</span>
          </div>
        </div>
        <span className={`grid size-12 place-items-center rounded-full ring-1 ring-inset transition-all duration-500 ${open ? "rotate-45 bg-white text-navy ring-white" : "text-white ring-white/25 group-hover:bg-white group-hover:text-navy"}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.6, ease } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.35 } }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-t border-white/10 px-6 pb-8 pt-7 md:grid-cols-2 md:px-8">
              <div>
                <p className="kicker text-[10px] text-sky">Descripción del puesto</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">{j.summary}</p>
                {j.description.map((d) => (
                  <p key={d} className="mt-3 text-[15px] leading-relaxed text-white/70">
                    {d}
                  </p>
                ))}
              </div>
              <div>
                <p className="kicker text-[10px] text-sky">Requisitos</p>
                <ul className="mt-3 space-y-2">
                  {j.requirements.map((r) => (
                    <li key={r} className="flex gap-3 text-[15px] text-white/70">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky" />
                      {r}
                    </li>
                  ))}
                </ul>
                {j.closesAt && <p className="mt-5 text-sm text-white">Postulaciones hasta el {fmtDate(j.closesAt)}</p>}
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    type="button"
                    onClick={onApply}
                    className="group/btn relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-navy px-6 text-[13px] font-semibold text-white"
                  >
                    <span className="absolute inset-0 translate-y-full rounded-full bg-blue transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0" />
                    <span className="relative">Postular ahora</span>
                    <IconArrowRight size={16} className="relative transition-transform duration-500 group-hover/btn:translate-x-1.5" />
                  </button>
                  <TransitionLink href={`/trabaja-con-nosotros/${j.slug}`} className="group/link inline-flex min-h-12 items-center gap-2 text-[13px] font-semibold text-sky">
                    Ver ficha de la vacante
                    <IconArrowUpRight size={15} className="transition-transform duration-500 group-hover/link:rotate-45" />
                  </TransitionLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
