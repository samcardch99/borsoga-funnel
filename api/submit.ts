/**
 * Recepción del configurador de Interior Design.
 *
 * Recibe JSON con `answers`, `derived` y las URLs de los archivos que el
 * cliente ya subió directo a Blob. Guarda el lead en Postgres y avisa al
 * estudio por correo.
 *
 * Dos criterios que marcan el diseño de esto:
 *
 *  1. **No se confía en `derived`.** El cliente manda su cálculo de ruta y
 *     plan, pero aquí se recalcula. Un cliente manipulado no puede hacer que
 *     un proyecto que toca muros estructurales entre como "mándale el precio
 *     por correo". Guardamos ambos y marcamos si no coinciden.
 *  2. **Un lead nunca se pierde en silencio.** Si falla el correo, o Blob, o
 *     lo que sea, el lead ya está en la base de datos y la respuesta lo dice.
 *     Perder un lead es peor que dar un error.
 */

const MAX_FILES = 20;

const STRUCT_WALLS = "Se mueven o se quitan paredes";
const STRUCT_FACADE = "Cambios en la fachada del edificio o la casa";
const OWNER_REP = "No, soy el representante autorizado";
const DEADLINE_FIXED = "Sí, y es fija";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UNSURE_RE = /^(no s[eé]|no lo s[eé]|no lo s[eé] todav[ií]a|todav[ií]a no lo s[eé])$/i;
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com",
  "10minutemail.com", "10minutemail.net", "temp-mail.org", "tempmail.com", "tempmail.net",
  "throwawaymail.com", "yopmail.com", "trashmail.com", "getnada.com", "dispostable.com",
  "maildrop.cc", "fakeinbox.com", "mailnesia.com", "tempr.email", "moakt.com",
  "mohmal.com", "discard.email",
]);

type Answers = Record<string, any>;
type UploadRef = { kind: string; name: string; url: string; size: number };

const safeParse = (s: string) => { try { return JSON.parse(s); } catch { return null; } };

const isFlorida = (s: string) =>
  ["florida", "fl", "fl."].includes(String(s || "").trim().toLowerCase());

// La cobertura real es Miami-Dade: fuera del condado el proyecto va a llamada
// aunque siga en Florida. Espejo de la lista del cliente.
const MIAMI_DADE = ["miami","miami beach","miami gardens","miami lakes","miami shores","miami springs",
  "north miami","north miami beach","south miami","west miami","coral gables","hialeah","hialeah gardens",
  "doral","aventura","key biscayne","homestead","florida city","kendall","pinecrest","palmetto bay",
  "cutler bay","sunny isles beach","bal harbour","bay harbor islands","surfside","coconut grove","brickell",
  "opa-locka","opa locka","sweetwater","virginia gardens","medley","golden beach","indian creek","el portal",
  "biscayne park","north bay village"];
const isMiamiDade = (c: string) =>
  MIAMI_DADE.includes(String(c || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

const unitTotal = (a: Answers) =>
  (a.spaces || []).reduce((t: number, s: string) => t + ((a.counts || {})[s] || 1), 0);

const structuralFlag = (a: Answers) =>
  !!a.workType && a.workType !== "Obra nueva" &&
  ((a.structure || []).includes(STRUCT_WALLS) || (a.structure || []).includes(STRUCT_FACADE));

function unsureCount(a: Answers) {
  const vals: string[] = [];
  for (const v of Object.values(a)) {
    if (typeof v === "string") vals.push(v);
    else if (Array.isArray(v)) for (const x of v) if (typeof x === "string") vals.push(x);
  }
  return vals.filter((v) => UNSURE_RE.test(v.trim())).length;
}

function recommendPlan(a: Answers) {
  if (a.city && !isMiamiDade(a.city)) return "Borsoga Edition";
  const isHouse = a.propertyType === "Casa";
  const needsPlans = a.workType === "Obra nueva" ||
    (a.projectType === "Para vender o rentar" && a.ownership === "Estoy en proceso de compra") ||
    (a.projectType === "Es un espacio comercial" && a.occupancy === "Todavía no lo tengo");
  if (a.finish === "Lujo" || (isHouse && (a.spaces || []).length > 4) || (a.extras || []).length >= 2)
    return "Borsoga Edition";
  if (needsPlans || a.workType === "Obra nueva" || structuralFlag(a) || a.plumbing === "Sí")
    return "Premium";
  return "Essential";
}

/** Espejo servidor de `route()` del cliente. Decide qué correo sale. */
function route(a: Answers, picked: string): [string, string, string] {
  if (picked === "Borsoga Edition")
    return ["call", "Vamos a hablar", "Borsoga Edition se cotiza en una llamada. Tenemos todo lo que nos contaste, así que la conversación empieza donde la dejaste."];
  if (a.state && !isFlorida(a.state))
    return ["call", "Vamos a hablar", "La dirección del proyecto está fuera de Florida. Eso lo revisamos contigo antes de hablar de precio."];
  if (a.city && !isMiamiDade(a.city))
    return ["call", "Vamos a hablar", "Tu proyecto está fuera de Miami-Dade. Podemos hacerlo, pero el alcance y el desplazamiento los cerramos hablando."];
  if (structuralFlag(a))
    return ["call", "Vamos a hablar", "Tu proyecto mueve paredes o toca la fachada. Eso necesita un arquitecto o ingeniero con licencia, así que lo armamos contigo antes de dar un número."];
  if (unitTotal(a) > 6)
    return ["call", "Vamos a hablar", `Tu proyecto tiene ${unitTotal(a)} espacios. A ese tamaño el precio lo armamos contigo, no con una calculadora.`];
  if (a.finish === "Lujo" && a.workType === "Obra nueva")
    return ["call", "Vamos a hablar", "Nivel lujo en obra nueva. Eso lo conversamos antes de darte un número."];
  if (a.health === "Sí")
    return ["call", "Vamos a hablar", "Un proyecto que pasa por el departamento de salud tiene su propio calendario. Lo armamos contigo antes de hablar de precio."];
  if (unsureCount(a) >= 4)
    return ["range", "Te enviamos un rango", "Quedaron varias cosas por definir, así que en vez de un número te mandamos un rango y lo cerramos contigo en una llamada."];
  return ["mail", "Recibimos tu proyecto", "Vamos a revisar lo que nos contaste y te escribimos para hablar del precio y el plazo. Nada de esto es automático: lo mira una persona del estudio."];
}

/** Rechaza lo que no debería llegar nunca de un cliente honesto. */
function validate(a: Answers): string | null {
  if (a.bot) return "bot";
  if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
  if (DISPOSABLE.has(String(a.email).split("@")[1]?.toLowerCase()))
    return "Necesitamos un correo donde podamos enviarte la propuesta.";
  if (!a.privacy) return "Falta aceptar la política de privacidad.";
  for (const f of ["name", "phone", "street", "city", "state", "zip", "timing", "pro", "portfolio", "decider", "isOwner"])
    if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
  if (a.isOwner === OWNER_REP && !EMAIL_RE.test(String(a.ownerEmail || "")))
    return "Falta el correo del dueño de la propiedad.";
  if (a.deadline === DEADLINE_FIXED && !a.deadlineDate)
    return "Falta la fecha límite.";
  if (a.signer === "Como empresa" &&
      ["entName", "entState", "entSigner", "entRole"].some((f) => !String(a[f] || "").trim()))
    return "Faltan los datos de la empresa.";
  // Coherencia: si eligió lavandería o barra, esas respuestas tienen que venir.
  const esp: string[] = a.spaces || [];
  if (esp.includes("Lavandería") && (!a.laundry || !a.laundryLayout))
    return "Faltan los datos de la lavandería.";
  if (esp.includes("Barra") && !a.barEquip)
    return "Falta el equipo de la barra.";
  if (!(a.spaces || []).length) return "No hay espacios seleccionados.";
  return null;
}

/** El formulario de la portada pide cuatro cosas y nada más. */
function validarContacto(a: Answers): string | null {
  if (a.bot) return "bot";
  if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
  if (DISPOSABLE.has(String(a.email).split("@")[1]?.toLowerCase()))
    return "Necesitamos un correo donde podamos responderte.";
  for (const f of ["name", "phone", "project"])
    if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
  return null;
}

/** Recorta a lo que cabe en una columna de texto y evita cargas absurdas. */
const trim = (v: any, n = 400) => (typeof v === "string" ? v.slice(0, n) : v);
function sanitize(a: Answers): Answers {
  const out: Answers = {};
  for (const [k, v] of Object.entries(a)) {
    if (Array.isArray(v)) out[k] = v.slice(0, 40).map((x) => trim(x, 200));
    else if (v && typeof v === "object") out[k] = v;
    else out[k] = trim(v);
  }
  delete out.bot;
  return out;
}

export const config = { maxDuration: 30 };

export default async function handler(req: any, res: any) {
  res.setHeader("cache-control", "no-store");
  const json = (body: any, status = 200) => { res.status(status).json(body); };

  if (req.method !== "POST") return json({ ok: false, error: "Método no permitido." }, 405);

  // Los archivos ya están en Blob: aquí solo llega JSON con sus URLs.
  const payload = typeof req.body === "string" ? safeParse(req.body) : req.body;
  if (!payload) return json({ ok: false, error: "Datos mal formados." }, 400);

  // Dos servicios, dos juegos de reglas. El cliente dice cuál, pero las
  // reglas que se aplican son siempre las del servidor.
  const service = ["av", "contacto"].includes(payload.service) ? payload.service : "interior";
  const AV = service === "av" ? await import("./_av.js") : null;
  const ES_CONTACTO = service === "contacto";

  let a: Answers = payload.answers || {};
  const clientDerived: any = payload.derived || {};
  const uploads: UploadRef[] = Array.isArray(payload.files) ? payload.files.slice(0, MAX_FILES) : [];

  // El formulario de la portada es una consulta corta, no un cuestionario:
  // valida solo lo que necesita para poder responder.
  const bad = ES_CONTACTO ? validarContacto(a) : (AV ? AV.validate(a) : validate(a));
  // Al bot le devolvemos ok: si le decimos que lo pillamos, prueba otra cosa.
  if (bad === "bot") return json({ ok: true, route: AV ? AV.route(a, "") : route(a, "") });
  if (bad) return json({ ok: false, error: bad }, 422);

  a = sanitize(a);
  const picked = String(clientDerived?.picked || "");
  const rt: [string, string, string] = ES_CONTACTO
    ? ["call", "Recibimos tu mensaje", "Te escribimos en persona para hablar del proyecto."]
    : (AV ? AV.route(a, picked) : route(a, picked));
  const plan = ES_CONTACTO ? "—" : (picked || (AV ? AV.recommendPlan(a) : recommendPlan(a)));
  // Si el cliente calculó otra ruta, lo anotamos: o hay un bug, o alguien tocó.
  const mismatch = !ES_CONTACTO && clientDerived?.route && clientDerived.route !== rt[0]
    ? `cliente=${clientDerived.route} servidor=${rt[0]}` : null;

  // ---------------------------------------------------------------- archivos
  // Solo referencias. Validamos que apunten a nuestro store y nada más:
  // el cliente no puede colar una URL arbitraria en el aviso al estudio.
  const fileErrors: string[] = [];
  const files = uploads.filter((u) => {
    const ok = u && typeof u.url === "string" &&
      /^https:\/\/[a-z0-9-]+\.(public\.)?blob\.vercel-storage\.com\//.test(u.url) &&
      ["photos", "planFiles", "applianceFiles"].includes(u.kind);
    if (!ok) fileErrors.push(`referencia de archivo descartada: ${String(u?.name).slice(0, 60)}`);
    return ok;
  }).map((u) => ({ kind: u.kind, name: String(u.name).slice(0, 200), url: u.url, size: Number(u.size) || 0 }));

  // ---------------------------------------------------------------- guardado
  let leadId: number | null = null;
  let dbError: string | null = null;
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`create table if not exists leads (
        id serial primary key,
        created_at timestamptz not null default now(),
        service text not null default 'interior',
        name text, email text, phone text,
        city text, state text, plan text, route text,
        unit_total int, image_total int, unsure int,
        structural boolean, mismatch text,
        answers jsonb not null, derived jsonb, files jsonb
      )`;
      await sql`alter table leads add column if not exists service text not null default 'interior'`;
      const rows = await sql`insert into leads
        (service, name, email, phone, city, state, plan, route, unit_total, image_total,
         unsure, structural, mismatch, answers, derived, files)
        values (${service}, ${a.name}, ${a.email}, ${a.phone}, ${a.city},
                ${AV ? a.country : (a.state || null)}, ${plan}, ${rt[0]},
                ${ES_CONTACTO ? 0 : (AV ? AV.sceneTotal(a) : unitTotal(a))},
                ${ES_CONTACTO ? null : (AV ? AV.imageTotal(a, picked) : (clientDerived?.imageTotal ?? null))},
                ${ES_CONTACTO ? 0 : unsureCount(a)}, ${(AV || ES_CONTACTO) ? false : structuralFlag(a)}, ${mismatch},
                ${JSON.stringify(a)}, ${JSON.stringify(clientDerived || {})},
                ${JSON.stringify(files)})
        returning id`;
      leadId = rows[0]?.id ?? null;
    } catch (e: any) {
      dbError = e?.message || "error de base de datos";
    }
  } else {
    dbError = "Base de datos no configurada.";
  }

  // Red de seguridad: si no hay Postgres, el lead se escribe como JSON en Blob.
  // No es consultable, pero un lead en un archivo es infinitamente mejor que un
  // lead perdido. Se puede importar cuando la base de datos exista.
  let backupUrl: string | null = null;
  if (dbError && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const blob = await put(
        `leads-backup/${stamp}-${String(a.email).replace(/[^\w.@-]/g, "_")}.json`,
        JSON.stringify({ at: new Date().toISOString(), plan, route: rt[0], answers: a,
                         derived: clientDerived, files, dbError }, null, 1),
        { access: "private", addRandomSuffix: true, contentType: "application/json" },
      );
      backupUrl = blob.url;
    } catch (e: any) {
      console.error("falló también la copia en Blob", e?.message);
    }
  }

  // ---------------------------------------------------------------- CRM
  // El lead entra en Twenty como persona + oportunidad + nota. Si falla, el
  // lead ya está guardado y el correo sale igual: nunca tumba el envío.
  const { pushToTwenty } = await import("./_twenty.js");
  const crm = await pushToTwenty(a, clientDerived, plan, rt, files, service,
                                 AV ? AV.noteBody(a, picked, rt, files) : null,
                                 AV ? AV.sceneSummary(a) : null);
  if (crm.error) console.warn("Twenty:", crm.error);

  // ---------------------------------------------------------------- aviso
  //
  // El correo sale por EmailJS, llamando a su API REST desde aquí y no desde el
  // navegador. EmailJS está pensado para el cliente, pero ahí su clave pública
  // queda a la vista de cualquiera que abra el inspector: bastaría copiarla para
  // gastar la cuota del estudio o mandar correos en su nombre. Desde el servidor
  // la clave privada no sale nunca, y el aviso no depende de que el navegador
  // del cliente siga abierto al terminar el envío.
  //
  // Para que EmailJS acepte llamadas que no vienen de un navegador hay que
  // activar "Allow EmailJS API for non-browser applications" en Account →
  // Security. Con eso puesto, `accessToken` pasa a ser obligatorio.
  //
  // El cuerpo se arma aquí y viaja como un solo parámetro de plantilla, así que
  // la plantilla en su panel es una línea: {{{content}}} con tres llaves, que es
  // como Handlebars escribe HTML sin escapar.
  let mailError: string | null = null;
  const ej = {
    service: process.env.EMAILJS_SERVICE_ID,
    template: process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  };
  const to = process.env.STUDIO_EMAIL;
  if (ej.service && ej.template && ej.publicKey && ej.privateKey && to) {
    const line = (k: string, v: any) => (v ? `<tr><td style="padding:4px 14px 4px 0;color:#666">${k}</td><td>${String(v)}</td></tr>` : "");
    const body = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">
<h2 style="margin:0 0 4px">${rt[1]} · ${plan}</h2>
<p style="margin:0 0 16px;color:#666">Servicio: <strong>${service}</strong> · Ruta: <strong>${rt[0]}</strong>${AV ? AV.flags(a).map((f) => `<br>⚠ ${f}`).join("") : ""}${mismatch ? ` · ⚠ discrepancia: ${mismatch}` : ""}${structuralFlag(a) ? " · ⚠ obra estructural" : ""}</p>
<table style="border-collapse:collapse">
${line("Nombre", a.name)}${line("Correo", a.email)}${line("Teléfono", a.phone)}
${line("Dirección", [a.street, a.city, a.state, a.zip].filter(Boolean).join(", "))}
${line("Proyecto", [a.projectType, a.workType].filter(Boolean).join(" · "))}
${line(AV ? "Escenas" : "Espacios", AV ? AV.sceneSummary(a) : clientDerived?.spaceSummary)}${line("Imágenes", AV ? AV.imageTotal(a, picked) : clientDerived?.imageTotal)}
${line(AV ? "Tono" : "Acabado", AV ? a.tone : a.finish)}${line("Presupuesto", a.budget)}${line("Cuándo", a.timing)}
${line("Quién decide", a.decider)}${line("Extras", (a.extras || []).join(", "))}
${line("Archivos", files.length)}${line("Sin definir", unsureCount(a))}
${line("Lead", leadId)}${line("CRM", crm.opportunityId ? "oportunidad creada" : `⚠ ${crm.error}`)}
</table>
${files.length ? `<p><strong>Archivos (privados):</strong><br>${files.map((f: any) => f.url).join("<br>")}</p>` : ""}
${fileErrors.length ? `<p style="color:#b00">Archivos con problema:<br>${fileErrors.join("<br>")}</p>` : ""}
${dbError ? `<p style="color:#b00"><strong>No se guardó en la base de datos:</strong> ${dbError}${backupUrl ? `<br>Copia en Blob: ${backupUrl}` : "<br>Este correo es la única copia. Guárdalo."}</p>` : ""}
<pre style="background:#f6f6f6;padding:14px;overflow:auto;font-size:12px">${JSON.stringify(a, null, 1).replace(/</g, "&lt;").slice(0, 12000)}</pre>
</div>`;
    const subject = `${rt[0] === "call" ? "[LLAMADA]" : rt[0] === "range" ? "[RANGO]" : "[ESTIMADO]"} ${service === "av" ? "AV" : service === "contacto" ? "CONSULTA" : "Interior"} · ${a.name} · ${a.city || ""} · ${plan}`;
    try {
      const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service_id: ej.service,
          template_id: ej.template,
          user_id: ej.publicKey,
          accessToken: ej.privateKey,
          template_params: {
            to_email: to,
            reply_to: a.email,
            from_name: a.name || "Borsoga Studio",
            subject,
            content: body,
          },
        }),
      });
      // EmailJS responde "OK" en texto plano, no JSON.
      if (!r.ok) mailError = `EmailJS ${r.status}: ${(await r.text()).slice(0, 200)}`;
    } catch (e: any) {
      mailError = e?.message || "no se pudo enviar";
    }
  } else {
    // se nombran las variables tal y como se escriben en Vercel, que es lo que
    // hace falta buscar cuando esto sale en un log a deshora
    const faltan = Object.entries({
      EMAILJS_SERVICE_ID: ej.service, EMAILJS_TEMPLATE_ID: ej.template,
      EMAILJS_PUBLIC_KEY: ej.publicKey, EMAILJS_PRIVATE_KEY: ej.privateKey,
      STUDIO_EMAIL: to,
    }).filter(([, v]) => !v).map(([k]) => k).join(", ");
    mailError = `Correo no configurado (falta: ${faltan}).`;
  }

  // Si no hay ni base de datos ni correo, el lead se habría perdido: hay que
  // decirlo, no fingir que llegó.
  if (dbError && mailError && !backupUrl) {
    console.error("LEAD PERDIDO", { dbError, mailError, a });
    return json({ ok: false, error: "No pudimos registrar tu proyecto. Escríbenos a borsogastudio@gmail.com y lo resolvemos." }, 500);
  }
  if (dbError || mailError) console.warn("lead parcial", { leadId, backupUrl, dbError, mailError, fileErrors });

  return json({ ok: true, route: rt, id: leadId, files: files.length, backup: !!backupUrl, crm: !!crm.opportunityId });
}
