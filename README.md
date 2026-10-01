# apprologic.de – Webseite

Next.js-Projekt für die neue ApproLogic-Webseite. Alle Texte liegen als Markdown-Dateien in `content/pages`, die Seitenstruktur in `content/site.ts`. Der Build erzeugt statische HTML-Dateien, die auf jedem Webserver laufen.

## Texte ändern

| Was | Wo |
| --- | --- |
| Text einer Seite | `content/pages/<pfad>.md` – Dateipfad = URL, z. B. `content/pages/funktionen/wartung.md` → `/funktionen/wartung/` |
| Startseite | `content/pages/index.md` |
| Titel, Einleitung, Brotkrumen, Vor/Zurück | Frontmatter oben in der jeweiligen `.md`-Datei |
| Hauptnavigation, Untermenüs, Fußzeile | `content/site.ts` |
| Adresse, Telefon, E-Mail, CTA-Beschriftung | `content/site.ts` (`site`) |

### Frontmatter einer Seite

```yaml
---
title: "Überschrift der Seite (H1 und Browser-Titel)"
eyebrow: "Kleine Zeile über der Überschrift"       # optional
lead: "Einleitungstext unter der Überschrift"       # optional, dient auch als Meta-Beschreibung
description: "Eigene Meta-Beschreibung"             # optional
section: "funktionen"                                # markiert den aktiven Hauptmenüpunkt
heroImage: { src: "/bilder/ki-assistent.svg", alt: "Bildbeschreibung" }   # optional: Bild rechts neben der Überschrift
breadcrumbs: [{ label: "Funktionen", href: "/funktionen/" }, { label: "Wartung", href: "" }]
prev: { label: "Serviceanfragen", href: "/funktionen/serviceanfragen/" }   # optional
next: { label: "Ersatzteile", href: "/funktionen/ersatzteile/" }           # optional
---
```

### Eigene Blöcke im Markdown

Neben normalem Markdown (Überschriften `##`, Listen, Tabellen, Links) gibt es fünf Blöcke als Code-Fences:

````markdown
```tiles
Titel der ersten Kachel
Text der Kachel, beliebig lang.
-> /funktionen/ Linktext           (optional: macht die Kachel klickbar)

Titel der zweiten Kachel
Text.
```

```numbers
−20 % | Erläuterung zur Zahl
−30 % | Erläuterung zur Zahl
```

```cta
Überschrift des Abschlussblocks
Optionaler Text.
-> /kontakt/ Demo anfragen          (erster Link = primärer Button)
-> /funktionen/ Funktionen ansehen
```

```image
/bilder/datei.svg                  (optional: Pfad zu einer Datei in public/, dahinter optional "logos" für eine Logoleiste)
Beschreibung des Bildes             (Alt-Text; ohne Pfad erscheint ein Platzhalter)
```

```form
```
````

## Entwickeln und bauen

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statischer Export nach ./out
```

Der Inhalt von `out/` wird auf den Webserver kopiert. Interne Links enden mit `/` (`trailingSlash`), damit die Ordnerstruktur ohne Rewrites funktioniert.

## Noch offen

- Kontaktformular: Mail-Dienst auf dem Hetzner-Server einrichten (Mailgun, siehe [server/README.md](server/README.md)).
- Datenschutzerklärung rechtlich prüfen lassen. Sie geht davon aus, dass die Server-Logfiles nach 7 Tagen gelöscht werden und das Kontaktformular über den eigenen Server und Mailgun (EU-Region, mit Auftragsverarbeitungsvertrag) zugestellt wird.
- Bilder und Screenshots einbauen (Datei nach `public/bilder/`, Pfad als erste Zeile im `image`-Block). Die Startseite hat bereits zwei Illustrationen.
- Design: Farben, Schriften und Logo nach apprologic.de in `app/globals.css`; die Bild-Platzhalter werden durch echte Bilder ersetzt.
- Englische Version: zweiter Inhaltsbaum, z. B. `content/pages/en/…`, plus Sprachumschalter.
