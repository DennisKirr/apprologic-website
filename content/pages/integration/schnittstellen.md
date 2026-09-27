---
title: "Das Portal ersetzt Ihre Systeme nicht. Es macht sie für Kunden und Techniker nutzbar."
eyebrow: "Schnittstellen"
lead: "Stammdaten, Aufträge und Preise bleiben, wo sie sind. Der Service Pacemaker holt sich, was er braucht, und meldet zurück, was im Feld passiert. Alle Schnittstellen laufen über eine RESTful API; das Berechtigungskonzept gilt auch dort."
section: "integration"
breadcrumbs: [{ label: "Integration und Betrieb", href: "/integration/" }, { label: "Schnittstellen", href: "" }]
prev: { label: "Integration und Betrieb", href: "/integration/" }
next: { label: "Betrieb und Sicherheit", href: "/integration/betrieb-sicherheit/" }
---

## Systeme und Datenflüsse

| Ihr System | Was der Service Pacemaker übernimmt | Was zurückfließt |
| --- | --- | --- |
| SAP / ERP | Installierte Basis (Equipments), Kunden, Standorte, Wartungspläne | Serviceanfragen, quittierte Wartungen mit Messwerten, Bedarfsanforderungen; bidirektional mit Statusrückmeldung |
| Teilekatalog (z. B. Quanos PartsPublisher) | Teilelisten, Explosionszeichnungen, Verwendungsnachweise | regelmäßiger Import |
| Webshop | Kundenzuordnung, Preise, Verfügbarkeiten bleiben im Shop | Warenkorb per API, Punchout oder Warenkorb-URL |
| Dateiablage / Redaktionssystem | Dokumente inklusive Zuordnung zu Maschine, Sprache, Version; automatisiert und wiederkehrend | Feedback der Anwender zu einzelnen Dokumenten |
| Ticketsystem / CRM | Optional: Anfragen werden an Ihr bestehendes System übergeben | Status und Antworten zurück ins Portal |
| IoT-Plattform / Maschinensteuerung | Zustandsdaten, Fehlercodes, Ereignisse über Adapter | Automatisch erzeugte Serviceanfragen und Benachrichtigungen |
| Identity Provider | Single Sign-on für Mitarbeiter und Partner, Absprung in Drittsysteme per SSO | |

Business Rules auf dem Server automatisieren, was heute manuell passiert: Benachrichtigung bei Statuswechsel, Eskalation bei Überschreitung, Serviceanfrage bei Maschinenereignis.

```image
Architekturgrafik: Anwender (App, Web) – Service Hub – Backendsysteme
```

```cta
Sie möchten Ihre Systemlandschaft mit uns durchgehen?
-> /kontakt/ Gespräch vereinbaren
```
