import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense }                from "react";
import { siteConfig }              from "@/config/site";
import { GoogleAnalytics }         from "@/components/analytics/google-analytics";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets:  ["latin"],
  variable: "--font-playfair",
  display:  "swap",
  weight:   ["400", "500", "600", "700", "800", "900"],
  style:    ["normal", "italic"],
});

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
  weight:   ["300", "400", "500", "600", "700"],
});

// ─── Global metadata ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:  `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "inmobiliaria de lujo", "propiedades premium", "casas en venta",
    "departamentos de lujo", "bienes raíces exclusivos", "penthouses",
    "villas de lujo", "Ciudad de México",
  ],
  authors:  [{ name: siteConfig.name }],
  creator:  siteConfig.name,
  openGraph: {
    type:        "website",
    locale:      "es_MX",
    url:         siteConfig.url,
    title:       `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName:    siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images:      [siteConfig.ogImage],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon:  [{ url: "/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#960018",
  width: "device-width",
  initialScale: 1,
};

// ─── Root layout — no Navbar/Footer here (cada grupo los maneja) ──
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Suspense fallback={null}>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </Suspense>
        )}
      </body>
    </html>
  );
}
