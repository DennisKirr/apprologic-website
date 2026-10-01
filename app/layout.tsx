import type { Metadata } from "next";
import { Open_Sans, Work_Sans } from "next/font/google";
import "./globals.css";
import { site } from "../content/site";

// Schriften wie auf apprologic.de: Work Sans für Überschriften, Open Sans für Fließtext.
// next/font lädt sie beim Build herunter und liefert sie selbst aus (keine Google-Anfrage im Browser).
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-head", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Service Pacemaker – After-Sales-Plattform für den Maschinenbau | ApproLogic", template: "%s | ApproLogic" },
  description: "Service Pacemaker: die After-Sales-Plattform für den Maschinenbau. Dokumentation, Serviceanfragen, Wartung und Ersatzteile rund um jede installierte Maschine – für Kunden, Händler und Ihr Serviceteam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${workSans.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
