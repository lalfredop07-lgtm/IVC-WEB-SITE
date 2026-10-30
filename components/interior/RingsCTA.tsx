"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Button } from "@/components/ui/Button";

type Link = { href: string; label: string; external?: boolean };
type Props = { kicker: string; title: string; accent: string; text?: string; primary: Link; secondary?: Link; tone?: "dark" | "light" };

/**
 * Llamada final con anillos técnicos concéntricos que se trazan con el scroll,
 * giran en sentidos opuestos y responden al puntero.
 */
export function RingsCTA({ kicker, title, accent, text, primary, secondary, tone = "dark" }: Props) {
  const root = useRef<HTMLElement>(null);
  const dark = tone === "dark";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-rc-ring]",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, stagger: 0.12, ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.6 } },
        );
        gsap.utils.toArray<SVGGElement>("[data-rc-spin]").forEach((g, i) => {
          gsap.to(g, { rotate: i % 2 ? -360 : 360, svgOrigin: "400 400", duration: 60 + i * 20, ease: "none", repeat: -1 });
        });
        gsap.fromTo("[data-rc-rings]", { scale: 0.8 }, { scale: 1.1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      mm.add(MQ.finePointer, () => {
        const xTo = gsap.quickTo("[data-rc-rings]", "x", { duration: 1.4, ease: "power3" });
        const yTo = gsap.quickTo("[data-rc-rings]", "y", { duration: 1.4, ease: "power3" });
        const el = root.current!;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * 60);
          yTo(((e.clientY - r.top) / r.height - 0.5) * 40);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const stroke = dark ? "rgb(167 207 230 / 0.28)" : "rgb(0 40 74 / 0.18)";

  return (
    <section ref={root} aria-labelledby="rings-title" className={`relative overflow-hidden ${dark ? "bg-navy-950 text-white" : "bg-paper text-navy"}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <svg data-rc-rings viewBox="0 0 800 800" className="w-[max(900px,120vw)] max-w-none will-change-transform md:w-[min(1200px,110vw)]">
          {[380, 300, 220, 140].map((r, i) => (
            <g key={r} data-rc-spin>
              <circle data-rc-ring cx="400" cy="400" r={r} fill="none" stroke={stroke} strokeWidth="1" pathLength={1} strokeDasharray="1" />
              {i % 2 === 0 && (
                <circle cx="400" cy="400" r={r - 14} fill="none" stroke={stroke} strokeWidth="6" strokeDasharray="1 18" />
              )}
              <circle cx={400 + r} cy="400" r="5" fill={dark ? "#a7cfe6" : "#07528a"} />
            </g>
          ))}
        </svg>
      </div>
      <div className="container-x relative flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
        <p className={`kicker ${dark ? "text-sky" : "text-blue"}`}>{kicker}</p>
        <SplitReveal as="h2" id="rings-title" variant="chars" stagger={0.015} className="mt-6 max-w-[16ch] text-[clamp(2.4rem,5.6vw,5.2rem)] font-semibold leading-[1]">
          {title}
        </SplitReveal>
        <SplitReveal as="p" variant="lines" delay={0.25} className={`title-accent text-[clamp(2.4rem,5.6vw,5.2rem)] leading-[1] ${dark ? "text-sky" : "text-blue"}`}>
          {accent}
        </SplitReveal>
        {text && <p className={`mt-8 max-w-[34rem] text-[17px] leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>{text}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={primary.href} external={primary.external} variant={dark ? "light" : "navy"}>
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} external={secondary.external} variant={dark ? "outline-light" : "outline-navy"}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
