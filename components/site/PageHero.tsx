import Image from "next/image";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHero({
  title,
  lede,
  image,
  crumbs,
  align = "left",
}: {
  title: string;
  lede?: string;
  image?: string | null;
  crumbs?: Crumb[];
  align?: "left" | "center";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/50"
          />
        </>
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] bg-gold"
      />
      <div
        className={`container-site relative py-16 sm:py-20 lg:py-24 ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {crumbs && (
          <Breadcrumbs
            items={crumbs}
            light
          />
        )}
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {lede && (
          <p
            className={`mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
