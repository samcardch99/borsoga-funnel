/**
 * Abre un archivo privado de un lead desde el enlace firmado del aviso o del
 * CRM. La firma la comprueba `_files.ts`; aquí solo se lee de Blob con el token
 * del servidor y se reenvía el contenido.
 */
import { Readable } from "node:stream";
import { get } from "@vercel/blob";
import { verifyLink } from "./_files.js";

export default async function handler(req: any, res: any) {
  res.setHeader("cache-control", "private, no-store");
  res.setHeader("x-robots-tag", "noindex, nofollow");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).send("Método no permitido.");
    return;
  }
  const { p, s } = req.query || {};
  // Firma mala y archivo inexistente responden igual: no se revela qué existe.
  if (!verifyLink(p, s)) {
    res.status(404).send("Archivo no encontrado.");
    return;
  }

  try {
    const r = await get(p, { access: "private" });
    if (!r || r.statusCode !== 200) {
      res.status(404).send("Archivo no encontrado.");
      return;
    }
    const name = p.split("/").pop() || "archivo";
    const type = r.blob.contentType || "application/octet-stream";
    res.setHeader("content-type", type);
    res.setHeader("content-length", String(r.blob.size));
    res.setHeader("x-content-type-options", "nosniff");
    // El tipo lo declaró el cliente al subir, así que no es de fiar: un SVG o
    // un HTML con script abierto en este dominio lo ejecutaría. Todo va en
    // sandbox salvo el PDF, que Chrome se niega a mostrar en sandbox, y el
    // audio; ninguno de los dos ejecuta script, y con nosniff un HTML que se
    // declare audio no se interpreta como página.
    if (type !== "application/pdf" && !type.startsWith("audio/")) {
      res.setHeader("content-security-policy", "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox");
    }
    // inline: fotos, SVG, PDF y audio se abren en el navegador; el resto se descarga
    const verEnNavegador = /^(image\/(jpeg|png|webp|gif|avif|heic|heif|svg\+xml)|application\/pdf|audio\/[\w.+-]+)$/.test(type);
    res.setHeader("content-disposition",
      `${verEnNavegador ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(name)}`);
    if (req.method === "HEAD") {
      res.status(200).end();
      return;
    }
    res.status(200);
    Readable.fromWeb(r.stream as any).pipe(res);
  } catch (e: any) {
    console.error("no se pudo leer el archivo", p, e?.message);
    res.status(502).send("No se pudo abrir el archivo.");
  }
}
