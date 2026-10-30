// Cinco líneas de negocio según el brief (sección 4). Los nombres comerciales finales
// están pendientes de confirmación por IVC.

export type SpecialtySlug = "hidraulica" | "urbanismo" | "edificaciones" | "energia" | "transporte";

export type Specialty = {
  slug: SpecialtySlug;
  number: string;
  name: string;
  shortName: string;
  summary: string;
  scope: string[];
  image: string;
  imageAlt: string;
};

export const specialties: Specialty[] = [
  {
    slug: "hidraulica",
    number: "01",
    name: "Obras hidráulicas y saneamiento",
    shortName: "Hidráulica y saneamiento",
    summary:
      "Infraestructura para el agua: abastecimiento, saneamiento y riego que sostienen la vida de ciudades y campos.",
    scope: [
      "Agua potable",
      "Alcantarillado",
      "Reservorios",
      "Estaciones de bombeo",
      "Tratamiento",
      "Riego",
    ],
    image: "/projects/enhanced/03-riego-la-achirana-ica.webp",
    imageAlt: "Sistema de Riego La Achirana, Ica",
  },
  {
    slug: "urbanismo",
    number: "02",
    name: "Habilitaciones urbanas, industriales y viviendas",
    shortName: "Habilitaciones urbanas",
    summary:
      "Suelo urbano e industrial preparado para crecer: servicios, vías y redes que dan forma a nuevos desarrollos.",
    scope: [
      "Urbanizaciones y servicios",
      "Vías",
      "Redes de agua y desagüe",
      "Equipamiento urbano",
      "Infraestructura industrial",
    ],
    image: "/projects/enhanced/04-urbanizacion-las-casuarinas-ica.webp",
    imageAlt: "Vista aérea de Las Casuarinas de Ica",
  },
  {
    slug: "edificaciones",
    number: "03",
    name: "Edificaciones",
    shortName: "Edificaciones",
    summary:
      "Edificios públicos y privados para educar, atender la salud y servir a la ciudadanía.",
    scope: [
      "Infraestructura educativa",
      "Infraestructura sanitaria",
      "Edificios administrativos",
      "Edificaciones industriales",
    ],
    image: "/projects/enhanced/07-hospital-santa-maria-socorro.webp",
    imageAlt: "Hospital Santa María del Socorro, Ica",
  },
  {
    slug: "energia",
    number: "04",
    name: "Energía",
    shortName: "Energía",
    summary:
      "Obras civiles e instalaciones para la generación y transmisión de energía.",
    scope: [
      "Generación",
      "Transmisión",
      "Obras civiles",
      "Instalaciones hidromecánicas",
      "Instalaciones electromecánicas",
    ],
    image: "/projects/enhanced/08-central-carhuaquero.webp",
    imageAlt: "Central Hidroeléctrica Carhuaquero IV, Cajamarca",
  },
  {
    slug: "transporte",
    number: "05",
    name: "Transporte",
    shortName: "Transporte",
    summary:
      "Infraestructura vial que conecta territorios y acerca servicios a las personas.",
    scope: ["Infraestructura vial", "Rehabilitación", "Pavimentación"],
    image: "/projects/enhanced/09-infraestructura-vial-ivc.webp",
    imageAlt: "Infraestructura vial publicada por IVC",
  },
];

export const specialtyBySlug = (slug: string) => specialties.find((s) => s.slug === slug);
