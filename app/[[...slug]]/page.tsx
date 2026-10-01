import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPage } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Markdown from "@/components/Markdown";
import StructuredData from "@/components/StructuredData";
import { site } from "@/content/site";
import { siteTitle } from "../layout";

type Props = { params: Promise<{ slug?: string[] }> };

const toSlug = (parts?: string[]) => (parts && parts.length ? parts.join("/") : "index");

export function generateStaticParams() {
  return getAllSlugs().map((s) => ({ slug: s === "index" ? [] : s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage(toSlug((await params).slug));
  if (!page) return {};
  const url = page.slug === "index" ? "/" : `/${page.slug}/`;
  const title = page.meta.seoTitle ?? page.meta.title;
  const description = page.meta.description ?? page.meta.lead;
  const image = { url: site.shareImage.src, width: 1200, height: 630, alt: site.shareImage.alt };
  return {
    // Startseite: kein eigener Titel, damit der Standardtitel aus app/layout.tsx greift
    ...(page.slug === "index" ? {} : { title }),
    description,
    // Kanonische Adresse mit Schrägstrich am Ende (trailingSlash-Export), Basis-URL aus content/site.ts
    alternates: { canonical: url },
    // Vorschau beim Teilen (LinkedIn, Teams, WhatsApp …)
    openGraph: {
      type: "website", locale: "de_DE", siteName: `${site.product} | ${site.name}`, url,
      title: page.slug === "index" ? siteTitle : title, description, images: [image],
    },
    twitter: { card: "summary_large_image", title: page.slug === "index" ? siteTitle : title, description, images: [image.url] },
  };
}

export default async function Page({ params }: Props) {
  const page = getPage(toSlug((await params).slug));
  if (!page) notFound();
  const { meta, body } = page;

  return (
    // Container, damit das erste Element nicht die sticky Kopfzeile ist: Next.js scrollt beim
    // Seitenwechsel das erste Element in den Blick, bei einem sticky Element bliebe die Position stehen.
    <div className="site">
      <StructuredData slug={page.slug} meta={meta} />
      <Header activeSection={meta.section} />
      <main className={`page${page.slug === "index" ? " page-home" : ""}`}>
        <section className="hero">
          <div className={`wrap${meta.heroImage ? " hero-grid" : ""}`}>
            <div className="hero-text">
              {meta.breadcrumbs && (
                <p className="crumbs">
                  <Link href="/">Startseite</Link>
                  {meta.breadcrumbs.map((b) => (
                    <span key={b.href}> › {b.href ? <Link href={b.href}>{b.label}</Link> : b.label}</span>
                  ))}
                </p>
              )}
              {meta.eyebrow && <p className="eyebrow">{meta.eyebrow}</p>}
              <h1>{meta.title}</h1>
              {meta.lead && <p className="lead">{meta.lead}</p>}
            </div>
            {meta.heroImage && <img className="hero-media" src={meta.heroImage.src} alt={meta.heroImage.alt} />}
          </div>
        </section>
        <div className="wrap body">
          <Markdown>{body}</Markdown>
        </div>
        {(meta.prev || meta.next) && (
          <nav className="wrap pager" aria-label="Seitennavigation">
            {meta.prev ? <Link className="prev" href={meta.prev.href}>{meta.prev.label}</Link> : <span />}
            {meta.next ? <Link className="nextpage" href={meta.next.href}>{meta.next.label}</Link> : <span />}
          </nav>
        )}
      </main>
      <Footer />
    </div>
  );
}
