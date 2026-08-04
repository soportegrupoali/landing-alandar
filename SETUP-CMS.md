# Panel de contenido (Decap CMS) — pasos pendientes

Todo el código ya está desplegado y funcionando (verificado el 2026-08-04). Solo
faltan pasos que requieren tu cuenta de GitHub de la organización — no puedo
hacerlos yo por ti.

## Ya está listo

- **Panel:** https://landing-alandar-2026.landing-alandar-2026.workers.dev/admin/
- **Worker de autenticación:** https://landing-alandar-cms-auth.landing-alandar-2026.workers.dev (código en `cms-auth-worker/`)
- **Repo backend:** `soportegrupoali/landing-alandar`, rama `main`, con revisión editorial (cada cambio en el CMS crea un Pull Request en vez de publicarse directo — alguien lo aprueba antes de que salga a producción).
- Todo el copy del sitio (textos, stats, financiamiento, video) vive en `src/content/site.yaml` y ya es editable desde el panel.

## Lo que falta (pasos manuales, ~5 min)

### 1. Crear la GitHub OAuth App

En GitHub, como owner/admin de la organización **soportegrupoali**:

1. Ve a `https://github.com/organizations/soportegrupoali/settings/applications` (Organization settings → Developer settings → OAuth Apps → **New OAuth App**).
2. Llena el formulario exactamente así:
   - **Application name:** `Alandar Landing CMS`
   - **Homepage URL:** `https://landing-alandar-2026.landing-alandar-2026.workers.dev`
   - **Authorization callback URL:** `https://landing-alandar-cms-auth.landing-alandar-2026.workers.dev/callback`
3. Clic en **Register application**.
4. Copia el **Client ID** que aparece (no es secreto, se puede compartir).
5. Clic en **Generate a new client secret** y cópialo — **este sí es secreto, no lo pegues en el chat**. Guárdalo en un gestor de contraseñas.

### 2. Configurar el Client ID y el Client Secret

Con esos dos valores, desde tu propia terminal (para que el secreto nunca pase por el chat):

```bash
cd /Users/danny/proyectos/landing-alandar-2026/cms-auth-worker

# Client ID: edita wrangler.jsonc y reemplaza "PENDIENTE_DE_CONFIGURAR"
#   por el Client ID real, luego:
npx wrangler deploy

# Client Secret: NUNCA va en un archivo, se guarda cifrado en Cloudflare
npx wrangler secret put GITHUB_CLIENT_SECRET
# (te va a pedir que pegues el valor, dale Enter)
```

Si prefieres, dime el Client ID (ese sí, sin problema) y yo actualizo
`wrangler.jsonc` y redespliego — pero el `wrangler secret put` del Client
Secret hazlo tú directamente, para que ni siquiera yo lo vea.

### 3. Confirmar quién puede entrar al panel

El login es "Login with GitHub" — no hay usuarios/contraseñas propios del
CMS. Cualquier persona con acceso de **escritura** al repo
`soportegrupoali/landing-alandar` puede loguearse y editar. Para dar/quitar
acceso: GitHub → repo → **Settings → Collaborators and teams**.

Si al intentar loguearse alguien ve un error de "organization has restricted
OAuth apps", un owner de la org debe aprobarla en:
`Organization settings → Third-party Access`.

### 4. (Opcional) Capa extra con Cloudflare Access

Si además quieres que `/admin` pida un correo antes de mostrar siquiera el
botón de GitHub (útil si el diseñador no tiene cuenta de GitHub todavía, o
como capa extra de seguridad), lo activamos con Cloudflare Access — dime y lo
configuro. No es necesario para que el CMS funcione.

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
