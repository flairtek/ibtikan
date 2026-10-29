"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

const TABS = [
  ["Dashboard", "/admin"],
  ["Properties", "/admin/properties"],
  ["Projects", "/admin/projects"],
  ["Enquiries", "/admin/enquiries"],
  ["Pages & Articles", "/admin/pages"],
  ["Team", "/admin/team"],
  ["Media", "/admin/media"],
  ["Settings", "/admin/settings"],
] as const;

export function AdminNav({ name, email }: { name: string; email?: string }) {
  const pathname = usePathname();

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-navy">Website Admin</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{name}{email ? ` · ${email}` : ""}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="btn-outline-navy !px-3 !py-1.5 text-xs"
          >
            Sign out
          </button>
        </div>
      </div>
      <nav aria-label="Admin sections" className="mt-6 flex flex-wrap gap-1.5">
        {TABS.map(([label, href]) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3.5 py-2 text-sm font-semibold ${
                active
                  ? "bg-navy text-white"
                  : "bg-ivory text-ink hover:bg-gold-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
