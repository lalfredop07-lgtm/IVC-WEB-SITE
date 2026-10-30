# Validación del paquete para Vercel

Fecha: 30/10/2026 · Equipo: macOS, Node 24.21.0, npm 11.19.0 · Carpeta validada: `IVC-VERCEL-READY` (esta copia)

## Diagnóstico

- **No se dispone de los Build Logs del despliegue fallido en Vercel**, así que la causa original del fallo **no se ha
  podido confirmar**. No se afirma ninguna causa como cierta.
- El proyecto original (`IVC-CLAUDE-OPUS55-PACK-V2-REFERENCIAS/web`) **compila sin errores** en local. Por tanto no se
  encontraron errores de código que corregir. No hubo cambios de código ni de diseño para este paquete.
- Hipótesis más probable (no verificada): la aplicación estaba anidada (`…/IVC-CLAUDE-OPUS55-PACK-V2-REFERENCIAS/web`),
  de modo que Vercel no encontraba el `package.json` en la raíz del repositorio. Este paquete lo deja en la raíz.
- Revisado y sin hallazgos: `next.config.ts`, scripts, dependencias, alias `@/*` (`tsconfig.json`), imports (ninguna
  ruta absoluta ni `../../..` fuera del proyecto), `generateStaticParams`, variables de entorno (todas opcionales).
- Nota: las fuentes (`next/font/google`) se descargan **durante el build**; Vercel tiene red, por lo que no es problema.

## Cambios hechos al preparar la copia (el original no se ha tocado, movido ni borrado)

- `package.json` en la raíz (copiado el contenido de `web/` a la raíz de `IVC-VERCEL-READY`).
- Excluidos: `node_modules`, `.next`, `.git`, `*.tsbuildinfo`, `next-env.d.ts` (se regenera), `.env*` (salvo `.env.example`),
  `.DS_Store`, `AGENTS.md`.
- Excluida `docs/referencias-diseno/` (2 capturas de webs de **otras empresas**; no son recursos de la web).
- Docs internas actualizadas (`README.md`, `docs/DESPLIEGUE-VERCEL.md`, `docs/PREPARACION-GITHUB.md`, `docs/MAPA-IMAGENES.md`)
  para reflejar que `package.json` está en la raíz.
- Añadidos `INSTRUCCIONES-VERCEL.md` y este archivo.

## Pruebas ejecutadas sobre la copia (carpeta vacía de `node_modules`)

| Comando | Resultado |
|---|---|
| `npm ci` | Correcto con `package-lock.json`. Aviso informativo: npm 11 no ejecuta el `postinstall` de `unrs-resolver` (dependencia de ESLint); no afecta |
| `npm run typecheck` (`next typegen && tsc --noEmit`) | Sin errores |
| `npm run lint` (`eslint`) | Sin errores ni avisos |
| `npm run build` (`next build`, Next.js 16.4.3 Turbopack) | **Correcto**: compilado, TypeScript OK, 40/40 páginas generadas |
| `npm audit --omit=dev` | 0 vulnerabilidades en dependencias de producción |
| `npm audit` (completo) | 16 avisos *moderate*, todos en herramientas de desarrollo (cadena de ESLint → `minimatch`); no entran en el sitio publicado |
| `next start` + `curl` | `/`, `/nosotros`, `/especialidades`, `/especialidades/hidraulica`, `/proyectos`, ficha de proyecto, `/compromiso`, `/transparencia`, `/contacto`, `/trabaja-con-nosotros`, `/robots.txt`, `/sitemap.xml` → **200**; ruta inexistente → **404** |
| Fichas de proyecto | Las 19 fichas → 200 |
| Imágenes (`/_next/image`) | 424 URLs optimizadas distintas enlazadas desde las páginas probadas → **424 × 200, 0 fallos** |
| `POST /api/contacto` con cuerpo vacío | Responde `bad_request` (validación); sin variables de correo no envía nada |
| Cabeceras | `Content-Security-Policy`, `X-Frame-Options: DENY` y `X-Robots-Tag: noindex…` presentes |

Verificación del ZIP: se extrajo en otra ubicación y es idéntico a la carpeta (`diff -r` sin diferencias, `unzip -t` sin errores);
`npm ci`, `npm run typecheck` y `npm run lint` pasaron sobre esa copia extraída. El `npm run build` sobre la copia extraída **no pudo
terminar por falta de espacio en disco del equipo** (error `No space left on device`, ajeno al proyecto), por lo que el build
correcto citado arriba es el de la carpeta, cuyos fuentes son idénticos a los del ZIP.

Rutas generadas: `/`, `/nosotros`, `/especialidades` + 5 fichas, `/proyectos` + 19 fichas, `/compromiso`, `/contacto`,
`/transparencia`, `/trabaja-con-nosotros`, `/robots.txt`, `/sitemap.xml`, iconos, y 2 funciones (`/api/contacto`, `/api/postulacion`).
Las rutas dinámicas de vacantes (`/trabaja-con-nosotros/[slug]`) existen pero no generan páginas: no hay vacantes publicadas.

## Recursos incluidos

- `public/brand/logo-ivc.png` (logo oficial) y 40 fotografías: `public/projects/enhanced` (20) y `public/projects/originals` (20).
  Se comprobó que **cada archivo de `public/` está referenciado por el código** (no hay archivos sobrantes) y ninguno falta.
- Fuentes: Montserrat, DM Sans e Instrument Serif vía `next/font` (sin archivos locales).
- `app/icon.png`, `app/apple-icon.png`.

## Dependencias de producción

`next 16.4.3`, `react 19.3.0`, `react-dom 19.3.0`, `gsap ^3.15.0`, `@gsap/react ^2.1.2`, `lenis ^1.3.27`, `motion ^14.7.1`.
Desarrollo: `tailwindcss ^4`, `@tailwindcss/turbopack ^4`, `typescript ^5`, `eslint ^9`, `eslint-config-next 16.4.3`, tipos.

## Integraciones pendientes

- Formularios de contacto y postulación: **inactivos** hasta configurar Resend y los buzones autorizados por IVC (ver `.env.example`, `docs/`).
- `SITE_INDEXABLE`: vacío hasta el lanzamiento aprobado. Dominio oficial: sin tocar.
- Validaciones de contenido de IVC pendientes: ver `VALIDACIONES-PENDIENTES.md`.
- Prueba en Vercel real: **no realizada** (no se conectó ninguna cuenta). Lo verificado es el build y el servidor de producción en local.
