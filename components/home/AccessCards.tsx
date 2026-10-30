"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { TransitionLink } from "@/components/motion/PageTransition";
import { IconArrowRight, IconCrane, IconLayers, IconShield } from "@/components/ui/Icons";

const cards = [
  {
    href: "/#especialidades",
    Icon: IconLayers,
    title: "Especialidades",
    text: "Cinco líneas de negocio: obras hidráulicas y saneamiento, habilitaciones urbanas, edificaciones, energía y transporte.",
    cta: "Ver especialidades",
  },
  {
    href: "/proyectos",
    Icon: IconCrane,
    title: "Proyectos destacados",
    text: "Una muestra de la experiencia de IVC en obras de infraestructura en distintas regiones del Perú.",
    cta: "Explorar proyectos",
  },
  {
    href: "/compromiso",
    Icon: IconShield,
    title: "Compromiso",
    text: "Calidad, seguridad y salud ocupacional, respeto ambiental y mejora continua en cada proyecto.",
    cta: "Nuestro compromiso",
  },
];

/**
 * Tres tarjetas blancas flotantes que se superponen al borde inferior del hero
 * (inspiradas en la referencia 01). Entran en 3D escalonadas e inclinan con el puntero.
 */
export function AccessCards() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-card]");
        gsap.from(items, {
          y: 140,
          rotateX: -28,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: 1.4,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        });
        gsap.from("[data-card] [data-draw]", {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          duration: 1.6,
          stagger: 0.05,
          ease: "power2.inOut",
          delay: 0.5,
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        });
      });

      mm.add(MQ.finePointer, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-card]").map((card) => {
          const rx = gsap.quickTo(card, "rotateX", { duration: 0.8, ease: "power3" });
          const ry = gsap.quickTo(card, "rotateY", { duration: 0.8, ease: "power3" });
          const glare = card.querySelector<HTMLElement>("[data-glare]");
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            rx((0.5 - py) * 8);
            ry((px - 0.5) * 10);
            if (glare) gsap.set(glare, { "--gx": `${px * 100}%`, "--gy": `${py * 100}%` });
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
        return () => cleanups.forEach((c) => c());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative z-20 -mt-[clamp(72px,14svh,140px)]">
      <div className="container-x">
        <h2 className="sr-only">Accesos principales</h2>
        <ul className="grid gap-4 [perspective:1400px] md:grid-cols-3 md:gap-5">
          {cards.map(({ href, Icon, title, text, cta }, i) => (
            <li key={title} className="[transform-style:preserve-3d]">
              <TransitionLink
                href={href}
                data-card
                className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white p-7 shadow-[0_30px_80px_-30px_rgb(0_27_49/0.35),0_2px_6px_rgb(0_27_49/0.05)] ring-1 ring-navy/5 transition-shadow duration-500 hover:shadow-[0_40px_100px_-30px_rgb(0_27_49/0.5)] lg:p-9"
              >
                <span
                  data-glare
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,50%),rgb(167_207_230/0.25),transparent_60%)] group-hover:opacity-100"
                />
                <div className="relative flex items-start justify-between">
                  <span className="relative grid size-16 place-items-center rounded-full bg-paper text-navy ring-1 ring-navy/10 transition-colors duration-500 group-hover:text-white">
                    <span className="absolute inset-0 scale-0 rounded-full bg-navy transition-transform duration-500 ease-out-expo group-hover:scale-100" />
                    <Icon size={26} className="relative transition-transform duration-700 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-110" />
                  </span>
                  <span className="kicker text-navy/65">0{i + 1}</span>
                </div>
                <h3 className="relative mt-8 text-[1.35rem] font-semibold tracking-[-0.03em] text-navy">{title}</h3>
                <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-muted">{text}</p>
                <span className="relative mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-blue">
                  <span className="relative">
                    {cta}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-blue transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                  <IconArrowRight size={16} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
