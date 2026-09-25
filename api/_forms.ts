/**
 * Almacén de los cuestionarios editables: un borrador por cuestionario y sus
 * versiones publicadas, inmutables.
 *
 *   forms          servicio · borrador · quién y cuándo lo tocó · versión publicada
 *   form_versions  servicio · versión · esquema · quién y cuándo la publicó
 *
 * Una versión publicada no se modifica nunca: los envíos se validan contra la
 * versión con la que se rellenaron, y "volver atrás" es copiar una versión
 * vieja al borrador y publicarla como una nueva.
 */
import type { Esquema } from "./_esquema.js";
import { SEMILLAS } from "./_semillas.js";

export const SERVICIOS = ["web", "grafico"] as const;
export type Servicio = (typeof SERVICIOS)[number];
export const esServicio = (s: any): s is Servicio => SERVICIOS.includes(s);

let sqlPromise: Promise<any> | null = null;
export function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("Base de datos no configurada.");
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(url);
      await sql`create table if not exists forms (
        servicio text primary key,
        draft jsonb not null,
        draft_at timestamptz not null default now(),
        draft_by text,
        rev int not null default 1,
        published int not null
      )`;
      await sql`create table if not exists form_versions (
        servicio text not null,
        version int not null,
        schema jsonb not null,
        published_at timestamptz not null default now(),
        published_by text,
        note text,
        primary key (servicio, version)
      )`;
      return sql;
    })().catch((e) => { sqlPromise = null; throw e; });
  }
  return sqlPromise;
}

/** Primera vez: la versión 1 es la que venía en el código. */
async function sembrar(sql: any, s: Servicio) {
  const seed = SEMILLAS[s];
  await sql`insert into form_versions (servicio, version, schema, published_by, note)
            values (${s}, 1, ${JSON.stringify(seed)}, 'código', 'Versión inicial, tal como estaba en el código')
            on conflict do nothing`;
  await sql`insert into forms (servicio, draft, draft_by, published)
            values (${s}, ${JSON.stringify(seed)}, 'código', 1)
            on conflict do nothing`;
}

export async function fila(s: Servicio) {
  const sql = await db();
  let rows = await sql`select servicio, draft, draft_at, draft_by, rev, published from forms where servicio = ${s}`;
  if (!rows.length) {
    await sembrar(sql, s);
    rows = await sql`select servicio, draft, draft_at, draft_by, rev, published from forms where servicio = ${s}`;
  }
  return rows[0] as { servicio: Servicio; draft: Esquema; draft_at: string; draft_by: string | null; rev: number; published: number };
}

// Las versiones no cambian nunca: se pueden guardar en memoria sin caducidad.
const cacheVersiones = new Map<string, Esquema>();

export async function version(s: Servicio, v: number): Promise<Esquema | null> {
  const k = `${s}:${v}`;
  if (cacheVersiones.has(k)) return cacheVersiones.get(k)!;
  const sql = await db();
  const rows = await sql`select schema from form_versions where servicio = ${s} and version = ${v}`;
  if (!rows.length) return null;
  cacheVersiones.set(k, rows[0].schema);
  return rows[0].schema;
}

export async function publicado(s: Servicio) {
  const f = await fila(s);
  return { version: f.published, schema: (await version(s, f.published))! };
}

export async function versiones(s: Servicio) {
  const sql = await db();
  return sql`select version, published_at, published_by, note from form_versions
             where servicio = ${s} order by version desc limit 100`;
}

/**
 * Guarda el borrador si nadie lo cambió desde que se leyó (`base` = su `rev`
 * de entonces). Dos pestañas abiertas no se pisan en silencio. Devuelve la
 * revisión nueva, o null si otra ya lo había cambiado.
 */
export async function guardarBorrador(s: Servicio, schema: Esquema, quien: string, base: number) {
  const sql = await db();
  await fila(s);
  const rows = await sql`update forms set draft = ${JSON.stringify(schema)}, draft_at = now(),
                           draft_by = ${quien}, rev = rev + 1
                         where servicio = ${s} and rev = ${base} returning rev`;
  return (rows[0]?.rev as number) ?? null;
}

export async function publicar(s: Servicio, schema: Esquema, quien: string, nota: string) {
  const sql = await db();
  const [{ n }] = await sql`select coalesce(max(version), 0) + 1 as n from form_versions where servicio = ${s}`;
  await sql`insert into form_versions (servicio, version, schema, published_by, note)
            values (${s}, ${n}, ${JSON.stringify(schema)}, ${quien}, ${nota || null})`;
  await sql`update forms set published = ${n}, draft = ${JSON.stringify(schema)}, draft_at = now(),
              draft_by = ${quien}, rev = rev + 1
            where servicio = ${s}`;
  return n as number;
}
