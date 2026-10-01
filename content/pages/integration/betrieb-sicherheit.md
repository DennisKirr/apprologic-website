---
title: "Wir betreiben das Portal für Sie: in deutschen Rechenzentren, mit Support und Updates."
description: "Betrieb, Sicherheit und Managed Services: deutsche Rechenzentren, drei Umgebungen, Updates, Support und DSGVO. ISO 9001 zertifiziert."
eyebrow: "Betrieb, Sicherheit und Managed Services"
lead: "ApproLogic stellt den Service Pacemaker als Application Service Provider bereit. Ihre Instanz läuft standardmäßig in einem deutschen Rechenzentrum."
section: "integration"
breadcrumbs: [{ label: "Integration und Betrieb", href: "/integration/" }, { label: "Betrieb, Sicherheit und Managed Services", href: "" }]
---

## Im Managed Service enthalten

- Drei Umgebungen: Entwicklung, Test/Abnahme, Produktion
- Support-Hotline und Entstörungsmanagement
- Proaktives Monitoring, Datensicherung, Recovery
- Regelmäßige Updates und zeitnahe Security-Patches für Betriebssystem, Datenbank und Anwendung
- Sicherstellung der DSGVO-Anforderungen
- Neue Funktionen aus der Produktentwicklung
- Überwachung Ihrer spezifischen Schnittstellen

## Die Technik dahinter

Der Service Pacemaker ist als Client-Server-Architektur mit offenen Komponenten aufgebaut.

```image
/bilder/architektur.svg
Architektur des Service Pacemaker: Client mit Gaia Web und Gaia Mobile auf dem Gaia Platform Layer (React, React Native), verbunden per HTTPS, REST und Websockets mit dem Server aus Infrastructure Layer (Proxy/TLS, Load Balancer, Firewall), Node.js-API-Server, CouchDB-Datenbank und Object Store in der Cloud.
```

- **Web und App:** Neben dem Zugriff per Browser stehen native Apps für iOS und Android zur Verfügung. Beide nutzen dieselbe Plattformschicht, die Veröffentlichung in den App-Stores ist inklusive.
- **Offene Schnittstelle:** Die API des Servers ist RESTful, Websockets sorgen für Aktualisierungen in Echtzeit. Davor liegen Proxy mit TLS-Terminierung, Load Balancer und Firewall.
- **Große Dateien:** Videos und Bilder werden nicht in der Datenbank, sondern in einem externen Object Store gespeichert, zum Beispiel AWS S3.
- **Berechtigungen:** Zugriffsrechte (ACLs) werden im Rahmen eines globalen Berechtigungskonzepts immer serverseitig geprüft und gelten damit auch für Schnittstellen. Das Konzept bildet auch komplexe Organisationsstrukturen ab.
- **Mandanten:** Das Portal ist mandantenfähig. So können zum Beispiel alle Mitarbeiter eines Kunden einen eigenen Mandanten bilden und gemeinsam auf ihre Daten zugreifen: Kollege A sieht auch die Maschinen, die Kollege B registriert hat.
- **Business Rules:** Auf dem Server lassen sich Regeln hinterlegen, etwa: Sende eine Benachrichtigung, wenn ein bestimmtes Ereignis eintritt.
- **International und in Ihrem Design:** 16 Sprachen mit automatischer Übersetzung, Oberfläche und Apps im Corporate Design des Herstellers.

## Nachweisbar

Zertifiziertes Qualitätsmanagement nach ISO 9001 (DEKRA). German Innovation Award 2020. Gefördert im Zentralen Innovationsprogramm Mittelstand.

```image
/bilder/auszeichnungen.png logos
Auszeichnungen und Zertifikate: Zentrales Innovationsprogramm Mittelstand (ZIM), Innovativ durch Forschung 2020/2021 (Stifterverband), German Innovation Award 2020, ISO 9001 zertifiziert durch DEKRA, gefördert durch das Bundesministerium für Wirtschaft und Energie
```

```cta
Fragen zu Betrieb, Sicherheit oder Datenschutz?
-> /kontakt/ Gespräch vereinbaren
```
