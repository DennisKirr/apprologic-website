"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Kontaktformular. Sendet an den Mail-Dienst in server/kontaktformular.mjs,
 * der auf dem Server unter /api/kontakt läuft und über Mailgun verschickt.
 * Für lokale Tests lässt sich der Endpunkt mit NEXT_PUBLIC_CONTACT_ENDPOINT überschreiben.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/kontakt";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        // t = Ausfüllzeit in Millisekunden, im Browser gemessen (unabhängig von falsch gehenden Uhren)
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), t: Date.now() - startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState("done");
        form.reset();
      } else {
        setError(typeof data.error === "string" ? data.error : "");
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <form className="demo" onSubmit={onSubmit}>
      <div><label htmlFor="f-name">Name</label><input id="f-name" name="name" type="text" autoComplete="name" required /></div>
      <div><label htmlFor="f-firma">Unternehmen</label><input id="f-firma" name="unternehmen" type="text" autoComplete="organization" /></div>
      <div><label htmlFor="f-mail">E-Mail</label><input id="f-mail" name="email" type="email" autoComplete="email" required /></div>
      <div><label htmlFor="f-tel">Telefon (optional)</label><input id="f-tel" name="telefon" type="tel" autoComplete="tel" /></div>
      <div>
        <label htmlFor="f-art">Ich interessiere mich für</label>
        <select id="f-art" name="anliegen">
          <option>Demo des Service Pacemaker</option>
          <option>Workshop zu unseren Anforderungen</option>
          <option>Allgemeine Frage</option>
        </select>
      </div>
      <div><label htmlFor="f-msg">Nachricht</label><textarea id="f-msg" name="nachricht" rows={4} maxLength={5000} /></div>
      {/* Fallenfeld gegen Spam-Bots: für Menschen unsichtbar, muss leer bleiben */}
      <div className="hp" aria-hidden="true"><label htmlFor="f-web">Website</label><input id="f-web" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
      <div><button className="btn primary" type="submit" disabled={state === "sending"}>{state === "sending" ? "Wird gesendet …" : "Anfrage senden"}</button></div>
      {state === "done" && <div className="ok" role="status">Vielen Dank. Wir melden uns innerhalb eines Werktags bei Ihnen.</div>}
      {state === "error" && <div className="ok error" role="alert">{error || "Das hat nicht geklappt."} Sie erreichen uns auch direkt unter info@apprologic.de.</div>}
    </form>
  );
}
