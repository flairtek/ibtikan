import type { ReactNode } from "react";

const TONES: Record<string, string> = {
  published: "border-line bg-ivory text-sage",
  draft: "border-line bg-ivory text-muted",
  pending: "border-line bg-ivory text-gold-600",
};

export function Badge({
  tone = "draft",
  children,
}: {
  tone?: "published" | "draft" | "pending";
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
