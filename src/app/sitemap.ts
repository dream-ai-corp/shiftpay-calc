import type { MetadataRoute } from "next";
import { LEGAL, SITE_URL, TOOLS } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    ...TOOLS.map((t) => t.href),
    ...LEGAL.map((l) => l.href),
  ];
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
