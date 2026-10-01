import { site } from "@/content/site";
import type { PageMeta } from "@/lib/content";

/**
 * Strukturierte Daten (JSON-LD) für Suchmaschinen.
 * Jede Seite: Unternehmen (Organization) und Brotkrümel (BreadcrumbList).
 * Startseite und Produktseite zusätzlich: das Produkt (SoftwareApplication).
 */
export default function StructuredData({ slug, meta }: { slug: string; meta: PageMeta }) {
  const abs = (p: string) => `${site.url}${p}`;
  const org = {
    "@type": "Organization",
    "@id": abs("/#organisation"),
    name: site.address[0],
    url: abs("/"),
    logo: abs(site.logoPng),
    email: site.email,
    telephone: site.phone,
    foundingDate: site.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address[1],
      postalCode: site.address[2].split(" ")[0],
      addressLocality: site.address[2].split(" ").slice(1).join(" "),
      addressCountry: "DE",
    },
  };

  const graph: object[] = [org];

  if (meta.breadcrumbs?.length) {
    const items = [{ label: "Startseite", href: "/" }, ...meta.breadcrumbs.map((b) => ({ label: b.label, href: b.href || `/${slug}/` }))];
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: items.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.label, item: abs(b.href) })),
    });
  }

  if (slug === "index" || slug === "produkt") {
    graph.push({
      "@type": "SoftwareApplication",
      name: site.product,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      description: site.productDescription,
      url: abs("/produkt/"),
      image: abs(site.shareImage.src),
      inLanguage: "de",
      publisher: { "@id": abs("/#organisation") },
    });
  }

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
