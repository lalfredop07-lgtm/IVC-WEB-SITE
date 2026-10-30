"use client";

import { useRef } from "react";
import { formatJobDate as fmtDate, jobSpecialtyLabel, type Job } from "@/data/jobs";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { IconArrowDown, IconArrowLeft, IconPin } from "@/components/ui/Icons";

/**
 * Ficha de una vacante publicada: ficha técnica fija a la izquierda (que se traza
 * fila a fila) y descripción y requisitos que entran con el scroll.
 */
export function JobDetail({ job: j }: { job: Job }) {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-jd-row]", {
          x: -30,
          opacity: 0,
          stagger: 0.07,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-jd-sheet]", start: "top 85%", once: true },
        });
        gsap.from("[data-jd-req]", {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-jd-reqs]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const sheet: [string, string][] = [
    ["Ubicación", j.location],
    ["Área", jobSpecialtyLabel(j.specialty)],
    ["Modalidad", j.mode],
    ["Publicada", fmtDate(j.publishedAt)],
    ...(j.closesAt ? ([["Postulaciones hasta", fmtDate(j.closesAt)]] as [string, string][]) : []),
  ];

  return (
    <section ref={root} aria-labelledby="vacante-title" className="bg-white py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="kicker text-navy/65">Ficha de la vacante</p>
            <dl data-jd-sheet className="mt-5 divide-y divide-line border-y border-line text-[15px]">
              {sheet.map(([k, v]) => (
                <div key={k} data-jd-row className="flex justify-between gap-6 py-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium text-navy">{v}</dd>
                </div>
              ))}
            </dl>
            {j.ejemplo && (
              <p role="note" className="mt-6 rounded-[18px] border border-dashed border-blue/50 bg-blue/5 p-5 text-sm text-navy">
                <strong>Ejemplo ficticio</strong> para revisar el diseño en desarrollo. No es una vacante de IVC y no existe en producción.
              </p>
            )}
            <div className="mt-8 flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => scrollTo("postular")}
                className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-navy px-6 text-[13px] font-semibold text-white"
              >
                <span aria-hidden="true" className="absolute inset-0 translate-y-full rounded-full bg-blue transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                <span className="relative">Postular a esta vacante</span>
                <IconArrowDown size={16} className="relative transition-transform duration-500 group-hover:translate-y-1" />
              </button>
              <TransitionLink href="/trabaja-con-nosotros#ofertas" className="group inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-blue">
                <IconArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" /> Todas las vacantes
              </TransitionLink>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="kicker flex items-center gap-3 text-blue">
            <IconPin size={16} /> {j.location}
          </p>
          <SplitReveal as="h2" id="vacante-title" variant="lines" className="mt-5 text-[clamp(1.9rem,3.4vw,3.1rem)] font-semibold leading-[1.1] text-navy">
            Descripción del puesto
          </SplitReveal>
          <p className="mt-8 text-[18px] leading-relaxed text-navy">{j.summary}</p>
          {j.description.map((d) => (
            <p key={d} className="mt-5 text-[17px] leading-relaxed text-muted">
              {d}
            </p>
          ))}

          <h2 className="mt-16 text-[clamp(1.5rem,2.4vw,2.1rem)] font-semibold leading-[1.1] text-navy">Requisitos</h2>
          <ul data-jd-reqs className="mt-6 divide-y divide-line border-y border-line">
            {j.requirements.map((r, i) => (
              <li key={r} data-jd-req className="flex items-baseline gap-5 py-5 text-[17px] text-navy">
                <span aria-hidden="true" className="kicker w-6 text-blue/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
