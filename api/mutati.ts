/**
 * Respuestas del cuestionario de Mutati ("Unas preguntas antes de arrancar").
 *
 * Página temporal en /mutati/. Mutati ya es cliente del estudio, así que esto
 * no es un lead: no va a Postgres ni a Twenty. Llega por correo al estudio,
 * igual que los avisos de `submit.ts`, y deja antes una copia JSON privada en
 * Blob por si EmailJS falla.
 *
 * Las preguntas se repiten aquí a propósito: el cliente solo manda las
 * respuestas por clave (q1…q10) y el texto del correo sale del servidor, así
 * nadie puede cambiar lo que se lee en el aviso. Si se edita una pregunta en
 * `src/mutati.py`, hay que editarla también aquí.
 */
import { leadPath, fileLink } from "./_files.js";

export const config = { maxDuration: 30 };

const PREGUNTAS: [string, string][] = [
  ["q1", "¿Qué es lo primero que cambiaría de la web?"],
  ["q2", "Cuando dice “más lujoso”, ¿a qué se refiere?"],
  ["q3", "Si solo pudiéramos arreglar una cosa, ¿cuál sería?"],
  ["q4", "¿Hay algo que sí le guste y que prefiera que no toquemos?"],
  ["q5", "Dos o tres webs que le gusten"],
  ["q6", "¿Y alguna que no le guste?"],
  ["q7", "Fotos y video: ¿qué tiene hoy y hay chance de producir material nuevo?"],
  ["q8", "¿Se puede mostrar el taller, el proceso, las manos trabajando? ¿Hay aviones o clientes que no se puedan mostrar?"],
  ["q9", "Mirando el menú de hoy: ¿falta algo o sobra algo?"],
  ["q10", "Lo que sea que no le hayamos preguntado"],
];

const LUJO = [
  "Que se vea más caro",
  "Que se sienta más exclusivo, más cerrado al público",
  "Que tenga mejores animaciones y se mueva más bonito",
  "Que las fotos y el video sean mejores",
  "Que los textos suenen mejor",
  "Que se sienta más tranquilo, más cine y menos folleto",
  "Otra cosa",
];

// Obligatorias salvo que venga un audio: espejo de OBLIGATORIAS en src/mutati.py.
const OBLIGATORIAS = ["q1", "q2", "q3", "q4", "q5", "q7", "q8"];

const MAX_TEXTO = 6000;
const MAX_AUDIOS = 5;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const texto = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX_TEXTO) : "");

export default async function handler(req: any, res: any) {
  res.setHeader("cache-control", "no-store");
  const json = (body: any, status = 200) => { res.status(status).json(body); };
  if (req.method !== "POST") return json({ ok: false, error: "Método no permitido." }, 405);

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return json({ ok: false, error: "Datos mal formados." }, 400);
  // Honeypot: al bot le decimos que sí.
  if (body.bot) return json({ ok: true });

  const a = body.answers || {};
  const r: Record<string, string> = {};
  for (const [k] of PREGUNTAS) if (k !== "q2") r[k] = texto(a[k]);
  const lujo = (Array.isArray(a.q2) ? a.q2 : []).filter((v: unknown) => LUJO.includes(String(v)));
  const lujoOtra = texto(a.q2otra);
  const nombre = texto(a.nombre).slice(0, 120);

  const audios = (Array.isArray(body.files) ? body.files : []).slice(0, MAX_AUDIOS).flatMap((f: any) => {
    const path = leadPath(f?.url, "audioFiles");
    return path ? [{ name: String(f.name || "audio").slice(0, 200), url: fileLink(path), size: Number(f.size) || 0 }] : [];
  });

  const faltan: string[] = [];
  if (!audios.length) {
    for (const k of OBLIGATORIAS) {
      const vacia = k === "q2" ? (!lujo.length || (lujo.includes("Otra cosa") && !lujoOtra)) : !r[k];
      if (vacia) faltan.push(k.slice(1));
    }
  }
  if (!nombre) faltan.push("quién responde");
  if (faltan.length) {
    return json({ ok: false, error: `Faltan respuestas obligatorias: ${faltan.join(", ")}.` }, 422);
  }

  // ---------------------------------------------------------------- copia
  const registro = { recibido: new Date().toISOString(), nombre, respuestas: r, lujo, lujoOtra, audios };
  let copia: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const b = await put(`respuestas/mutati/${registro.recibido.replace(/[:.]/g, "-")}.json`,
        JSON.stringify(registro, null, 2),
        { access: "private", addRandomSuffix: true, contentType: "application/json" });
      copia = b.pathname;
    } catch (e: any) {
      console.error("mutati: falló la copia en Blob", e?.message);
    }
  }

  // ---------------------------------------------------------------- correo
  const bloque = (titulo: string, contenido: string) =>
    `<div style="padding:14px 0;border-top:1px solid #ddd"><div style="font-weight:600;margin-bottom:6px">${titulo}</div>${contenido}</div>`;
  const parrafo = (v: string) => v
    ? `<div style="white-space:pre-wrap">${esc(v)}</div>`
    : `<div style="color:#999">Sin respuesta</div>`;

  const cuerpo = PREGUNTAS.map(([k, q], i) => {
    if (k === "q2") {
      const lista = lujo.length ? `<ul style="margin:0;padding-left:18px">${lujo.map((v: string) => `<li>${esc(v)}</li>`).join("")}</ul>` : "";
      const otra = lujoOtra ? `<div style="white-space:pre-wrap;margin-top:6px"><em>Otra cosa:</em> ${esc(lujoOtra)}</div>` : "";
      return bloque(`${i + 1}. ${esc(q)}`, lista || otra ? lista + otra : parrafo(""));
    }
    return bloque(`${i + 1}. ${esc(q)}`, parrafo(r[k]));
  }).join("");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;max-width:680px">
<h2 style="margin:0 0 4px">Mutati · Unas preguntas antes de arrancar</h2>
<p style="margin:0 0 16px;color:#666">Responde: <strong>${nombre ? esc(nombre) : "sin nombre"}</strong></p>
${audios.length ? `<p><strong>Audios:</strong><br>${audios.map((f: any) => `<a href="${f.url}">${esc(f.name)}</a>`).join("<br>")}</p>` : ""}
${cuerpo}
${copia ? `<p style="color:#999;font-size:12px">Copia guardada en Blob: ${esc(copia)}</p>` : ""}
</div>`;

  const ej = {
    service: process.env.EMAILJS_SERVICE_ID,
    template: process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
  const to = process.env.STUDIO_EMAIL;
  let mailError: string | null = null;
  if (ej.service && ej.template && ej.publicKey && ej.privateKey && to) {
    try {
      const resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service_id: ej.service,
          template_id: ej.template,
          user_id: ej.publicKey,
          accessToken: ej.privateKey,
          template_params: {
            to_email: to,
            reply_to: to,
            from_name: nombre ? `${nombre} (Mutati)` : "Mutati",
            subject: `[MUTATI] Respuestas del cuestionario${nombre ? ` · ${nombre}` : ""}`,
            content: html,
          },
        }),
      });
      if (!resp.ok) mailError = `EmailJS ${resp.status}: ${(await resp.text()).slice(0, 200)}`;
    } catch (e: any) {
      mailError = e?.message || "no se pudo enviar";
    }
  } else {
    mailError = "Correo no configurado.";
  }

  // Sin correo, el estudio no se entera aunque haya copia: se lo decimos al
  // cliente para que reintente. Su borrador sigue guardado en el navegador.
  if (mailError) {
    console.error("mutati: no salió el correo", { mailError, copia });
    return json({ ok: false, error: "No pudimos enviarlo. Inténtelo otra vez en un momento; lo que escribió sigue aquí." }, 502);
  }
  return json({ ok: true });
}
