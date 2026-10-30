"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { IconArrowUpRight, IconInstagram, IconMail, IconPhone, IconPin } from "@/components/ui/Icons";

const BADGE_TEXT = "¡Construimos Bienestar! · IVC Contratistas Generales · ";

/**
 * Llamada final a la acción orientada a reclutamiento (bolsa de trabajo y
 * candidaturas). Fotografía de fondo que se "abre" con el scroll, titular
 * carácter a carácter, sello circular que gira con el desplazamiento y datos
 * corporativos publicados (sin formularios hasta validar destinatario).
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-contact-bg]",
          { scale: 1.25, yPercent: -8 },
          { scale: 1, yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.to("[data-badge-ring]", {
          rotate: 360,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
        gsap.from("[data-contact-item]", {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-contact-list]", start: "top 90%", once: true },
        });
        gsap.from("[data-contact-rule]", {
          scaleX: 0,
          stagger: 0.1,
          duration: 1.3,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-contact-list]", start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const items = [
    { Icon: IconMail, label: "Correo", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { Icon: IconPhone, label: "Teléfonos", value: site.contact.phones.join("  ·  "), href: `tel:${site.contact.phoneHrefs[0]}` },
    { Icon: IconPin, label: "Oficina", value: `${site.contact.address}, ${site.contact.district}`, href: null },
    { Icon: IconInstagram, label: "Instagram", value: "@ivc_contratistas", href: site.social.instagram },
  ];

  return (
    <section ref={root} id="contacto" aria-labelledby="contacto-title" className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div data-contact-bg className="absolute inset-0 will-change-transform">
          <Image src="/projects/enhanced/16-linea-conduccion-sjl.webp" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#00121f_0%,rgb(0_18_31/0.75)_40%,#00121f_100%)]" />
      </div>

      <div className="container-x relative py-28 md:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-end">
          <div className="order-1 lg:col-span-8">
            <p className="kicker flex items-center gap-3 text-sky">
              <span className="h-px w-8 bg-sky" /> 05 — Trabaja con nosotros
            </p>
            <SplitReveal as="h2" id="contacto-title" variant="chars" stagger={0.015} className="mt-6 text-[clamp(2.8rem,7.4vw,7rem)] font-semibold leading-[0.95]">
              Construye tu futuro
            </SplitReveal>
            <SplitReveal as="p" variant="lines" delay={0.3} className="title-accent text-[clamp(2.8rem,7.4vw,7rem)] leading-[0.95] text-sky">
              con nosotros.
            </SplitReveal>
            <SplitReveal as="p" variant="lines" delay={0.45} className="mt-8 max-w-[34rem] text-[17px] leading-relaxed text-white/75">
              Forma parte de un equipo comprometido con la ingeniería, la construcción y el desarrollo del Perú. Descubre nuestras oportunidades
              laborales y da el siguiente paso en tu carrera profesional.
            </SplitReveal>
          </div>

          <div className="order-3 flex lg:order-2 lg:col-span-4 lg:justify-end">
            <Magnetic strength={0.3}>
              <a
                href={`mailto:${site.contact.email}`}
                className="group relative grid size-40 place-items-center rounded-full md:size-48"
                aria-label={`¡Construimos Bienestar! IVC Contratistas Generales: escribir a ${site.contact.email}`}
              >
                <svg data-badge-ring viewBox="0 0 200 200" className="absolute inset-0 size-full will-change-transform" aria-hidden="true">
                  <defs>
                    <path id="badge-circle" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                  </defs>
                  <text className="fill-white/70 font-display text-[12.5px] font-semibold uppercase tracking-[0.2em]">
                    <textPath href="#badge-circle">{BADGE_TEXT}</textPath>
                  </text>
                </svg>
                <span className="grid size-20 place-items-center rounded-full bg-white text-navy transition-transform duration-700 ease-out-expo group-hover:scale-125 md:size-24">
                  <IconArrowUpRight size={28} className="transition-transform duration-700 ease-out-expo group-hover:rotate-45" />
                </span>
              </a>
            </Magnetic>
          </div>

          <div className="order-2 -mt-6 flex flex-wrap gap-3 lg:order-3 lg:col-span-12 lg:-mt-4">
            <Button href="/trabaja-con-nosotros">Ver bolsa de trabajo</Button>
            <Button href="/trabaja-con-nosotros#postular" variant="outline-light">
              Trabaja con nosotros
            </Button>
          </div>
        </div>

        <ul data-contact-list className="mt-20 grid gap-x-10 md:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, label, value, href }) => {
            const content = (
              <>
                <span data-contact-rule className="absolute inset-x-0 top-0 h-px origin-left bg-white/20" />
                <span className="flex items-center gap-3 text-white/55">
                  <Icon size={18} />
                  <span className="kicker text-[10px]">{label}</span>
                </span>
                <span className="mt-4 block text-[17px] leading-snug text-white transition-colors group-hover:text-sky">{value}</span>
              </>
            );
            return (
              <li key={label} data-contact-item className="relative">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group relative block py-7"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group relative py-7">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
