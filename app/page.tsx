import { Hero } from "@/components/home/Hero";
import { AccessCards } from "@/components/home/AccessCards";
import { Essence } from "@/components/home/Essence";
import { Manifesto } from "@/components/home/Manifesto";
import { Specialties } from "@/components/home/Specialties";
import { Projects } from "@/components/home/Projects";
import { Commitment } from "@/components/home/Commitment";
import { Contact } from "@/components/home/Contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  absoluteTitle: "IVC Contratistas Generales | ¡Construimos Bienestar!",
  description:
    "Empresa constructora peruana que desde 1988 ejecuta proyectos de ingeniería para el sector público y privado: hidráulica y saneamiento, urbanismo, edificaciones, energía y transporte.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <AccessCards />
      <Essence />
      <Manifesto />
      <Specialties />
      <Projects />
      <Commitment />
      <Contact />
    </>
  );
}
