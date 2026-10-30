# Despliegue en Vercel (preparado, **no ejecutado**)

> Estado: el proyecto compila y se sirve en modo producción en local. **No se ha creado ningún proyecto en Vercel, no se ha subido nada a GitHub y no se ha tocado el dominio `ivccontratistas.pe`.** Cada paso de esta guía requiere autorización expresa.

## 1. Requisitos verificados

| Elemento | Valor |
|---|---|
| Framework | Next.js 16.4.3 (App Router, Turbopack) — Vercel lo detecta solo |
| Node.js | `>=20.9.0` (campo `engines`). Probado en local con Node 24.21. En Vercel: **22.x o 24.x** |
| Instalación | `npm ci` (hay `package-lock.json`) |
| Compilación | `npm run build` → 40 rutas estáticas + 2 funciones (`/api/contacto`, `/api/postulacion`) |
| Directorio raíz del proyecto en Vercel | **`./`** (en este paquete `package.json` está en la raíz; no hay que cambiarlo) |
| Imágenes | `next/image` con AVIF/WebP, caché de 31 días; 40 fotografías de origen (20 originales + 20 mejoradas) |
| Fuentes | Montserrat y DM Sans autoalojadas por `next/font` (sin peticiones a Google en tiempo de ejecución) |
| `vercel.json` | No es necesario |

No hay dependencias de `localhost`: las URLs absolutas (canónicas, sitemap, Open Graph) salen de `SITE_URL`, y los formularios llaman a rutas relativas (`/api/...`).

## 2. Variables de entorno

Definirlas en **Vercel → Project → Settings → Environment Variables**. Nunca en el código.

| Variable | Production | Preview | Notas |
|---|---|---|---|
| `SITE_URL` | `https://www.ivccontratistas.pe` | (igual) | Solo genera URLs; no conecta el dominio |
| `SITE_INDEXABLE` | **vacío** hasta el lanzamiento; `true` al lanzar | nunca | Aunque se copie a Preview, el código lo ignora fuera de producción |
| `RESEND_API_KEY` | cuando IVC autorice | opcional | Clave secreta |
| `CONTACT_TO_EMAIL` | p. ej. `recepcion@ivc.pe` (confirmar) | | Destinatario de consultas |
| `CONTACT_FROM_EMAIL` | `Web IVC <web@dominio-verificado>` | | Dominio verificado en Resend |
| `CAREERS_TO_EMAIL` | buzón de selección autorizado | | Distinto del comercial |
| `CAREERS_FROM_EMAIL` | remitente verificado | | |

Sin las variables de correo, los formularios **no envían nada** y lo dicen claramente (ver `INTEGRACION-CONTACTO.md` e `INTEGRACION-POSTULACIONES.md`).

## 3. Protección contra indexación accidental

Tres capas, activas mientras `SITE_INDEXABLE` no sea `true` en producción:

1. `<meta name="robots" content="noindex, nofollow, nocache">` en todas las páginas (`lib/seo.ts`).
2. Cabecera `X-Robots-Tag: noindex, nofollow, noarchive` en **todas** las respuestas, incluidas imágenes y API (`next.config.ts`).
3. `robots.txt` con `Disallow: /` y sin sitemap (`app/robots.ts`).

Recomendación adicional para staging: mantener activada la **Vercel Deployment Protection** (está activa por defecto en las vistas previas), que exige iniciar sesión para ver la web.

## 4. Pasos de despliegue (cuando se autorice)

1. Crear el repositorio **privado** en GitHub y subir el contenido de esta carpeta (`package.json` en la raíz del repositorio) (ver `PREPARACION-GITHUB.md`).
2. En Vercel: *Add New → Project → Import* el repositorio. Framework: Next.js. Root Directory: dejar `./` (sin cambios).
3. Configurar las variables de la tabla anterior (sin `SITE_INDEXABLE`).
4. Desplegar. Se obtiene una URL `*.vercel.app` de revisión, no indexable.
5. Revisar en la URL de Vercel: rutas, formularios (deben mostrar «no activado»), cabeceras (`curl -I`), `robots.txt`.

## 5. Lanzamiento con el dominio oficial (requiere aprobación de IVC)

**No hacer todavía.** Cuando IVC apruebe el lanzamiento:

1. Añadir `www.ivccontratistas.pe` y `ivccontratistas.pe` en *Settings → Domains* y cambiar los DNS que indique Vercel. Esto **sustituye la web actual**: coordinar con IVC la migración de enlaces existentes (bolsa de trabajo, políticas en `erp-ivc.com`, formularios de denuncia) y las redirecciones de URLs antiguas que tengan tráfico.
2. Definir `SITE_INDEXABLE=true` solo en **Production** y volver a desplegar.
3. Comprobar: `robots.txt` muestra `Allow: /` y la línea `Sitemap:`; las páginas ya no llevan `noindex`; la leyenda «Versión de diseño para revisión» del pie desaparece sola.
4. Dar de alta el sitio en Google Search Console y enviar `https://www.ivccontratistas.pe/sitemap.xml`.
5. La cabecera HSTS (`max-age` de 2 años, sin `includeSubDomains`) quedará activa en el dominio.

## 6. Consideraciones de producción

- **Límite de envíos por IP**: vive en la memoria de cada función. En Vercel puede haber varias instancias, así que es orientativo; para un control estricto usar un almacén compartido (Upstash Redis / Vercel KV) o Cloudflare Turnstile.
- **Tamaño de petición**: las funciones de Vercel aceptan cuerpos de hasta 4,5 MB. Por eso el CV admite **4 MB como máximo** y la ruta rechaza peticiones de más de 4,4 MB antes de leerlas (`lib/application.ts`). Si IVC necesitara CV más pesados, habría que subirlos directamente a un almacenamiento privado con URL firmada.
- **CSP**: permite solo recursos del propio dominio. Si se añade analítica, mapas embebidos o vídeo externo, hay que ampliar la política en `next.config.ts`.
- **Optimización de imágenes**: cuenta para la cuota de transformaciones del plan de Vercel (40 fotografías de origen, varias anchuras cada una).
