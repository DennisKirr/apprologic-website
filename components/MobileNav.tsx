"use client";
import { useState } from "react";
import Link from "next/link";
import { navigation, site } from "@/content/site";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="burger" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
        <i aria-hidden="true" />
        <span>Menü</span>
      </button>
      <nav id="mobile-nav" className={`mobile-nav${open ? " open" : ""}`} aria-label="Mobile Navigation">
        {navigation.map((sec) => (
          <div key={sec.slug}>
            <Link href={`/${sec.slug}/`} onClick={() => setOpen(false)}>{sec.label}</Link>
            {sec.children?.map((c) => (
              <Link key={c.slug} className="sub" href={`/${c.slug}/`} onClick={() => setOpen(false)}>{c.label}</Link>
            ))}
          </div>
        ))}
        <Link className="cta" href={site.cta.href} onClick={() => setOpen(false)}>{site.cta.label}</Link>
      </nav>
    </>
  );
}
