import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, Montserrat } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { IntroProvider } from "@/components/motion/IntroProvider";
import { Preloader } from "@/components/motion/Preloader";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { INDEXABLE, SITE_URL } from "@/lib/env";
import { jsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo";

// Solo variantes rectas (sin cursivas): next/font descarga únicamente el estilo normal.
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", style: "normal" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", style: "normal" });
// Excepción aprobada: única fuente cursiva, solo para la palabra «bienestar.» del hero de la Home.
const heroItalic = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-hero-italic", display: "swap" });

const base = pageMetadata({
  absoluteTitle: "IVC Contratistas Generales | ¡Construimos Bienestar!",
  description:
    "IVC Contratistas Generales: empresa constructora peruana que desde 1988 desarrolla proyectos de ingeniería e infraestructura para el sector público y privado.",
  path: "/",
});

export const metadata: Metadata = {
  ...base,
  // Cada página define su canónica; el layout no impone la de la Home.
  alternates: undefined,
  title: { default: "IVC Contratistas Generales | ¡Construimos Bienestar!", template: "%s | IVC Contratistas Generales" },
  metadataBase: new URL(SITE_URL),
  applicationName: "IVC Contratistas Generales",
  // Los teléfonos ya se enlazan con tel:; se evita la detección automática de iOS sobre otras cifras (RUC, años).
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#00121f",
  viewportFit: "cover",
};

// Marca el documento antes de pintar: activa estados iniciales de animación
// y omite la pantalla de entrada si ya se vio en esta sesión o si se pidió reducir movimiento.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('ivc-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen')}catch(e){d.classList.add('intro-seen')}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${montserrat.variable} ${dmSans.variable} ${heroItalic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy shadow-xl transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <SmoothScroll>
          <IntroProvider>
            <PageTransitionProvider>
              <Preloader />
              <Header />
              <main id="contenido" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer review={!INDEXABLE} />
            </PageTransitionProvider>
          </IntroProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
