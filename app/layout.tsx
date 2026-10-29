import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { organizationJsonLd, webSiteJsonLd, siteUrl } from "@/lib/seo";
import { company } from "@/lib/brand";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Real Estate Development, Land Sales & Property Investment in Ghana`,
    template: `%s | ${company.shortName}`,
  },
  description:
    "Ibtikan Ibn Adams Properties Limited is a Ghana-focused real estate company: property development, land sales, residential housing, commercial properties and real estate investment opportunities. " +
    company.motto,
  applicationName: company.name,
  appleWebApp: {
    capable: true,
    title: company.shortName,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#071F3D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
      lang="en"
      // Browser extensions (e.g. "Scribe") inject attributes onto <html> before
      // hydration; suppress that node's mismatch warning only.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
      </body>
    </html>
  );
}
