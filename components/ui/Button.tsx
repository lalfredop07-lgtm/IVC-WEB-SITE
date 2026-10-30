import { TransitionLink } from "@/components/motion/PageTransition";
import { Magnetic } from "@/components/motion/Magnetic";
import { IconArrowUpRight } from "./Icons";

type Variant = "light" | "outline-light" | "navy" | "outline-navy";

const styles: Record<Variant, { base: string; fill: string; hoverText: string }> = {
  light: { base: "bg-white text-navy", fill: "bg-navy", hoverText: "group-hover:text-white" },
  "outline-light": { base: "text-white ring-1 ring-inset ring-white/45", fill: "bg-white", hoverText: "group-hover:text-navy" },
  navy: { base: "bg-navy text-white", fill: "bg-blue", hoverText: "group-hover:text-white" },
  "outline-navy": { base: "text-navy ring-1 ring-inset ring-navy/25", fill: "bg-navy", hoverText: "group-hover:text-white" },
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

/**
 * Botón con relleno que barre desde abajo, texto que rueda verticalmente,
 * flecha que sale y vuelve a entrar, y atracción magnética en escritorio.
 */
export function Button({ href, children, variant = "light", external, className = "", icon }: Props) {
  const s = styles[variant];
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-[101%] rounded-full ${s.fill} transition-transform duration-500 ease-out-expo group-hover:translate-y-0`}
      />
      <span className="relative block h-[1.2em] overflow-hidden">
        <span className={`block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full ${s.hoverText}`}>{children}</span>
        <span aria-hidden="true" className={`absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0 ${s.hoverText}`}>
          {children}
        </span>
      </span>
      <span className={`relative grid size-5 place-items-center overflow-hidden transition-colors duration-500 ${s.hoverText}`}>
        <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-5 group-hover:-translate-y-5">
          {icon ?? <IconArrowUpRight size={18} />}
        </span>
        <span aria-hidden="true" className="absolute -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0">
          {icon ?? <IconArrowUpRight size={18} />}
        </span>
      </span>
    </>
  );
  const cls = `group relative isolate inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-[13px] font-semibold tracking-[0.02em] transition-[box-shadow] duration-300 active:scale-[0.97] ${s.base} ${className}`;

  return (
    <Magnetic strength={0.25}>
      {external ? (
        <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <TransitionLink href={href} className={cls}>
          {inner}
        </TransitionLink>
      )}
    </Magnetic>
  );
}
