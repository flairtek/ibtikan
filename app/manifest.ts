import type { MetadataRoute } from "next";
import { company } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.shortName,
    description:
      "Real estate development, land sales, residential housing, commercial properties and real estate investment opportunities in Ghana.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F7F3",
    theme_color: "#071F3D",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
