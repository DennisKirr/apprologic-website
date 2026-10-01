import type { Metadata } from "next";
import { Open_Sans, Work_Sans } from "next/font/google";
import "./globals.css";
import { site } from "../content/site";

// Schriften wie auf apprologic.de: Work Sans für Überschriften, Open Sans für Fließtext.
// next/font lädt sie beim Build herunter und liefert sie selbst aus (keine Google-Anfrage im Browser).
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-head", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Titel der Startseite (höchstens ca. 60 Zeichen, damit Google ihn nicht abschneidet)
export const siteTitle = "Service Pacemaker: After-Sales-Plattform für Maschinenbauer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: siteTitle, template: "%s | ApproLogic" },
  description: "Service Pacemaker: After-Sales-Plattform und Kundenportal für den Maschinenbau. Dokumentation mit KI, Serviceanfragen, Wartung und Ersatzteile.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${workSans.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
