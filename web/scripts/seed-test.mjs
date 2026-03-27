/**
 * Seed-Skript – vollständiger Testeintrag
 *
 * Erstellt eine realistische Test-Session mit allen Reflexionsfeldern ausgefüllt.
 * Ausführen: node scripts/seed-test.mjs
 *
 * Session-Code: TEST-DEMO-01
 */

const SUPABASE_URL = "https://zgntjiotlvlrzczxuaol.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_hO464FdYSQcOEICUTuoMHg_9A4Ocab3";
const SESSION_CODE = "TEST-DEMO-01";

// ── Vollständige Reflexionsdaten ──────────────────────────────────

const reflexionData = {
  situation: {
    text: `Ich habe im Fach Allgemeinbildung (ABU) mit meiner 2. Lehrjahr-Klasse (Kaufleute, 18 Personen) ChatGPT eingesetzt. Die Aufgabe war, einen Leserbrief zu einem aktuellen Thema zu verfassen – Thema: Lohngerechtigkeit zwischen den Geschlechtern.

Ich habe den Lernenden gesagt: "Ihr könnt ChatGPT verwenden, um einen ersten Entwurf zu generieren – aber ihr müsst ihn danach inhaltlich überarbeiten und begründen, was ihr geändert habt."

Was passiert ist: Etwa ein Drittel der Klasse hat den KI-Output fast unverändert abgegeben. Ein weiteres Drittel hat inhaltlich angepasst. Und ein Drittel hat die KI gar nicht genutzt und direkt selbst geschrieben.

Was mich überrascht hat: Die Texte der Gruppe, die gar keine KI genutzt hat, waren oft persönlicher und überzeugender – aber sprachlich schwächer. Die KI-Texte klangen professionell, aber manchmal etwas leblos.`,

    kiZusammenfassung: `Lehrperson Kaufmännische Berufsschule, ABU, 2. Lehrjahr. Thema: Leserbrief zu Lohngerechtigkeit. KI-Einsatz als optionales Hilfsmittel mit Überarbeitungsauftrag. Beobachtung: Drei Nutzungsgruppen – unkritische Übernahme, reflektierte Nutzung, Nicht-Nutzung. Spannung zwischen Sprachqualität (KI-Texte) und persönlicher Überzeugungskraft (Nicht-KI-Texte). Lernziel war argumentatives Schreiben.`,

    prompt: `Du hilfst mir, einen überzeugenden Leserbrief zu schreiben. Ich gebe dir meinen ersten Entwurf. Du gibst mir NIE einen fertigen Text zurück. Stattdessen:
1. Nenne mir die stärkste Aussage in meinem Text.
2. Stelle mir eine Frage, die mein Argument schwächer machen könnte – damit ich es stärken kann.
3. Schlage mir vor, welchen Satz ich zuerst überarbeiten sollte.
Warte dann auf meinen überarbeiteten Text.`,
  },

  selectedStrategies: ["a", "b", "e"],

  strategies: {
    a: {
      abgeschlossen: true,
      selbsteinschaetzung: 2,
      naechsterSchritt: "",
      chatHistory: [
        {
          role: "assistant",
          content: "Ich schaue mir deine Situation genauer an: Du hast die Lernenden gebeten, den KI-Output zu überarbeiten und Änderungen zu begründen. Was haben die Lernenden, die den Text übernommen haben, konkret getan – was war ihr Denkprozess, den du beobachten konntest?",
        },
        {
          role: "user",
          content: "Eigentlich kaum etwas. Sie haben den Text gelesen, vielleicht ein Wort geändert, und ihn dann abgegeben. Die Begründung war meistens: 'Ich fand den Text gut so.' Das war frustrierend.",
        },
        {
          role: "assistant",
          content: "Das ist ein klassisches Muster – wenn die KI schon eine akzeptable Antwort liefert, wird der kognitive Aufwand als unnötig empfunden. Die eigentliche Denkaufgabe – ein Argument entwickeln, eine Position einnehmen – wurde von der KI übernommen. Was hätten die Lernenden deiner Meinung nach tun müssen, damit echtes Nachdenken sichtbar wird?",
        },
        {
          role: "user",
          content: "Sie hätten zuerst selbst eine Position entwickeln sollen, und dann erst die KI fragen – nicht umgekehrt. Ich glaube, die Reihenfolge war das Problem.",
        },
        {
          role: "assistant",
          content: "Das ist eine sehr präzise Diagnose. KI als Startpunkt verführt zum Übernehmen – KI als Feedbackgeber für eine bereits entwickelte eigene Position erzwingt Denken. Das ist der Unterschied zwischen 'KI produziert' und 'KI kommentiert meine Arbeit'. Würdest du sagen, die kognitive Aktivierung in dieser Stunde war eher gering, gemischt oder situationsabhängig?",
        },
        {
          role: "user",
          content: "Gemischt bis gering. Das Drittel ohne KI hat wirklich gedacht. Der Rest weniger.",
        },
      ],
      formAnswers: {},
      interactiveAnswers: {
        aktivierung: 30,
        "ki-rolle": ["Fertige Antworten geliefert"],
      },
    },

    b: {
      abgeschlossen: true,
      selbsteinschaetzung: 3,
      naechsterSchritt: "",
      chatHistory: [
        {
          role: "assistant",
          content: "Du hast beschrieben, dass die Nicht-KI-Texte überzeugender waren – das klingt nach einem Moment, der dich nachdenklich gemacht hat. Wie war das für dich als Lehrperson: Hast du dich in dieser Stunde so gefühlt, wie du es dir vorgestellt hattest?",
        },
        {
          role: "user",
          content: "Nein, ehrlich gesagt nicht. Ich hatte das Gefühl, ich beobachte etwas, das ich nicht ganz verstehe. Wer arbeitet gerade wirklich? Ich konnte das nicht einschätzen.",
        },
        {
          role: "assistant",
          content: "Dieses Gefühl – nicht zu wissen, wer wirklich arbeitet – ist etwas, das viele Lehrpersonen beim KI-Einsatz beschreiben. Es geht um Sichtbarkeit des Lernprozesses. Was hätte dir in diesem Moment geholfen, um wieder das Gefühl zu haben, du hast die Situation im Griff?",
        },
        {
          role: "user",
          content: "Wenn ich hätte sehen können, was sie eingeben. Oder wenn ich gezielt hätte nachfragen können. Aber bei 18 Lernenden war das schwierig.",
        },
        {
          role: "assistant",
          content: "Was du beschreibst, ist das Kernproblem von KI im Unterricht: Der Denkprozess wird unsichtbar. Trotzdem klingt es so, als hättest du die Situation nicht als vollständigen Kontrollverlust erlebt – eher als Irritation. Würdest du das so sagen?",
        },
        {
          role: "user",
          content: "Ja, das stimmt. Ich war unsicher, aber nicht überfordert. Ich wusste, ich muss das nächste Mal anders gestalten.",
        },
      ],
      formAnswers: {},
      interactiveAnswers: {
        gefuehle: ["Unsicher", "Nachdenklich", "Neugierig"],
        kontrolle: 45,
      },
    },

    c: {
      abgeschlossen: true,
      selbsteinschaetzung: 3,
      naechsterSchritt: "",
      chatHistory: [],
      formAnswers: {
        c1: "Ich hatte erwartet, dass alle die KI nutzen und dann überarbeiten. Stattdessen drei komplett verschiedene Gruppen – das hat mich überrascht.",
        c2: "Positiv überraschend: Eine Schülerin hat die KI gebeten, ihr Gegenargumente zu ihrem eigenen Text zu liefern – das war kreativ und klug. Negativ: Einige haben einfach abgegeben ohne echte Auseinandersetzung.",
        c3: "Es wurde sichtbar, dass die Selbstständigkeit und das Eigeninitiative-Niveau sehr unterschiedlich sind. Wer eigenständig denken kann und mag, hat die KI besser genutzt.",
        c4: "Ich hätte zuerst eine Positionierung ohne KI verlangen sollen. Dann wäre die Nutzung der KI gezielter und bewusster gewesen.",
      },
      interactiveAnswers: {
        abweichung: 70,
        "nutzung-statements": [2, 4],
        faktoren: [1, 0, 2, 5, 4, 3],
      },
    },

    d: {
      abgeschlossen: true,
      selbsteinschaetzung: 2,
      naechsterSchritt: "",
      chatHistory: [],
      formAnswers: {
        d1: "Die Lernenden sollen ein überzeugendes Argument zu einem gesellschaftlichen Thema selbst entwickeln, strukturieren und sprachlich formulieren können.",
        d2: "Der KI-Einsatz hat das Lernziel bei etwa einem Drittel eher umgangen – die haben das Argument gar nicht selbst entwickelt. Bei einem weiteren Drittel war er neutral. Nur bei wenigen hat er wirklich geholfen.",
        d3: "Für das Lernziel 'eigenständig argumentieren' war KI hier nicht notwendig – im Gegenteil, sie hat es teils verhindert. Für ein anderes Ziel wie 'Texte überarbeiten und verbessern' wäre sie besser geeignet gewesen.",
        d4: "Wer selbst geschrieben hat, kann jetzt besser argumentieren. Wer die KI unkritisch genutzt hat – fraglich.",
      },
      interactiveAnswers: {
        "lernziel-beitrag": 25,
        "ki-notwendigkeit": 30,
        "lernziel-statements": { 0: 2, 1: 4, 2: 2, 3: 3, 4: 2 },
      },
    },

    e: {
      abgeschlossen: true,
      selbsteinschaetzung: 3,
      naechsterSchritt: "",
      chatHistory: [
        {
          role: "assistant",
          content: "Lass mich direkt fragen: Was haben deine Lernenden durch diesen Unterricht implizit über den Beruf Kauffrau/Kaufmann gelernt – besonders über die Bedeutung von schriftlicher Kommunikation im Berufsalltag?",
        },
        {
          role: "user",
          content: "Ich hoffe, dass sie gelernt haben, KI als Hilfsmittel zu sehen. Aber ich befürchte, manche haben gelernt: Schreiben kann die KI für mich erledigen.",
        },
        {
          role: "assistant",
          content: "Das ist eine ehrliche und wichtige Einschätzung. Im kaufmännischen Bereich ist schriftliche Kommunikation – Briefe, E-Mails, Berichte – eine Kernkompetenz. Die Fähigkeit, einen eigenen Standpunkt klar und überzeugend zu formulieren, ist nicht nur sprachlich, sondern professionell bedeutsam. Was denkst du: Werden deine Lernenden in fünf Jahren diese Texte noch selbst schreiben müssen – oder ist das eine Tätigkeit, die KI übernimmt?",
        },
        {
          role: "user",
          content: "Beides wahrscheinlich. Aber sie müssen verstehen, was einen guten Text ausmacht, um KI sinnvoll einzusetzen und Ergebnisse beurteilen zu können. Das Urteil bleibt beim Menschen.",
        },
        {
          role: "assistant",
          content: "Genau das ist der Punkt: Fachkompetenz als Voraussetzung für sinnvolle KI-Nutzung. Ohne eigene argumentative Kompetenz kann ich KI-Output nicht beurteilen. Hat der Unterricht dieses Bewusstsein vermittelt – oder war das implizit geblieben?",
        },
        {
          role: "user",
          content: "Implizit. Ich hätte das explizit ansprechen müssen – warum wir das trotz KI noch selbst üben.",
        },
      ],
      formAnswers: {},
      interactiveAnswers: {
        berufsbild: 40,
        "vermitteltes-bild": ["KI kann viele typische Tätigkeiten übernehmen"],
      },
    },
  },

  ziel: {
    kontext: "ABU Klasse 2. Lehrjahr Kaufleute – nächste Schreibaufgabe (Kommentar zu einem Artikel)",
    absicht: "KI erst nach einer eigenen Erstversion einsetzen – als Feedbackgeber, nicht als Autor",
    massnahme: "Aufgabe in zwei Phasen: Phase 1 ohne KI (eigene Position, 10 Minuten). Phase 2: KI fragen 'Was würde ein Gegner meines Standpunkts sagen?' – dann Überarbeitung.",
    termin: "Nächste ABU-Lektion in 2 Wochen (KW 14)",
    zielsatz: "Ich werde in ABU mit der 2. Klasse die Reihenfolge umkehren: erst eigene Position entwickeln, dann KI als kritischen Gesprächspartner einsetzen – so bleibt das Denken bei den Lernenden.",
    chatHistory: [],
    abgeschlossen: true,
  },
};

// ── Vollständige Session-Daten ────────────────────────────────────

const sessionData = {
  session_code: SESSION_CODE,
  profile_name: "Der Strukturierte",
  profile_description: "Du planst Unterricht sorgfältig und setzt auf klare Strukturen. Du schätzt methodische Vielfalt, aber immer mit einem klaren Ziel.",
  profile_strengths: ["Klare Aufgabenstellung", "Strukturiertes Vorgehen", "Konsequente Lernzielorientierung"],
  current_step: 10,
  completed_steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  reflection_merksatz: "KI ist kein Autor – sie ist ein Werkzeug, das nur dann pädagogisch sinnvoll ist, wenn die Lernenden das Denken selbst übernehmen.",
  step_data: {
    reflexion: reflexionData,
  },
};

// ── Einfügen via Supabase REST API ────────────────────────────────

async function seed() {
  console.log(`\nSeed-Skript startet...`);
  console.log(`Session-Code: ${SESSION_CODE}\n`);

  // Zuerst prüfen ob Session schon existiert
  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/learning_sessions?session_code=eq.${SESSION_CODE}&select=session_code`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const existing = await checkRes.json();

  if (existing.length > 0) {
    // Update
    console.log("Session existiert bereits – wird aktualisiert...");
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/learning_sessions?session_code=eq.${SESSION_CODE}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          profile_name: sessionData.profile_name,
          profile_description: sessionData.profile_description,
          profile_strengths: sessionData.profile_strengths,
          current_step: sessionData.current_step,
          completed_steps: sessionData.completed_steps,
          reflection_merksatz: sessionData.reflection_merksatz,
          step_data: sessionData.step_data,
        }),
      }
    );

    if (updateRes.ok || updateRes.status === 204) {
      console.log("✓ Session erfolgreich aktualisiert.");
    } else {
      const err = await updateRes.text();
      console.error("✗ Fehler beim Update:", err);
    }
  } else {
    // Insert
    console.log("Session wird neu angelegt...");
    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/learning_sessions`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(sessionData),
      }
    );

    if (insertRes.ok || insertRes.status === 201) {
      console.log("✓ Session erfolgreich angelegt.");
    } else {
      const err = await insertRes.text();
      console.error("✗ Fehler beim Insert:", err);
      console.log("\nHinweis: Möglicherweise fehlen Spalten in der DB.");
      console.log("Prüfe ob alle Spalten in 'learning_sessions' vorhanden sind.");
    }
  }

  console.log(`\nTest-URL:\nhttp://localhost:3000/reflexion/hub`);
  console.log(`\nLogin mit Code: ${SESSION_CODE}`);
  console.log(`(localStorage-Key: canvas_session_code)\n`);
}

seed().catch(console.error);
