import { InteriorHero } from "@/components/interior/InteriorHero";
import { SpecialtyIndex } from "@/components/specialty/SpecialtyIndex";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Especialidades de ingeniería y construcción",
  description:
    "Las cinco líneas de negocio de IVC Contratistas Generales: obras hidráulicas y saneamiento, habilitaciones urbanas, edificaciones, energía y transporte.",
  path: "/especialidades",
  image: { url: "/projects/enhanced/03-riego-la-achirana-ica.webp", width: 1654, height: 951, alt: "Compuertas del Sistema de Riego La Achirana, Ica" },
});

export default function EspecialidadesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Especialidades", path: "/especialidades" }]))} />
      <InteriorHero
        lead="Obras hidráulicas y saneamiento, habilitaciones urbanas, edificaciones, energía y transporte para el sector público y privado."
        image="/projects/enhanced/03-riego-la-achirana-ica.webp"
        imageAlt="Compuertas del Sistema de Riego La Achirana entre campos de cultivo, Ica"
        caption="Sistema de Riego La Achirana · Ica · Propuesta visual"
        reveal="column"
      />
      <SpecialtyIndex />
    </>
  );
}
