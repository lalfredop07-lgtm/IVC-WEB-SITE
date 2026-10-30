"use client";

import Image from "next/image";
import { useRef } from "react";
import { history, site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Solo 1988 tiene fecha en las fuentes oficiales: el resto de etapas no se fecha.
const phases = [
  {
    label: "Origen · Febrero de 1988",
    title: "Una empresa de servicios de ingeniería",
    text: history.origin,
    image: "/projects/enhanced/16-linea-conduccion-sjl.webp",
    alt: "Interior de una línea de conducción en San Juan de Lurigancho",
  },
  {
    label: "Crecimiento",
    title: "Del servicio de ingeniería a la construcción",
    text: history.growth,
    image: "/projects/enhanced/14-galerias-filtrantes-chincha.webp",
    alt: "Maquinaria en la obra de galerías filtrantes de Chincha",
  },
  {
    label: "Hoy",
    title: "Proyectos para el sector público y privado",
    text: history.today,
    image: "/projects/enhanced/19-pnp-ayacucho.webp",
    alt: "Vista aérea de infraestructura PNP en Ayacucho",
  },
];

/**
 * Trayectoria en scrollytelling: la sección se fija, el año avanza de 1988 al actual
 * con el scroll y las tres etapas cambian fotografía (barrido vertical) y texto.
 */
export function Timeline() {
  const root = useRef<HTMLElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const now = new Date().getFullYear();
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const counter = { y: site.foundedYear };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", scrub: 0.8, pin: true, anticipatePin: 1 },
        });
        // El año solo está documentado en el origen (1988) y hoy: en la etapa intermedia,
        // sin fecha en las fuentes, la cifra se atenúa en lugar de mostrar años inventados.
        tl.to("[data-tl-progress]", { scaleX: 1, duration: 3 }, 0)
          .to(year.current, { opacity: 0.12, filter: "blur(6px)", duration: 0.3 }, 0.85)
          .to(year.current, { opacity: 1, filter: "blur(0px)", duration: 0.3 }, 1.95)
          .to(
            counter,
            {
              y: now,
              duration: 0.7,
              onUpdate: () => {
                if (year.current) year.current.textContent = String(Math.round(counter.y));
              },
            },
            1.95,
          );
        [1, 2].forEach((i) => {
          const at = i * 1.1 - 0.25;
          tl.fromTo(`[data-tl-img="${i}"]`, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" }, at)
            .fromTo(`[data-tl-img="${i}"] img`, { scale: 1.3 }, { scale: 1, duration: 0.9 }, at)
            .to(`[data-tl-text="${i - 1}"]`, { yPercent: -30, opacity: 0, duration: 0.35 }, at)
            .fromTo(`[data-tl-text="${i}"]`, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45 }, at + 0.25)
            .to(`[data-tl-node="${i}"]`, { backgroundColor: "#a7cfe6", scale: 1.4, duration: 0.2 }, at + 0.2);
        });
        gsap.to("[data-tl-imgs]", { yPercent: -6, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", scrub: true } });
      });
      mm.add(MQ.mobile, () => {
        const counter = { y: site.foundedYear };
        gsap.to(counter, {
          y: now,
          duration: 2.4,
          ease: "power3.out",
          scrollTrigger: { trigger: year.current, start: "top 85%", once: true },
          onUpdate: () => {
            if (year.current) year.current.textContent = String(Math.round(counter.y));
          },
        });
      });
      mm.add(MQ.reduce, () => {
        if (year.current) year.current.textContent = String(now);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="trayectoria-title" className="relative overflow-hidden bg-navy-950 text-white">
      <div className="lg:h-[100svh]">
        {/* Fotografías (escritorio): apiladas y descubiertas por barrido */}
        <div data-tl-imgs className="absolute inset-0 hidden lg:block">
          {phases.map((p, i) => (
            <div key={p.image} data-tl-img={i} className="absolute inset-0 overflow-hidden" style={{ clipPath: i ? "inset(100% 0% 0% 0%)" : undefined }}>
              <Image src={p.image} alt={p.alt} fill sizes="100vw" className="object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#00121f_0%,rgb(0_18_31/0.9)_38%,rgb(0_18_31/0.35)_100%)]" />
          <div className="blueprint-grid absolute inset-0" />
        </div>

        <div className="container-x relative flex h-full flex-col justify-center py-24 lg:py-0">
          <p className="kicker flex items-center gap-3 text-sky">
            <span className="h-px w-8 bg-sky" /> 01 — Trayectoria
          </p>
          <h2 id="trayectoria-title" className="sr-only">
            Trayectoria de IVC desde 1988
          </h2>
          <span
            ref={year}
            aria-hidden="true"
            className="mt-6 block font-display text-[clamp(5.5rem,19vw,17rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-white tabular-nums"
          >
            {site.foundedYear}
          </span>

          {/* Etapas: superpuestas y animadas en escritorio, apiladas en móvil */}
          <div className="relative mt-10 grid gap-14 lg:mt-12 lg:block lg:h-[220px] lg:max-w-[560px]">
            {phases.map((p, i) => (
              <div key={p.label} data-tl-text={i} className={`lg:absolute lg:inset-0 ${i ? "lg:opacity-0" : ""}`}>
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[20px] lg:hidden">
                  <Image src={p.image} alt={p.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <p className="kicker text-sky">{p.label}</p>
                <h3 className="mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.1]">{p.title}</h3>
                <p className="mt-4 text-[17px] leading-relaxed text-white/70">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 hidden max-w-[560px] items-center gap-4 lg:flex">
            <span className="relative h-px flex-1 bg-white/15">
              <span data-tl-progress className="absolute inset-0 origin-left bg-sky" style={{ transform: "scaleX(0)" }} />
              {phases.map((p, i) => (
                <span
                  key={p.label}
                  data-tl-node={i}
                  className={`absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full ${i ? "bg-white/30" : "bg-sky"}`}
                  style={{ left: `calc(${(i / (phases.length - 1)) * 100}% - 5px)` }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
