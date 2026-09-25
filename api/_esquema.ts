/**
 * Los cuestionarios largos (diseño web, identidad de marca) como datos.
 *
 * El esquema lo edita el panel (admin.borsogastudio.com), se publica en
 * versiones numeradas (tabla `form_versions`) y la web lo lee al compilarse.
 * Cada envío dice con qué versión se rellenó, y se valida contra ESA versión:
 * una página vieja en la caché del CDN (hasta 7 días en Hostinger) sigue
 * pudiendo enviar aunque en el panel ya se haya publicado otra.
 *
 * Las condiciones (`si`) se evalúan igual que en el navegador
 * (borsoga-studio/src/plans/forms/esquema.js). Si cambian los operadores,
 * cambian en los dos sitios.
 */

export type Par = { es: string; en?: string };
export type Cond = { f: string; op: "filled" | "eq" | "ne" | "in" | "has"; v?: any };
export type Opcion = Par & { fija?: boolean };
export type Pregunta = {
  f: string; tipo: string; q: Par; h?: Par; ph?: Par;
  req?: boolean; col?: boolean; tope?: number; enlace?: string; area?: string; solo?: string;
  si?: Cond[]; ops?: Opcion[]; ejes?: { a: Par; b: Par }[]; a11y?: Par;
  campos?: { nombre: Par; correo: Par; telefono: Par };
  resumen?: Par; junto?: string[];
};
export type Paso = { id: string; titulo: Par; preguntas: Pregunta[] };
export type Esquema = {
  formato: 1; servicio: string; planes?: string[]; clave: string;
  textos: Record<string, Par>; pasos: Paso[];
};

type A = Record<string, any>;

export const TIPOS = ["texto", "area", "fecha", "chips", "cards", "checks", "chipchecks", "tope",
                      "subida", "ejes", "contacto"] as const;
export const CON_OPCIONES = new Set(["chips", "cards", "checks", "chipchecks", "tope"]);
export const LISTAS = new Set(["checks", "chipchecks", "tope"]);
const OPS = new Set(["filled", "eq", "ne", "in", "has"]);
// Campos que el servidor o el motor usan con nombre propio.
const RESERVADOS = new Set(["contactName", "email", "phone", "privacy", "bot", "plan", "name",
                            "service", "version", "answers", "files", "derived"]);
const TEXTOS = ["contador", "tope", "subir", "enlace", "guardado", "finalTitulo", "finalP1",
                "finalP2", "finalFirma", "resumen"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const lleno = (v: any) =>
  Array.isArray(v) ? v.length > 0
  : v && typeof v === "object" ? Object.keys(v).length > 0
  : !!String(v ?? "").trim();

export function cumple(conds: Cond[] | undefined, a: A): boolean {
  return (conds || []).every((c) => {
    const v = a[c.f];
    switch (c.op) {
      case "filled": return lleno(v);
      case "eq": return v === c.v;
      case "ne": return v !== c.v;
      case "in": return (c.v || []).includes(v);
      case "has": return Array.isArray(v) && (c.v || []).some((x: any) => v.includes(x));
      default: return false;
    }
  });
}

export const preguntas = (e: Esquema) => e.pasos.flatMap((p) => p.preguntas);

/** Lo mismo que validaba `_brief.ts` a mano, derivado del esquema. */
export function validarRespuestas(e: Esquema, a: A, uploads: any[] = []): string | null {
  if (a.bot) return "bot";
  if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
  if (!a.privacy) return "Falta aceptar la política de privacidad.";
  for (const f of ["contactName", "phone"])
    if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
  for (const q of preguntas(e)) {
    if (!q.req || q.tipo === "contacto" || !cumple(q.si, a)) continue;
    if (q.tipo === "subida") {
      const hay = uploads.some((u: any) => u?.kind === q.f) || (!!q.area && lleno(a[q.area]));
      if (!hay) return q.area ? "Faltan las referencias visuales." : `Falta un dato obligatorio (${q.f}).`;
    } else if (q.tipo === "ejes") {
      const ejes = a[q.f] || {};
      if ((q.ejes || []).some((_, i) => ejes[i] == null)) return "Faltan posiciones en los ejes de personalidad.";
    } else if (!lleno(a[q.f])) {
      return `Falta un dato obligatorio (${q.f}).`;
    }
  }
  return null;
}

function valor(q: Pregunta | undefined, a: A, f: string): string {
  const v = a[f];
  if (q?.tipo === "ejes") {
    return (q.ejes || []).map((e, i) => (v?.[i] ? `${e.a.es} ${v[i]}/5 ${e.b.es}` : "")).filter(Boolean).join(" · ");
  }
  if (q?.tipo === "subida") return [q.area && a[q.area], q.enlace && a[q.enlace]].filter(Boolean).join(" · ");
  if (Array.isArray(v)) return v.join(", ");
  return v == null ? "" : String(v);
}

/**
 * Filas de la nota del CRM: todas las preguntas visibles con respuesta, con el
 * texto de la pregunta (o su etiqueta de resumen) en español. Una pregunta
 * nueva del panel aparece aquí sin tocar código.
 */
export function filasNota(e: Esquema, a: A): [string, string][] {
  const filas: [string, string][] = [];
  for (const q of preguntas(e)) {
    if (q.tipo === "contacto" || !cumple(q.si, a)) continue;
    const v = valor(q, a, q.f);
    if (!v) continue;
    filas.push([(q.resumen?.es || q.q.es).replace(/[¿?:.]+$/g, "").replace(/^¿/, ""), v]);
  }
  return filas;
}

// ─────────────────────────────────────────────────────────────── publicar

/**
 * Lo que impide publicar un borrador. `anterior` es la versión publicada: las
 * opciones fijas (las que compara el servidor, ver `_brief.ts`) no pueden
 * desaparecer ni cambiar de texto en español, y una pregunta ya publicada no
 * puede cambiar de tipo de respuesta (texto ↔ lista), porque los leads guardados
 * dejarían de leerse igual.
 */
export function erroresEsquema(e: Esquema, anterior?: Esquema | null): string[] {
  const err: string[] = [];
  if (!e || typeof e !== "object" || !Array.isArray(e.pasos)) return ["El cuestionario está vacío o mal formado."];
  if (!e.pasos.length) err.push("Tiene que haber al menos un paso.");
  for (const k of TEXTOS) if (!e.textos?.[k]?.es?.trim()) err.push(`Falta el texto general «${k}».`);

  const vistos = new Map<string, Pregunta>();
  const orden: string[] = [];
  let contactos = 0;
  e.pasos.forEach((paso, i) => {
    const donde = `Paso ${i + 1}`;
    if (!paso.titulo?.es?.trim()) err.push(`${donde}: falta el título.`);
    if (!paso.preguntas?.length) err.push(`${donde}: no tiene preguntas.`);
    for (const q of paso.preguntas || []) {
      const n = `${donde}, «${q.q?.es || q.f}»`;
      if (!/^[a-zA-Z][a-zA-Z0-9_]{1,40}$/.test(q.f || "")) err.push(`${n}: nombre interno no válido.`);
      if (vistos.has(q.f)) err.push(`${n}: el nombre interno «${q.f}» está repetido.`);
      if (RESERVADOS.has(q.f)) err.push(`${n}: «${q.f}» es un nombre reservado.`);
      if (!(TIPOS as readonly string[]).includes(q.tipo)) err.push(`${n}: tipo «${q.tipo}» desconocido.`);
      if (!q.q?.es?.trim()) err.push(`${n}: falta el texto de la pregunta.`);
      if (q.tipo === "contacto") {
        contactos++;
        if (i !== e.pasos.length - 1) err.push(`${n}: los datos de contacto tienen que ir en el último paso.`);
        if (q.si?.length) err.push(`${n}: los datos de contacto no pueden depender de otra respuesta.`);
      }
      if (CON_OPCIONES.has(q.tipo)) {
        const ops = q.ops || [];
        if (ops.length < 2) err.push(`${n}: necesita al menos dos opciones.`);
        const es = ops.map((o) => (o.es || "").trim());
        if (es.some((x) => !x)) err.push(`${n}: hay una opción sin texto.`);
        if (new Set(es).size !== es.length) err.push(`${n}: hay opciones repetidas.`);
        if (q.tipo === "tope" && !(q.tope! >= 1 && q.tope! <= ops.length)) err.push(`${n}: el máximo de elecciones no cuadra con las opciones.`);
        if (q.solo && !es.includes(q.solo)) err.push(`${n}: la opción exclusiva ya no existe.`);
      }
      if (q.tipo === "ejes" && !(q.ejes || []).length) err.push(`${n}: no tiene ejes.`);
      for (const c of q.si || []) {
        const ref = vistos.get(c.f);
        if (!ref) { err.push(`${n}: depende de «${c.f}», que no es una pregunta anterior.`); continue; }
        if (!OPS.has(c.op)) err.push(`${n}: condición «${c.op}» desconocida.`);
        const vals = c.op === "eq" || c.op === "ne" ? [c.v] : c.op === "in" || c.op === "has" ? (c.v || []) : [];
        if ((c.op === "in" || c.op === "has") && !vals.length) err.push(`${n}: una condición no tiene valores.`);
        if (ref.ops) {
          const validos = new Set(ref.ops.map((o) => o.es));
          for (const v of vals) if (!validos.has(v)) err.push(`${n}: depende de la opción «${v}», que ya no existe en «${ref.q.es}».`);
        }
      }
      vistos.set(q.f, q);
      orden.push(q.f);
      for (const extra of [q.enlace, q.area].filter(Boolean) as string[]) {
        if (vistos.has(extra) || RESERVADOS.has(extra)) err.push(`${n}: el campo «${extra}» está repetido o es reservado.`);
        vistos.set(extra, { f: extra, tipo: "texto", q: q.q });
      }
    }
  });
  if (contactos !== 1) err.push("Tiene que haber exactamente una pregunta de datos de contacto.");
  for (const q of preguntas(e)) for (const j of q.junto || [])
    if (!vistos.has(j)) err.push(`«${q.q.es}»: el resumen incluye «${j}», que no existe.`);

  if (anterior) {
    const nuevas = new Map(preguntas(e).map((q) => [q.f, q]));
    for (const q of preguntas(anterior)) {
      const fijas = (q.ops || []).filter((o) => o.fija).map((o) => o.es);
      const ahora = nuevas.get(q.f);
      if (!ahora) {
        if (fijas.length || q.tipo === "contacto") err.push(`«${q.q.es}» no se puede borrar: el servidor la usa.`);
        continue;
      }
      if (LISTAS.has(q.tipo) !== LISTAS.has(ahora.tipo) || (q.tipo === "ejes") !== (ahora.tipo === "ejes")
          || (q.tipo === "subida") !== (ahora.tipo === "subida"))
        err.push(`«${ahora.q.es}»: no puede cambiar de tipo de respuesta una vez publicada.`);
      const hay = new Set((ahora.ops || []).map((o) => o.es));
      for (const v of fijas) if (!hay.has(v)) err.push(`«${ahora.q.es}»: la opción «${v}» no se puede quitar ni renombrar (la usa el servidor).`);
    }
  }
  return err;
}
