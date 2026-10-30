"use client";

import Image from "next/image";
import { useRef } from "react";
import { mainNav, secondaryNav } from "@/data/navigation";
import { site } from "@/data/site";
import { specialties } from "@/data/specialties";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/PageTransition";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { IconArrowUpRight } from "@/components/ui/Icons";

/** `review`: muestra la leyenda de versión de revisión (se oculta sola al activar la indexación). */
export function Footer({ review = true }: { review?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();

  // El contenido del pie emerge desde abajo con un ligero desfase (efecto de cortina).
  // Solo desplazamiento: sin atenuar el texto, que debe mantener su contraste en todo momento.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-footer-inner]", {
          yPercent: -25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 35%", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-white/10 bg-navy-950 text-white">
      <div data-footer-inner className="container-x relative pb-10 pt-20 md:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-14 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Image src="/brand/logo-ivc.png" alt="IVC Contratistas Generales" width={229} height={101} className="brand-logo w-[170px]" />
            <p className="title-accent mt-6 text-3xl text-sky">{site.slogan}</p>
            <p className="mt-4 max-w-[22rem] text-sm leading-relaxed text-white/55">
              Ingeniería e infraestructura para el sector público y privado en el Perú desde 1988.
            </p>
          </div>

          <nav aria-label="Especialidades" className="lg:col-span-3">
            <p className="kicker text-white/55">Especialidades</p>
            <ul className="mt-3 text-[15px] lg:mt-5 lg:space-y-3">
              {specialties.map((s) => (
                <li key={s.slug}>
                  <TransitionLink href={`/especialidades/${s.slug}`} className="group inline-flex min-h-11 items-center gap-2 py-1 leading-snug text-white/75 transition-colors hover:text-white active:text-white lg:min-h-6 lg:py-0.5">
                    <span className="h-px w-0 bg-sky transition-all duration-500 ease-out-expo group-hover:w-4" />
                    {s.shortName}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navegación del pie" className="lg:col-span-2">
            <p className="kicker text-white/55">IVC</p>
            <ul className="mt-3 text-[15px] lg:mt-5 lg:space-y-3">
              {[...mainNav, ...secondaryNav].map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href} className="group inline-flex min-h-11 items-center gap-2 py-1 leading-snug text-white/75 transition-colors hover:text-white active:text-white lg:min-h-6 lg:py-0.5">
                    <span className="h-px w-0 bg-sky transition-all duration-500 ease-out-expo group-hover:w-4" />
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-3">
            <p className="kicker text-white/55">Contacto</p>
            <address className="mt-3 text-[15px] not-italic text-white/75 lg:mt-5 lg:space-y-3">
              <a href={`mailto:${site.contact.email}`} className="flex min-h-11 items-center transition-colors hover:text-white active:text-white lg:block lg:min-h-0 lg:py-0.5">
                {site.contact.email}
              </a>
              {site.contact.phones.map((ph, i) => (
                <a key={ph} href={`tel:${site.contact.phoneHrefs[i]}`} className="flex min-h-11 items-center transition-colors hover:text-white active:text-white lg:block lg:min-h-0 lg:py-0.5">
                  {ph}
                </a>
              ))}
              <p className="mt-2 text-white/55 lg:mt-0">
                {site.contact.address}
                <br />
                {site.contact.district}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6 lg:mt-16 lg:pt-8">
          <ul className="flex flex-wrap gap-x-6 text-[13px] text-white/60 lg:gap-y-2">
            <li>
              <TransitionLink href="/transparencia" className="inline-flex min-h-11 items-center transition-colors hover:text-white lg:min-h-6">
                Transparencia y denuncias
              </TransitionLink>
            </li>
            {[
              ["Política de privacidad", site.officialLinks.privacy],
              ["Sitio actual de IVC", site.officialLinks.site],
              ["Instagram", site.social.instagram],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 transition-colors hover:text-white lg:min-h-6">
                  {label}
                  <IconArrowUpRight size={12} />
                </a>
              </li>
            ))}
          </ul>
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="group grid size-14 place-items-center rounded-full ring-1 ring-inset ring-white/20 transition-colors hover:bg-white hover:text-navy"
              aria-label="Volver arriba"
            >
              <IconArrowUpRight size={18} className="-rotate-45 transition-transform duration-500 group-hover:-translate-y-1" />
            </button>
          </Magnetic>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-[12px] text-white/55 md:flex-row md:justify-between">
          <p suppressHydrationWarning>
            © {year} {site.legalName} · RUC {site.ruc}
          </p>
          {review && <p>Versión de diseño para revisión · Contenido sujeto a validación de IVC</p>}
        </div>
      </div>
    </footer>
  );
}
