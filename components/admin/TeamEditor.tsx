"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TeamMemberRecord } from "@/lib/model";

interface BioShape {
  intro?: string;
  philosophy?: string;
  vision?: string;
  commitment?: string;
  education?: { school: string; stage: string; text: string }[];
  leadership?: { title: string; text: string }[];
}

function asBio(raw: Record<string, unknown>): BioShape {
  return raw as BioShape;
}

function TeamCard({ member }: { member: TeamMemberRecord }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bio = asBio(member.bio);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: fd.get("summary"),
        portrait: fd.get("portrait"),
        published: fd.get("published") === "on",
        bio: {
          intro: fd.get("intro"),
          philosophy: fd.get("philosophy"),
          vision: fd.get("vision"),
          commitment: fd.get("commitment"),
          education: bio.education ?? [],
          leadership: bio.leadership ?? [],
        },
      }),
    });
    setBusy(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Save failed.");
    }
  }

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-navy">{member.name}</h3>
          <p className="text-sm font-semibold text-gold-600">{member.role}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {member.published ? "Published" : "Draft"} · slug /{member.slug}
          </p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="btn-outline-navy">
          {open ? "Close editor" : "Edit profile"}
        </button>
      </div>
      {open && (
        <form onSubmit={save} className="mt-5 grid gap-4 border-t border-line pt-5">
          {error && (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <label className="label !mb-0">
            Portrait URL (an approved photograph only — e.g. /media/… from the media library; leave empty to show the placeholder)
            <input name="portrait" defaultValue={member.portrait ?? ""} className="input mt-1.5" />
          </label>
          <label className="label !mb-0">
            Short summary (used on the Leadership page)
            <textarea name="summary" rows={4} defaultValue={member.summary} className="input mt-1.5" />
          </label>
          <fieldset className="grid gap-4 rounded-lg border border-line p-4">
            <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-muted">Biography sections</legend>
            <label className="label !mb-0">
              Personal and professional profile
              <textarea name="intro" rows={5} defaultValue={bio.intro ?? ""} className="input mt-1.5" />
            </label>
            <label className="label !mb-0">
              Business philosophy (paragraphs separated by blank line)
              <textarea name="philosophy" rows={5} defaultValue={bio.philosophy ?? ""} className="input mt-1.5" />
            </label>
            <label className="label !mb-0">
              Vision for the company
              <textarea name="vision" rows={5} defaultValue={bio.vision ?? ""} className="input mt-1.5" />
            </label>
            <label className="label !mb-0">
              Commitment to excellence
              <textarea name="commitment" rows={5} defaultValue={bio.commitment ?? ""} className="input mt-1.5" />
            </label>
            <p className="text-xs text-muted">
              The education timeline (Mankarigu Primary School, Tamale Bagabaga Annex JHS, Salaga SHS, University of Ghana) and
              the seven leadership priorities ship with the page and are only edited in code so that no unverified fact can be
              published from the dashboard.
            </p>
          </fieldset>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input type="checkbox" name="published" defaultChecked={member.published} className="h-4 w-4 rounded accent-gold" />
              Published (visible on the public Leadership/CEO pages)
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">{busy ? "Saving…" : "Save changes"}</button>
            <button type="button" onClick={() => setOpen(false)} className="btn-outline-navy">Cancel</button>
          </div>
        </form>
      )}
    </article>
  );
}

export default function TeamEditor({ team }: { team: TeamMemberRecord[] }) {
  return (
    <div className="grid gap-4">
      {team.map((m) => (
        <TeamCard key={m.id} member={m} />
      ))}
    </div>
  );
}
