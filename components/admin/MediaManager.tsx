"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface MediaItem {
  key: string;
  size: number;
  uploadedAt: string;
}

export default function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setStatus("");
    let failures = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (!res.ok) failures += 1;
    }
    if (inputRef.current) inputRef.current.value = "";
    setBusy(false);
    if (failures === 0) router.refresh();
    else setStatus(`${failures} upload${failures > 1 ? "s" : ""} failed — check size (max 8 MB) and format.`);
  }

  async function remove(key: string) {
    if (confirming !== key) {
      setConfirming(key);
      return;
    }
    setConfirming(null);
    setBusy(true);
    const res = await fetch(`/api/admin/media/${encodeURIComponent(key)}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else setStatus("Delete failed.");
  }

  function copy(key: string) {
    navigator.clipboard
      .writeText(`/media/${key}`)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(""), 2000);
      })
      .catch(() => setCopied(""));
  }

  return (
    <div>
      <p aria-live="polite" className="min-h-6 text-sm font-semibold text-navy">
        {busy ? "Uploading…" : status}
      </p>
      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-line px-6 py-10 text-center transition hover:border-gold">
        <span className="block font-serif text-lg font-bold text-navy">Upload images</span>
        <span className="mt-1 block text-sm text-muted">PNG, JPEG, WebP, AVIF or GIF · max 8 MB each · multiple files at once</span>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={(e) => onUpload(e.target.files)} />
        <span className="btn-primary pointer-events-none mt-4 inline-block">Choose images</span>
      </label>

      {initialItems.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {initialItems.map((item) => (
            <li key={item.key} className="card overflow-hidden !p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/${item.key}`} alt={item.key} loading="lazy" className="h-36 w-full bg-ivory object-cover" />
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-ink" title={item.key}>{item.key}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {(item.size / 1024).toFixed(0)} KB · {new Date(item.uploadedAt).toLocaleDateString("en-GB")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={() => copy(item.key)} className="text-xs font-semibold text-archblue hover:text-gold">
                    {copied === item.key ? "Copied ✓" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    disabled={busy}
                    className={`ml-auto text-xs font-semibold ${confirming === item.key ? "text-red-600" : "text-muted hover:text-red-600"}`}
                  >
                    {confirming === item.key ? "Confirm delete" : "Delete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !busy && <p className="mt-8 text-center text-sm text-muted">The library is empty. Upload an approved photograph or property image to begin.</p>
      )}
    </div>
  );
}
