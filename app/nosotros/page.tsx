import { InteriorHero } from "@/components/interior/InteriorHero";
import { pageMetadata } from "@/lib/seo";
import { Timeline } from "@/components/about/Timeline";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { Philosophy } from "@/components/about/Philosophy";
import { Capacity } from "@/components/about/Capacity";
import { ClosingWindow } from "@/components/about/ClosingWindow";

export const metadata = pageMetadata({
  title: "Nosotros: trayectoria desde 1988",
  description:
    "IVC Contratistas Generales inició sus actividades en febrero de 1988 como empresa de servicios de ingeniería. Misión, visión, valores y trayectoria.",
  path: "/nosotros",
  image: { url: "/projects/enhanced/05-centro-industrial-la-chutana.webp", width: 1654, height: 951, alt: "Vista aérea del Centro Industrial La Chutana, Lima" },
});

export default function NosotrosPage() {
  return (
    <>
      <InteriorHero
        kicker="Nosotros · Desde 1988"
        title="Ingeniería peruana"
        accent="con trayectoria."
        lead="Iniciamos nuestras actividades en febrero de 1988 como una empresa de servicios de ingeniería. Hoy desarrollamos y ejecutamos proyectos para el sector público y privado."
        image="/projects/enhanced/05-centro-industrial-la-chutana.webp"
        imageAlt="Vista aérea de las vías del Centro Industrial La Chutana, Lima"
        caption="Centro Industrial La Chutana · Lima · Propuesta visual"
        reveal="slats"
        titleSplit="chars"
      />
      <Timeline />
      <WhoWeAre />
      <Philosophy />
      <Capacity />
      <ClosingWindow
        image="/projects/enhanced/09-infraestructura-vial-ivc.webp"
        alt="Vía pavimentada con señalización publicada por IVC"
        left="¡Construimos"
        right="Bienestar!"
        title="Conozca las obras que respaldan nuestra trayectoria."
        primary={{ href: "/proyectos", label: "Ver proyectos" }}
        secondary={{ href: "/contacto", label: "Contactar a IVC" }}
      />
    </>
  );
}
