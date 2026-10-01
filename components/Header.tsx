import Link from "next/link";
import { navigation, site } from "@/content/site";
import Logo from "./Logo";
import MobileNav from "./MobileNav";

export default function Header({ activeSection }: { activeSection?: string }) {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link className="logo" href="/" aria-label={site.name}>
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="Hauptnavigation">
          {navigation.map((sec) => (
            <div key={sec.slug}>
              <Link href={`/${sec.slug}/`} className={activeSection === sec.slug ? "active" : undefined}>
                {sec.label}
                {sec.children && <i className="caret" aria-hidden="true" />}
              </Link>
              {sec.children && (
                <div className="drop">
                  {sec.children.map((c) => (
                    <Link key={c.slug} href={`/${c.slug}/`}>
                      {c.label}
                      {c.description && <small>{c.description}</small>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <Link className="cta" href={site.cta.href}>{site.cta.label}</Link>
        <MobileNav />
      </div>
    </header>
  );
}
