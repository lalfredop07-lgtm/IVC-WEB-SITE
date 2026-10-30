// Iconografía lineal propia. Cada trazo usa pathLength=1 para poder "dibujarse"
// con stroke-dashoffset desde GSAP ([data-draw]).

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const P = (d: string) => <path d={d} pathLength={1} data-draw="" />;

export const IconArrowUpRight = (p: IconProps) => <Base {...p}>{P("M7 17 17 7M8 7h9v9")}</Base>;
export const IconArrowRight = (p: IconProps) => <Base {...p}>{P("M4 12h16M14 6l6 6-6 6")}</Base>;
export const IconArrowLeft = (p: IconProps) => <Base {...p}>{P("M20 12H4M10 6l-6 6 6 6")}</Base>;
export const IconArrowDown = (p: IconProps) => <Base {...p}>{P("M12 4v16M6 14l6 6 6-6")}</Base>;
export const IconClose = (p: IconProps) => <Base {...p}>{P("M6 6l12 12M18 6 6 18")}</Base>;

export const IconLayers = (p: IconProps) => (
  <Base {...p}>
    {P("M12 3 3 7.5 12 12l9-4.5L12 3Z")}
    {P("M3 12l9 4.5 9-4.5")}
    {P("M3 16.5 12 21l9-4.5")}
  </Base>
);
export const IconCrane = (p: IconProps) => (
  <Base {...p}>
    {P("M5 21V5l3-2v18")}
    {P("M5 5h15l-3 3")}
    {P("M8 8h12")}
    {P("M17 8v5")}
    {P("M15.5 13h3v2.5h-3z")}
    {P("M3 21h8")}
  </Base>
);
export const IconShield = (p: IconProps) => (
  <Base {...p}>
    {P("M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z")}
    {P("m8.8 12 2.2 2.2 4.4-4.4")}
  </Base>
);
export const IconAward = (p: IconProps) => (
  <Base {...p}>
    {P("M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z")}
    {P("m9.5 9 1.7 1.7L14.7 7.3")}
    {P("M8.5 14 7 21l5-2.5 5 2.5-1.5-7")}
  </Base>
);
export const IconHelmet = (p: IconProps) => (
  <Base {...p}>
    {P("M3 17h18")}
    {P("M4.5 17v-2a7.5 7.5 0 0 1 15 0v2")}
    {P("M10 7.7V5.5h4v2.2")}
    {P("M3 17v1.5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V17")}
  </Base>
);
export const IconLeaf = (p: IconProps) => (
  <Base {...p}>
    {P("M5 19c0-8 5-13 15-14-1 10-6 15-14 15")}
    {P("M5 19c3-4 6-7 10-9")}
  </Base>
);
export const IconCycle = (p: IconProps) => (
  <Base {...p}>
    {P("M20 11a8 8 0 0 0-14.6-4.5")}
    {P("M4 4v3h3")}
    {P("M4 13a8 8 0 0 0 14.6 4.5")}
    {P("M20 20v-3h-3")}
  </Base>
);
export const IconScale = (p: IconProps) => (
  <Base {...p}>
    {P("M12 3v18")}
    {P("M7 21h10")}
    {P("M4 7h16")}
    {P("m4 7-2.5 6a3 3 0 0 0 5 0L4 7Z")}
    {P("m20 7-2.5 6a3 3 0 0 0 5 0L20 7Z")}
  </Base>
);
export const IconDrop = (p: IconProps) => (
  <Base {...p}>
    {P("M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3Z")}
    {P("M9 15.5a3 3 0 0 0 3 2.5")}
  </Base>
);
export const IconUrban = (p: IconProps) => (
  <Base {...p}>
    {P("M3 21h18")}
    {P("M5 21V11l4-3 4 3v10")}
    {P("M13 21V6l6-3v18")}
    {P("M8 14h2M8 17h2M16 9h1M16 12h1M16 15h1")}
  </Base>
);
export const IconBuilding = (p: IconProps) => (
  <Base {...p}>
    {P("M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16")}
    {P("M2.5 21h19")}
    {P("M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15")}
    {P("M10.5 21v-3h3v3")}
  </Base>
);
export const IconBolt = (p: IconProps) => <Base {...p}>{P("M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2Z")}</Base>;
export const IconRoad = (p: IconProps) => (
  <Base {...p}>
    {P("M7 3 3 21")}
    {P("M17 3l4 18")}
    {P("M12 4v2.5M12 10v3M12 16.5V20")}
  </Base>
);
export const IconMail = (p: IconProps) => (
  <Base {...p}>
    {P("M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z")}
    {P("m3.5 6.5 8.5 6 8.5-6")}
  </Base>
);
export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    {P("M5 3.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 5.4 5.4l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15.5 15.5 0 0 1 3 5.5a2 2 0 0 1 2-2Z")}
  </Base>
);
export const IconPin = (p: IconProps) => (
  <Base {...p}>
    {P("M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z")}
    {P("M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z")}
  </Base>
);
export const IconInstagram = (p: IconProps) => (
  <Base {...p}>
    {P("M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z")}
    {P("M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z")}
    {P("M17.2 6.8h.01")}
  </Base>
);

export const specialtyIcons = {
  hidraulica: IconDrop,
  urbanismo: IconUrban,
  edificaciones: IconBuilding,
  energia: IconBolt,
  transporte: IconRoad,
} as const;
