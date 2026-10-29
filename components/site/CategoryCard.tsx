import Image from "next/image";
import Link from "next/link";

export function CategoryCard({
  label,
  href,
  image,
  blurb,
}: {
  label: string;
  href: string;
  image: string;
  blurb?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border border-line bg-navy"
    >
      <Image
        src={image}
        alt=""
        width={800}
        height={600}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[4/3] w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-serif text-xl text-white">{label}</p>
        {blurb && <p className="mt-1 text-xs text-white/70">{blurb}</p>}
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold">
          View
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
