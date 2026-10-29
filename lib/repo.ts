import "server-only";
import {
  queryAll,
  queryFirst,
  insertRow,
  updateRow,
  deleteRow,
  parseJson,
  runtimeVar,
} from "./db";
import type {
  PropertyRecord,
  ProjectRecord,
  EnquiryRecord,
  ArticleRecord,
  TeamMemberRecord,
} from "./model";
import { parseGallery } from "./format";

/* ------------------------------------------------------------------ */
/* Properties                                                          */
/* ------------------------------------------------------------------ */

function mapProperty(row: Record<string, unknown>): PropertyRecord {
  return {
    id: Number(row.id),
    ref: String(row.ref),
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    transactionType: String(row.transaction_type ?? row.transactionType ?? "sale"),
    description: String(row.description ?? ""),
    location: String(row.location ?? ""),
    region: String(row.region ?? ""),
    price: row.price == null ? null : Number(row.price),
    currency: String(row.currency ?? "GH₵"),
    landArea: row.land_area == null ? null : String(row.land_area),
    buildingArea: row.building_area == null ? null : String(row.building_area),
    bedrooms: row.bedrooms == null ? null : Number(row.bedrooms),
    bathrooms: row.bathrooms == null ? null : Number(row.bathrooms),
    features: Array.isArray(row.features) ? row.features.map(String) : (typeof row.features === "string" ? safeStringList(row.features) : []),
    availability: String(row.availability ?? "available"),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    coverImage: row.cover_image == null ? (row.coverImage == null ? null : String(row.coverImage)) : String(row.cover_image),
    seoTitle: row.seo_title == null ? null : String(row.seo_title),
    seoDescription: row.seo_description == null ? null : String(row.seo_description),
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? row.updatedAt ?? new Date().toISOString()),
  };
}

function safeStringList(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export interface PropertyQuery {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  transaction?: string;
  availability?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
  offset?: number;
  includeUnpublished?: boolean;
}

export async function listProperties(
  q: PropertyQuery = {}
): Promise<PropertyRecord[]> {
  "use cache";
  const rows = await queryAll("properties", (query) => {
    let qBuilder = query;
    if (!q.includeUnpublished) qBuilder = qBuilder.eq("published", true);
    if (q.category) qBuilder = qBuilder.eq("category", q.category);
    if (q.transaction) qBuilder = qBuilder.eq("transaction_type", q.transaction);
    if (q.availability) qBuilder = qBuilder.eq("availability", q.availability);
    if (q.featured) qBuilder = qBuilder.eq("featured", true);
    if (q.location) qBuilder = qBuilder.or(`location.ilike.%${q.location}%,region.ilike.%${q.location}%`);
    if (q.minPrice != null && Number.isFinite(q.minPrice)) qBuilder = qBuilder.gte("price", q.minPrice);
    if (q.maxPrice != null && Number.isFinite(q.maxPrice)) qBuilder = qBuilder.lte("price", q.maxPrice);

    if (q.sort === "price-asc") qBuilder = qBuilder.order("price", { ascending: true });
    else if (q.sort === "price-desc") qBuilder = qBuilder.order("price", { ascending: false });
    else qBuilder = qBuilder.order("created_at", { ascending: false });

    qBuilder = qBuilder.order("featured", { ascending: false });

    if (q.limit != null) qBuilder = qBuilder.limit(q.limit);
    if (q.offset != null) qBuilder = qBuilder.range(q.offset, q.offset + (q.limit ?? 10) - 1);

    return qBuilder;
  });

  return rows.map(mapProperty);
}

export async function countProperties(
  q: PropertyQuery = {}
): Promise<number> {
  const rows = await queryAll("properties", (query) => {
    let qBuilder = query.select("id", { count: "exact", head: true });
    if (!q.includeUnpublished) qBuilder = qBuilder.eq("published", true);
    if (q.category) qBuilder = qBuilder.eq("category", q.category);
    if (q.transaction) qBuilder = qBuilder.eq("transaction_type", q.transaction);
    if (q.availability) qBuilder = qBuilder.eq("availability", q.availability);
    if (q.location) qBuilder = qBuilder.or(`location.ilike.%${q.location}%,region.ilike.%${q.location}%`);
    if (q.minPrice != null) qBuilder = qBuilder.gte("price", q.minPrice);
    if (q.maxPrice != null) qBuilder = qBuilder.lte("price", q.maxPrice);
    return qBuilder;
  });
  return rows.length;
}

export async function getPropertyBySlug(
  slug: string,
  includeUnpublished = false
): Promise<PropertyRecord | null> {
  const row = await queryFirst("properties", (query) => {
    let qBuilder = query.eq("slug", slug);
    if (!includeUnpublished) qBuilder = qBuilder.eq("published", true);
    return qBuilder;
  });
  return row ? mapProperty(row) : null;
}

export async function getPropertyById(
  id: number
): Promise<PropertyRecord | null> {
  const row = await queryFirst("properties", (query) => query.eq("id", id));
  return row ? mapProperty(row) : null;
}

export async function getPropertyImages(
  propertyId: number
): Promise<{ id: number; url: string; alt: string; sort: number }[]> {
  const rows = await queryAll("property_images", (query) =>
    query.eq("property_id", propertyId).order("sort", { ascending: true })
  );
  return rows.map((r: any) => ({
    id: Number(r.id),
    url: String(r.url),
    alt: String(r.alt ?? ""),
    sort: Number(r.sort ?? 0),
  }));
}

export interface PropertyInput {
  ref: string;
  slug: string;
  title: string;
  category: string;
  transactionType: string;
  description: string;
  location: string;
  region: string;
  price: number | null;
  currency: string;
  landArea?: string | null;
  buildingArea?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  features: string[];
  availability: string;
  featured: boolean;
  published: boolean;
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePropertyInput(
  input: Partial<PropertyInput>
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!input.ref?.trim()) errors.push({ field: "ref", message: "Reference is required." });
  else if (!/^[A-Z0-9-]{2,40}$/i.test(input.ref.trim()))
    errors.push({ field: "ref", message: "Reference may only contain letters, numbers and dashes." });
  if (!input.slug?.trim())
    errors.push({ field: "slug", message: "URL slug is required." });
  else if (!/^[a-z0-9-]{2,80}$/.test(input.slug.trim()))
    errors.push({ field: "slug", message: "Slug must be lowercase letters, numbers and dashes." });
  if (!input.title?.trim()) errors.push({ field: "title", message: "Title is required." });
  if (!input.category) errors.push({ field: "category", message: "Category is required." });
  if (input.price != null && (!Number.isFinite(input.price) || input.price < 0))
    errors.push({ field: "price", message: "Price must be a positive number." });
  if (input.description && input.description.length > 8000)
    errors.push({ field: "description", message: "Description is too long." });
  return errors;
}

export async function createProperty(
  input: PropertyInput
): Promise<number> {
  const res = await insertRow("properties", {
    ref: input.ref.trim(),
    slug: input.slug.trim(),
    title: input.title.trim(),
    category: input.category,
    transaction_type: input.transactionType || "sale",
    description: input.description ?? "",
    location: input.location ?? "",
    region: input.region ?? "",
    price: input.price,
    currency: input.currency || "GHS",
    land_area: input.landArea ?? null,
    building_area: input.buildingArea ?? null,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    features: input.features ?? [],
    availability: input.availability || "available",
    featured: Boolean(input.featured),
    published: Boolean(input.published),
    cover_image: input.coverImage ?? null,
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
  });
  return Number((res as any)?.id ?? 0);
}

export async function updateProperty(
  id: number,
  input: Partial<PropertyInput>
): Promise<void> {
  await updateRow("properties", "id", id, {
    ...(input.slug ? { slug: input.slug } : {}),
    ...(input.title ? { title: input.title } : {}),
    ...(input.category ? { category: input.category } : {}),
    ...(input.transactionType ? { transaction_type: input.transactionType } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.location !== undefined ? { location: input.location } : {}),
    ...(input.region !== undefined ? { region: input.region } : {}),
    ...(input.price !== undefined ? { price: input.price } : {}),
    ...(input.currency ? { currency: input.currency } : {}),
    ...(input.landArea !== undefined ? { land_area: input.landArea } : {}),
    ...(input.buildingArea !== undefined ? { building_area: input.buildingArea } : {}),
    ...(input.bedrooms !== undefined ? { bedrooms: input.bedrooms } : {}),
    ...(input.bathrooms !== undefined ? { bathrooms: input.bathrooms } : {}),
    ...(input.features ? { features: input.features } : {}),
    ...(input.availability ? { availability: input.availability } : {}),
    ...(input.featured !== undefined ? { featured: Boolean(input.featured) } : {}),
    ...(input.published !== undefined ? { published: Boolean(input.published) } : {}),
    ...(input.coverImage !== undefined ? { cover_image: input.coverImage } : {}),
    ...(input.seoTitle !== undefined ? { seo_title: input.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seo_description: input.seoDescription } : {}),
    updated_at: new Date().toISOString(),
  });
}

export async function deleteProperty(id: number): Promise<void> {
  await deleteRow("property_images", "property_id", id);
  await deleteRow("properties", "id", id);
}

export async function setPropertyPublished(
  id: number,
  published: boolean
): Promise<void> {
  await updateRow("properties", "id", id, { published, updated_at: new Date().toISOString() });
}

export async function addPropertyImage(
  propertyId: number,
  url: string,
  alt: string
): Promise<void> {
  const images = await getPropertyImages(propertyId);
  const nextSort = images.length > 0 ? Math.max(...images.map(i => i.sort)) + 1 : 1;
  await insertRow("property_images", {
    property_id: propertyId,
    url,
    alt,
    sort: nextSort,
  });
}

export async function deletePropertyImage(imageId: number): Promise<void> {
  await deleteRow("property_images", "id", imageId);
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

function mapProject(row: Record<string, unknown>): ProjectRecord {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    location: String(row.location ?? ""),
    category: String(row.category ?? "development"),
    status: String(row.status ?? "planned"),
    description: String(row.description ?? ""),
    features: Array.isArray(row.features) ? row.features.map(String) : safeStringList(String(row.features ?? "[]")),
    coverImage: row.cover_image == null ? null : String(row.cover_image),
    published: Boolean(row.published),
    sort: Number(row.sort ?? 0),
    seoTitle: row.seo_title == null ? null : String(row.seo_title),
    seoDescription: row.seo_description == null ? null : String(row.seo_description),
  };
}

export async function listProjects(
  opts: { all?: boolean; limit?: number } = {}
): Promise<ProjectRecord[]> {
  "use cache";
  const rows = await queryAll("projects", (query) => {
    let qBuilder = query;
    if (!opts.all) qBuilder = qBuilder.eq("published", true);
    qBuilder = qBuilder.order("sort", { ascending: true }).order("created_at", { ascending: false });
    if (opts.limit != null && Number.isFinite(opts.limit)) qBuilder = qBuilder.limit(opts.limit);
    return qBuilder;
  });
  return rows.map(mapProject);
}

export async function countProjects(publishedOnly = true): Promise<number> {
  const rows = await queryAll("projects", (query) => {
    let qBuilder = query.select("id", { count: "exact", head: true });
    if (publishedOnly) qBuilder = qBuilder.eq("published", true);
    return qBuilder;
  });
  return rows.length;
}

export async function getProjectBySlug(
  slug: string,
  includeUnpublished = false
): Promise<ProjectRecord | null> {
  const row = await queryFirst("projects", (query) => {
    let qBuilder = query.eq("slug", slug);
    if (!includeUnpublished) qBuilder = qBuilder.eq("published", true);
    return qBuilder;
  });
  return row ? mapProject(row) : null;
}

export async function getProjectById(id: number): Promise<ProjectRecord | null> {
  const row = await queryFirst("projects", (query) => query.eq("id", id));
  return row ? mapProject(row) : null;
}

export interface ProjectInput {
  slug: string;
  title: string;
  location: string;
  category: string;
  status: string;
  description: string;
  features: string[];
  coverImage?: string | null;
  published: boolean;
  sort: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export function validateProjectInput(
  input: Partial<ProjectInput>
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!input.slug?.trim())
    errors.push({ field: "slug", message: "URL slug is required." });
  else if (!/^[a-z0-9-]{2,80}$/.test(input.slug.trim()))
    errors.push({ field: "slug", message: "Slug must be lowercase letters, numbers and dashes." });
  if (!input.title?.trim()) errors.push({ field: "title", message: "Title is required." });
  return errors;
}

export async function createProject(input: ProjectInput): Promise<number> {
  const res = await insertRow("projects", {
    slug: input.slug.trim(),
    title: input.title.trim(),
    location: input.location ?? "",
    category: input.category || "development",
    status: input.status || "planned",
    description: input.description ?? "",
    features: input.features ?? [],
    cover_image: input.coverImage ?? null,
    published: Boolean(input.published),
    sort: input.sort ?? 0,
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
  });
  return Number((res as any)?.id ?? 0);
}

export async function updateProject(
  id: number,
  input: Partial<ProjectInput>
): Promise<void> {
  await updateRow("projects", "id", id, {
    ...(input.slug ? { slug: input.slug } : {}),
    ...(input.title ? { title: input.title } : {}),
    ...(input.location !== undefined ? { location: input.location } : {}),
    ...(input.category ? { category: input.category } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.features ? { features: input.features } : {}),
    ...(input.coverImage !== undefined ? { cover_image: input.coverImage } : {}),
    ...(input.published !== undefined ? { published: Boolean(input.published) } : {}),
    ...(input.sort !== undefined ? { sort: input.sort } : {}),
    ...(input.seoTitle !== undefined ? { seo_title: input.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seo_description: input.seoDescription } : {}),
    updated_at: new Date().toISOString(),
  });
}

export async function deleteProject(id: number): Promise<void> {
  await deleteRow("projects", "id", id);
}

export async function setProjectPublished(
  id: number,
  published: boolean
): Promise<void> {
  await updateRow("projects", "id", id, { published, updated_at: new Date().toISOString() });
}

/* ------------------------------------------------------------------ */
/* Enquiries                                                           */
/* ------------------------------------------------------------------ */

function mapEnquiry(row: Record<string, unknown>): EnquiryRecord {
  return {
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone == null ? null : String(row.phone),
    type: String(row.type ?? "general"),
    source: String(row.source ?? "enquire"),
    propertyId: row.property_id == null ? null : Number(row.property_id),
    propertyRef: row.property_ref == null ? null : String(row.property_ref),
    country: row.country == null ? null : String(row.country),
    preferredContact: String(row.preferred_contact ?? "email"),
    message: String(row.message ?? ""),
    consent: Boolean(row.consent),
    status: String(row.status ?? "new"),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function listEnquiries(
  status?: string
): Promise<EnquiryRecord[]> {
  const rows = await queryAll("enquiries", (query) => {
    let qBuilder = query.order("created_at", { ascending: false }).order("id", { ascending: false });
    if (status) qBuilder = qBuilder.eq("status", status);
    return qBuilder;
  });
  return rows.map(mapEnquiry);
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string | null;
  type: string;
  source: string;
  propertyId?: number | null;
  propertyRef?: string | null;
  country?: string | null;
  preferredContact: string;
  message: string;
  consent: boolean;
  ipHash: string;
}

export async function createEnquiry(
  input: EnquiryInput
): Promise<number | null> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const dupe = await queryFirst("enquiries", (query) =>
    query
      .eq("email", input.email.toLowerCase())
      .eq("message", input.message)
      .eq("type", input.type)
      .gte("created_at", tenMinutesAgo)
  );
  if (dupe) return null;

  const res = await insertRow("enquiries", {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone ?? null,
    type: input.type,
    source: input.source,
    property_id: input.propertyId ?? null,
    property_ref: input.propertyRef ?? null,
    country: input.country ?? null,
    preferred_contact: input.preferredContact || "email",
    message: input.message.trim(),
    consent: Boolean(input.consent),
    ip_hash: input.ipHash,
  });
  return Number((res as any)?.id ?? 0);
}

export async function setEnquiryStatus(
  id: number,
  status: string
): Promise<void> {
  await updateRow("enquiries", "id", id, { status });
}

export async function deleteEnquiry(id: number): Promise<void> {
  await deleteRow("enquiries", "id", id);
}

export async function checkRateLimit(
  ipHash: string,
  maxPerDay = 5
): Promise<boolean> {
  const dayKey = new Date().toISOString().slice(0, 10);
  const row = await queryFirst("rate_limit", (query) =>
    query.eq("ip_hash", ipHash).eq("day", dayKey)
  );
  if (row && Number((row as any).submissions) >= maxPerDay) return false;

  const db = await (await import("./db")).getDb();
  await db.from("rate_limit").upsert(
    { ip_hash: ipHash, day: dayKey, submissions: row ? Number((row as any).submissions) + 1 : 1 },
    { onConflict: "ip_hash,day" }
  );
  return true;
}

export async function deleteRateLimit(ipHash: string): Promise<void> {
  await deleteRow("rate_limit", "ip_hash", ipHash);
}

export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "ibtikan-rate-limit";
  const key = `${salt}:${ip}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

/* ------------------------------------------------------------------ */
/* Articles                                                            */
/* ------------------------------------------------------------------ */

function mapArticle(row: Record<string, unknown>): ArticleRecord {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? ""),
    status: String(row.status ?? "draft"),
    publishedAt: row.published_at == null ? null : String(row.published_at),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export async function listArticles(publishedOnly = true): Promise<ArticleRecord[]> {
  "use cache";
  const rows = await queryAll("articles", (query) => {
    let qBuilder = query.order("published_at", { ascending: false }).order("id", { ascending: false });
    if (publishedOnly) qBuilder = qBuilder.eq("status", "published");
    return qBuilder;
  });
  return rows.map(mapArticle);
}

export async function getArticleBySlug(
  slug: string,
  publishedOnly = true
): Promise<ArticleRecord | null> {
  const row = await queryFirst("articles", (query) => {
    let qBuilder = query.eq("slug", slug);
    if (publishedOnly) qBuilder = qBuilder.eq("status", "published");
    return qBuilder;
  });
  return row ? mapArticle(row) : null;
}

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: string;
}

export function validateArticleSlug(slug: string): boolean {
  return /^[a-z0-9-]{2,120}$/.test(slug);
}

export async function upsertArticle(input: ArticleInput): Promise<number> {
  const existing = await queryFirst("articles", (query) => query.eq("slug", input.slug));
  if (existing) {
    await updateRow("articles", "slug", input.slug, {
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      status: input.status,
      published_at: input.status === "published" ? ((existing as any).published_at ?? new Date().toISOString()) : (existing as any).published_at,
      updated_at: new Date().toISOString(),
    });
    return Number((existing as any).id);
  }
  const res = await insertRow("articles", {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });
  return Number((res as any)?.id ?? 0);
}

export async function deleteArticle(id: number): Promise<void> {
  await deleteRow("articles", "id", id);
}

/* ------------------------------------------------------------------ */
/* Team                                                                */
/* ------------------------------------------------------------------ */

function mapTeamMember(row: Record<string, unknown>): TeamMemberRecord {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    role: String(row.role ?? ""),
    summary: String(row.summary ?? ""),
    bio: typeof row.bio === "string" ? parseJson<Record<string, unknown>>(row.bio, {}) : (row.bio as Record<string, unknown> ?? {}),
    portrait: row.portrait == null ? null : String(row.portrait),
    published: Boolean(row.published),
    sort: Number(row.sort ?? 0),
  };
}

export async function listTeamMembers(
  publishedOnly = false
): Promise<TeamMemberRecord[]> {
  "use cache";
  const rows = await queryAll("team_members", (query) => {
    let qBuilder = query.order("sort", { ascending: true }).order("id", { ascending: true });
    if (publishedOnly) qBuilder = qBuilder.eq("published", true);
    return qBuilder;
  });
  return rows.map(mapTeamMember);
}

export async function getTeamMemberBySlug(
  slug: string
): Promise<TeamMemberRecord | null> {
  const row = await queryFirst("team_members", (query) => query.eq("slug", slug));
  return row ? mapTeamMember(row) : null;
}

export interface TeamMemberInput {
  slug: string;
  name: string;
  role: string;
  summary: string;
  bio: Record<string, unknown>;
  portrait?: string | null;
  published: boolean;
  sort: number;
}

export async function updateTeamMember(
  id: number,
  input: TeamMemberInput
): Promise<void> {
  await updateRow("team_members", "id", id, {
    slug: input.slug,
    name: input.name,
    role: input.role,
    summary: input.summary,
    bio: input.bio,
    portrait: input.portrait ?? null,
    published: Boolean(input.published),
    sort: input.sort ?? 0,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteTeamMember(id: number): Promise<void> {
  await deleteRow("team_members", "id", id);
}

export async function createTeamMember(
  input: TeamMemberInput
): Promise<number> {
  const res = await insertRow("team_members", {
    slug: input.slug,
    name: input.name,
    role: input.role,
    summary: input.summary,
    bio: input.bio,
    portrait: input.portrait ?? null,
    published: Boolean(input.published),
    sort: input.sort ?? 0,
  });
  return Number((res as any)?.id ?? 0);
}

/* ------------------------------------------------------------------ */
/* Settings / editable page content                                    */
/* ------------------------------------------------------------------ */

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await queryFirst("settings", (query) => query.eq("key", key));
    if (!row) return fallback;
    const val = (row as any).value;
    if (typeof val === "string") {
      return parseJson<T>(val, fallback);
    }
    return (val as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await (await import("./db")).getDb();
  await db.from("settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
}

export async function listSettings(): Promise<{ key: string; value: string }[]> {
  const rows = await queryAll("settings");
  return rows.map((r: any) => ({
    key: String(r.key),
    value: typeof r.value === "string" ? r.value : JSON.stringify(r.value),
  }));
}

export interface GalleryImageLike {
  url: string;
  alt: string;
}

export { parseGallery };
