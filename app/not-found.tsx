import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFoundPage } from "@/content/site";

// Fehlerseite (out/404.html). Texte in content/site.ts (notFoundPage).
export const metadata: Metadata = {
  title: notFoundPage.title, // noindex setzt Next.js für die 404-Seite selbst
};

export default function NotFound() {
  return (
    <div className="site">
      <Header />
      <main className="page">
        <section className="hero">
          <div className="wrap">
            <div className="hero-text">
              <p className="eyebrow">404</p>
              <h1>{notFoundPage.title}</h1>
              <p className="lead">{notFoundPage.lead}</p>
            </div>
          </div>
        </section>
        <div className="wrap body">
          <div className="next">
            <div className="btns">
              {notFoundPage.links.map((l, i) => (
                <Link key={l.href} className={`btn${i === 0 ? " primary" : ""}`} href={l.href}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
