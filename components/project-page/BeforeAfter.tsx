"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Props = { original: string; enhanced: string; alt: string };

/**
 * Comparador fotografía original / visualización mejorada.
 * Accesible con teclado (input range). Al entrar en pantalla la línea barre la imagen.
 * La posición vive en la variable CSS --pos: el barrido inicial y el arrastre la
 * actualizan directamente, sin volver a renderizar el componente en cada fotograma.
 * El arrastre usa eventos de puntero sobre toda la imagen (en iOS un range invisible
 * solo responde si se toca el tirador); el scroll vertical del móvil sigue libre.
 */
export function BeforeAfter({ original, enhanced, alt }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const drag = useRef<{ id: number; x: number; active: boolean } | null>(null);
  const sweep = useRef<gsap.core.Tween | null>(null);

  const apply = (v: number) => {
    const r = Math.round(v);
    root.current?.style.setProperty("--pos", `${v}%`);
    if (input.current) {
      input.current.value = String(r);
      input.current.setAttribute("aria-valuetext", `${r}% de la fotografía original visible`);
    }
  };

  const fromPointer = (clientX: number) => {
    const r = root.current?.getBoundingClientRect();
    if (r) apply(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Si el usuario toma el control durante el barrido inicial, el barrido se detiene.
    sweep.current?.kill();
    drag.current = { id: e.pointerId, x: e.clientX, active: e.pointerType === "mouse" };
    if (e.pointerType === "mouse") {
      e.currentTarget.setPointerCapture(e.pointerId);
      fromPointer(e.clientX);
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    // Al tocar, el arrastre empieza solo tras un gesto horizontal claro.
    if (!d.active && Math.abs(e.clientX - d.x) > 6) {
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.active) fromPointer(e.clientX);
  };
  const endDrag = () => (drag.current = null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const o = { v: 96 };
        sweep.current = gsap.to(o, {
          v: 50,
          duration: 1.8,
          ease: "expo.inOut",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
          onStart: () => apply(96),
          onUpdate: () => apply(o.v),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="relative aspect-[16/10] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[26px] bg-navy-900 outline-offset-4 outline-blue-400 [--pos:50%] has-[input:focus-visible]:outline-2 md:aspect-[16/9]"
    >
      <Image src={original} alt={`${alt} — fotografía original publicada por IVC`} fill sizes="(min-width: 1440px) 1300px, (min-width: 1024px) 88vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 [clip-path:inset(0_0_0_var(--pos))]">
        <Image src={enhanced} alt={`${alt} — visualización mejorada`} fill sizes="(min-width: 1440px) 1300px, (min-width: 1024px) 88vw, 100vw" className="object-cover" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-px bg-white shadow-[0_0_20px_rgb(0_0_0/0.5)]">
        <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-xl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <span className="kicker pointer-events-none absolute left-4 top-4 rounded-full bg-navy-950/60 px-3 py-1.5 text-[10px] text-white backdrop-blur-md">
        <span className="sm:hidden">Original</span>
        <span className="hidden sm:inline">Fotografía original</span>
      </span>
      <span className="kicker pointer-events-none absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] text-navy backdrop-blur-md">
        <span className="sm:hidden">Mejorada</span>
        <span className="hidden sm:inline">Visualización mejorada</span>
      </span>

      <input
        ref={input}
        type="range"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        onInput={(e) => {
          sweep.current?.kill();
          apply(Number(e.currentTarget.value));
        }}
        aria-label="Comparar fotografía original y visualización mejorada"
        aria-valuetext="50% de la fotografía original visible"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
    </div>
  );
}
