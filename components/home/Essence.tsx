"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { RevealImage } from "@/components/motion/RevealImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { YearsCounter } from "@/components/motion/YearsCounter";
import { Button } from "@/components/ui/Button";
import { IconAward, IconCycle, IconHelmet, IconLeaf } from "@/components/ui/Icons";

// Pilares tomados de la misión publicada por IVC.
const pillars = [
  { Icon: IconAward, title: "Calidad", text: "Gestión de la calidad en cada etapa del proyecto." },
  { Icon: IconHelmet, title: "Seguridad y salud", text: "Seguridad y salud ocupacional como prioridad en obra." },
  { Icon: IconLeaf, title: "Respeto ambiental", text: "Cuidado del entorno durante la ejecución de los trabajos." },
  { Icon: IconCycle, title: "Mejora continua", text: "Aprendizaje constante orientado a la satisfacción del cliente." },
];

/**
 * «Nosotros» + «Nuestra filosofía» en dos columnas (inspirado en About/Expertise de la referencia 02).
 * Composición fotográfica en capas con parallax a distintas velocidades.
 */
export function Essence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Capas fotográficas a distinta velocidad → profundidad.
        gsap.to("[data-depth='slow']", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          "[data-depth='fast']",
          { yPercent: 30 },
          { yPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        // Sello de trayectoria: aparece girando desde atrás.
        gsap.from("[data-badge]", {
          scale: 0.6,
          rotate: -12,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-badge]", start: "top 92%", once: true },
        });
        // Pilares: los iconos se dibujan y las filas entran alternando dirección.
        gsap.utils.toArray<HTMLElement>("[data-pillar]").forEach((el, i) => {
          gsap.from(el, {
            x: i % 2 ? 40 : -40,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
          gsap.from(el.querySelectorAll("[data-draw]"), {
            strokeDasharray: 1,
            strokeDashoffset: 1,
            duration: 1.4,
            ease: "power2.inOut",
            delay: 0.2,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
          gsap.from(el.querySelector("[data-rule]"), {
            scaleX: 0,
            duration: 1.2,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="nosotros" aria-labelledby="nosotros-title" className="relative overflow-hidden bg-white pb-28 pt-28 md:pb-40 md:pt-40">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Composición fotográfica */}
        <div className="relative lg:col-span-6 lg:pr-10">
          <div data-depth="slow">
            <RevealImage
              src="/projects/enhanced/06-universidad-san-luis-gonzaga.webp"
              alt="Vista aérea de las facultades de la Universidad Nacional San Luis Gonzaga, Ica"
              sizes="(min-width: 1024px) 45vw, 100vw"
              reveal="up"
              parallax={16}
              className="aspect-[4/5] w-[86%] rounded-[28px]"
            />
          </div>
          <div data-depth="fast" className="absolute right-0 top-[18%] w-[42%] md:right-2 lg:right-0">
            <RevealImage
              src="/projects/enhanced/15-agua-sjl-lima.webp"
              alt="Instalación de tubería en San Juan de Lurigancho, Lima"
              sizes="(min-width: 1024px) 20vw, 42vw"
              reveal="left"
              parallax={20}
              className="aspect-[3/4] rounded-[22px] shadow-[0_40px_80px_-30px_rgb(0_27_49/0.5)] ring-8 ring-white"
            />
          </div>
          <div
            data-badge
            className="absolute -bottom-8 right-[6%] flex items-end gap-4 rounded-[24px] bg-navy px-7 py-6 text-white shadow-[0_30px_70px_-25px_rgb(0_27_49/0.7)] md:bottom-10 md:right-[2%]"
          >
            <YearsCounter className="font-display text-[clamp(3.5rem,6vw,5.5rem)] font-semibold leading-[0.8] tracking-[-0.06em]" />
            <div className="pb-1">
              <p className="kicker text-sky">años</p>
              <p className="mt-1 text-sm leading-tight text-white/75">
                de trayectoria
                <br />
                desde febrero de 1988
              </p>
            </div>
          </div>
        </div>

        {/* Texto institucional */}
        <div className="lg:col-span-6 lg:pl-6 lg:pt-10">
          <p className="kicker flex items-center gap-3 text-blue">
            <span className="h-px w-8 bg-blue" /> 01 — Nosotros
          </p>
          <SplitReveal
            as="h2"
            id="nosotros-title"
            variant="lines"
            className="mt-6 text-[clamp(2.1rem,4.4vw,3.9rem)] font-semibold leading-[1.02] text-navy"
          >
            Más de tres décadas construyendo infraestructura para el <span className="title-accent text-blue">Perú.</span>
          </SplitReveal>
          <SplitReveal as="p" variant="blur" stagger={0.012} className="mt-8 max-w-[36rem] text-[17px] leading-relaxed text-muted">
            IVC Contratistas Generales S.A. es una empresa constructora peruana que inició sus actividades en febrero de 1988. Desarrollamos y
            ejecutamos proyectos de ingeniería para el sector público y privado en cinco líneas de negocio, bajo un mismo propósito:
            ¡Construimos Bienestar!
          </SplitReveal>

          <div className="mt-14">
            <p className="kicker text-navy/65">Nuestra filosofía</p>
            <ul className="mt-6 grid gap-x-10 gap-y-2 sm:grid-cols-2">
              {pillars.map(({ Icon, title, text }) => (
                <li key={title} data-pillar className="group relative py-5">
                  <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
                  <div className="flex gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-blue ring-1 ring-navy/10 transition-all duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-navy group-hover:text-white">
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-navy">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/nosotros" variant="navy">
              Nuestra historia
            </Button>
            <Button href="/#especialidades" variant="outline-navy">
              Nuestras especialidades
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
