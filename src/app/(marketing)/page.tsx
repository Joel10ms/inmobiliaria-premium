import type { Metadata }                from "next";
import { HeroSection }                  from "@/components/home/hero-section";
import { QuickSearch }                  from "@/components/home/quick-search";
import { FeaturedPropertiesSection }    from "@/components/home/featured-properties-section";
import { StatsSection }                 from "@/components/home/stats-section";
import { WhyUsSection }                 from "@/components/home/why-us-section";
import { AgentsPreviewSection }         from "@/components/home/agents-preview-section";
import { CtaSection }                   from "@/components/home/cta-section";
import { JsonLd }                       from "@/components/seo/json-ld";
import { buildOrganizationSchema }      from "@/lib/seo/schemas";
import { siteConfig }                   from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title:       `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url:         siteConfig.url,
    type:        "website",
    images: [{
      url:    `${siteConfig.url}${siteConfig.ogImage}`,
      width:  1200,
      height: 630,
      alt:    siteConfig.name,
    }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images:      [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function HomePage() {
  return (
    <>
      {/* ─── Structured data: Organization + WebSite ─────────────── */}
      <JsonLd schema={buildOrganizationSchema()} />

      {/* 1. Hero — full viewport with parallax */}
      <HeroSection />

      {/* 2. Quick search bar — floats over hero */}
      <QuickSearch />

      {/* 3. Featured properties grid */}
      <FeaturedPropertiesSection />

      {/* 4. Stats on dark bg */}
      <StatsSection />

      {/* 5. Why choose us — split layout */}
      <WhyUsSection />

      {/* 6. Agents preview */}
      <AgentsPreviewSection />

      {/* 7. CTA section */}
      <CtaSection />
    </>
  );
}
