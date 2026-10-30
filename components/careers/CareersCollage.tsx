"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/motion/IntroProvider";

const frames = [
  {
    src: "/projects/enhanced/15-agua-sjl-lima.webp",
    alt: "Trabajadores con equipo de protección instalando una tubería en San Juan de Lurigancho",
    cls: "right-[7%] top-[20%] w-[18vw] max-w-[300px] aspect-[3/4]",
    rotate: 4,
    speed: -60,
  },
  {
    src: "/projects/enhanced/20-carhuaquero-ii.webp",
    alt: "Equipo de trabajo en el montaje de una turbina en Carhuaquero II",
    cls: "right-[24%] bottom-[14%] w-[14vw] max-w-[240px] aspect-[4/5]",
    rotate: -5,
    speed: -120,
  },
];

/**
 * Collage de la portada de Trabaja con nosotros: dos fotografías de equipos en obra
 * que entran girando, flotan a velocidades distintas con el scroll y responden al puntero.
 */
export function CareersCollage() {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => gsap.set("[data-cc-frame]", { opacity: 1 }));
      mm.add(MQ.desktop, () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-cc-frame]");
        els.forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 180, rotate: frames[i].rotate * 4, opacity: 0, scale: 0.85 },
            { y: 0, rotate: frames[i].rotate, opacity: 1, scale: 1, duration: 1.8, ease: "expo.out", delay: 0.9 + i * 0.15 },
          );
          gsap.to(el.querySelector("[data-cc-inner]"), {
            yPercent: frames[i].speed / 3,
            rotate: frames[i].rotate * -1.5,
            ease: "none",
            scrollTrigger: { trigger: document.body, start: "top top", end: "+=900", scrub: 0.6 },
          });
        });
        const movers = els.map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 1.6, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.6, ease: "power3" }),
          k: (i + 1) * 18,
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.k);
            m.y(ny * m.k);
          });
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
      {frames.map((f) => (
        <div key={f.src} data-cc-frame className={`absolute [.js_&]:opacity-0 ${f.cls}`} style={{ transform: `rotate(${f.rotate}deg)` }}>
          <div data-cc-inner className="relative h-full w-full overflow-hidden rounded-[20px] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] ring-[6px] ring-white/90">
            <Image src={f.src} alt={f.alt} fill sizes="20vw" className="object-cover" />
          </div>
        </div>
      ))}
    </div>
  );
}
