# Malla Pedagogía en Inglés PUCV — v3.1.0

Sitio estático para GitHub Pages.

## Novedades v3.1
- Ramos personales: FOFUs, optativos y otros.
- Sigla, nombre, créditos, semestre real, estado, nota y comentario.
- Minor seleccionable con catálogo oficial de FOFUs PUCV.
- Progreso del Minor y requisitos de Antropología / Ética.
- Semestres referenciales de la malla: FOFU 1/2/3 → 5°/6°/9°; Optativos 1/2/3/4 → 2°/5°/7°/9°.
- Los cursos personales se incluyen en backup, filtros, búsqueda, planificación e impresión.
- Corrección visual del botón de cierre y conservación de la interacción v3.0.2.

## Publicar
Sube **todos** estos archivos y la carpeta `assets/` a la raíz del repositorio. GitHub Pages debe apuntar a `main` / `(root)`.

## Importante
La distribución de FOFUs y optativos por semestre es referencial; cada estudiante puede ubicarlos en el semestre en que realmente los cursó.

Los catálogos de Minor se basan en minors.pucv.cl y las marcas de disponibilidad corresponden a la indicación “no programada para 2S-2026” publicada allí. La oferta puede cambiar.

## Analytics opcional
El proyecto viene preparado para Plausible pero desactivado. Para activarlo:
1. Crea/configura el sitio en Plausible.
2. Edita `config.js`.
3. Cambia `analyticsEnabled` a `true`.
4. Pon tu dominio de GitHub Pages en `plausibleDomain`.

No se envían notas, progreso ni comentarios del usuario: esos datos se guardan en `localStorage`.
