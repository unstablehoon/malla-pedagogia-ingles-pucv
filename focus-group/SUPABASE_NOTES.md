# Supabase · notas de despliegue

La v4 está configurada para usar el proyecto Supabase indicado en `config.js` con una **publishable key**.

## Auth
Para Google OAuth, el callback configurado en Google debe ser el callback de Supabase:

`https://kzqtkywyrlhrkvejvozg.supabase.co/auth/v1/callback`

En Supabase Auth → URL Configuration, la URL del sitio/redirect debe incluir:

`https://unstablehoon.github.io/malla-pedagogia-ingles-pucv/`

## Nunca publicar
- `service_role`
- claves `sb_secret_...`
- contraseña de PostgreSQL
- secretos OAuth de Google

La publishable key sí está pensada para frontend público; RLS debe permanecer activo.
