// Datos institucionales publicados por IVC (ver documentacion/BRIEF-IVC-COMPLETO.md).
// Todo dato nuevo debe validarse con IVC antes de añadirse aquí.

export const site = {
  name: "IVC Contratistas Generales",
  legalName: "IVC Contratistas Generales S.A.",
  ruc: "20100754755",
  slogan: "¡Construimos Bienestar!",
  foundedYear: 1988,
  foundedMonth: 2, // febrero
  country: "Perú",
  mission:
    "Ejecutar proyectos de ingeniería con gestión de calidad, seguridad y salud ocupacional, respeto ambiental, mejora continua y satisfacción de nuestros clientes.",
  vision: "Ser líderes y protagonistas en el sector construcción.",
  values: ["Integridad", "Solidaridad", "Calidad", "Trabajo en equipo", "Liderazgo"],
  contact: {
    email: "recepcion@ivc.pe",
    phones: ["(+51 1) 437-8385", "(+51 1) 437-4482"],
    phoneHrefs: ["+5114378385", "+5114374482"],
    address: "Av. Manuel Olguín 335–345, oficinas 1004–1005",
    district: "Santiago de Surco, Lima",
  },
  social: {
    instagram: "https://www.instagram.com/ivc_contratistas/",
  },
  // Páginas vigentes del sitio actual de IVC (consultadas el 27/10/2026).
  officialLinks: {
    site: "https://www.ivccontratistas.pe/",
    about: "https://www.ivccontratistas.pe/nosotros/",
    certifications: "https://www.ivccontratistas.pe/certificaciones/",
    policies: "https://www.ivccontratistas.pe/politicas-corporativas/",
    privacy: "https://www.ivccontratistas.pe/politica-de-privacidad/",
    social: "https://www.ivccontratistas.pe/responsabilidad-social/",
    ethics: "https://www.ivccontratistas.pe/codigos-de-etica/",
    manuals: "https://www.ivccontratistas.pe/manuales/",
    reports: "https://www.ivccontratistas.pe/informes/",
    rnp: "https://www.rnp.gob.pe/Constancia/RNP_Constancia/default_Todos.asp?RUC=20100754755",
  },
  isoStandards: ["ISO 9001", "ISO 14001", "ISO 45001", "ISO 37001"],
} as const;

/** Años de trayectoria desde febrero de 1988, calculados respecto a una fecha dada. */
export function yearsSinceFoundation(now: Date = new Date()): number {
  const years = now.getFullYear() - site.foundedYear;
  return now.getMonth() + 1 < site.foundedMonth ? years - 1 : years;
}

// ─────────────── Contenido institucional verificado (ivccontratistas.pe) ───────────────

/** Trayectoria. Solo 1988 está fechado en las fuentes oficiales; el resto no lleva fecha. */
export const history = {
  origin:
    "IVC Contratistas Generales inicia sus actividades en febrero de 1988 como una empresa de servicios de ingeniería.",
  growth: "Con el tiempo alcanzó «una ubicación expectante en el campo de la construcción».",
  today: "Hoy participa en el desarrollo y ejecución de proyectos de ingeniería para el sector público y privado.",
} as const;

/** Valores organizacionales con su descripción oficial (ivccontratistas.pe/valores). */
export const valuesDetail = [
  { name: "Integridad", text: "Ser transparentes, honestos, leales; tener identidad." },
  { name: "Solidaridad", text: "Colaboración y apoyo mutuo con todos, sobre todo con los que necesitan de otros." },
  { name: "Calidad", text: "Brindar productos buscando la excelencia." },
  {
    name: "Trabajo en equipo",
    text: "Realizar nuestras actividades con la participación y apoyo mutuo de todos, potenciando el talento colectivo.",
  },
  {
    name: "Liderazgo",
    text: "Influir e inspirar dentro de la organización para lograr la creatividad, la innovación y la mejora continua.",
  },
] as const;

/** Normas que IVC presenta como parte de su Sistema de Gestión (ivccontratistas.pe/certificaciones).
 *  La página no indica entidad certificadora, fecha ni alcance: no se muestran sellos. */
export const managementSystem = [
  { norm: "ISO 9001", area: "Calidad" },
  { norm: "ISO 14001", area: "Medio ambiente" },
  { norm: "ISO 45001", area: "Seguridad y salud ocupacional" },
  { norm: "ISO 37001", area: "Sistema de gestión antisoborno" },
] as const;

export type PolicyGroup = "Gestión" | "Integridad" | "Personas" | "Sociedad" | "Seguridad digital";

/** Políticas publicadas en ivccontratistas.pe/politicas-corporativas (enlaces al sistema documental de IVC). */
export const policies: { title: string; group: PolicyGroup; href: string }[] = [
  { title: "Política del Sistema Integrado de Gestión", group: "Gestión", href: "https://erp-ivc.com/ot-p/a5c/878" },
  { title: "Alcance del Sistema Integrado de Gestión", group: "Gestión", href: "https://erp-ivc.com/ot-p/a5c/838" },
  { title: "Política Antisoborno", group: "Integridad", href: "https://erp-ivc.com/ot-p/a5c/0c5" },
  { title: "Alcance del Sistema de Gestión Antisoborno", group: "Integridad", href: "https://erp-ivc.com/ot-p/a5c/f397" },
  { title: "Política de no discriminación a la mujer", group: "Personas", href: "https://erp-ivc.com/ot-p/a5c/76b" },
  { title: "Política de igualdad y equidad de género", group: "Personas", href: "https://erp-ivc.com/ot-p/a5c/101" },
  {
    title: "Política de empleabilidad, solidaridad y apoyo social",
    group: "Personas",
    href: "https://erp-ivc.com/ot-p/a5c/935",
  },
  { title: "Política de responsabilidad social", group: "Sociedad", href: "https://erp-ivc.com/ot-p/a5c/910" },
  { title: "Política de seguridad digital", group: "Seguridad digital", href: "https://erp-ivc.com/ot-p/a5c/f42" },
];

/** Canales de denuncia oficiales. Son independientes del contacto comercial. */
export const reportingChannels = [
  {
    title: "Denuncias antisoborno",
    text: "Formulario oficial para comunicar posibles actos de soborno, en el marco del sistema de gestión antisoborno.",
    href: "https://www.ivccontratistas.pe/formulario-de-presentacion-de-denuncias/",
  },
  {
    title: "Denuncias de hostigamiento sexual",
    text: "Formulario oficial para presentar denuncias de hostigamiento sexual.",
    href: "https://www.ivccontratistas.pe/formulario-de-presentacion-de-denuncias-de-hostigamiento-sexual/",
  },
] as const;

/** Responsabilidad social (ivccontratistas.pe/responsabilidad-social), en paráfrasis fiel. */
export const socialResponsibility =
  "IVC se define como una empresa socialmente responsable, que busca generar valor compartido para sus miembros y para la sociedad, y mejorar con sus obras la calidad de vida de más peruanos.";

