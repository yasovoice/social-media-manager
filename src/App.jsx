import { useState, useEffect, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// KONFIGURATION — Diese 3 Werte in Supabase eintragen
// ============================================================
const SUPABASE_URL = "https://dylovzxziqgctuwdvvea.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bG92enh6aXFnY3R1d2R2dmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTQyOTIsImV4cCI6MjA5NTg5MDI5Mn0.E4W4PUjJLj7icvppLZQKxQnTtDr4ZzEBpb9OUKqCT_s";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// MODULE
// ============================================================
const MODULES = [
  {
    id: "fundament", icon: "🏗️", label: "① Fundament", color: "#0EA5E9",
    desc: "Einmalig ausfüllen — Zielgruppe · USP · Stimme · Traumkunde",
    placeholder: "Erzähl mir von dir — wer du bist, was du machst, für wen du postest.",
    buildPrompt: (input, profile) => buildPrompt("fundament", input, profile)
  },
  {
    id: "wochenplaner", icon: "📅", label: "② Wochen Planer", color: "#8B5CF6",
    desc: "Jeden Montag — 4 Feuer Methode · Content Briefs · Wochendatei",
    placeholder: "Wie viele Posts diese Woche? Was ist dein aktuelles Ziel?",
    buildPrompt: (input, profile) => buildPrompt("wochenplaner", input, profile)
  },
  {
    id: "wochenanalyse", icon: "📊", label: "③ Wochen Analyse", color: "#06B6D4",
    desc: "Sonntags — Zahlen eingeben · lernen · nächste Woche besser",
    placeholder: "Gib deine Posts und Zahlen dieser Woche ein (Likes, Kommentare, Saves, DMs)",
    buildPrompt: (input, profile) => buildPrompt("wochenanalyse", input, profile)
  },
  {
    id: "viralreel", icon: "🚀", label: "Viral Reel", color: "#F97316",
    desc: "🔥 Anzünden · Reichweite · neue Menschen",
    placeholder: "Thema + deine Nische. Z.B: 'Ernährungsberaterin, Diäten funktionieren nicht'",
    buildPrompt: (input, profile) => buildPrompt("viralreel", input, profile)
  },
  {
    id: "sprechreel", icon: "🎤", label: "Sprech Reel", color: "#10B981",
    desc: "🔥🔥 Brennen · Vertrauen · direkt in die Kamera",
    placeholder: "Thema + welches Feuer (B Brennen / B Community / C Cash)",
    buildPrompt: (input, profile) => buildPrompt("sprechreel", input, profile)
  },
  {
    id: "broll", icon: "🎬", label: "B-Roll Coach", color: "#F43F5E",
    desc: "Die Welt durch deine Augen — nicht was du tust, sondern warum",
    placeholder: "Was machst du heute? Ich baue dir Voice-Over Texte in deiner Sprache.",
    buildPrompt: (input, profile) => buildPrompt("broll", input, profile)
  },
  {
    id: "carousel", icon: "🎠", label: "Karussell Coach", color: "#A78BFA",
    desc: "🔥🔥🔥🔥 Alle Feuer möglich — A bis Cash",
    placeholder: "Welches Feuer? (A/B Brennen/B Community/C Cash) + Thema",
    buildPrompt: (input, profile) => buildPrompt("carousel", input, profile)
  },
  {
    id: "hookcoach", icon: "🎯", label: "Hook Coach", color: "#6366F1",
    desc: "Persönliche Hook-Liste in allen Kategorien — in deiner Stimme",
    placeholder: "Schreib los — der Bot stellt dir alle Fragen!",
    buildPrompt: (input, profile) => buildPrompt("hookcoach", input, profile)
  },
  {
    id: "optimizer", icon: "⚡", label: "Content Optimizer", color: "#EF4444",
    desc: "Langweilige Sätze → spicy Content verwandeln",
    placeholder: "Deinen langweiligen Satz oder Post hier eingeben",
    buildPrompt: (input, profile) => buildPrompt("optimizer", input, profile)
  },
  {
    id: "strategy", icon: "🔥", label: "4 Feuer Methode", color: "#F59E0B",
    desc: "Komplette Content-Strategie · A·B·B·C · 30-Tage-Plan",
    placeholder: "Nische, Zielgruppe, aktueller Stand, Ziel",
    buildPrompt: (input, profile) => buildPrompt("strategy", input, profile)
  },
  {
    id: "brand", icon: "✨", label: "Personal Brand", color: "#EC4899",
    desc: "Unverwechselbare Marke · Positionierung · Brand Playbook",
    placeholder: "Wer bist du, was machst du, deine Werte, was macht dich anders?",
    buildPrompt: (input, profile) => buildPrompt("brand", input, profile)
  },
];

// ============================================================
// PROMPT BUILDER — mit Gedächtnis
// ============================================================
function buildPrompt(moduleId, input, profile) {
  const profileContext = profile ? `
━━━━━━━━━━━━━━━━━━━━━━━━
NUTZERPROFIL (gespeichertes Gedächtnis):
━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${profile.name || "unbekannt"}
Nische: ${profile.nische || "nicht angegeben"}
Zielgruppe: ${profile.zielgruppe || "nicht angegeben"}
Angebot: ${profile.angebot || "nicht angegeben"}
Sprache & typische Wörter: ${profile.sprache || "nicht angegeben"}
Phase: ${profile.phase || "Lauch-Phase"}
Follower: ${profile.follower || "unbekannt"}
Was funktioniert: ${profile.was_funktioniert || "noch keine Daten"}
Was nicht funktioniert: ${profile.was_nicht_funktioniert || "noch keine Daten"}
Letzte Woche Empfehlung: ${profile.naechste_woche || "keine"}
Themen: ${profile.themen || "nicht angegeben"}
USP: ${profile.usp || "nicht angegeben"}
━━━━━━━━━━━━━━━━━━━━━━━━
WICHTIG: Nutze dieses Profil für personalisierte Antworten in der ECHTEN Sprache der Person.
Frage NICHT nach Infos die bereits im Profil stehen.
━━━━━━━━━━━━━━━━━━━━━━━━
` : `Noch kein Profil vorhanden — stelle relevante Fragen zur Person.`;

  const prompts = {
    fundament: `Du bist ein persönlicher Social Media Coach — nicht ein Fragebogen. Du führst die Person Schritt für Schritt durch ihr komplettes Fundament. Du stellst eine Frage nach der anderen, hörst zu, hakst nach wenn Antworten zu oberflächlich sind, und gibst am Ende einen klaren Fahrplan.

DEINE ROLLE: Coach — nicht Berater. Du fragst, du hörst zu, du hakst nach. Erst wenn du alles weißt gibst du den Fahrplan.

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 1 — BEGRÜSSUNG & EINSTIEG
━━━━━━━━━━━━━━━━━━━━━━━━
Starte IMMER so:
"Hey! Ich bin dein persönlicher Social Media Coach. Bevor wir irgendetwas posten, Hooks schreiben oder Strategien entwickeln — müssen wir dein Fundament klären. Das dauert ca. 15 Minuten aber danach weiß ich genau wo du stehst und was dein nächster Schritt ist.

Fangen wir an — stell dich mir vor. Wer bist du und was machst du?"

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 2 — IDENTITÄT (eine Frage nach der anderen)
━━━━━━━━━━━━━━━━━━━━━━━━
Finde heraus:
- Berufsbezeichnung UND Lebens-Identität (z.B. "Social Media Managerin & 2-fach Mama")
- Was macht sie ANDERS — nicht besser, sondern anders
- Wie redet sie wirklich? Bitte um einen echten Satz wie sie einer Freundin schreiben würde
- Welche Wörter benutzt sie immer? Was sagt sie NIE?
- Was würden Freunde über sie sagen?

Hake nach wenn zu allgemein: "Das klingt noch sehr allgemein — gib mir ein konkretes Beispiel wie du das in einem Post sagen würdest"

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 3 — COMMUNITY DIAGNOSE (WICHTIGSTER TEIL)
━━━━━━━━━━━━━━━━━━━━━━━━
Finde heraus:
- Wie viele Follower gerade?
- Wie viele Kommentare bekommt sie durchschnittlich pro Post?
- Antworten Menschen auf ihre Stories?
- Bekommt sie DMs von Followern?
- Kennen die Leute ihren Namen / ihre Geschichte?
- Wie lange postet sie schon?
- Was hat bisher am besten funktioniert?

Basierend auf den Antworten bestimme die Phase:

🔴 PHASE 1 — FUNDAMENT (unter 1000 Follower ODER kaum Reaktionen)
"Du hast noch keine echte Community. Das ist okay — aber das bedeutet: Kein Verkaufen. Noch nicht. Dein einziges Ziel gerade ist dass Menschen anfangen dich zu kennen und dir zu vertrauen. Wir machen nur A + B."

🟡 PHASE 2 — AUFBAU (1000-5000 Follower + erste Kommentare + manchmal DMs)
"Du hast eine kleine Community die wächst. Gut. Jetzt müssen wir die Verbindung stärker machen. A + B + B. Noch kein aktives Verkaufen — aber erste subtile Erwähnungen sind okay."

🟢 PHASE 3 — MONETARISIERUNG (5000+ Follower + regelmäßige Kommentare + aktive DMs)
"Deine Community ist bereit. Jetzt können alle 4 Feuer. Aber C bleibt bei maximal 10% — wir verkaufen ohne dass es sich nach Verkauf anfühlt."

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 4 — PRODUKT DIAGNOSE
━━━━━━━━━━━━━━━━━━━━━━━━
Finde heraus:
- Hat sie schon ein Produkt oder Angebot?
- Hat sie schon zahlende Kunden?
- Weiß sie was sie verkaufen will?
- Wenn kein Produkt: Was könnte es sein?

Wenn KEIN Produkt:
"Du brauchst gerade kein Produkt. Das C Feuer ist für dich noch nicht relevant. Dein Fokus: Menschen anziehen die dich lieben bevor du ihnen etwas anbietest."

Wenn Produkt vorhanden aber keine Community:
"Du hast ein Produkt aber noch keine Community die dir vertraut. Fehler den viele machen: Sie versuchen zu verkaufen bevor jemand sie kennt. Wir bauen erst die Community — dann verkaufen wir."

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 5 — THEMEN & MEINUNGEN
━━━━━━━━━━━━━━━━━━━━━━━━
Finde heraus:
- Was sind ihre 3 Hauptthemen?
- Welche Fehler sieht sie bei ihrer Zielgruppe immer wieder?
- Was ist das Problem HINTER dem Problem ihrer Zielgruppe?
- Welche Meinung hat sie die andere provozieren könnte?
- Was sagt sie privat aber traut sich noch nicht zu posten?
- Welche Aussage würde nur SIE so treffen?

Hake nach: "Das ist noch zu allgemein. Was genau nervt dich an deiner Branche? Was sagst du deinen Freunden privat darüber?"

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 6 — TRAUMKUNDE
━━━━━━━━━━━━━━━━━━━━━━━━
Finde heraus:
- Beschreib deinen Traumkunden wie eine echte Person — nicht "Frauen 25-35"
- Was ist ihr größtes Problem KONKRET — welche Szene aus dem Alltag?
- Was fühlt sie täglich aber spricht es nie aus?
- Was hat sie schon alles versucht und warum hat es nicht geklappt?
- Was ist das Problem hinter dem Problem?
- Wofür würde sie sofort Geld ausgeben?

Hake nach: "Gib mir eine konkrete Alltagsszene — was passiert morgens, abends, im Auto?"

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 7 — POSITIONIERUNG
━━━━━━━━━━━━━━━━━━━━━━━━
Finde heraus:
- Wofür steht sie — auch wenn sie damit aneckt?
- Wogegen steht sie?
- Welche Community will sie aufbauen?
- Wie sollen Menschen sich fühlen nach ihrem Content?

━━━━━━━━━━━━━━━━━━━━━━━━
SCHRITT 8 — KLARER FAHRPLAN (erst nach allen Antworten)
━━━━━━━━━━━━━━━━━━━━━━━━

Erstelle einen persönlichen Coach-Fahrplan:

═══════════════════════════════
🔥 DEIN PERSÖNLICHER FAHRPLAN
═══════════════════════════════

📍 WO DU GERADE STEHST:
[Ehrliche Einschätzung — Phase + Community-Stärke + ob Produkt relevant ist]

🎯 DEIN EINZIGES ZIEL GERADE:
[Konkret — nicht "mehr posten" sondern "diese Woche sollen 3 Menschen auf deine Story antworten"]

🔥 DEINE FEUER DIESE WOCHE:
A ANZÜNDEN: [X Posts] → Modul: Viral Reel oder Karussell
B BRENNEN: [X Posts] → Modul: Sprech Reel oder Karussell
B BRENNEN LASSEN: [X Posts] → Modul: Karussell oder B-Roll
C CASH: [nur wenn Phase 3] → Modul: Sprech Reel

⚠️ WAS DU NOCH NICHT TUN SOLLTEST:
[Ehrlich sagen wenn jemand zu früh verkaufen will]

📅 DEINE NÄCHSTEN 30 TAGE:
Woche 1: [konkreter Fokus]
Woche 2: [konkreter Fokus]
Woche 3: [konkreter Fokus]
Woche 4: [konkreter Fokus]

🗣️ DEINE MARKENSTIMME:
[3 typische Wörter/Ausdrücke die sie benutzen soll]
[1 Satz der zeigt wie sie klingt]

💡 DEIN STÄRKSTES THEMA GERADE:
[Das eine Thema das am meisten Potenzial hat]

═══════════════════════════════

Danach frage: "Soll ich dein Profil und deinen Fahrplan speichern damit ich dich nächste Woche noch besser kenne?"
Wenn ja, antworte mit JSON:
{"action":"save_profile","nische":"...","zielgruppe":"...","angebot":"...","usp":"...","sprache":"...","themen":"...","phase":"...","follower":"...","was_funktioniert":"...","produkt":"..."}

Input: ${input}`,

    wochenplaner: `Du bist Social Media Stratege mit der 4 Feuer Methode.
${profileContext}

4 FEUER: 🔥A=ANZÜNDEN(40%) · 🔥🔥B=BRENNEN(25%) · 🔥🔥🔥B=BRENNEN-LASSEN(25%) · 🔥🔥🔥🔥C=CASH(10%)

PHASEN-DIAGNOSE:
- Lauch (<1000 Follower / kaum Kommentare): NUR A+B. KEIN C. Sage das direkt.
- Aufbau (1000-5000): A+B+B. Noch kein C.
- Community (5000+): Alle 4 Feuer.

Erstelle:
1. EHRLICHE DIAGNOSE: Wo steht die Person wirklich?
2. WOCHENPLAN mit Feuer-Verteilung
3. FÜR JEDEN POST EIN CONTENT BRIEF:
═══ CONTENT BRIEF #[N] ═══
🔥 FEUER: / 📱 FORMAT: / 🎯 MODUL: / 🎨 THEMA: / 🪝 HOOK: / 📝 KERNAUSSAGE: / 📣 CTA:
→ KOPIERE IN MODUL: [Name]
═══════════════════════════

4. WOCHENDATEI zum Speichern — frage am Ende ob gespeichert werden soll
JSON wenn ja: {"action":"save_weekly","phase":"...","follower":"...","was_funktioniert":"...","was_nicht_funktioniert":"...","naechste_woche":"..."}

Input: ${input}`,

    wochenanalyse: `Du bist Social Media Analytiker mit der 4 Feuer Methode.
${profileContext}

ZAHLEN BEDEUTEN:
Likes=Zustimmung · Kommentare=Verbindung · Saves=stärkstes B-Signal · Shares=stärkstes A-Signal · DMs=C hat funktioniert

Analysiere jeden Post:
- Welches Feuer? Was sagen die Zahlen? Warum funktioniert/nicht?

Erstelle:
1. POST-ANALYSE (jeden Post einzeln)
2. WOCHEN-ZUSAMMENFASSUNG
3. EMPFEHLUNG NÄCHSTE WOCHE (neue Feuer-Verteilung)
4. 3 konkrete Content-Ideen die jetzt Sinn machen

Am Ende aktualisierte WOCHENDATEI — frage ob gespeichern.
JSON wenn ja: {"action":"save_weekly","phase":"...","follower":"...","was_funktioniert":"...","was_nicht_funktioniert":"...","naechste_woche":"..."}

Input: ${input}`,

    viralreel: `Du bist Experte für virale Kurzreels 2026.
${profileContext}

VIRAL REEL = 🔥 ANZÜNDEN — Reichweite, Fremde stoppen.
Regeln: Unter 30 Sek · Starker Hook Sekunde 1 · Klarer Standpunkt · Ende das zum Kommentieren einlädt

NICHT SAGEN dass du verstehst — ZEIGEN dass du da warst.
Echte Sprache der Person nutzen (aus Profil).

Erstelle:
🎣 3 HOOK-VARIANTEN (gesprochen + Text-Hook + visuell)
📱 SKRIPT (Sekunde für Sekunde unter 30 Sek.)
🎵 AUDIO-VIBE
🔁 3 VARIANTEN desselben Themas
💡 WARUM ES VIRAL GEHEN KANN

Input: ${input}`,

    sprechreel: `Du bist Experte für Sprech-Reels FaceTime-Style.
${profileContext}

SPRECH REEL = 🔥🔥 BRENNEN + 🔥🔥🔥 BRENNEN LASSEN
Klingt wie Sprachnachricht. Direkt in die Kamera.

B BRENNEN FORMEL:
Konkrete Situation die sie kennen → "i feel you" / "kenn ich" → "Ich zeig dir was ich mache"
NICHT: "Ich verstehe dass du..." → ZEIGEN nicht SAGEN.

Beispiel gut: "Wenn du nach einem langen Tag kochen musst weil deine Kinder hungrig sind obwohl du gar keinen Bock hast — i feel you. Ich zeig dir was ich dann immer mache."

Nutze die echte Sprache aus dem Profil.

Erstelle:
🎣 HOOK (3 Varianten — klingt wie spontaner Gedanke)
🎤 KOMPLETTES SKRIPT in IHRER Sprache (Pausen mit ... · Betonungen GROSS)
🎬 VISUELLE HOOK (Handlung Sekunde 1)
🎤 DELIVERY-HINWEISE
📣 CTA in ihrer Sprache

Input: ${input}`,

    broll: `Du bist Experte für B-Roll Content.
${profileContext}

B-ROLL PRINZIP: Nicht zeigen was jemand tut — die Welt durch ihre Augen zeigen.
❌ "Ich mache Kaffee" → ✅ "Dritter Kaffee. Nicht weil ich ihn brauche — weil das die einzige Pause ist die ich mir heute erlaube."

FORMEL: Bild (was man sieht) → Gedanke (was im Kopf passiert) → Warum (der echte Grund)
Menschen folgen nicht was du tust — sie folgen wie du denkst.

Für jede Situation 3 Varianten:
→ Emotional/nachdenklich · Humorvoll/selbstironisch · Hot Take

Nutze IHRE echten Wörter aus dem Profil.
Plus: 5 B-ROLL IDEEN FÜR DIE WOCHE aus ihrem Alltag.

Input: ${input}`,

    carousel: `Du bist der beste Karussell-Coach 2026.
${profileContext}

KARUSSELL FUNKTIONIERT FÜR ALLE 4 FEUER — je nach Aufbau:

🔥 A ANZÜNDEN: Identität in der Hook = Magnet
"Was ich als überforderte 2-fach Mama koche wenn es schnell gehen muss (& den Kids schmeckt)"
→ "überforderte 2-fach Mama" stoppt Fremde sofort.

🔥🔥 B BRENNEN: Ihr Gefühl + "i feel you" + Expertise
"Wenn du nach einem langen Tag kochen musst obwohl du keinen Bock hast — i feel you. Ich zeig dir was ich mache."
NICHT: "Ich verstehe dass du..." — ZEIGEN nicht SAGEN.

🔥🔥🔥 B BRENNEN LASSEN: Geschichte + "Wie war das bei dir?"
🔥🔥🔥🔥 C CASH: Geschichte + Transformation + "Kommentier XY"

STIMME: Nutze IHRE echten Wörter. Kein Hochdeutsch wenn sie locker redet.
CTAs: NIEMALS "Folgt mir für mehr" → kreativ, persönlich, wie SIE redet.

Erstelle: 3 Hooks · Bestes Hook · Komplettes Karussell (Slide für Slide) · Caption · Warum es performt

Input: ${input}`,

    hookcoach: `Du bist der beste Hook-Coach 2026.
${profileContext}

DIE 4 GESETZE:
1. HANDLUNGEN stoppen. Analysen nicht. "Ich hab aufgelegt" > "Das System ist falsch"
2. REDE MIT IHR nicht über sie. "Jede Frau die..." > "Es gibt Frauen die..."
3. POINTE OFFEN lassen. Sie muss weiterschauen.
4. ECHTE KÖRPERSPRACHE & BILDER. Man muss es sehen können.

Wenn noch keine Infos: Stelle ALLE 13 Fragen auf einmal:
1.Wer bist du (Beruf+Leben) 2.Was macht dich anders 3.Echter WhatsApp-Satz 4.Zielgruppe konkret beschreiben 5.Alltagsszene die sie kennt 6.Was sie fühlt aber nie sagt 7.3 Hauptthemen 8.Problem hinter dem Problem 9.Eigenes Erlebnis das sie kennt 10.Was du früher nie zugegeben hättest 11.Was alle falsch machen 12.Provokante Meinung 13.Zahlen

Dann erstelle für ALLE Kategorien 5 Hooks in IHRER Sprache:
📱FaceTime · 🎠Karussell · 🔥Hot Take · 😤Situation · 💬Bestie · ⚡Ergebnis+Ohne · 📖Story · 🔢Zahlen · 👨‍👩‍👧Familie · 🚫De-Influencing

Input: ${input}`,

    optimizer: `Du bist Experte darin langweilige Sätze in viralen Content zu verwandeln.
${profileContext}

OPTIMIERUNGS-REGELN:
1. ECHTE SPRACHE: "auftreten" → "große Fresse haben"
2. DIREKT MIT IHR: "Es gibt Menschen die..." → "Kennst du das wenn..."
3. POINTE OFFEN: Erkläre nicht alles — lass das Ende fehlen
4. HANDLUNG statt Beschreibung: "Sie ist unsicher" → "Sie legt auf"
5. EMOTIONALE VERSTÄRKER: "viel zu viele" / "und das jeden Tag" / "einfach so"

Nutze IHRE Sprache aus dem Profil.

Erstelle:
🔍 DIAGNOSE (warum ist es schwach?)
✨ 3 VARIANTEN:
→ FaceTime/Reel Hook · Karussell Hook · Hot Take
💡 WARUM BESSER (welche Regel angewendet)
🎬 VISUELLE HOOK
🔁 NOCH SPICIER (mutigste Version)

Input: ${input}`,

    strategy: `Du bist Social Media Stratege mit der 4 Feuer Methode.
${profileContext}

4 FEUER METHODE:
🔥 A=ANZÜNDEN(40%) — Fremde stoppen. Hook. Kein Tipp.
🔥🔥 B=BRENNEN(25%) — ZEIGEN nicht SAGEN. "i feel you" + Expertise.
🔥🔥🔥 B=BRENNEN LASSEN(25%) — Geschichte + "Wie war das bei dir?"
🔥🔥🔥🔥 C=CASH(10%) — Geschichte + Transformation + "Kommentier XY"

Erstelle:
🎯 ANALYSE DER SITUATION
🧬 PERSONAL BRAND DNA
⚡ 8 A-CONTENT IDEEN (in ihrer Sprache)
❤️ 6 B-BRENNEN IDEEN (Gefühl zeigen + Geschichte)
💬 6 B-COMMUNITY IDEEN (Geschichte + Frage)
💰 4 C-CASH IDEEN (subtil)
📅 30-TAGE-PLAN
⚠️ 3 GRÖSSTE FEHLER

Input: ${input}`,

    brand: `Du bist Personal Brand Experte 2026.
${profileContext}

2026 ist die Ära der Identität — nicht des Contents.
Deine Sprache IST deine Brand. Du ziehst an was du verkörperst.

Erstelle:
🧬 PERSONAL BRAND DNA
🎭 VERSTECKTE FACETTEN (was zeigst du nicht das Menschen lieben würden?)
🗣️ MARKENSTIMME (typische Wörter, Energie, Humor)
⚔️ POSITIONIERUNG (wofür/wogegen)
❤️ EMOTIONALES MARKENVERSPRECHEN
🎯 COMMUNITY-MAGNET
📱 15 CONTENT-IDEEN aus deiner Persönlichkeit
🚫 3 MEINUNGEN die du aussprechen solltest
📋 PERSONAL BRAND PLAYBOOK

Input: ${input}`,
  };

  return prompts[moduleId] || prompts.fundament;
}

// ============================================================
// HAUPTKOMPONENTE
// ============================================================
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
        loadPinnedMessage();
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
        loadPinnedMessage();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
    if (data) setProfile(data);
  }

  async function loadPinnedMessage() {
    const { data } = await supabase.from("pinned_messages").select("*").eq("aktiv", true).order("created_at", { ascending: false }).limit(1).single();
    if (data) setPinnedMessage(data);
  }

  async function sendFeedback() {
    if (!feedbackText.trim() || !session) return;
    await supabase.from("feedback").insert({
      user_id: session.user.id,
      nachricht: feedbackText,
      modul: activeModule || "allgemein"
    });
    setFeedbackSent(true);
    setFeedbackText("");
    setTimeout(() => { setFeedbackSent(false); setShowFeedback(false); }, 2000);
  }

  async function saveProfile(data) {
    if (!session) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      user_id: session.user.id,
      ...data,
      updated_at: new Date().toISOString()
    });
    if (!error) {
      await loadProfile(session.user.id);
      setSaveMsg("✓ Profil gespeichert!");
    } else {
      setSaveMsg("❌ Fehler beim Speichern");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function handleAuth(e) {
    e?.preventDefault();
    setAuthError("");
    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError("E-Mail oder Passwort falsch.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else setAuthError("✓ Bitte bestätige deine E-Mail!");
    }
  }

  async function handleSend() {
    if (!input.trim() || !activeModule || loading) return;
    const mod = MODULES.find(m => m.id === activeModule);
    const userMsg = input.trim();
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = mod.buildPrompt(userMsg, profile);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: systemPrompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Fehler.";

      // Auto-detect save actions
      const jsonMatch = text.match(/\{"action":"(save_profile|save_weekly)"[^}]+\}/);
      if (jsonMatch) {
        try {
          const saveData = JSON.parse(jsonMatch[0]);
          const { action, ...rest } = saveData;
          await saveProfile(rest);
        } catch (e) {}
      }

      setMessages([...newMessages, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "❌ Verbindungsfehler. Bitte nochmal versuchen." }]);
    }
    setLoading(false);
  }

  // ============================================================
  // LOGIN SCREEN
  // ============================================================
  if (!session) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0f 0%, #1a1025 50%, #0d1a2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", color: "#fff", margin: "0 0 8px", fontWeight: "400", letterSpacing: "-0.5px" }}>Social Media Manager</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>4 Feuer Methode · KI-powered · 2026</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px 28px" }}>
          <div style={{ display: "flex", marginBottom: "24px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "4px" }}>
            {["login","signup"].map(mode => (
              <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(""); }}
                style={{ flex: 1, padding: "10px", border: "none", borderRadius: "9px", cursor: "pointer", fontSize: "13px", fontWeight: "500", fontFamily: "inherit", background: authMode === mode ? "rgba(255,255,255,0.12)" : "transparent", color: authMode === mode ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.2s" }}>
                {mode === "login" ? "Einloggen" 
              </button>
            ))}
          </div>
          <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} type="email" placeholder="E-Mail Adresse"
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", marginBottom: "10px" }} />
          <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} type="password" placeholder="Passwort"
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", marginBottom: "16px" }} />
          {authError && <p style={{ color: authError.startsWith("✓") ? "#10B981" : "#F87171", fontSize: "13px", margin: "0 0 12px", textAlign: "center" }}>{authError}</p>}
          <button onClick={handleAuth}
            style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #F97316, #8B5CF6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            {authMode === "login" ? "Einloggen →" : "Account erstellen →"}
          </button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", textAlign: "center", marginTop: "20px" }}>Kein Account? Kontaktiere uns für Zugang.</p>
      </div>
    </div>
  );

  const mod = MODULES.find(m => m.id === activeModule);

  // ============================================================
  // MAIN APP
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { transition: all 0.15s ease; }
        textarea:focus { outline: none; }
      `}</style>

      {/* FEEDBACK OVERLAY */}
      {showFeedback && (
        <div onClick={() => setShowFeedback(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px", maxWidth: "440px", width: "100%", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #0a0a0f, #1a1025)", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display'", color: "#fff", fontSize: "18px", margin: 0, fontWeight: "400" }}>💬 Feedback geben</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "3px 0 0" }}>Hilf uns den Bot besser zu machen</p>
              </div>
              <button onClick={() => setShowFeedback(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: "50%", width: "30px", height: "30px", fontSize: "16px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "20px" }}>
              {feedbackSent ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🙏</div>
                  <p style={{ fontSize: "14px", color: "#1a1a2e", fontWeight: "600" }}>Danke für dein Feedback!</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>Was könnte besser sein? Was vermisst du? Was hat super funktioniert?</p>
                  <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Schreib einfach drauf los..." rows={4}
                    style={{ width: "100%", padding: "12px 14px", border: "1px solid #ebebf5", borderRadius: "12px", fontSize: "13px", color: "#333", resize: "none", fontFamily: "inherit", outline: "none", background: "#fafafa", marginBottom: "12px" }} />
                  <button onClick={sendFeedback} disabled={!feedbackText.trim()}
                    style={{ width: "100%", padding: "13px", background: feedbackText.trim() ? "linear-gradient(135deg, #F97316, #8B5CF6)" : "#ddd", border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: feedbackText.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                    Feedback senden 🔥
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GUIDE OVERLAY */}
      {showGuide && (
        <div onClick={() => setShowGuide(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px", maxWidth: "560px", width: "100%", overflow: "hidden", marginTop: "20px" }}>
            <div style={{ background: "linear-gradient(135deg, #0a0a0f, #1a1025)", padding: "24px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", color: "#fff", fontSize: "20px", margin: 0, fontWeight: "400" }}>🔥 Wie nutze ich was?</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "4px 0 0" }}>Dein kompletter Leitfaden</p>
              </div>
              <button onClick={() => setShowGuide(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", fontSize: "18px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "24px 20px" }}>
              <div style={{ background: "#f8f7ff", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px" }}>Dein idealer wöchentlicher Flow</p>
                {[
                  { n: "①", t: "Fundament ausfüllen", s: "Einmalig — wird automatisch gespeichert", c: "#0EA5E9" },
                  { n: "②", t: "Wochen Planer öffnen", s: "Jeden Montag — sagt dir welches Modul + fertige Briefs", c: "#8B5CF6" },
                  { n: "③", t: "Content Modul nutzen", s: "Brief reinkopieren — Bot kennt dich bereits", c: "#F97316" },
                  { n: "④", t: "Wochen Analyse", s: "Sonntag — Zahlen eingeben, lernen, besser werden", c: "#06B6D4" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ background: s.c, color: "#fff", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>{s.n}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>{s.t}</div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{s.s}</div>
                    </div>
                  </div>
                ))}
              </div>
              {[
                { icon: "🎯", t: "Hook Coach", w: "Einmalig + bei Bedarf", d: "Stellt 13 Fragen → komplette Hook-Liste in deiner Stimme. Für Wochen nutzbar." },
                { icon: "🚀", t: "Viral Reel", w: "🔥 Anzünden", d: "Unter 30 Sek. Fremde stoppen. Reichweite." },
                { icon: "🎤", t: "Sprech Reel", w: "🔥🔥 Brennen", d: "Direkt in die Kamera. Vertrauen. Skript in deiner Stimme." },
                { icon: "🎬", t: "B-Roll Coach", w: "Alltag", d: "Voice-Over der zeigt wie du denkst — nicht was du tust." },
                { icon: "🎠", t: "Karussell Coach", w: "Alle 4 Feuer", d: "Fragt welches Feuer → baut komplett unterschiedlich." },
                { icon: "⚡", t: "Content Optimizer", w: "Wenn Content langweilig", d: "Langweiligen Satz → spicy. Analysiert warum + 3 Varianten." },
                { icon: "🔥", t: "4 Feuer Methode", w: "Einmal pro Monat", d: "Komplette Content-Strategie mit 30-Tage-Plan." },
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f0eeff" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{g.icon}</span>
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>{g.t}</span>
                      <span style={{ fontSize: "10px", background: "#f0eeff", color: "#6366F1", padding: "2px 8px", borderRadius: "20px" }}>{g.w}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{g.d}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setShowGuide(false)} style={{ width: "100%", marginTop: "20px", padding: "14px", background: "linear-gradient(135deg, #F97316, #8B5CF6)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                Los geht's 🔥
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0a0a0f, #1a1025)", padding: "16px 20px", position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", color: "#fff", fontSize: "18px", margin: 0, fontWeight: "400" }}>✦ Social Media Manager</h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: "1px 0 0" }}>
            {profile?.nische ? `${profile.nische} · ${profile.phase || "Lauch-Phase"}` : "4 Feuer Methode · 2026"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saveMsg && <span style={{ fontSize: "11px", color: saveMsg.startsWith("✓") ? "#10B981" : "#F87171", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "20px" }}>{saveMsg}</span>}
          <button onClick={() => setShowFeedback(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)", borderRadius: "20px", padding: "6px 12px", fontSize: "11px", cursor: "pointer" }}>💬 Feedback</button>
          <button onClick={() => setShowGuide(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)", borderRadius: "20px", padding: "6px 12px", fontSize: "11px", cursor: "pointer" }}>❓ Hilfe</button>
          <button onClick={() => supabase.auth.signOut()} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.4)", borderRadius: "20px", padding: "6px 12px", fontSize: "11px", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 14px 100px" }}>

        {/* PINNED MESSAGE VON YASO */}
        {pinnedMessage && (
          <div style={{ background: "linear-gradient(135deg, #F97316, #EF4444)", borderRadius: "16px", padding: "14px 16px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "22px", flexShrink: 0 }}>{pinnedMessage.emoji || "📌"}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "3px" }}>{pinnedMessage.titel}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: "1.5" }}>{pinnedMessage.nachricht}</div>
            </div>
          </div>
        )}

        {/* PROFILE BANNER */}
        {profile && (
          <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(14,165,233,0.1))", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>🧠</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#1a1a2e" }}>Coach kennt dich bereits — Profil geladen</div>
                <div style={{ fontSize: "11px", color: "#888" }}>{profile.nische || "Kein Thema"} · {profile.follower ? `${profile.follower} Follower` : ""}</div>
              </div>
              <div style={{ fontSize: "11px", background: profile.phase === "Monetarisierung" ? "#10B98120" : profile.phase === "Aufbau" ? "#F59E0B20" : "#EF444420", color: profile.phase === "Monetarisierung" ? "#10B981" : profile.phase === "Aufbau" ? "#F59E0B" : "#EF4444", padding: "4px 10px", borderRadius: "20px", fontWeight: "600" }}>
                {profile.phase === "Monetarisierung" ? "🟢" : profile.phase === "Aufbau" ? "🟡" : "🔴"} {profile.phase || "Lauch-Phase"}
              </div>
            </div>
            {profile.naechste_woche && (
              <div style={{ background: "rgba(139,92,246,0.08)", borderRadius: "10px", padding: "8px 12px", fontSize: "11px", color: "#6366F1" }}>
                💡 Fokus diese Woche: {profile.naechste_woche}
              </div>
            )}
          </div>
        )}

        {!profile && (
          <div style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "24px" }}>👋</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>Willkommen! Starte mit dem Fundament.</div>
              <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Dein Coach stellt dir alle Fragen → analysiert wo du stehst → gibt dir deinen persönlichen Fahrplan.</div>
            </div>
          </div>
        )}

        {/* FLOW STEPS */}
        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Wöchentlicher Flow</p>
        {[
          { id: "fundament", n: "①", label: "Fundament", sub: "Einmalig ausfüllen · wird gespeichert", color: "#0EA5E9", badge: profile ? "✓ Profil vorhanden" : "Starte hier" },
          { id: "wochenplaner", n: "②", label: "Wochen Planer", sub: "Jeden Montag · 4 Feuer · Content Briefs", color: "#8B5CF6", badge: "Jeden Montag" },
          { id: "wochenanalyse", n: "③", label: "Wochen Analyse", sub: "Sonntag · Zahlen eingeben · lernen", color: "#06B6D4", badge: "Jeden Sonntag" },
        ].map(s => (
          <button key={s.id} onClick={() => { setActiveModule(s.id); setMessages([]); setInput(""); }}
            style={{ width: "100%", padding: "15px 16px", background: activeModule === s.id ? s.color : "#fff", border: activeModule === s.id ? "none" : `2px solid ${s.color}20`, borderRadius: "14px", cursor: "pointer", textAlign: "left", marginBottom: "8px", display: "flex", alignItems: "center", gap: "14px", boxShadow: activeModule === s.id ? `0 8px 24px ${s.color}40` : "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ background: activeModule === s.id ? "rgba(255,255,255,0.2)" : s.color, color: "#fff", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", flexShrink: 0 }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: activeModule === s.id ? "#fff" : "#1a1a2e" }}>{s.label}</div>
              <div style={{ fontSize: "11px", color: activeModule === s.id ? "rgba(255,255,255,0.7)" : "#888", marginTop: "1px" }}>{s.sub}</div>
            </div>
            <span style={{ fontSize: "10px", background: activeModule === s.id ? "rgba(255,255,255,0.2)" : `${s.color}15`, color: activeModule === s.id ? "#fff" : s.color, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" }}>{s.badge}</span>
          </button>
        ))}

        {/* CONTENT MODULES */}
        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "1px", margin: "20px 0 10px" }}>Content erstellen</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "16px" }}>
          {MODULES.filter(m => ["viralreel","sprechreel","broll","carousel"].includes(m.id)).map(m => (
            <button key={m.id} onClick={() => { setActiveModule(m.id); setMessages([]); setInput(""); }}
              style={{ padding: "14px 12px", background: activeModule === m.id ? m.color : "#fff", border: "1px solid", borderColor: activeModule === m.id ? "transparent" : "#ebebf5", borderRadius: "14px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", boxShadow: activeModule === m.id ? `0 6px 20px ${m.color}40` : "0 2px 6px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: "22px" }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "600", color: activeModule === m.id ? "#fff" : "#333" }}>{m.label}</div>
                <div style={{ fontSize: "10px", color: activeModule === m.id ? "rgba(255,255,255,0.7)" : "#aaa", marginTop: "1px" }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* OTHER MODULES */}
        <p style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Hooks & Strategie</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "20px" }}>
          {MODULES.filter(m => ["hookcoach","optimizer","strategy","brand"].includes(m.id)).map(m => (
            <button key={m.id} onClick={() => { setActiveModule(m.id); setMessages([]); setInput(""); }}
              style={{ padding: "12px 8px", background: activeModule === m.id ? m.color : "#fff", border: "1px solid", borderColor: activeModule === m.id ? "transparent" : "#ebebf5", borderRadius: "14px", cursor: "pointer", textAlign: "center", boxShadow: activeModule === m.id ? `0 6px 20px ${m.color}40` : "0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{m.icon}</div>
              <div style={{ fontSize: "10px", fontWeight: "600", color: activeModule === m.id ? "#fff" : "#444" }}>{m.label}</div>
            </button>
          ))}
        </div>

        {/* CHAT */}
        {activeModule && mod && (
          <>
            <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", padding: "14px 16px", borderBottom: "1px solid #f0eeff", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{mod.icon}</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{mod.label}</div>
                <div style={{ fontSize: "11px", color: "#999" }}>{mod.desc}</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: "16px", minHeight: "120px" }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "#ccc" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{mod.icon}</div>
                  <div style={{ fontSize: "12px" }}>{mod.placeholder}</div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: "14px" }}>
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ background: "linear-gradient(135deg, #1a1025, #0a0a0f)", color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", maxWidth: "75%", fontSize: "13px", lineHeight: "1.5" }}>{msg.content}</div>
                    </div>
                  ) : (
                    <div style={{ background: "#f8f7ff", borderRadius: "4px 18px 18px 18px", padding: "14px 16px", border: "1px solid #ebebf5" }}>
                      {msg.content.split("\n").map((line, j) => {
                        if (!line.trim()) return <div key={j} style={{ height: "6px" }} />;
                        if (line.match(/^[🎯🎣🎠🧭📖✨📱🔑📊⚡❤️💰📅🧲⚠️🎬💭💡📣🧬🎭🗣️⚔️🚫📋🔍👥🔥😤💬🏆📌✍️👁️🎤🚀]/u))
                          return <div key={j} style={{ fontWeight: "700", fontSize: "13px", color: "#1a1a2e", marginTop: "14px", marginBottom: "4px", borderBottom: "1px solid #f0eeff", paddingBottom: "3px" }}>{line}</div>;
                        if (line.startsWith("✅")) return <div key={j} style={{ fontSize: "13px", color: "#10B981", padding: "2px 0" }}>{line}</div>;
                        if (line.startsWith("❌")) return <div key={j} style={{ fontSize: "13px", color: "#EF4444", padding: "2px 0" }}>{line}</div>;
                        if (line.match(/^\d+\./)) return <div key={j} style={{ fontSize: "13px", color: "#333", padding: "3px 0 3px 10px", borderLeft: "2px solid #e0d8ff" }}>{line}</div>;
                        return <div key={j} style={{ fontSize: "13px", color: "#444", lineHeight: "1.7" }}>{line}</div>;
                      })}
                      <button onClick={() => navigator.clipboard.writeText(msg.content)} style={{ marginTop: "10px", padding: "5px 12px", background: "#f0eeff", border: "none", borderRadius: "8px", fontSize: "11px", color: "#6366F1", cursor: "pointer" }}>📋 Kopieren</button>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "5px", padding: "10px 0" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: mod.color, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />)}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ background: "#fff", borderRadius: "0 0 16px 16px", padding: "10px 12px", borderTop: "1px solid #f0eeff", display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={mod.placeholder} rows={2}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #ebebf5", borderRadius: "12px", fontSize: "13px", color: "#333", resize: "none", fontFamily: "inherit", background: "#fafafa", lineHeight: "1.5" }} />
              <button onClick={handleSend} disabled={loading || !input.trim()}
                style={{ padding: "10px 18px", background: loading || !input.trim() ? "#ddd" : `linear-gradient(135deg, ${mod.color}, #1a1025)`, border: "none", borderRadius: "12px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: loading || !input.trim() ? "not-allowed" : "pointer" }}>
                ↑
              </button>
            </div>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} style={{ marginTop: "8px", padding: "7px 14px", background: "transparent", border: "1px solid #e0e0f0", borderRadius: "10px", fontSize: "11px", color: "#aaa", cursor: "pointer" }}>↺ Neu starten</button>
            )}
          </>
        )}

        {!activeModule && (
          <div style={{ textAlign: "center", padding: "40px", color: "#ccc" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>☝️</div>
            <p style={{ fontSize: "14px" }}>Wähle ein Modul oben um zu starten</p>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
    </div>
  );
}
