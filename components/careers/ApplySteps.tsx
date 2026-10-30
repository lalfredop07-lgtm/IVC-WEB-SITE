"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const steps = [
  { n: "01", title: "Elija una vacante", text: "O envíe una candidatura espontánea si no hay ofertas abiertas." },
  { n: "02", title: "Complete sus datos", text: "Nombre, contacto, especialidad y puesto de interés." },
  { n: "03", title: "Adjunte su CV", text: "En formato PDF, de 4 MB como máximo." },
];

/** Cómo postular: una línea técnica se traza con el scroll y enciende cada paso al pasar. */
export function ApplySteps() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 } });
        tl.fromTo("[data-as-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 3 }, 0);
        gsap.utils.toArray<HTMLElement>("[data-as-step]").forEach((s, i) => {
          tl.fromTo(s.querySelector("[data-as-dot]"), { scale: 0.4, backgroundColor: "#dde5eb" }, { scale: 1, backgroundColor: "#07528a", duration: 0.3 }, i * 1.1)
            // Máscara de abajo arriba en lugar de atenuar: el texto visible conserva su contraste.
            .fromTo(
              s.querySelector("[data-as-text]"),
              { y: 30, clipPath: "inset(0% 0% 100% 0%)" },
              { y: 0, clipPath: "inset(0% 0% -10% 0%)", duration: 0.6 },
              i * 1.1,
            );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="pasos-title" className="bg-white py-24 md:py-32">
      <div className="container-x">
        <p className="kicker flex items-center gap-3 text-blue">
          <span className="h-px w-8 bg-blue" /> 05 — Cómo postular
        </p>
        <h2 id="pasos-title" className="mt-6 text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-[1.05] text-navy">
          Tres pasos, <span className="title-accent text-blue">sin complicaciones.</span>
        </h2>
        <div className="relative mt-16">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden h-px bg-line md:block">
            <span data-as-line className="absolute inset-0 origin-left bg-blue" />
          </span>
          <ol className="grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} data-as-step className="relative">
                <span data-as-dot className="relative z-10 block size-6 rounded-full bg-blue ring-8 ring-white" />
                <div data-as-text className="mt-8">
                  <span aria-hidden="true" className="title-accent text-5xl text-blue/65">{s.n}</span>
                  <h3 className="mt-3 text-xl font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2 max-w-[28ch] text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
