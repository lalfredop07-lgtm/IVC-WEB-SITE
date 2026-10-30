"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "./IntroProvider";
import { useSmoothScroll } from "./SmoothScroll";

const STORAGE_KEY = "ivc-intro";
/** Duración de la primera mitad (logo + barra), animada en CSS desde el primer pintado. */
const CSS_PHASE_S = 1.35;

/**
 * Pantalla de entrada (solo primera visita de la sesión).
 * Cinco columnas —una por especialidad— se elevan para revelar el hero.
 * El logo, la barra y el lema se animan en CSS (globals.css) para no esperar a la
 * hidratación; GSAP solo ejecuta la salida, cuando esa primera fase ya terminó.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const { setReady } = useIntro();
  const { stop, start } = useSmoothScroll();
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.classList.contains("intro-seen")) {
        setReady(true);
        setDone(true);
        return;
      }
      stop();
      // Si el JavaScript llega tarde (móviles lentos), la fase CSS ya está hecha y la salida empieza al instante.
      const wait = Math.max(0, CSS_PHASE_S - performance.now() / 1000);
      const tl = gsap.timeline({
        delay: wait,
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {}
          start();
          setDone(true);
        },
      });
      tl.to("[data-pl-content]", { yPercent: -30, opacity: 0, duration: 0.7, ease: "power3.in" })
        .add(() => setReady(true), "-=0.15")
        .to("[data-pl-col]", { yPercent: -100, duration: 1.05, stagger: 0.07 }, "<0.05");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} data-preloader aria-hidden="true" className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} data-pl-col className="h-full flex-1 bg-navy-950 will-change-transform" style={{ marginLeft: i ? -1 : 0 }} />
        ))}
      </div>
      <div data-pl-content className="relative flex h-full flex-col items-center justify-center px-6">
        <div data-pl-logo>
          <Image src="/brand/logo-ivc.png" alt="" width={229} height={101} className="brand-logo w-[180px] md:w-[229px]" preload />
        </div>
        <div className="mt-10 h-px w-[min(280px,60vw)] overflow-hidden bg-white/15">
          <div data-pl-bar className="h-full origin-left bg-sky" />
        </div>
        <div className="absolute inset-x-0 bottom-8 flex justify-between px-[var(--gutter)] text-white/70">
          <span className="overflow-hidden">
            <span data-pl-meta className="kicker block">
              ¡Construimos Bienestar!
            </span>
          </span>
          <span className="overflow-hidden">
            <span data-pl-meta data-pl-meta-2 className="kicker block">
              Perú · Desde 1988
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
