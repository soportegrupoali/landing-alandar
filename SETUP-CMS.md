# Panel de contenido (Decap CMS)

Configurado y probado de punta a punta el 2026-08-04 (login con GitHub,
carga de campos, vista previa — todo funcionando).

## Cómo entrar

- **Panel:** https://landing-alandar-2026.landing-alandar-2026.workers.dev/admin/
- Login: botón **"Login with GitHub"** — no hay usuario/contraseña propios del CMS.
- Quién puede entrar: cualquier cuenta de GitHub con acceso de **escritura** al
  repo `soportegrupoali/landing-alandar`. Para dar/quitar acceso: GitHub → repo
  → **Settings → Collaborators and teams**.
- Cada cambio guardado en el panel crea un **Pull Request** (revisión
  editorial) en vez de publicarse directo — alguien debe aprobarlo en GitHub
  para que salga a producción.

## Cómo está armado (para referencia futura)

- **Worker de autenticación:** https://landing-alandar-cms-auth.landing-alandar-2026.workers.dev — código en `cms-auth-worker/`. Es el único que conoce el GitHub Client Secret (guardado cifrado en Cloudflare vía `wrangler secret put`, nunca en un archivo del repo).
- **GitHub OAuth App:** "Alandar Landing CMS", creada en la cuenta `soportegrupoali` (`https://github.com/settings/developers` — **es una cuenta normal de GitHub, no una organización técnica**, por eso la URL de `/organizations/.../settings/applications` no aplica aquí).
- **Copy editable:** todo vive en `src/content/site.yaml`, tipado vía `src/data/content.ts`.

## Pendiente de tu parte

- El Client Secret actual se generó **para pruebas** y se compartió por chat
  — regenéralo cuando quieras dejarlo en uso real (GitHub → esa OAuth App →
  **Generate a new client secret**), y luego:
  ```bash
  cd /Users/danny/proyectos/landing-alandar-2026/cms-auth-worker
  npx wrangler secret put GITHUB_CLIENT_SECRET
  ```
  (pega el nuevo valor cuando te lo pida; no hace falta redeploy aparte, el secret nuevo aplica de inmediato).

## (Opcional) Capa extra con Cloudflare Access

Si además quieres que `/admin` pida un correo antes de mostrar siquiera el
botón de GitHub (útil si alguien más —ej. el diseñador— necesita entrar sin
tener cuenta de GitHub, o como capa extra de seguridad), lo activamos con
Cloudflare Access — dime y lo configuro. No es necesario para que el CMS
funcione.

## Limitaciones a tener en cuenta

- El video de avance de obra sigue siendo el `.mp4` local por default
  (`src/content/site.yaml` → `progress.video.provider: local`). Para usar
  Vimeo, cambia `provider` a `vimeo` y pega el ID del video (el número al
  final de la URL de Vimeo) — se puede hacer desde el panel, sección "Avance
  de obra / Video".
- Las imágenes (galería, amenidades, master plan) **no** son editables desde
  el panel todavía — solo el texto y los datos. Cambiar imágenes sigue
  siendo por código.
- El scope de GitHub OAuth es `repo` (acceso a todos los repos que esa
  persona pueda escribir, no solo este) — es una limitación de las OAuth
  Apps clásicas de GitHub, no de nuestra configuración.
