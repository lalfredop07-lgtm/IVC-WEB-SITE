export type NavItem = {
  label: string;
  href: string;
  /** Sección de la Home que activa el indicador al hacer scroll. */
  section?: string;
  /** Prefijo de ruta que activa el indicador en páginas interiores. */
  match?: string;
};

export const mainNav: NavItem[] = [
  { label: "Nosotros", href: "/nosotros", section: "nosotros", match: "/nosotros" },
  { label: "Especialidades", href: "/especialidades", section: "especialidades", match: "/especialidades" },
  { label: "Proyectos", href: "/proyectos", section: "proyectos", match: "/proyectos" },
  { label: "Compromiso", href: "/compromiso", section: "compromiso", match: "/compromiso" },
  { label: "Transparencia", href: "/transparencia", match: "/transparencia" },
  { label: "Contacto", href: "/contacto", section: "contacto", match: "/contacto" },
];

/** Accesos secundarios: footer, menú móvil y barra superior (tras los 5 enlaces principales). */
export const secondaryNav: NavItem[] = [{ label: "Trabaja con nosotros", href: "/trabaja-con-nosotros", match: "/trabaja-con-nosotros" }];

export const isNavActive = (item: NavItem, pathname: string, homeSection: string | null) =>
  (pathname === "/" && !!item.section && homeSection === item.section) || (!!item.match && pathname.startsWith(item.match));
