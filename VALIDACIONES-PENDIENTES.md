# Validaciones pendientes — Web IVC (Fases 1 a 3)

Lista viva de datos, textos y decisiones que IVC debe confirmar antes de publicar. Nada se ha inventado: lo no verificado está marcado en la interfaz («En validación», «Pendiente de validación por IVC», «Pendiente de incorporación») o vive en `data/` con valor `null`.

Fuentes consultadas el 27/10/2026: brief del paquete y páginas oficiales `ivccontratistas.pe` (nosotros, valores, certificaciones, políticas corporativas, responsabilidad social). Instagram (`@ivc_contratistas`) solo se enlaza: no se ha extraído contenido.

## Bloqueantes para el lanzamiento (resumen)
1. Aprobación de las 20 imágenes mejoradas con IA (o sustitución por fotografías oficiales) y autorización de imagen de las personas identificables (fotos 15, 16 y 20).
2. Datos de las obras: nombre oficial, cliente, periodo, estado y alcance.
3. Destinatario y textos legales de los formularios (contacto y postulaciones) y política de privacidad propia. Ver `docs/SEGURIDAD-Y-PRIVACIDAD.md`.
4. Confirmación de datos corporativos (correo, teléfonos, dirección) y de los textos institucionales propuestos.
5. Decisión de lanzamiento: dominio, DNS y activación de la indexación (`docs/DESPLIEGUE-VERCEL.md`).

## Marca
- [ ] Logo vectorial (SVG/AI/EPS) y manual de marca. Se usa el PNG oficial de 229 × 101 px sin modificar (`public/brand/logo-ivc.png`, idéntico byte a byte a `assets/logo/LOGO-OFICIAL-IVC-USAR-ESTE.png`).
- [ ] Favicon derivado (logo completo sobre `#00284A`, sin recortar). Un isotipo oficial lo mejoraría.
- [ ] Paleta: solo `#00284A` está observado en la marca; `#07528A`, `#A7CFE6`, `#00121F` y `#F4F6F8` son propuestas.
- [ ] Tipografías: Montserrat (titulares, con acento en peso ligero 300 y color) y DM Sans (texto). Sin cursivas en ningún elemento (decisión de diseño del 27/10/2026).

## Textos propuestos (redactados para la maqueta)
- [ ] Home: frase del hero, manifiesto, resúmenes de especialidades, tarjetas de acceso y de compromiso.
- [ ] Portadas interiores: «Ingeniería peruana con trayectoria», «Obras que construyen bienestar», «Calidad, seguridad y responsabilidad», «Conversemos sobre su proyecto», «Integridad en cada decisión».
- [ ] Nosotros: «Una constructora peruana dedicada a la ingeniería», «Solidez que se puede comprobar», títulos de las etapas de la trayectoria.
- [ ] Compromiso: textos de los cuatro ejes del sistema de gestión (derivados de la misión y de la página de certificaciones) y «Obras que mejoran la calidad de vida».
- [ ] Fichas de proyecto: la «Presentación» se compone solo con datos confirmados (nombre de trabajo, especialidad, región, alcance de la línea de negocio). Sustituir por descripción, contexto y objetivo reales cuando IVC los entregue.
- [ ] **Nuevo en Fase 3 — `/especialidades`**: portada «Ingeniería para cada territorio», intro «Cinco especialidades, un mismo compromiso» y la frase «Cada línea de negocio reúne las obras del portafolio publicado por IVC». El recuento «N obras en el portafolio» se calcula desde `data/projects.ts` (fichas de esta web), no es una cifra corporativa.
- [ ] Nombres comerciales exactos y orden de prioridad de las cinco especialidades (hoy, los del brief).
- [ ] Títulos SEO y metadescripciones de cada página (`app/**/page.tsx`): redactados a partir de contenido ya publicado, sin palabras clave ni ubicaciones inventadas.

## Contenido institucional usado (verificado en ivccontratistas.pe)
- Inicio de actividades en febrero de 1988 «como una empresa de servicios de ingeniería»; «una ubicación expectante en el campo de la construcción».
- Misión y visión (página Nosotros); valores con su descripción (página Valores). La descripción de Integridad se normalizó ligeramente («Ser transparentes, honestos, leales; tener identidad»): confirmar redacción.
- ISO 9001, 14001, 45001 y 37001 como parte de su «Sistema de Gestión». **La web oficial no indica entidad certificadora, fecha ni alcance: no se muestran sellos.**
- 9 políticas corporativas y 2 canales de denuncia (enlaces oficiales).
- Responsabilidad social: paráfrasis de la página oficial. No se reproduce el caso personal de un menor que aparece en esa página.

## Trayectoria (Nosotros)
- [ ] Solo 1988 tiene fecha en las fuentes. La cronología no muestra años intermedios: el contador se atenúa en la etapa sin fecha y solo cuenta hasta el año actual en «Hoy». Si IVC aporta hitos fechados, se pueden añadir en `components/about/Timeline.tsx`.
- [ ] Equipo humano: no hay información de directivos, profesionales ni capacidad operativa. La página lo indica expresamente.

## Proyectos (`data/projects.ts`) — 19 fichas con URL propia
- [ ] Nombre oficial, cliente/entidad, periodo, estado, modalidad de participación y alcance de cada obra (hoy `null`). La ficha muestra solo lo confirmado y lista lo pendiente.
- [ ] Fuente: fotos 01–10 enlazan a su galería oficial (documentado en `FUENTES-IMAGENES-PRIMERAS-10.md`). Para 11–20 la página de origen no está documentada.
- [ ] 04 y 11 agrupadas como «Las Casuarinas de Ica»; 15 y 16 (SJL) separadas: confirmar.
- [ ] 09 «Infraestructura vial» sin nombre de obra ni ubicación.
- [ ] 17 DIRMIN, 18 DISCAMEC y 20 Carhuaquero II: región sin confirmar.
- [ ] 14 Galerías filtrantes: ubicada en la región Ica (Chincha).
- [ ] Contadores del portafolio: 19 fichas, 5 especialidades y 5 regiones identificadas se calculan desde los datos de la web, no son cifras corporativas.
- [ ] **Imágenes mejoradas con IA**: se identifican como «visualización mejorada»; cada ficha incluye un comparador con la fotografía original. Requieren aprobación expresa o sustitución antes del lanzamiento.
- [ ] Los «encuadres de detalle» de cada ficha son recortes de la misma fotografía publicada.
- [ ] Autorización de uso de las 20 fotografías y de las personas identificables (15, 16, 20).

## Transparencia
- [ ] **Documentos en `erp-ivc.com`**: el servidor presenta una cadena de certificado SSL incompleta (falta el certificado intermedio). Chrome suele abrirlos, pero otros navegadores o clientes pueden mostrar error. Recomendación: que IVC corrija el certificado o entregue los PDF para alojarlos en la nueva web.
- [ ] Biblioteca documental preparada (certificados ISO, códigos de ética, informes, manuales) **sin documentos**: se rellenará con lo que IVC aporte.
- [ ] Revisión legal de la página y de los canales de denuncia antes de publicar.

## Contacto
- [ ] Confirmar correo `recepcion@ivc.pe`, teléfonos (+51 1) 437-8385 / 437-4482 y dirección.
- [ ] **Formulario**: integración preparada pero **inactiva** hasta configurar un proveedor (ver `docs/INTEGRACION-CONTACTO.md`). Sin configuración avisa de que el mensaje no se ha enviado y ofrece un borrador por correo.
- [ ] Destinatario de las consultas, tratamiento de datos y texto de privacidad específico del formulario (hoy enlaza a la política de privacidad del sitio actual).
- [ ] Tipos de consulta del formulario (propuesta): obra pública, obra privada, proveedores y alianzas, información institucional, otra.

## Trabaja con nosotros (`/trabaja-con-nosotros`)
- [ ] **Fichas de vacante** (`/trabaja-con-nosotros/[slug]`, nuevo en Fase 3): se generan solas para cada vacante con `validado: true`, con datos estructurados `JobPosting` para Google. Hoy no existe ninguna en producción. Para cada vacante IVC debe aportar título, ubicación, área, modalidad, resumen, descripción, requisitos, fecha de publicación y, si aplica, fecha de cierre.
- [ ] **Tamaño máximo del CV: 4 MB** (antes 5 MB). Necesario porque las funciones de Vercel aceptan 4,5 MB por petición. Confirmar que es suficiente o prever subida directa a almacenamiento privado.
- [ ] **Vacantes**: no se publica ninguna. La bolsa actual (`ivccontratistas.pe/bolsaivc`) lista 15 puestos «Activo» sin fecha (arqueólogo, ingeniero/a de seguridad, de medio ambiente, residente, sanitario, mecánico eléctrico, jefe de proyecto, entre otros). IVC debe confirmar cuáles siguen vigentes, con ubicación, modalidad, requisitos y fecha.
- [ ] **Recepción de CV inactiva**: buzón de selección, responsable del tratamiento, plazo de conservación y texto de consentimiento (ver `docs/INTEGRACION-POSTULACIONES.md`).
- [ ] Lista de especialidades profesionales del formulario (propuesta en `data/jobs.ts`).
- [ ] Textos propuestos: «Construyamos bienestar juntos», «Compromisos con quienes construyen», «Cinco valores que compartimos».
- [ ] Los paneles de compromisos enlazan a políticas reales publicadas (igualdad y equidad de género, no discriminación a la mujer, empleabilidad) y a ISO 45001. No se describen beneficios laborales: no hay información verificada.
- [ ] Fotografías de personas (15, 16, 20): autorización de uso de imagen.
- [x] Navegación: «Trabaja con nosotros» está en la barra superior (a petición del cliente, 30/10/2026), el footer, el menú móvil y Nosotros.

## Privacidad y textos legales (ver `docs/SEGURIDAD-Y-PRIVACIDAD.md`)
- [ ] Revisión por la asesoría legal de IVC de los tratamientos de datos de ambos formularios (Ley N.° 29733 y su reglamento vigente): deber de información, consentimiento, inscripción de bancos de datos, plazos de conservación y transferencia internacional (proveedor de correo y alojamiento fuera del Perú).
- [ ] Política de privacidad propia de la nueva web (`/privacidad`). Hoy se enlaza la del sitio actual, que debe cubrir también el tratamiento de CV.
- [ ] Confirmar si aplica Libro de Reclamaciones virtual a la actividad de IVC.
- [ ] Cookies: la web no usa cookies ni analítica. Si IVC quiere analítica, definir herramienta y aviso de cookies antes de instalarla.

## SEO y datos estructurados (Fase 3)
- [ ] Datos estructurados `GeneralContractor` con razón social, RUC, fundación (1988-02), correo, teléfonos, dirección e Instagram, todos tomados de la web oficial. Confirmar antes de indexar.
- [ ] Imagen para redes sociales (Open Graph): hoy se usa la portada de cada página (versiones mejoradas). Puede sustituirse por una pieza aprobada por IVC.
- [ ] Redirecciones desde las URLs del sitio actual (`/nosotros/`, `/bolsaivc/`, `/certificaciones/`, etc.) a la nueva estructura, para no perder enlaces al cambiar de dominio.

## Técnico y lanzamiento
- [x] `noindex` activo mientras sea versión de revisión: meta robots, cabecera `X-Robots-Tag` y `robots.txt` con `Disallow: /`. Se desactiva solo con `SITE_INDEXABLE=true` en producción.
- [x] Sitemap y robots de producción preparados (`app/sitemap.ts`, `app/robots.ts`): se publican solos al activar la indexación.
- [ ] Dominio y DNS: **no tocar** hasta la aprobación de IVC. Coordinar el reemplazo del sitio actual.
- [ ] Documentos en `erp-ivc.com`: el certificado SSL incompleto puede dar error en algunos navegadores (ver Transparencia).
- [ ] Pendientes de fases futuras: `/actualidad` (sin noticias verificadas), `/privacidad` propia, CMS para proyectos y vacantes si IVC lo requiere.

## Experiencia móvil (auditoría del 30/10/2026)
- [ ] **Prueba en dispositivos físicos**: la auditoría se hizo con emulación en Chrome (320, 360, 375, 402, 430 y 768 px, vertical y horizontal). Falta verificar en un iPhone real con Safari (barra inferior, área segura, arrastre del comparador antes/después, carrusel de obras) y en un Android de gama media.
- [ ] **LCP móvil 3,6–5,3 s** en Lighthouse (Moto G simulado, 4G lenta): lo marca la entrada cinematográfica aprobada (pantalla de carga + revelado del titular). CLS 0, peso 470–640 KB. Si IVC prioriza la velocidad, se puede acortar la entrada en móvil.

