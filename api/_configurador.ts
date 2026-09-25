/**
 * Los configuradores (interiorismo y AV) cuando el envío trae `version`: sus
 * listas, reglas y ajustes vienen de la versión publicada en el panel, no del
 * código. Mismo interfaz que la lógica fija de siempre (submit.ts para
 * interiorismo, _av.ts para AV), que sigue sirviendo a los envíos sin versión.
 *
 * Espejo del navegador:
 *   borsoga-studio/src/plans/client/quiz.js, quiz-av.js  (señales)
 *   borsoga-studio/src/plans/forms/reglas.js              (reglas)
 * Si cambia uno, cambia el otro.
 */

type A = Record<string, any>;
type Par = { es: string; en?: string };
export type Opcion = Par & { rol?: string; grupo?: string; marcas?: Record<string, boolean>; duda?: boolean;
  n?: number; desc?: Par; etiqueta?: Par; plural?: Par; slot?: Par };
export type Lista = { nombre: string; ops: Opcion[] };
export type Cond = { s: string; op?: string; v?: any; f?: string };
export type Config = {
  formato: 2; servicio: "interior" | "av"; clave: string;
  listas: Record<string, Lista>; textos: Record<string, Par & { grupo?: string }>;
  reglas: {
    planDefecto: string; plan: { plan: string; si: Cond[] }[];
    ruta: { tipo: string; si: Cond[]; texto: Par }[]; rutaDefecto: { tipo: string; texto: Par };
    titulos: Record<string, Par>; avisos: { si: Cond[]; texto: Par }[];
  };
  ajustes: Record<string, any>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com",
  "10minutemail.com", "10minutemail.net", "temp-mail.org", "tempmail.com", "tempmail.net",
  "throwawaymail.com", "yopmail.com", "trashmail.com", "getnada.com", "dispostable.com",
  "maildrop.cc", "fakeinbox.com", "mailnesia.com", "tempr.email", "moakt.com",
  "mohmal.com", "discard.email",
]);
const UNSURE_INT = /^(no s[eé]|no lo s[eé]|no lo s[eé] todav[ií]a|todav[ií]a no lo s[eé])$/i;
const UNSURE_AV = /^(no s[eé]|no lo s[eé]|no lo s[eé] todav[ií]a|todav[ií]a no lo s[eé]|todav[ií]a no|todav[ií]a nada)$/i;

// ─────────────────────────────────────────────────────────────── reglas
// Mismo significado que forms/reglas.js.

const lleno = (v: any) =>
  Array.isArray(v) ? v.length > 0 : v && typeof v === "object" ? Object.keys(v).length > 0 : !!String(v ?? "").trim();

function una(c: Cond, sen: A, a: A): boolean {
  if (c.s === "campo") {
    const v = a[c.f!];
    switch (c.op) {
      case "es": return v === c.v;
      case "no_es": return v !== c.v;
      case "una_de": return (c.v || []).includes(v);
      case "incluye": return Array.isArray(v) && v.includes(c.v);
      case "lleno": return lleno(v);
      case "vacio": return !lleno(v);
      default: return false;
    }
  }
  const x = sen[c.s];
  switch (c.op || "si") {
    case "si": return !!x;
    case "no": return !x;
    case "es": return x === c.v;
    case "no_es": return x !== c.v;
    case ">": return typeof x === "number" && x > c.v;
    case ">=": return typeof x === "number" && x >= c.v;
    case "<": return typeof x === "number" && x < c.v;
    case "<=": return typeof x === "number" && x <= c.v;
    default: return false;
  }
}
export const cumple = (conds: Cond[] | undefined, sen: A, a: A) => (conds || []).every((c) => una(c, sen, a));
const rellena = (s: string, sen: A) => String(s ?? "").replace(/\{(\w+)\}/g, (m, k) => (sen[k] != null ? String(sen[k]) : m));
function planDe(R: Config["reglas"], sen: A, a: A) {
  return R.plan.find((r) => cumple(r.si, sen, a))?.plan || R.planDefecto;
}
function rutaDe(R: Config["reglas"], sen: A, a: A): [string, string, string] {
  const r = R.ruta.find((x) => cumple(x.si, sen, a)) || R.rutaDefecto;
  return [r.tipo, rellena(R.titulos[r.tipo]?.es || "", sen), rellena(r.texto.es, sen)];
}

// ─────────────────────────────────────────────────────────────── utilidades

function listas(C: Config) {
  const L = C.listas;
  const ops = (id: string) => L[id]?.ops || [];
  return {
    vals: (id: string) => ops(id).map((o) => o.es),
    conRol: (id: string, rol: string) => ops(id).filter((o) => o.rol === rol).map((o) => o.es),
    rol1: (id: string, rol: string) => ops(id).find((o) => o.rol === rol)?.es ?? null,
    rolDe: (id: string, v: any) => ops(id).find((o) => o.es === v)?.rol,
    grupo: (id: string, g: string) => ops(id).filter((o) => o.grupo === g).map((o) => o.es),
    marca: (id: string, m: string) => ops(id).filter((o) => o.marcas?.[m]).map((o) => o.es),
    dudas: new Set(Object.values(L).flatMap((l) => l.ops.filter((o) => o.duda).map((o) => o.es))),
  };
}

function cuentaDudas(a: A, re: RegExp, dudas: Set<string>) {
  const vals: string[] = [];
  for (const v of Object.values(a)) {
    if (typeof v === "string") vals.push(v);
    else if (Array.isArray(v)) for (const x of v) if (typeof x === "string") vals.push(x);
  }
  return vals.filter((v) => re.test(v.trim()) || dudas.has(v)).length;
}

function correoMalo(a: A): string | null {
  if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
  if (DISPOSABLE.has(String(a.email).split("@")[1]?.toLowerCase()))
    return "Necesitamos un correo donde podamos enviarte la propuesta.";
  return null;
}

// ─────────────────────────────────────────────────────────────── interiorismo

export function motorInterior(C: Config) {
  const L = listas(C);
  const ciudades: string[] = C.ajustes?.ciudades || [];
  const plain = (s: string) => String(s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const isMiamiDade = (c: string) => ciudades.includes(plain(c));
  const isFlorida = (s: string) => ["florida", "fl", "fl."].includes(String(s || "").trim().toLowerCase());
  const EMPRESA = L.rol1("signer", "empresa");
  const REP = L.rol1("isOwner", "representante");
  const FIJA = L.rol1("deadline", "fija");
  const estructurales = L.conRol("structure", "estructural");

  const ramas = (a: A) => {
    const isCom = L.rolDe("projectType", a.projectType) === "comercial";
    const isInvest = L.rolDe("projectType", a.projectType) === "invertir";
    const inPurchase = isInvest && L.rolDe("ownership", a.ownership) === "en_compra";
    const noAccess = inPurchase || (isCom && L.rolDe("occupancy", a.occupancy) === "sin_local");
    const isNew = L.rolDe("workType", a.workType) === "nueva";
    return { isCom, isInvest, inPurchase, noAccess, isNew,
             isHouse: L.rolDe("propertyType", a.propertyType) === "casa",
             isCondo: L.rolDe("propertyType", a.propertyType) === "condo",
             isRemodel: !!a.workType && !isNew, needsPlans: isNew || noAccess };
  };
  const unitTotal = (a: A) => (a.spaces || []).reduce((t: number, s: string) => t + ((a.counts || {})[s] || 1), 0);
  const structuralFlag = (a: A) => ramas(a).isRemodel && (a.structure || []).some((v: string) => estructurales.includes(v));
  const unsureCount = (a: A) => cuentaDudas(a, UNSURE_INT, L.dudas);
  const senales = (a: A, picked: string) => {
    const b = ramas(a);
    return {
      plan_elegido: picked || "",
      fuera_florida: !!a.state && !isFlorida(a.state),
      fuera_zona: !!a.city && !isMiamiDade(a.city),
      estructural: structuralFlag(a),
      necesita_planos: b.needsPlans, obra_nueva: b.isNew, es_casa: b.isHouse, es_condo: b.isCondo,
      comercial: b.isCom, invertir: b.isInvest,
      unidades: unitTotal(a), espacios: (a.spaces || []).length, extras: (a.extras || []).length,
      sin_definir: unsureCount(a),
    };
  };

  function validate(a: A): string | null {
    if (a.bot) return "bot";
    const mal = correoMalo(a);
    if (mal) return mal;
    if (!a.privacy) return "Falta aceptar la política de privacidad.";
    for (const f of ["name", "phone", "street", "city", "state", "zip", "timing", "pro", "portfolio", "decider", "isOwner"])
      if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
    if (REP && a.isOwner === REP && !EMAIL_RE.test(String(a.ownerEmail || "")))
      return "Falta el correo del dueño de la propiedad.";
    if (FIJA && a.deadline === FIJA && !a.deadlineDate) return "Falta la fecha límite.";
    if (EMPRESA && a.signer === EMPRESA &&
        ["entName", "entState", "entSigner", "entRole"].some((f) => !String(a[f] || "").trim()))
      return "Faltan los datos de la empresa.";
    const esp: string[] = a.spaces || [];
    if (L.marca("espacios", "lavanderia").some((s) => esp.includes(s)) && (!a.laundry || !a.laundryLayout))
      return "Faltan los datos de la lavandería.";
    if (L.marca("espacios", "barra").some((s) => esp.includes(s)) && !a.barEquip)
      return "Falta el equipo de la barra.";
    if (!esp.length) return "No hay espacios seleccionados.";
    return null;
  }

  return {
    validate, unitTotal, structuralFlag, unsureCount,
    recommendPlan: (a: A) => planDe(C.reglas, senales(a, ""), a),
    route: (a: A, picked: string) => rutaDe(C.reglas, senales(a, picked), a),
    tamano: (i: number) => C.listas.tamano?.ops[i]?.es || "",
    empresa: EMPRESA, representante: REP,
  };
}

// ─────────────────────────────────────────────────────────────── AV

export function motorAv(C: Config) {
  const L = listas(C);
  const INTERIOR = L.rol1("scenes", "interior");
  const AMENIDAD = L.rol1("rooms", "amenidad");
  const NINGUNO = L.rol1("material", "ninguno");
  const FIJA = L.rol1("launch", "fija");
  const EMPRESA = L.rol1("signer", "empresa");
  const CROSS_NONE = L.rol1("cross", "ninguno");
  const abierto = L.marca("interiorDesign", "abierto");
  const vistas: Record<string, number> = C.ajustes?.vistas || {};
  const sinPlan: number = C.ajustes?.vistasSinPlan || 2;
  const maxV: number = C.ajustes?.vistasMax || 12;

  const roomsOf = (a: A) => {
    const r = L.rolDe("projectType", a.projectType);
    return L.grupo("rooms", r === "comercial" ? "comercial" : r === "hospitalidad" ? "hospitalidad" : "residencial");
  };
  function unitsOf(a: A) {
    const out: { key: string; label: string; scenes: number }[] = [];
    for (const s of a.scenes || []) {
      if (s !== INTERIOR) { out.push({ key: "e:" + s, label: s, scenes: (a.counts || {})[s] || 1 }); continue; }
      for (const r of a.rooms || []) {
        if (r === AMENIDAD) {
          for (const v of a.amenities || []) out.push({ key: "a:" + v, label: v, scenes: (a.amenityCounts || {})[v] || 1 });
          continue;
        }
        out.push({ key: "r:" + r, label: r, scenes: (a.roomCounts || {})[r] || 1 });
      }
    }
    return out;
  }
  const sceneTotal = (a: A) => unitsOf(a).reduce((n, u) => n + u.scenes, 0);
  const imageTotal = (a: A, picked: string) => {
    const base = picked ? vistas[picked] || sinPlan : sinPlan;
    return unitsOf(a).reduce((n, u) => {
      const v = (a.viewCounts || {})[u.key];
      return n + u.scenes * (v == null ? base : Math.min(maxV, Math.max(1, v)));
    }, 0);
  };
  const sceneSummary = (a: A) => unitsOf(a).map((u) => `${u.scenes}× ${u.label}`).join(" · ");
  const unsureCount = (a: A) => cuentaDudas(a, UNSURE_AV, L.dudas);
  const daysUntil = (d: string) => {
    if (!d) return null;
    const ms = new Date(d + "T00:00:00").getTime() - Date.now();
    return isNaN(ms) ? null : Math.round(ms / 86400000);
  };
  const base = (a: A, picked: string) => ({
    plan_elegido: picked || "",
    sin_material: !!a.material && a.material === NINGUNO,
    escenas: sceneTotal(a), extras: (a.extras || []).length,
    dias_lanzamiento: FIJA && a.launch === FIJA ? daysUntil(a.launchDate) : null,
    sin_definir: unsureCount(a),
  });
  const recommendPlan = (a: A) => planDe(C.reglas, base(a, ""), a);
  const route = (a: A, picked: string) => {
    const sen: A = base(a, picked);
    sen.plan = picked || planDe(C.reglas, sen, a);
    return rutaDe(C.reglas, sen, a);
  };

  function validate(a: A): string | null {
    if (a.bot) return "bot";
    if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
    if (!a.privacy) return "Falta aceptar la política de privacidad.";
    for (const f of ["projectType", "stage", "role", "name", "phone", "city", "country", "launch", "portfolio"])
      if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
    if (!(a.scenes || []).length) return "No hay escenas seleccionadas.";
    if (FIJA && a.launch === FIJA && !a.launchDate) return "Falta la fecha de lanzamiento.";
    if (EMPRESA && a.signer === EMPRESA &&
        ["entName", "entState", "entSigner", "entRole"].some((f) => !String(a[f] || "").trim()))
      return "Faltan los datos de la empresa.";
    if (INTERIOR && (a.scenes || []).includes(INTERIOR) && !(a.rooms || []).length)
      return "Elegiste escenas de interior pero no hay espacios.";
    const permitidos = roomsOf(a);
    if ((a.rooms || []).some((r: string) => !permitidos.includes(r)))
      return "Hay espacios que no corresponden a la tipología del proyecto.";
    if (!a.material) return "Falta indicar qué material tienes.";
    return null;
  }

  function flags(a: A): string[] {
    const f: string[] = [];
    if (abierto.includes(a.interiorDesign)) f.push("Oportunidad de interior design: el interior no está resuelto.");
    if (NINGUNO && a.material === NINGUNO) f.push("Sin material del proyecto.");
    const d = daysUntil(a.launchDate);
    if (FIJA && a.launch === FIJA && d !== null && d < 28) f.push(`Lanzamiento en ${d} días.`);
    if (L.rolDe("projectType", a.projectType) === "mixto") f.push("Uso mixto: varias tipologías.");
    const cross = (a.cross || []).filter((v: string) => v !== CROSS_NONE);
    if (cross.length) f.push("Pide además: " + cross.join(", "));
    if (unsureCount(a) >= 4) f.push("Varias respuestas sin definir.");
    return f;
  }

  function noteBody(a: A, picked: string, rt: string[], files: any[]) {
    const row = (k: string, v: any) => (v ? `- **${k}:** ${v}\n` : "");
    const plan = picked || recommendPlan(a);
    const fl = flags(a);
    return [
      `**${rt[1]}** · Plan: **${plan}**\n\n`,
      row("Tipo de proyecto", a.projectType), row("Etapa", a.stage), row("Quién escribe", a.role),
      row("Escenas", sceneSummary(a)), row("Escenas totales", sceneTotal(a)),
      row("Imágenes estimadas", imageTotal(a, picked)), row("Contexto urbano", a.context),
      row("Diseño interior", a.interiorDesign), row("La pieza", a.piece), row("Material", a.material),
      row("Enlace", a.link), row("Especificación", a.spec), row("Uso de las imágenes", (a.uses || []).join(", ")),
      row("Tono", a.tone), row("Extras", (a.extras || []).join(", ")),
      row("Alrededor del proyecto", (a.cross || []).filter((v: string) => v !== CROSS_NONE).join(", ")),
      row("Ubicación", [a.city, a.country].filter(Boolean).join(", ")), row("Empresa", a.company),
      row("Lanzamiento", FIJA && a.launch === FIJA ? a.launchDate : a.launch), row("Portafolio", a.portfolio),
      row("Firma", EMPRESA && a.signer === EMPRESA
        ? `Empresa: ${a.entName} (${a.entState}) — firma ${a.entSigner}, ${a.entRole}` : "A título personal"),
      files.length ? `\n**Archivos:**\n${files.map((f: any) => `- ${f.url}`).join("\n")}\n` : "",
      fl.length ? `\n**Señales:**\n${fl.map((x) => `- ${x}`).join("\n")}\n` : "",
      `\n_Ruta: ${rt[0]}. ${rt[2]}_`,
    ].join("");
  }

  return { validate, route, recommendPlan, sceneTotal, imageTotal, sceneSummary, flags, noteBody, unsureCount };
}

// ─────────────────────────────────────────────────────────────── publicar

const ROLES_OBLIGATORIOS: Record<string, Record<string, string[]>> = {
  interior: {
    projectType: ["vivir", "invertir", "comercial"], ownership: ["en_compra"], commercialType: ["otro"],
    occupancy: ["sin_local"], propertyType: ["casa", "condo"], workType: ["nueva"], structure: ["estructural"],
    appliances: ["decidido", "ayuda"], keepFurniture: ["elige_espacios"], showcase: ["ninguno"],
    signer: ["personal", "empresa"], isOwner: ["representante"], timing: ["explorando"], deadline: ["fija"],
    pro: ["recomendar"],
  },
  av: {
    scenes: ["interior"], rooms: ["amenidad"], material: ["ninguno"], cross: ["ninguno"], launch: ["fija"],
    signer: ["personal", "empresa"],
  },
};
const LISTAS_CON_N = new Set(["tamano"]);

/** Lo que impide publicar una configuración (el panel lo enseña antes de Publicar). */
export function erroresConfig(C: Config, anterior?: Config | null): string[] {
  const err: string[] = [];
  if (!C?.listas || !C.reglas || !C.textos) return ["La configuración está incompleta."];
  if (anterior) for (const id of Object.keys(anterior.listas))
    if (!C.listas[id]) err.push(`Falta la lista «${anterior.listas[id].nombre}».`);
  for (const [id, l] of Object.entries(C.listas)) {
    const n = `«${l.nombre}»`;
    if (!l.ops?.length) { err.push(`${n}: no tiene opciones.`); continue; }
    const es = l.ops.map((o) => (o.es || "").trim());
    if (es.some((x) => !x)) err.push(`${n}: hay una opción sin texto.`);
    if (new Set(es).size !== es.length) err.push(`${n}: hay opciones repetidas.`);
    for (const r of ROLES_OBLIGATORIOS[C.servicio]?.[id] || [])
      if (!l.ops.some((o) => o.rol === r)) err.push(`${n}: falta la opción con el papel «${r}».`);
    if (LISTAS_CON_N.has(id) && l.ops.some((o) => !(Number(o.n) >= 1)))
      err.push(`${n}: cada opción necesita un número de imágenes (1 o más).`);
  }
  const valores = (f: string) => {
    const l = C.listas[f];
    return l ? new Set(l.ops.map((o) => o.es)) : null;
  };
  const revisar = (conds: Cond[], donde: string) => {
    for (const c of conds || []) {
      if (c.s !== "campo") continue;
      const vs = valores(c.f!);
      if (!vs) continue;
      for (const v of Array.isArray(c.v) ? c.v : c.v != null ? [c.v] : [])
        if (!vs.has(v)) err.push(`${donde}: usa la opción «${v}», que ya no existe.`);
    }
  };
  const vacias = (lista: { si: Cond[] }[], nombre: string) => lista.forEach((r, i) => {
    if (!r.si?.length) err.push(`${nombre} ${i + 1}: no tiene condiciones, así que se aplicaría siempre.`);
  });
  vacias(C.reglas.plan, "Regla de plan"); vacias(C.reglas.ruta, "Regla de respuesta"); vacias(C.reglas.avisos || [], "Aviso");
  C.reglas.plan.forEach((r, i) => revisar(r.si, `Regla de plan ${i + 1}`));
  C.reglas.ruta.forEach((r, i) => revisar(r.si, `Regla de respuesta ${i + 1}`));
  (C.reglas.avisos || []).forEach((r, i) => revisar(r.si, `Aviso ${i + 1}`));
  for (const r of C.reglas.ruta) if (!r.texto?.es?.trim()) err.push("Hay una regla de respuesta sin texto.");
  for (const [k, v] of Object.entries(C.textos)) if (!v?.es?.trim()) err.push(`Hay un texto vacío (${k.slice(0, 40)}…).`);
  return err;
}
