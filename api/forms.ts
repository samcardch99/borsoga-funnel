/**
 * GET /api/forms/<servicio>/            → la versión publicada
 * GET /api/forms/<servicio>/?version=N  → una versión concreta
 *
 * Lo pide el navegador al abrir el cuestionario (borsogastudio.com,
 * src/plans/client/brief-arranque.js): así lo que se publica en el panel sale
 * en la web al momento, sin recompilarla. También lo lee la compilación, para
 * dejar dentro de la página una copia de reserva por si esto no responde.
 * Es público a propósito: son las mismas preguntas que cualquiera ve.
 *
 * Caché del CDN de Vercel: 10 s, y mientras se renueva sirve la anterior
 * (stale-while-revalidate). Publicar tarda como mucho eso en verse.
 *
 * CORS con `*`, no con la lista de _cors.ts: el CDN guarda UNA respuesta por
 * URL, y si la primera petición llega sin Origin (la compilación, un curl) la
 * guardaría sin permiso y el navegador la rechazaría. Son datos públicos, sin
 * cookies: `*` es lo correcto aquí.
 */
import { esServicio, publicado, version } from "./_forms.js";

export default async function handler(req: any, res: any) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  res.setHeader("cache-control", "public, max-age=0, s-maxage=10, stale-while-revalidate=300");
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido." });
  const s = String(req.query?.servicio || "");
  if (!esServicio(s)) return res.status(404).json({ error: "Cuestionario desconocido." });
  try {
    const v = Number(req.query?.version);
    if (v) {
      const schema = await version(s, v);
      return schema ? res.status(200).json({ version: v, schema }) : res.status(404).json({ error: "No existe esa versión." });
    }
    return res.status(200).json(await publicado(s));
  } catch (e: any) {
    console.error("forms", e?.message);
    res.setHeader("cache-control", "no-store");
    return res.status(503).json({ error: "No se pudo leer el cuestionario." });
  }
}
