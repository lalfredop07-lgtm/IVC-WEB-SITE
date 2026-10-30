import { InteriorHero } from "@/components/interior/InteriorHero";
import { pageMetadata } from "@/lib/seo";
import { CareersCollage } from "@/components/careers/CareersCollage";
import { PeoplePanels } from "@/components/careers/PeoplePanels";
import { ValuesDeck } from "@/components/careers/ValuesDeck";
import { JobBoard } from "@/components/careers/JobBoard";
import { ApplySteps } from "@/components/careers/ApplySteps";
import { ApplySection } from "@/components/careers/ApplySection";
import { Button } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Trabaja con nosotros",
  description: "Bolsa de trabajo de IVC Contratistas Generales: vacantes publicadas, candidaturas espontáneas y postulación con CV.",
  path: "/trabaja-con-nosotros",
  image: { url: "/projects/enhanced/16-linea-conduccion-sjl.webp", width: 1653, height: 951, alt: "Trabajador con equipo de protección en una línea de conducción" },
});

export default function TrabajaConNosotrosPage() {
  return (
    <>
      <InteriorHero
        kicker="Trabaja con nosotros"
        title="Construyamos"
        accent="bienestar juntos."
        lead="Profesionales y técnicos que hacen posible cada obra. Conozca nuestros compromisos con las personas, las vacantes publicadas y cómo postular."
        image="/projects/enhanced/16-linea-conduccion-sjl.webp"
        imageAlt="Trabajador con equipo de protección en el interior de una línea de conducción"
        caption="Línea de conducción · San Juan de Lurigancho · Propuesta visual"
        reveal="doors"
        titleSplit="chars"
        objectPosition="35% center"
        decor={<CareersCollage />}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/trabaja-con-nosotros#ofertas">Ver ofertas</Button>
          <Button href="/trabaja-con-nosotros#postular" variant="outline-light">
            Postular
          </Button>
        </div>
      </InteriorHero>
      <PeoplePanels />
      <JobBoard />
      <ApplySection kicker="03 — Postulación" />
      <ValuesDeck />
      <ApplySteps />
    </>
  );
}
