"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isNavActive, mainNav, secondaryNav } from "@/data/navigation";
import { TransitionLink } from "@/components/motion/PageTransition";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { IconArrowUpRight } from "@/components/ui/Icons";
import { useFocusTrap } from "@/lib/useFocusTrap";

const ease = [0.76, 0, 0.24, 1] as const;

// Menú móvil: «Trabaja con nosotros» es la opción 06 y «Contacto» el botón blanco.
const contactItem = mainNav[mainNav.length - 1];
const menuItems = [...mainNav.slice(0, -1), ...secondaryNav];

const panel: Variants = {
  closed: { clipPath: "circle(0% at calc(100% - 44px) 44px)", transition: { duration: 0.7, ease } },
  open: { clipPath: "circle(150% at calc(100% - 44px) 44px)", transition: { duration: 0.9, ease } },
};

const list: Variants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const item: Variants = {
  closed: { y: "110%", rotate: 4 },
  open: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const fade: Variants = {
  closed: { opacity: 0, y: 16 },
  open: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.55 } },
};

type Props = {
  open: boolean;
  onClose: () => void;
  homeSection: string | null;
  /** Botón del header que abre/cierra el menú: forma parte del ciclo de foco. */
  toggle: React.RefObject<HTMLButtonElement | null>;
};

/** Menú móvil a pantalla completa: se abre como un círculo desde el botón. */
export function MobileMenu({ open, onClose, homeSection, toggle }: Props) {
  const pathname = usePathname();
  const { stop, start } = useSmoothScroll();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, toggle);

  useEffect(() => {
    if (!open) return;
    stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      start();
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, stop, start]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          variants={panel}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-x-0 top-0 z-40 flex h-[100dvh] min-h-[100svh] flex-col overflow-y-auto overscroll-contain bg-navy-950 px-[var(--gutter)] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24 text-white lg:hidden"
        >
          <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
          <motion.ul variants={list} className="relative flex flex-col gap-2 max-lg:mt-auto">
            {menuItems.map((n, i) => (
              <li key={n.href} className="overflow-hidden">
                <motion.div variants={item} className="origin-left">
                  <TransitionLink
                    ref={i === 0 ? firstLink : undefined}
                    href={n.href}
                    onClick={onClose}
                    aria-current={isNavActive(n, pathname, homeSection) ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-2.5"
                  >
                    <span className="kicker w-6 text-sky/70">0{i + 1}</span>
                    <span
                      className={`font-display text-[clamp(2rem,9vw,3.3rem)] font-semibold leading-none tracking-[-0.04em] transition-colors ${
                        isNavActive(n, pathname, homeSection) ? "text-sky" : "text-white"
                      } group-active:text-sky`}
                    >
                      {n.label}
                    </span>
                  </TransitionLink>
                </motion.div>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fade} className="relative mb-auto mt-10">
            <TransitionLink
              href={contactItem.href}
              onClick={onClose}
              aria-current={isNavActive(contactItem, pathname, homeSection) ? "page" : undefined}
              className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-colors ${
                isNavActive(contactItem, pathname, homeSection) ? "bg-sky text-navy" : "bg-white text-navy active:bg-sky"
              }`}
            >
              {contactItem.label}
              <IconArrowUpRight size={15} />
            </TransitionLink>
          </motion.div>

          {/* Cierre para lectores de pantalla (con aria-modal el botón del header queda fuera del diálogo). */}
          <button type="button" onClick={onClose} className="sr-only focus:not-sr-only focus:mt-6 focus:self-start focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-navy">
            Cerrar menú
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
