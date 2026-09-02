/**
 * Reglas de servidor para Architectural Visualization.
 *
 * Espejo de las del cliente (`src/quiz_av.js`). Existen por separado de las de
 * interiorismo porque no comparten casi nada: otra validación, otras rutas y
 * otra recomendación de plan. Meterlas en la misma función habría acabado en
 * una maraña de condicionales por servicio.
 *
 * Como siempre: no se confía en lo que manda el cliente. `derived` llega, se
 * guarda, pero la ruta se recalcula aquí.
 */

type A = Record<string, any>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UNSURE_RE = /^(no s[eé]|no lo s[eé]|no lo s[eé] todav[ií]a|todav[ií]a no lo s[eé]|todav[ií]a no|todav[ií]a nada)$/i;
const MAT_NONE = "Todavía nada";
const LAUNCH_FIXED = "Sí, y es fija";
const TYPE_MIXED = "Uso mixto";
const AMENITY_ROOM = "Amenidad";
const TYPE_COM = "Comercial";
const TYPE_HOSP = "Hospitalidad";
const INTERIOR_OPEN = ["Parcialmente", "No, habría que resolverlo"];

const ROOMS_RES = ["Lobby o acceso","Cocina","Sala","Comedor","Dormitorio","Baño","Home office","Clóset o vestidor","Amenidad","Circulación o común"];
const ROOMS_COM = ["Recepción o lobby","Área de trabajo","Sala de juntas","Piso de venta","Restaurante o comedor","Barra","Baños","Circulación"];
const ROOMS_HOSP = ["Lobby","Habitación tipo","Suite","Restaurante","Bar","Spa o gimnasio","Salón de eventos","Piscina o deck"];

const VIEWS: Record<string, number> = { Essential: 2, Premium: 4, "Borsoga Edition": 4 };
const NO_PLAN_VIEWS = 2;

const roomsOf = (a: A) =>
  a.projectType === TYPE_COM ? ROOMS_COM : a.projectType === TYPE_HOSP ? ROOMS_HOSP : ROOMS_RES;

/** Aplana escena → espacio → amenidad, igual que el cliente. */
function unitsOf(a: A): { key: string; label: string; scenes: number }[] {
  const out: { key: string; label: string; scenes: number }[] = [];
  for (const s of a.scenes || []) {
    if (s !== "Interior") {
      out.push({ key: "e:" + s, label: s, scenes: (a.counts || {})[s] || 1 });
      continue;
    }
    for (const r of a.rooms || []) {
      if (r === AMENITY_ROOM) {
        for (const v of a.amenities || [])
          out.push({ key: "a:" + v, label: v, scenes: (a.amenityCounts || {})[v] || 1 });
        continue;
      }
      out.push({ key: "r:" + r, label: r, scenes: (a.roomCounts || {})[r] || 1 });
    }
  }
  return out;
}

export const sceneTotal = (a: A) => unitsOf(a).reduce((n, u) => n + u.scenes, 0);

export function imageTotal(a: A, picked: string) {
  const base = picked ? VIEWS[picked] || NO_PLAN_VIEWS : NO_PLAN_VIEWS;
  return unitsOf(a).reduce((n, u) => {
    const v = (a.viewCounts || {})[u.key];
    return n + u.scenes * (v == null ? base : Math.min(12, Math.max(1, v)));
  }, 0);
}

export const sceneSummary = (a: A) =>
  unitsOf(a).map((u) => `${u.scenes}× ${u.label}`).join(" · ");

function unsureCount(a: A) {
  const vals: string[] = [];
  for (const v of Object.values(a)) {
    if (typeof v === "string") vals.push(v);
    else if (Array.isArray(v)) for (const x of v) if (typeof x === "string") vals.push(x);
  }
  return vals.filter((v) => UNSURE_RE.test(v.trim())).length;
}

function daysUntil(d: string) {
  if (!d) return null;
  const ms = new Date(d + "T00:00:00").getTime() - Date.now();
  return isNaN(ms) ? null : Math.round(ms / 86400000);
}

export function recommendPlan(a: A) {
  if (a.tone === "Editorial" || (a.extras || []).length >= 2 || sceneTotal(a) > 6)
    return "Borsoga Edition";
  if (a.tone === "Atmosférico" || (a.uses || []).includes("Preventa y ventas") ||
      (a.uses || []).includes("Redes sociales y marketing")) return "Premium";
  return "Essential";
}

export function route(a: A, picked: string): [string, string, string] {
  const plan = picked || recommendPlan(a);
  const days = daysUntil(a.launchDate);
  if (plan === "Borsoga Edition")
    return ["call", "Vamos a hablar", "Borsoga Edition se cotiza en una llamada. Tenemos todo lo que nos contaste, así que la conversación empieza donde la dejaste."];
  if (a.material === MAT_NONE)
    return ["call", "Vamos a hablar", "Todavía no hay material del proyecto. Empezamos por una llamada de arranque y ahí definimos qué necesitamos para arrancar."];
  if (sceneTotal(a) > 6)
    return ["call", "Vamos a hablar", `Tu proyecto tiene ${sceneTotal(a)} escenas. A ese volumen el precio lo armamos contigo, no con una calculadora.`];
  if (a.launch === LAUNCH_FIXED && days !== null && days < 28)
    return ["call", "Vamos a hablar", "Tu fecha está a menos de cuatro semanas. Eso lo confirmamos en una llamada antes de comprometer nada."];
  if (a.projectType === TYPE_MIXED)
    return ["call", "Vamos a hablar", "Uso mixto: son varias tipologías dentro de un mismo proyecto, y el alcance se define mejor hablando."];
  if (unsureCount(a) >= 4)
    return ["range", "Te enviamos un rango", "Quedaron varias cosas por definir, así que en vez de un número te mandamos un rango y lo cerramos contigo en una llamada."];
  return ["mail", "Recibimos tu proyecto", "Y agendamos una llamada para revisar las escenas y el calendario: el precio se cierra ahí."];
}

export function validate(a: A): string | null {
  if (a.bot) return "bot";
  if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
  if (!a.privacy) return "Falta aceptar la política de privacidad.";
  for (const f of ["projectType", "stage", "role", "name", "phone", "city", "country", "launch", "portfolio"])
    if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
  if (!(a.scenes || []).length) return "No hay escenas seleccionadas.";
  if (a.launch === LAUNCH_FIXED && !a.launchDate) return "Falta la fecha de lanzamiento.";
  if (a.signer === "Como empresa" &&
      ["entName", "entState", "entSigner", "entRole"].some((f) => !String(a[f] || "").trim()))
    return "Faltan los datos de la empresa.";
  // Coherencia del anidamiento: si pidió Interior, tiene que haber espacios.
  if ((a.scenes || []).includes("Interior") && !(a.rooms || []).length)
    return "Elegiste escenas de interior pero no hay espacios.";
  const permitidos = roomsOf(a);
  if ((a.rooms || []).some((r: string) => !permitidos.includes(r)))
    return "Hay espacios que no corresponden a la tipología del proyecto.";
  if (!a.material) return "Falta indicar qué material tienes.";
  return null;
}

/** Señales que al estudio le sirven para preparar la llamada. */
export function flags(a: A): string[] {
  const f: string[] = [];
  if (INTERIOR_OPEN.includes(a.interiorDesign))
    f.push("Oportunidad de interior design: el interior no está resuelto.");
  if (a.material === MAT_NONE) f.push("Sin material del proyecto.");
  const d = daysUntil(a.launchDate);
  if (a.launch === LAUNCH_FIXED && d !== null && d < 28) f.push(`Lanzamiento en ${d} días.`);
  if (a.projectType === TYPE_MIXED) f.push("Uso mixto: varias tipologías.");
  const cross = (a.cross || []).filter((v: string) => v !== "No, por ahora no");
  if (cross.length) f.push("Pide además: " + cross.join(", "));
  if (unsureCount(a) >= 4) f.push("Varias respuestas sin definir.");
  return f;
}

export function noteBody(a: A, picked: string, rt: string[], files: any[]) {
  const row = (k: string, v: any) => (v ? `- **${k}:** ${v}\n` : "");
  const plan = picked || recommendPlan(a);
  const fl = flags(a);
  return [
    `**${rt[1]}** · Plan: **${plan}**\n\n`,
    row("Tipo de proyecto", a.projectType),
    row("Etapa", a.stage),
    row("Quién escribe", a.role),
    row("Escenas", sceneSummary(a)),
    row("Escenas totales", sceneTotal(a)),
    row("Imágenes estimadas", imageTotal(a, picked)),
    row("Contexto urbano", a.context),
    row("Diseño interior", a.interiorDesign),
    row("La pieza", a.piece),
    row("Material", a.material),
    row("Enlace", a.link),
    row("Especificación", a.spec),
    row("Uso de las imágenes", (a.uses || []).join(", ")),
    row("Tono", a.tone),
    row("Extras", (a.extras || []).join(", ")),
    row("Alrededor del proyecto", (a.cross || []).filter((v: string) => v !== "No, por ahora no").join(", ")),
    row("Ubicación", [a.city, a.country].filter(Boolean).join(", ")),
    row("Empresa", a.company),
    row("Lanzamiento", a.launch === LAUNCH_FIXED ? a.launchDate : a.launch),
    row("Portafolio", a.portfolio),
    row("Firma", a.signer === "Como empresa"
      ? `Empresa: ${a.entName} (${a.entState}) — firma ${a.entSigner}, ${a.entRole}`
      : "A título personal"),
    files.length ? `\n**Archivos (privados):**\n${files.map((f: any) => `- ${f.url}`).join("\n")}\n` : "",
    fl.length ? `\n**Señales:**\n${fl.map((x) => `- ${x}`).join("\n")}\n` : "",
    `\n_Ruta: ${rt[0]}. ${rt[2]}_`,
  ].join("");
}
