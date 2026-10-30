# Instrucciones para publicar la web de IVC en Vercel

Esta carpeta (`IVC-VERCEL-READY`) es el proyecto completo. **El `package.json` está en la raíz**, así que Vercel
lo detecta sin configurar un «Root Directory».

> Nada se ha publicado, subido a GitHub ni conectado a Vercel. El dominio `ivccontratistas.pe` no se ha tocado.

## Ajustes que debe tener el proyecto en Vercel

| Ajuste | Valor |
|---|---|
| Framework Preset | **Next.js** (se detecta solo) |
| Root Directory | **`./`** (déjalo vacío / por defecto) |
| Build Command | por defecto (`npm run build`, es decir `next build`) |
| Install Command | por defecto (Vercel usa `npm ci` por el `package-lock.json`) |
| Output Directory | por defecto (**no** escribir `out` ni `dist`; Next.js usa `.next`) |
| Node.js Version | **24.x** (o 22.x). El proyecto exige `>=20.9.0` y se probó con 24.21 |
| Variables de entorno | ver más abajo (ninguna es obligatoria para que la web cargue) |

No hay `vercel.json` y no hace falta. **No** se usa `output: "export"`: la web tiene dos funciones de servidor
(`/api/contacto` y `/api/postulacion`) que necesitan el entorno de Next.js.

## OPCIÓN A — GitHub + Vercel (recomendada)

1. En GitHub crea un repositorio **privado** nuevo, vacío (sin README ni `.gitignore`), p. ej. `ivc-web`.
2. Sube el **contenido** de `IVC-VERCEL-READY` (no la carpeta en sí), de modo que `package.json` quede en la raíz
   del repositorio:
   - Con la web de GitHub: *Add file → Upload files* y arrastra todo el contenido **incluidas las carpetas**
     (`app`, `components`, `data`, `lib`, `public`, `docs`) y los archivos sueltos (`package.json`,
     `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `.env.example`, …).
     Los archivos que empiezan por punto (`.gitignore`, `.env.example`) están ocultos en macOS: pulsa
     `Cmd + Shift + .` en el Finder para verlos.
   - O con la terminal, desde dentro de la carpeta:
     ```bash
     git init -b main
     git add -A
     git commit -m "Web IVC"
     git remote add origin git@github.com:<usuario>/ivc-web.git
     git push -u origin main
     ```
3. Comprueba en GitHub que **`package.json` se ve en la primera pantalla del repositorio**, sin entrar en carpetas.
   Si está dentro de una carpeta, ese es el error típico («No Next.js version detected» / «Module not found»).
4. En Vercel: *Add New… → Project → Import* el repositorio. Verifica la tabla de ajustes de arriba y
   añade las variables de entorno (sección siguiente). Pulsa **Deploy**.
5. Se obtiene una URL `*.vercel.app` de revisión. Mientras `SITE_INDEXABLE` esté vacío la web **no es indexable**
   (meta `noindex`, cabecera `X-Robots-Tag` y `robots.txt` con `Disallow: /`).

## OPCIÓN B — Vercel CLI, sin GitHub

Es compatible con este proyecto. Requiere Node.js y una cuenta de Vercel.

```bash
cd IVC-VERCEL-READY
npx vercel            # primera vez: inicia sesión, crea el proyecto y hace un despliegue de PREVIEW
# Cuando la vista previa sea correcta, y solo con autorización de IVC:
npx vercel --prod
```

Responde a las preguntas: *Set up and deploy?* Yes · *Link to existing project?* No · *Directory?* `./` ·
*Modify settings?* No (Vercel detecta Next.js). La CLI sube los archivos locales y respeta el `.gitignore`
(no sube `node_modules`, `.next` ni `.env*`).

## Variables de entorno (Vercel → Project → Settings → Environment Variables)

Los nombres están en `.env.example`. **Ninguna es necesaria para que el sitio compile y se muestre.**

| Variable | Qué hace | Cuándo |
|---|---|---|
| `SITE_URL` | Dominio público para URLs canónicas, sitemap y Open Graph. Por defecto `https://www.ivccontratistas.pe` | Opcional; poner la URL de revisión si se quiere |
| `SITE_INDEXABLE` | `true` permite indexar (solo en Production) | **Dejar vacío** hasta el lanzamiento aprobado por IVC |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Envío del formulario de contacto | Solo cuando IVC autorice y verifique el dominio en Resend. Ver `docs/INTEGRACION-CONTACTO.md` |
| `CAREERS_TO_EMAIL`, `CAREERS_FROM_EMAIL` | Recepción de postulaciones | Solo con buzón autorizado. Ver `docs/INTEGRACION-POSTULACIONES.md` |

Sin las variables de correo, los formularios **no envían nada y lo indican claramente al usuario** (no simulan envíos).
Nunca escribas valores reales en el repositorio: solo en el panel de Vercel.

## Cómo comprobar el resultado

1. En *Deployments*, el estado debe ser **Ready**. Si falla, abre el despliegue → *Build Logs* y guarda el texto del error.
2. Abre la URL `*.vercel.app` y recorre: `/`, `/nosotros`, `/especialidades`, `/proyectos` (y una ficha),
   `/compromiso`, `/transparencia`, `/contacto`, `/trabaja-con-nosotros`.
3. Comprueba que se ven las fotografías, el logo y las animaciones, y que los formularios muestran el aviso de
   «envío no activado» en lugar de fingir un envío.
4. `curl -I https://<tu-url>.vercel.app/` debe mostrar `X-Robots-Tag: noindex…` y `Content-Security-Policy`.
5. `https://<tu-url>.vercel.app/robots.txt` debe contener `Disallow: /`.

## Lo que NO hacer todavía

- No añadir el dominio `ivccontratistas.pe` en Vercel ni cambiar sus DNS: sustituiría la web actual. Ver `docs/DESPLIEGUE-VERCEL.md`, sección 5.
- No poner `SITE_INDEXABLE=true` antes del lanzamiento aprobado.
- Mantener el repositorio **privado**: las fotografías mejoradas con IA y los datos de `VALIDACIONES-PENDIENTES.md` aún no están validados por IVC.

## Si el despliegue vuelve a fallar

Envíame el texto completo de *Build Logs* del despliegue fallido. Sin él no se puede saber la causa real;
las más habituales en este tipo de proyecto son: `package.json` dentro de una subcarpeta (Root Directory mal puesto),
subir el ZIP sin descomprimir, Output Directory forzado a `out`/`dist`, o Node.js menor que 20.9.
