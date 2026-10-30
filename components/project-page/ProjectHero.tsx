"use client";

import Image from "next/image";
import { useRef } from "react";
import { formatRegion, projects, type Project } from "@/data/projects";
import { specialtyBySlug } from "@/data/specialties";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/motion/IntroProvider";
import { HERO_READY_EVENT, TransitionLink } from "@/components/motion/PageTransition";
import { specialtyIcons } from "@/components/ui/Icons";

/**
 * Portada de obra. La fotografía ocupa la pantalla desde el primer fotograma para
 * enlazar con la transición de imagen expandida de las tarjetas; el texto entra después.
 */
export function ProjectHero({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  const category = specialtyBySlug(project.category)!;
  const Icon = specialtyIcons[project.category];
  const number = projects.findIndex((p) => p.slug === project.slug) + 1;

  const announce = () => window.dispatchEvent(new Event(HERO_READY_EVENT));

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => gsap.set("[data-intro]", { visibility: "visible" }));
      mm.add(MQ.motion, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
        const title = SplitText.create("[data-pj-title]", { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.45 })
          .from("[data-pj-veil]", { opacity: 0, duration: 1.4, ease: "power2.out" }, 0)
          .from("[data-pj-chip]", { scale: 0.6, opacity: 0, duration: 1, ease: "back.out(1.7)" }, 0.3)
          .from(title.lines, { yPercent: 110, duration: 1.3, stagger: 0.1 }, 0.4)
          .from("[data-pj-meta] > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.8)
          .from("[data-pj-number]", { yPercent: 40, opacity: 0, duration: 1.6 }, 0.5);
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to("[data-pj-media]", { yPercent: 20, scale: 1.1 }, 0)
          .to("[data-pj-content]", { yPercent: -25, opacity: 0 }, 0)
          .to("[data-pj-number]", { yPercent: -60 }, 0)
          .fromTo("[data-pj-frame]", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(3% 3% 0% 3% round 40px)" }, 0);
        return () => title.revert();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[620px] bg-white text-white">
      <div data-pj-frame className="absolute inset-0 overflow-hidden bg-navy-950">
        <div data-pj-media className="absolute inset-0 will-change-transform">
          <Image
            src={project.photos[0].enhanced}
            alt={project.photos[0].alt}
            fill
            loading="eager"
            fetchPriority="high"
            quality={80}
            sizes="100vw"
            className="object-cover"
            onLoad={announce}
            ref={(img) => {
              if (img?.complete) requestAnimationFrame(announce);
            }}
          />
        </div>
        <div data-pj-veil className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_18_31/0.95)_0%,rgb(0_18_31/0.5)_40%,transparent_70%),linear-gradient(to_bottom,rgb(0_18_31/0.6)_0%,transparent_25%)]" />
          <div className="grain absolute inset-0" />
        </div>
      </div>

      <span
        data-intro
        data-pj-number
        aria-hidden="true"
        className="title-accent pointer-events-none absolute right-[var(--gutter)] top-[calc(var(--header-h)+10px)] z-10 text-[clamp(5rem,14vw,13rem)] leading-none text-white/15"
      >
        {String(number).padStart(2, "0")}
      </span>

      <div data-pj-content className="container-x relative z-10 flex h-full flex-col justify-end pb-[clamp(48px,9svh,110px)] pt-[var(--header-h)]">
        <TransitionLink
          data-intro
          data-pj-chip
          href={`/especialidades/${category.slug}`}
          className="inline-flex max-w-full items-center gap-3 self-start rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-[13px] leading-snug ring-1 ring-inset ring-white/20 backdrop-blur-md transition-colors hover:bg-white hover:text-navy"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-navy">
            <Icon size={16} />
          </span>
          {category.name}
        </TransitionLink>
        <h1 data-intro data-pj-title className="mt-6 max-w-[22ch] text-[clamp(2.4rem,6.4vw,6.2rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
          {project.name}
        </h1>
        <div data-intro data-pj-meta className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
          <span>{formatRegion(project.region)}</span>
          <span className="h-4 w-px bg-white/25" />
          <span>
            Obra {String(number).padStart(2, "0")} de {projects.length}
          </span>
          <span className="h-4 w-px bg-white/25" />
          <span className="kicker text-[10px] text-sky">Visualización mejorada</span>
        </div>
      </div>
    </section>
  );
}
