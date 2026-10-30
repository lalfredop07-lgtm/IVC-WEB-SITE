"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { specialties, type Specialty } from "@/data/specialties";
import { TransitionLink } from "@/components/motion/PageTransition";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { IconArrowRight, specialtyIcons } from "@/components/ui/Icons";

/**
 * Cinco especialidades.
 * Escritorio: la sección se fija y las tarjetas recorren la pantalla en horizontal
 * (scrollytelling), con parallax interno de cada foto y un indicador 01–05.
 * Móvil/tableta: lista vertical con revelados escalonados (sin fijar el scroll).
 */
export function Specialties() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              gsap.set("[data-spec-progress]", { scaleX: self.progress });
              const idx = Math.min(specialties.length, Math.max(1, Math.ceil(self.progress * specialties.length + 0.0001)));
              if (counter.current) counter.current.textContent = String(idx).padStart(2, "0");
            },
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-spec-card]").forEach((card) => {
          const img = card.querySelector("[data-spec-img]");
          gsap.fromTo(
            img,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(card.querySelectorAll("[data-spec-reveal]"), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 85%", once: true },
          });
          gsap.from(card, {
            rotate: 3,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 45%", scrub: true },
          });
        });
      });

      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-spec-card]").forEach((card) => {
          gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 92%", once: true },
          });
          gsap.fromTo(
            card.querySelector("[data-spec-img]"),
            { yPercent: -8 },
            { yPercent: 8, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="especialidades" aria-labelledby="especialidades-title" className="relative overflow-hidden bg-paper">
      <div ref={track} className="flex flex-col gap-6 px-[var(--gutter)] py-28 will-change-transform lg:h-[100svh] lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:py-0 lg:pr-[12vw]">
        {/* Panel introductorio */}
        <div className="flex shrink-0 flex-col justify-center pb-6 lg:w-[38vw] lg:max-w-[600px] lg:pb-0 lg:pr-10">
          <p className="kicker flex items-center gap-3 text-blue">
            <span className="h-px w-8 bg-blue" /> 02 — Especialidades
          </p>
          <SplitReveal
            as="h2"
            id="especialidades-title"
            variant="chars"
            className="mt-6 text-[clamp(2.1rem,3.5vw,3.7rem)] font-semibold leading-[0.98] text-navy"
          >
            Cinco especialidades.
          </SplitReveal>
          <SplitReveal as="p" variant="lines" delay={0.2} className="title-accent mt-1 text-[clamp(2.1rem,3.6vw,3.8rem)] leading-[1] text-blue">
            Un mismo compromiso.
          </SplitReveal>
          <p className="mt-8 max-w-[30rem] text-[17px] leading-relaxed text-muted">
            Capacidad técnica aplicada a obras públicas y privadas en las cinco líneas de negocio de IVC.
          </p>
          <div className="mt-10 hidden items-center gap-5 lg:flex">
            <span className="font-display text-sm font-semibold text-navy">
              <span ref={counter}>01</span>
              <span className="text-navy/65"> / 05</span>
            </span>
            <span className="relative h-px w-40 bg-navy/15">
              <span data-spec-progress className="absolute inset-0 origin-left bg-blue" style={{ transform: "scaleX(0)" }} />
            </span>
            <span className="kicker text-navy/65">Desliza</span>
          </div>
        </div>

        {specialties.map((s, i) => (
          <SpecialtyCard key={s.slug} specialty={s} offset={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function SpecialtyCard({ specialty: s, offset }: { specialty: Specialty; offset: boolean }) {
  const Icon = specialtyIcons[s.slug];
  return (
    <article
      data-spec-card
      className={`group relative w-full shrink-0 overflow-hidden rounded-[26px] bg-navy text-white shadow-[0_40px_90px_-40px_rgb(0_27_49/0.6)] lg:w-[min(30vw,480px)] ${
        offset ? "lg:translate-y-[6svh]" : "lg:-translate-y-[4svh]"
      }`}
    >
      <TransitionLink href={`/especialidades/${s.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[38svh]">
          <div data-spec-img className="absolute -inset-x-[12%] inset-y-0 will-change-transform">
            <Image
              src={s.image}
              alt={s.imageAlt}
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.08]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          <span className="kicker absolute left-6 top-6 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur-md">{s.number} / 05</span>
        </div>

        <div className="relative flex flex-1 flex-col p-7 pt-10 transition-colors duration-700 group-hover:bg-blue lg:p-8 lg:pt-11">
          <span className="absolute -top-8 right-7 grid size-16 place-items-center rounded-full bg-white text-navy shadow-xl transition-transform duration-700 ease-out-expo group-hover:-rotate-12 group-hover:scale-110">
            <Icon size={26} />
          </span>
          <h3 data-spec-reveal className="max-w-[16ch] text-[clamp(1.4rem,1.9vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            {s.name}
          </h3>
          <p data-spec-reveal className="mt-3 text-[15px] leading-relaxed text-white/75">
            {s.summary}
          </p>
          <ul data-spec-reveal className="mt-5 flex flex-wrap gap-1.5">
            {s.scope.slice(0, 4).map((x) => (
              <li key={x} className="rounded-full px-2.5 py-1 text-[12px] text-white/80 ring-1 ring-inset ring-white/20">
                {x}
              </li>
            ))}
          </ul>
          <span data-spec-reveal className="mt-auto inline-flex items-center gap-2 pt-7 text-[13px] font-semibold text-sky">
            Ver especialidad
            <IconArrowRight size={16} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2" />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
