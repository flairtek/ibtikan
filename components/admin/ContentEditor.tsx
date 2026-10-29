"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContentBlock {
  label: string;
  description: string;
  defaults: string;
  current: string;
}

export default function ContentEditor({ keys }: { keys: [string, ContentBlock][] }) {
  const router = useRouter();
  const [active, setActive] = useState(keys[0][0]);
  const meta = keys.find(([k]) => k === active)![1];
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(keys.map(([k, def]) => [k, def.current]))
  );
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");

  async function put(entries: Record<string, string>) {
    setBusy(true);
    setSaved("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    setBusy(false);
    if (res.ok) {
      setSaved("Saved — the change is live.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setSaved(data?.error ?? "Save failed. Try again.");
    }
  }

  return (
    <div className="grid gap-5">
      <div role="tablist" aria-label="Editable content blocks" className="flex flex-wrap gap-2">
        {keys.map(([key, def]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => { setActive(key); setSaved(""); }}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${active === key ? "border-gold bg-gold-100 text-navy" : "border-line text-muted hover:text-navy"}`}
          >
            {def.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{meta.description}</p>
      <label className="label !mb-0">
        Content (paragraphs separated by blank line)
        <textarea
          rows={12}
          className="input mt-1.5"
          value={values[active]}
          onChange={(e) => setValues({ ...values, [active]: e.target.value })}
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => put({ [active]: values[active] })} disabled={busy} className="btn-primary disabled:opacity-70">
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setValues({ ...values, [active]: meta.defaults });
            void put({ [active]: meta.defaults });
          }}
          disabled={busy}
          className="btn-outline-navy"
        >
          Restore shipped copy
        </button>
        {saved && <p aria-live="polite" className="text-sm font-semibold text-navy">{saved}</p>}
      </div>
    </div>
  );
}
