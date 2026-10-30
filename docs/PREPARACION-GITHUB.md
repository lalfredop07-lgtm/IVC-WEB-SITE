# Preparación para GitHub (preparado, **no subido**)

> No se ha creado ningún repositorio remoto ni se ha hecho `push`. La carpeta `web/` ya es un repositorio git local con un único commit inicial de Create Next App; todo el trabajo de las fases 1–3 está sin confirmar (`git status`).

## Qué se sube y qué no

`.gitignore` excluye: `node_modules/`, `.next/`, `out/`, `build/`, `coverage/`, todos los `.env*` (salvo `.env.example`), `.vercel/`, `*.tsbuildinfo`, `next-env.d.ts`, `.DS_Store`, `*.pem` y registros de npm/yarn.

Contenido rastreable (27/10/2026): **150 archivos, ~16 MB**, de los que ~13 MB son las 40 fotografías de `public/projects/`.

Revisado antes de subir:

- Sin secretos: búsqueda de claves y tokens en todo el código; solo marcadores de ejemplo en `docs/`.
- `.env.example` sin valores reales.
- Sin cachés ni artefactos de compilación.
- Las capturas de referencia de otras empresas (`docs/referencias-diseno/`) **no se incluyen en este paquete**. Aun así, se recomienda un repositorio privado hasta que IVC valide el contenido.

## Compilación desde una instalación limpia (verificada)

Se copió el contenido rastreable a una carpeta vacía y se ejecutó:

```bash
npm ci
npm run check   # typegen + tsc + eslint + next build
```

Resultado (27/10/2026): 150 archivos copiados; `npm ci` correcto en 6,7 s; `npm run check` correcto en 21,6 s (tipos, ESLint y build con las 40 rutas). npm 11 avisa de que no ejecuta el script `postinstall` de `unrs-resolver` (dependencia de ESLint) hasta aprobarlo con `npm install-scripts approve unrs-resolver`; no afecta al lint ni a la compilación.

## Subirlo (cuando se autorice)

```bash
# (el package.json está en la raíz de este paquete)
git add -A
git commit -m "Web IVC: fases 1–3"
git branch -M main
git remote add origin git@github.com:<organizacion>/<repositorio>.git   # repositorio PRIVADO
git push -u origin main
```

## Convenciones

- `main` = versión aprobada. Cambios en ramas y revisión antes de fusionar.
- Antes de cada fusión: `npm run check`.
- Contenido nuevo (obras, vacantes) solo en `data/` y con datos validados por IVC (`validado: true` en vacantes).
