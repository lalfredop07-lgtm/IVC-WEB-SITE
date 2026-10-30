"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Oficina principal: dirección publicada en gran formato. Un marcador se dibuja,
 * emite ondas y la retícula técnica se desplaza con el scroll (sin mapas ni
 * ubicaciones simuladas).
 */
export function OfficeBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-ob-pin] [data-draw]", { strokeDasharray: 1, strokeDashoffset: 1, duration: 1.4, ease: "power2.inOut" })
          .from("[data-ob-line]", { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "expo.out" }, 0.2)
          .from("[data-ob-meta]", { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.6);
        gsap.utils.toArray<HTMLElement>("[data-ob-wave]").forEach((w, i) => {
          gsap.fromTo(w, { scale: 0.2, opacity: 0.8 }, { scale: 2.6, opacity: 0, duration: 3, ease: "power2.out", repeat: -1, delay: i });
        });
        gsap.to("[data-ob-grid]", {
          backgroundPosition: "0px 192px",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const [street, offices] = site.contact.address.split(", ");

  return (
    <section ref={root} aria-labelledby="oficina-title" className="relative overflow-hidden bg-navy-950 py-28 text-white md:py-40">
      <div data-ob-grid aria-hidden="true" className="blueprint-grid absolute inset-0" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="relative mx-auto grid size-56 place-items-center lg:col-span-4 lg:size-72">
          {[0, 1, 2].map((i) => (
            <span key={i} data-ob-wave aria-hidden="true" className="absolute size-24 rounded-full border border-sky/50" />
          ))}
          <span data-ob-pin className="relative grid size-24 place-items-center rounded-full bg-white text-navy shadow-[0_0_80px_rgb(167_207_230/0.35)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" pathLength={1} data-draw="" />
              <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" pathLength={1} data-draw="" />
            </svg>
          </span>
        </div>
        <div className="lg:col-span-8">
          <p data-ob-meta className="kicker text-sky">
            Oficina principal
          </p>
          <h2 id="oficina-title" className="mt-6 font-display text-[clamp(2.2rem,5.4vw,5rem)] font-semibold leading-[1] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-ob-line className="block">
                {street}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-ob-line className="title-accent block text-sky">
                {offices}
              </span>
            </span>
          </h2>
          <div data-ob-meta className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-white/70">
            <span>{site.contact.district}, Perú</span>
            <span>{site.legalName}</span>
            <span>RUC {site.ruc}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
