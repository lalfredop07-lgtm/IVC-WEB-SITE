import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsByCategory } from "@/data/projects";
import { specialties, specialtyBySlug } from "@/data/specialties";
import { SpecialtyHero } from "@/components/specialty/SpecialtyHero";
import { SpecialtyBody } from "@/components/specialty/SpecialtyBody";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return specialties.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/especialidades/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = specialtyBySlug(slug);
  if (!s) return {};
  return pageMetadata({
    title: s.name,
    description: `${s.name}: ${s.scope.join(", ").toLowerCase()}. ${s.summary}`,
    path: `/especialidades/${s.slug}`,
    image: { url: s.image, width: 1654, height: 951, alt: s.imageAlt },
  });
}

export default async function SpecialtyPage({ params }: PageProps<"/especialidades/[slug]">) {
  const { slug } = await params;
  const s = specialtyBySlug(slug);
  if (!s) notFound();
  const i = specialties.findIndex((x) => x.slug === s.slug);
  const next = specialties[(i + 1) % specialties.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbJsonLd([
            { name: "Especialidades", path: "/especialidades" },
            { name: s.name, path: `/especialidades/${s.slug}` },
          ]),
        )}
      />
      <SpecialtyHero specialty={s} />
      <SpecialtyBody specialty={s} related={projectsByCategory(s.slug)} next={next} />
    </>
  );
}
