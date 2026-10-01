# Checkliste: Kontaktformular mit Mailgun in Betrieb nehmen

Diese Checkliste führt einmal vollständig durch die Inbetriebnahme. Hintergrund und Aufbau des Dienstes stehen in [README.md](README.md).

**So funktioniert es:** Das Formular auf `/kontakt/` sendet per `POST /api/kontakt` an nginx. nginx leitet an den Node-Dienst [kontaktformular.mjs](kontaktformular.mjs) auf `127.0.0.1:3001` weiter. Der Dienst prüft die Eingaben und versendet über die Mailgun-API (Region EU) an `info@apprologic.de`.

Feste Werte in dieser Anleitung:

| Was | Wert |
| --- | --- |
| Versand-Domain | `service-pacemaker.com` (in Mailgun bereits vorhanden und verifiziert) |
| Mailgun-Region | EU (`https://api.eu.mailgun.net`) |
| Absender | `kontaktformular@service-pacemaker.com` |
| Empfänger | `info@apprologic.de` |
| Konfiguration auf dem Server | `/etc/apprologic-kontakt.env` |
| Dienst | `apprologic-kontakt` (systemd) |

> **Sicherheit:** Der Mailgun-Schlüssel steht **nur** in `/etc/apprologic-kontakt.env` auf dem Server. Er darf in keine Datei im Repository, auch nicht in Kommentare oder README-Dateien. GitHub blockiert solche Pushes.

---

## 1. Mailgun

Das Konto ist ein bezahltes Konto in der Region EU, die Domain `service-pacemaker.com` ist dort bereits eingerichtet und verifiziert. Die Domain wird auch für andere Mails genutzt. Ihre Einstellungen (Tracking, DNS) bleiben deshalb unverändert. Der Dienst schaltet das Tracking für die Formularmails selbst ab (`o:tracking=no`) und versieht sie mit dem Tag `kontaktformular`.


## 2. DNS

- [x] Nichts zu tun: `service-pacemaker.com` ist bereits verifiziert. *(erledigt)*

SPF und DKIM passen, weil der Absender auf derselben Domain liegt.

Nur falls Mailgun bei der Domain einen DNS-Eintrag als fehlerhaft anzeigt, diesen beim Domain-Anbieter korrigieren und *Verify DNS settings* klicken.

## 3. Server (Hetzner)

### 3.1 Node.js

```bash
node -v          # muss v18 oder höher sein
which node       # muss /usr/bin/node sein
```

- [ ] Node 18 oder höher installiert
- [ ] Liegt Node **nicht** unter `/usr/bin/node` (z. B. bei Installation über nvm): den Pfad in `server/apprologic-kontakt.service` bei `ExecStart=` anpassen. nvm-Installationen im Home-Verzeichnis funktionieren wegen `ProtectHome=yes` nicht. Dann Node systemweit installieren, etwa über NodeSource.

### 3.2 Dienst installieren

Im ausgecheckten Repository auf dem Server:

```bash
# Dienst kopieren
sudo mkdir -p /opt/apprologic-kontakt
sudo cp server/kontaktformular.mjs /opt/apprologic-kontakt/

# Konfiguration anlegen (nur root darf lesen)
sudo cp server/kontakt.env.example /etc/apprologic-kontakt.env
sudo chmod 600 /etc/apprologic-kontakt.env
sudo nano /etc/apprologic-kontakt.env
```

In `/etc/apprologic-kontakt.env` setzen:

- [ ] `MAILGUN_API_KEY=` den Sending Key aus Schritt 1
- [ ] `MAILGUN_DOMAIN=service-pacemaker.com`
- [ ] `MAILGUN_REGION=eu`
- [ ] `ALLOWED_ORIGINS=` **genau** die Adressen, unter denen die Webseite aufgerufen wird, mit `https://`, ohne Schrägstrich am Ende, kommagetrennt. Voreingestellt: `https://www.apprologic.de,https://apprologic.de`. Andere Herkünfte lehnt der Dienst mit `403` ab.
- [ ] Für den ersten Test: `MAILGUN_TEST_MODE=1`

```bash
# systemd-Dienst einrichten und starten
sudo cp server/apprologic-kontakt.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now apprologic-kontakt
sudo systemctl status apprologic-kontakt     # muss "active (running)" zeigen
```

Im Log steht beim Start eine Zeile wie `Kontaktformular-Dienst auf http://127.0.0.1:3001/api/kontakt (Mailgun https://api.eu.mailgun.net, an info@apprologic.de)`.

### 3.3 nginx

- [ ] Den Inhalt von [nginx-kontakt.conf](nginx-kontakt.conf) in den `server { … }`-Block der Webseite einfügen, und zwar in den Block für Port 443 (HTTPS).
- [ ] **Bestehende Weiterleitungen prüfen.** Die Webseite nutzt Adressen mit Schrägstrich am Ende. Gibt es im Server-Block eine Regel, die Adressen ohne Schrägstrich per `rewrite` oder `return 301` umleitet, muss sie **vor** den `location`-Blöcken greifen dürfen, ohne `/api/kontakt` zu erfassen. Ein umgeleiteter POST kommt als GET an und geht verloren. Am sichersten steht die Weiterleitung selbst in einer `location`, dann hat `location = /api/kontakt` (exakter Treffer) automatisch Vorrang.
- [ ] Laufen `www.apprologic.de` und `apprologic.de` in getrennten Server-Blöcken, gehört der Block in jeden davon. Alternativ leitet die eine Adresse vollständig auf die andere weiter.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Kurztest vom Server aus, die Antwort muss `{"ok":false,"error":"Bitte geben Sie Ihren Namen an."}` sein:

```bash
curl -s -X POST https://www.apprologic.de/api/kontakt \
  -H "Origin: https://www.apprologic.de" -H "Content-Type: application/json" \
  -d '{"t":10000,"email":"test@example.com"}'
```

### 3.4 Webseite aktualisieren

Das Formular misst die Ausfüllzeit seit Oktober 2026 im Browser. Der Dienst erwartet diese neue Logik. **Webseite und Dienst müssen deshalb denselben Stand haben.**

```bash
npm install
npm run build        # erzeugt ./out
# Inhalt von ./out auf den Webserver kopieren (wie bisher)
```

- [ ] Webseite mit aktuellem Stand aus dem Branch `development` gebaut und hochgeladen
- [ ] `kontaktformular.mjs` aus demselben Stand nach `/opt/apprologic-kontakt/` kopiert und Dienst neu gestartet

## 4. Testen

1. [ ] **Testmodus** (`MAILGUN_TEST_MODE=1`): Formular auf `https://www.apprologic.de/kontakt/` mit echten Testdaten absenden und **mindestens 3 Sekunden** warten, sonst gilt die Anfrage als Bot. Erwartet: Meldung „Vielen Dank …“ auf der Seite, in Mailgun unter *Send → Logs* ein Eintrag **Accepted**. Zugestellt wird im Testmodus nichts.
2. [ ] **Echtbetrieb:** In `/etc/apprologic-kontakt.env` `MAILGUN_TEST_MODE=0` setzen, dann `sudo systemctl restart apprologic-kontakt`. Formular erneut absenden.
3. [ ] Mail kommt in `info@apprologic.de` an. Bei den ersten Mails auch den **Spam- oder Junk-Ordner** prüfen und den Absender `kontaktformular@service-pacemaker.com` im Mailsystem gegebenenfalls als vertrauenswürdig eintragen.
4. [ ] Auf die Mail **antworten**: Die Antwort muss an die E-Mail-Adresse gehen, die im Formular eingegeben wurde (Reply-To).
5. [ ] In Mailgun steht der Eintrag auf **Delivered**. Filter im Log: Tag `kontaktformular`.

## 5. Fehlersuche

Log des Dienstes live mitlesen, Formularinhalte werden darin bewusst nicht protokolliert:

```bash
sudo journalctl -u apprologic-kontakt -f
```

| Symptom | Ursache und Lösung |
| --- | --- |
| Dienst startet nicht, Log: `MAILGUN_DOMAIN und MAILGUN_API_KEY müssen gesetzt sein` | `/etc/apprologic-kontakt.env` fehlt oder ist unvollständig |
| Log: `Mailgun 403` mit Hinweis auf Sandbox oder Authorized Recipients | Falsche Domain eingetragen (z. B. eine Sandbox-Domain), `MAILGUN_DOMAIN=service-pacemaker.com` prüfen |
| `status=203/EXEC` beim Start | Node liegt nicht unter `/usr/bin/node`, siehe 3.1 |
| Browser zeigt „Das hat nicht geklappt“, Log: `Mailgun 401` | Schlüssel falsch oder gelöscht, neuen Sending Key eintragen |
| Log: `Mailgun 404 … Domain not found` | Region passt nicht zur Domain (`MAILGUN_REGION`) oder Tippfehler in `MAILGUN_DOMAIN` |
| Log: `Mailgun 403` ohne Sandbox-Hinweis | IP-Freigabeliste aktiv, Server-IP fehlt |
| Browser-Konsole: Fehler `403` auf `/api/kontakt` | Aufgerufene Adresse fehlt in `ALLOWED_ORIGINS` |
| Browser-Konsole: `404` oder `405` auf `/api/kontakt` | nginx-Block fehlt, steht im falschen Server-Block, oder eine Weiterleitung greift vorher, siehe 3.3 |
| Browser-Konsole: `502 Bad Gateway` | Dienst läuft nicht: `systemctl status apprologic-kontakt` |
| Browser zeigt „Vielen Dank“, aber keine Mail und kein Mailgun-Log | Anfrage wurde als Spam verworfen: in weniger als 3 Sekunden abgeschickt, oder Webseite und Dienst haben unterschiedliche Stände (siehe 3.4) |
| „Zu viele Anfragen“ | Schutz greift: höchstens 5 Anfragen je IP in 10 Minuten. Warten oder Dienst neu starten |
| Mailgun „Delivered“, aber nichts im Postfach | Spam- oder Junk-Ordner und Quarantäne des Mailsystems prüfen |

## Fertig, wenn

- [ ] Eine echte Testanfrage ist in `info@apprologic.de` angekommen.
- [ ] Die Antwort auf die Mail geht an den Anfragenden.
- [ ] `MAILGUN_TEST_MODE=0` ist gesetzt.
- [ ] Der Mailgun-Schlüssel steht ausschließlich in `/etc/apprologic-kontakt.env`.
