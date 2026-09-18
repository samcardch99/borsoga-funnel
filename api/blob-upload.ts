/**
 * Emite tokens de subida directa a Vercel Blob para los formularios.
 *
 * Por qué el cliente sube directo y no a través de la función: las funciones de
 * Vercel tienen un límite de ~4,5 MB de cuerpo de petición. Seis fotos de un
 * móvil lo superan sin esfuerzo, así que los archivos nunca pasan por aquí —
 * esta función solo firma el permiso.
 *
 * El token que emite está acotado: tipos permitidos, tamaño máximo, ruta con
 * sufijo aleatorio y **acceso privado**. Son fotos del interior de casas de
 * clientes; la política de privacidad promete que no quedan en abierto.
 *
 * Los tipos de archivo válidos (`photos`, `refFiles`…) salen de la misma lista
 * que usa `submit.ts`. Antes cada función tenía la suya, y al añadir los
 * cuestionarios de web y de marca solo se actualizó una: sus subidas recibían
 * un 400 y el navegador mostraba "Failed to retrieve the client token".
 */

import { cors } from "./_cors.js";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { PATH_RE } from "./_files.js";

const MAX_BYTES = 25 * 1024 * 1024;

// Configuradores: fotos del espacio y planos.
//
// octet-stream va incluido, como en las otras dos listas. Un .heic del iPhone
// llega sin tipo en muchos navegadores y el cliente no tenía más remedio que
// mandarlo genérico: la subida moría con "Content type mismatch" y el usuario
// veía "No pudimos subir tus archivos". El cliente ahora deduce el tipo por la
// extensión (src/upload-client.js) y esto es la red por debajo.
const FOTOS_Y_PLANOS = [
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "application/pdf",
  "application/octet-stream",
];

// Cuestionarios de web y de marca: piden logo, manual de marca, presentaciones
// y referencias, que llegan en formatos de diseño y de oficina. El navegador no
// sabe tipar algunos (.ai, .key según el sistema) y los manda como
// octet-stream, así que también se acepta.
//
// El tipo lo declara el cliente, así que esta lista no protege de nada: evita
// errores honestos. Lo que protege es cómo se sirve el archivo (api/file.ts).
const MATERIAL_DE_MARCA = [
  ...FOTOS_Y_PLANOS,
  "image/gif", "image/avif", "image/tiff", "image/svg+xml",
  "image/vnd.adobe.photoshop", "application/postscript", "application/illustrator",
  "application/zip", "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.apple.keynote", "application/x-iwork-keynote-sffkey",
  "application/octet-stream",
];
const DE_CUESTIONARIO = ["brandFiles", "refFiles", "currentFiles", "spaceFiles"];

// Notas de voz (cuestionario de Mutati). Las de WhatsApp salen como .opus u
// .ogg y las del iPhone como .m4a; el navegador no siempre sabe tiparlas.
const AUDIO = [
  "audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/m4a", "audio/aac", "audio/wav", "audio/x-wav",
  "audio/webm", "audio/ogg", "audio/opus", "audio/amr", "audio/3gpp", "video/mp4",
  "application/octet-stream",
];

export default async function handler(req: any, res: any) {
  if (cors(req, res)) return;
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(503).json({ error: "Almacenamiento no configurado." });
    return;
  }

  try {
    const result = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // El cliente propone la ruta; la encajonamos bajo leads/ para que no
        // pueda escribir en cualquier sitio del store.
        if (!PATH_RE.test(pathname)) {
          throw new Error("Ruta no permitida.");
        }
        const kind = pathname.split("/")[2];
        return {
          access: "private",
          addRandomSuffix: true,
          allowedContentTypes: kind === "audioFiles" ? AUDIO
            : DE_CUESTIONARIO.includes(kind) ? MATERIAL_DE_MARCA : FOTOS_Y_PLANOS,
          maximumSizeInBytes: MAX_BYTES,
          validUntil: Date.now() + 30 * 60 * 1000,
        };
      },
      onUploadCompleted: async () => {
        // El lead se guarda cuando el cliente envía el formulario, no aquí:
        // un archivo suelto sin formulario no es un lead.
      },
    });
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "No se pudo autorizar la subida." });
  }
}
