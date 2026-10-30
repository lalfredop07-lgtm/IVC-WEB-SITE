"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { specialtyBySlug } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/Button";
import { IconArrowRight, IconArrowUpRight } from "@/components/ui/Icons";
import { BeforeAfter } from "./BeforeAfter";

type Props = { project: Project; next: Project; related: Project[] };

const PENDING_FIELDS: [keyof Project, string][] = [
  ["cliente", "Cliente o entidad"],
  ["periodo", "Periodo"],
  ["estado", "Estado"],
  ["participacion", "Modalidad de participación"],
  ["alcance", "Alcance técnico"],
];

/**
 * Cuerpo de la ficha de obra: presentación con datos confirmados, galería
 * (expansión a pantalla completa, comparador original/mejorada, detalles en parallax)
 * y navegación hacia la siguiente obra.
 */
export function ProjectBody({ project: p, next, related }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const category = specialtyBySlug(p.category)!;
  const pending = PENDING_FIELDS.filter(([k]) => p[k] === null);
  const confirmed: [string, React.ReactNode][] = [
    ["Especialidad", category.name],
    ...(p.region ? ([["Ubicación", `${p.region}, Perú`]] as [string, string][]) : []),
    [
      "Fuente",
      p.fuente ? (
        <a href={p.fuente} target="_blank" rel="noopener noreferrer" className="-my-2.5 inline-flex min-h-11 items-center gap-1 text-blue underline-offset-4 hover:underline lg:my-0 lg:min-h-6">
          Galería oficial de IVC <IconArrowUpRight size={13} />
        </a>
      ) : (
        "Sitio web oficial de IVC"
      ),
    ],
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-pb-row]", {
          y: 30,
          opacity: 0,
          stagger: 0.07,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-pb-sheet]", start: "top 85%", once: true },
        });
        // La fotografía se expande hasta ocupar todo el ancho.
        gsap.fromTo(
          "[data-pb-wide]",
          { clipPath: "inset(10% 14% 10% 14% round 32px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: "[data-pb-wide]", start: "top 90%", end: "top 15%", scrub: 0.6 } },
        );
        gsap.fromTo(
          "[data-pb-wide-img]",
          { yPercent: -10, scale: 1.2 },
          { yPercent: 10, scale: 1, ease: "none", scrollTrigger: { trigger: "[data-pb-wide]", start: "top bottom", end: "bottom top", scrub: true } },
        );
        // Detalles a velocidades distintas.
        gsap.utils.toArray<HTMLElement>("[data-pb-detail]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { yPercent: i ? 25 : -5 },
            { yPercent: i ? -20 : 10, ease: "none", scrollTrigger: { trigger: "[data-pb-details]", start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
        gsap.fromTo(
          "[data-pb-next-img]",
          { scale: 1.3 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-pb-next]", start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* B + D. Presentación e información técnica */}
      <section aria-labelledby="presentacion-title" className="bg-white py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker text-blue">Presentación</p>
            <SplitReveal as="h2" id="presentacion-title" variant="lines" className="mt-5 text-[clamp(1.9rem,3.4vw,3.1rem)] font-semibold leading-[1.1] text-navy">
              {`${p.name} forma parte de la experiencia de IVC en ${category.name.toLowerCase()}.`}
            </SplitReveal>
            <SplitReveal as="p" variant="blur" stagger={0.01} className="mt-8 max-w-[38rem] text-[17px] leading-relaxed text-muted">
              {`La obra figura en las galerías fotográficas publicadas por IVC Contratistas Generales${p.region ? ` y se ubica en ${p.region}` : ""}. Esta línea de negocio comprende ${category.scope
                .join(", ")
                .toLowerCase()}. La descripción, el contexto y los objetivos de la obra se publicarán cuando IVC los valide.`}
            </SplitReveal>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="kicker text-navy/65">Información confirmada</h2>
            <dl data-pb-sheet className="mt-5 divide-y divide-line border-y border-line text-[15px]">
              {confirmed.map(([k, v]) => (
                <div key={k} data-pb-row className="flex justify-between gap-6 py-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
            {pending.length > 0 && (
              <div data-pb-row className="mt-6 rounded-[18px] bg-paper p-5">
                <p className="kicker text-[10px] text-blue">Pendiente de validación por IVC</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pending.map(([, label]) => label).join(" · ")}</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* C. Galería */}
      <section aria-labelledby="galeria-title" className="overflow-hidden bg-white pb-24 md:pb-36">
        <h2 id="galeria-title" className="sr-only">
          Galería de la obra
        </h2>
        <div data-pb-wide className="relative h-[70svh] min-h-[380px] overflow-hidden md:h-[92svh]">
          <div data-pb-wide-img className="absolute -inset-y-[10%] inset-x-0 will-change-transform">
            <Image src={p.photos[0].enhanced} alt={p.photos[0].alt} fill sizes="100vw" className="object-cover" />
          </div>
        </div>

        <div className="container-x mt-24 md:mt-36">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SplitReveal as="h3" variant="words" className="max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.8rem)] font-semibold leading-[1.05] text-navy">
              Original y visualización mejorada
            </SplitReveal>
            <p className="max-w-[30rem] text-[15px] leading-relaxed text-muted md:text-sm">
              Deslice para comparar. La visualización mejorada es una propuesta de dirección de arte y no constituye un registro documental del estado
              de la obra.
            </p>
          </div>
          {p.photos.map((ph) => (
            <div key={ph.id} className="mb-6">
              <BeforeAfter original={ph.original} enhanced={ph.enhanced} alt={ph.alt} />
            </div>
          ))}
        </div>

        {/* Detalles: encuadres de la misma fotografía en planos de profundidad distintos */}
        <div data-pb-details className="container-x mt-20 grid grid-cols-12 gap-4 md:mt-32 md:gap-6">
          <div data-pb-detail className="relative col-span-7 aspect-[3/4] overflow-hidden rounded-[24px] md:col-span-5">
            <Image src={p.photos[0].enhanced} alt="" fill sizes="40vw" className="scale-[1.6] object-cover object-[30%_60%]" />
          </div>
          <div data-pb-detail className="relative col-span-5 mt-24 aspect-[3/4] overflow-hidden rounded-[24px] md:col-span-4 md:col-start-8 md:mt-40">
            <Image src={(p.photos[1] ?? p.photos[0]).enhanced} alt="" fill sizes="35vw" className="scale-[1.4] object-cover object-[75%_40%]" />
          </div>
          <p className="col-span-12 mt-6 text-sm text-muted md:col-span-5">Encuadres de detalle de la fotografía publicada.</p>
        </div>
      </section>

      {/* E. Más proyectos */}
      <section data-pb-next aria-label="Siguiente obra" className="relative overflow-hidden bg-navy-950 text-white">
        <TransitionLink href={`/proyectos/${next.slug}`} imageTransition className="group relative block">
          <div className="absolute inset-0">
            <div data-pb-next-img className="absolute inset-0">
              <Image src={next.photos[0].enhanced} alt="" fill sizes="100vw" className="object-cover opacity-45 transition-opacity duration-700 group-hover:opacity-70" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-navy-950/20" />
          </div>
          <div className="container-x relative flex min-h-[60svh] flex-col justify-center py-20">
            <p className="kicker text-sky">Siguiente obra · {specialtyBySlug(next.category)?.shortName}</p>
            <p className="mt-6 flex items-end gap-6 font-display text-[clamp(2.2rem,6vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              <span className="max-w-[16ch] transition-transform duration-700 ease-out-expo group-hover:translate-x-4">{next.name}</span>
              <IconArrowRight size={56} className="mb-2 hidden shrink-0 transition-transform duration-700 ease-out-expo group-hover:translate-x-6 md:block" />
            </p>
          </div>
        </TransitionLink>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="relacionadas-title" className="bg-navy-950 pb-28 pt-4 text-white md:pb-36">
          <div className="container-x">
            <div className="flex flex-col gap-6 border-t border-white/10 pt-14 md:flex-row md:items-end md:justify-between">
              <h2 id="relacionadas-title" className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05]">
                Más obras de <span className="title-accent text-sky">{category.shortName.toLowerCase()}</span>
              </h2>
              <Button href={`/proyectos?especialidad=${category.slug}`} variant="outline-light">
                Ver en el portafolio
              </Button>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {related.map((r, i) => (
                <li key={r.slug}>
                  <ProjectCard project={r} index={i} href={`/proyectos/${r.slug}`} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
