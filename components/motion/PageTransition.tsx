"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "./SmoothScroll";

type NavigateOptions = {
  /** Imagen de origen: se expande a pantalla completa y se funde con la portada de destino. */
  image?: HTMLImageElement | null;
};
type TransitionApi = { navigate: (href: string, opts?: NavigateOptions) => void };

/** La portada de destino emite este evento cuando su imagen está pintada. */
export const HERO_READY_EVENT = "ivc:hero-ready";
const TransitionContext = createContext<TransitionApi>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Transición entre páginas: cinco columnas cubren la pantalla, se cambia de ruta
 * y las columnas se retiran hacia arriba. Los anclajes dentro de la misma página
 * se resuelven con scroll suave, sin cortina.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const pendingHash = useRef<string | null>(null);
  const covering = useRef(false);
  const flight = useRef<HTMLDivElement | null>(null);
  const { scrollTo } = useSmoothScroll();

  const navigate = useCallback(
    (href: string, opts?: NavigateOptions) => {
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;
      if (samePage) {
        if (url.hash) {
          scrollTo(url.hash);
          history.replaceState(null, "", url.hash);
        } else {
          scrollTo(0);
        }
        return;
      }
      pendingHash.current = url.hash || null;
      if (reduceMotion() || !overlay.current) {
        router.push(url.pathname + url.hash);
        return;
      }
      // Transición "imagen que vuela": la foto de la tarjeta crece hasta ocupar la pantalla.
      const img = opts?.image;
      const src = img?.currentSrc || img?.src;
      const r = img?.getBoundingClientRect();
      if (img && src && r && r.width > 2 && r.height > 2) {
        const fly = document.createElement("div");
        fly.setAttribute("aria-hidden", "true");
        fly.style.cssText = `position:fixed;z-index:95;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;overflow:hidden;border-radius:22px;pointer-events:none;background:#00121f;will-change:transform,left,top,width,height`;
        const im = document.createElement("img");
        im.src = src;
        im.alt = "";
        im.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
        fly.appendChild(im);
        document.body.appendChild(fly);
        flight.current?.remove();
        flight.current = fly;
        gsap
          .timeline({ onComplete: () => router.push(url.pathname, { scroll: true }) })
          .to(fly, { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0, duration: 0.95, ease: "expo.inOut" })
          .fromTo(im, { scale: 1.06 }, { scale: 1, duration: 0.95, ease: "expo.inOut" }, 0);
        return;
      }
      covering.current = true;
      const cols = overlay.current.querySelectorAll("[data-pt-col]");
      gsap
        .timeline({ onComplete: () => router.push(url.pathname + url.hash, { scroll: !url.hash }) })
        .set(overlay.current, { visibility: "visible" })
        .fromTo(cols, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.7, stagger: 0.05, ease: "expo.inOut" })
        .fromTo("[data-pt-logo]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, "-=0.25");
    },
    [router, scrollTo],
  );

  // Al cambiar de ruta: retirar la imagen voladora cuando la portada esté lista.
  useEffect(() => {
    const fly = flight.current;
    if (!fly) return;
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      gsap.to(fly, { opacity: 0, duration: 0.7, ease: "power2.out", delay: 0.1, onComplete: () => fly.remove() });
      if (flight.current === fly) flight.current = null;
    };
    window.addEventListener(HERO_READY_EVENT, release, { once: true });
    const fallback = window.setTimeout(release, 1400);
    return () => {
      window.removeEventListener(HERO_READY_EVENT, release);
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  // Al cambiar de ruta: retirar la cortina, refrescar ScrollTrigger y resolver anclas.
  useEffect(() => {
    const finish = () => {
      if (pendingHash.current) {
        const hash = pendingHash.current;
        pendingHash.current = null;
        requestAnimationFrame(() => scrollTo(hash, { immediate: true }));
      }
      ScrollTrigger.refresh();
    };
    if (!covering.current || !overlay.current) {
      const id = window.setTimeout(finish, 60);
      return () => window.clearTimeout(id);
    }
    covering.current = false;
    const cols = overlay.current.querySelectorAll("[data-pt-col]");
    const tl = gsap
      .timeline({ delay: 0.15, onStart: finish })
      .to("[data-pt-logo]", { opacity: 0, y: -20, duration: 0.35, ease: "power2.in" })
      .to(cols, { scaleY: 0, transformOrigin: "50% 0%", duration: 0.8, stagger: 0.05, ease: "expo.inOut" }, "-=0.1")
      .set(overlay.current, { visibility: "hidden" });
    return () => {
      tl.kill();
    };
  }, [pathname, scrollTo]);

  const api = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div ref={overlay} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[90]">
        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} data-pt-col className="h-full flex-1 bg-navy-950" style={{ marginLeft: i ? -1 : 0, transform: "scaleY(0)" }} />
          ))}
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <div data-pt-logo className="opacity-0">
            <Image src="/brand/logo-ivc.png" alt="" width={229} height={101} className="brand-logo w-[150px]" />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Usa la transición de imagen expandida con la primera <img> visible del enlace. */
  imageTransition?: boolean;
  /** Imagen de origen alternativa para la transición (p. ej. una previsualización flotante). */
  transitionImage?: () => HTMLImageElement | null | undefined;
};

/** Enlace interno que usa la transición animada (y scroll suave para anclas). */
export function TransitionLink({ href, onClick, children, imageTransition, transitionImage, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        let image: HTMLImageElement | null | undefined = transitionImage?.();
        if (!image && imageTransition) {
          image = [...e.currentTarget.querySelectorAll("img")].find((im) => im.getBoundingClientRect().width > 2);
        }
        navigate(href, image ? { image } : undefined);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
