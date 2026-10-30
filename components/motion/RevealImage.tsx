"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Direction = "up" | "down" | "left" | "right" | "center";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Dirección de la cortina de revelado (clip-path). */
  reveal?: Direction | false;
  /** Intensidad del parallax interno (0 = sin parallax). */
  parallax?: number;
  preload?: boolean;
  children?: React.ReactNode;
};

const clipFrom: Record<Direction, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
  center: "inset(18% 18% 18% 18%)",
};

/**
 * Fotografía con revelado por máscara + desescalado y parallax interno ligado al scroll.
 * Todo con transform/clip-path (acelerado por GPU).
 */
export function RevealImage({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  reveal = "up",
  parallax = 12,
  preload,
  children,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const inner = root.current!.querySelector("[data-inner]");
        if (reveal) {
          gsap.fromTo(
            root.current,
            { clipPath: clipFrom[reveal] },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              ease: "expo.inOut",
              scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
            },
          );
          gsap.from(root.current!.querySelector("[data-zoom]"), {
            scale: 1.35,
            duration: 1.9,
            ease: "expo.out",
            scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
          });
        }
        if (parallax && inner) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax / 2 },
            {
              yPercent: parallax / 2,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      <div data-zoom className="absolute inset-0 will-change-transform">
        <div data-inner className="absolute inset-x-0 will-change-transform" style={{ top: `-${parallax / 2}%`, bottom: `-${parallax / 2}%` }}>
          <Image src={src} alt={alt} fill sizes={sizes} quality={80} preload={preload} className={`object-cover ${imgClassName}`} />
        </div>
      </div>
      {children}
    </div>
  );
}
