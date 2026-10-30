"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { policies } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowUpRight } from "@/components/ui/Icons";

const policy = (title: string) => policies.find((p) => p.title === title)!;

// Compromisos publicados por IVC que afectan directamente a las personas.
const panels = [
  {
    title: "Seguridad y salud ocupacional",
    text: "ISO 45001 forma parte del sistema de gestión que IVC presenta para sus obras.",
    image: "/projects/enhanced/15-agua-sjl-lima.webp",
    alt: "Trabajadores con casco y chaleco instalando una tubería",
    href: "/compromiso",
    internal: true,
    cta: "Ver nuestro compromiso",
  },
  {
    title: "Igualdad y equidad de género",
    text: "IVC publica una política de igualdad y equidad de género.",
    image: "/projects/enhanced/06-universidad-san-luis-gonzaga.webp",
    alt: "Facultades de la Universidad Nacional San Luis Gonzaga, Ica",
    href: policy("Política de igualdad y equidad de género").href,
    cta: "Leer la política",
  },
  {
    title: "No discriminación a la mujer",
    text: "IVC publica una política de no discriminación a la mujer.",
    image: "/projects/enhanced/07-hospital-santa-maria-socorro.webp",
    alt: "Hospital Santa María del Socorro, Ica",
    href: policy("Política de no discriminación a la mujer").href,
    cta: "Leer la política",
  },
  {
    title: "Empleabilidad, solidaridad y apoyo social",
    text: "IVC publica una política de empleabilidad, solidaridad y apoyo social.",
    image: "/projects/enhanced/11-casuarinas-ica.webp",
    alt: "Viviendas de Las Casuarinas, Ica",
    href: policy("Política de empleabilidad, solidaridad y apoyo social").href,
    cta: "Leer la política",
  },
];

/**
 * Paneles en acordeón horizontal: el activo se expande y descubre su fotografía,
 * los demás se pliegan mostrando el título en vertical. En móvil, tarjetas apiladas.
 */
export function PeoplePanels() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-pp-panel]",
          { clipPath: "inset(100% 0% 0% 0% round 26px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 26px)",
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: "[data-pp-row]", start: "top 80%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="personas-title" className="relative bg-white py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> 01 — Las personas primero
            </p>
            <SplitReveal as="h2" id="personas-title" variant="lines" className="mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1.02] text-navy">
              Compromisos con quienes <span className="title-accent text-blue">construyen.</span>
            </SplitReveal>
          </div>
          <p className="text-[17px] leading-relaxed text-muted lg:col-span-5">
            Políticas y sistemas de gestión que IVC ha publicado y que orientan la forma de trabajar con su equipo.
          </p>
        </div>

        <ul data-pp-row className="mt-16 flex flex-col gap-4 lg:h-[68svh] lg:min-h-[520px] lg:flex-row">
          {panels.map((p, i) => {
            const on = active === i;
            const LinkTag = p.internal ? TransitionLink : "a";
            return (
              <li
                key={p.title}
                data-pp-panel
                onPointerEnter={() => setActive(i)}
                onFocusCapture={() => setActive(i)}
                className={`group relative min-h-[360px] overflow-hidden rounded-[26px] bg-navy text-white transition-[flex-grow] duration-[900ms] ease-out-expo lg:min-h-0 ${
                  on ? "lg:grow-[3.2]" : "lg:grow"
                } lg:basis-0`}
              >
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-cover transition-[transform,opacity] duration-[1200ms] ease-out-expo ${on ? "scale-100 opacity-100" : "scale-110 lg:opacity-40"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/10" />
                <span aria-hidden="true" className="title-accent absolute left-6 top-5 text-4xl text-white/40">0{i + 1}</span>

                {/* Título vertical (panel plegado, escritorio) */}
                <p
                  aria-hidden="true"
                  className={`absolute bottom-8 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-lg font-semibold [writing-mode:vertical-rl] transition-opacity duration-500 lg:block ${
                    on ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {p.title}
                </p>

                <div
                  className={`absolute inset-x-0 bottom-0 p-7 transition-all duration-700 ease-out-expo md:p-9 ${
                    on ? "lg:translate-y-0 lg:opacity-100" : "lg:pointer-events-none lg:translate-y-8 lg:opacity-0"
                  }`}
                >
                  <h3 className="max-w-[18ch] text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold leading-[1.08]">{p.title}</h3>
                  <p className="mt-3 max-w-[34ch] text-white/75">{p.text}</p>
                  <LinkTag
                    href={p.href}
                    {...(p.internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-navy transition-colors hover:bg-sky"
                  >
                    {p.cta} <IconArrowUpRight size={15} />
                  </LinkTag>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
