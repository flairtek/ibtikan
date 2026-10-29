import Link from "next/link";

export function CtaBand({
  title,
  text,
  actions,
}: {
  title: string;
  text?: string;
  actions: { label: string; href: string; style: "primary" | "outline" }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gold"
      />
      <div className="container-site py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-3xl font-serif text-3xl leading-tight text-white sm:text-4xl">
          {title}
        </h2>
        {text && <p className="mx-auto mt-4 max-w-2xl text-white/70">{text}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {actions.map((a) =>
            a.style === "primary" ? (
              <Link key={a.href} href={a.href} className="btn-primary">
                {a.label}
              </Link>
            ) : (
              <Link key={a.href} href={a.href} className="btn-outline">
                {a.label}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
