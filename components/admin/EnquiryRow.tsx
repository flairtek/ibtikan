"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EnquiryStatus } from "@/lib/brand";
import { enquiryStatuses } from "@/lib/brand";

export default function EnquiryRow({ id, status }: { id: number; status: EnquiryStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function setStatus(next: EnquiryStatus) {
    setBusy(true);
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  async function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <label className="sr-only" htmlFor={`status-${id}`}>Enquiry status</label>
      <select
        id={`status-${id}`}
        value={status}
        disabled={busy}
        onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
        className="input !py-1.5 text-xs"
      >
        {enquiryStatuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button type="button" onClick={remove} disabled={busy} className="btn-outline-danger !px-3 !py-1.5 text-xs">
        {busy ? "…" : confirming ? "Confirm" : "Delete"}
      </button>
    </div>
  );
}
