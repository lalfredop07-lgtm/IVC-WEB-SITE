import type { SpecialtySlug } from "./specialties";

// Banco de 20 fotografías publicadas por IVC (documentacion/MAPA-DE-ACTIVOS.md).
// Los nombres son etiquetas de trabajo basadas en las galerías de origen.
// Cliente, periodo, estado, participación y alcance quedan en null hasta que IVC los valide.

export type ProjectPhoto = {
  /** Número del banco (01–20); vincula original, WebP y PNG. */
  id: string;
  enhanced: string;
  original: string;
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  category: SpecialtySlug;
  region: string | null;
  photos: ProjectPhoto[];
  featured: boolean;
  cliente: string | null;
  periodo: string | null;
  estado: string | null;
  participacion: string | null;
  alcance: string[] | null;
  validado: false;
  /** Página del sitio oficial donde se publicó la fotografía (null si no está documentada). */
  fuente: string | null;
};

// Galerías oficiales documentadas en FUENTES-IMAGENES-PRIMERAS-10.md (fotos 01–10).
const GALLERY = {
  hidraulica: "https://www.ivccontratistas.pe/obra-de-saneamiento-hidraulicas/",
  urbanismo: "https://www.ivccontratistas.pe/habilitaciones-urbanas-industriales-y-vivienda/",
  edificaciones: "https://www.ivccontratistas.pe/edificaciones/",
  energia: "https://www.ivccontratistas.pe/energia/",
  transporte: "https://www.ivccontratistas.pe/transporte/",
} as const;

const photo = (file: string, originalExt: "jpg" | "png", alt: string): ProjectPhoto => ({
  id: file.slice(0, 2),
  enhanced: `/projects/enhanced/${file}.webp`,
  original: `/projects/originals/${file}.${originalExt}`,
  alt,
});

const pending = {
  cliente: null,
  periodo: null,
  estado: null,
  participacion: null,
  alcance: null,
  validado: false,
  fuente: null,
} as const;

export const projects: Project[] = [
  {
    slug: "reservorio-estadio-picasso-peratta",
    name: "Reservorio Estadio Picasso Peratta",
    category: "hidraulica",
    region: "Ica",
    photos: [photo("01-reservorio-picasso-ica", "jpg", "Reservorio elevado junto al Estadio Picasso Peratta, Ica")],
    featured: true,
    ...pending,
    fuente: GALLERY.hidraulica,
  },
  {
    slug: "agua-alcantarillado-esquema-nana",
    name: "Agua y alcantarillado del esquema Ñaña",
    category: "hidraulica",
    region: "Lima",
    photos: [photo("02-saneamiento-nana-lima", "jpg", "Infraestructura de saneamiento del esquema Ñaña, Lima")],
    featured: true,
    ...pending,
    fuente: GALLERY.hidraulica,
  },
  {
    slug: "sistema-de-riego-la-achirana",
    name: "Sistema de Riego La Achirana",
    category: "hidraulica",
    region: "Ica",
    photos: [photo("03-riego-la-achirana-ica", "jpg", "Compuertas del Sistema de Riego La Achirana, Ica")],
    featured: false,
    ...pending,
    fuente: GALLERY.hidraulica,
  },
  {
    slug: "las-casuarinas-de-ica",
    name: "Las Casuarinas de Ica",
    category: "urbanismo",
    region: "Ica",
    photos: [
      photo("04-urbanizacion-las-casuarinas-ica", "jpg", "Vista aérea de la urbanización Las Casuarinas, Ica"),
      photo("11-casuarinas-ica", "jpg", "Calles y viviendas de Las Casuarinas, Ica"),
    ],
    featured: true,
    ...pending,
    fuente: GALLERY.urbanismo,
  },
  {
    slug: "centro-industrial-la-chutana",
    name: "Centro Industrial La Chutana",
    category: "urbanismo",
    region: "Lima",
    photos: [photo("05-centro-industrial-la-chutana", "jpg", "Vías del Centro Industrial La Chutana, Lima")],
    featured: true,
    ...pending,
    fuente: GALLERY.urbanismo,
  },
  {
    slug: "universidad-san-luis-gonzaga",
    name: "Facultades de la Universidad Nacional San Luis Gonzaga",
    category: "edificaciones",
    region: "Ica",
    photos: [photo("06-universidad-san-luis-gonzaga", "jpg", "Vista aérea de facultades de la Universidad Nacional San Luis Gonzaga, Ica")],
    featured: true,
    ...pending,
    fuente: GALLERY.edificaciones,
  },
  {
    slug: "hospital-santa-maria-del-socorro",
    name: "Hospital Santa María del Socorro",
    category: "edificaciones",
    region: "Ica",
    photos: [photo("07-hospital-santa-maria-socorro", "jpg", "Fachada del Hospital Santa María del Socorro, Ica")],
    featured: true,
    ...pending,
    fuente: GALLERY.edificaciones,
  },
  {
    slug: "central-hidroelectrica-carhuaquero-iv",
    name: "Central Hidroeléctrica Carhuaquero IV",
    category: "energia",
    region: "Cajamarca",
    photos: [photo("08-central-carhuaquero", "jpg", "Rodete de turbina en la Central Hidroeléctrica Carhuaquero IV")],
    featured: true,
    ...pending,
    fuente: GALLERY.energia,
  },
  {
    slug: "infraestructura-vial",
    // Imagen publicada sin título de obra: no se atribuye proyecto ni ubicación.
    name: "Infraestructura vial",
    category: "transporte",
    region: null,
    photos: [photo("09-infraestructura-vial-ivc", "jpg", "Vía pavimentada con señalización publicada por IVC")],
    featured: true,
    ...pending,
    fuente: GALLERY.transporte,
  },
  {
    slug: "agua-potable-paita",
    name: "Ampliación del servicio de agua potable de Paita",
    category: "hidraulica",
    region: "Piura",
    photos: [photo("10-agua-potable-paita", "jpg", "Infraestructura de agua potable en Paita, Piura")],
    featured: true,
    ...pending,
    fuente: GALLERY.hidraulica,
  },
  {
    slug: "san-carlos-ica",
    name: "San Carlos",
    category: "urbanismo",
    region: "Ica",
    photos: [photo("12-san-carlos-ica", "png", "Viviendas y áreas verdes en San Carlos, Ica")],
    featured: false,
    ...pending,
  },
  {
    slug: "sector-62-chilca",
    name: "Sector 62, Chilca",
    category: "urbanismo",
    region: "Lima",
    photos: [photo("13-sector62-chilca", "jpg", "Vías e infraestructura del Sector 62 en Chilca, Lima")],
    featured: false,
    ...pending,
  },
  {
    slug: "galerias-filtrantes-chincha",
    name: "Galerías filtrantes de Chincha",
    category: "hidraulica",
    region: "Ica",
    photos: [photo("14-galerias-filtrantes-chincha", "jpg", "Maquinaria en obra de galerías filtrantes, Chincha")],
    featured: false,
    ...pending,
  },
  {
    slug: "agua-san-juan-de-lurigancho",
    name: "Infraestructura de agua en San Juan de Lurigancho",
    category: "hidraulica",
    region: "Lima",
    photos: [photo("15-agua-sjl-lima", "jpg", "Instalación de tubería y válvula en San Juan de Lurigancho, Lima")],
    featured: false,
    ...pending,
  },
  {
    slug: "linea-de-conduccion-sjl",
    name: "Línea de conducción en San Juan de Lurigancho",
    category: "hidraulica",
    region: "Lima",
    photos: [photo("16-linea-conduccion-sjl", "jpg", "Interior de una línea de conducción en San Juan de Lurigancho, Lima")],
    featured: false,
    ...pending,
  },
  {
    slug: "edificio-dirmin",
    name: "Edificio DIRMIN",
    category: "edificaciones",
    region: null,
    photos: [photo("17-edificio-dirmin", "jpg", "Fachada del edificio DIRMIN")],
    featured: false,
    ...pending,
  },
  {
    slug: "edificio-discamec",
    name: "Edificio DISCAMEC",
    category: "edificaciones",
    region: null,
    photos: [photo("18-edificio-discamec", "jpg", "Fachada del edificio DISCAMEC")],
    featured: false,
    ...pending,
  },
  {
    slug: "infraestructura-pnp-ayacucho",
    name: "Infraestructura PNP Ayacucho",
    category: "edificaciones",
    region: "Ayacucho",
    photos: [photo("19-pnp-ayacucho", "jpg", "Vista aérea de infraestructura PNP en Ayacucho")],
    featured: false,
    ...pending,
  },
  {
    slug: "central-carhuaquero-ii",
    name: "Carhuaquero II",
    category: "energia",
    region: null,
    photos: [photo("20-carhuaquero-ii", "jpg", "Montaje de rodete de turbina en Carhuaquero II")],
    featured: false,
    ...pending,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectsByCategory = (slug: SpecialtySlug) => projects.filter((p) => p.category === slug);
export const formatRegion = (region: string | null) => (region ? `${region}, Perú` : "Perú · ubicación por confirmar");
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const regionsCount = new Set(projects.map((p) => p.region).filter(Boolean)).size;

