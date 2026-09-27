"use client";
import { useState } from "react";

/**
 * Kontaktformular. Beim statischen Export gibt es kein Backend:
 * Das Formular muss an einen Dienst (z. B. Formspark, Web3Forms) oder
 * eine eigene kleine API gesendet werden. Endpunkt unten eintragen.
 */
const ENDPOINT = ""; // z. B. "https://submit-form.com/xxxxx"

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ENDPOINT) { setState("done"); return; } // Vorschau ohne Backend
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setState(res.ok ? "done" : "error");
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
      <div><label htmlFor="f-msg">Nachricht</label><textarea id="f-msg" name="nachricht" rows={4} /></div>
      <div><button className="btn primary" type="submit" disabled={state === "sending"}>Anfrage senden</button></div>
      {state === "done" && <div className="ok">Vielen Dank. Wir melden uns innerhalb eines Werktags bei Ihnen.</div>}
      {state === "error" && <div className="ok">Das hat nicht geklappt. Bitte schreiben Sie uns direkt an info@apprologic.de.</div>}
    </form>
  );
}
