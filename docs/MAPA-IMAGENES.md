# Mapa de imágenes: oficiales y mejoradas

Identificación interna de cada fotografía de la web. Correspondencia de obras según `documentacion/MAPA-DE-ACTIVOS.md` del paquete; nunca se asigna una foto a otro proyecto.

## Dos carpetas, dos naturalezas

| Carpeta | Qué contiene | Uso en la web | Cómo se rotula |
|---|---|---|---|
| `public/projects/originals/` | **Fotografías oficiales** descargadas del sitio de IVC (19 JPG + 1 PNG). Sin retoque. | Comparador «Original y visualización mejorada» de cada ficha de obra y botón «Fotografía original» de la ficha ampliada (Home). | «Fotografía original publicada por IVC» |
| `public/projects/enhanced/` | **Propuestas retocadas con IA** (WebP 1653 × 951) a partir de las originales. **No son documentación exacta de la obra.** | Portadas, galerías, tarjetas y fondos (dirección de arte). | «Propuesta visual» / «Visualización mejorada» en portadas, fichas y comparador |

En el código, cada fotografía de obra es un `ProjectPhoto` (`data/projects.ts`) con dos rutas separadas: `enhanced` y `original`. Las PNG de mayor peso del paquete (`assets/imagenes-mejoradas-png/`) tienen la misma resolución que los WebP, así que no aportan calidad adicional y no se publican.

**Antes del lanzamiento:** IVC debe aprobar expresamente el uso de las versiones mejoradas o sustituirlas por fotografías oficiales en alta resolución (ver `VALIDACIONES-PENDIENTES.md`).

## Optimización aplicada

- Todas se sirven con `next/image`: AVIF o WebP según el navegador, anchura ajustada a cada pantalla (`sizes` por componente) y caché de 31 días.
- Calidad 80 en portadas y revelados, 70 en el muro de miniaturas del portafolio. No se recomprimen los archivos de origen.
- Las portadas cargan con prioridad alta (`loading="eager"`, `fetchPriority="high"`); el resto, en diferido. Las miniaturas visibles del muro de `/proyectos` cargan sin diferir.
- Sin saltos de maquetación: todas las imágenes usan contenedores con proporción fija (`aspect-*` o altura definida) y `fill`.
- El original 01 pesa 3,4 MB (3008 × 1729): el optimizador lo reduce al servirlo; no se ha modificado el archivo oficial.

## Uso por fotografía (versión mejorada)

`data/projects` = ficha de la obra, tarjetas del portafolio, muro de la portada de `/proyectos` y comparador (con su original).

| N.º | Archivo | Obra (etiqueta de trabajo) | Dónde aparece además de su ficha |
|---|---|---|---|
| 01 | `01-reservorio-picasso-ica` | Reservorio Estadio Picasso Peratta | Hero de la Home, imagen Open Graph por defecto |
| 02 | `02-saneamiento-nana-lima` | Agua y alcantarillado del esquema Ñaña | Manifiesto (Home), Misión (Nosotros) |
| 03 | `03-riego-la-achirana-ica` | Sistema de Riego La Achirana | Especialidad Hidráulica, portada de `/especialidades`, dial de Compromiso |
| 04 | `04-urbanizacion-las-casuarinas-ica` | Las Casuarinas de Ica | Especialidad Habilitaciones urbanas |
| 05 | `05-centro-industrial-la-chutana` | Centro Industrial La Chutana | Portada de Nosotros |
| 06 | `06-universidad-san-luis-gonzaga` | Facultades UNSLG | Nosotros (Home), Compromiso, Trabaja con nosotros |
| 07 | `07-hospital-santa-maria-socorro` | Hospital Santa María del Socorro | Especialidad Edificaciones, Trabaja con nosotros |
| 08 | `08-central-carhuaquero` | Central Hidroeléctrica Carhuaquero IV | Especialidad Energía, portada de Compromiso |
| 09 | `09-infraestructura-vial-ivc` | Infraestructura vial (sin obra identificada) | Especialidad Transporte, cierre de Nosotros |
| 10 | `10-agua-potable-paita` | Agua potable de Paita | Banda «Conversemos» (Home, Proyectos, Especialidades) |
| 11 | `11-casuarinas-ica` | Las Casuarinas de Ica (2.ª foto) | Responsabilidad social, Trabaja con nosotros |
| 12 | `12-san-carlos-ica` | San Carlos | Solo su ficha |
| 13 | `13-sector62-chilca` | Sector 62, Chilca | Portada de Contacto, Manifiesto |
| 14 | `14-galerias-filtrantes-chincha` | Galerías filtrantes de Chincha | Manifiesto, Trayectoria, Postulación |
| 15 | `15-agua-sjl-lima` | Agua en San Juan de Lurigancho | Nosotros (Home), Compromiso, Trabaja con nosotros, fichas de vacante — **personas identificables** |
| 16 | `16-linea-conduccion-sjl` | Línea de conducción SJL | Portada de Trabaja con nosotros, Contacto (Home), Trayectoria — **persona identificable** |
| 17 | `17-edificio-dirmin` | Edificio DIRMIN | Dial de Compromiso |
| 18 | `18-edificio-discamec` | Edificio DISCAMEC | Portada de Transparencia, Visión (Nosotros) |
| 19 | `19-pnp-ayacucho` | Infraestructura PNP Ayacucho | Trayectoria |
| 20 | `20-carhuaquero-ii` | Carhuaquero II | Manifiesto, Capacidad, Trabaja con nosotros — **personas identificables** |

## Otros recursos gráficos

| Archivo | Origen | Nota |
|---|---|---|
| `public/brand/logo-ivc.png` | Logo oficial (229 × 101), idéntico byte a byte a `assets/logo/LOGO-OFICIAL-IVC-USAR-ESTE.png` | Nunca se recolorea ni deforma |
| `app/icon.png`, `app/apple-icon.png` | Derivados del logo completo sobre `#00284A` | Pendiente de isotipo oficial |
| _(las capturas de referencia de otras empresas no se incluyen en este paquete)_ | — | — |
