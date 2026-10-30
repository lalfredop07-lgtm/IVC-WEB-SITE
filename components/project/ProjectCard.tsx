"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { formatRegion, type Project } from "@/data/projects";
import { specialtyBySlug } from "@/data/specialties";
import { IconArrowUpRight } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/motion/PageTransition";

type Props = {
  project: Project;
  /** Abre la ficha ampliada (Home). */
  onOpen?: (p: Project) => void;
  /** Enlaza a la página del proyecto con la transición de imagen expandida. */
  href?: string;
  large?: boolean;
  index: number;
  sizes?: string;
  className?: string;
};

/** Tarjeta fotográfica de obra; su imagen comparte layoutId con la ficha ampliada. */
export function ProjectCard({ project, onOpen, href, large, index, sizes, className = "" }: Props) {
  const cover = project.photos[0];
  const category = specialtyBySlug(project.category);

  const cls = `group relative block h-full w-full overflow-hidden rounded-[22px] bg-navy-900 text-left text-white ring-1 ring-white/10 ${
    large ? "min-h-[420px] md:min-h-[560px]" : "min-h-[340px] md:min-h-[400px]"
  } ${className}`;

  const body = (
    <>
      <motion.div layoutId={href ? undefined : `project-media-${project.slug}`} className="absolute inset-0 overflow-hidden" transition={{ type: "spring", stiffness: 140, damping: 24 }}>
        <Image
          src={cover.enhanced}
          alt={cover.alt}
          fill
          sizes={sizes ?? (large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw")}
          className="object-cover transition-[transform,filter] duration-[1.4s] ease-out-expo group-hover:scale-[1.08] group-hover:saturate-[1.1]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-blue/0 mix-blend-multiply transition-colors duration-700 group-hover:bg-blue/20" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-6">
        <span className="kicker rounded-full bg-navy-950/45 px-3 py-1.5 text-[10px] text-white/90 backdrop-blur-md">{category?.shortName}</span>
        <span className="kicker text-white/60">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 md:p-7">
        <div className="translate-y-2 transition-transform duration-700 ease-out-expo group-hover:translate-y-0">
          <h3 className={`font-semibold leading-[1.1] tracking-[-0.03em] ${large ? "text-[clamp(1.5rem,2.6vw,2.4rem)] max-w-[18ch]" : "text-[1.3rem] max-w-[20ch]"}`}>
            {project.name}
          </h3>
          <p className="mt-2 text-sm text-white/65">{formatRegion(project.region)}</p>
        </div>
        <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/25 backdrop-blur-md transition-colors duration-500 group-hover:bg-white group-hover:text-navy">
          <IconArrowUpRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <TransitionLink href={href} imageTransition data-cursor="Ver obra" className={cls}>
        {body}
      </TransitionLink>
    );
  }
  return (
    <button type="button" onClick={() => onOpen?.(project)} data-cursor="Ver obra" aria-haspopup="dialog" className={cls}>
      {body}
    </button>
  );
}
