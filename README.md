# Malla Pedagogía en Inglés PUCV

Este paquete contiene dos versiones publicables en el mismo GitHub Pages.

- `/` — **v3.2.0 Stable**: vuelve a la estructura tranquila de v3.0.2 y conserva las funciones marcadas como QUEDA en la checklist.
- `/focus-group/` — **v4.0.0 Experimental**: versión Mint Garden completa para el grupo focal.

## Stable v3.2.0

Base visual v3.0.2, doble clic corregido, prerrequisitos, estados, búsqueda, filtros, planificación, Minor/FOFUs, cuentas opcionales con Supabase, sincronización, perfil/avatar, mini barra de progreso, backups, impresión, dark mode, vista compacta y herramientas personales por ramo (evaluaciones, asistencia e historial).

Los elementos marcados TEST se dejaron fuera de la interfaz pública cuando era posible y permanecen en la versión experimental. La PWA instalable se prueba en v4; la stable conserva caché offline mediante service worker.

## Sugerencias

La stable incluye un enlace discreto de sugerencias. Para guardar feedback en Supabase y habilitar la bandeja admin, ejecuta `SUPABASE_V32_MIGRATION.sql` una vez en SQL Editor. Después inicia sesión al menos una vez y ejecuta la línea final del archivo reemplazando `TU_CORREO` por tu correo.

## OAuth del grupo focal

Si quieres probar login dentro de `/focus-group/`, agrega también esta URL a los Redirect URLs permitidos de Supabase:

`https://unstablehoon.github.io/malla-pedagogia-ingles-pucv/focus-group/`

El modo invitado funciona sin ese paso.

## Seguridad

El repositorio contiene solo la URL de Supabase y la publishable key de frontend. Nunca subas `service_role`, secretos OAuth ni la contraseña de la base de datos.
