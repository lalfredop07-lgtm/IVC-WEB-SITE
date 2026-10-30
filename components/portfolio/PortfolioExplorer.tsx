"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { formatRegion, projects } from "@/data/projects";
import { specialties, specialtyBySlug, type SpecialtySlug } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { TransitionLink } from "@/components/motion/PageTransition";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { ProjectCard } from "@/components/project/ProjectCard";
import { IconArrowUpRight } from "@/components/ui/Icons";

export type PortfolioFilter = "todos" | SpecialtySlug;
type View = "galeria" | "indice";

const filters: { id: PortfolioFilter; label: string }[] = [
  { id: "todos", label: "Todas" },
  ...specialties.map((s) => ({ id: s.slug, label: s.shortName })),
];

// Ritmo editorial en 12 columnas: 7+5 · 4+4+4 · 5+7
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-5", "lg:col-span-7"];

const isFilter = (v: string | null): v is PortfolioFilter => v === "todos" || specialties.some((s) => s.slug === v);

/**
 * Explorador del portafolio: barra fija con filtros (indicador deslizante), selector
 * de vista Galería/Índice, reordenación animada y, en la vista Índice, una
 * previsualización flotante que sigue al cursor.
 */
export function PortfolioExplorer({ initialFilter = "todos" }: { initialFilter?: string | null }) {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<PortfolioFilter>(isFilter(initialFilter ?? null) ? (initialFilter as PortfolioFilter) : "todos");
  const [view, setView] = useState<View>("galeria");
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollTo } = useSmoothScroll();

  const list = useMemo(() => (filter === "todos" ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const countFor = (f: PortfolioFilter) => (f === "todos" ? projects.length : projects.filter((p) => p.category === f).length);

  const choose = (f: PortfolioFilter) => {
    setFilter(f);
    const url = f === "todos" ? "/proyectos" : `/proyectos?especialidad=${f}`;
    window.history.replaceState(null, "", url);
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < -40 && root.current) scrollTo(root.current);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-px-head] > *", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Previsualización flotante: el seguimiento del puntero solo existe en la vista Índice.
  useGSAP(
    () => {
      if (view !== "indice") return;
      const mm = gsap.matchMedia();
      mm.add(MQ.finePointer, () => {
        const el = preview.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
        const rTo = gsap.quickTo(el, "rotate", { duration: 0.9, ease: "power3" });
        let last = 0;
        const move = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          rTo(gsap.utils.clamp(-8, 8, (e.clientX - last) * 0.4));
          last = e.clientX;
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [view] },
  );

  return (
    <section ref={root} id="portafolio" aria-labelledby="portafolio-title" className="relative scroll-mt-24 bg-navy-950 pb-28 pt-20 text-white md:pb-36 md:pt-28">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />

      <div className="container-x relative">
        <div data-px-head className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="portafolio-title" className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02]">
            Explore el <span className="title-accent text-sky">portafolio.</span>
          </h2>
          <p className="max-w-[30rem] text-[15px] leading-relaxed text-white/60">
            Fotografías publicadas por IVC. Las imágenes son visualizaciones mejoradas para esta propuesta; cada ficha permite ver la fotografía
            original.
          </p>
        </div>

        {/* Barra de herramientas fija */}
        <div className="relative z-30 -mx-[var(--gutter)] mt-12 px-[var(--gutter)] py-3 md:sticky md:top-[86px] lg:top-[88px]">
          <div className="flex flex-col gap-3 rounded-[22px] bg-navy-900/80 p-2 ring-1 ring-white/10 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <LayoutGroup id="px-filters">
              <div role="group" aria-label="Filtrar por especialidad" className="overflow-x-auto [scrollbar-width:none] max-lg:[mask-image:linear-gradient(to_right,#000_85%,transparent)] max-lg:pr-6">
                <div className="flex w-max gap-1">
                  {filters.map((f) => {
                    const active = filter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => choose(f.id)}
                        className={`relative min-h-11 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors duration-300 ${
                          active ? "text-navy" : "text-white/70 hover:text-white"
                        }`}
                      >
                        {active && <motion.span layoutId="px-filter-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                        <span className="relative">
                          {f.label}
                          <sup className={`ml-1 text-[10px] ${active ? "text-blue" : "text-white/55"}`}>{countFor(f.id)}</sup>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </LayoutGroup>
            <LayoutGroup id="px-view">
              <div role="group" aria-label="Tipo de vista" className="flex shrink-0 gap-1 self-start rounded-full bg-white/5 p-1 lg:self-auto">
                {(["galeria", "indice"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className={`relative min-h-11 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] lg:min-h-0 transition-colors ${view === v ? "text-navy" : "text-white/60 hover:text-white"}`}
                  >
                    {view === v && <motion.span layoutId="px-view-pill" className="absolute inset-0 rounded-full bg-sky" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <span className="relative">{v === "galeria" ? "Galería" : "Índice"}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>
        </div>

        <p className="mt-6 text-sm text-white/55" aria-live="polite">
          {list.length} {list.length === 1 ? "obra" : "obras"}
          {filter !== "todos" && <> · {specialtyBySlug(filter)?.name}</>}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {view === "galeria" ? (
            <motion.ul
              key="galeria"
              layout
              className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((p, i) => {
                  const span = SPANS[i % SPANS.length];
                  const wide = span.endsWith("7");
                  return (
                    <motion.li
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, y: 70, scale: 0.92, rotateX: -12, filter: "blur(8px)" }}
                      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.3 } }}
                      transition={{ type: "spring", stiffness: 110, damping: 20, delay: (i % 3) * 0.06 }}
                      className={`[perspective:1200px] ${span} ${i === 0 ? "sm:col-span-2" : ""}`}
                    >
                      <ProjectCard
                        project={p}
                        index={projects.indexOf(p)}
                        href={`/proyectos/${p.slug}`}
                        large={wide}
                        sizes={wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"}
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.ol
              key="indice"
              className="mt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
              onPointerLeave={() => setHovered(null)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                    exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                    className="border-b border-white/10"
                  >
                    <TransitionLink
                      href={`/proyectos/${p.slug}`}
                      imageTransition
                      transitionImage={() => {
                        const pv = preview.current;
                        if (!pv || getComputedStyle(pv).opacity === "0") return null;
                        return pv.querySelector<HTMLImageElement>(`[data-pv="${p.slug}"] img`);
                      }}
                      onPointerEnter={() => setHovered(p.slug)}
                      onFocus={() => setHovered(p.slug)}
                      onBlur={() => setHovered(null)}
                      className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden py-5 md:grid-cols-[60px_1fr_220px_160px_48px] md:gap-6 md:py-7"
                    >
                      <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-white/[0.04] transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                      <span className="relative size-14 overflow-hidden rounded-xl md:hidden">
                        <Image src={p.photos[0].enhanced} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="kicker relative hidden text-white/55 md:block">{String(projects.indexOf(p) + 1).padStart(2, "0")}</span>
                      <span className="relative font-display text-[clamp(1.15rem,2.4vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.035em] transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                        {p.name}
                        <span className="mt-1 block text-[13px] font-normal tracking-normal text-white/60 md:hidden">{formatRegion(p.region)}</span>
                      </span>
                      <span className="relative hidden text-sm text-white/55 md:block">{specialtyBySlug(p.category)?.shortName}</span>
                      <span className="relative hidden text-sm text-white/55 md:block">{p.region ?? "Por confirmar"}</span>
                      <span className="relative grid size-11 place-items-center rounded-full ring-1 ring-inset ring-white/20 transition-colors duration-500 group-hover:bg-white group-hover:text-navy">
                        <IconArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
                      </span>
                    </TransitionLink>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ol>
          )}
        </AnimatePresence>
      </div>

      {/* Previsualización flotante (vista Índice, solo ratón) */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden h-[220px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] shadow-2xl transition-[opacity,scale] duration-500 ease-out-expo [@media(hover:hover)]:block ${
          view === "indice" && hovered ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {list.map((p) => (
          <div key={p.slug} data-pv={p.slug} className={`absolute inset-0 transition-opacity duration-500 ${hovered === p.slug ? "opacity-100" : "opacity-0"}`}>
            <Image src={p.photos[0].enhanced} alt="" fill sizes="300px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
