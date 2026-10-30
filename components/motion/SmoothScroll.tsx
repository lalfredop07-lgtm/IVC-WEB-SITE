"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollApi = {
  /** Desplaza suavemente hasta un id de sección o elemento. */
  scrollTo: (target: string | HTMLElement | number, opts?: { immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll debe usarse dentro de <SmoothScroll>");
  return ctx;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // En táctil se respeta el scroll nativo (más fiable y eficiente en móviles).
      syncTouch: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<ScrollApi["scrollTo"]>((target, opts) => {
    const headerOffset = -72;
    let el: HTMLElement | number | null = null;
    if (typeof target === "string") {
      el = document.getElementById(target.replace(/^#/, ""));
    } else {
      el = target;
    }
    if (el === null) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, {
        offset: typeof el === "number" ? 0 : headerOffset,
        immediate: opts?.immediate,
        duration: 1.6,
        easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2),
      });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el, behavior: opts?.immediate ? "auto" : "smooth" });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + headerOffset;
      window.scrollTo({ top, behavior: opts?.immediate ? "auto" : "smooth" });
    }
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  const api = useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
