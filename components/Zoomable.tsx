"use client";

import { useEffect, useState } from "react";

/**
 * Grafik im Fließtext, die sich per Klick oder Tipp bildschirmfüllend öffnet.
 * Gedacht für die detailreichen Querformat-Grafiken, die auf dem Smartphone
 * sonst zu klein sind. Rein clientseitig, ohne Server-Funktionen.
 */
export default function Zoomable({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className="zoom" title="Vergrößern" onClick={() => setOpen(true)}>
        <img src={src} alt={alt} loading="lazy" />
      </button>
      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <img src={src} alt="" />
          <button type="button" className="lightbox-close" aria-label="Schließen" onClick={() => setOpen(false)}>×</button>
        </div>
      )}
    </>
  );
}
