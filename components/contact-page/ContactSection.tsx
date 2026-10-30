"use client";

import { useRef, useState } from "react";
import { site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { IconArrowUpRight, IconInstagram, IconMail, IconPhone, IconPin } from "@/components/ui/Icons";
import { ContactForm } from "./ContactForm";

/**
 * Datos de contacto publicados + formulario en tarjeta blanca flotante
 * que se superpone a la portada (referencia 01).
 */
export function ContactSection() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-cs-card]", {
          y: 160,
          rotateX: -18,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 95%", once: true },
        });
        gsap.from("[data-cs-item]", {
          x: -40,
          opacity: 0,
          stagger: 0.09,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cs-list]", start: "top 88%", once: true },
        });
        gsap.from("[data-cs-list] [data-draw]", {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          duration: 1.4,
          stagger: 0.05,
          ease: "power2.inOut",
          scrollTrigger: { trigger: "[data-cs-list]", start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.contact.address.split(",")[0]}, ${site.contact.district}, Perú`)}`;

  return (
    <section ref={root} aria-labelledby="formulario-title" className="relative overflow-x-clip bg-paper pb-28 md:pb-40">
      <div className="container-x relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="order-last pt-4 lg:order-first lg:col-span-4 lg:pt-24">
          <p className="kicker text-navy/65">Canales corporativos publicados</p>
          <ul data-cs-list className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
            <li data-cs-item className="py-6">
              <div className="flex items-center gap-3 text-blue">
                <IconMail size={18} />
                <span className="kicker text-[10px]">Correo</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href={`mailto:${site.contact.email}`} className="inline-flex min-h-11 items-center text-xl font-semibold text-navy underline-offset-4 hover:underline lg:min-h-0">
                  {site.contact.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="relative min-h-11 overflow-hidden rounded-full px-4 text-[13px] font-medium text-navy ring-1 ring-inset ring-navy/15 transition-colors hover:bg-navy hover:text-white active:bg-navy active:text-white"
                  aria-live="polite"
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
            </li>
            <li data-cs-item className="py-6">
              <div className="flex items-center gap-3 text-blue">
                <IconPhone size={18} />
                <span className="kicker text-[10px]">Teléfonos</span>
              </div>
              <div className="mt-3 flex flex-col lg:gap-1">
                {site.contact.phones.map((ph, i) => (
                  <a key={ph} href={`tel:${site.contact.phoneHrefs[i]}`} className="inline-flex min-h-11 items-center self-start text-lg font-medium text-navy underline-offset-4 hover:underline lg:min-h-0">
                    {ph}
                  </a>
                ))}
              </div>
            </li>
            <li data-cs-item className="py-6">
              <div className="flex items-center gap-3 text-blue">
                <IconPin size={18} />
                <span className="kicker text-[10px]">Oficina</span>
              </div>
              <p className="mt-3 text-lg leading-snug text-navy">
                {site.contact.address}
                <br />
                {site.contact.district}
              </p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-blue">
                Abrir en Google Maps <IconArrowUpRight size={14} />
              </a>
            </li>
            <li data-cs-item className="py-6">
              <div className="flex items-center gap-3 text-blue">
                <IconInstagram size={18} />
                <span className="kicker text-[10px]">Instagram</span>
              </div>
              <Magnetic strength={0.2}>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-lg font-medium text-navy lg:min-h-0">
                  @ivc_contratistas <IconArrowUpRight size={14} />
                </a>
              </Magnetic>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-8">
          <div className="[perspective:1600px]">
            <div
              data-cs-card
              className="-mt-[clamp(80px,16svh,180px)] rounded-[28px] bg-white p-7 shadow-[0_50px_120px_-40px_rgb(0_27_49/0.45)] ring-1 ring-navy/5 sm:p-10 md:p-14"
            >
              <p className="kicker text-blue">Formulario de contacto</p>
              <h2 id="formulario-title" className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.08] text-navy">
                Cuéntenos sobre su consulta
              </h2>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
