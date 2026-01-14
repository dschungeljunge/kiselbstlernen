# Canvas – Schulinterne KI‑Weiterbildungsplattform

## 1\. Ziel & Zweck des Prototyps

**Primäres Ziel (Pilot):**  
Validierung, ob ein strukturiertes, KI‑gestütztes Weiterbildungsformat (AI‑Circle: Herausforderung → Strategie → Proof of Concept) im realen Schulkontext genutzt wird und Transfer in die Unterrichtspraxis auslöst.

**Sekundäres Ziel (Skalierung):**  
Technische und konzeptionelle Grundlage schaffen, um das Angebot später für weitere Schulen oder Einzelpersonen zu öffnen, ohne das System neu zu bauen.

---

## 2\. Zielgruppe (Pilot)

*   Lehrpersonen einer einzelnen Schule (geschlossene Nutzergruppe)
*   1–2 interne oder externe Kursverantwortliche (Dozierende/Coaches)

**Implikation:**  
Kein öffentlicher Zugang, kein Marketing, kein Payment im Pilot.

---

## 3\. Didaktisches Kernmodell

**AI‑Circle als Daten‑ und Strukturprinzip:**  
Jede Lerneinheit ist strikt gegliedert in:

1.  **Herausforderung** – reale schulische Situation / Problemstellung
2.  **Strategie** – Denkwerkzeuge, Prinzipien, KI‑Nutzungsstrategien
3.  **Proof of Concept** – konkrete Anwendung im eigenen Unterrichtskontext

➡️ Diese drei Elemente sind **eigene Felder/Objekte** im System (keine rein textuelle Beschreibung).

---

## 4\. Funktionaler Umfang (Prototype Scope)

### 4.1 Nutzer & Zugang

**Prototype (Pilot):**

*   Manuelle Nutzerverwaltung (vordefinierte Userliste)
*   Rollen:
    *   Teilnehmende Lehrperson
    *   Kursverantwortliche:r

**Skalierungsfähig angelegt für später:**

*   Rollen erweiterbar (Admin, School‑Admin, Coach)
*   Mandantenfähigkeit (Schulen/Organisationen) vorbereitet, aber nicht aktiviert

---

### 4.2 Kurs- & Lernpfadstruktur

**Prototype:**

*   1 Kurs
*   3–4 Module
*   Lineare Abfolge (kein freies Navigieren)
*   Sichtbarer Fortschritt (Completed / Not completed)

**Skalierung:**

*   Mehrere Kurse
*   Parallele Lernpfade / Tracks
*   Wiederverwendbare AI‑Circle‑Templates

---

### 4.3 Content

**Prototype:**

*   Videoeinbettung (extern gehostet auf loom.com)
*   PDF / Dokument‑Downloads
*   Prompt‑Beispiele als Text mit Copy‑Funktion

**Skalierung:**

*   Versionierung von Inhalten
*   Prompt‑Bibliotheken
*   Adaptive Content‑Varianten

---

### 4.4 Proof of Concept (Transfer‑Element)

**Prototype (kritisches Element):**

*   Abgabeformate:
    *   Freitext (Reflexion / Plan)
    *   Datei‑Upload oder Link
*   Sichtbarkeit: privat (Coach‑Feedback möglich)
*   Kommentar‑Funktion für Kursverantwortliche

**Skalierung:**

*   Review‑Workflows (Einreichen → Feedback → Überarbeitung)
*   Freigabe in Gruppen / Showcase
*   Rubrics / Kompetenzraster

---

### 4.5 Austausch & Reflexion

**Prototype:**

*   Diskussionsbereich pro Modul
*   Textbasierte Beiträge + Antworten
*   Keine Likes, keine Profile, keine Feeds

**Skalierung:**

*   Themenkanäle
*   Kohorten‑Communities
*   Moderationstools

---

### 4.6 Lernstand & Monitoring

**Prototype:**

*   Grundlegender Fortschritt pro Modul
*   Übersicht für Kursverantwortliche (wer ist wo?)

**Skalierung:**

*   Kohorten‑Analysen
*   Drop‑off‑Erkennung
*   Export‑Funktionen

---

## 5\. Nicht enthalten im Prototyp (bewusst ausgeschlossen)

*   Öffentliche Landingpages
*   Payment & Rechnungslogik
*   Zertifikate / Badges
*   Automatisiertes KI‑Feedback
*   Umfassende Analytics
*   Support‑Ticketsystem

➡️ Diese Elemente werden **architektonisch mitgedacht**, aber nicht implementiert.

---

## 6\. Technologischer Stack

### 6.1 Frontend

*   **Next.js (App Router, TypeScript)**
*   UI: Tailwind CSS + komponentenbasierte UI‑Library
*   Deployment: **Vercel**

**Begründung:**  
Schnelle Iteration, saubere Trennung von UI und Logik, später gut skalierbar.

---

### 6.2 Backend & Daten

*   **Supabase**
    *   PostgreSQL (Hauptdatenbank)
    *   Auth (Magic Link)
    *   Storage (Dokumente, Abgaben)
    *   Row Level Security (RLS)

**Kernprinzip:**  
Sauberes Datenmodell (User, Kurs, Modul, AI‑Circle‑Elemente, Abgaben, Fortschritt).

---

### 6.3 Funktionen / Automationen

*   Supabase Edge Functions (optional im Prototyp)
    *   später: Zertifikate, Payment‑Hooks, Admin‑Automationen

---

### 6.4 Video & Medien

*   Externes Video‑Hosting (z. B. Vimeo, Cloudflare Stream)
*   Einbettung im Kursplayer

**Begründung:**  
Keine Bandbreiten‑ oder Transcoding‑Komplexität im Prototyp.

---

### 6.5 Entwicklungsumgebung

*   **Cursor.ai** als primäre Entwicklungsumgebung
*   Versionskontrolle via Git (GitHub)

---

## 7\. Skalierungsprinzipien (Leitplanken)

*   Datenmodell > Feature‑Logik
*   Rollen & Rechte immer explizit modellieren
*   AI‑Circle bleibt strukturelles Grundelement
*   Features werden ergänzt, nicht ersetzt
*   Pilot‑Erkenntnisse steuern Prioritäten (nicht Annahmen)

---

## 8\. Erfolgskriterien des Prototyps

*   Lehrpersonen reichen Proof‑of‑Concepts ein
*   Plattform wird nicht umgangen (Mail, Word, Teams)
*   Transfer in Unterrichtssituationen wird sichtbar
*   Kursverantwortliche können Lernprozesse begleiten, ohne Mehraufwand

**Wenn diese Punkte nicht erfüllt sind, ist Skalierung irrelevant.**

---

## 9\. Datenschutz & Risiko (Pilot‑Leitplanken)

Der Pilot ist im Schulkontext bewusst so geschnitten, dass **personenbezogene Daten minimiert** und Inhalte so gestaltet werden, dass sie ohne Personendaten von Lernenden/Eltern/Kolleg:innen bearbeitet werden können. Kritisch sind insbesondere PoC‑Uploads/Links, Chat‑Eingaben sowie die rollenbasierte Sichtbarkeit (Teilnehmende vs. Kursverantwortliche).

Die operative Datenschutz‑Notiz inkl. Aufbewahrung/Löschungsvorschlägen und Go‑Live‑Risiko‑Checkliste ist in `datenschutz_pilot.md` dokumentiert und gilt als verbindliche Leitplanke für UX‑Copy (Hinweistexte) und technische Zugriffskontrollen (RLS/Storage).