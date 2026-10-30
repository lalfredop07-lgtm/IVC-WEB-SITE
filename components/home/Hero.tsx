"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/motion/IntroProvider";
import { Button } from "@/components/ui/Button";

const HERO_IMAGE = "/projects/enhanced/01-reservorio-picasso-ica.webp";

/**
 * Hero cinematográfico.
 * Capas (de fondo a frente): foto con Ken Burns → retícula técnica → velos azules → texto.
 * Entrada: escala de la foto + trazado de la retícula + titular carácter a carácter + barrido de la palabra acento.
 * Puntero: cada capa se desplaza a distinta velocidad (profundidad).
 * Scroll: la foto se acerca y desciende, el texto se eleva y el marco se recoge con esquinas curvas.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
      });

      mm.add(MQ.motion, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
        // La línea partida en caracteres está oculta a lectores de pantalla (tiene copia en sr-only);
        // el párrafo se divide en líneas sin atributos ARIA, porque queda legible tal cual.
        const title = SplitText.create("[data-hero-line1]", { type: "chars", mask: "lines", aria: "none" });
        const lead = SplitText.create("[data-hero-lead]", { type: "lines", mask: "lines", aria: "none" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-hero-kb]", { scale: 1.32, duration: 2.6, ease: "expo.out" }, 0)
          .from("[data-hero-veil]", { opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from("[data-hero-gridline]", { scaleY: 0, duration: 1.8, stagger: 0.12, ease: "expo.inOut" }, 0.1)
          .from("[data-hero-kicker-line]", { scaleX: 0, duration: 1.1 }, 0.35)
          .from("[data-hero-kicker]", { xPercent: -20, opacity: 0, duration: 1 }, 0.45)
          .from(title.chars, { yPercent: 115, rotate: 8, duration: 1.3, stagger: 0.035 }, 0.4)
          .fromTo(
            "[data-hero-line2]",
            { clipPath: "inset(0% 100% -20% 0%)", x: -30 },
            { clipPath: "inset(0% 0% -20% 0%)", x: 0, duration: 1.6, ease: "expo.inOut" },
            0.75,
          )
          .from(lead.lines, { yPercent: 105, duration: 1.1, stagger: 0.1 }, 1.05)
          .from("[data-hero-cta] > *", { y: 40, opacity: 0, duration: 1, stagger: 0.1 }, 1.2)
          .from("[data-hero-meta]", { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 1.35);

        // Respiración lenta de la fotografía una vez terminada la entrada.
        tl.add(() => {
          gsap.to("[data-hero-kb]", { scale: 1.07, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        // Transición al hacer scroll.
        const scrub = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        scrub
          .to("[data-hero-media]", { yPercent: 16, scale: 1.1 }, 0)
          .to("[data-hero-content]", { yPercent: -28, opacity: 0, ease: "power1.in" }, 0)
          .to("[data-hero-dim]", { opacity: 0.75 }, 0)
          .to("[data-hero-side]", { yPercent: -60, opacity: 0 }, 0)
          .fromTo(
            "[data-hero-frame]",
            { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" },
            { clipPath: "inset(0% 2.5% 0% 2.5% round 0px 0px 48px 48px)" },
            0,
          );

        return () => {
          title.revert();
          lead.revert();
        };
      });

      // Profundidad con el puntero (solo ratón/trackpad).
      mm.add(MQ.finePointer, () => {
        const layers = [
          { el: "[data-hero-mouse]", amount: -18 },
          { el: "[data-hero-grid]", amount: 10 },
          { el: "[data-hero-content]", amount: 8 },
        ].map(({ el, amount }) => ({
          x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3" }),
          amount,
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.amount * 2);
            l.y(ny * l.amount * 1.2);
          });
        };
        const el = root.current!;
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[640px] bg-white text-white md:min-h-[720px]"
    >
      <div data-hero-frame className="absolute inset-0 overflow-hidden bg-navy-950 will-change-[clip-path]">
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <div data-hero-mouse className="absolute -inset-[4%] will-change-transform">
            <div data-hero-kb className="absolute inset-0 will-change-transform">
              <Image
                src={HERO_IMAGE}
                alt="Reservorio elevado del Estadio Picasso Peratta en Ica, obra de infraestructura hidráulica"
                fill
                loading="eager"
                fetchPriority="high"
                quality={80}
                sizes="100vw"
                className="object-cover object-[60%_center]"
              />
            </div>
          </div>
        </div>

        {/* Velos de legibilidad: azul institucional desde la izquierda + base inferior */}
        <div data-hero-veil className="absolute inset-0 bg-[linear-gradient(100deg,rgb(0_18_31/0.92)_0%,rgb(0_40_74/0.72)_38%,rgb(0_40_74/0.18)_72%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_18_31/0.85)_0%,transparent_45%),linear-gradient(to_bottom,rgb(0_18_31/0.55)_0%,transparent_22%)]" />
        <div data-hero-dim className="absolute inset-0 bg-navy-950 opacity-0" />
        <div className="grain absolute inset-0" />

        {/* Retícula técnica: líneas verticales que se trazan en la entrada */}
        <div data-hero-grid aria-hidden="true" className="pointer-events-none absolute inset-0 will-change-transform">
          <div className="container-x relative h-full">
            {[0, 25, 50, 75, 100].map((left) => (
              <span
                key={left}
                data-hero-gridline
                className="absolute inset-y-0 w-px origin-top bg-white/[0.07]"
                style={{ left: `calc(var(--gutter) + (100% - 2 * var(--gutter)) * ${left / 100})` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div data-hero-content className="relative z-10 flex h-full flex-col justify-center pb-[22svh] pt-[var(--header-h)] will-change-transform md:pb-[19svh]">
        <div className="container-x">
          <div data-intro className="flex items-center gap-4">
            <span data-hero-kicker-line className="h-px w-10 origin-left bg-sky" />
            <p data-hero-kicker className="kicker text-sky">
              IVC Contratistas Generales · Perú
            </p>
          </div>

          <h1 id="hero-title" data-intro className="mt-6 font-display font-semibold leading-[0.92] tracking-[-0.055em] md:mt-8">
            <span className="sr-only">Construimos </span>
            <span data-hero-line1 aria-hidden="true" className="block text-[clamp(3.1rem,11vw,9.6rem)] [@media(orientation:landscape)_and_(max-height:500px)]:text-[16svh]">
              Construimos
            </span>
            <span data-hero-line2 className="hero-italic -mt-[0.04em] block pb-[0.08em] pl-[0.04em] text-[clamp(3.5rem,12.4vw,11rem)] leading-[0.95] text-sky [@media(orientation:landscape)_and_(max-height:500px)]:text-[18svh]">
              bienestar.
            </span>
          </h1>

          <div data-intro className="mt-6 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,28rem)_auto] md:items-end md:gap-14">
            <p data-hero-lead className="max-w-[28rem] text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-white/80">
              Ingeniería e infraestructura para el desarrollo del Perú. Desde 1988, proyectos para el sector público y privado.
            </p>
            <div data-hero-cta className="flex flex-wrap items-center gap-3">
              <Button href="/#proyectos">Explorar proyectos</Button>
              <Button href="/nosotros" variant="outline-light">
                Conoce IVC
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda vertical de la fotografía */}
      <div data-hero-side className="pointer-events-none absolute right-[calc(var(--gutter)*0.55)] top-1/2 z-10 hidden -translate-y-1/2 lg:block">
        <p data-intro data-hero-meta className="kicker rotate-180 whitespace-nowrap text-[10px] text-white/55 [writing-mode:vertical-rl]">
          <span className="text-white/85">01</span> &nbsp;—&nbsp; Reservorio Estadio Picasso Peratta · Ica &nbsp;·&nbsp; Propuesta visual
        </p>
      </div>
    </section>
  );
}
