"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

type Variant = "lines" | "words" | "chars" | "blur";
type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type Props = {
  as?: Tag;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  /** Punto de inicio del ScrollTrigger. Si es false, se anima al montar. */
  start?: string | false;
  id?: string;
};

/** Margen de anticipación: el texto se divide cuando está a menos de una pantalla de distancia. */
const PREPARE_MARGIN = "0px 0px 100% 0px";

/**
 * Revelado tipográfico con SplitText. Cuatro estilos distintos para no repetir
 * el mismo fade: líneas enmascaradas, palabras escalonadas, caracteres en 3D y desenfoque.
 *
 * Rendimiento: el texto no se divide (ni se mide) al hidratar, sino cuando se acerca al
 * viewport, para no acumular trabajo de maquetación en la carga inicial.
 * Accesibilidad: en encabezados SplitText añade aria-label al título y oculta los
 * fragmentos; en párrafos (donde aria-label no está permitido) el texto se deja legible.
 */
export function SplitReveal({
  as: Tag = "div",
  variant = "lines",
  className,
  children,
  delay = 0,
  stagger,
  start = "top 85%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (ctx) => {
        let split: SplitText | null = null;
        const prepare = () =>
          ctx.add(() => {
            const type = variant === "chars" ? "lines,words,chars" : variant === "lines" ? "lines" : "lines,words";
            split = SplitText.create(el, {
              type,
              mask: variant === "blur" ? undefined : "lines",
              linesClass: "split-line",
              aria: /^h[1-6]$/.test(Tag) ? "auto" : "none",
              autoSplit: true,
              onSplit(self) {
                const scrollTrigger = start === false ? undefined : { trigger: el, start, once: true };
                gsap.set(el, { visibility: "visible" });
                if (variant === "lines") {
                  return gsap.from(self.lines, { yPercent: 110, duration: 1.2, stagger: stagger ?? 0.1, ease: "expo.out", delay, scrollTrigger });
                }
                if (variant === "words") {
                  return gsap.from(self.words, { yPercent: 105, duration: 1, stagger: stagger ?? 0.035, ease: "expo.out", delay, scrollTrigger });
                }
                if (variant === "chars") {
                  return gsap.from(self.chars, {
                    yPercent: 100,
                    rotateX: -80,
                    opacity: 0,
                    transformOrigin: "50% 100% -20px",
                    duration: 1.1,
                    stagger: stagger ?? 0.022,
                    ease: "expo.out",
                    delay,
                    scrollTrigger,
                  });
                }
                return gsap.from(self.words, {
                  opacity: 0,
                  filter: "blur(12px)",
                  y: 18,
                  duration: 1.1,
                  stagger: stagger ?? 0.04,
                  ease: "power3.out",
                  delay,
                  scrollTrigger,
                });
              },
            });
          });

        if (start === false) {
          prepare();
          return () => split?.revert();
        }
        // Se prepara una sola vez, cuando el bloque está cerca (o ya dentro) del viewport.
        // Los bloques que quedaron por encima (recarga a mitad de página) se muestran sin animar.
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            prepare();
          },
          { rootMargin: PREPARE_MARGIN },
        );
        io.observe(el);
        return () => {
          io.disconnect();
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [variant] },
  );

  return (
    <Tag ref={ref as never} id={id} className={className} style={{ perspective: variant === "chars" ? 600 : undefined }}>
      {children}
    </Tag>
  );
}
