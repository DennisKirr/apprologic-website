---
title: "Ihre Systeme bleiben führend. Das Portal bringt ihre Daten zu Kunden, Händlern und Technikern."
seoTitle: "Schnittstellen zu SAP, ERP und Webshop"
description: "Schnittstellen des Service Pacemaker: SAP und andere ERP-Systeme, Teilekatalog, Webshop, Dateiablage, Ticketsystem, IoT-Plattform und Identity Provider."
eyebrow: "Schnittstellen"
lead: "Ihr ERP-System, Ihren Teilekatalog und Ihren Webshop müssen Sie nicht ersetzen. Der Service Pacemaker holt sich, was an der Maschine gebraucht wird, und meldet zurück, was im Feld passiert – automatisch und nachvollziehbar."
section: "integration"
breadcrumbs: [{ label: "Integration und Betrieb", href: "/integration/" }, { label: "Schnittstellen", href: "" }]
---

## Ein Portal zwischen Ihren Systemen und Ihren Anwendern

Stammdaten bleiben dort, wo sie heute gepflegt werden. Der Service Pacemaker verbindet diese Systeme mit allen, die im Service arbeiten: Kunden, Händlern, Technikern und Ihrem Serviceteam, im Browser oder in der App.

```image
/bilder/schnittstellen.svg
Schnittstellen des Service Pacemaker: Links Ihre Systeme – ERP-Systeme wie SAP oder Microsoft Dynamics 365, Teilekatalog, Webshop, Dateiablage und Redaktionssystem, Ticketsystem und CRM, IoT-Plattform, Identity Provider. In der Mitte der Service Pacemaker mit RESTful API, Berechtigungen und Business Rules. Rechts die Anwender in Web und App: Kunden, Händler und Servicepartner, Techniker und Serviceteam.
```

## Datenflüsse im Überblick

```tiles
ERP-System
Angebunden werden ganz unterschiedliche ERP-Systeme, zum Beispiel SAP oder Microsoft Dynamics 365. Installierte Basis mit Equipments, Kunden und Standorten sowie Wartungspläne kommen aus dem ERP. Zurück fließen Serviceanfragen, quittierte Wartungen mit Messwerten und Bedarfsanforderungen, jeweils mit Statusrückmeldung.
-> /funktionen/installierte-basis/ Installierte Basis

Teilekatalog
Teilelisten, Explosionszeichnungen und Verwendungsnachweise werden regelmäßig aus Ihrem führenden System importiert, zum Beispiel aus Quanos PartsPublisher.
-> /funktionen/ersatzteile/ Ersatzteile

Webshop
Der Warenkorb geht per API, Punchout oder Warenkorb-URL an Ihren Shop. Der Kunde wird dort erkannt, Preise und Verfügbarkeit bleiben im Shop.
-> /funktionen/ersatzteile/ Ersatzteile

Dateiablage und Redaktionssystem
Dokumente kommen automatisiert und wiederkehrend ins Portal, mit Zuordnung zu Maschine, Sprache und Version. Zurück fließt das Feedback der Anwender zu einzelnen Dokumenten.
-> /funktionen/dokumentation-ki/ Dokumentation und KI

Ticketsystem und CRM
Auf Wunsch übergibt das Portal Anfragen an Ihr bestehendes System, Status und Antworten kommen zurück. Kunde und Techniker arbeiten weiter im Portal.
-> /funktionen/serviceanfragen/ Serviceanfragen

IoT-Plattform
Status, Fehlercodes und Ereignisse aus Ihrer bestehenden IoT-Plattform kommen über Adapter ins Portal und lösen bei Bedarf automatisch Serviceanfragen und Benachrichtigungen aus.
-> /funktionen/iot-integration/ IoT-Integration
```

## Abläufe automatisieren mit Business Rules

Regeln auf dem Server erledigen, was heute noch von Hand passiert. Zum Beispiel:

- eine Benachrichtigung, sobald sich der Status eines Vorgangs ändert,
- eine Eskalation, wenn eine Frist überschritten wird,
- eine Serviceanfrage, wenn die Maschine ein bestimmtes Ereignis meldet.

## Sicher angebunden, Schritt für Schritt

Kein Großprojekt nötig: Das Portal bindet an, was Sie haben, und wächst mit Ihren Anforderungen. Weitere Systeme kommen hinzu, wenn Sie so weit sind.

```tiles
Eine API, überall dieselben Rechte
Alle Schnittstellen laufen über die RESTful API des Servers, dieselbe, die auch Web und Apps nutzen. Das serverseitige Berechtigungskonzept prüft jeden Zugriff: Jedes System sieht nur, was es sehen darf.

Single Sign-on
Mitarbeiter und Partner melden sich über Ihren Identity Provider an und springen ohne erneute Anmeldung in angebundene Drittsysteme.

Im Betrieb überwacht
Die Überwachung Ihrer spezifischen Schnittstellen ist Teil unseres Managed Service.
-> /integration/betrieb-sicherheit/ Betrieb und Sicherheit
```

```cta
Sie möchten Ihre Systemlandschaft mit uns durchgehen?
-> /kontakt/ Gespräch vereinbaren
```
