import { InteriorHero } from "@/components/interior/InteriorHero";
import { RingsCTA } from "@/components/interior/RingsCTA";
import { TransparencyBody } from "@/components/transparency/TransparencyBody";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Transparencia y canales de denuncia",
  description:
    "Información corporativa, políticas publicadas y canales de denuncia antisoborno y de hostigamiento sexual de IVC Contratistas Generales.",
  path: "/transparencia",
  image: { url: "/projects/enhanced/18-edificio-discamec.webp", width: 1653, height: 951, alt: "Fachada del edificio DISCAMEC" },
});

export default function TransparenciaPage() {
  return (
    <>
      <InteriorHero
        kicker="Transparencia"
        title="Integridad"
        accent="en cada decisión."
        lead="Información corporativa, políticas publicadas y canales formales de denuncia de IVC Contratistas Generales."
        image="/projects/enhanced/18-edificio-discamec.webp"
        imageAlt="Fachada del edificio DISCAMEC"
        caption="Edificio DISCAMEC · Propuesta visual"
        reveal="wipe"
        titleSplit="chars"
      />
      <TransparencyBody />
      <RingsCTA
        tone="light"
        kicker="Contacto institucional"
        title="¿Necesita más"
        accent="información?"
        text="Para consultas institucionales o comerciales, utilice nuestros canales de contacto."
        primary={{ href: "/contacto", label: "Ir a contacto" }}
        secondary={{ href: "/compromiso", label: "Nuestro compromiso" }}
      />
    </>
  );
}
