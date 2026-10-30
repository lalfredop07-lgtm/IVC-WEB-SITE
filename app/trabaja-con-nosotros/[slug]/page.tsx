import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedJobBySlug, publishedJobs, type Job } from "@/data/jobs";
import { exampleJobs } from "@/data/jobs.example";
import { site } from "@/data/site";
import { InteriorHero } from "@/components/interior/InteriorHero";
import { JobDetail } from "@/components/careers/JobDetail";
import { ApplySection } from "@/components/careers/ApplySection";
import { absoluteUrl, breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/env";

// Solo existen fichas de vacantes aprobadas por IVC. En `npm run dev` también se
// generan las de los ejemplos ficticios para revisar el diseño; nunca en producción.
const DEV_PREVIEW = process.env.NODE_ENV !== "production";
const findJob = (slug: string): Job | undefined =>
  publishedJobBySlug(slug) ?? (DEV_PREVIEW ? exampleJobs.find((j) => j.slug === slug) : undefined);

export const dynamicParams = false;

export function generateStaticParams() {
  return [...publishedJobs, ...(DEV_PREVIEW ? exampleJobs : [])].map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trabaja-con-nosotros/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = findJob(slug);
  if (!j) return {};
  const meta = pageMetadata({
    title: `${j.title} · Trabaja con nosotros`,
    description: `${j.title} en ${j.location}. ${j.summary}`.slice(0, 300),
    path: `/trabaja-con-nosotros/${j.slug}`,
  });
  // Un ejemplo de diseño nunca debe indexarse, aunque la web sí lo sea.
  return j.ejemplo ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function VacantePage({ params }: PageProps<"/trabaja-con-nosotros/[slug]">) {
  const { slug } = await params;
  const job = findJob(slug);
  if (!job) notFound();

  const posting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.summary, ...job.description].map((p) => `<p>${p}</p>`).join(""),
    datePosted: job.publishedAt,
    ...(job.closesAt ? { validThrough: `${job.closesAt}T23:59:59-05:00` } : {}),
    hiringOrganization: { "@type": "Organization", "@id": `${SITE_URL}/#organizacion`, name: site.name, sameAs: SITE_URL, logo: absoluteUrl("/brand/logo-ivc.png") },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "PE" } },
    directApply: true,
  };

  return (
    <>
      {!job.ejemplo && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(posting)} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLd(
              breadcrumbJsonLd([
                { name: "Trabaja con nosotros", path: "/trabaja-con-nosotros" },
                { name: job.title, path: `/trabaja-con-nosotros/${job.slug}` },
              ]),
            )}
          />
        </>
      )}
      <InteriorHero
        kicker={`Vacante · ${job.location}`}
        title={job.title}
        lead={job.summary}
        image="/projects/enhanced/15-agua-sjl-lima.webp"
        imageAlt="Trabajadores con equipo de protección instalando una tubería en San Juan de Lurigancho"
        caption="Agua · San Juan de Lurigancho · Propuesta visual"
        reveal="doors"
        titleSplit="words"
      />
      <JobDetail job={job} />
      <ApplySection position={job.title} kicker="Postulación" />
    </>
  );
}
