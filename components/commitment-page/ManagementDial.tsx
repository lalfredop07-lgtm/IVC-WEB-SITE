"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { managementSystem } from "@/data/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { IconAward, IconHelmet, IconLeaf, IconScale } from "@/components/ui/Icons";

// Textos derivados de la misión publicada y de la página de certificaciones de IVC.
const axes = [
  {
    ...managementSystem[0],
    Icon: IconAward,
    title: "Gestión de la calidad",
    text: "Ejecutamos proyectos y obras de ingeniería con una filosofía de gestión de la calidad, orientada a la mejora continua y a la plena satisfacción de nuestros clientes.",
    image: "/projects/enhanced/06-universidad-san-luis-gonzaga.webp",
    alt: "Facultades de la Universidad Nacional San Luis Gonzaga, Ica",
  },
  {
    ...managementSystem[2],
    Icon: IconHelmet,
    title: "Seguridad y salud ocupacional",
    text: "La seguridad y la salud ocupacional de las personas forman parte de la filosofía de gestión con la que IVC ejecuta sus obras.",
    image: "/projects/enhanced/15-agua-sjl-lima.webp",
    alt: "Trabajadores con equipo de protección instalando una tubería en San Juan de Lurigancho",
  },
  {
    ...managementSystem[1],
    Icon: IconLeaf,
    title: "Respeto al medio ambiente",
    text: "El respeto al medio ambiente acompaña la ejecución de cada proyecto, como parte del sistema de gestión de la empresa.",
    image: "/projects/enhanced/03-riego-la-achirana-ica.webp",
    alt: "Sistema de Riego La Achirana entre campos de cultivo, Ica",
  },
  {
    ...managementSystem[3],
    Icon: IconScale,
    title: "Gestión antisoborno",
    text: "IVC cuenta con una política antisoborno publicada, un alcance definido para su sistema de gestión antisoborno y un canal específico de denuncias.",
    image: "/projects/enhanced/17-edificio-dirmin.webp",
    alt: "Fachada del edificio DIRMIN",
  },
];

const R = 120;
const C = 2 * Math.PI * R;
const SEG = C / axes.length;
const GAP = 10;

/**
 * Sistema de gestión en scrollytelling: un dial técnico fijo cuyos cuatro arcos
 * se completan con el scroll mientras a la derecha pasan los cuatro ejes.
 */
export function ManagementDial() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const arcs = gsap.utils.toArray<SVGCircleElement>("[data-md-arc]");
        arcs.forEach((arc) => gsap.set(arc, { strokeDashoffset: SEG - GAP }));
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "[data-md-panels]", start: "top 60%", end: "bottom 60%", scrub: 0.5 },
        });
        arcs.forEach((arc) => tl.to(arc, { strokeDashoffset: 0, duration: 1 }));
        tl.to("[data-md-ticks]", { rotate: 90, transformOrigin: "50% 50%", duration: arcs.length }, 0);

        gsap.utils.toArray<HTMLElement>("[data-md-panel]").forEach((panel, i) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
          gsap.fromTo(
            panel.querySelector("[data-md-photo]"),
            { clipPath: "inset(0% 0% 100% 0% round 24px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              duration: 0.8,
              ease: "expo.out",
              scrollTrigger: { trigger: panel, start: "top 95%", once: true },
            },
          );
          gsap.fromTo(
            panel.querySelector("[data-md-photo] img"),
            { yPercent: -8, scale: 1.2 },
            { yPercent: 8, scale: 1.05, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
      mm.add(MQ.reduce, () => {
        gsap.utils.toArray<HTMLElement>("[data-md-panel]").forEach((panel, i) =>
          ScrollTrigger.create({ trigger: panel, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) }),
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const current = axes[active];

  return (
    <section ref={root} aria-labelledby="sistema-title" className="relative bg-navy-950 text-white">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
      <div className="container-x relative pt-28 md:pt-36">
        <p className="kicker flex items-center gap-3 text-sky">
          <span className="h-px w-8 bg-sky" /> 01 — Sistema de gestión
        </p>
        <SplitReveal as="h2" id="sistema-title" variant="lines" className="mt-6 max-w-[18ch] text-[clamp(2.2rem,4.8vw,4.4rem)] font-semibold leading-[1.02]">
          Cuatro ejes que ordenan <span className="title-accent text-sky">cada obra.</span>
        </SplitReveal>
        <p className="mt-6 max-w-[36rem] text-[15px] leading-relaxed text-white/65 md:text-sm md:text-white/60">
          Normas que IVC presenta como parte de su Sistema de Gestión. La vigencia, el alcance y la entidad certificadora están pendientes de
          verificación documental; por eso no se muestran sellos.
        </p>
      </div>

      <div className="container-x relative grid gap-10 pb-28 pt-16 md:pb-36 lg:grid-cols-12">
        {/* Dial fijo */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[18svh]">
            <div className="relative mx-auto aspect-square w-full max-w-[440px]">
              <svg viewBox="0 0 300 300" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="150" cy="150" r={R} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="14" />
                {axes.map((a, i) => (
                  <circle
                    key={a.norm}
                    data-md-arc
                    cx="150"
                    cy="150"
                    r={R}
                    fill="none"
                    stroke={i === active ? "#a7cfe6" : "#4f97cf"}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${SEG - GAP} ${C}`}
                    transform={`rotate(${(360 / axes.length) * i} 150 150)`}
                    className="transition-[stroke] duration-500"
                  />
                ))}
              </svg>
              <svg data-md-ticks viewBox="0 0 300 300" className="absolute inset-0 size-full" aria-hidden="true">
                {Array.from({ length: 72 }).map((_, i) => (
                  <line
                    key={i}
                    x1="150"
                    y1={i % 6 ? 8 : 2}
                    x2="150"
                    y2="16"
                    stroke="rgb(255 255 255 / 0.25)"
                    strokeWidth={i % 6 ? 0.6 : 1.2}
                    transform={`rotate(${i * 5} 150 150)`}
                  />
                ))}
              </svg>
              <div className="absolute inset-[22%] grid place-items-center rounded-full bg-navy text-center ring-1 ring-white/10">
                <div key={current.norm} className="animate-[fadeUp_.7s_cubic-bezier(.16,1,.3,1)]">
                  <current.Icon size={34} className="mx-auto text-sky" />
                  <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]">{current.norm}</p>
                  <p className="mt-1 text-sm text-white/60">{current.area}</p>
                  <p className="kicker mt-4 text-[10px] text-white/55">0{active + 1} / 0{axes.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paneles */}
        <div data-md-panels className="flex flex-col gap-20 lg:col-span-6 lg:col-start-7 lg:gap-32">
          {axes.map((a, i) => (
            <article key={a.norm} data-md-panel className="lg:min-h-[70svh]">
              <div data-md-photo className="relative aspect-[16/10] overflow-hidden rounded-[24px]">
                <Image src={a.image} alt={a.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                <span className="kicker absolute left-4 top-4 rounded-full bg-navy-950/60 px-3 py-1.5 text-[10px] backdrop-blur-md">
                  0{i + 1} · {a.norm}
                </span>
              </div>
              <div className="mt-8 flex items-start gap-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-navy lg:hidden">
                  <a.Icon size={24} />
                </span>
                <div>
                  <h3 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-[1.1]">{a.title}</h3>
                  <p className="mt-4 max-w-[34rem] text-[17px] leading-relaxed text-white/70">{a.text}</p>
                  <p className="kicker mt-5 text-[10px] text-sky">Norma de referencia · {a.norm} · {a.area}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
