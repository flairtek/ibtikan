import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";


export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="container-site flex min-h-[60vh] items-center justify-center py-20">
        <div className="card max-w-md p-10 text-center">
          <p className="eyebrow">Administration</p>
          <h1 className="mt-3 font-serif text-3xl text-navy">Sign in required</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Sign in with your Supabase account to manage website content.
            Sessions are limited to authorised administrators.
          </p>
          <Link href="/auth/supabase/signin?returnTo=/admin" className="btn-primary mt-8">
            Sign in with Supabase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-10">
      <AdminNav
        name={user.name ?? user.email ?? "Signed-in user"}
        email={user.email}
      />
      <div className="mt-8 rounded-xl border border-line bg-white p-5 sm:p-8">{children}</div>
    </div>
  );
}

