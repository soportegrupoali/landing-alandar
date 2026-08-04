/**
 * Worker de autenticación OAuth para Decap CMS (backend "github").
 *
 * Implementa el flujo estándar que Decap CMS espera de un proveedor OAuth
 * (el mismo protocolo que netlify-cms-oauth-provider / decap-cms-oauth-provider):
 *
 *   1. GET /auth      -> redirige a GitHub para que el usuario autorice la app.
 *   2. GET /callback  -> GitHub redirige aquí con un `code`; lo cambiamos por
 *                        un access_token (usando el client secret, que solo
 *                        vive en este Worker) y se lo pasamos de vuelta a la
 *                        ventana del CMS vía window.postMessage.
 *
 * El client secret NUNCA se expone al navegador: todo el intercambio
 * code -> token ocurre server-side, aquí.
 *
 * Variables de entorno esperadas (ver wrangler.jsonc / `wrangler secret put`):
 *   - GITHUB_CLIENT_ID      (pública, va en wrangler.jsonc)
 *   - GITHUB_CLIENT_SECRET  (secreta, NUNCA en el repo -> `wrangler secret put`)
 *   - ALLOWED_REPO          (ej. "soportegrupoali/landing-alandar", solo informativo/log)
 */

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_REPO?: string;
}

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'decap_oauth_state';

function randomState(): string {
  return crypto.randomUUID();
}

function htmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Evita que el JSON embebido en el <script> pueda cerrar la etiqueta. */
function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

function renderCallbackPage(status: 'success' | 'error', payload: Record<string, unknown>): string {
  const message = `authorization:github:${status}:${safeJsonForScript(payload)}`;
  return `<!doctype html>
<html lang="es-MX">
<head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
  <p>${status === 'success' ? 'Autenticación exitosa, puedes cerrar esta ventana.' : 'Ocurrió un error al autenticar.'}</p>
  <script>
    (function () {
      function receiveMessage(e) {
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const provider = url.searchParams.get('provider');
      if (provider !== 'github') {
        return new Response('Unsupported provider', { status: 400 });
      }
      if (!env.GITHUB_CLIENT_ID) {
        return new Response('Worker mal configurado: falta GITHUB_CLIENT_ID', { status: 500 });
      }

      const state = randomState();
      const redirectUri = `${url.origin}/callback`;
      const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', redirectUri);
      authorizeUrl.searchParams.set('scope', url.searchParams.get('scope') || 'repo,user');
      authorizeUrl.searchParams.set('state', state);

      return new Response(null, {
        status: 302,
        headers: {
          Location: authorizeUrl.toString(),
          // httpOnly + secure + short-lived: solo sirve para validar el
          // `state` que regresa GitHub en /callback (protección CSRF).
          'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/callback; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
          // Cada visita a /auth debe generar un state nuevo: nunca cachear.
          'Cache-Control': 'no-store',
        },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      const cookieHeader = request.headers.get('Cookie') || '';
      const cookieState = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${STATE_COOKIE}=`))
        ?.slice(STATE_COOKIE.length + 1);

      if (!code) {
        return new Response('Falta "code" en el callback de GitHub', { status: 400 });
      }
      if (!returnedState || !cookieState || returnedState !== cookieState) {
        return new Response('El parámetro "state" no coincide (posible CSRF). Intenta iniciar sesión de nuevo.', {
          status: 400,
        });
      }

      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });

      const tokenData = (await tokenResponse.json()) as {
        access_token?: string;
        error?: string;
        error_description?: string;
      };

      const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };

      if (!tokenResponse.ok || !tokenData.access_token) {
        const errorMessage = tokenData.error_description || tokenData.error || 'No se pudo obtener el token';
        return new Response(renderCallbackPage('error', { message: htmlEscape(errorMessage) }), {
          status: 400,
          headers,
        });
      }

      return new Response(
        renderCallbackPage('success', { token: tokenData.access_token, provider: 'github' }),
        { headers }
      );
    }

    return new Response('Worker de autenticación de Decap CMS para landing-alandar. Rutas: /auth, /callback', {
      status: 200,
    });
  },
};
