/**
 * Referencias a los archivos que suben los clientes, y enlaces para abrirlos.
 *
 * Los archivos están en Blob con acceso privado: su URL devuelve 403 a quien no
 * lleve el token del store, y el token no puede ir en un correo. Así que el
 * aviso y el CRM no enlazan a Blob, sino a `/api/file/`, que comprueba una
 * firma HMAC de la ruta y sirve el archivo con el token del lado del servidor.
 *
 * La firma no caduca a propósito: el enlace tiene que seguir abriéndose meses
 * después desde el correo o desde la nota del CRM. Quien no tenga el enlace no
 * puede adivinarlo. Si hace falta invalidar todos los enlaces de golpe, basta
 * con cambiar `FILE_LINK_SECRET` (o, si no existe, rotar el token de Blob).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const FILE_KINDS = [
  "photos", "planFiles", "applianceFiles",
  "brandFiles", "refFiles", "currentFiles", "spaceFiles",
  "audioFiles",
];

const SITE = "https://plans.borsogastudio.com";
/** Ruta de un archivo de lead: leads/<lote>/<tipo>/<nombre>. */
export const PATH_RE = new RegExp(`^leads/[a-z0-9]+/(${FILE_KINDS.join("|")})/[^/]+$`);

const secret = () => process.env.FILE_LINK_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "";

// El id del store va dentro del token: vercel_blob_rw_<storeId>_<secreto>. Las
// URLs de ese store son <storeid en minúsculas>.private.blob.vercel-storage.com.
const storeHost = () => {
  const id = String(process.env.BLOB_READ_WRITE_TOKEN || "").split("_")[3];
  return id ? `${id.toLowerCase()}.private.blob.vercel-storage.com` : null;
};

/** Ruta dentro del store si la URL es de un archivo de lead nuestro; si no, null. */
export function leadPath(url: unknown, kind: unknown): string | null {
  if (typeof url !== "string" || !FILE_KINDS.includes(String(kind))) return null;
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  if (u.protocol !== "https:" || u.host !== storeHost()) return null;
  const path = decodeURIComponent(u.pathname.slice(1));
  return PATH_RE.test(path) && path.split("/")[2] === kind ? path : null;
}

const sign = (path: string) =>
  createHmac("sha256", `borsoga-file-link:${secret()}`).update(path).digest("base64url");

export function fileLink(path: string): string {
  return `${SITE}/api/file/?p=${encodeURIComponent(path)}&s=${sign(path)}`;
}

export function verifyLink(path: unknown, sig: unknown): path is string {
  if (typeof path !== "string" || typeof sig !== "string" || !secret()) return false;
  if (!PATH_RE.test(path)) return false;
  const a = Buffer.from(sign(path));
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}
