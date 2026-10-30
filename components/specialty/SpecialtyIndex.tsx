"use client";

import { useRef, useState } from "react";
import { projectsByCategory } from "@/data/projects";
import { specialties } from "@/data/specialties";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { RevealImage } from "@/components/motion/RevealImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowRight, IconArrowUpRight, specialtyIcons } from "@/components/ui/Icons";

/**
 * Índice de las cinco líneas de negocio.
 * Escritorio: un índice lateral fijo marca la especialidad en pantalla (con una barra
 * que se rellena por tramos) mientras las filas alternan foto y texto; el número
 * gigante de cada fila se desliza en sentido contrario a la foto.
 * Móvil: filas apiladas con los mismos revelados, sin índice fijo.
 */
export function SpecialtyIndex() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-si-row]").forEach((row) => {
          gsap.fromTo(
            row.querySelector("[data-si-number]"),
            { yPercent: 35 },
            { yPercent: -35, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } },
          );
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } });
          tl.from(row.querySelector("[data-si-rule]"), { scaleX: 0, duration: 1.3, ease: "expo.inOut" })
            .from(row.querySelector("[data-si-icon]"), { scale: 0, rotate: -120, duration: 1.1, ease: "back.out(1.7)" }, 0.15)
            .from(row.querySelectorAll("[data-si-chip]"), { y: 16, opacity: 0, stagger: 0.05, duration: 0.7, ease: "expo.out" }, 0.4)
            .from(row.querySelectorAll("[data-si-cta]"), { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, ease: "expo.out" }, 0.55);
        });
      });
      mm.add(MQ.desktop, () => {
        gsap.utils.toArray<HTMLElement>("[data-si-row]").forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
          gsap.fromTo(
            `[data-si-fill="${i}"]`,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 55%", end: "bottom 55%", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="lineas-title" className="relative overflow-x-clip bg-white py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> Líneas de negocio
            </p>
            <SplitReveal as="h2" id="lineas-title" variant="lines" className="mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1.02] text-navy">
              Cinco especialidades, <span className="title-accent text-blue">un mismo compromiso.</span>
            </SplitReveal>
          </div>
          <p className="text-[17px] leading-relaxed text-muted lg:col-span-5">
            Capacidad técnica aplicada a obras públicas y privadas. Cada línea de negocio reúne las obras del portafolio publicado por IVC.
          </p>
        </div>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          {/* Índice lateral fijo (escritorio) */}
          <nav aria-label="Índice de especialidades" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-32 space-y-1">
              {specialties.map((s, i) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    onClick={() => scrollTo(`linea-${s.slug}`)}
                    aria-current={active === i ? "true" : undefined}
                    className="group relative flex w-full items-center gap-4 py-3 pl-5 text-left"
                  >
                    <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-line">
                      <span data-si-fill={i} className="absolute inset-0 origin-top bg-blue" style={{ transform: "scaleY(0)" }} />
                    </span>
                    <span className={`kicker w-6 transition-colors duration-500 ${active === i ? "text-blue" : "text-navy/65"}`}>{s.number}</span>
                    <span
                      className={`font-display text-[15px] font-semibold tracking-[-0.01em] transition-all duration-500 ease-out-expo ${
                        active === i ? "translate-x-1 text-navy" : "text-navy/65 group-hover:text-navy"
                      }`}
                    >
                      {s.shortName}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-24 md:gap-32 lg:col-span-9">
            {specialties.map((s, i) => {
              const Icon = specialtyIcons[s.slug];
              const count = projectsByCategory(s.slug).length;
              const flip = i % 2 === 1;
              return (
                <article key={s.slug} id={`linea-${s.slug}`} data-si-row aria-labelledby={`linea-${s.slug}-title`} className="relative scroll-mt-28">
                  <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
                    <div className={`relative ${flip ? "md:order-last" : ""}`}>
                      <RevealImage
                        src={s.image}
                        alt={s.imageAlt}
                        sizes="(min-width: 1024px) 36vw, (min-width: 768px) 50vw, 100vw"
                        reveal={flip ? "left" : "right"}
                        parallax={14}
                        className="z-10 aspect-[4/5] rounded-[28px]"
                      />
                      {/* Numeral en contorno detrás de la foto: solo asoma por su borde. */}
                      <span
                        data-si-number
                        aria-hidden="true"
                        className={`text-outline text-outline-navy pointer-events-none absolute -bottom-14 z-0 font-display text-[clamp(6rem,14vw,12rem)] font-semibold leading-none tracking-[-0.06em] ${
                          flip ? "-left-4 md:-left-16" : "-right-4 md:-right-16"
                        }`}
                      >
                        {s.number}
                      </span>
                    </div>

                    <div className="relative">
                      <span data-si-rule className="absolute inset-x-0 -top-6 h-px origin-left bg-line" />
                      <div className="flex items-center gap-4">
                        <span data-si-icon className="grid size-14 shrink-0 place-items-center rounded-full bg-navy text-white">
                          <Icon size={24} />
                        </span>
                        <p className="kicker text-blue">Especialidad {s.number} / 05</p>
                      </div>
                      <SplitReveal
                        as="h2"
                        id={`linea-${s.slug}-title`}
                        variant="words"
                        className="mt-6 max-w-[16ch] text-[clamp(1.9rem,3.2vw,3rem)] font-semibold leading-[1.05] text-navy"
                      >
                        {s.name}
                      </SplitReveal>
                      <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-muted">{s.summary}</p>
                      <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Tipos de obra en ${s.shortName.toLowerCase()}`}>
                        {s.scope.map((x) => (
                          <li key={x} data-si-chip className="rounded-full bg-paper px-3.5 py-1.5 text-[13px] text-navy ring-1 ring-inset ring-navy/10">
                            {x}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                        <TransitionLink
                          data-si-cta
                          href={`/especialidades/${s.slug}`}
                          className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-navy px-6 text-[13px] font-semibold text-white"
                        >
                          <span aria-hidden="true" className="absolute inset-0 translate-y-full rounded-full bg-blue transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                          <span className="relative">Ver especialidad</span>
                          <IconArrowRight size={16} className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
                        </TransitionLink>
                        {count > 0 && (
                          <TransitionLink
                            data-si-cta
                            href={`/proyectos?especialidad=${s.slug}`}
                            className="group inline-flex min-h-12 items-center gap-2 text-[13px] font-semibold text-blue"
                          >
                            {count} {count === 1 ? "obra" : "obras"} en el portafolio
                            <IconArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
                          </TransitionLink>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
