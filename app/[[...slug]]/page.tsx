import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPage } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Markdown from "@/components/Markdown";

type Props = { params: Promise<{ slug?: string[] }> };

const toSlug = (parts?: string[]) => (parts && parts.length ? parts.join("/") : "index");

export function generateStaticParams() {
  return getAllSlugs().map((s) => ({ slug: s === "index" ? [] : s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage(toSlug((await params).slug));
  if (!page) return {};
  return {
    title: page.slug === "index" ? undefined : page.meta.title,
    description: page.meta.description ?? page.meta.lead,
  };
}

export default async function Page({ params }: Props) {
  const page = getPage(toSlug((await params).slug));
  if (!page) notFound();
  const { meta, body } = page;

  return (
    <>
      <Header activeSection={meta.section} />
      <main className="wrap page">
        {meta.breadcrumbs && (
          <p className="crumbs">
            <Link href="/">Startseite</Link>
            {meta.breadcrumbs.map((b) => (
              <span key={b.href}> › {b.href ? <Link href={b.href}>{b.label}</Link> : b.label}</span>
            ))}
          </p>
        )}
        <section className="hero">
          {meta.eyebrow && <p className="eyebrow">{meta.eyebrow}</p>}
          <h1>{meta.title}</h1>
          {meta.lead && <p className="lead">{meta.lead}</p>}
        </section>
        <div className="body">
          <Markdown>{body}</Markdown>
        </div>
        {(meta.prev || meta.next) && (
          <div className="pager">
            <span>{meta.prev && <Link href={meta.prev.href}>← {meta.prev.label}</Link>}</span>
            <span>{meta.next && <Link href={meta.next.href}>{meta.next.label} →</Link>}</span>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
