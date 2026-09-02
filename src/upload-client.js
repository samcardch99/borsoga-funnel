/**
 * Puente mínimo para subir archivos directo a Vercel Blob desde el navegador.
 *
 * Se empaqueta con esbuild a build/assets/upload.js y expone una sola función
 * global. El configurador es JS plano servido estático, sin bundler propio;
 * esto es lo único que necesita empaquetarse, y usa el SDK oficial en vez de
 * hablar a mano con el protocolo de Blob.
 */
import { upload } from "@vercel/blob/client";

/**
 * @param {File} file
 * @param {string} pathname  ruta destino, siempre bajo leads/<lote>/<tipo>/
 * @param {(pct:number)=>void} [onProgress]
 * @returns {Promise<{url:string}>}
 */
window.borsogaUpload = function (file, pathname, onProgress) {
  return upload(pathname, file, {
    access: "private",
    handleUploadUrl: "/api/blob-upload/",
    contentType: file.type || "application/octet-stream",
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round(e.percentage || 0))
      : undefined,
  });
};
