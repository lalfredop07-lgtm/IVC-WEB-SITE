"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { Button } from "@/components/ui/Button";
import { IconArrowUpRight, IconAward, IconHelmet, IconLeaf, IconScale } from "@/components/ui/Icons";

// Áreas de gestión que IVC declara en su web. Las normas se citan como referencia
// publicada, sin sellos ni afirmación de vigencia (pendiente de verificación).
const commitments = [
  { Icon: IconAward, title: "Calidad", text: "Gestión de la calidad en cada etapa de la obra, orientada a la satisfacción del cliente.", norm: "ISO 9001" },
  { Icon: IconHelmet, title: "Seguridad y salud en el trabajo", text: "La seguridad y la salud ocupacional de las personas, como condición de cada proyecto.", norm: "ISO 45001" },
  { Icon: IconLeaf, title: "Medioambiente", text: "Respeto ambiental y gestión responsable del entorno donde trabajamos.", norm: "ISO 14001" },
  { Icon: IconScale, title: "Integridad", text: "Código de ética, prevención de delitos y gestión antisoborno en nuestra relación con clientes y proveedores.", norm: "ISO 37001" },
];

/**
 * Compromiso y valores. Columna de texto fija + tarjetas con iconos circulares
 * (segunda fila de la referencia 01) desplazándose a velocidades distintas.
 * Cierra con una marquesina de valores que reacciona a la velocidad del scroll.
 */
export function Commitment() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-commit]").forEach((card, i) => {
          gsap.from(card, {
            y: 120,
            rotate: i % 2 ? 4 : -4,
            opacity: 0,
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 95%", once: true },
          });
          gsap.from(card.querySelector("[data-commit-icon]"), {
            scale: 0,
            rotate: -90,
            duration: 1.2,
            ease: "back.out(1.8)",
            delay: 0.25,
            scrollTrigger: { trigger: card, start: "top 95%", once: true },
          });
          gsap.from(card.querySelectorAll("[data-draw]"), {
            strokeDasharray: 1,
            strokeDashoffset: 1,
            duration: 1.5,
            ease: "power2.inOut",
            delay: 0.5,
            scrollTrigger: { trigger: card, start: "top 95%", once: true },
          });
        });
        gsap.from("[data-iso]", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-iso-row]", start: "top 92%", once: true },
        });
      });
      // Columnas a distinta velocidad (solo escritorio).
      mm.add(MQ.desktop, () => {
        gsap.fromTo(
          "[data-commit-col='b']",
          { y: 120 },
          { y: -40, ease: "none", scrollTrigger: { trigger: "[data-commit-grid]", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const colA = commitments.filter((_, i) => i % 2 === 0);
  const colB = commitments.filter((_, i) => i % 2 === 1);

  return (
    <section ref={root} id="compromiso" aria-labelledby="compromiso-title" className="relative overflow-hidden bg-paper pt-28 md:pt-40">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> 04 — Compromiso
            </p>
            <SplitReveal as="h2" id="compromiso-title" variant="words" className="mt-6 text-[clamp(2.4rem,4.6vw,4.2rem)] font-semibold leading-[1] text-navy">
              La obra importa. <span className="title-accent text-blue">Las personas también.</span>
            </SplitReveal>
            <SplitReveal as="p" variant="lines" delay={0.1} className="mt-8 max-w-[30rem] text-[17px] leading-relaxed text-muted">
              Nuestra misión es ejecutar proyectos de ingeniería con gestión de calidad, seguridad y salud ocupacional, respeto ambiental y mejora
              continua. Un compromiso que se extiende a nuestros trabajadores y a las comunidades donde construimos.
            </SplitReveal>

            <div data-iso-row className="mt-10">
              <p className="kicker text-navy/65">Sistemas de gestión publicados por IVC</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {site.isoStandards.map((iso) => (
                  <li key={iso} data-iso className="rounded-full bg-white px-4 py-2 font-display text-[13px] font-semibold text-navy ring-1 ring-navy/10">
                    {iso}
                  </li>
                ))}
              </ul>
              <a
                href={site.officialLinks.certifications}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-blue"
              >
                Ver certificaciones en el sitio actual de IVC
                <IconArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <div className="mt-8">
                <Button href="/compromiso" variant="navy">
                  Conocer nuestro compromiso
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div data-commit-grid className="grid gap-x-5 sm:grid-cols-2 lg:col-span-7 lg:pb-32">
          <ul data-commit-col="a" className="flex flex-col gap-5">
            {colA.map((c) => (
              <CommitmentCard key={c.title} c={c} />
            ))}
          </ul>
          <ul data-commit-col="b" className="flex flex-col gap-5 sm:pt-24">
            {colB.map((c) => (
              <CommitmentCard key={c.title} c={c} />
            ))}
          </ul>
        </div>
      </div>

      {/* Valores */}
      <div className="relative mt-28 border-t border-navy/10 pb-20 pt-14 md:mt-40 md:pb-28">
        <div className="container-x mb-8 flex items-end justify-between gap-6">
          <p className="kicker text-navy/65">Nuestros valores</p>
          <p className="hidden text-sm text-muted md:block">Integridad · Solidaridad · Calidad · Trabajo en equipo · Liderazgo</p>
        </div>
        <VelocityMarquee
          items={site.values}
          speed={36}
          itemClassName="font-display text-[clamp(3.4rem,10vw,9rem)] font-semibold leading-none tracking-[-0.05em] text-navy transition-colors duration-500 [&:nth-child(1)]:text-navy"
          separator={<span aria-hidden="true" className="mx-[3vw] inline-block size-[clamp(14px,1.6vw,22px)] rotate-45 rounded-[4px] bg-blue/80" />}
        />
        <VelocityMarquee
          items={site.values}
          speed={44}
          reverse
          className="mt-2 hidden md:block"
          itemClassName="title-accent text-outline text-outline-navy text-[clamp(3.4rem,9vw,8rem)] leading-none"
          separator={<span aria-hidden="true" className="mx-[3vw] inline-block size-2 rounded-full bg-navy/20" />}
        />
      </div>
    </section>
  );
}

function CommitmentCard({ c }: { c: (typeof commitments)[number] }) {
  return (
    <li data-commit className="group relative mt-10 rounded-[24px] bg-white px-7 pb-8 pt-14 text-center shadow-[0_30px_70px_-35px_rgb(0_27_49/0.35)] ring-1 ring-navy/5 transition-shadow duration-500 hover:shadow-[0_40px_90px_-35px_rgb(0_27_49/0.5)] md:px-9">
      <span
        data-commit-icon
        className="absolute left-1/2 top-0 grid size-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-navy ring-[6px] ring-white transition-colors duration-500 group-hover:bg-navy group-hover:text-white"
      >
        <c.Icon size={30} className="transition-transform duration-700 ease-out-expo group-hover:scale-110" />
      </span>
      <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-navy">{c.title}</h3>
      <p className="mx-auto mt-3 max-w-[26ch] text-[15px] leading-relaxed text-muted">{c.text}</p>
      <p className="kicker mt-6 inline-block rounded-full bg-paper px-3 py-1.5 text-[10px] text-blue">Norma de referencia · {c.norm}</p>
    </li>
  );
}
