# Mail-Dienst für das Kontaktformular

Die Webseite ist statisch. Damit das Kontaktformular Mails versenden kann, läuft auf dem Server ein kleiner Node-Dienst ([kontaktformular.mjs](kontaktformular.mjs)). Er nimmt die Anfragen unter `/api/kontakt` entgegen, prüft sie und versendet sie über Mailgun an `info@apprologic.de`. Der Mailgun-Schlüssel bleibt dabei auf dem Server und ist im Browser nicht sichtbar.

- Keine Abhängigkeiten, benötigt Node.js 18 oder neuer
- Spamschutz ohne Captcha und ohne Cookies: unsichtbares Fallenfeld, Mindest-Ausfüllzeit von 3 Sekunden, höchstens 5 Anfragen je IP-Adresse in 10 Minuten
- Die Mail hat „Reply-To“ auf den Absender gesetzt: Antworten gehen direkt an den Anfragenden
- Formularinhalte werden nicht protokolliert

**Schritt für Schritt einrichten:** [CHECKLISTE-KONTAKTFORMULAR.md](CHECKLISTE-KONTAKTFORMULAR.md) (Mailgun, DNS, Server, Test und Fehlersuche).

## Voraussetzungen in Mailgun

1. Versand-Domain: Wir nutzen die bereits verifizierte Domain `service-pacemaker.com` (Region **EU**). Für eine neue Domain müssten die von Mailgun angezeigten DNS-Einträge (SPF, DKIM, MX) gesetzt werden, bis Mailgun sie als verifiziert anzeigt.
2. Unter *Sending → Domain settings → Sending API keys* einen eigenen **Sending Key** für diese Domain erzeugen. Er darf nur Mails versenden.
3. Den Vertrag zur Auftragsverarbeitung (DPA) mit Mailgun abschließen.

## Installation auf dem Server

```bash
# 1. Dienst kopieren
sudo mkdir -p /opt/apprologic-kontakt
sudo cp server/kontaktformular.mjs /opt/apprologic-kontakt/

# 2. Konfiguration anlegen und Schlüssel eintragen
sudo cp server/kontakt.env.example /etc/apprologic-kontakt.env
sudo chmod 600 /etc/apprologic-kontakt.env
sudo nano /etc/apprologic-kontakt.env        # MAILGUN_API_KEY eintragen, zum ersten Test MAILGUN_TEST_MODE=1

# 3. Dienst einrichten und starten
sudo cp server/apprologic-kontakt.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now apprologic-kontakt
sudo systemctl status apprologic-kontakt

# 4. nginx: Inhalt von server/nginx-kontakt.conf in den server-Block der Webseite einfügen
sudo nginx -t && sudo systemctl reload nginx
```

Test: Formular auf `https://www.apprologic.de/kontakt/` absenden. Mit `MAILGUN_TEST_MODE=1` erscheint die Mail im Mailgun-Log als angenommen, wird aber nicht zugestellt. Danach auf `0` setzen und `sudo systemctl restart apprologic-kontakt`.

Logs: `sudo journalctl -u apprologic-kontakt -f`

## Lokal testen

```bash
# Dienst ohne Mailgun-Aufruf starten
DRY_RUN=1 MAILGUN_DOMAIN=service-pacemaker.com ALLOWED_ORIGINS=http://localhost:3000 node server/kontaktformular.mjs

# Webseite so starten, dass das Formular an den lokalen Dienst sendet
NEXT_PUBLIC_CONTACT_ENDPOINT=http://127.0.0.1:3001/api/kontakt npm.cmd run dev
```
