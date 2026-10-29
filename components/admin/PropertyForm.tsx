"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { propertyCategories, propertyCategoryLabels, transactionTypes } from "@/lib/brand";
import type { PropertyRecord } from "@/lib/model";

const AVAILABILITIES = [
  "available",
  "coming-soon",
  "reserved",
  "under-construction",
  "sold",
];

export function PropertyForm({ existing }: { existing?: PropertyRecord }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    const body = {
      ref: fd.get("ref"),
      slug: fd.get("slug"),
      title: fd.get("title"),
      category: fd.get("category"),
      transactionType: fd.get("transactionType"),
      description: fd.get("description") ?? "",
      location: fd.get("location") ?? "",
      region: fd.get("region") ?? "",
      price: fd.get("price") === "" ? null : Number(fd.get("price")),
      currency: fd.get("currency") || "GHS",
      landArea: fd.get("landArea") || null,
      buildingArea: fd.get("buildingArea") || null,
      bedrooms: fd.get("bedrooms") ? Number(fd.get("bedrooms")) : null,
      bathrooms: fd.get("bathrooms") ? Number(fd.get("bathrooms")) : null,
      features: String(fd.get("features") ?? "")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      availability: fd.get("availability") || "available",
      featured: fd.get("featured") === "on",
      published: fd.get("published") === "on",
      coverImage: fd.get("coverImage") || null,
      seoTitle: fd.get("seoTitle") || null,
      seoDescription: fd.get("seoDescription") || null,
    };
    const url = existing ? `/api/admin/properties/${existing.id}` : "/api/admin/properties";
    const res = await fetch(url, {
      method: existing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin/properties");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setFieldErrors(data?.fieldErrors ?? {});
      setError(data?.error ?? `Save failed (${res.status}).`);
    }
  }

  const err = (field: string) =>
    fieldErrors[field] ? (
      <span role="alert" className="mt-1 block text-xs font-semibold text-red-600">
        {fieldErrors[field]}
      </span>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="label !mb-0">
          Reference *
          <input name="ref" defaultValue={existing?.ref ?? ""} required className="input mt-1.5" placeholder="IBT-001" />
          {err("ref")}
        </label>
        <label className="label !mb-0">
          URL slug *
          <input name="slug" defaultValue={existing?.slug ?? ""} required className="input mt-1.5" placeholder="plot-at-tema" />
          {err("slug")}
        </label>
        <label className="label !mb-0 sm:col-span-2">
          Title *
          <input name="title" defaultValue={existing?.title ?? ""} required className="input mt-1.5" />
          {err("title")}
        </label>
        <label className="label !mb-0">
          Category *
          <select name="category" defaultValue={existing?.category ?? "residential"} className="input mt-1.5">
            {propertyCategories.map((c) => (
              <option key={c} value={c}>{propertyCategoryLabels[c]}</option>
            ))}
          </select>
          {err("category")}
        </label>
        <label className="label !mb-0">
          Transaction type *
          <select name="transactionType" defaultValue={existing?.transactionType ?? "sale"} className="input mt-1.5">
            {transactionTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="label !mb-0">
          Location
          <input name="location" defaultValue={existing?.location ?? ""} className="input mt-1.5" placeholder="Accra" />
        </label>
        <label className="label !mb-0">
          Region
          <input name="region" defaultValue={existing?.region ?? ""} className="input mt-1.5" placeholder="Greater Accra" />
        </label>
        <label className="label !mb-0">
          Price (numeric; leave empty for &quot;price on request&quot;)
          <input name="price" type="number" min="0" defaultValue={existing?.price ?? ""} className="input mt-1.5" />
          {err("price")}
        </label>
        <label className="label !mb-0">
          Currency
          <select name="currency" defaultValue={existing?.currency ?? "GHS"} className="input mt-1.5">
            <option value="GHS">GHS — Ghanaian cedi (GH₵)</option>
          </select>
        </label>
        <label className="label !mb-0">
          Land area
          <input name="landArea" defaultValue={existing?.landArea ?? ""} className="input mt-1.5" placeholder="e.g. 500 sqm" />
        </label>
        <label className="label !mb-0">
          Building area
          <input name="buildingArea" defaultValue={existing?.buildingArea ?? ""} className="input mt-1.5" placeholder="e.g. 180 sqm" />
        </label>
        <label className="label !mb-0">
          Bedrooms
          <input name="bedrooms" type="number" min="0" defaultValue={existing?.bedrooms ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0">
          Bathrooms
          <input name="bathrooms" type="number" min="0" defaultValue={existing?.bathrooms ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0 sm:col-span-2">
          Cover image URL (from the Media library, e.g. /media/…)
          <input name="coverImage" defaultValue={existing?.coverImage ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0 sm:col-span-2">
          Features (comma separated — only features that are verified)
          <input name="features" defaultValue={existing?.features.join(", ") ?? ""} className="input mt-1.5" placeholder="Accessible road, Facilitates power" />
        </label>
        <label className="label !mb-0 sm:col-span-2">
          Description (paragraphs separated by blank line)
          <textarea name="description" rows={6} defaultValue={existing?.description ?? ""} className="input mt-1.5" />
          {err("description")}
        </label>
        <label className="label !mb-0">
          SEO title
          <input name="seoTitle" defaultValue={existing?.seoTitle ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0">
          SEO description
          <input name="seoDescription" defaultValue={existing?.seoDescription ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0">
          Availability
          <select name="availability" defaultValue={existing?.availability ?? "available"} className="input mt-1.5">
            {AVAILABILITIES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-6 pb-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" name="featured" defaultChecked={existing?.featured} className="h-4 w-4 rounded accent-gold" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" name="published" defaultChecked={existing?.published} className="h-4 w-4 rounded accent-gold" />
            Published
          </label>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">
          {busy ? "Saving…" : existing ? "Save changes" : "Create property"}
        </button>
        <button type="button" onClick={() => router.push("/admin/properties")} className="btn-outline-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
