/**
 * API del panel de administración (admin.borsogastudio.com).
 *
 * Una sola función con `?op=` (vercel.json reescribe /api/admin/<op>/ aquí),
 * para no gastar funciones del plan en rutas pequeñas.
 *
 *   login     GET   → a Google
 *   callback  GET   ← de Google; si el correo está en ADMIN_EMAILS, abre sesión
 *   logout    POST
 *   yo        GET   quién soy
 *   forms     GET   los cuestionarios, con su estado
 *   form      GET   ?servicio=  borrador + versión publicada
 *   borrador  PUT   ?servicio=  {schema, rev}  guarda el borrador
 *   comprobar POST  ?servicio=  qué impide publicar el borrador
 *   publicar  POST  ?servicio=  {nota}  publica y lanza la compilación de la web
 *   versiones GET   ?servicio=
 *   version   GET   ?servicio=&version=
 *   restaurar POST  ?servicio=&version=  copia una versión al borrador
 *   despliegue GET  estado de la última compilación de la web
 *
 * Todo salvo login/callback exige sesión. Lo que escribe exige además la
 * cabecera `x-borsoga: 1` (un formulario de otra web no puede ponerla sin
 * disparar CORS, que aquí no se concede) y, si hay Origin, que sea el nuestro.
 */
import { erroresEsquema, type Esquema } from "./_esquema.js";
import { esServicio, fila, guardarBorrador, publicar, publicado, version, versiones } from "./_forms.js";
import {
  borrarEstado, borrarSesion, cookieSesion, esLocal, estadoValido, nuevoEstado, permitidos, sesion,
} from "./_sesion.js";

const PANEL = "https://admin.borsogastudio.com";
const REPO = "samcardch99/borsoga-studio";
const WORKFLOW = "deploy.yml";

const origen = (req: any) => (esLocal(req) ? `http://${req.headers.host}` : PANEL);
const volver = (req: any, q = "") => `${origen(req)}/admin/${q}`;

function body(req: any) {
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return null; } }
  return req.body || {};
}

async function github(path: string, init: RequestInit = {}) {
  const token = process.env.GITHUB_DEPLOY_TOKEN;
  if (!token) return { ok: false, status: 0, error: "GITHUB_DEPLOY_TOKEN no configurado", data: null as any };
  const r = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json",
               "x-github-api-version": "2022-11-28", ...(init.headers || {}) },
  });
  const text = await r.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* texto plano */ }
  return { ok: r.ok, status: r.status, error: r.ok ? null : `GitHub ${r.status}: ${text.slice(0, 200)}`, data };
}

export const config = { maxDuration: 30 };

export default async function handler(req: any, res: any) {
  res.setHeader("cache-control", "no-store");
  const op = String(req.query?.op || "");
  const json = (b: any, status = 200) => res.status(status).json(b);
  const redirige = (url: string, cookies: string[] = []) => {
    if (cookies.length) res.setHeader("set-cookie", cookies);
    res.statusCode = 302;
    res.setHeader("location", url);
    res.end();
  };

  try {
    // ------------------------------------------------------------ login
    if (op === "login") {
      const id = process.env.GOOGLE_CLIENT_ID;
      if (!id) return redirige(volver(req, "?error=config"));
      const { st, cookie } = nuevoEstado(req);
      const q = new URLSearchParams({
        client_id: id, redirect_uri: `${origen(req)}/api/admin/callback`, response_type: "code",
        scope: "openid email", state: st, prompt: "select_account",
      });
      return redirige(`https://accounts.google.com/o/oauth2/v2/auth?${q}`, [cookie]);
    }

    if (op === "callback") {
      const { code, state, error } = req.query || {};
      if (error || !code || !estadoValido(req, String(state))) return redirige(volver(req, "?error=login"), [borrarEstado(req)]);
      // El id_token llega directamente de Google por TLS en respuesta a nuestro
      // secreto: no hace falta verificar su firma (lo dice la propia Google).
      const r = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: String(code), client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          redirect_uri: `${origen(req)}/api/admin/callback`, grant_type: "authorization_code",
        }),
      });
      const tok = await r.json().catch(() => ({}));
      const claims = tok.id_token
        ? JSON.parse(Buffer.from(String(tok.id_token).split(".")[1] || "", "base64url").toString() || "{}")
        : {};
      const email = String(claims.email || "").toLowerCase();
      const valido = r.ok && claims.aud === process.env.GOOGLE_CLIENT_ID &&
        ["accounts.google.com", "https://accounts.google.com"].includes(claims.iss) &&
        claims.email_verified === true && Number(claims.exp) > Date.now() / 1000;
      if (!valido) return redirige(volver(req, "?error=login"), [borrarEstado(req)]);
      if (!permitidos().includes(email)) {
        console.warn("panel: acceso denegado", email);
        return redirige(volver(req, `?error=noautorizado&email=${encodeURIComponent(email)}`), [borrarEstado(req)]);
      }
      return redirige(volver(req), [borrarEstado(req), cookieSesion(req, email)]);
    }

    // ------------------------------------------------------------ sesión
    const quien = sesion(req);
    if (!quien) return json({ error: "Sin sesión." }, 401);

    const escribe = req.method !== "GET";
    if (escribe) {
      const o = req.headers?.origin;
      if (req.headers?.["x-borsoga"] !== "1" || (o && o !== origen(req))) return json({ error: "Petición rechazada." }, 403);
    }

    if (op === "logout" && escribe) {
      res.setHeader("set-cookie", borrarSesion(req));
      return json({ ok: true });
    }
    if (op === "yo") return json({ email: quien });

    if (op === "despliegue") {
      const r = await github(`/actions/workflows/${WORKFLOW}/runs?per_page=1&branch=main`);
      if (!r.ok) return json({ error: r.error });
      const run = r.data?.workflow_runs?.[0];
      return json(run ? { estado: run.status, resultado: run.conclusion, creado: run.created_at,
                          actualizado: run.updated_at, url: run.html_url } : {});
    }

    if (op === "forms") {
      const out = [];
      for (const s of ["web", "grafico"] as const) {
        const f = await fila(s);
        const pub = await version(s, f.published);
        out.push({ servicio: s, publicada: f.published, rev: f.rev, cambiado: f.draft_at, por: f.draft_by,
                   cambios: JSON.stringify(pub) !== JSON.stringify(f.draft) });
      }
      return json({ forms: out });
    }

    const s = String(req.query?.servicio || "");
    if (!esServicio(s)) return json({ error: "Cuestionario desconocido." }, 404);

    if (op === "form") {
      const f = await fila(s);
      const pub = await publicado(s);
      return json({ draft: f.draft, rev: f.rev, cambiado: f.draft_at, por: f.draft_by, publicada: pub });
    }

    if (op === "borrador" && req.method === "PUT") {
      const b = body(req);
      if (!b?.schema?.pasos) return json({ error: "Borrador mal formado." }, 400);
      if (JSON.stringify(b.schema).length > 400_000) return json({ error: "El cuestionario es demasiado grande." }, 413);
      b.schema.servicio = s;
      const rev = await guardarBorrador(s, b.schema as Esquema, quien, Number(b.rev));
      if (rev == null) {
        const f = await fila(s);
        return json({ error: `Otra persona (${f.draft_by || "alguien"}) cambió el borrador mientras lo editabas.`,
                      conflicto: true, draft: f.draft, rev: f.rev }, 409);
      }
      return json({ ok: true, rev });
    }

    if (op === "comprobar" && escribe) {
      const f = await fila(s);
      const pub = await publicado(s);
      return json({ errores: erroresEsquema(f.draft, pub.schema) });
    }

    if (op === "publicar" && escribe) {
      const b = body(req) || {};
      const f = await fila(s);
      if (Number(b.rev) !== f.rev) return json({ error: "El borrador cambió desde que lo cargaste. Recarga antes de publicar." }, 409);
      const pub = await publicado(s);
      const errores = erroresEsquema(f.draft, pub.schema);
      if (errores.length) return json({ error: "Hay que corregir el cuestionario antes de publicarlo.", errores }, 422);
      if (JSON.stringify(f.draft) === JSON.stringify(pub.schema)) return json({ error: "No hay cambios que publicar." }, 400);
      const n = await publicar(s, f.draft, quien, String(b.nota || "").slice(0, 300));
      const d = await github(`/actions/workflows/${WORKFLOW}/dispatches`, {
        method: "POST", body: JSON.stringify({ ref: "main" }),
      });
      if (!d.ok) console.error("panel: no se lanzó la compilación", d.error);
      return json({ ok: true, version: n, compilacion: d.ok ? "lanzada" : d.error });
    }

    if (op === "versiones") return json({ versiones: await versiones(s) });

    if (op === "version") {
      const schema = await version(s, Number(req.query?.version));
      return schema ? json({ schema }) : json({ error: "No existe esa versión." }, 404);
    }

    if (op === "restaurar" && escribe) {
      const b = body(req) || {};
      const schema = await version(s, Number(req.query?.version));
      if (!schema) return json({ error: "No existe esa versión." }, 404);
      const rev = await guardarBorrador(s, schema, quien, Number(b.rev));
      if (rev == null) return json({ error: "El borrador cambió mientras tanto. Recarga y vuelve a intentarlo.", conflicto: true }, 409);
      return json({ ok: true, rev, draft: schema });
    }

    return json({ error: "Operación desconocida." }, 404);
  } catch (e: any) {
    console.error("panel", op, e?.message);
    return json({ error: e?.message || "Error del servidor." }, 500);
  }
}
