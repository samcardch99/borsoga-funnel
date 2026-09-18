/**
 * Reglas de servidor para los dos cuestionarios: diseño web e identidad de marca.
 *
 * Espejo de `src/brief_web.js` y `src/brief_grafico.js`. Se separan de las de
 * interiorismo y AV por lo mismo que aquéllas entre sí: no comparten campos ni
 * criterios. Los dos cuestionarios sí comparten este módulo porque son la misma
 * pieza —un brief largo sin cálculo de precio— con otro juego de preguntas.
 *
 * Aquí no hay recomendación de plan ni ruta calculada: estos cuestionarios no
 * proponen un número, recogen un encargo. Lo único que se deriva son señales
 * para que quien atienda el lead sepa qué mirar antes de escribir.
 */

type A = Record<string, any>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const YES = "Sí";

const SCRATCH_WEB = "Crear un sitio web desde cero";
const ID_UPDATE = "Sí, pero necesita actualizarse";
const ID_NONE = "No, hay que crearla";
const COPY_READY_FULL = "Sí, listos";
const MEDIA_PRO = "Sí, de calidad profesional";
const F_FORM = "Formulario de contacto";
const F_SHOP = "Tienda online con pagos";
const F_BOOKING = "Reservas / agenda";

const SCRATCH_GD = "Crear una identidad visual desde cero";
const CON_IDENTIDAD = ["Rediseñar completamente una identidad existente",
                       "Actualizar/refrescar una identidad existente",
                       "Ampliar un sistema de identidad que ya existe"];
const COLORS_KEEP = "Sí, debemos conservarlos";
const COLORS_OPEN = "Sí, pero estamos abiertos a cambiarlos";
const PACKAGING = "Packaging";
const PREMISES = "Local comercial / oficinas";
const SIGNAGE = "Señalización";

const tiene = (a: A, campo: string, v: string) => (a[campo] || []).includes(v);
const lleno = (v: any) => (Array.isArray(v) ? v.length > 0 : !!String(v ?? "").trim());
const conSitio = (a: A) => !!a.projectType && a.projectType !== SCRATCH_WEB;
const conIdentidad = (a: A) => CON_IDENTIDAD.includes(a.projectType);

/** Campos exigidos siempre, y los que dependen de otra respuesta. */
type Regla = [string, ((a: A) => boolean)?];

const REGLAS: Record<string, Regla[]> = {
  web: [
    ["company"], ["projectType"],
    ["platform", conSitio], ["access", conSitio],
    ["identity"],
    ["identityScope", (a) => a.identity === ID_UPDATE || a.identity === ID_NONE],
    ["whatDoes"], ["category"], ["diff"], ["markets"],
    ["goal"], ["actions"], ["success"],
    ["sellsTo"], ["visitor"], ["sources"], ["devices"],
    ["pages"], ["size"], ["copyReady"],
    ["copyScope", (a) => !!a.copyReady && a.copyReady !== COPY_READY_FULL],
    ["media"],
    ["mediaNeeds", (a) => !!a.media && a.media !== MEDIA_PRO],
    ["languages"],
    ["features"],
    ["forms", (a) => tiene(a, "features", F_FORM)],
    ["skuCount", (a) => tiene(a, "features", F_SHOP)],
    ["delivery", (a) => tiene(a, "features", F_SHOP)],
    ["booking", (a) => tiene(a, "features", F_BOOKING)],
    ["integrations"], ["automations"],
    ["refsWhy"], ["personality"], ["motion"], ["feelings"],
    ["domain"], ["hosting"], ["updater"], ["support"], ["seo"],
    ["launchDate"],
    ["launchDateValue", (a) => a.launchDate === YES],
    ["approvers"], ["budget"],
    ["budgetValue", (a) => a.budget === YES],
  ],
  grafico: [
    ["company"], ["projectType"],
    ["nameDefined", (a) => a.projectType === SCRATCH_GD],
    ["needsNaming", (a) => a.projectType === SCRATCH_GD && !!a.nameDefined && a.nameDefined !== YES],
    ["identityAge", conIdentidad], ["changeReason", conIdentidad],
    ["whatDoes"], ["category"], ["stage"], ["markets"],
    ["problem"], ["diff"],
    ["sellsTo"],
    ["idealClient", (a) => ["Consumidores — B2C", "Ambos"].includes(a.sellsTo)],
    ["idealCompanies", (a) => ["Empresas — B2B", "Ambos"].includes(a.sellsTo)],
    ["personality"], ["feelings"],
    ["meaning"],
    ["meaningWhich", (a) => a.meaning === YES],
    ["brandColors"],
    ["whichColors", (a) => a.brandColors === COLORS_KEEP || a.brandColors === COLORS_OPEN],
    ["avoidColors"],
    ["whichAvoidColors", (a) => a.avoidColors === YES],
    ["hasRefs"],
    ["touchpoints"], ["topTouchpoints"],
    ["packagingScope", (a) => tiene(a, "touchpoints", PACKAGING)],
    ["spaces", (a) => tiene(a, "touchpoints", PREMISES) || tiene(a, "touchpoints", SIGNAGE)],
    ["languages"], ["success"], ["launchDate"],
    ["launchDateValue", (a) => a.launchDate === YES],
    ["approvers"],
  ],
};

const EJES = { web: 5, grafico: 6 };

/** El cliente manda `contactName`; el resto del servidor habla de `name`. */
export function normaliza(a: A): A {
  return a.name ? a : { ...a, name: a.contactName || "" };
}

export function validate(a: A, service: string, uploads: any[] = []): string | null {
  if (a.bot) return "bot";
  if (!EMAIL_RE.test(String(a.email || ""))) return "El correo no es válido.";
  if (!a.privacy) return "Falta aceptar la política de privacidad.";
  for (const f of ["contactName", "phone"])
    if (!String(a[f] || "").trim()) return `Falta un dato obligatorio (${f}).`;
  for (const [campo, cuando] of REGLAS[service] || []) {
    if (cuando && !cuando(a)) continue;
    if (!lleno(a[campo])) return `Falta un dato obligatorio (${campo}).`;
  }
  // Las referencias valen como texto o como archivos: basta con una de las dos.
  const pideRefs = service === "web" || a.hasRefs === YES;
  const hayRefs = !!String(a.refsText || "").trim() ||
    uploads.some((u: any) => u?.kind === "refFiles");
  if (pideRefs && !hayRefs) return "Faltan las referencias visuales.";
  const ejes = a.axes || {};
  if (Object.keys(ejes).length < EJES[service as keyof typeof EJES])
    return "Faltan posiciones en los ejes de personalidad.";
  return null;
}

/**
 * Un brief no lleva precio: no hay ruta que calcular. Devuelve siempre la
 * misma, con la forma que espera `submit.ts` para el asunto y la nota.
 */
export function route(service: string): [string, string, string] {
  return service === "web"
    ? ["brief", "Cuestionario de diseño web",
       "Lo revisa una persona del estudio y responde con la propuesta. Nada de esto es automático."]
    : ["brief", "Cuestionario de identidad de marca",
       "Lo revisa una persona del estudio y responde con la propuesta. Nada de esto es automático."];
}

function diasHasta(d: string) {
  if (!d) return null;
  const ms = new Date(d + "T00:00:00").getTime() - Date.now();
  return isNaN(ms) ? null : Math.round(ms / 86400000);
}

/** Señales que al estudio le sirven para preparar la respuesta. */
export function flags(a: A, service: string): string[] {
  const f: string[] = [];
  const d = diasHasta(a.launchDateValue);
  if (d !== null && d < 28) f.push(`Fecha de lanzamiento en ${d} días.`);
  if (service === "web") {
    if (a.identity === ID_NONE) f.push("Sin identidad visual: oportunidad de diseño gráfico.");
    if (a.identityScope === YES) f.push("Pide que Borsoga trabaje también la identidad.");
    if (tiene(a, "features", F_SHOP)) f.push(`Ecommerce (${a.skuCount || "sin definir"}).`);
    if (a.copyScope === YES) f.push("Pide redacción de textos.");
    if (a.mediaNeeds?.length) f.push("Necesita producción: " + a.mediaNeeds.join(", ") + ".");
    if (a.hosting === "Prefiero que Borsoga lo gestione" || a.updater === "Borsoga")
      f.push("Quiere que el estudio gestione hosting o mantenimiento.");
    if (a.budget === "Todavía no está definido") f.push("Sin presupuesto definido.");
  } else {
    if (a.needsNaming === YES) f.push("Pide naming.");
    if (a.packagingScope === YES) f.push("Packaging dentro del alcance.");
    if (a.spaces) f.push(`Aplicación física a espacios: ${a.spaces}.`);
    if (tiene(a, "touchpoints", "Sitio web")) f.push("Oportunidad de diseño web: la marca vivirá en un sitio.");
  }
  const sinDefinir = Object.values(a).filter(
    (v) => typeof v === "string" && /^(no lo s[eé]|no estoy seguro|todav[ií]a no est[aá] definido)$/i.test(v.trim()),
  ).length;
  if (sinDefinir >= 4) f.push("Varias respuestas sin definir.");
  return f;
}

/** Una línea para nombrar la oportunidad en el CRM. */
export const resumenLinea = (a: A) =>
  [a.company, a.category].filter(Boolean).join(" · ").slice(0, 80);

export function noteBody(a: A, service: string, plan: string, rt: string[], files: any[]) {
  const row = (k: string, v: any) => (v ? `- **${k}:** ${v}\n` : "");
  const lista = (v: any) => (Array.isArray(v) ? v.join(", ") : v);
  const fl = flags(a, service);
  const comun = [
    `**${rt[1]}**${plan && plan !== "—" ? ` · Desde: **${plan}**` : ""}\n\n`,
    row("Marca", a.company),
    row("Web o redes", a.webSocial),
    row("Tipo de proyecto", a.projectType),
    row("Qué hace", a.whatDoes),
    row("Categoría", a.category),
    row("Diferenciador", a.diff),
    row("Competidores", a.competitors),
    row("Mercados", lista(a.markets)),
    row("Vende a", a.sellsTo),
    row("Personalidad", lista(a.personality)),
    row("Debe hacer sentir", lista(a.feelings)),
    row("Idiomas", lista(a.languages)),
    row("Aprobación", a.approvers),
    row("Lanzamiento", [a.launchDate, a.launchDateValue, a.whatHappens].filter(Boolean).join(" · ")),
    row("Restricciones", a.restrictions),
    row("Algo más", a.anythingElse),
  ];
  const propio = service === "web" ? [
    row("Plataforma actual", a.platform),
    row("Accesos", a.access),
    row("Identidad visual", [a.identity, a.identityScope].filter(Boolean).join(" · ")),
    row("Objetivo del sitio", a.goal),
    row("Acción del visitante", lista(a.actions)),
    row("Éxito a 12 meses", a.success),
    row("Visitante", a.visitor),
    row("Tráfico", lista(a.sources)),
    row("Páginas", lista(a.pages)),
    row("Tamaño", a.size),
    row("Textos", [a.copyReady, a.copyScope].filter(Boolean).join(" · ")),
    row("Material propio", [a.media, lista(a.mediaNeeds)].filter(Boolean).join(" · ")),
    row("Funcionalidades", lista(a.features)),
    row("Integraciones", lista(a.integrations)),
    row("Automatizaciones", a.automations),
    row("Referencias", a.refsText),
    row("Qué le gusta", a.refsWhy),
    row("Animación", a.motion),
    row("Dominio / hosting", [a.domain, a.hosting].filter(Boolean).join(" · ")),
    row("Mantenimiento", [a.updater, a.support].filter(Boolean).join(" · ")),
    row("SEO", a.seo),
    row("Presupuesto", a.budgetValue || a.budget),
  ] : [
    row("Naming", a.needsNaming),
    row("Identidad actual", [a.identityAge, lista(a.changeReason)].filter(Boolean).join(" · ")),
    row("Qué conservar", a.keepWhat),
    row("Qué cambiar", a.changeWhat),
    row("Etapa", a.stage),
    row("Problema que resuelve", a.problem),
    row("Frente a la competencia", lista(a.vsComp)),
    row("Cliente ideal", a.idealClient || a.idealCompanies),
    row("Quién decide la compra", lista(a.decisionMaker)),
    row("No debería ser", lista(a.notPersonality)),
    row("Elementos con significado", a.meaningWhich),
    row("Evitar", a.avoidElements),
    row("Color", [a.brandColors, a.whichColors].filter(Boolean).join(" · ")),
    row("Colores a evitar", a.whichAvoidColors),
    row("Referencias", a.refsText),
    row("Qué le gusta", a.refsWhy),
    row("Marcas a evitar", a.avoidBrands),
    row("Puntos de contacto", lista(a.touchpoints)),
    row("Los tres primeros", lista(a.topTouchpoints)),
    row("Packaging", [a.packagingType, a.packagingScope].filter(Boolean).join(" · ")),
    row("Espacios", a.spaces),
    row("Éxito del proyecto", a.success),
  ];
  return [
    ...comun, ...propio,
    row("Ejes", Object.entries(a.axes || {}).map(([i, n]) => `${Number(i) + 1}:${n}/5`).join(" · ")),
    files.length ? `\n**Archivos:**\n${files.map((f: any) => `- ${f.kind}: ${f.url}`).join("\n")}\n` : "",
    fl.length ? `\n**Señales:**\n${fl.map((x) => `- ${x}`).join("\n")}\n` : "",
    `\n_${rt[2]}_`,
  ].join("");
}
