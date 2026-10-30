"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { specialties } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowUpRight, specialtyIcons } from "@/components/ui/Icons";

/**
 * Quiénes somos: texto institucional + índice de las cinco líneas de negocio.
 * En escritorio, al recorrer la lista, un visor fijo cambia de fotografía con
 * un barrido diagonal; en móvil cada fila muestra su miniatura.
 */
export function WhoWeAre() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const z = useRef(2);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-ww-row]", {
          yPercent: 60,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-ww-list]", start: "top 85%", once: true },
        });
        gsap.from("[data-ww-rule]", {
          scaleX: 0,
          stagger: 0.08,
          duration: 1.3,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-ww-list]", start: "top 85%", once: true },
        });
        gsap.fromTo(
          "[data-ww-viewer]",
          { clipPath: "inset(20% 20% 20% 20% round 40px)", rotate: -3 },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            rotate: 0,
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: "[data-ww-viewer]", start: "top 85%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Barrido de imagen al cambiar de fila.
  const show = (i: number) => {
    if (i === current) return;
    setCurrent(i);
    const el = root.current?.querySelector<HTMLElement>(`[data-ww-img="${i}"]`);
    if (el) el.style.zIndex = String(z.current++);
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el, { clipPath: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.9, ease: "expo.out", overwrite: true });
    gsap.fromTo(el.querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "expo.out", overwrite: true });
  };

  return (
    <section ref={root} aria-labelledby="quienes-title" className="relative bg-white py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> 02 — Quiénes somos
            </p>
            <SplitReveal as="h2" id="quienes-title" variant="lines" className="mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[1.02] text-navy">
              Una constructora peruana dedicada a la <span className="title-accent text-blue">ingeniería.</span>
            </SplitReveal>
          </div>
          <SplitReveal as="p" variant="blur" stagger={0.012} className="self-end text-[17px] leading-relaxed text-muted lg:col-span-5">
            Desarrollamos y ejecutamos proyectos de ingeniería para el sector público y privado. Nuestra experiencia se organiza en cinco líneas de
            negocio, desde el agua y el saneamiento hasta la energía y el transporte.
          </SplitReveal>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div data-ww-viewer className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-navy">
                {specialties.map((s, i) => (
                  <div
                    key={s.slug}
                    data-ww-img={i}
                    className="absolute inset-0 overflow-hidden"
                    style={i === 0 ? { zIndex: 1 } : undefined}
                  >
                    <Image src={s.image} alt={s.imageAlt} fill sizes="40vw" className="object-cover" />
                  </div>
                ))}
                <div className="absolute inset-0 z-[900] bg-gradient-to-t from-navy-950/70 to-transparent" />
                <p className="kicker absolute bottom-6 left-6 z-[901] text-white/85">
                  {specialties[current].number} / 05 · {specialties[current].shortName}
                </p>
              </div>
            </div>
          </div>

          <ul data-ww-list className="lg:col-span-7">
            {specialties.map((s, i) => {
              const Icon = specialtyIcons[s.slug];
              const active = i === current;
              return (
                <li key={s.slug} className="relative overflow-hidden">
                  <span data-ww-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
                  <TransitionLink
                    href={`/especialidades/${s.slug}`}
                    data-ww-row
                    onPointerEnter={() => show(i)}
                    onFocus={() => show(i)}
                    className="group relative flex items-center gap-5 py-7 md:gap-8 md:py-9"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 -z-0 origin-left bg-paper transition-transform duration-700 ease-out-expo ${active ? "scale-x-100" : "scale-x-0"}`}
                    />
                    <span className="relative hidden w-10 kicker text-blue/80 md:block">{s.number}</span>
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl lg:hidden">
                      <Image src={s.image} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="relative flex-1">
                      <span className="block font-display text-[clamp(1.35rem,2.6vw,2.3rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-navy transition-transform duration-700 ease-out-expo group-hover:translate-x-2">
                        {s.name}
                      </span>
                      <span className="mt-2 block text-sm text-muted">{s.scope.slice(0, 3).join(" · ")}</span>
                    </span>
                    <span
                      className={`relative hidden size-12 shrink-0 place-items-center rounded-full transition-all duration-500 md:grid ${
                        active ? "bg-navy text-white" : "text-navy ring-1 ring-inset ring-navy/15"
                      }`}
                    >
                      <Icon size={20} className="transition-opacity duration-300 group-hover:opacity-0" />
                      <IconArrowUpRight size={18} className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </span>
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
