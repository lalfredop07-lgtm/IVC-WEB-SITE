"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
  /** Segundos por ciclo completo a velocidad base. */
  speed?: number;
  reverse?: boolean;
};

/**
 * Marquesina infinita cuya velocidad, sentido e inclinación responden a la
 * velocidad del scroll. Con movimiento reducido queda estática.
 */
export function VelocityMarquee({ items, className = "", itemClassName = "", separator, speed = 40, reverse = false }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const dir = reverse ? 1 : -1;
        const loop = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 },
        );
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
        // quickTo reutiliza un único tween: antes se creaba uno nuevo en cada evento de scroll.
        const speedTo = gsap.quickTo(loop, "timeScale", { duration: 0.3, ease: "power2.out" });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            const boost = gsap.utils.clamp(-6, 6, v / 250);
            speedTo((self.direction === 1 ? 1 : -1) * (1 + Math.abs(boost)));
            skewTo(gsap.utils.clamp(-8, 8, (v / 300) * dir * -1));
          },
          onToggle(self) {
            if (!self.isActive) loop.pause();
            else loop.resume();
          },
        });
        const settle = () => skewTo(0);
        ScrollTrigger.addEventListener("scrollEnd", settle);
        return () => {
          ScrollTrigger.removeEventListener("scrollEnd", settle);
          st.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={itemClassName}>{item}</span>
          {separator}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div data-track className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
