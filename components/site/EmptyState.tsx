import Link from "next/link";

export function EmptyState({
  title,
  text,
  actions,
}: {
  title: string;
  text: string;
  actions: { label: string; href: string }[];
}) {
  return (
    <div className="card mx-auto max-w-2xl px-8 py-12 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-gold-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 11.5 12 4l9 7.5M5.5 10v9h13v-9"
          />
        </svg>
      </div>
      <h3 className="font-serif text-2xl text-navy">{title}</h3>
      <p className="mt-3 text-muted">{text}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {actions.map((a) => (
          <Link key={a.href + a.label} href={a.href} className="btn-navy">
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
