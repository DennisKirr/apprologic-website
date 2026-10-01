import Link from "next/link";
import { footerColumns, site } from "@/content/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div className="brand">
            <Link className="logo" href="/" aria-label={site.name}><Logo /></Link>
            <address>
              {site.address.map((line) => <span key={line}>{line}</span>)}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </address>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <b>{col.title}</b>
              {col.links.map((l) => (
                <Link key={l.slug} href={`/${l.slug}/`}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <p className="legal">© {new Date().getFullYear()} {site.address[0]}</p>
      </div>
    </footer>
  );
}
