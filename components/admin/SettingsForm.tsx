"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsForm({
  notificationEmail,
  admins,
}: {
  notificationEmail: string;
  admins: string[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState(notificationEmail);
  const [newAdmin, setNewAdmin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [currentAdmins, setCurrentAdmins] = useState(admins);

  async function put(body: Record<string, unknown>, message: string) {
    setBusy(true);
    setError("");
    setSaved("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(message);
      router.refresh();
      return true;
    }
    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Save failed.");
    return false;
  }

  async function addAdmin() {
    const value = newAdmin.trim();
    if (!value) return;
    const ok = await put(
      { addAdmin: [value] },
      `“${value}” can now sign in as an administrator.`
    );
    if (ok) {
      setCurrentAdmins((prev) => [...prev, value.toLowerCase()]);
      setNewAdmin("");
    }
  }

  async function removeAdmin(target: string) {
    const ok = await put(
      { removeAdmin: [target] },
      `“${target}” removed from the administrator list.`
    );
    if (ok) setCurrentAdmins((prev) => prev.filter((e) => e !== target));
  }

  return (
    <div className="grid gap-8">
      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void put({ notificationEmail: email }, "Notification email saved.");
        }}
        className="grid gap-4"
      >
        <label className="label !mb-0">
          Enquiry notification email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1.5"
            inputMode="email"
          />
          <span className="mt-1 block text-xs font-semibold text-muted">
            Where new enquiry notifications are sent once email delivery is configured (RESEND_API_KEY in Sites → Secrets).
          </span>
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">
            Save notification email
          </button>
          {saved && <p aria-live="polite" className="text-sm font-semibold text-navy">{saved}</p>}
        </div>
      </form>

      <section className="grid gap-3 border-t border-line pt-6">
        <h3 className="font-serif text-lg text-navy">Administrators</h3>
        <p className="text-xs text-muted">
          Only these email addresses (plus addresses in the ADMIN_EMAILS environment variable) can sign in and manage the
          website. The first signed-in user on a fresh site claims the role automatically.
        </p>
        <ul className="grid gap-2">
          {currentAdmins.map((a) => (
            <li key={a} className="flex items-center justify-between gap-3 rounded-md border border-line bg-ivory px-4 py-2 text-sm">
              <span className="font-semibold text-ink">{a}</span>
              <button type="button" onClick={() => removeAdmin(a)} disabled={busy} className="text-xs font-semibold text-muted hover:text-red-600">
                Remove
              </button>
            </li>
          ))}
          {currentAdmins.length === 0 && <li className="text-sm text-muted">No stored administrators yet.</li>}
        </ul>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="new-admin">Add administrator email</label>
          <input
            id="new-admin"
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
            className="input max-w-xs"
            placeholder="name@ibtikanproperties.com"
            inputMode="email"
          />
          <button
            type="button"
            onClick={addAdmin}
            disabled={busy || !newAdmin.trim()}
            className="btn-outline-navy disabled:opacity-60"
          >
            Add administrator
          </button>
        </div>
      </section>
    </div>
  );
}
