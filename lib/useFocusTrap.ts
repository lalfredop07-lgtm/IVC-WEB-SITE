"use client";

import { useEffect } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mantiene el foco del teclado dentro de un diálogo mientras está abierto (Tab y Mayús+Tab
 * dan la vuelta). `extra` permite incluir controles externos que también lo gobiernan,
 * como el botón del header que abre y cierra el menú móvil.
 */
export function useFocusTrap(
  container: React.RefObject<HTMLElement | null>,
  active: boolean,
  extra?: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !container.current) return;
      const items = [extra?.current, ...container.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el): el is HTMLElement => !!el && el.tabIndex >= 0 && el.getClientRects().length > 0,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      const inside = !!current && items.includes(current);
      if (e.shiftKey && (current === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, container, extra]);
}
