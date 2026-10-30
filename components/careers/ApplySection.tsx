"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ApplicationForm } from "./ApplicationForm";

/**
 * Postulación: banda azul con fotografía fija en profundidad (referencia 01)
 * y el formulario en una tarjeta blanca que sube en 3D.
 */
export function ApplySection({ position, kicker = "Postulación" }: { position?: string; kicker?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-ap-card]", {
          y: 140,
          rotateX: -14,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-ap-card]", start: "top 92%", once: true },
        });
        gsap.fromTo(
          "[data-ap-photo]",
          { clipPath: "inset(0% 0% 100% 0% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: "[data-ap-photo]", start: "top 85%", once: true } },
        );
        gsap.fromTo("[data-ap-img]", { yPercent: -10, scale: 1.25 }, { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="postular" aria-labelledby="postular-title" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-28 text-white md:py-36">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="kicker flex items-center gap-3 text-sky">
              <span className="h-px w-8 bg-sky" /> {kicker}
            </p>
            <SplitReveal as="h2" id="postular-title" variant="words" className="mt-6 text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.02]">
              Envíe su <span className="title-accent text-sky">candidatura.</span>
            </SplitReveal>
            <p className="mt-6 max-w-[26rem] text-[17px] leading-relaxed text-white/70">
              Postule a una vacante publicada o deje una candidatura espontánea para futuros procesos de selección.
            </p>
            <div data-ap-photo className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[28px] lg:block">
              <div data-ap-img className="absolute inset-0 will-change-transform">
                <Image src="/projects/enhanced/14-galerias-filtrantes-chincha.webp" alt="Maquinaria trabajando en la obra de galerías filtrantes de Chincha" fill sizes="30vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="[perspective:1600px] lg:col-span-8">
          <div data-ap-card className="rounded-[28px] bg-white p-7 text-navy shadow-[0_50px_120px_-40px_rgb(0_0_0/0.6)] sm:p-10 md:p-14">
            <h3 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-navy">Formulario de postulación</h3>
            <p className="mt-4 text-[15px] text-muted">
              Los campos marcados con <span className="text-blue">*</span> son obligatorios.
            </p>
            <div className="mt-8">
              <ApplicationForm position={position} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
