"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { featuredProjects, projects, type Project } from "@/data/projects";
import { specialties, type SpecialtySlug } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ProjectModal } from "@/components/project/ProjectModal";
import { Button } from "@/components/ui/Button";

type Filter = "todos" | SpecialtySlug;

const filters: { id: Filter; label: string }[] = [
  { id: "todos", label: "Destacados" },
  ...specialties.map((s) => ({ id: s.slug, label: s.shortName })),
];

/**
 * Portafolio sobre azul profundo (inspirado en «Featured Projects» de la referencia 02).
 * Filtros con indicador deslizante, reordenación animada del grid, cursor contextual
 * y ficha ampliada con transición de imagen compartida. En móvil el grid se convierte
 * en un carrusel horizontal con imán (la siguiente obra asoma por el borde).
 */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const carousel = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [filter, setFilter] = useState<Filter>("todos");
  const [open, setOpen] = useState<Project | null>(null);

  const list = useMemo(() => (filter === "todos" ? featuredProjects : projects.filter((p) => p.category === filter)), [filter]);
  const countFor = (f: Filter) => (f === "todos" ? featuredProjects.length : projects.filter((p) => p.category === f).length);

  // Barra de avance del carrusel móvil: se escribe directamente en el estilo (sin re-render).
  const syncBar = () => {
    const el = carousel.current;
    if (!el || !bar.current) return;
    const ratio = el.scrollWidth > el.clientWidth ? (el.scrollLeft + el.clientWidth) / el.scrollWidth : 1;
    bar.current.style.transform = `scaleX(${ratio})`;
  };

  // Al cambiar de filtro, el carrusel vuelve a la primera obra.
  useEffect(() => {
    carousel.current?.scrollTo({ left: 0 });
    syncBar();
  }, [filter]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // La sección "se abre": de tarjeta redondeada y reducida a pantalla completa.
        gsap.fromTo(
          "[data-proj-shell]",
          { clipPath: "inset(4% 4% 0% 4% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: 0.6 },
          },
        );
        gsap.from("[data-proj-filter]", {
          y: 24,
          opacity: 0,
          stagger: 0.05,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-proj-filters]", start: "top 90%", once: true },
        });
      });

      // Cursor contextual "Ver obra" sobre las tarjetas (solo ratón).
      mm.add(MQ.finePointer, () => {
        const c = cursor.current!;
        const xTo = gsap.quickTo(c, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(c, "y", { duration: 0.5, ease: "power3" });
        const grid = root.current!.querySelector<HTMLElement>("[data-proj-grid]")!;
        // El cursor solo se anima al entrar o salir de una tarjeta (no en cada movimiento).
        let shown = false;
        const toggle = (on: boolean) => {
          if (on === shown) return;
          shown = on;
          gsap.to(c, { scale: on ? 1 : 0, opacity: on ? 1 : 0, duration: on ? 0.4 : 0.3, ease: "expo.out", overwrite: "auto" });
        };
        const move = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          toggle(!!(e.target as HTMLElement).closest("[data-cursor]"));
        };
        const leave = () => toggle(false);
        grid.addEventListener("pointermove", move);
        grid.addEventListener("pointerleave", leave);
        return () => {
          grid.removeEventListener("pointermove", move);
          grid.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="proyectos" aria-labelledby="proyectos-title" className="relative bg-white">
      <div data-proj-shell className="relative overflow-hidden bg-navy-950 pb-28 pt-28 text-white md:pb-36 md:pt-36">
        <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
        <div aria-hidden="true" className="absolute -top-1/3 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full bg-blue/25 blur-[140px]" />

        <div className="container-x relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="kicker flex items-center gap-3 text-sky">
                <span className="h-px w-8 bg-sky" /> 03 — Proyectos
              </p>
              <SplitReveal as="h2" id="proyectos-title" variant="lines" className="mt-6 text-[clamp(2.6rem,6vw,5.6rem)] font-semibold leading-[0.96]">
                Obras que hablan <span className="title-accent text-sky">por nosotros.</span>
              </SplitReveal>
            </div>
            <SplitReveal as="p" variant="blur" stagger={0.015} className="max-w-[30rem] text-[17px] leading-relaxed text-white/65 lg:col-span-5 lg:justify-self-end">
              Una muestra de la experiencia de IVC a partir de las fotografías publicadas por la empresa. Seleccione una especialidad para filtrar.
            </SplitReveal>
          </div>

          <LayoutGroup>
            <div data-proj-filters role="group" aria-label="Filtrar proyectos por especialidad" className="-mx-[var(--gutter)] mt-14 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] max-sm:mt-10">
              <div className="flex w-max gap-2">
                {filters.map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      data-proj-filter
                      aria-pressed={active}
                      onClick={() => setFilter(f.id)}
                      className={`relative min-h-11 whitespace-nowrap rounded-full px-5 py-3 text-[13px] font-medium transition-colors duration-300 ${
                        active ? "text-navy" : "text-white/70 ring-1 ring-inset ring-white/15 hover:text-white hover:ring-white/40"
                      }`}
                    >
                      {active && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                      <span className="relative">
                        {f.label}
                        <sup className={`ml-1 text-[10px] ${active ? "text-blue" : "text-white/55"}`}>{countFor(f.id)}</sup>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.ul
              ref={carousel}
              onScroll={syncBar}
              data-proj-grid
              layout
              layoutScroll
              className="mt-10 gap-4 max-sm:-mx-[var(--gutter)] max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:overscroll-x-contain max-sm:scroll-px-[var(--gutter)] max-sm:px-[var(--gutter)] max-sm:pb-2 max-sm:[scrollbar-width:none] sm:grid sm:auto-rows-auto sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
              aria-live="polite"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 60, scale: 0.94, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.35 } }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.05 }}
                    className={`max-sm:w-[82vw] max-sm:max-w-[360px] max-sm:shrink-0 max-sm:snap-start ${i === 0 && list.length > 2 ? "sm:col-span-2 lg:row-span-2" : ""}`}
                  >
                    <ProjectCard project={p} index={i} large={i === 0 && list.length > 2} onOpen={setOpen} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <div aria-hidden="true" className="mt-5 h-0.5 overflow-hidden rounded-full bg-white/15 sm:hidden">
              <span ref={bar} className="block h-full origin-left scale-x-0 rounded-full bg-sky transition-transform duration-300 ease-out-expo" />
            </div>

            <ProjectModal project={open} list={list} onClose={() => setOpen(null)} onChange={setOpen} />
          </LayoutGroup>

          <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 text-[15px] text-white/65 md:flex-row md:text-sm md:text-white/60 md:items-center md:justify-between">
            <p>
              Mostrando {list.length} de {projects.length} fichas del banco fotográfico de IVC.
              <br />
              Datos de cliente, periodo y estado en proceso de validación.
            </p>
            <Button href={filter === "todos" ? "/proyectos" : `/proyectos?especialidad=${filter}`}>Ver portafolio completo</Button>
          </div>
        </div>
      </div>

      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[55] -ml-12 -mt-12 grid size-24 place-items-center rounded-full bg-white text-[12px] font-semibold text-navy opacity-0 shadow-2xl"
      >
        Ver obra
      </div>
    </section>
  );
}
