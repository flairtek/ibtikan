import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Simple env var resolver */
export async function runtimeVar(name: string): Promise<string | undefined> {
  const p = process.env[name];
  return p && p.length > 0 ? p : undefined;
}

/** Supabase client for database operations */
export async function getDb() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase configuration missing");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/** Supabase Storage for file operations */
export async function getFiles() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase configuration missing");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  return supabase.storage;
}

/* ------------------------------------------------------------------ */
/* Supabase Table-based Helpers (Replacing raw SQL RPC wrappers)       */
/* ------------------------------------------------------------------ */

export async function queryAll<T = Record<string, unknown>>(
  table: string,
  queryFn?: (query: any) => any
): Promise<T[]> {
  const db = await getDb();
  let query = db.from(table).select("*");
  if (queryFn) {
    query = queryFn(query);
  }
  const { data, error } = await query;
  if (error) {
    console.error(
      `Supabase queryAll error on ${table}:`,
      error.message || error.code || JSON.stringify(error)
    );
    return [];
  }
  return (data as T[]) || [];
}

export async function queryFirst<T = Record<string, unknown>>(
  table: string,
  queryFn?: (query: any) => any
): Promise<T | null> {
  const db = await getDb();
  let query = db.from(table).select("*");
  if (queryFn) {
    query = queryFn(query);
  }
  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error(
      `Supabase queryFirst error on ${table}:`,
      error.message || error.code || JSON.stringify(error)
    );
    return null;
  }
  return (data as T) ?? null;
}

export async function insertRow<T = Record<string, unknown>>(
  table: string,
  values: Record<string, unknown>
): Promise<T | null> {
  const db = await getDb();
  const { data, error } = await db.from(table).insert(values).select().single();
  if (error) {
    console.error(`Supabase insert error on ${table}:`, error);
    throw error;
  }
  return data as T;
}

export async function updateRow(
  table: string,
  matchCol: string,
  matchVal: unknown,
  values: Record<string, unknown>
): Promise<void> {
  const db = await getDb();
  const { error } = await db.from(table).update(values).eq(matchCol, matchVal);
  if (error) {
    console.error(`Supabase update error on ${table}:`, error);
    throw error;
  }
}

export async function deleteRow(
  table: string,
  matchCol: string,
  matchVal: unknown
): Promise<void> {
  const db = await getDb();
  const { error } = await db.from(table).delete().eq(matchCol, matchVal);
  if (error) {
    console.error(`Supabase delete error on ${table}:`, error);
    throw error;
  }
}

export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
