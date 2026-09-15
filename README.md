# Malla Pedagogía en Inglés PUCV — v4.0.0 Mint Garden

Rediseño completo de la malla interactiva no oficial de Pedagogía en Inglés PUCV.

## v4.0
- Nueva interfaz **Mint Garden** inspirada en blush, sage, mint, vanilla y cacao.
- Navegación por secciones: Inicio, Mi malla, Planificación, Minor & FOFUs, Progreso, Respaldo y Ajustes.
- Landing/login visual con Google, email + contraseña y modo invitada.
- Sincronización opcional entre dispositivos mediante Supabase.
- `localStorage` se mantiene como respaldo local y modo invitada.
- Panel lateral de detalle de ramo en escritorio.
- Colores por categoría de ramo; los estados usan bordes, badges y tratamientos sin borrar la categoría.
- Dashboard con KPIs y mini barra de progreso.
- Vista dedicada para planificación, Minors/FOFUs y estadísticas por categoría.
- FOFUs, optativos y otros ramos siguen siendo editables y se ubican en el semestre real escogido.
- Semestres de FOFUs/optativos siguen siendo solo referencias, no restricciones.
- Impresión y backups continúan disponibles.

## Supabase
La app usa una **publishable key**, que está diseñada para ejecutarse en el frontend. La seguridad de los datos depende de las políticas RLS configuradas en Supabase.

Nunca subas a este repositorio una `service_role`, `sb_secret_...`, contraseña de base de datos u otra clave secreta.

## Publicar en GitHub Pages
Sube todos los archivos y la carpeta `assets/` a la raíz del repositorio y reemplaza las versiones anteriores.

Archivos nuevos en v4:
- `v4.css`
- `v4.js`

GitHub Pages debe seguir apuntando a `main` / `(root)`.

## Después de publicar
Haz una recarga forzada (`Cmd + Shift + R` en macOS / `Ctrl + Shift + R` en Windows) porque la versión anterior podía quedar guardada por el service worker.
