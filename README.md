# IVC Contratistas Generales — Web institucional (versión de revisión)

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis · Motion.

> **No publicada.** Versión de revisión no indexable. No subir a GitHub, desplegar en Vercel ni tocar el dominio `ivccontratistas.pe` sin autorización.

## Comandos

```bash
npm ci             # instalación limpia (Node >= 20.9)
npm run dev        # http://localhost:3000
npm run build      # compilación de producción
npm run start      # sirve la compilación en http://localhost:3000
npm run lint
npm run typecheck  # tipos de rutas + TypeScript
npm run check      # typecheck + lint + build (antes de cada entrega)
```

Para volver a ver la pantalla de entrada, abre una pestaña nueva (se muestra una vez por sesión).

## Estructura

- `app/` — rutas: `/` (Home), `/nosotros`, `/especialidades` y `/especialidades/[slug]` (5), `/proyectos` y `/proyectos/[slug]` (19), `/compromiso`, `/contacto`, `/transparencia`, `/trabaja-con-nosotros` y `/trabaja-con-nosotros/[slug]` (solo vacantes aprobadas), `api/contacto`, `api/postulacion`, `robots.txt`, `sitemap.xml`.
- `components/home/` — secciones de la Home (diseño aprobado).
- `components/motion/` — infraestructura de animación (scroll suave, intro, transiciones de página, revelados de texto/imagen, magnetismo, marquesina).
- `components/layout/` — header, menú móvil, footer.
- `components/interior/` — portada interior (`InteriorHero`, 6 revelados: slats, iris, wipe, window, doors, column) y cierre con anillos (`RingsCTA`).
- `components/about/`, `specialty/`, `portfolio/`, `project-page/`, `commitment-page/`, `contact-page/`, `transparency/`, `careers/` — secciones de cada página.
- `data/` — contenido tipado (empresa, especialidades, proyectos, vacantes, navegación), separado de la UI para un futuro CMS.
- `lib/` — GSAP, validación de formularios, SEO (`seo.ts`), entorno (`env.ts`), seguridad de API (`security.ts`), trampa de foco.
- `public/brand/` — logo oficial sin modificar. `public/projects/` — 20 WebP mejorados + 20 originales (ver `docs/MAPA-IMAGENES.md`).

## Documentación

| Documento | Contenido |
|---|---|
| `VALIDACIONES-PENDIENTES.md` | Todo lo que IVC debe confirmar antes de publicar |
| `docs/INFORME-FASE-3.md` | Informe de la Fase 3: auditoría, cambios, mediciones y pruebas |
| `docs/DESPLIEGUE-VERCEL.md` | Variables de entorno, indexación y pasos de despliegue |
| `docs/PREPARACION-GITHUB.md` | Qué se sube, revisión de secretos, instalación limpia |
| `docs/SEGURIDAD-Y-PRIVACIDAD.md` | Cabeceras, protección de formularios y pendientes legales |
| `docs/MAPA-IMAGENES.md` | Fotografías oficiales vs. mejoradas y dónde se usa cada una |
| `docs/INTEGRACION-CONTACTO.md`, `docs/INTEGRACION-POSTULACIONES.md` | Activación de los formularios |

## Movimiento y accesibilidad

Todas las animaciones se registran con `gsap.matchMedia()`: con `prefers-reduced-motion: reduce` no hay intro, scroll suave, pin ni parallax y el contenido se muestra directamente. En táctil se usa el scroll nativo y las secciones fijadas pasan a versiones verticales sin fijar. Los revelados de texto se preparan al acercarse al viewport (no en la carga). Diálogos (menú móvil, ficha de obra) con trampa de foco y cierre con Escape.

## Formularios

Contacto y postulaciones están preparados pero **inactivos** hasta configurar un proveedor de correo autorizado (ver `docs/INTEGRACION-*.md` y `.env.example`). Nunca simulan un envío.

## Indexación

No indexable por defecto (meta robots, `X-Robots-Tag` y `robots.txt`). Solo se abre con `SITE_INDEXABLE=true` en el entorno de producción. Ver `docs/DESPLIEGUE-VERCEL.md`.
