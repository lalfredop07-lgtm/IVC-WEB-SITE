"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { isNavActive, mainNav, secondaryNav } from "@/data/navigation";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const nearTop = useRef(true);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Estado del header: transparente → cápsula sólida; se oculta al bajar y vuelve al subir.
  // Un único ScrollTrigger por ruta; React solo se actualiza cuando cambia el estado
  // (no en cada fotograma) y la barra de progreso se escribe directamente con quickSetter.
  useGSAP(() => {
    const setProgress = progress.current ? gsap.quickSetter(progress.current, "scaleX") : null;
    const state = { scrolled: false, hidden: false };
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const y = self.scroll();
        const scrolledNow = y > 40;
        const hiddenNow = self.direction === 1 && y > window.innerHeight * 0.9;
        if (scrolledNow !== state.scrolled) setScrolled((state.scrolled = scrolledNow));
        if (hiddenNow !== state.hidden) setHidden((state.hidden = hiddenNow));
        setProgress?.(self.progress);
        // En la Home, volver arriba limpia el indicador de sección activa.
        const top = y < window.innerHeight * 0.5;
        if (top !== nearTop.current) {
          nearTop.current = top;
          if (top) setActive(null);
        }
      },
    });
    return () => st.kill();
  }, [pathname]);

  // Sección activa (solo en la Home).
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = mainNav.map((n) => (n.section ? document.getElementById(n.section) : null)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting && window.scrollY >= window.innerHeight * 0.5) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // Al cerrar el menú (Escape, enlace o botón) el foco vuelve al botón que lo abrió.
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  }, []);

  const solid = scrolled || menuOpen;
  const current = pathname === "/" ? active : null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,padding] duration-700 ease-out-expo ${
          hidden && !menuOpen ? "-translate-y-[120%]" : "translate-y-0"
        } ${solid ? "px-[max(0.75rem,env(safe-area-inset-left),env(safe-area-inset-right))] pt-3 md:px-[max(1.25rem,env(safe-area-inset-left),env(safe-area-inset-right))]" : "px-0 pt-0"}`}
      >
        <div
          className={`relative mx-auto flex items-center justify-between overflow-hidden transition-[max-width,height,background-color,border-radius,box-shadow,padding] duration-700 ease-out-expo ${
            solid
              ? "h-[66px] max-w-[1320px] rounded-full bg-navy-950/80 px-4 shadow-[0_20px_60px_-20px_rgb(0_18_31/0.6)] backdrop-blur-xl md:px-6"
              : "h-[var(--header-h)] max-w-[1440px] rounded-none bg-transparent px-[var(--gutter)]"
          }`}
        >
          <TransitionLink href="/" aria-label="IVC Contratistas Generales — inicio" className="relative z-10 shrink-0">
            <Image
              src="/brand/logo-ivc.png"
              alt="IVC Contratistas Generales"
              width={229}
              height={101}
              preload
              className={`brand-logo transition-[width] duration-700 ease-out-expo ${solid ? "w-[104px]" : "w-[118px] md:w-[140px]"}`}
            />
          </TransitionLink>

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {[...mainNav.slice(0, -1), ...secondaryNav].map((item) => {
                const isActive = isNavActive(item, pathname, current);
                return (
                  <li key={item.href} className="relative">
                    <TransitionLink
                      href={item.href}
                      aria-current={isActive ? "location" : undefined}
                      className="group relative block whitespace-nowrap px-3 py-2 text-[13px] xl:px-4 font-medium text-white/80 transition-colors hover:text-white"
                    >
                      <span className="relative block overflow-hidden">
                        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{item.label}</span>
                        <span aria-hidden="true" className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                          {item.label}
                        </span>
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-sky xl:inset-x-4"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <TransitionLink
              href="/contacto"
              className={`group hidden min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold lg:min-h-0 transition-colors duration-300 sm:inline-flex ${
                current === "contacto" || pathname.startsWith("/contacto") ? "bg-sky text-navy" : "bg-white text-navy hover:bg-sky"
              }`}
            >
              Contacto
              <span className="size-1.5 rounded-full bg-blue transition-transform duration-500 group-hover:scale-[2.2]" />
            </TransitionLink>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="relative grid size-11 place-items-center rounded-full text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500 ease-out-expo ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] bg-current transition-all duration-500 ease-out-expo ${menuOpen ? "top-1.5 w-5 -rotate-45" : "top-3 w-3"}`} />
              </span>
            </button>
          </div>

          <div ref={progress} aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-px origin-left bg-sky/70 transition-opacity ${solid ? "opacity-100" : "opacity-0"}`} style={{ transform: "scaleX(0)" }} />
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} homeSection={current} toggle={menuButton} />
    </>
  );
}
