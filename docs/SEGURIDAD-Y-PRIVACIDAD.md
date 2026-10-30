# Seguridad y privacidad

Estado a 27/10/2026. Este documento describe **lo implementado técnicamente** y **lo que falta validar**. No es una opinión legal ni una declaración de cumplimiento normativo.

## 1. Medidas técnicas implementadas

### Cabeceras HTTP (`next.config.ts`, todas las rutas)

| Cabecera | Valor | Protege frente a |
|---|---|---|
| `Content-Security-Policy` | Solo recursos del propio dominio; `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` | Inyección de scripts externos, clickjacking, exfiltración |
| `X-Frame-Options` | `DENY` | Clickjacking (navegadores antiguos) |
| `X-Content-Type-Options` | `nosniff` | Interpretación errónea de tipos MIME |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuga de rutas internas a terceros |
| `Permissions-Policy` | cámara, micrófono, geolocalización, pagos, USB y Topics desactivados | Uso indebido de APIs del navegador |
| `Cross-Origin-Opener-Policy` | `same-origin` | Ataques entre ventanas |
| `Strict-Transport-Security` | 2 años, sin subdominios (solo producción) | Degradación a HTTP |
| `X-Robots-Tag` | `noindex, nofollow, noarchive` mientras no se lance | Indexación accidental |
| `X-Powered-By` | eliminada | Revelar la tecnología del servidor |

Limitación conocida: la CSP admite `'unsafe-inline'` en scripts porque Next.js inserta scripts de arranque en línea. Eliminarlo exige nonces por petición, lo que obligaría a renderizar cada página bajo demanda y perder el HTML estático. No se permite ningún dominio externo de scripts.

### Rutas API (`/api/contacto`, `/api/postulacion`)

- **Origen**: solo aceptan peticiones `POST` hechas desde la propia web (cabecera `Origin` = dominio); el resto recibe 403.
- **Tamaño**: contacto ≤ 16 KB; postulación ≤ 4,4 MB, comprobado antes de leer el cuerpo.
- **Validación en servidor** de todos los campos, con las mismas reglas que el navegador (`lib/contact.ts`, `lib/application.ts`).
- **Saneado**: caracteres de control eliminados; los campos de una línea (nombre, correo, asunto) no admiten saltos de línea. El correo debe ser una dirección simple (sin listas, comillas ni `<>`).
- **Antispam**: campo trampa invisible, tiempo de cumplimentación plausible (entre 3–5 s y 24 h) y límite por IP (5 mensajes cada 10 min; 3 postulaciones cada 30 min) con purga automática de memoria.
- **CV**: solo PDF, de 1 KB a 4 MB, firma real `%PDF-`, y rechazo de PDF con acciones activas (`/JavaScript`, `/JS`, `/Launch`, `/EmbeddedFile`).
- **Sin configuración, no hay tratamiento**: si faltan las credenciales, la postulación responde 503 **sin leer el cuerpo** y el contacto no envía nada. Nunca se muestra una confirmación falsa.
- **Respuestas** con `Cache-Control: no-store`. Los registros de error no incluyen datos personales.

### Secretos y datos

- Las credenciales solo se leen en el servidor (`process.env`, sin prefijo `NEXT_PUBLIC_`). `.env*` está excluido de git salvo `.env.example`, que no contiene valores.
- Revisión del código (27/10/2026): no hay claves, tokens ni contraseñas en el repositorio. Solo marcadores de ejemplo (`re_xxxxxxxx`) en la documentación.
- La web **no usa cookies**, analítica ni servicios de terceros. Solo guarda `ivc-intro` en `sessionStorage` (si ya se vio la pantalla de entrada), un dato técnico no personal que se borra al cerrar la pestaña.
- Los datos de contacto que se publican son los corporativos que IVC ya muestra en su web (correo, teléfonos, dirección, RUC). No se publica ningún dato personal de trabajadores.
- `npm audit --omit=dev`: 0 vulnerabilidades (27/10/2026).

## 2. Pendientes de privacidad para operar en Perú (validar con asesoría legal de IVC)

La web **no recoge datos personales mientras los formularios estén inactivos**. Antes de activarlos, IVC y su asesoría legal deben revisar al menos:

1. **Marco aplicable**: Ley N.° 29733, de Protección de Datos Personales, y su reglamento vigente (confirmar la versión aplicable; el D.S. N.° 016-2024-JUS sustituyó al D.S. N.° 003-2013-JUS).
2. **Bancos de datos**: si las consultas y los CV constituyen bancos de datos personales que deban inscribirse en el Registro Nacional de Protección de Datos Personales (Autoridad Nacional de Protección de Datos Personales).
3. **Deber de información y consentimiento**: textos específicos para cada formulario (identidad y domicilio del titular del banco, finalidad, destinatarios, plazo de conservación, transferencias y cómo ejercer los derechos de acceso, rectificación, cancelación y oposición). Hoy los formularios enlazan a la política de privacidad del sitio actual, que debe revisarse para cubrir estos tratamientos, en particular los CV.
4. **Transferencia internacional**: el proveedor de correo propuesto (Resend) y el alojamiento (Vercel) procesan datos fuera del Perú. Validar los requisitos del flujo transfronterizo y los contratos con los encargados del tratamiento.
5. **Plazos de conservación** de consultas y CV en el buzón de destino, y procedimiento de borrado.
6. **Medidas de seguridad** en el destino (buzón de selección con acceso restringido y autenticación reforzada).
7. **Política de privacidad propia** de la nueva web (`/privacidad`). No se ha redactado: requiere texto legal aprobado por IVC.
8. **Libro de Reclamaciones virtual**: confirmar si es exigible a IVC según su actividad (normativa de protección al consumidor).
9. **Canales de denuncia** (antisoborno y hostigamiento sexual): la web solo enlaza los formularios oficiales existentes; su tratamiento de datos es responsabilidad de esos canales.

## 3. Recomendaciones para producción

- Límite por IP en un almacén compartido (Upstash Redis / Vercel KV) o Cloudflare Turnstile, porque en Vercel hay varias instancias.
- Antivirus de adjuntos si el volumen de CV lo justifica.
- Mantener la Deployment Protection de Vercel en los entornos de vista previa.
- Revisar `npm audit` antes de cada despliegue y actualizar Next.js en versiones de parche.
