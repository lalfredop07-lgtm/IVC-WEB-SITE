import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { InteriorHero } from "@/components/interior/InteriorHero";
import { RingsCTA } from "@/components/interior/RingsCTA";
import { ManagementDial } from "@/components/commitment-page/ManagementDial";
import { PolicyWall } from "@/components/commitment-page/PolicyWall";
import { SocialBand } from "@/components/commitment-page/SocialBand";

export const metadata = pageMetadata({
  title: "Compromiso: calidad, seguridad y medio ambiente",
  description:
    "Calidad, seguridad y salud ocupacional, medio ambiente y gestión antisoborno: el sistema de gestión, las políticas corporativas y la responsabilidad social de IVC.",
  path: "/compromiso",
  image: { url: "/projects/enhanced/08-central-carhuaquero.webp", width: 1654, height: 951, alt: "Rodete de turbina en la Central Hidroeléctrica Carhuaquero IV" },
});

export default function CompromisoPage() {
  return (
    <>
      <InteriorHero
        kicker="Compromiso"
        title="Calidad, seguridad y"
        accent="responsabilidad."
        lead={site.mission}
        image="/projects/enhanced/08-central-carhuaquero.webp"
        imageAlt="Rodete de turbina en la Central Hidroeléctrica Carhuaquero IV"
        caption="Central Hidroeléctrica Carhuaquero IV · Cajamarca · Propuesta visual"
        reveal="iris"
        titleSplit="words"
      />
      <ManagementDial />
      <PolicyWall />
      <SocialBand />
      <RingsCTA
        tone="dark"
        kicker="Integridad y transparencia"
        title="Canales formales"
        accent="y documentos públicos."
        text="Consulte las políticas de IVC y sus canales de denuncia, independientes del contacto comercial."
        primary={{ href: "/transparencia", label: "Ir a Transparencia" }}
        secondary={{ href: "/contacto", label: "Contacto corporativo" }}
      />
    </>
  );
}
