import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * `force-static` is required by `output: "export"`: without it Next treats a route
 * handler as dynamic and refuses to export it.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${site.url}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...['publications','about','lab'].map(slug => ({url: `${site.url}/${slug}/`, changeFrequency: 'monthly' as const, priority: 0.8})),
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.id}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
