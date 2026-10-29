"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { projectStatuses } from "@/lib/brand";
import type { ProjectRecord } from "@/lib/model";

export function ProjectForm({ existing }: { existing?: ProjectRecord }) {
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
      slug: fd.get("slug"),
      title: fd.get("title"),
      location: fd.get("location"),
      category: fd.get("category"),
      status: fd.get("status"),
      description: fd.get("description"),
      features: String(fd.get("features") ?? "")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      coverImage: fd.get("coverImage") || null,
      published: fd.get("published") === "on",
      sort: 0,
    };
    const url = existing ? `/api/admin/projects/${existing.id}` : "/api/admin/projects";
    const res = await fetch(url, {
      method: existing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin/projects");
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
          URL slug *
          <input name="slug" defaultValue={existing?.slug ?? ""} required className="input mt-1.5" placeholder="ridgewood-court" />
          {err("slug")}
        </label>
        <label className="label !mb-0">
          Title *
          <input name="title" defaultValue={existing?.title ?? ""} required className="input mt-1.5" />
          {err("title")}
        </label>
        <label className="label !mb-0">
          Category
          <input name="category" defaultValue={existing?.category ?? "development"} className="input mt-1.5" placeholder="Residential estate" />
        </label>
        <label className="label !mb-0">
          Location
          <input name="location" defaultValue={existing?.location ?? ""} className="input mt-1.5" placeholder="Accra" />
        </label>
        <label className="label !mb-0">
          Development status
          <select name="status" defaultValue={existing?.status ?? "planned"} className="input mt-1.5">
            {projectStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="label !mb-0">
          Cover image URL (from the Media library, e.g. /media/…)
          <input name="coverImage" defaultValue={existing?.coverImage ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0 sm:col-span-2">
          Features (comma separated — only confirmed features)
          <input name="features" defaultValue={existing?.features.join(", ") ?? ""} className="input mt-1.5" />
        </label>
        <label className="label !mb-0 sm:col-span-2">
          Description (paragraphs separated by blank line)
          <textarea name="description" rows={6} defaultValue={existing?.description ?? ""} className="input mt-1.5" />
        </label>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" name="published" defaultChecked={existing?.published} className="h-4 w-4 rounded accent-gold" />
            Published
          </label>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">
          {busy ? "Saving…" : existing ? "Save changes" : "Create project"}
        </button>
        <button type="button" onClick={() => router.push("/admin/projects")} className="btn-outline-navy">
          Cancel
        </button>
      </div>
    </form>
  );
}
