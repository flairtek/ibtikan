import Link from "next/link";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({
  items,
  light = false,
}: {
  items: Crumb[];
  light?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className={light ? "text-white/50" : "text-muted"}>
                  /
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={light ? "text-gold" : "text-archblue font-semibold"}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={
                    light
                      ? "text-white/80 hover:text-white"
                      : "text-muted hover:text-archblue"
                  }
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
