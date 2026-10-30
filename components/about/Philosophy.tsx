"use client";

import Image from "next/image";
import { useRef } from "react";
import { site, valuesDetail } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";

/**
 * Filosofía corporativa como tarjetas apiladas: cada tarjeta queda fija y, cuando
 * la siguiente la cubre, retrocede en profundidad (escala + oscurecimiento + giro 3D sutil).
 * Textos de misión, visión y valores tomados del sitio oficial de IVC.
 */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-ph-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector("[data-ph-inner]"), {
            scale: 0.9,
            rotateX: 6,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 75%", end: "top 14%", scrub: true },
          });
        });
        gsap.from("[data-ph-value]", {
          y: 50,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-ph-values]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="filosofia-title" className="relative bg-paper pb-28 pt-28 md:pb-40 md:pt-36">
      <div className="container-x">
        <div className="max-w-[880px]">
          <p className="kicker flex items-center gap-3 text-blue">
            <span className="h-px w-8 bg-blue" /> 03 — Filosofía corporativa
          </p>
          <SplitReveal as="h2" id="filosofia-title" variant="chars" stagger={0.015} className="mt-6 text-[clamp(2.3rem,5vw,4.6rem)] font-semibold leading-[1] text-navy">
            Lo que nos mueve
          </SplitReveal>
          <SplitReveal as="p" variant="lines" delay={0.2} className="title-accent text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1] text-blue">
            cada día en obra.
          </SplitReveal>
        </div>

        <div className="mt-16 flex flex-col gap-8 [perspective:1600px] md:mt-24 gap-y-[18svh] lg:gap-[28svh]">
          {/* Misión */}
          <article data-ph-card className="sticky top-[calc(var(--header-h)+8px)]">
            <div data-ph-inner className="grid origin-top overflow-hidden rounded-[30px] bg-navy text-white shadow-[0_40px_100px_-40px_rgb(0_27_49/0.7)] will-change-transform md:grid-cols-2">
              <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
                <p className="kicker text-sky">01 · Misión</p>
                <p className="text-[clamp(1.4rem,2.4vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.02em]">{site.mission}</p>
                <p className="text-sm text-white/60">Fuente: ivccontratistas.pe/nosotros</p>
              </div>
              <div className="relative min-h-[260px]">
                <Image src="/projects/enhanced/02-saneamiento-nana-lima.webp" alt="Planta de saneamiento del esquema Ñaña, Lima" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
          </article>

          {/* Visión */}
          <article data-ph-card className="sticky top-[calc(var(--header-h)+28px)]">
            <div data-ph-inner className="grid origin-top overflow-hidden rounded-[30px] bg-blue text-white shadow-[0_40px_100px_-40px_rgb(0_27_49/0.7)] will-change-transform md:grid-cols-2">
              <div className="relative order-last min-h-[260px] md:order-first">
                <Image src="/projects/enhanced/18-edificio-discamec.webp" alt="Fachada del edificio DISCAMEC" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
                <p className="kicker text-sky">02 · Visión</p>
                <p className="title-accent text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1.02]">«{site.vision}»</p>
                <p className="text-sm text-white/80">Fuente: ivccontratistas.pe/nosotros</p>
              </div>
            </div>
          </article>

          {/* Valores */}
          <article data-ph-card className="sticky top-[calc(var(--header-h)+48px)]">
            <div data-ph-inner className="origin-top overflow-hidden rounded-[30px] bg-white p-8 shadow-[0_40px_100px_-40px_rgb(0_27_49/0.45)] ring-1 ring-navy/5 will-change-transform md:p-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <p className="kicker text-blue">03 · Valores</p>
                <p className="text-sm text-muted">Fuente: ivccontratistas.pe/valores</p>
              </div>
              <ul data-ph-values className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
                {valuesDetail.map((v, i) => (
                  <li key={v.name} data-ph-value className="group">
                    <span aria-hidden="true" className="title-accent block text-5xl leading-none text-blue/30 transition-colors duration-500 group-hover:text-blue">
                      0{i + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-navy">{v.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
