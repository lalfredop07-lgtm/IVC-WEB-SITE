import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioExplorer } from "@/components/portfolio/PortfolioExplorer";
import { PortfolioExplorerWithParams } from "@/components/portfolio/PortfolioExplorerWithParams";

// La canónica es siempre /proyectos: los filtros ?especialidad= no generan páginas indexables distintas.
export const metadata = pageMetadata({
  title: "Proyectos de infraestructura",
  description:
    "Portafolio de obras de IVC Contratistas Generales: obras hidráulicas y saneamiento, habilitaciones urbanas, edificaciones, energía y transporte.",
  path: "/proyectos",
});

export default function ProyectosPage() {
  return (
    <>
      <PortfolioHero />
      {/* El fallback se prerenderiza con todas las obras; en el navegador se aplica ?especialidad= */}
      <Suspense fallback={<PortfolioExplorer />}>
        <PortfolioExplorerWithParams />
      </Suspense>
    </>
  );
}
