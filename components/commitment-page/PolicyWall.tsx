"use client";

import { useRef } from "react";
import { policies } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Button } from "@/components/ui/Button";
import { IconArrowUpRight } from "@/components/ui/Icons";

/**
 * Políticas corporativas publicadas por IVC. Las tarjetas giran en 3D desde el centro
 * hacia fuera y se inclinan con el puntero. Cada una abre el documento oficial.
 */
export function PolicyWall() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-pw-card]", {
          rotateY: -95,
          opacity: 0,
          transformOrigin: "0% 50%",
          duration: 1.3,
          ease: "expo.out",
          stagger: { each: 0.07, from: "center", grid: "auto" },
          scrollTrigger: { trigger: "[data-pw-grid]", start: "top 80%", once: true },
        });
      });
      mm.add(MQ.finePointer, () => {
        const offs = gsap.utils.toArray<HTMLElement>("[data-pw-card]").map((card) => {
          const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            rx(((e.clientY - r.top) / r.height - 0.5) * -10);
            ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((o) => o());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="politicas-title" className="relative bg-paper py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> 02 — Políticas corporativas
            </p>
            <SplitReveal as="h2" id="politicas-title" variant="chars" stagger={0.012} className="mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1] text-navy">
              Políticas que guían
            </SplitReveal>
            <SplitReveal as="p" variant="lines" delay={0.2} className="title-accent text-[clamp(2.2rem,4.4vw,4rem)] leading-[1] text-blue">
              nuestro trabajo.
            </SplitReveal>
          </div>
          <p className="max-w-[28rem] text-[15px] leading-relaxed text-muted">
            Documentos publicados por IVC en su sistema documental. Cada tarjeta abre el documento oficial en una pestaña nueva.
          </p>
        </div>

        <ul data-pw-grid className="mt-16 grid gap-4 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-3">
          {policies.map((p, i) => (
            <li key={p.href}>
              <a
                data-pw-card
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full min-h-[190px] flex-col justify-between overflow-hidden rounded-[22px] bg-white p-7 shadow-[0_24px_60px_-34px_rgb(0_27_49/0.4)] ring-1 ring-navy/5 transition-[box-shadow,background-color] duration-500 [transform-style:preserve-3d] hover:bg-navy hover:shadow-[0_40px_80px_-30px_rgb(0_27_49/0.6)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="kicker text-[10px] text-blue transition-colors duration-500 group-hover:text-sky">{p.group}</span>
                  <span aria-hidden="true" className="title-accent text-3xl leading-none text-navy/15 transition-colors duration-500 group-hover:text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <h3 className="text-[1.15rem] font-semibold leading-[1.25] tracking-[-0.02em] text-navy transition-colors duration-500 group-hover:text-white">
                    {p.title}
                  </h3>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-navy/15 transition-all duration-500 group-hover:bg-white group-hover:text-navy group-hover:ring-white">
                    <IconArrowUpRight size={16} className="text-navy transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </div>
                <span className="sr-only">(abre el documento oficial en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Button href="/transparencia" variant="navy">
            Transparencia y denuncias
          </Button>
        </div>
      </div>
    </section>
  );
}
