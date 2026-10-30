"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

// Texto de narrativa propuesto (pendiente de aprobación por IVC).
// Las palabras marcadas con * se iluminan en el acento ligero azul cielo.
const TEXT =
  "Cada obra que ejecutamos lleva *agua, ordena el *territorio, levanta espacios para *servir y *conecta al Perú. Así, desde 1988, construimos *bienestar.";

const floating = [
  { src: "/projects/enhanced/02-saneamiento-nana-lima.webp", alt: "Planta de saneamiento del esquema Ñaña, Lima", pos: "left-[3%] top-[10%] w-[15vw] aspect-[4/5]", speed: -40 },
  { src: "/projects/enhanced/13-sector62-chilca.webp", alt: "Vías del Sector 62 en Chilca, Lima", pos: "right-[4%] top-[6%] w-[18vw] aspect-[4/3]", speed: -70 },
  { src: "/projects/enhanced/14-galerias-filtrantes-chincha.webp", alt: "Obra de galerías filtrantes en Chincha", pos: "left-[8%] bottom-[4%] w-[17vw] aspect-[4/3]", speed: 60 },
  { src: "/projects/enhanced/20-carhuaquero-ii.webp", alt: "Montaje de turbina en Carhuaquero II", pos: "right-[7%] bottom-[8%] w-[13vw] aspect-[3/4]", speed: 35 },
];

/**
 * Scrollytelling: la sección se fija y la frase se ilumina palabra a palabra con el scroll,
 * mientras cuatro fotografías flotan en planos de profundidad distintos.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const words = TEXT.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", scrub: 0.8, pin: true, anticipatePin: 1 },
        });
        tl.to("[data-word]", { opacity: 1, stagger: 0.1, duration: 0.3 }, 0)
          .to("[data-word-accent]", { color: "#a7cfe6", stagger: 0.25, duration: 0.3 }, 0.2)
          .fromTo("[data-float]", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.12, duration: 0.8 }, 0);
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el) => {
          tl.to(el, { yPercent: Number(el.dataset.speed), duration: tl.duration() }, 0);
        });
        tl.fromTo("[data-manifesto-rule]", { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);
      });
      mm.add(MQ.mobile, () => {
        gsap.to("[data-word]", {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: "[data-manifesto-text]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        });
        gsap.to("[data-word-accent]", {
          color: "#a7cfe6",
          stagger: 0.2,
          ease: "none",
          scrollTrigger: { trigger: "[data-manifesto-text]", start: "top 70%", end: "bottom 40%", scrub: 0.6 },
        });
      });
      mm.add(MQ.reduce, () => {
        gsap.set("[data-word]", { opacity: 1 });
        gsap.set("[data-word-accent]", { color: "#a7cfe6" });
        gsap.set("[data-float]", { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Nuestro propósito" className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(7_82_138/0.35),transparent_70%)]" />

      {floating.map((f) => (
        <div
          key={f.src}
          data-float
          data-speed={f.speed}
          className={`absolute hidden overflow-hidden rounded-[18px] opacity-0 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)] lg:block ${f.pos}`}
        >
          <Image src={f.src} alt={f.alt} fill sizes="18vw" className="object-cover" />
          <div className="absolute inset-0 bg-navy/25" />
        </div>
      ))}

      <div className="container-x relative flex min-h-[100svh] flex-col items-center justify-center py-28 text-center">
        <p className="kicker flex items-center gap-3 text-sky">
          <span className="h-px w-8 bg-sky" /> Nuestro propósito <span className="h-px w-8 bg-sky" />
        </p>
        <p
          data-manifesto-text
          className="mt-10 max-w-[19ch] font-display text-[clamp(2rem,5.2vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.045em]"
        >
          {words.map((w, i) => {
            const accent = w.startsWith("*");
            const word = accent ? w.slice(1) : w;
            return (
              <span key={i} data-word className="opacity-[0.16]">
                {accent ? (
                  <span data-word-accent className="title-accent text-white">
                    {word}
                  </span>
                ) : (
                  word
                )}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
        <div className="mt-14 h-px w-[min(420px,70vw)] bg-white/10">
          <div data-manifesto-rule className="h-full origin-left bg-sky" />
        </div>
      </div>
    </section>
  );
}
