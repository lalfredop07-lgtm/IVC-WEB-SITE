"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Specialty } from "@/data/specialties";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/motion/IntroProvider";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowLeft, specialtyIcons } from "@/components/ui/Icons";

/** Portada de especialidad: foto que se descubre por máscara, titular por líneas y parallax al bajar. */
export function SpecialtyHero({ specialty: s }: { specialty: Specialty }) {
  const root = useRef<HTMLElement>(null);
  const Icon = specialtyIcons[s.slug];
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => gsap.set("[data-intro]", { visibility: "visible" }));
      mm.add(MQ.motion, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
        const title = SplitText.create("[data-sp-title]", { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.35 })
          .fromTo("[data-sp-frame]", { clipPath: "inset(30% 12% 30% 12% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.8, ease: "expo.inOut" }, 0)
          .from("[data-sp-img]", { scale: 1.4, duration: 2.4 }, 0)
          .from("[data-sp-back]", { x: -20, opacity: 0, duration: 1 }, 0.8)
          .from("[data-sp-kicker]", { y: 20, opacity: 0, duration: 1 }, 0.9)
          .from(title.words, { yPercent: 110, stagger: 0.05, duration: 1.2 }, 0.95)
          .from("[data-sp-icon]", { scale: 0, rotate: -120, duration: 1.2, ease: "back.out(1.6)" }, 1.1)
          .from("[data-sp-summary]", { y: 30, opacity: 0, duration: 1 }, 1.25);
        gsap.to("[data-sp-media]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-sp-content]", {
          yPercent: -20,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return () => title.revert();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative h-[88svh] min-h-[600px] overflow-hidden bg-navy-950 text-white">
      <div data-sp-frame className="absolute inset-0 overflow-hidden">
        <div data-sp-media className="absolute inset-0 will-change-transform">
          <div data-sp-img className="absolute inset-0">
            <Image src={s.image} alt={s.imageAlt} fill preload sizes="100vw" quality={80} className="object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(0_18_31/0.9)_0%,rgb(0_40_74/0.6)_45%,rgb(0_40_74/0.1)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
        <div className="grain absolute inset-0" />
      </div>

      <div data-sp-content className="container-x relative flex h-full flex-col justify-end pb-16 pt-[var(--header-h)] md:pb-24">
        <TransitionLink data-intro data-sp-back href="/especialidades" className="group mb-auto mt-10 inline-flex min-h-11 w-max items-center gap-2 text-[13px] text-white/80 hover:text-white">
          <IconArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" /> Todas las especialidades
        </TransitionLink>
        <div className="flex items-center gap-4">
          <span data-intro data-sp-icon className="grid size-14 place-items-center rounded-full bg-white text-navy">
            <Icon size={24} />
          </span>
          <p data-intro data-sp-kicker className="kicker text-sky">
            Especialidad {s.number} / 05
          </p>
        </div>
        <h1 data-intro data-sp-title className="mt-6 max-w-[18ch] text-[clamp(2.6rem,6.6vw,6.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
          {s.name}
        </h1>
        <p data-intro data-sp-summary className="mt-6 max-w-[38rem] text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-white/80">
          {s.summary}
        </p>
      </div>
    </section>
  );
}
