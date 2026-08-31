import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * `force-static` is required by `output: "export"`: without it Next treats a route
 * handler as dynamic and refuses to export it.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
