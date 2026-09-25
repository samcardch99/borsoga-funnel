/**
 * Sesión del panel: una cookie firmada con HMAC, sin tabla de sesiones.
 *
 *   __Host-bsa     "<email>|<caduca>|<firma>"   HttpOnly, Secure, SameSite=Lax
 *   __Host-bsa_st  estado del login con Google (10 min), contra CSRF del callback
 *
 * `__Host-` obliga a Secure, Path=/ y sin Domain: la cookie es de
 * admin.borsogastudio.com y de nadie más. En local (http://localhost) el
 * navegador no admite Secure, así que ahí va sin el prefijo.
 *
 * Quién entra lo decide ADMIN_EMAILS (lista separada por comas), comprobado en
 * el login Y en cada petición: quitar a alguien de la lista le cierra la sesión.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const HORAS = 12;
const SECRETO = () => {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET no configurado.");
  return s;
};

export const permitidos = () =>
  (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);

const firma = (s: string) => createHmac("sha256", SECRETO()).update(s).digest("base64url");

function iguales(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function esLocal(req: any) {
  return /^localhost(:\d+)?$/.test(String(req.headers?.host || ""));
}
const nombre = (req: any, base: string) => (esLocal(req) ? base : `__Host-${base}`);

function cookie(req: any, base: string, valor: string, maxAge: number) {
  return [`${nombre(req, base)}=${valor}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${maxAge}`,
          ...(esLocal(req) ? [] : ["Secure"])].join("; ");
}

export function leerCookie(req: any, base: string): string | null {
  const n = nombre(req, base);
  for (const par of String(req.headers?.cookie || "").split(/;\s*/)) {
    const i = par.indexOf("=");
    if (i > 0 && par.slice(0, i) === n) return par.slice(i + 1);
  }
  return null;
}

export function cookieSesion(req: any, email: string) {
  const exp = Math.floor(Date.now() / 1000) + HORAS * 3600;
  const cuerpo = `${Buffer.from(email).toString("base64url")}|${exp}`;
  return cookie(req, "bsa", `${cuerpo}|${firma(cuerpo)}`, HORAS * 3600);
}

export const borrarSesion = (req: any) => cookie(req, "bsa", "", 0);

/** El email de la sesión, o null si no hay, caducó, está manipulada o ya no está autorizado. */
export function sesion(req: any): string | null {
  const v = leerCookie(req, "bsa");
  if (!v) return null;
  const [e, exp, f] = v.split("|");
  if (!e || !exp || !f || !iguales(firma(`${e}|${exp}`), f)) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  const email = Buffer.from(e, "base64url").toString().toLowerCase();
  return permitidos().includes(email) ? email : null;
}

export function nuevoEstado(req: any) {
  const st = randomBytes(24).toString("base64url");
  return { st, cookie: cookie(req, "bsa_st", st, 600) };
}
export const borrarEstado = (req: any) => cookie(req, "bsa_st", "", 0);
export function estadoValido(req: any, st: string) {
  const c = leerCookie(req, "bsa_st");
  return !!c && !!st && iguales(c, st);
}
