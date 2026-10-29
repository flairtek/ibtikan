"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublishButton({
  kind,
  id,
  published,
  label = "publish",
}: {
  kind: "properties" | "projects" | "team";
  id: number;
  published: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const res = await fetch(`/api/admin/${kind}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <button type="button" onClick={toggle} disabled={busy} className={published ? "btn-outline-navy disabled:opacity-70" : "btn-primary disabled:opacity-70"}>
      {busy ? "Working…" : published ? `Un${label}` : label[0].toUpperCase() + label.slice(1)}
    </button>
  );
}
