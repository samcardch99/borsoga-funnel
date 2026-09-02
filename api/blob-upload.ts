/**
 * Emite tokens de subida directa a Vercel Blob para el configurador.
 *
 * Por qué el cliente sube directo y no a través de la función: las funciones de
 * Vercel tienen un límite de ~4,5 MB de cuerpo de petición. Seis fotos de un
 * móvil lo superan sin esfuerzo, así que los archivos nunca pasan por aquí —
 * esta función solo firma el permiso.
 *
 * El token que emite está acotado: tipos permitidos, tamaño máximo, ruta con
 * sufijo aleatorio y **acceso privado**. Son fotos del interior de casas de
 * clientes; la política de privacidad promete que no quedan en abierto.
 */
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "application/pdf",
];

export default async function handler(req: any, res: any) {
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
        if (!/^leads\/[a-z0-9]+\/(photos|planFiles|applianceFiles)\//.test(pathname)) {
          throw new Error("Ruta no permitida.");
        }
        return {
          access: "private",
          addRandomSuffix: true,
          allowedContentTypes: ALLOWED,
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
