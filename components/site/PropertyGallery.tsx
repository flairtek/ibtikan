"use client";

import Image from "next/image";
import { useState } from "react";

export interface GalleryPhoto {
  id: number;
  url: string;
  alt: string;
}

export function PropertyGallery({
  images,
  title,
}: {
  images: GalleryPhoto[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-navy">
        <span className="font-serif text-3xl text-gold/80">
          {title.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }
  const current = images[Math.min(active, images.length - 1)];
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
        <Image
          src={current.url}
          alt={current.alt || `${title} — image ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-md border-2 transition-colors ${
                i === active ? "border-gold" : "border-transparent hover:border-line"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
