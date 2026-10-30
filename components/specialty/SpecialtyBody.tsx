"use client";

import Image from "next/image";
import { LayoutGroup, motion } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import type { Specialty } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/Button";
import { IconArrowRight } from "@/components/ui/Icons";

type Props = { specialty: Specialty; related: Project[]; next: Specialty };

export function SpecialtyBody({ specialty: s, related, next }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-scope-item]", {
          xPercent: -8,
          opacity: 0,
          stagger: 0.07,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-scope]", start: "top 85%", once: true },
        });
        gsap.from("[data-scope-rule]", {
          scaleX: 0,
          stagger: 0.07,
          duration: 1.2,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-scope]", start: "top 85%", once: true },
        });
        gsap.fromTo(
          "[data-next-img]",
          { scale: 1.3 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-next]", start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section aria-labelledby="alcance-title" className="bg-white py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-blue">Alcance</p>
            <SplitReveal as="h2" id="alcance-title" variant="lines" className="mt-5 text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-[1.05] text-navy">
              Tipos de obra en esta línea de negocio
            </SplitReveal>
            <p className="mt-6 max-w-[28rem] text-muted">
              Capacidades declaradas por IVC para {s.name.toLowerCase()}. El detalle técnico de cada proyecto se publicará tras su validación.
            </p>
          </div>
          <ul data-scope className="lg:col-span-6 lg:col-start-7">
            {s.scope.map((item, i) => (
              <li key={item} data-scope-item className="group relative flex items-baseline gap-6 py-6">
                <span data-scope-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
                <span className="kicker w-8 text-blue/80">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(1.3rem,2.2vw,1.9rem)] font-medium tracking-[-0.03em] text-navy transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="relacionados-title" className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
          <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
          <div className="container-x relative">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="kicker text-sky">Proyectos</p>
                <SplitReveal as="h2" id="relacionados-title" variant="lines" className="mt-5 text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.02]">
                  Experiencia en {s.shortName.toLowerCase()}
                </SplitReveal>
              </div>
              <Button href={`/proyectos?especialidad=${s.slug}`} variant="outline-light">
                Ver en el portafolio
              </Button>
            </div>
            <LayoutGroup>
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                {related.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    initial={{ opacity: 0, y: 70, rotate: i % 2 ? 2 : -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ type: "spring", stiffness: 90, damping: 18, delay: (i % 3) * 0.08 }}
                  >
                    <ProjectCard project={p} index={i} href={`/proyectos/${p.slug}`} />
                  </motion.li>
                ))}
              </ul>
            </LayoutGroup>
          </div>
        </section>
      )}

      <section data-next aria-label="Siguiente especialidad" className="relative overflow-hidden bg-navy text-white">
        <TransitionLink href={`/especialidades/${next.slug}`} className="group relative block">
          <div className="absolute inset-0">
            <div data-next-img className="absolute inset-0">
              <Image src={next.image} alt="" fill sizes="100vw" className="object-cover opacity-40 transition-opacity duration-700 group-hover:opacity-60" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 to-navy/40" />
          </div>
          <div className="container-x relative flex min-h-[50svh] flex-col justify-center py-20">
            <p className="kicker text-sky">Siguiente especialidad · {next.number}</p>
            <p className="mt-5 flex items-center gap-6 font-display text-[clamp(2.2rem,6vw,5.6rem)] font-semibold leading-none tracking-[-0.05em]">
              <span className="transition-transform duration-700 ease-out-expo group-hover:translate-x-4">{next.name}</span>
              <IconArrowRight size={56} className="hidden shrink-0 transition-transform duration-700 ease-out-expo group-hover:translate-x-6 md:block" />
            </p>
          </div>
        </TransitionLink>
      </section>

      <section className="bg-paper py-20">
        <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="max-w-[24ch] font-display text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-navy">
            ¿Un proyecto de <span className="title-accent text-blue">{s.shortName.toLowerCase()}</span>?
          </p>
          <Button href="/contacto" variant="navy">
            Conversemos
          </Button>
        </div>
      </section>
    </div>
  );
}
