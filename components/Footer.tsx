import Link from "next/link";
import { footerColumns, site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <b>{col.title}</b>
              {col.links.map((l) => (
                <Link key={l.slug} href={`/${l.slug}/`}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <p className="legal">
          © {new Date().getFullYear()} {site.address.join(" · ")} · {site.phone} · {site.email}
        </p>
      </div>
    </footer>
  );
}
