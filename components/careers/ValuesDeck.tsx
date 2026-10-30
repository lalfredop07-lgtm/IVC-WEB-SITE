"use client";

import { useRef } from "react";
import { valuesDetail } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Valores como una baraja: la sección se fija y las cinco cartas, apiladas en el
 * centro, se despliegan en abanico hasta formar una fila. En móvil y tableta, lista
 * ordenada (número + valor + descripción) dentro de un único panel.
 * Descripciones oficiales de ivccontratistas.pe/valores.
 */
export function ValuesDeck() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-vd-card]");
        const n = cards.length;
        const spread = () => cards[0].offsetWidth + 14;
        cards.forEach((c, i) => gsap.set(c, { x: 0, y: i * -6, rotate: (i - (n - 1) / 2) * 5, zIndex: n - i }));
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        });
        cards.forEach((c, i) => {
          tl.to(c, { x: () => (i - (n - 1) / 2) * spread(), y: () => Math.abs(i - (n - 1) / 2) * 24, rotate: (i - (n - 1) / 2) * 6, duration: 1 }, 0).to(
            c,
            { y: 0, rotate: 0, duration: 0.6 },
            1,
          );
        });
        tl.from("[data-vd-title]", { yPercent: 40, opacity: 0, duration: 0.6 }, 0).to("[data-vd-hint]", { opacity: 0, duration: 0.3 }, 0.2);
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-vd-card]");
        const spread = cards[0].offsetWidth + 14;
        cards.forEach((c, i) => gsap.set(c, { x: (i - (cards.length - 1) / 2) * spread }));
      });
      mm.add(MQ.mobile, () => {
        // Entrada uniforme: cada fila sube y aparece al llegar, con su número ligeramente adelantado.
        gsap.utils.toArray<HTMLElement>("[data-vd-card]").forEach((c) => {
          const st = { trigger: c, start: "top 92%", once: true };
          gsap.from(c, { y: 32, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: st });
          gsap.from(c.querySelector("[data-vd-num]"), { yPercent: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: st });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="valores-title" className="relative overflow-hidden bg-navy-950 text-white lg:h-[100svh]">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
      <div className="container-x relative flex h-full flex-col justify-center py-28 lg:py-0">
        <div data-vd-title className="lg:text-center">
          <p className="kicker text-sky">04 — Nuestros valores</p>
          <h2 id="valores-title" className="mt-5 max-w-[20ch] lg:mx-auto text-[clamp(2.2rem,4.4vw,4rem)] font-semibold leading-[1.02]">
            Cinco valores que <span className="title-accent text-sky">compartimos.</span>
          </h2>
        </div>

        <ul className="relative mt-12 rounded-[24px] bg-white/[0.04] px-6 ring-1 ring-inset ring-white/10 sm:px-8 lg:mt-16 lg:block lg:h-[400px] lg:rounded-none lg:bg-transparent lg:px-0 lg:ring-0">
          {valuesDetail.map((v, i) => (
            <li
              key={v.name}
              data-vd-card
              className={`group flex items-start gap-5 border-t border-white/10 py-6 text-white first:border-t-0 sm:gap-8 sm:py-7 lg:absolute lg:left-1/2 lg:top-0 lg:h-[380px] lg:w-[clamp(186px,16.5vw,250px)] lg:-translate-x-1/2 lg:flex-col lg:justify-between lg:gap-0 lg:rounded-[24px] lg:border-t-0 lg:p-6 lg:shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] lg:transition-colors lg:duration-500 ${
                i % 2 ? "lg:bg-blue lg:text-white" : "lg:bg-white lg:text-navy"
              } lg:hover:bg-sky lg:hover:text-navy`}
            >
              <span className="block shrink-0 overflow-hidden">
                <span
                  data-vd-num
                  aria-hidden="true"
                  className={`title-accent block w-12 text-[2.6rem] leading-none text-sky sm:w-16 sm:text-5xl lg:w-auto lg:text-6xl ${i % 2 ? "lg:text-white/40" : "lg:text-blue/30"} lg:group-hover:text-navy/40`}
                >
                  0{i + 1}
                </span>
              </span>
              <div className="pt-1 lg:mt-10 lg:pt-0">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{v.name}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed text-white/70 lg:mt-3 lg:text-[13px] ${i % 2 ? "lg:text-white/75" : "lg:text-muted"} lg:group-hover:text-navy/75`}>{v.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p data-vd-hint aria-hidden="true" className="kicker mt-10 hidden text-center text-[10px] text-white/40 lg:block">
          Desliza para desplegar
        </p>
      </div>
    </section>
  );
}
