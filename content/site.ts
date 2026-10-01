/**
 * Struktur der Webseite: Hauptnavigation, Untermenüs, Fußzeile.
 * Die Slugs verweisen auf Dateien in content/pages/<slug>.md
 * (Unterseiten liegen in Unterordnern, z. B. content/pages/funktionen/dokumentation-ki.md).
 */
export type NavItem = { slug: string; label: string; description?: string };
export type NavSection = { slug: string; label: string; children?: NavItem[] };

export const site = {
  name: "ApproLogic",
  product: "Service Pacemaker",
  cta: { label: "Demo anfragen", href: "/kontakt/" },
  address: ["ApproLogic GmbH", "Ostparkstraße 11", "60314 Frankfurt am Main"],
  phone: "+49 69 90435820",
  email: "info@apprologic.de",
  url: "https://www.apprologic.de", // Adresse der Webseite ohne Schrägstrich am Ende; für Sitemap, robots.txt und Canonical-Links
  // Vorschaubild beim Teilen (LinkedIn, Teams, WhatsApp …), 1200 × 630, Vorlage in assets/vorschau.svg
  shareImage: { src: "/vorschau.png", alt: "Service Pacemaker – die After-Sales-Plattform für den Maschinenbau" },
  logoPng: "/logo-512.png", // für die strukturierten Daten (Google)
  foundingYear: "2006",
  // Beschreibung des Produkts für die strukturierten Daten (Google)
  productDescription: "After-Sales-Plattform und Kundenportal für den Maschinenbau: Dokumentation mit KI-Assistent, Serviceanfragen mit Ticketsystem, Wartung, Ersatzteile, IoT-Integration und Reporting rund um jede installierte Maschine.",
};

// Fehlerseite (404), wenn eine Adresse nicht existiert
export const notFoundPage = {
  title: "Diese Seite gibt es nicht.",
  lead: "Vielleicht hat sich die Adresse geändert, oder der Link ist veraltet. Hier geht es weiter:",
  links: [
    { href: "/", label: "Zur Startseite" },
    { href: "/funktionen/", label: "Alle Funktionen" },
    { href: "/kontakt/", label: "Kontakt und Demo" },
  ],
};

export const navigation: NavSection[] = [
  { slug: "produkt", label: "Produkt" },
  {
    slug: "funktionen",
    label: "Funktionen",
    children: [
      { slug: "funktionen/onboarding", label: "Onboarding und Registrierung", description: "Einladung, Aktivierung, Kollegen einladen" },
      { slug: "funktionen/installierte-basis", label: "Installierte Basis (Maschinenliste)", description: "Maschinenliste, Registrierung, digitale Akte" },
      { slug: "funktionen/dokumentation-ki", label: "Dokumentation und KI-Assistent", description: "Handbücher je Maschine, KI-Assistent mit Quellen" },
      { slug: "funktionen/suche", label: "Globale Suche über alle Daten", description: "Volltext, unscharfe Suche und KI in einem Feld" },
      { slug: "funktionen/serviceanfragen", label: "Serviceanfragen und Kommunikation", description: "Assistent, Routing, Chat am Vorgang" },
      { slug: "funktionen/wartung", label: "Wartung und Checklisten", description: "Fällige Wartungen, Nachweis ins ERP" },
      { slug: "funktionen/ersatzteile", label: "Ersatzteile und Warenkorb", description: "Explosionszeichnung, Webshop-Übergabe" },
      { slug: "funktionen/iot-integration", label: "IoT-Integration", description: "Maschinenstatus aus Ihrer IoT-Plattform" },
      { slug: "funktionen/reporting", label: "Reporting", description: "Kennzahlen und Dashboards für die Serviceleitung" },
      { slug: "funktionen/individualentwicklung", label: "Individualentwicklung", description: "Plantafel, Bluetooth und mehr" },
    ],
  },
  {
    slug: "fuer-wen",
    label: "Für wen",
    children: [
      { slug: "fuer-wen/hersteller", label: "Für Hersteller", description: "Ihr Service wird zur Plattform" },
      { slug: "fuer-wen/haendler-servicepartner", label: "Für Händler und Servicepartner", description: "Ihr Partnernetz im selben Portal" },
      { slug: "fuer-wen/endkunden", label: "Für Endkunden", description: "Self-Service für Ihre Kunden" },
    ],
  },
  {
    slug: "integration",
    label: "Integration und Betrieb",
    children: [
      { slug: "integration/schnittstellen", label: "Schnittstellen", description: "SAP, ERP, Webshop, Teilekatalog" },
      { slug: "integration/betrieb-sicherheit", label: "Betrieb, Sicherheit und Managed Services", description: "Deutsche Rechenzentren, Updates, Support" },
    ],
  },
  {
    slug: "unternehmen",
    label: "Unternehmen",
    children: [
      { slug: "unternehmen/ueber-uns", label: "Über ApproLogic" },
      { slug: "kontakt", label: "Kontakt" },
    ],
  },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  { title: "Produkt", links: [{ slug: "produkt", label: "So funktioniert es" }, { slug: "funktionen", label: "Funktionen" }, { slug: "fuer-wen", label: "Für wen" }] },
  { title: "Funktionen", links: navigation[1].children! },
  { title: "Integration", links: navigation[3].children! },
  { title: "Unternehmen", links: [{ slug: "unternehmen/ueber-uns", label: "Über ApproLogic" }, { slug: "kontakt", label: "Kontakt" }] },
  { title: "Rechtliches", links: [{ slug: "impressum", label: "Impressum" }, { slug: "datenschutz", label: "Datenschutzerklärung" }] },
];
