import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Service Pacemaker – After-Sales-Portal für den Maschinenbau | ApproLogic", template: "%s | ApproLogic" },
  description: "Service Pacemaker: das After-Sales-Portal für den Maschinenbau. Dokumentation, Serviceanfragen, Wartung und Ersatzteile rund um jede installierte Maschine – für Kunden, Händler und Ihr Serviceteam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
