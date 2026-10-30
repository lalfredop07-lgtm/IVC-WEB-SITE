import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatRegion, projectBySlug, projects } from "@/data/projects";
import { specialtyBySlug } from "@/data/specialties";
import { ProjectHero } from "@/components/project-page/ProjectHero";
import { ProjectBody } from "@/components/project-page/ProjectBody";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const cat = specialtyBySlug(p.category);
  return pageMetadata({
    title: p.name,
    description: `${p.name} — ${cat?.name}. ${formatRegion(p.region)}. Obra del portafolio de IVC Contratistas Generales.`,
    path: `/proyectos/${p.slug}`,
    image: { url: p.photos[0].enhanced, width: 1653, height: 951, alt: p.photos[0].alt },
  });
}

export default async function ProyectoPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  // Búsqueda por slug (no por referencia): el objeto puede llegar copiado.
  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];
  const related = projects.filter((p) => p.category === project.category && p.slug !== project.slug && p.slug !== next.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbJsonLd([
            { name: "Proyectos", path: "/proyectos" },
            { name: project.name, path: `/proyectos/${project.slug}` },
          ]),
        )}
      />
      <ProjectHero project={project} />
      <ProjectBody project={project} next={next} related={related} />
    </>
  );
}
