import type { MetadataRoute } from "next";
import { getAllSlugs } from "../lib/content";
import { site } from "../content/site";

// Statisch beim Build erzeugt (out/sitemap.xml), eine Zeile je Seite in content/pages.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const legal = ["impressum", "datenschutz"];
  return getAllSlugs().map((slug) => ({
    url: slug === "index" ? `${site.url}/` : `${site.url}/${slug}/`,
    changeFrequency: "monthly",
    priority: slug === "index" ? 1 : legal.includes(slug) ? 0.2 : 0.7,
  }));
}
