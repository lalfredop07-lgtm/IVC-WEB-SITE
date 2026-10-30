"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatRegion, type Project } from "@/data/projects";
import { specialtyBySlug } from "@/data/specialties";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowLeft, IconArrowRight, IconClose } from "@/components/ui/Icons";
import { useFocusTrap } from "@/lib/useFocusTrap";

type Props = {
  project: Project | null;
  list: Project[];
  onClose: () => void;
  onChange: (p: Project) => void;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Ficha ampliada. La foto "vuela" desde la tarjeta (layoutId compartido).
 * Permite comparar la fotografía original publicada por IVC con la propuesta mejorada.
 */
export function ProjectModal({ project, list, onClose, onChange }: Props) {
  const { stop, start } = useSmoothScroll();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  useFocusTrap(dialog, !!project);
  const [mode, setMode] = useState<"enhanced" | "original">("enhanced");
  const [photoIdx, setPhotoIdx] = useState(0);

  const idx = project ? list.findIndex((p) => p.slug === project.slug) : -1;
  const go = (d: number) => {
    if (idx < 0 || list.length < 2) return;
    setPhotoIdx(0);
    onChange(list[(idx + d + list.length) % list.length]);
  };

  useEffect(() => {
    if (!project) return;
    stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      start();
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
    // Solo al abrir/cerrar, no al navegar entre fichas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project === null]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const category = project ? specialtyBySlug(project.category) : null;
  const photo = project?.photos[Math.min(photoIdx, project.photos.length - 1)];

  return (
    <AnimatePresence>
      {project && photo && (
        <motion.div
          ref={dialog}
          key="project-modal"
          className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.button
            type="button"
            aria-label="Cerrar ficha"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-navy-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            className="relative z-10 flex max-h-[94svh] w-full max-w-[1180px] flex-col overflow-hidden rounded-t-[28px] bg-white md:grid md:max-h-[86svh] md:grid-cols-[1.35fr_1fr] md:rounded-[28px]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.7, ease } }}
            exit={{ y: 40, opacity: 0, transition: { duration: 0.35 } }}
          >
            <motion.div
              layoutId={`project-media-${project.slug}`}
              // Gesto táctil: deslizar la fotografía a izquierda/derecha cambia de obra.
              onPanEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) go(info.offset.x < 0 ? 1 : -1);
              }}
              className="relative aspect-[16/10] shrink-0 touch-pan-y overflow-hidden bg-navy-900 md:aspect-auto md:min-h-[520px]"
              transition={{ type: "spring", stiffness: 140, damping: 24 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`${photo.id}-${mode}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease } }}
                  exit={{ opacity: 0, transition: { duration: 0.4 } }}
                >
                  <Image
                    src={mode === "enhanced" ? photo.enhanced : photo.original}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-navy-950/80 to-transparent p-4 pt-12">
                <div role="group" aria-label="Versión de la fotografía" className="flex rounded-full bg-navy-950/60 p-1 backdrop-blur-md">
                  {(["enhanced", "original"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                      className="relative min-h-10 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-white md:min-h-0"
                    >
                      {mode === m && (
                        <motion.span layoutId="photo-mode-pill" className="absolute inset-0 rounded-full bg-white/20" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                      )}
                      <span className="relative">{m === "enhanced" ? "Propuesta visual" : "Fotografía original"}</span>
                    </button>
                  ))}
                </div>
                {project.photos.length > 1 && (
                  <div className="flex">
                    {project.photos.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPhotoIdx(i)}
                        aria-label={`Fotografía ${i + 1} de ${project.photos.length}`}
                        aria-pressed={photoIdx === i}
                        className="grid h-11 place-items-center px-1"
                      >
                        <span className={`block h-1.5 rounded-full transition-all duration-500 ${photoIdx === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex min-h-0 flex-col overflow-y-auto overscroll-contain p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:p-10" data-lenis-prevent>
              <div className="flex items-center justify-between gap-4">
                <p className="kicker text-blue">{category?.name}</p>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar ficha"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-navy transition-transform duration-500 hover:rotate-90 hover:bg-navy hover:text-white"
                >
                  <IconClose size={18} />
                </button>
              </div>

              <motion.div key={project.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.1 } }}>
                <h2 id="project-modal-title" className="mt-5 text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-[1.08] text-navy">
                  {project.name}
                </h2>
                <p className="mt-2 text-muted">{formatRegion(project.region)}</p>

                <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
                  {[
                    ["Especialidad", category?.shortName ?? "—"],
                    ["Ubicación", project.region ?? "Por confirmar"],
                    ["Cliente / entidad", project.cliente ?? "En validación"],
                    ["Periodo", project.periodo ?? "En validación"],
                    ["Participación", project.participacion ?? "En validación"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className={`text-right font-medium ${v === "En validación" || v === "Por confirmar" ? "text-navy/65" : "text-navy"}`}>{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 text-[13px] leading-relaxed text-muted">
                  Ficha preliminar basada en fotografías publicadas por IVC. Los datos técnicos se completarán tras la validación de la empresa. La
                  «propuesta visual» es una versión retocada, no un registro documental de la obra.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <TransitionLink
                    href={`/proyectos/${project.slug}`}
                    onClick={onClose}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-blue active:bg-blue"
                  >
                    Ver ficha completa
                    <IconArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                  </TransitionLink>
                  {category && (
                    <TransitionLink
                      href={`/especialidades/${category.slug}`}
                      onClick={onClose}
                      className="group inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-blue"
                    >
                      Más sobre {category.shortName.toLowerCase()}
                      <IconArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                    </TransitionLink>
                  )}
                </div>
              </motion.div>

              {list.length > 1 && (
                <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                  <button type="button" onClick={() => go(-1)} className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-navy ring-1 ring-inset ring-navy/15 transition-colors hover:bg-navy hover:text-white">
                    <IconArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Anterior
                  </button>
                  <span className="kicker text-navy/65">
                    {idx + 1} / {list.length}
                  </span>
                  <button type="button" onClick={() => go(1)} className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-navy ring-1 ring-inset ring-navy/15 transition-colors hover:bg-navy hover:text-white">
                    Siguiente <IconArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
