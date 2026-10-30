import { InteriorHero } from "@/components/interior/InteriorHero";
import { Counter } from "@/components/motion/Counter";
import { projects, regionsCount } from "@/data/projects";
import { specialties } from "@/data/specialties";
import { SpecialtyIndex } from "@/components/specialty/SpecialtyIndex";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Especialidades de ingeniería y construcción",
  description:
    "Las cinco líneas de negocio de IVC Contratistas Generales: obras hidráulicas y saneamiento, habilitaciones urbanas, edificaciones, energía y transporte.",
  path: "/especialidades",
  image: { url: "/projects/enhanced/03-riego-la-achirana-ica.webp", width: 1654, height: 951, alt: "Compuertas del Sistema de Riego La Achirana, Ica" },
});

// Color y nombre corto de cada especialidad en el gráfico de reparto (datos reales de data/projects.ts).
const shortName: Record<string, string> = { hidraulica: "Hidráulica", urbanismo: "Urbanismo", edificaciones: "Edificaciones", energia: "Energía", transporte: "Transporte" };
const barColor = ["bg-sky", "bg-blue-400", "bg-white", "bg-blue", "bg-navy-700"];
const share = specialties.map((s) => ({ slug: s.slug, n: projects.filter((p) => p.category === s.slug).length }));

export default function EspecialidadesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Especialidades", path: "/especialidades" }]))} />
      <InteriorHero
        title="Nuestras"
        accent="especialidades."
        image="/projects/enhanced/03-riego-la-achirana-ica.webp"
        imageAlt="Compuertas del Sistema de Riego La Achirana entre campos de cultivo, Ica"
        caption="Sistema de Riego La Achirana · Ica · Propuesta visual"
        reveal="column"
      >
        <div className="w-full max-w-[46rem] max-md:mx-auto">
          <ul className="flex flex-wrap gap-x-12 gap-y-6 border-t border-white/15 pt-7 max-md:grid max-md:grid-cols-3 max-md:gap-x-3">
            {[
              { v: specialties.length, l: "líneas de negocio" },
              { v: projects.length, l: "fichas en el banco fotográfico" },
              { v: regionsCount, l: "regiones identificadas" },
            ].map((x) => (
              <li key={x.l} className="flex items-baseline gap-3 max-md:flex-col max-md:items-center max-md:gap-2">
                <Counter value={x.v} pad={2} className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl" />
                <span className="max-w-[12ch] text-sm leading-tight text-white/60 max-md:text-[13px]">{x.l}</span>
              </li>
            ))}
          </ul>
          <div role="img" aria-label={`Reparto de las ${projects.length} fichas por especialidad: ${share.map((x) => `${shortName[x.slug]} ${x.n}`).join(", ")}`} className="mt-8">
            <div className="flex h-2.5 gap-1 overflow-hidden rounded-full">
              {share.map((x, i) => (
                <span key={x.slug} className={`${barColor[i]} rounded-full`} style={{ flexGrow: x.n, flexBasis: 0 }} />
              ))}
            </div>
            <ul aria-hidden="true" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/70 max-md:justify-center">
              {share.map((x, i) => (
                <li key={x.slug} className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${barColor[i]}`} />
                  {shortName[x.slug]} · {x.n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </InteriorHero>
      <SpecialtyIndex />
    </>
  );
}
