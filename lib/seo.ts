import type { Metadata } from "next";
import { site } from "@/data/site";
import { INDEXABLE, SITE_URL } from "@/lib/env";

const DEFAULT_IMAGE = { url: "/projects/enhanced/01-reservorio-picasso-ica.webp", width: 1654, height: 951, alt: "Reservorio elevado del Estadio Picasso Peratta, Ica" };

type PageMeta = {
  /** Título de la página (la plantilla añade « | IVC Contratistas Generales»). */
  title?: string;
  description: string;
  /** Ruta canónica, p. ej. "/proyectos". */
  path: string;
  image?: { url: string; width?: number; height?: number; alt: string };
  /** Título completo sin plantilla (solo la Home). */
  absoluteTitle?: string;
};

/**
 * Metadata completa de una página. Next fusiona `openGraph`, `twitter` y `robots`
 * de forma superficial: cada página los declara enteros para no perder campos del layout.
 */
export function pageMetadata({ title, description, path, image = DEFAULT_IMAGE, absoluteTitle }: PageMeta): Metadata {
  const fullTitle = absoluteTitle ?? `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    robots: robotsMeta,
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
  };
}

export const robotsMeta: Metadata["robots"] = INDEXABLE
  ? { index: true, follow: true }
  : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } };

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** Serializa JSON-LD escapando «<» para impedir el cierre prematuro del <script>. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

/** Organización: solo datos publicados por IVC en su sitio oficial (ver VALIDACIONES-PENDIENTES.md). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GeneralContractor",
        "@id": `${SITE_URL}/#organizacion`,
        name: site.name,
        legalName: site.legalName,
        slogan: site.slogan,
        url: SITE_URL,
        logo: absoluteUrl("/brand/logo-ivc.png"),
        image: absoluteUrl(DEFAULT_IMAGE.url),
        foundingDate: `${site.foundedYear}-${String(site.foundedMonth).padStart(2, "0")}`,
        taxID: site.ruc,
        email: site.contact.email,
        telephone: site.contact.phoneHrefs,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.contact.address,
          addressLocality: "Santiago de Surco",
          addressRegion: "Lima",
          addressCountry: "PE",
        },
        sameAs: [site.social.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#web`,
        url: SITE_URL,
        name: site.name,
        inLanguage: "es-PE",
        publisher: { "@id": `${SITE_URL}/#organizacion` },
      },
    ],
  };
}

/** Ruta de navegación para datos estructurados. El primer elemento siempre es Inicio. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
