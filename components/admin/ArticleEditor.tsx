"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ArticleRecord } from "@/lib/model";

export default function ArticleEditor({ articles }: { articles: ArticleRecord[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ArticleRecord | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing !== "new" && editing ? editing.id : undefined,
        slug: fd.get("slug"),
        title: fd.get("title"),
        excerpt: fd.get("excerpt"),
        body: fd.get("body"),
        status: fd.get("status"),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setEditing(null);
      setStatus("Saved.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setStatus(data?.error ?? "Save failed.");
    }
  }

  async function remove(article: ArticleRecord) {
    if (!confirm(`Delete the article "${article.title}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: article.id }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setStatus("Delete failed.");
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-semibold text-navy">{busy ? "Working…" : status}</p>
        <button type="button" onClick={() => setEditing("new")} className="btn-primary !px-4 !py-2 text-xs">
          New article
        </button>
      </div>
      {editing && (
        <form onSubmit={save} className="card grid gap-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="label !mb-0">
              URL slug *
              <input name="slug" required defaultValue={editing !== "new" && editing ? editing.slug : ""} className="input mt-1.5" placeholder="questions-before-buying-land" />
            </label>
            <label className="label !mb-0">
              Title *
              <input name="title" required defaultValue={editing !== "new" && editing ? editing.title : ""} className="input mt-1.5" />
            </label>
            <label className="label !mb-0 sm:col-span-2">
              Excerpt
              <input name="excerpt" defaultValue={editing !== "new" && editing ? editing.excerpt : ""} className="input mt-1.5" />
            </label>
            <label className="label !mb-0 sm:col-span-2">
              Body (paragraphs separated by blank line)
              <textarea name="body" rows={12} defaultValue={editing !== "new" && editing ? editing.body : ""} className="input mt-1.5" />
            </label>
            <label className="label !mb-0">
              Visibility
              <select name="status" defaultValue={editing !== "new" && editing ? editing.status : "draft"} className="input mt-1.5">
                <option value="draft">Draft (not public)</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">{busy ? "Saving…" : "Save"}</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-outline-navy">Cancel</button>
          </div>
        </form>
      )}
      {articles.length === 0 ? (
        <p className="card p-8 text-center text-muted">No articles yet. Create the first draft above.</p>
      ) : (
        <ul className="grid gap-3">
          {articles.map((a) => (
            <li key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="text-xs text-muted">/{a.slug} · {a.status}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => setEditing(a)} className="btn-outline-navy !px-3 !py-1.5 text-xs">Edit</button>
                <button type="button" disabled={busy} onClick={() => remove(a)} className="btn-outline-danger !px-3 !py-1.5 text-xs">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
