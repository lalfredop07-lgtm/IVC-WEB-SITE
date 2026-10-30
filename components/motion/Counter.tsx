"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Cifra que cuenta desde 0 al entrar en pantalla. Solo para valores verificados. */
export function Counter({ value, className = "", pad = 0 }: { value: number; className?: string; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => String(Math.round(n)).padStart(pad, "0");

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const o = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(o, {
          v: value,
          duration: 2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = fmt(o.v);
          },
        });
        return () => {
          el.textContent = fmt(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(value)}
    </span>
  );
}
