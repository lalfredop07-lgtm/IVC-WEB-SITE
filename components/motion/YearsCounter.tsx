"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { yearsSinceFoundation } from "@/data/site";

/**
 * Años de trayectoria desde febrero de 1988. El HTML inicial lleva el valor de la
 * compilación; en el navegador se recalcula con la fecha real y cuenta hacia arriba
 * al entrar en pantalla (la cifra nunca queda fijada).
 */
export function YearsCounter({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const years = yearsSinceFoundation(new Date());
      el.textContent = String(years);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: years,
          duration: 2.2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
        return () => {
          el.textContent = String(years);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`} suppressHydrationWarning>
      {yearsSinceFoundation()}
    </span>
  );
}
