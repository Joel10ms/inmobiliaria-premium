import type { MetadataRoute } from "next";
import { siteConfig }         from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  // Block all crawlers in non-production environments to prevent indexing staging/preview URLs
  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/login",
          "/*?*", // avoid duplicate content from filtered URLs
        ],
      },
      // Allow Google's image bot full access for image search
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
      },
      // Block AI training crawlers
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host:    siteConfig.url,
  };
}
