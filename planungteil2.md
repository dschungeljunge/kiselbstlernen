# Planung Workshop Teil 2

## Ausgangslage

In einem vorangehenden Workshop haben die Berufsschullehrpersonen grundlegende Strategien zum wirksamen Einsatz von KI kennengelernt – insbesondere **Prompt Engineering**: Wie instruiere ich eine KI so, dass sie pädagogisch sinnvoll handelt? (z.B. KI, die statt fertiger Lösungen Denkimpulse gibt; KI, die metakognitive Reflexionen einfordert).

Als Vorbereitung haben sie eine konkrete Unterrichtssituation mit KI-Einsatz gestaltet, festgehalten und bringen ihre Erkenntnisse mit.

---

## Leitgedanke: Von Prompt Engineering zu Context Engineering

Workshop 1 hat gezeigt, **wie** man einer KI einen guten Befehl gibt.

Workshop 2 geht einen Schritt weiter: **Welchen Kontext braucht eine KI, damit sie wirklich hilfreich ist?**

> **Prompt Engineering** → Die richtigen Anweisungen geben  
> **Context Engineering** → Den richtigen Hintergrund bereitstellen

Die Reflexionsplattform ist dabei nicht nur ein Reflexionsinstrument – sie ist eine **Kontext-Maschine**: Durch die strukturierte Reflexion (Situation + Strategien + Selbsteinschätzungen + Chat-Verläufe) entsteht ein dichter, personalisierter Kontext. Dieser Kontext wird in Teil 4 direkt in die KI gespeist, um ein konkretes, situiertes KI-Ziel abzuleiten.

**Doppeldecker-Prinzip:** Die Lehrpersonen erleben Context Engineering selbst am eigenen Leib, während sie die Plattform benutzen. Was sie tun, ist gleichzeitig das, was sie lernen.

---

## Überblick: Vier Teile

| Teil | Inhalt | Zeit | Wo |
| --- | --- | --- | --- |
| 1 – Warmup | Welche Lernenden-Feedbacks passen zu meiner Situation? | ~15 min | Plattform `/warmup` |
| 2 – Impuls | Referat: Was macht KI-Einsatz sinnvoll? (3 Strategien) | ~45 min | Plenum |
| 3 – Reflexion | Eigene Situation reflektieren = reichen Kontext aufbauen | ~60 min | Plattform `/reflexion` |
| 4 – KI-Ziel | Context Engineering in Aktion: Ziel mit KI ableiten | ~20 min | Plattform `/reflexion/ziel` |

---

## Teil 1 – Warmup (Einstieg)

Die Teilnehmenden starten den Tag direkt auf der Plattform. Sie spielen das Warmup-Karten-Spiel: Sie sehen Feedbacks von typischen Berufsschüler:innen und entscheiden – passt dieses Feedback zu meiner Situation oder nicht?

**Ziel des Warmups:**
- Einstieg in das eigene Szenario schaffen, erste Aktivierung
- Aus den akzeptierten Feedbacks werden automatisch **3 Reflexionsstrategien empfohlen** (Top 3 nach Häufigkeit)
- Diese 3 Strategien werden als persönlicher Fokus für den Tag gesetzt

**Technisch:** `berechneStrategieEmpfehlung()` sortiert bereits nach Häufigkeit → auf Top 3 begrenzen → als Vorauswahl im Reflexionsteil setzen.

---

## Teil 2 – Impuls / Referat (~45 min)

Referat: Was macht einen sinnvollen KI-Einsatz aus – und was nicht?

**Kernthese:** Die professionelle Wahrnehmung der Lehrperson ist der beste Gradmesser.

**Struktur:** Nicht alle 5 Strategien nacheinander (kein roter Faden, zu viel Information). Stattdessen: **3 Perspektiven**, die sich klar voneinander unterscheiden:

| Strategie | Perspektive | Kernfrage |
| --- | --- | --- |
| A – Kognitive Aktivierung | Lernende | Hat die KI für sie gedacht – oder sie zum Denken gebracht? |
| B – Professionelles Erleben | Lehrperson | Was sagt mein Bauchgefühl über diesen Einsatz? |
| E – Berufsbild | Berufsschule | Welches Berufsbild habe ich implizit vermittelt? |

C (Angebot & Nutzung) und D (Lernzielorientierung) werden kurz erwähnt und stehen auf der Plattform als vertiefendes Material zur Verfügung.

---

## Teil 3 – Reflexion auf der Plattform (~60 min)

Die Teilnehmenden reflektieren ihre eigene Unterrichtssituation mit den 3 empfohlenen Strategien.

**Was dabei entsteht – der Kontext-Stack:**

```
Situation (Text / Audio-Transkript)
    + KI-Zusammenfassung der Situation
    + Profil der Lehrperson (aus Lern-Code)
    + Strategie A: Chat-Verlauf + Selbsteinschätzung
    + Strategie B: Chat-Verlauf + Selbsteinschätzung  
    + Strategie E: Chat-Verlauf + Selbsteinschätzung
    ────────────────────────────────────────────────
    = Reicher, personalisierter Kontext für Teil 4
```

Dieser Kontext-Stack ist genau das, was Context Engineering bedeutet: Nicht ein generischer Prompt, sondern strukturiertes, situiertes Wissen, das eine KI wirklich handlungsfähig macht.

**Flow auf der Plattform:**
```
/warmup  →  /reflexion/situation  →  /reflexion/hub  →  /reflexion/[a|b|e]  →  /reflexion/hub  →  /reflexion/ziel
```

---

## Teil 4 – Persönliches KI-Ziel (~20 min)

### Pädagogischer Rahmen

**Context Engineering in Aktion:** Der gesamte Kontext-Stack aus Teil 3 wird als System-Prompt für die KI verwendet. Die KI kennt jetzt:
- die konkrete Unterrichtssituation
- wie die Lehrperson ihren Einsatz selbst einschätzt
- welche Stärken und Entwicklungsbereiche sichtbar wurden

Damit kann die KI ein wirklich situiertes, nicht generisches Ziel vorschlagen. Die Lehrpersonen erleben: **Guter Kontext = bessere KI-Antworten.**

### Struktur des Ziels (4 Dimensionen)

| Dimension | Frage |
| --- | --- |
| Kontext | In welchem Fach / welcher Klasse? |
| Absicht | Was werde ich konkret ausprobieren oder verändern? |
| Massnahme | Welcher technische oder didaktische Schritt ist nötig? |
| Termin | Bis wann? In welcher Unterrichtseinheit? |

### Zwei Wege zum Ziel – beide sind möglich

**Option A – Direkt auf der Plattform (`/reflexion/ziel`)**
Der Kontext-Stack wird automatisch als System-Prompt verwendet. KI-Chat hilft das Ziel zu formulieren. Lehrperson sieht das Ergebnis direkt auf der Plattform.

**Option B – Export + externes KI-Tool**
Lehrperson exportiert ihren gesamten Kontext als formatierten Text. Sie öffnet ein beliebiges KI-Tool (ChatGPT, Copilot, Claude) und arbeitet dort weiter.

**Beide Optionen zusammen sind ideal.** Der Export macht Context Engineering sichtbar und greifbar – die Lehrpersonen sehen, was im Hintergrund passiert, und können es auf andere Situationen übertragen.

### Der Export – pädagogisch und praktisch

Der Export ist nicht nur ein technisches Feature. Er ist **das Lernmoment für Context Engineering**: Die Lehrperson sieht das erste Mal den vollständigen Kontext-Stack als Text und versteht: *Das ist es, was einer KI wirklich hilft.*

**Format:** Markdown-Text, der direkt in ein KI-Tool eingefügt werden kann.

**Inhalt des Exports:**

```
# Mein Reflexionskontext – [Datum]

## Mein Profil
[Name, Beschreibung, Stärken aus Lern-Code]

## Meine Situation
[Originalbeschreibung + KI-Zusammenfassung]

## Strategie A – Kognitive Aktivierung (★★★☆☆)
[Gesprächsverlauf + Selbsteinschätzung]

## Strategie B – Professionelles Erleben (★★★★☆)
[Gesprächsverlauf + Selbsteinschätzung]

## Strategie E – Berufsbild der Lernenden (★★★☆☆)
[Gesprächsverlauf + Selbsteinschätzung]

---
Vorschlag für den nächsten Prompt:
"Basierend auf diesem Kontext: Formuliere mir ein konkretes,
umsetzbares KI-Ziel für meine nächste Unterrichtseinheit."
```

**Formate:** Markdown-Kopieren (für KI-Tools) + PDF-Drucken (für Unterlagen).

### Ablauf auf `/reflexion/ziel`

1. Plattform zeigt den Kontext-Stack als Vorschau – **Transparenz**: Lehrperson sieht, was die KI "weiss"
2. **Zwei Buttons:** "Hier auf der Plattform weiterarbeiten" | "Kontext exportieren"
3. **Plattform-Weg:** KI-Chat formuliert Ziel basierend auf dem gesamten Kontext; Lehrperson passt an
4. **Export-Weg:** Markdown-Text in Zwischenablage kopieren oder als PDF laden; Lehrperson arbeitet im eigenen KI-Tool
5. Formuliertes Ziel kann auf der Plattform gespeichert werden (auch wenn es extern erarbeitet wurde)
6. Ergebnis: druckbare Zielkarte

### Offene Gestaltungsfragen

- Soll das Ziel im Plenum **geteilt** werden (vorlesen, anonyme Wordcloud, o.ä.)?
- Soll eine **Erinnerung** nach 3–4 Wochen verschickt werden?
- Wie verbindlich soll die Formulierung sein – explorativ oder als Selbstverpflichtung?

---

## Technische Einschätzung: Ist die Plattform bereit?

| Komponente | Status |
| --- | --- |
| Warmup → Top-3-Empfehlung | Fast fertig: `.slice(0, 3)` ergänzen |
| Situation + Audio | Fertig |
| Reflexions-Module (A–E) | Fertig |
| Kontext-Stack speichern | Fertig (ReflexionContext + Supabase) |
| Hub / Cockpit | Fertig |
| Export-Funktion (Markdown + PDF) | Noch zu bauen |
| `/reflexion/ziel` mit KI-Chat | Noch zu bauen |
