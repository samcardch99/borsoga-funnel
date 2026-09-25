/**
 * GET /api/forms/<servicio>/            → la versión publicada
 * GET /api/forms/<servicio>/?version=N  → una versión concreta
 *
 * Lo lee la compilación de borsogastudio.com (src/plans/forms/index.ts), no el
 * navegador: por eso no lleva CORS. Es público a propósito: son las mismas
 * preguntas que cualquiera ve en la página.
 */
import { esServicio, publicado, version } from "./_forms.js";

export default async function handler(req: any, res: any) {
  res.setHeader("cache-control", "no-store");
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
    return res.status(503).json({ error: "No se pudo leer el cuestionario." });
  }
}
