# Integración de la bolsa de trabajo y las postulaciones

## Estado actual

- **Vacantes**: `data/jobs.ts` está vacío a propósito. La página muestra «Actualmente no hay ofertas publicadas», con acceso a la candidatura espontánea y a la bolsa del sitio actual (`ivccontratistas.pe/bolsaivc`).
  - Esa bolsa lista 15 puestos marcados «Activo» **sin fecha de publicación**. No se han migrado: IVC debe confirmar cuáles siguen vigentes.
- **Recepción de candidaturas: inactiva.** `GET /api/postulacion` responde `{ configured: false }` y el formulario lo avisa antes de que el usuario escriba. Si aun así pulsa «Enviar», **no se transmite ningún dato ni archivo** y se muestra «Su postulación no se ha enviado».
- La ruta `POST /api/postulacion` responde 503 `not_configured` **sin leer el cuerpo** de la petición.
- **Ejemplos de diseño**: `data/jobs.example.ts` solo se usa en `npm run dev`, mediante un enlace «Solo en desarrollo» y con rótulos «Ejemplo ficticio». No existe en la compilación de producción (comprobado).

## Seguridad implementada

| Capa | Cliente | Servidor |
|---|---|---|
| Campos obligatorios y formato (nombre, correo, teléfono, especialidad, puesto, mensaje 30–2000 caracteres) | ✓ | ✓ (`lib/application.ts`, compartido) |
| Consentimiento de datos obligatorio | ✓ | ✓ |
| CV: extensión `.pdf`, tipo `application/pdf`, entre 1 KB y 4 MB | ✓ | ✓ |
| CV: firma real del archivo (`%PDF-`) | ✓ (lee los 5 primeros bytes) | ✓ |
| CV: rechazo de PDF con acciones activas (`/JavaScript`, `/JS`, `/Launch`, `/EmbeddedFile`) | — | ✓ |
| Tamaño máximo de la petición (4,4 MB, compatible con el límite de 4,5 MB de Vercel) | — | ✓ (413) |
| Campo trampa y tiempo mínimo de cumplimentación (5 s) | ✓ | ✓ |
| Límite de 3 envíos cada 30 minutos por IP | — | ✓ (429) |
| Nombre del adjunto saneado (`CV-Nombre-Apellido.pdf`) | — | ✓ |
| **Sin almacenamiento**: el CV se procesa en memoria y se reenvía como adjunto | — | ✓ |

## Activar la recepción (requiere autorización de IVC)

1. IVC define el **buzón de selección** (distinto del comercial), el **responsable del tratamiento**, el **plazo de conservación** de los CV y el texto legal del consentimiento.
2. Verificar en el proveedor de correo (Resend por defecto) el dominio remitente.
3. Añadir a `web/.env.local`, o a las variables del hosting:

   ```bash
   RESEND_API_KEY=re_xxxxxxxx
   CAREERS_TO_EMAIL=seleccion@dominio-de-ivc
   CAREERS_FROM_EMAIL=Web IVC <web@dominio-verificado>
   ```

4. Reiniciar. El formulario detecta el canal activo y desaparece el aviso.
5. Hacer una postulación real de prueba y confirmar la recepción con IVC.

**Alternativas** (si IVC prefiere no recibir CV por correo): un ATS o la propia bolsa actual, o almacenamiento privado con cifrado y acceso restringido (por ejemplo un bucket privado con URL firmada). En ambos casos solo cambia el bloque de envío de `app/api/postulacion/route.ts`.

**Recomendaciones para producción**: mover el límite por IP a un almacén compartido, añadir Cloudflare Turnstile y un antivirus de adjuntos si el volumen lo justifica.

## Publicar una vacante

Añadir un objeto a `jobs` en `data/jobs.ts` con `validado: true`, la fecha de publicación (`publishedAt`) y, si existe, la de cierre (`closesAt`). Los filtros por ubicación y especialidad se generan solos a partir de los datos. A medio plazo conviene gestionar las vacantes desde un CMS.
