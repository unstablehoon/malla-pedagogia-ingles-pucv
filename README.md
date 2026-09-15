# Malla Pedagogía en Inglés PUCV — v3.0.0

Sitio estático para GitHub Pages.

## Publicar
Sube **todos** estos archivos y la carpeta `assets/` a la raíz del repositorio. GitHub Pages debe apuntar a `main` / `(root)`.

## Analytics opcional
El proyecto viene preparado para Plausible pero desactivado. Para activarlo:
1. Crea/configura el sitio en Plausible.
2. Edita `config.js`.
3. Cambia `analyticsEnabled` a `true`.
4. Pon tu dominio de GitHub Pages en `plausibleDomain`.

No se envían notas, progreso ni comentarios del usuario: esos datos se guardan en `localStorage`.

## Actualizar la PWA
Cuando cambies archivos, cambia el nombre de `CACHE` en `sw.js` para forzar una actualización limpia del contenido offline.
