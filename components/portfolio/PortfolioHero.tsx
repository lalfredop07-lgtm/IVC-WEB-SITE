"use client";

import Image from "next/image";
import { useRef } from "react";
import { projects, regionsCount } from "@/data/projects";
import { specialties } from "@/data/specialties";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/motion/IntroProvider";
import { Counter } from "@/components/motion/Counter";

// Todas las fotografías del banco, repartidas en cuatro columnas.
const photos = projects.flatMap((p) => p.photos.map((ph) => ({ src: ph.enhanced, alt: ph.alt })));
const columns = [0, 1, 2, 3].map((c) => photos.filter((_, i) => i % 4 === c));

/**
 * Portada del portafolio: un muro inclinado en 3D con las fotografías de obra
 * desplazándose en columnas opuestas. Al hacer scroll el muro se endereza y se acerca.
 */
export function PortfolioHero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => gsap.set("[data-intro]", { visibility: "visible" }));
      mm.add(MQ.motion, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
        gsap.set("[data-ph-wall]", { rotateX: 32, rotateZ: -12, scale: 1.1 });
        // Columnas en bucle infinito, alternando sentido.
        gsap.utils.toArray<HTMLElement>("[data-ph-col]").forEach((col, i) => {
          gsap.fromTo(col, { yPercent: i % 2 ? -50 : 0 }, { yPercent: i % 2 ? 0 : -50, duration: 46 + i * 6, ease: "none", repeat: -1 });
        });
        const title = SplitText.create("[data-ph-title]", { type: "words,chars", mask: "words", aria: "none" });
        // Con interlineado 0,95 la máscara recortaría la cola de la «q».
        gsap.set(title.masks, { paddingBottom: "0.12em", marginBottom: "-0.12em" });
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.2 })
          .from("[data-ph-wall]", { opacity: 0, scale: 1.25, duration: 2.2 }, 0)
          .from("[data-ph-kicker]", { y: 20, opacity: 0, duration: 1 }, 0.4)
          .from(title.chars, { yPercent: 120, duration: 1.2, stagger: 0.02 }, 0.5)
          .fromTo("[data-ph-accent]", { clipPath: "inset(0% 100% -20% 0%)" }, { clipPath: "inset(0% 0% -20% 0%)", duration: 1.5, ease: "expo.inOut" }, 0.9)
          .from("[data-ph-stat]", { y: 40, opacity: 0, duration: 1, stagger: 0.1 }, 1.1);
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to("[data-ph-wall]", { rotateX: 0, rotateZ: 0, scale: 1.05, yPercent: 8 }, 0)
          .to("[data-ph-dim]", { opacity: 0.85 }, 0)
          .to("[data-ph-content]", { yPercent: -30, opacity: 0 }, 0);
        return () => title.revert();
      });
      mm.add(MQ.finePointer, () => {
        const rx = gsap.quickTo("[data-ph-tilt]", "rotateY", { duration: 1.5, ease: "power3" });
        const ry = gsap.quickTo("[data-ph-tilt]", "rotateX", { duration: 1.5, ease: "power3" });
        const move = (e: PointerEvent) => {
          rx((e.clientX / window.innerWidth - 0.5) * 8);
          ry((e.clientY / window.innerHeight - 0.5) * -6);
        };
        const el = root.current!;
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 [perspective:1400px]">
        <div data-ph-tilt className="absolute inset-0 [transform-style:preserve-3d]">
          <div
            data-ph-wall
            className="absolute -inset-x-[20%] -inset-y-[30%] grid grid-cols-3 gap-4 will-change-transform md:grid-cols-4 md:gap-5"
            style={{ transform: "rotateX(32deg) rotateZ(-12deg) scale(1.1)" }}
          >
            {columns.map((col, c) => (
              <div key={c} className={`overflow-hidden ${c === 3 ? "hidden md:block" : ""}`}>
                <div data-ph-col className="flex flex-col gap-4 will-change-transform md:gap-5">
                  {[...col, ...col].map((p, i) => (
                    <div key={i} className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-[18px]">
                      {/* Sin carga diferida solo las dos primeras miniaturas visibles de cada columna (medido en
                          móvil y escritorio): las columnas impares arrancan desplazadas un 50 %, así que en ellas
                          se ve primero la segunda copia. Cargar más a la vez satura la red y retrasa el LCP. */}
                      <Image
                        src={p.src}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 40vw"
                        quality={70}
                        loading={(c % 2 ? i - col.length : i) >= 0 && (c % 2 ? i - col.length : i) < 2 ? "eager" : "lazy"}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_60%,rgb(0_18_31/0.92)_0%,rgb(0_18_31/0.6)_60%,rgb(0_18_31/0.75)_100%)]" />
      <div data-ph-dim className="absolute inset-0 bg-navy-950 opacity-0" />
      <div className="grain absolute inset-0" />

      <div data-ph-content className="container-x relative z-10 flex h-full flex-col justify-end pb-[clamp(56px,10svh,120px)] pt-[calc(var(--header-h)+24px)] max-md:items-center max-md:justify-center max-md:text-center">
        <p data-intro data-ph-kicker className="kicker flex items-center gap-4 text-sky">
          <span className="h-px w-10 bg-sky max-md:w-6" /> Portafolio de obras
          <span className="h-px w-6 bg-sky md:hidden" />
        </p>
        {/* Móvil: «construyen» (≈5,4 em en light) marca el máximo que cabe en el ancho útil. */}
        <h1 data-intro className="mt-6 font-semibold leading-[0.95] tracking-[-0.05em]">
          <span className="sr-only">Obras que </span>
          <span data-ph-title aria-hidden="true" className="block text-[clamp(2.8rem,8.4vw,8rem)] max-md:text-[min(calc((100vw-2*var(--gutter))/5.6),4.4rem)]">
            Obras que
          </span>
          <span
            data-ph-accent
            className="title-accent block pb-[0.08em] text-[clamp(2.6rem,8.4vw,8rem)] leading-[1] text-sky max-md:text-[min(calc((100vw-2*var(--gutter))/5.6),4.4rem)]"
          >
            construyen bienestar.
          </span>
        </h1>
        <ul data-intro className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/15 pt-8 max-md:grid max-md:w-full max-md:grid-cols-3 max-md:gap-x-3">
          {[
            { v: projects.length, l: "fichas en el banco fotográfico" },
            { v: specialties.length, l: "especialidades" },
            { v: regionsCount, l: "regiones identificadas" },
          ].map((s) => (
            <li key={s.l} data-ph-stat className="flex items-baseline gap-3 max-md:flex-col max-md:items-center max-md:gap-2">
              <Counter value={s.v} pad={2} className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl" />
              <span className="max-w-[12ch] text-sm leading-tight text-white/60 max-md:text-[13px]">{s.l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
