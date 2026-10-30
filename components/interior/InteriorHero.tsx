"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/components/motion/IntroProvider";

export type HeroReveal =
  "slats" | "iris" | "wipe" | "window" | "doors" | "column";

type Props = {
  kicker?: string;
  /** Sin título, el texto de `lead` pasa a ser el titular principal (h1) de la portada. */
  title?: string;
  accent?: string;
  lead?: string;
  image: string;
  imageAlt: string;
  caption?: string;
  /** Estilo de revelado de la fotografía: cada página interior usa uno distinto. */
  reveal?: HeroReveal;
  titleSplit?: "chars" | "words";
  objectPosition?: string;
  /** Espacio inferior extra cuando una tarjeta flotante se superpone a la portada. */
  overlap?: boolean;
  /** Capa decorativa adicional (p. ej. un collage fotográfico) con su propia animación. */
  decor?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * Portada de página interior con el lenguaje del hero de la Home:
 * fotografía protagonista, velos azules, retícula técnica, titular editorial
 * y recogida del marco al hacer scroll. Cuatro revelados posibles:
 *  - slats:  cinco lamas azules (una por especialidad) suben y descubren la foto.
 *  - iris:   la foto se abre como un diafragma circular.
 *  - wipe:   barrido diagonal de izquierda a derecha.
 *  - window: una ventana pequeña crece hasta ocupar la pantalla.
 *  - doors:  una franja horizontal se abre como dos compuertas.
 *  - column: una columna vertical central se ensancha hasta cubrir la pantalla.
 */
export function InteriorHero({
  kicker,
  title,
  accent,
  lead,
  image,
  imageAlt,
  caption,
  reveal = "slats",
  titleSplit = "words",
  objectPosition = "center",
  overlap = false,
  decor,
  children,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  // Móvil: el titular ocupa todo el ancho útil; la palabra más larga (en em aproximados
  // de Montserrat semibold / light) fija el divisor para que ninguna se salga de pantalla.
  const longest = (text: string | undefined, em: number) =>
    Math.max(0, ...(text ?? "").split(/\s+/).map((w) => w.length * em));
  const fit = Math.max(7.6, longest(title, 0.62), longest(accent, 0.47));

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
        gsap.set("[data-ih-slat]", { yPercent: -100 });
      });
      mm.add(MQ.motion, () => {
        gsap.set("[data-intro]", { visibility: "visible" });
        const t = title
          ? SplitText.create("[data-ih-title]", {
              type: titleSplit === "chars" ? "words,chars" : "words",
              mask: "words",
              aria: "none",
            })
          : null;
        // Con interlineado 0,95 la máscara recortaría los descendentes (g, p, y).
        if (t)
          gsap.set(t.masks, {
            paddingBottom: "0.12em",
            marginBottom: "-0.12em",
          });
        const l = lead
          ? SplitText.create("[data-ih-lead]", {
              type: "lines",
              mask: "lines",
              aria: "none",
            })
          : null;
        if (l && !title)
          gsap.set(l.masks, {
            paddingBottom: "0.12em",
            marginBottom: "-0.12em",
          });
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          delay: 0.25,
        });

        if (reveal === "slats") {
          tl.to(
            "[data-ih-slat]",
            {
              yPercent: -100,
              duration: 1.3,
              stagger: 0.08,
              ease: "expo.inOut",
            },
            0,
          );
        } else {
          gsap.set("[data-ih-slat]", { yPercent: -100 });
          const from =
            reveal === "iris"
              ? "circle(0% at 68% 55%)"
              : reveal === "wipe"
                ? "polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)"
                : reveal === "doors"
                  ? "inset(50% 0% 50% 0%)"
                  : reveal === "column"
                    ? "inset(0% 47% 0% 47%)"
                    : "inset(32% 34% 32% 34% round 28px)";
          const to =
            reveal === "iris"
              ? "circle(150% at 68% 55%)"
              : reveal === "wipe"
                ? "polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)"
                : reveal === "doors" || reveal === "column"
                  ? "inset(0% 0% 0% 0%)"
                  : "inset(0% 0% 0% 0% round 0px)";
          tl.fromTo(
            "[data-ih-reveal]",
            { clipPath: from },
            { clipPath: to, duration: 1.7, ease: "expo.inOut" },
            0,
          );
        }
        tl.from("[data-ih-img]", { scale: 1.35, duration: 2.4 }, 0)
          .from(
            "[data-ih-line]",
            { scaleY: 0, duration: 1.6, stagger: 0.1, ease: "expo.inOut" },
            0.2,
          )
          .from("[data-ih-kicker-line]", { scaleX: 0, duration: 1 }, 0.6)
          .from("[data-ih-kicker]", { x: -20, opacity: 0, duration: 1 }, 0.65)
          .fromTo(
            "[data-ih-accent]",
            { clipPath: "inset(0% 100% -20% 0%)" },
            {
              clipPath: "inset(0% 0% -20% 0%)",
              duration: 1.5,
              ease: "expo.inOut",
            },
            1,
          );
        if (t)
          tl.from(
            titleSplit === "chars" ? t.chars : t.words,
            {
              yPercent: 115,
              rotate: 6,
              duration: 1.3,
              stagger: titleSplit === "chars" ? 0.025 : 0.07,
            },
            0.7,
          );
        if (l)
          tl.from(
            l.lines,
            { yPercent: 105, duration: 1.1, stagger: 0.08 },
            title ? 1.15 : 0.7,
          );
        if (children)
          tl.from(
            "[data-ih-extra]",
            { y: 30, opacity: 0, duration: 1, stagger: 0.08 },
            1.3,
          );
        if (caption)
          tl.from("[data-ih-caption]", { opacity: 0, duration: 1 }, 1.4);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          })
          .to("[data-ih-media]", { yPercent: 18, scale: 1.08 }, 0)
          .to(
            "[data-ih-content]",
            { yPercent: -22, opacity: 0, ease: "power1.in" },
            0,
          )
          .to("[data-ih-dim]", { opacity: 0.7 }, 0)
          .fromTo(
            "[data-ih-frame]",
            { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" },
            { clipPath: "inset(0% 2.5% 0% 2.5% round 0px 0px 44px 44px)" },
            0,
          );
        return () => {
          t?.revert();
          l?.revert();
        };
      });
      mm.add(MQ.finePointer, () => {
        const xTo = gsap.quickTo("[data-ih-mouse]", "x", {
          duration: 1.4,
          ease: "power3",
        });
        const yTo = gsap.quickTo("[data-ih-mouse]", "y", {
          duration: 1.4,
          ease: "power3",
        });
        const cx = gsap.quickTo("[data-ih-content]", "x", {
          duration: 1.4,
          ease: "power3",
        });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * -30);
          yTo(ny * -18);
          cx(nx * 12);
        };
        const el = root.current!;
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      className="relative h-[100svh] min-h-[620px] bg-white text-white md:min-h-[700px] [@media(orientation:landscape)_and_(max-height:500px)]:h-auto [@media(orientation:landscape)_and_(max-height:500px)]:min-h-[100svh]"
    >
      <div
        data-ih-frame
        className="absolute inset-0 overflow-hidden bg-navy-950"
      >
        <div data-ih-reveal className="absolute inset-0">
          <div data-ih-media className="absolute inset-0 will-change-transform">
            <div
              data-ih-mouse
              className="absolute -inset-[4%] will-change-transform"
            >
              <div
                data-ih-img
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  quality={80}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition }}
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(0_18_31/0.92)_0%,rgb(0_40_74/0.7)_40%,rgb(0_40_74/0.15)_75%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_18_31/0.85)_0%,transparent_50%),linear-gradient(to_bottom,rgb(0_18_31/0.6)_0%,transparent_25%)]" />
          {/* Móvil: el texto va centrado, así que se refuerza el velo en todo el ancho. */}
          <div className="absolute inset-0 bg-navy-950/35 md:hidden" />
          <div data-ih-dim className="absolute inset-0 bg-navy-950 opacity-0" />
          <div className="grain absolute inset-0" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="container-x relative h-full">
            {[0, 25, 50, 75, 100].map((left) => (
              <span
                key={left}
                data-ih-line
                className="absolute inset-y-0 w-px origin-top bg-white/[0.07]"
                style={{
                  left: `calc(var(--gutter) + (100% - 2 * var(--gutter)) * ${left / 100})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Lamas (variante slats) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden [.js_&]:flex"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              data-ih-slat
              className="h-full flex-1 bg-navy-950"
              style={{ marginLeft: i ? -1 : 0 }}
            />
          ))}
        </div>
      </div>

      <div
        data-ih-content
        className={`relative z-10 flex h-full flex-col justify-end pt-[calc(var(--header-h)+24px)] will-change-transform max-md:justify-center ${
          overlap
            ? "pb-[clamp(120px,22svh,240px)]"
            : "pb-[clamp(56px,10svh,120px)]"
        }`}
        style={{ "--ih-fit": fit } as React.CSSProperties}
      >
        <div className="container-x max-md:text-center">
          {kicker && (
            <div
              data-intro
              className="flex items-center gap-4 max-md:justify-center"
            >
              <span
                data-ih-kicker-line
                className="h-px w-10 origin-left bg-sky max-md:w-6"
              />
              <p data-ih-kicker className="kicker text-sky">
                {kicker}
              </p>
              <span
                data-ih-kicker-line
                className="h-px w-6 origin-right bg-sky md:hidden"
              />
            </div>
          )}
          {!title && lead && (
            <h1
              data-intro
              data-ih-lead
              className="max-w-[24ch] text-[clamp(2.1rem,5.4vw,5.2rem)] font-semibold leading-[1.04] tracking-[-0.045em] max-md:mx-auto md:max-w-[1000px]"
            >
              {lead}
            </h1>
          )}
          {title && (
            <h1
              data-intro
              className="mt-6 max-w-[1100px] font-semibold xl:max-w-[1280px] leading-[0.95] tracking-[-0.05em]"
            >
              <span className="sr-only">{title} </span>
              <span
                data-ih-title
                aria-hidden="true"
                className="block text-[clamp(2.15rem,7.6vw,7.4rem)] max-md:text-[length:min(calc((100vw-2*var(--gutter))/var(--ih-fit)),3.6rem)] [@media(orientation:landscape)_and_(max-height:500px)]:text-[12svh]"
              >
                {title}
              </span>
              {accent && (
                <span
                  data-ih-accent
                  className="title-accent block pb-[0.08em] text-[clamp(2.05rem,7.6vw,7.4rem)] leading-[1] text-sky max-md:text-[length:min(calc((100vw-2*var(--gutter))/var(--ih-fit)),3.6rem)] [@media(orientation:landscape)_and_(max-height:500px)]:text-[12svh]"
                >
                  {accent}
                </span>
              )}
            </h1>
          )}
          {title && lead && (
            <p
              data-intro
              data-ih-lead
              className="mt-7 max-w-[36rem] text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-white/80 max-md:mx-auto"
            >
              {lead}
            </p>
          )}
          {children && (
            <div
              data-intro
              data-ih-extra
              className="mt-10 max-md:flex max-md:justify-center"
            >
              {children}
            </div>
          )}
        </div>
      </div>

      {decor}

      {caption && (
        <p
          data-intro
          data-ih-caption
          className="kicker absolute bottom-8 right-[var(--gutter)] z-10 hidden text-[10px] text-white/55 md:block"
        >
          {caption}
        </p>
      )}
    </section>
  );
}
