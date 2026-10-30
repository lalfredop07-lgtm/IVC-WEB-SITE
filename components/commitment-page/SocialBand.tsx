"use client";

import Image from "next/image";
import { useRef } from "react";
import { site, socialResponsibility } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Button } from "@/components/ui/Button";

/**
 * Responsabilidad social: banda partida foto / azul (referencia 01) en orientación inversa.
 * La fotografía se abre en diagonal y su contenido responde al puntero.
 */
export function SocialBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-sb-photo]",
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 20%", scrub: 0.6 },
          },
        );
        gsap.fromTo("[data-sb-img]", { scale: 1.35 }, { scale: 1.08, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from("[data-sb-panel]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true } });
      });
      mm.add(MQ.finePointer, () => {
        const xTo = gsap.quickTo("[data-sb-img]", "x", { duration: 1.2, ease: "power3" });
        const yTo = gsap.quickTo("[data-sb-img]", "y", { duration: 1.2, ease: "power3" });
        const el = root.current!.querySelector<HTMLElement>("[data-sb-photo]")!;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * -30);
          yTo(((e.clientY - r.top) / r.height - 0.5) * -20);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="rse-title" className="relative grid overflow-hidden bg-navy text-white lg:min-h-[86svh] lg:grid-cols-2">
      <div data-sb-photo className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
        <div data-sb-img className="absolute inset-0 will-change-transform">
          <Image src="/projects/enhanced/11-casuarinas-ica.webp" alt="Calles y viviendas de Las Casuarinas, Ica" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <p className="kicker absolute bottom-6 left-[var(--gutter)] text-[10px] text-white/80">Las Casuarinas · Ica</p>
      </div>
      <div data-sb-panel className="relative flex items-center px-[var(--gutter)] py-20 lg:py-24 lg:pl-16">
        <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-70" />
        <div className="relative max-w-[34rem]">
          <p className="kicker flex items-center gap-3 text-sky">
            <span className="h-px w-8 bg-sky" /> 03 — Responsabilidad social
          </p>
          <SplitReveal as="h2" id="rse-title" variant="words" className="mt-6 text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.02]">
            Obras que mejoran la <span className="title-accent text-sky">calidad de vida.</span>
          </SplitReveal>
          <SplitReveal as="p" variant="lines" delay={0.15} className="mt-7 text-[17px] leading-relaxed text-white/75">
            {socialResponsibility}
          </SplitReveal>
          <p className="title-accent mt-8 text-3xl text-sky">{site.slogan}</p>
          <div className="mt-10">
            <Button href={site.officialLinks.social} external variant="outline-light">
              Ver en el sitio de IVC
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
