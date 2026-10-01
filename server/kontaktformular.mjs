/**
 * Mail-Dienst für das Kontaktformular.
 *
 * Kleiner HTTP-Dienst ohne Abhängigkeiten (Node 18+). Er nimmt POST /api/kontakt entgegen,
 * prüft die Eingaben und versendet die Anfrage über die Mailgun-API an MAIL_TO.
 * Läuft auf dem Server hinter nginx (siehe server/README.md) und hört nur auf 127.0.0.1.
 *
 * Konfiguration über Umgebungsvariablen (auf dem Server in /etc/apprologic-kontakt.env):
 *   MAILGUN_API_KEY    Sending Key aus Mailgun (Pflicht, außer bei DRY_RUN=1)
 *   MAILGUN_DOMAIN     Versand-Domain in Mailgun, z. B. service-pacemaker.com (Pflicht)
 *   MAILGUN_REGION     "eu" (Standard) oder "us"
 *   MAIL_TO            Empfänger, Standard info@apprologic.de
 *   MAIL_FROM          Absender, Standard "ApproLogic Kontaktformular <kontaktformular@MAILGUN_DOMAIN>"
 *   ALLOWED_ORIGINS    Erlaubte Herkunft(en), kommagetrennt, Standard https://www.apprologic.de,https://apprologic.de
 *   PORT / HOST        Standard 3001 / 127.0.0.1
 *   MAILGUN_TEST_MODE  "1": Mailgun nimmt die Mail an, stellt sie aber nicht zu
 *   DRY_RUN            "1": kein Aufruf von Mailgun, nur Ausgabe im Log (für lokale Tests)
 */
import http from "node:http";

const env = process.env;
const DRY_RUN = env.DRY_RUN === "1";
const API_KEY = env.MAILGUN_API_KEY ?? "";
const DOMAIN = env.MAILGUN_DOMAIN ?? "";
// MAILGUN_API_BASE nur für Tests (z. B. gegen einen lokalen Mock), sonst aus der Region abgeleitet
const API_BASE = env.MAILGUN_API_BASE ?? (env.MAILGUN_REGION === "us" ? "https://api.mailgun.net" : "https://api.eu.mailgun.net");
const MAIL_TO = env.MAIL_TO ?? "info@apprologic.de";
const MAIL_FROM = env.MAIL_FROM ?? `ApproLogic Kontaktformular <kontaktformular@${DOMAIN}>`;
const ALLOWED_ORIGINS = (env.ALLOWED_ORIGINS ?? "https://www.apprologic.de,https://apprologic.de").split(",").map((s) => s.trim()).filter(Boolean);
const PORT = Number(env.PORT ?? 3001);
const HOST = env.HOST ?? "127.0.0.1";

if (!DOMAIN || (!API_KEY && !DRY_RUN)) {
  console.error("MAILGUN_DOMAIN und MAILGUN_API_KEY müssen gesetzt sein (oder DRY_RUN=1).");
  process.exit(1);
}

// Spamschutz
const MIN_FILL_MS = 3000;              // schneller ausgefüllt = vermutlich ein Bot
const MAX_FORM_AGE_MS = 24 * 3600e3;   // Formular älter als ein Tag = abgelehnt
const RATE_WINDOW_MS = 10 * 60e3;      // höchstens RATE_MAX Anfragen je IP in 10 Minuten
const RATE_MAX = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10000) hits.clear(); // Speicher begrenzen
  return recent.length > RATE_MAX;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const oneLine = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim();
const text = (v) => String(v ?? "").replace(/\r\n?/g, "\n").trim();

/** Prüft die Formulardaten. Gibt { data } oder { error } zurück. */
function validate(body) {
  if (oneLine(body.website)) return { spam: true }; // Fallenfeld, für Menschen unsichtbar
  // t = Ausfüllzeit in ms, vom Browser gemessen. Kein Vergleich mit der Serveruhr,
  // sonst gingen Anfragen von Rechnern mit falsch gehender Uhr still verloren.
  const age = Number(body.t);
  if (!Number.isFinite(age) || age < MIN_FILL_MS || age > MAX_FORM_AGE_MS) return { spam: true };

  const data = {
    name: oneLine(body.name),
    unternehmen: oneLine(body.unternehmen),
    email: oneLine(body.email),
    telefon: oneLine(body.telefon),
    anliegen: oneLine(body.anliegen),
    nachricht: text(body.nachricht),
  };
  const limits = { name: 200, unternehmen: 200, email: 200, telefon: 50, anliegen: 100, nachricht: 5000 };
  for (const [key, max] of Object.entries(limits)) {
    if (data[key].length > max) return { error: `Feld „${key}“ ist zu lang.` };
  }
  if (!data.name) return { error: "Bitte geben Sie Ihren Namen an." };
  if (!EMAIL.test(data.email)) return { error: "Bitte geben Sie eine gültige E-Mail-Adresse an." };
  return { data };
}

async function sendMail(d) {
  const lines = [
    `Name:          ${d.name}`,
    `Unternehmen:   ${d.unternehmen || "–"}`,
    `E-Mail:        ${d.email}`,
    `Telefon:       ${d.telefon || "–"}`,
    `Anliegen:      ${d.anliegen || "–"}`,
    "",
    "Nachricht:",
    d.nachricht || "–",
    "",
    "—",
    "Gesendet über das Kontaktformular auf apprologic.de. Antworten gehen direkt an den Absender.",
  ];
  const form = new URLSearchParams({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: `Kontaktanfrage: ${d.anliegen || "Allgemein"} – ${d.name}${d.unternehmen ? ` (${d.unternehmen})` : ""}`,
    text: lines.join("\n"),
    "h:Reply-To": `"${d.name.replace(/["\\<>]/g, "")}" <${d.email}>`,
  });
  // Kein Öffnungs- oder Klick-Tracking für Formularmails, unabhängig von der Einstellung der Domain
  form.set("o:tracking", "no");
  // Tag zum Filtern im Mailgun-Log (die Domain wird auch für andere Mails genutzt)
  form.set("o:tag", "kontaktformular");
  if (env.MAILGUN_TEST_MODE === "1") form.set("o:testmode", "yes");

  if (DRY_RUN) {
    console.log("[DRY_RUN] Mail an %s: %s", MAIL_TO, form.get("subject"));
    return;
  }
  const res = await fetch(`${API_BASE}/v3/${DOMAIN}/messages`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`api:${API_KEY}`).toString("base64") },
    body: form,
  });
  if (!res.ok) throw new Error(`Mailgun ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

function reply(res, status, body, origin) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Vary"] = "Origin";
  }
  res.writeHead(status, headers);
  res.end(body === null ? undefined : JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  const path = (req.url ?? "").split("?")[0].replace(/\/$/, "");
  if (path !== "/api/kontakt") return reply(res, 404, { ok: false }, origin);
  if (req.method === "OPTIONS") return reply(res, 204, null, origin);
  if (req.method !== "POST") return reply(res, 405, { ok: false }, origin);
  // Browser senden immer einen Origin-Header mit; fremde Seiten dürfen das Formular nicht nutzen
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return reply(res, 403, { ok: false }, origin);

  let raw = "";
  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 20000) { reply(res, 413, { ok: false }, origin); req.destroy(); }
  });
  req.on("end", async () => {
    if (res.writableEnded) return;
    const ip = req.headers["x-real-ip"] ?? req.socket.remoteAddress ?? "";
    if (rateLimited(String(ip))) return reply(res, 429, { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." }, origin);

    let body;
    try { body = JSON.parse(raw); } catch { return reply(res, 400, { ok: false }, origin); }
    const result = validate(body ?? {});
    // Spam still verwerfen, aber wie einen Erfolg beantworten, damit Bots nichts lernen
    if (result.spam) return reply(res, 200, { ok: true }, origin);
    if (result.error) return reply(res, 400, { ok: false, error: result.error }, origin);

    try {
      await sendMail(result.data);
      reply(res, 200, { ok: true }, origin);
    } catch (err) {
      console.error("Versand fehlgeschlagen:", err.message); // keine Formularinhalte ins Log
      reply(res, 502, { ok: false }, origin);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Kontaktformular-Dienst auf http://${HOST}:${PORT}/api/kontakt (Mailgun ${DRY_RUN ? "DRY_RUN" : API_BASE}, an ${MAIL_TO})`);
});
