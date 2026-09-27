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
};

export const navigation: NavSection[] = [
  { slug: "produkt", label: "Produkt" },
  {
    slug: "funktionen",
    label: "Funktionen",
    children: [
      { slug: "funktionen/maschinen-kunden", label: "Maschinen, Kunden und Berechtigungen", description: "Installierte Basis, Registrierung, Zugriffsrechte" },
      { slug: "funktionen/dokumentation-ki", label: "Dokumentation und KI-Wissensdatenbank", description: "Handbücher je Maschine, KI-Assistent mit Quellen" },
      { slug: "funktionen/serviceanfragen", label: "Serviceanfragen und Kommunikation", description: "Assistent, Routing, Chat am Vorgang" },
      { slug: "funktionen/wartung", label: "Wartung und Checklisten", description: "Fällige Wartungen, Nachweis ins ERP" },
      { slug: "funktionen/ersatzteile", label: "Ersatzteile und Warenkorb", description: "Explosionszeichnung, Webshop-Übergabe" },
      { slug: "funktionen/iot-reporting", label: "IoT, Betriebstagebuch und Reporting", description: "Maschinendaten, Historie, Kennzahlen" },
    ],
  },
  {
    slug: "fuer-wen",
    label: "Für wen",
    children: [
      { slug: "fuer-wen/hersteller", label: "Für Hersteller", description: "Ihr Service wird zur Plattform" },
      { slug: "fuer-wen/haendler-servicepartner", label: "Für Händler und Servicepartner", description: "Ein Werkzeug für alle betreuten Maschinen" },
      { slug: "fuer-wen/endkunden", label: "Für Endkunden", description: "Ihre Maschinen, Ihr Service, ein Login" },
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
