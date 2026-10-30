import type { SpecialtySlug } from "./specialties";

// Ofertas laborales publicadas en esta web.
// Solo deben añadirse vacantes confirmadas por IVC (con fecha de publicación y vigencia).
// La bolsa del sitio actual (ivccontratistas.pe/bolsaivc) lista puestos sin fecha:
// no se migran hasta que IVC confirme cuáles siguen vigentes.

export type WorkMode = "Presencial en obra" | "Presencial en oficina" | "Mixta (obra y oficina)";

export type Job = {
  slug: string;
  title: string;
  location: string;
  specialty: SpecialtySlug | "corporativo";
  mode: WorkMode;
  summary: string;
  description: string[];
  requirements: string[];
  /** ISO yyyy-mm-dd */
  publishedAt: string;
  closesAt: string | null;
  /** true solo cuando IVC ha aprobado la publicación. */
  validado: boolean;
  /** Marca interna para los ejemplos de diseño (nunca se publican). */
  ejemplo?: true;
};

export const jobs: Job[] = [];

/** Únicas vacantes visibles en la web, el sitemap y las fichas: las aprobadas por IVC. */
export const publishedJobs = jobs.filter((j) => j.validado && !j.ejemplo);
export const publishedJobBySlug = (slug: string) => publishedJobs.find((j) => j.slug === slug);

/** Fecha ISO (yyyy-mm-dd) en formato largo peruano, sin desfases de zona horaria. */
export const formatJobDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });

export const BOLSA_IVC_URL = "https://www.ivccontratistas.pe/bolsaivc/";

export const jobSpecialtyLabel = (s: Job["specialty"]) =>
  s === "corporativo"
    ? "Áreas corporativas"
    : {
        hidraulica: "Hidráulica y saneamiento",
        urbanismo: "Habilitaciones urbanas",
        edificaciones: "Edificaciones",
        energia: "Energía",
        transporte: "Transporte",
      }[s];

/** Áreas profesionales del formulario (propuesta para validar con IVC). */
export const PROFESSIONAL_AREAS = [
  "Ingeniería civil",
  "Ingeniería sanitaria e hidráulica",
  "Ingeniería mecánica y eléctrica",
  "Arquitectura",
  "Seguridad y salud en el trabajo",
  "Medio ambiente",
  "Calidad",
  "Topografía y suelos",
  "Administración de obra",
  "Administración, finanzas y logística",
  "Técnicos y operarios de obra",
  "Otra",
] as const;
