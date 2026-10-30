import { InteriorHero } from "@/components/interior/InteriorHero";
import { ContactSection } from "@/components/contact-page/ContactSection";
import { OfficeBand } from "@/components/contact-page/OfficeBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto",
  description: "Contacte con IVC Contratistas Generales: recepcion@ivc.pe · (+51 1) 437-8385 · Av. Manuel Olguín 335–345, Santiago de Surco, Lima.",
  path: "/contacto",
  image: { url: "/projects/enhanced/13-sector62-chilca.webp", width: 1653, height: 951, alt: "Vías e infraestructura del Sector 62 en Chilca, Lima" },
});

export default function ContactoPage() {
  return (
    <>
      <InteriorHero
        kicker="Contacto"
        title="Contáctanos."
        accent="Estamos para atenderte."
        lead="Escríbenos sobre tu próxima obra pública o privada, o sobre cualquier consulta institucional."
        image="/projects/enhanced/13-sector62-chilca.webp"
        imageAlt="Vías e infraestructura del Sector 62 en Chilca, Lima"
        caption="Sector 62 · Chilca, Lima · Propuesta visual"
        reveal="window"
        titleSplit="chars"
        overlap
      />
      <ContactSection />
      <OfficeBand />
    </>
  );
}
