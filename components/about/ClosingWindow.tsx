"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";

type Props = {
  image: string;
  alt: string;
  left: string;
  right: string;
  title: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
};

/**
 * Cierre cinematográfico: la sección se fija, una ventana pequeña con una fotografía
 * crece hasta llenar la pantalla mientras las dos palabras del lema se separan;
 * al final aparece la llamada a la acción.
 */
export function ClosingWindow({ image, alt, left, right, title, primary, secondary }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", scrub: 0.8, pin: true, anticipatePin: 1 },
        });
        tl.fromTo("[data-cw-window]", { clipPath: "inset(35% 38% 35% 38% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 }, 0)
          .fromTo("[data-cw-img]", { scale: 1.5 }, { scale: 1, duration: 1 }, 0)
          .to("[data-cw-left]", { xPercent: -70, opacity: 0, duration: 0.8 }, 0)
          .to("[data-cw-right]", { xPercent: 70, opacity: 0, duration: 0.8 }, 0)
          .fromTo("[data-cw-veil]", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.6)
          .fromTo("[data-cw-cta]", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, 0.75);
      });
      mm.add(MQ.reduce, () => {
        gsap.set("[data-cw-cta], [data-cw-veil]", { opacity: 1 });
        gsap.set("[data-cw-left], [data-cw-right]", { opacity: 0 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="cierre-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-white">
      <div data-cw-window className="absolute inset-0 overflow-hidden bg-navy-950">
        <div data-cw-img className="absolute inset-0 will-change-transform">
          <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
        </div>
        <div data-cw-veil className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_18_31/0.55),rgb(0_18_31/0.85))] opacity-0" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[36svh] px-[var(--gutter)] md:flex-row md:gap-[30vw]">
        <span data-cw-left className="font-display text-[clamp(2.2rem,5.4vw,5.6rem)] font-semibold tracking-[-0.05em] text-navy">
          {left}
        </span>
        <span data-cw-right className="title-accent text-[clamp(2.4rem,6vw,6.2rem)] text-blue">
          {right}
        </span>
      </div>

      <div data-cw-cta className="absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] text-center text-white opacity-0">
        <h2 id="cierre-title" className="max-w-[18ch] text-[clamp(2.2rem,5.4vw,5rem)] font-semibold leading-[1.02]">
          {title}
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={primary.href}>{primary.label}</Button>
          <Button href={secondary.href} variant="outline-light">
            {secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
