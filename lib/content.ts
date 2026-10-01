import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Liest die Seiten aus content/pages.
 * Dateiname = URL-Pfad: content/pages/funktionen/wartung.md -> /funktionen/wartung/
 * content/pages/index.md -> Startseite
 */
const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export type PageMeta = {
  title: string;          // Seitentitel (H1 und <title>)
  description?: string;   // Meta-Beschreibung für Suchmaschinen
  eyebrow?: string;       // kleine Zeile über der Überschrift
  lead?: string;          // Einleitungstext unter der Überschrift
  section?: string;       // Hauptbereich (für aktive Navigation), z. B. "funktionen"
  heroImage?: { src: string; alt: string }; // Bild rechts neben der Überschrift, z. B. /bilder/ki-assistent.svg
  breadcrumbs?: { label: string; href: string }[];
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
};

export type Page = { slug: string; meta: PageMeta; body: string };

function walk(dir: string, prefix = ""): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return walk(path.join(dir, entry.name), `${prefix}${entry.name}/`);
    if (entry.name.endsWith(".md")) return [`${prefix}${entry.name.replace(/\.md$/, "")}`];
    return [];
  });
}

export function getAllSlugs(): string[] {
  return walk(PAGES_DIR);
}

export function getPage(slug: string): Page | null {
  const file = path.join(PAGES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { slug, meta: data as PageMeta, body: content };
}
