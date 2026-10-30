import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/motion/PageTransition";

// Next añade noindex automáticamente a las respuestas 404.
export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página solicitada no existe en la web de IVC Contratistas Generales.",
};

const shortcuts = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/especialidades", label: "Especialidades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-navy-950 px-[var(--gutter)] py-32 text-center text-white">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
      <div className="relative">
        <p className="kicker text-sky">Error 404</p>
        <h1 className="mt-6 text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-none">
          Esta página <span className="title-accent text-sky">no existe.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[30rem] text-white/75">La dirección no es correcta o la página se ha movido. Puede continuar desde aquí:</p>
        <div className="mt-10">
          <Button href="/">Volver al inicio</Button>
        </div>
        <nav aria-label="Accesos principales" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-2">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <TransitionLink
                  href={s.href}
                  className="inline-flex min-h-11 items-center rounded-full px-5 text-[13px] font-medium text-white/85 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white hover:text-navy"
                >
                  {s.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
