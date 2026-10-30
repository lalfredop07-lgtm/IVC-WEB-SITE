"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Button } from "@/components/ui/Button";

/**
 * Banda partida azul / fotografía (inspirada en la referencia 01).
 * Escritorio: la fotografía entra ocupando todo el ancho y, con el scroll,
 * se retira a su mitad derecha descubriendo el panel azul (cambio de composición).
 */
export function SplitBand({ secondary = { href: "/proyectos", label: "Ver proyectos" } }: { secondary?: { href: string; label: string } }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 10%", scrub: 0.8 },
        });
        tl.fromTo("[data-band-photo]", { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 50%)" }, 0)
          .fromTo("[data-band-img]", { scale: 1.3, xPercent: -12 }, { scale: 1.05, xPercent: 0 }, 0)
          .fromTo("[data-band-panel]", { xPercent: -20, opacity: 0.4 }, { xPercent: 0, opacity: 1 }, 0)
          .fromTo("[data-band-caption]", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.6);
      });
      mm.add(MQ.mobile, () => {
        gsap.fromTo(
          "[data-band-photo]",
          { clipPath: "inset(12% 12% 12% 12% round 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: "[data-band-photo]", start: "top 95%", end: "top 35%", scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="band-title" className="relative overflow-hidden bg-navy text-white lg:min-h-[86svh]">
      <div className="flex flex-col-reverse lg:block">
        {/* Panel azul */}
        <div data-band-panel className="relative z-10 flex items-center px-[var(--gutter)] py-20 lg:min-h-[86svh] lg:w-1/2 lg:py-24 lg:pr-16">
          <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-70" />
          <div className="relative max-w-[34rem] lg:ml-auto lg:mr-6">
            <p className="kicker flex items-center gap-3 text-sky">
              <span className="h-px w-8 bg-sky" /> Conversemos
            </p>
            <SplitReveal as="h2" id="band-title" variant="words" className="mt-6 text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.02]">
              ¿Tiene un proyecto de infraestructura en mente?
            </SplitReveal>
            <SplitReveal as="p" variant="lines" delay={0.15} className="mt-7 max-w-[28rem] text-[17px] leading-relaxed text-white/75">
              Conversemos sobre los requerimientos de su próxima obra pública o privada. Escríbanos a través de nuestros canales corporativos.
            </SplitReveal>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/contacto">Contactar a IVC</Button>
              <Button href={secondary.href} variant="outline-light">
                {secondary.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Fotografía */}
        <div data-band-photo className="relative aspect-[4/3] overflow-hidden lg:absolute lg:inset-0 lg:z-20 lg:aspect-auto">
          <div data-band-img className="absolute inset-0 will-change-transform">
            <Image
              src="/projects/enhanced/10-agua-potable-paita.webp"
              alt="Infraestructura de agua potable en Paita, Piura"
              fill
              sizes="(min-width: 1024px) 100vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
          <p data-band-caption className="kicker absolute bottom-6 right-[var(--gutter)] text-[10px] text-white/80">
            Agua potable · Paita, Piura
          </p>
        </div>
      </div>
    </section>
  );
}
