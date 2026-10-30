"use client";

import { useRef } from "react";
import { managementSystem, site, yearsSinceFoundation } from "@/data/site";
import { specialties } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { Counter } from "@/components/motion/Counter";
import { YearsCounter } from "@/components/motion/YearsCounter";
import { RevealImage } from "@/components/motion/RevealImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowRight } from "@/components/ui/Icons";

/**
 * Equipo y capacidad. Solo cifras verificables (años, líneas de negocio, normas del
 * sistema de gestión) y la ficha corporativa publicada. La información de equipo
 * queda expresamente pendiente de IVC.
 */
export function Capacity() {
  const root = useRef<HTMLElement>(null);
  const years = yearsSinceFoundation();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-cap-stat]", {
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cap-stats]", start: "top 85%", once: true },
        });
        gsap.from("[data-cap-row]", {
          x: -30,
          opacity: 0,
          stagger: 0.06,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cap-sheet]", start: "top 85%", once: true },
        });
        gsap.from("[data-cap-note]", {
          y: 80,
          rotate: 3,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cap-note]", start: "top 95%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const stats = [
    { value: years, label: "años de trayectoria", note: "desde febrero de 1988", live: true },
    { value: specialties.length, label: "líneas de negocio", note: "hidráulica, urbanismo, edificaciones, energía y transporte" },
    { value: managementSystem.length, label: "normas en su sistema de gestión", note: managementSystem.map((m) => m.norm).join(" · ") },
  ];

  const sheet = [
    ["Razón social", site.legalName],
    ["RUC", site.ruc],
    ["Inicio de actividades", "Febrero de 1988"],
    ["Sede", `${site.contact.address}, ${site.contact.district}`],
    ["Sectores atendidos", "Público y privado"],
  ];

  return (
    <section ref={root} aria-labelledby="capacidad-title" className="relative overflow-hidden bg-white py-28 md:py-40">
      <div className="container-x">
        <p className="kicker flex items-center gap-3 text-blue">
          <span className="h-px w-8 bg-blue" /> 04 — Equipo y capacidad
        </p>
        <SplitReveal as="h2" id="capacidad-title" variant="words" className="mt-6 max-w-[16ch] text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1.02] text-navy">
          Solidez que se puede <span className="title-accent text-blue">comprobar.</span>
        </SplitReveal>

        <ul data-cap-stats className="mt-16 grid gap-px overflow-hidden rounded-[26px] bg-line ring-1 ring-line md:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} data-cap-stat className="group bg-white p-8 transition-colors duration-500 hover:bg-navy md:p-10">
              {s.live ? (
                <YearsCounter className="font-display text-[clamp(4rem,8vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-navy transition-colors duration-500 group-hover:text-white" />
              ) : (
                <Counter value={s.value} className="font-display text-[clamp(4rem,8vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-navy transition-colors duration-500 group-hover:text-white" />
              )}
              <p className="mt-4 text-lg font-semibold text-navy transition-colors duration-500 group-hover:text-white">{s.label}</p>
              <p className="mt-1 text-sm text-muted transition-colors duration-500 group-hover:text-white/60">{s.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="kicker text-navy/65">Ficha corporativa</h3>
            <dl data-cap-sheet className="mt-6 divide-y divide-line border-y border-line">
              {sheet.map(([k, v]) => (
                <div key={k} data-cap-row className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <RevealImage
              src="/projects/enhanced/20-carhuaquero-ii.webp"
              alt="Trabajadores en el montaje de una turbina en Carhuaquero II"
              sizes="(min-width: 1024px) 45vw, 100vw"
              reveal="right"
              className="aspect-[4/3] rounded-[26px]"
            />
            <div
              data-cap-note
              className="relative -mt-16 ml-auto w-[88%] rounded-[22px] bg-white p-7 shadow-[0_30px_80px_-30px_rgb(0_27_49/0.45)] ring-1 ring-navy/5 md:p-8"
            >
              <p className="kicker text-blue">Equipo humano</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                La presentación del equipo directivo, los profesionales y la capacidad operativa de IVC se incorporará con información aprobada por la
                empresa.
              </p>
              <TransitionLink href="/trabaja-con-nosotros" className="group mt-5 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-blue">
                Trabaja con nosotros
                <IconArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
