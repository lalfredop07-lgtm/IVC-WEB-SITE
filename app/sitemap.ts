import type { MetadataRoute } from "next";
import { publishedJobs } from "@/data/jobs";
import { projects } from "@/data/projects";
import { specialties } from "@/data/specialties";
import { absoluteUrl } from "@/lib/seo";

/** Sitemap generado desde los datos: cada obra, especialidad o vacante nueva se añade sola. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "monthly" | "weekly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });
  return [
    page("/", 1),
    page("/nosotros", 0.8),
    page("/especialidades", 0.9),
    ...specialties.map((s) => page(`/especialidades/${s.slug}`, 0.8)),
    page("/proyectos", 0.9),
    ...projects.map((p) => page(`/proyectos/${p.slug}`, 0.7)),
    page("/compromiso", 0.7),
    page("/transparencia", 0.5, "yearly"),
    page("/contacto", 0.7),
    page("/trabaja-con-nosotros", 0.7, "weekly"),
    ...publishedJobs.map((j) => page(`/trabaja-con-nosotros/${j.slug}`, 0.6, "weekly")),
  ];
}
