/**
 * Empuja un lead del configurador a Twenty CRM.
 *
 * Crea tres cosas y las enlaza: la **persona**, una **oportunidad** en estado
 * NEW apuntando a ella, y una **nota** con el cuestionario completo. Así el
 * lead entra donde se hace el seguimiento, no en una bandeja de correo.
 *
 * Nunca lanza excepción: si Twenty está caído o la clave caducó, el lead ya
 * está en Postgres y el estudio recibe el correo igual. Devuelve el detalle
 * del fallo para que quede registrado, pero no tumba el envío del cliente.
 */

type Answers = Record<string, any>;

const T = (path: string) =>
  `${String(process.env.TWENTY_API_URL || "").replace(/\/+$/, "")}/rest${path}`;

async function get(path: string, signal: AbortSignal) {
  const r = await fetch(T(path), {
    headers: { authorization: `Bearer ${process.env.TWENTY_API_KEY}` },
    signal,
  });
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

/**
 * Twenty rechaza crear dos personas con el mismo correo ("A duplicate entry
 * was detected"), y eso tumbaba el push entero cuando alguien enviaba el
 * configurador por segunda vez. Buscamos primero y reutilizamos.
 */
async function findOrCreatePerson(a: Answers, service: string, signal: AbortSignal) {
  const email = String(a.email || "").trim();
  try {
    const q = `/people?filter=emails.primaryEmail[eq]:${encodeURIComponent(email)}&limit=1`;
    const found = await get(q, signal);
    const rec = found?.data?.people?.[0] || found?.data?.[0];
    if (rec?.id) return { id: rec.id, reused: true };
  } catch {
    // Si la búsqueda falla seguimos e intentamos crear: perder el lead por no
    // poder consultar sería peor que un duplicado.
  }
  const tel = e164(a.phone);
  const base = {
    name: splitName(a.name),
    emails: { primaryEmail: email },
    jobTitle: [a.city, a.state || a.country].filter(Boolean).join(", ").slice(0, 60) || undefined,
    position: "first",
  };
  let person;
  try {
    person = await post("/people", tel ? { ...base, phones: { primaryPhoneNumber: tel } } : base, signal);
  } catch (e: any) {
    // Red de seguridad: si Twenty rechaza el número por cualquier motivo que no
    // hayamos previsto, se crea la persona sin él. Tener el lead sin teléfono en
    // el campo —que sigue en la nota— es mejor que no tener el lead.
    if (!tel || !/phone/i.test(String(e?.message || ""))) throw e;
    person = await post("/people", base, signal);
  }
  return { id: person?.data?.createPerson?.id || person?.data?.id, reused: false };
}

async function post(path: string, body: unknown, signal: AbortSignal) {
  const r = await fetch(T(path), {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.TWENTY_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${path} → ${r.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : {};
}

/**
 * Pasa un teléfono a E.164 (`+` y sólo dígitos), que es lo que Twenty acepta.
 *
 * Un `305-000-0000` escrito como lo escribe cualquiera en Miami hacía que
 * `/people` devolviera 400 INVALID_PHONE_NUMBER y se perdía el lead entero en
 * el CRM —quedaba sólo un warn en los logs—.
 *
 * Se adivina lo mínimo. Con `+` delante, el número ya trae su país y sólo se
 * limpian los separadores. Sin `+`, únicamente se asume +1 cuando tiene forma
 * norteamericana (10 dígitos, u 11 empezando por 1), que es de dónde viene el
 * cuestionario de interiorismo —Miami-Dade y Florida—. Cualquier otra cosa
 * devuelve cadena vacía: para el configurador AV, que recibe leads de fuera,
 * inventar un prefijo sería peor que no poner ninguno. Lo que no se normaliza
 * no se pierde: viaja en la nota tal y como lo escribió la persona.
 */
export function e164(bruto: unknown): string {
  const s = String(bruto ?? "").trim();
  if (!s) return "";
  const digitos = s.replace(/\D/g, "");
  if (!digitos) return "";
  if (s.startsWith("+")) {
    // E.164 admite entre 8 y 15 dígitos contando el país
    return digitos.length >= 8 && digitos.length <= 15 ? "+" + digitos : "";
  }
  if (digitos.length === 10) return "+1" + digitos;
  if (digitos.length === 11 && digitos.startsWith("1")) return "+" + digitos;
  return "";
}


/** "Ana María Pérez Gil" → { firstName: "Ana", lastName: "María Pérez Gil" } */
function splitName(full: string) {
  const parts = String(full || "").trim().split(/\s+/);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}

function noteBody(a: Answers, d: any, plan: string, rt: string[], files: any[]) {
  const row = (k: string, v: any) => (v ? `- **${k}:** ${v}\n` : "");
  return [
    `**${rt[1]}** · Plan sugerido: **${plan}**\n\n`,
    row("Proyecto", [a.projectType, a.workType, a.year || a.stage].filter(Boolean).join(" · ")),
    row("Propiedad", a.propertyType || a.commercialType),
    row("Espacios", d?.spaceSummary),
    row("Muebles a la medida", (a.millwork || []).join(" · ")),
    row("Agua y desagüe", a.plumbing),
    row("Electrodomésticos", a.appliances),
    row("Paredes y fachada", (a.structure || []).join(" · ")),
    row("HOA / asociación", a.hoa),
    row("Restricciones del edificio", a.elevator),
    row("Tamaño", a.size >= 0 ? ["Compacto", "Estándar", "Amplio"][a.size] : ""),
    row("Pies cuadrados", a.sqft),
    row("Imágenes estimadas", d?.imageTotal),
    row("Nivel de acabado", a.finish),
    row("Punto de partida", a.clarity),
    row("Presupuesto declarado", a.budget),
    row("Extras", (a.extras || []).join(", ")),
    row("Dirección", [a.street, a.city, a.state, a.zip].filter(Boolean).join(", ")),
    row("Cuándo empezar", a.timing),
    row("Fecha límite", [a.deadline, a.deadlineDate, a.deadlineWhy].filter(Boolean).join(" · ")),
    row("Quién decide", a.decider),
    row("Contratista / arquitecto", a.pro),
    row("Firma", a.signer === "Como empresa"
      ? `Empresa: ${a.entName} (${a.entState}) — firma ${a.entSigner}, ${a.entRole}`
      : "A título personal"),
    row("Dueño", a.isOwner === "Sí" ? "Es el dueño" : `Representante · dueño: ${a.ownerName} ${a.ownerEmail}`),
    row("Permiso de portafolio", a.portfolio),
    row("Material", files.length ? `${files.length} archivo(s)` : (a.noMaterial ? "Todavía sin material" : "—")),
    files.length ? `\n**Archivos (privados, requieren credenciales):**\n${files.map((f: any) => `- ${f.kind}: ${f.url}`).join("\n")}\n` : "",
    `\n_Ruta: ${rt[0]}. ${rt[2]}_`,
  ].join("");
}

export async function pushToTwenty(
  a: Answers, d: any, plan: string, rt: string[], files: any[],
  service: string = "interior", customNote: string | null = null, resumen: string | null = null,
): Promise<{ personId?: string; opportunityId?: string; error?: string }> {
  if (!process.env.TWENTY_API_KEY || !process.env.TWENTY_API_URL) {
    return { error: "Twenty no configurado." };
  }
  // Presupuesto: no lo tratamos como importe real, solo el suelo del rango
  // declarado, para poder ordenar oportunidades por tamaño.
  const floor = (() => {
    const m = String(a.budget || "").match(/\$([\d,]+)/);
    return m ? Number(m[1].replace(/,/g, "")) : 0;
  })();

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 12000);
  try {
    const p = await findOrCreatePerson(a, service, ac.signal);
    const personId = p.id;

    const opp = await post("/opportunities", {
      name: `${a.name} · ${service === "contacto" ? (a.servicio || "Consulta") : plan + " · " + (resumen || d?.spaceSummary || (service === "av" ? "visualización" : "interior design"))}`.slice(0, 120),
      stage: "NEW",
      position: "first",
      pointOfContactId: personId,
      ...(floor ? { amount: { amountMicros: floor * 1_000_000, currencyCode: "USD" } } : {}),
    }, ac.signal);
    const opportunityId = opp?.data?.createOpportunity?.id || opp?.data?.id;

    // El teléfono tal y como lo escribió la persona encabeza siempre la nota.
    // Los cuerpos de los configuradores no lo incluían, así que si `e164()` no
    // lo pudo normalizar —un número de fuera sin prefijo, por ejemplo— y se
    // omitió del campo estructurado, el número se habría perdido del todo.
    const telBruto = String(a.phone || "").trim();
    const telE164 = e164(a.phone);
    const contacto = telBruto
      ? `- **Teléfono:** ${telBruto}${telE164 && telE164 !== telBruto ? ` (${telE164})` : ""}` +
        `${telE164 ? "" : " — no se pudo normalizar, no está en el campo de teléfono"}\n\n`
      : "";
    const cuerpo = customNote || (service === "contacto"
      ? `**Consulta desde la portada de servicios**\n\n- **Servicio:** ${a.servicio || "—"}\n\n${a.project || ""}`
      : noteBody(a, d, plan, rt, files));
    const note = await post("/notes", {
      title: (service === "contacto" ? `Consulta · ${a.servicio || "portada"}` : `Configurador ${service === "av" ? "AV" : "Interior"} · ${rt[1]} · ${plan}`).slice(0, 120),
      bodyV2: { markdown: contacto + cuerpo },
      position: "first",
    }, ac.signal);
    const noteId = note?.data?.createNote?.id || note?.data?.id;

    // La nota solo es útil si cuelga del registro. Si esto falla, la nota
    // queda suelta pero el lead ya está creado: no es motivo para fallar.
    if (noteId && opportunityId) {
      await post("/noteTargets", { noteId, opportunityId }, ac.signal).catch(() => {});
    }
    if (noteId && personId) {
      await post("/noteTargets", { noteId, personId }, ac.signal).catch(() => {});
    }

    return { personId, opportunityId };
  } catch (e: any) {
    return { error: e?.name === "AbortError" ? "Twenty no respondió a tiempo." : (e?.message || "error de Twenty") };
  } finally {
    clearTimeout(timer);
  }
}
