/**
 * Worker de autenticación para Decap CMS (backend "github"), basado en
 * Cloudflare Access como capa de usuarios en vez de OAuth por-persona.
 *
 * Modelo:
 *   - Cloudflare Access protege este Worker Y /admin del sitio principal a
 *     nivel de borde (edge): una petición que no pasó por Access nunca
 *     llega ni siquiera a este código. Danny administra quién entra
 *     agregando/quitando correos en el dashboard de Cloudflare Zero Trust
 *     — sin tocar código ni GitHub.
 *   - Este Worker vuelve a verificar el JWT de Access (defensa en
 *     profundidad: nunca confiar ciegamente en "llegó hasta aquí" como
 *     prueba de autenticación) y, si es válido, le entrega a Decap CMS un
 *     token de GitHub COMPARTIDO (un fine-grained Personal Access Token con
 *     permisos solo sobre este repo) para que pueda leer/escribir contenido.
 *   - Los commits de quienes entran por este camino quedan bajo la
 *     identidad del token compartido, no la de cada persona — el registro
 *     de "quién entró y cuándo" vive en los logs de Cloudflare Access, no
 *     en git.
 *
 * Protocolo con Decap CMS: igual que un OAuth provider normal (ver
 * https://decapcms.org/docs/external-oauth-clients/) — el CMS abre este
 * endpoint en un popup y espera un window.postMessage con
 * "authorization:github:success:{...}".
 *
 * Variables de entorno esperadas:
 *   - CF_ACCESS_TEAM_DOMAIN  (pública, ej. "soportegrupoali.cloudflareaccess.com")
 *   - CF_ACCESS_AUD          (pública, el "Application Audience (AUD) Tag" de la Access App)
 *   - GITHUB_SHARED_TOKEN    (secreta, NUNCA en el repo -> `wrangler secret put`)
 *   - ALLOWED_REPO           (informativo, ej. "soportegrupoali/landing-alandar")
 */

import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface Env {
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
  GITHUB_SHARED_TOKEN: string;
  ALLOWED_REPO?: string;
}

const ACCESS_JWT_HEADER = 'Cf-Access-Jwt-Assertion';

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

// El JWKS se cachea automáticamente en memoria por `jose` entre invocaciones
// del mismo Worker isolate.
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

async function verifyAccessJwt(request: Request, env: Env): Promise<{ email: string } | null> {
  const token = request.headers.get(ACCESS_JWT_HEADER);
  if (!token || !env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) return null;

  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`https://${env.CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`));
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://${env.CF_ACCESS_TEAM_DOMAIN}`,
      audience: env.CF_ACCESS_AUD,
    });
    const email = typeof payload.email === 'string' ? payload.email : null;
    return email ? { email } : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const provider = url.searchParams.get('provider');
      if (provider !== 'github') {
        return new Response('Unsupported provider', { status: 400 });
      }
      if (!env.GITHUB_SHARED_TOKEN) {
        return new Response('Worker mal configurado: falta GITHUB_SHARED_TOKEN', { status: 500 });
      }

      const identity = await verifyAccessJwt(request, env);
      const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };

      if (!identity) {
        // No debería pasar en condiciones normales: Access ya filtró la
        // petición antes de que llegara aquí. Si esto se dispara, algo en
        // la configuración de Access está mal (dominio/AUD equivocados, o
        // la Access Application no está protegiendo esta ruta).
        return new Response(
          renderCallbackPage('error', {
            message: 'No se pudo verificar tu sesión de Cloudflare Access. Intenta de nuevo o avisa a soporte.ti@grupoali.mx.',
          }),
          { status: 401, headers }
        );
      }

      return new Response(
        renderCallbackPage('success', { token: env.GITHUB_SHARED_TOKEN, provider: 'github' }),
        { headers }
      );
    }

    return new Response('Worker de autenticación de Decap CMS para landing-alandar. Ruta: /auth', {
      status: 200,
    });
  },
};
