"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { policies, reportingChannels, site, type PolicyGroup } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { IconArrowUpRight, IconLayers, IconScale, IconShield } from "@/components/ui/Icons";

const groups: ("Todas" | PolicyGroup)[] = ["Todas", "Gestión", "Integridad", "Personas", "Sociedad", "Seguridad digital"];

// Espacios preparados para documentación que IVC debe aportar. Sin documentos todavía.
const preparedSlots = [
  { title: "Certificados del sistema de gestión", note: "Vigencia, alcance y entidad certificadora de ISO 9001, 14001, 45001 y 37001." },
  { title: "Códigos de ética", note: "Versiones vigentes en formato descargable." },
  { title: "Informes", note: "Informes corporativos que IVC decida publicar." },
  { title: "Manuales", note: "Manuales de aplicación pública." },
];

function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

export function TransparencyBody() {
  const root = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<(typeof groups)[number]>("Todas");
  const list = useMemo(() => (group === "Todas" ? policies : policies.filter((p) => p.group === group)), [group]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Barra de escaneo que recorre la ficha legal con el scroll.
        gsap.fromTo(
          "[data-tr-scan]",
          { top: "0%" },
          { top: "100%", ease: "none", scrollTrigger: { trigger: "[data-tr-sheet]", start: "top 75%", end: "bottom 45%", scrub: 0.5 } },
        );
        // Cada fila se descubre (máscara de izquierda a derecha) cuando pasa la barra de escaneo.
        // Sin atenuar el texto: lo visible mantiene siempre su contraste completo.
        gsap.fromTo(
          "[data-tr-row]",
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.25,
            ease: "none",
            scrollTrigger: { trigger: "[data-tr-sheet]", start: "top 75%", end: "bottom 45%", scrub: 0.5 },
          },
        );
        // Canales de denuncia: se despliegan como paneles abatibles.
        gsap.from("[data-tr-channel]", {
          rotateX: -80,
          opacity: 0,
          transformOrigin: "50% 0%",
          duration: 1.4,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-tr-channels]", start: "top 80%", once: true },
        });
        gsap.from("[data-tr-slot]", {
          scale: 0.9,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-tr-slots]", start: "top 85%", once: true },
        });
        gsap.from("[data-tr-norm]", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-tr-norms]", start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const sheet = [
    ["Razón social", site.legalName],
    ["RUC", site.ruc],
    ["Domicilio", `${site.contact.address}, ${site.contact.district}`],
    ["Inicio de actividades", "Febrero de 1988"],
    ["Correo corporativo", site.contact.email],
  ];

  return (
    <div ref={root}>
      {/* 1. Información corporativa */}
      <section aria-labelledby="legal-title" className="bg-white py-28 md:py-40">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker flex items-center gap-3 text-blue">
              <span className="h-px w-8 bg-blue" /> 01 — Información corporativa
            </p>
            <SplitReveal as="h2" id="legal-title" variant="lines" className="mt-6 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.04] text-navy">
              Datos de la empresa, <span className="title-accent text-blue">a la vista.</span>
            </SplitReveal>
            <a
              href={site.officialLinks.rnp}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-blue"
            >
              Consultar constancia en el Registro Nacional de Proveedores
              <IconArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <dl data-tr-sheet className="relative divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
            <span data-tr-scan aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-10 h-12 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky/30 to-transparent" />
            {sheet.map(([k, v]) => (
              <div key={k} data-tr-row className="grid gap-1 py-6 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="text-lg font-medium text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Políticas corporativas */}
      <section aria-labelledby="biblioteca-title" className="relative bg-navy-950 py-28 text-white md:py-40">
        <div aria-hidden="true" className="blueprint-grid absolute inset-0" />
        <div className="container-x relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker flex items-center gap-3 text-sky">
                <span className="h-px w-8 bg-sky" /> 02 — Políticas corporativas
              </p>
              <SplitReveal as="h2" id="biblioteca-title" variant="words" className="mt-6 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.04]">
                Documentos <span className="title-accent text-sky">publicados.</span>
              </SplitReveal>
            </div>
            <p className="max-w-[30rem] text-[15px] leading-relaxed text-white/60">
              Enlaces a los documentos que IVC publica en su sistema documental, tal como aparecen en su sitio actual. Se abren en una pestaña nueva.
            </p>
          </div>

          <LayoutGroup id="tr-groups">
            <div role="group" aria-label="Filtrar políticas" className="-mx-[var(--gutter)] mt-12 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none]">
              <div className="flex w-max gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
                {groups.map((g) => (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={group === g}
                    onClick={() => setGroup(g)}
                    className={`relative min-h-11 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors ${group === g ? "text-navy" : "text-white/65 hover:text-white"}`}
                  >
                    {group === g && <motion.span layoutId="tr-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <span className="relative">{g}</span>
                  </button>
                ))}
              </div>
            </div>
          </LayoutGroup>

          <motion.ul layout className="mt-8 border-t border-white/10">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li
                  key={p.href}
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
                  className="border-b border-white/10"
                >
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 overflow-hidden py-6 md:grid-cols-[48px_1fr_180px_auto] md:gap-8">
                    <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-white/[0.05] transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                    <span className="relative grid size-11 place-items-center rounded-full bg-white/10 text-sky transition-colors duration-500 group-hover:bg-sky group-hover:text-navy">
                      <DocIcon />
                    </span>
                    <span className="relative font-display text-[clamp(1.05rem,1.8vw,1.5rem)] font-semibold leading-[1.2] tracking-[-0.025em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                      {p.title}
                      <span className="mt-1 block text-[12px] font-normal tracking-normal text-white/55 md:hidden">{p.group}</span>
                    </span>
                    <span className="kicker relative hidden text-[10px] text-white/55 md:block">{p.group}</span>
                    <span className="relative inline-flex items-center gap-2 text-[13px] font-semibold text-white/80">
                      <span className="hidden sm:inline">Abrir documento</span>
                      <span className="grid size-10 place-items-center rounded-full ring-1 ring-inset ring-white/20 transition-colors duration-500 group-hover:bg-white group-hover:text-navy">
                        <IconArrowUpRight size={16} />
                      </span>
                    </span>
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      {/* 3. Canales de denuncia */}
      <section id="denuncias" aria-labelledby="denuncias-title" className="scroll-mt-24 bg-paper py-28 md:py-40">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="kicker flex items-center gap-3 text-blue">
                <span className="h-px w-8 bg-blue" /> 03 — Canales de denuncia
              </p>
              <SplitReveal as="h2" id="denuncias-title" variant="chars" stagger={0.012} className="mt-6 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.04] text-navy">
                Canales seguros e independientes.
              </SplitReveal>
            </div>
            <p className="text-[15px] leading-relaxed text-muted lg:col-span-5">
              Las denuncias se presentan a través de los formularios oficiales de IVC. No utilice el formulario de contacto comercial para comunicar
              denuncias.
            </p>
          </div>
          <ul data-tr-channels className="mt-14 grid gap-5 [perspective:1600px] md:grid-cols-2">
            {reportingChannels.map((c, i) => (
              <li key={c.href} data-tr-channel>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[26px] bg-navy p-8 text-white shadow-[0_40px_90px_-40px_rgb(0_27_49/0.7)] md:p-10"
                >
                  <span aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-blue/40 blur-3xl transition-transform duration-1000 ease-out-expo group-hover:scale-150" />
                  <div className="relative flex items-start justify-between">
                    <span className="grid size-16 place-items-center rounded-full bg-white text-navy transition-transform duration-700 ease-out-expo group-hover:rotate-[-10deg] group-hover:scale-110">
                      {i === 0 ? <IconScale size={28} /> : <IconShield size={28} />}
                    </span>
                    <span className="kicker text-white/55">0{i + 1}</span>
                  </div>
                  <div className="relative">
                    <h3 className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-semibold leading-[1.1]">{c.title}</h3>
                    <p className="mt-3 max-w-[30rem] text-white/70">{c.text}</p>
                    <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-navy transition-colors duration-500 group-hover:bg-sky">
                      Ir al formulario oficial <IconArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                  </div>
                  <span className="sr-only">(se abre en el sitio oficial de IVC, en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Normatividad y documentación por incorporar */}
      <section aria-labelledby="normatividad-title" className="bg-white py-28 md:py-40">
        <div className="container-x">
          <p className="kicker flex items-center gap-3 text-blue">
            <span className="h-px w-8 bg-blue" /> 04 — Normatividad
          </p>
          <SplitReveal as="h2" id="normatividad-title" variant="lines" className="mt-6 max-w-[20ch] text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.04] text-navy">
            Más información en el sitio actual de IVC
          </SplitReveal>

          <ul data-tr-norms className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Códigos de ética", href: site.officialLinks.ethics, Icon: IconScale },
              { label: "Manuales", href: site.officialLinks.manuals, Icon: IconLayers },
              { label: "Informes", href: site.officialLinks.reports, Icon: IconLayers },
              { label: "Certificaciones", href: site.officialLinks.certifications, Icon: IconShield },
              { label: "Política de privacidad", href: site.officialLinks.privacy, Icon: IconShield },
            ].map(({ label, href, Icon }) => (
              <li key={label} data-tr-norm>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-center justify-between gap-4 rounded-[20px] bg-paper p-6 transition-colors duration-500 hover:bg-navy hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={20} className="text-blue transition-colors group-hover:text-sky" />
                    <span className="font-semibold text-navy transition-colors group-hover:text-white">{label}</span>
                  </span>
                  <IconArrowUpRight size={16} className="shrink-0 text-navy transition-all duration-500 group-hover:rotate-45 group-hover:text-white" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-24">
            <h3 className="kicker text-navy/65">Biblioteca documental · espacio preparado</h3>
            <p className="mt-3 max-w-[40rem] text-[15px] leading-relaxed text-muted">
              Estructura lista para alojar en esta web la documentación que IVC aporte y apruebe. Por ahora no hay documentos publicados en estos
              apartados.
            </p>
            <ul data-tr-slots className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {preparedSlots.map((s) => (
                <li key={s.title} data-tr-slot className="flex min-h-[180px] flex-col justify-between rounded-[20px] border border-dashed border-navy/20 p-6">
                  <div>
                    <p className="font-semibold text-navy">{s.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.note}</p>
                  </div>
                  <p className="kicker mt-6 text-[10px] text-navy/65">Pendiente de incorporación</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
