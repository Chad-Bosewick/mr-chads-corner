import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

export const dynamic = "force-static";

const BUILD_DATE = new Date("2026-07-26T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mrchad.netlify.app";

  const projectUrls = projects
    .filter((p) => p.status === "published")
    .map((p) => ({
      url: `${baseUrl}/featured-case-studies/${p.slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    { url: baseUrl, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/featured-case-studies`, lastModified: BUILD_DATE, changeFrequency: "weekly", priority: 0.8 },
    ...projectUrls,
    { url: `${baseUrl}/about-temi`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: BUILD_DATE, changeFrequency: "monthly", priority: 0.5 },
  ];
}
