import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center rounded-md ${className}`}
      aria-label={`${company.name} — home`}
    >
      <Image
        src="/logo.svg"
        alt="Ibtikan Ibn Adams Properties Limited logo"
        width={1774}
        height={887}
        priority
        unoptimized
        className="h-16 w-auto"
      />
    </Link>
  );
}
