"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SpeedDial({
  kind,
  id,
  slug,
}: {
  kind: "properties" | "projects";
  id: number;
  slug: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const publicHref =
    kind === "properties" ? `/properties/${slug}` : kind === "projects" ? `/projects/${slug}` : kind === "articles" ? `/insights/${slug}` : null;

  async function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/${kind}/${id}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(false);
    if (res.ok) {
      router.push(`/admin/${kind}`);
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span role="alert" className="text-xs font-semibold text-red-600">Delete failed</span>}
      {publicHref && (
        <Link href={publicHref} target="_blank" rel="noreferrer" className="btn-outline-navy">
          View
        </Link>
      )}
      <button type="button" onClick={remove} disabled={busy} className="btn-outline-danger">
        {busy ? "…" : confirming ? "Confirm delete" : "Delete"}
      </button>
    </div>
  );
}
