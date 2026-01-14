"use client";

import { useState } from "react";

// Quiz-Fragen Definition
// WICHTIG: Der Kurs ist für EINSTEIGER konzipiert (didaktische Personas)
// Wenig Vorkenntnisse + Unsicherheit = HOHE Punktzahl = IDEAL
// Viele Vorkenntnisse = NIEDRIGE Punktzahl = vermutlich zu einfach
const QUESTIONS = [
  {
    id: 1,
    question: "Wie häufig nutzen Sie aktuell KI-Tools in Ihrer Unterrichtsvorbereitung oder Ihrem Berufsalltag?",
    options: [
      { text: "Noch nie oder sehr selten", points: 3 },
      { text: "Gelegentlich (1–2 Mal pro Monat)", points: 2 },
      { text: "Regelmässig (mehrmals pro Woche)", points: 1 },
      { text: "Täglich", points: 0 },
    ],
  },
  {
    id: 2,
    question: "Wie schätzen Sie Ihr Verständnis von KI-Werkzeugen wie ChatGPT, Copilot etc. ein?",
    options: [
      { text: "Ich kenne diese Tools nicht oder habe sie noch nie verwendet", points: 3 },
      { text: "Ich habe davon gehört, aber noch nicht ausprobiert", points: 3 },
      { text: "Ich habe erste Versuche gemacht, bin aber unsicher", points: 2 },
      { text: "Ich nutze sie bereits gezielt für bestimmte Aufgaben", points: 0 },
    ],
  },
  {
    id: 3,
    question: "Welche Aussage trifft am ehesten auf Sie zu?",
    options: [
      { text: "Ich bin skeptisch, ob KI für meinen Unterricht relevant ist", points: 3 },
      { text: "Ich bin neugierig auf KI, weiss aber nicht, wo ich anfangen soll", points: 3 },
      { text: "Ich möchte lernen, wie KI mich konkret entlasten kann", points: 2 },
      { text: "Ich nutze KI bereits und suche nur noch einzelne Tipps", points: 0 },
    ],
  },
  {
    id: 4,
    question: "Was beschreibt Ihre Situation am besten?",
    options: [
      { text: "Ich fühle mich oft überlastet und brauche dringend Entlastung", points: 3 },
      { text: "Ich möchte mich mit KI auseinandersetzen, aber in meinem Tempo", points: 3 },
      { text: "Ich will verstehen, was KI kann – ohne Druck", points: 2 },
      { text: "Ich suche fortgeschrittene Strategien, Basics kenne ich", points: 0 },
    ],
  },
];

// Empfehlungslogik basierend auf Gesamtpunktzahl
// UMGEKEHRTE LOGIK: Hohe Punkte = wenig Vorkenntnisse = IDEAL für diesen Kurs
// 9-12 Punkte: PERFEKTE ZIELGRUPPE - Einsteiger, skeptisch oder überlastet
// 5-8 Punkte: GUT - Kurs könnte hilfreich sein
// 0-4 Punkte: ZU FORTGESCHRITTEN - Kurs vermutlich zu einfach
function getRecommendation(totalPoints: number) {
  if (totalPoints >= 9) {
    return {
      type: "ideal" as const,
      title: "Dieser Kurs ist genau für Sie gemacht",
      description: "Sie sind die perfekte Zielgruppe für diese Weiterbildung. Der Kurs wurde bewusst so konzipiert, dass er auch ohne Vorkenntnisse verständlich ist und Sie Schritt für Schritt begleitet. Sie erhalten klare Orientierung, praktische Entlastung und müssen nichts 'schon können'. Hier ist Raum für Unsicherheit und kritische Fragen.",
      action: "Perfekt, ich starte",
      color: "green",
    };
  } else if (totalPoints >= 5) {
    return {
      type: "start" as const,
      title: "Dieser Kurs könnte gut für Sie passen",
      description: "Sie bringen bereits erste Erfahrungen mit, sind aber noch unsicher oder suchen Systematik. Der Kurs wird Ihnen helfen, ein solideres Fundament aufzubauen und KI gezielt als Werkzeug für Entlastung einzusetzen. Manche Inhalte kennen Sie vielleicht schon, aber die strukturierte Herangehensweise kann trotzdem wertvoll sein.",
      action: "Kurs starten",
      color: "yellow",
    };
  } else {
    return {
      type: "advanced" as const,
      title: "Dieser Kurs ist vermutlich zu einfach für Sie",
      description: "Sie nutzen KI bereits regelmässig und verfügen über solide Vorkenntnisse. Dieser Kurs ist bewusst einsteigerfreundlich konzipiert und behandelt vor allem Grundlagen. Für Sie könnte er zu wenig Tiefe bieten. Falls Sie trotzdem teilnehmen möchten, können Sie gezielt einzelne Module überspringen oder als schnelle Auffrischung nutzen.",
      action: "Trotzdem ansehen",
      color: "blue",
    };
  }
}

export function RelevanceQuiz() {
  // State: aktuell angezeigte Frage (null = Start, -1 = Ergebnis)
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  // State: ausgewählte Antworten (Question-ID → gewählte Punkte)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  // State: ob Quiz gestartet wurde
  const [isStarted, setIsStarted] = useState(false);

  // Quiz starten
  function startQuiz() {
    setIsStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  }

  // Antwort auswählen und zur nächsten Frage gehen
  function selectAnswer(questionId: number, points: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
    
    // Kurze Verzögerung für besseres UX-Feedback
    setTimeout(() => {
      if (currentQuestion !== null && currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz beendet, zeige Ergebnis
        setCurrentQuestion(-1);
      }
    }, 300);
  }

  // Quiz zurücksetzen
  function resetQuiz() {
    setIsStarted(false);
    setCurrentQuestion(null);
    setAnswers({});
  }

  // Berechne Gesamtpunktzahl
  const totalPoints = Object.values(answers).reduce((sum, points) => sum + points, 0);
  const recommendation = currentQuestion === -1 ? getRecommendation(totalPoints) : null;

  // Farbklassen für unterschiedliche Empfehlungstypen
  const colorClasses = {
    zinc: {
      bg: "bg-zinc-50",
      border: "border-zinc-300",
      icon: "bg-zinc-200 text-zinc-700",
      button: "bg-zinc-700 hover:bg-zinc-800 focus:ring-zinc-300",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-300",
      icon: "bg-yellow-200 text-yellow-700",
      button: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-300",
      icon: "bg-green-200 text-green-700",
      button: "bg-green-600 hover:bg-green-700 focus:ring-green-300",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      icon: "bg-blue-200 text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
    },
  };

  // Wenn Quiz noch nicht gestartet → zeige Start-Button
  if (!isStarted) {
    return (
      <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-zinc-900 shadow-md">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-zinc-950">
              Ist dieser Kurs das Richtige für Sie?
            </h2>
            <p className="mt-2 text-base leading-7 text-zinc-700">
              In nur <strong>4 kurzen Fragen</strong> finden Sie heraus, ob diese Weiterbildung 
              zu Ihrer aktuellen Situation passt und welchen Nutzen Sie daraus ziehen können.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={startQuiz}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-base font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 10h10M12 7l3 3-3 3" />
            </svg>
            Quiz starten
          </button>
        </div>
      </div>
    );
  }

  // Wenn Ergebnis angezeigt werden soll
  if (currentQuestion === -1 && recommendation) {
    const colors = colorClasses[recommendation.color as keyof typeof colorClasses];
    
    return (
      <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 shadow-lg`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colors.icon} shadow-md`}>
            {recommendation.type === "ideal" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            {recommendation.type === "start" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20" />
              </svg>
            )}
            {recommendation.type === "advanced" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-zinc-950">
              {recommendation.title}
            </h3>
            <p className="mt-2 text-base leading-7 text-zinc-700">
              {recommendation.description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/step/1"
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl ${colors.button} px-6 text-base font-semibold text-white shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-4`}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M12 7l3 3-3 3" />
            </svg>
            {recommendation.action}
          </a>
          <button
            onClick={resetQuiz}
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-zinc-300 bg-white px-6 text-base font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Quiz wiederholen
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-white/50 p-4">
          <p className="text-xs text-zinc-600">
            <strong className="text-zinc-900">Ihre Punktzahl: {totalPoints}/{QUESTIONS.length * 3}</strong> – 
            Diese Empfehlung basiert auf Ihren Angaben und dient als Orientierungshilfe. 
            Der Kurs ist bewusst einsteigerfreundlich konzipiert. Je weniger Vorkenntnisse Sie haben, 
            desto besser passt er zu Ihrer Situation.
          </p>
        </div>
      </div>
    );
  }

  // Zeige aktuelle Frage
  if (currentQuestion !== null) {
    const question = QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <div className="rounded-2xl border-2 border-yellow-400 bg-white p-8 shadow-lg">
        {/* Fortschrittsbalken */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700">
              Frage {currentQuestion + 1} von {QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-zinc-500">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Frage */}
        <h3 className="text-xl font-bold text-zinc-950">
          {question.question}
        </h3>

        {/* Antwortoptionen */}
        <div className="mt-6 space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(question.id, option.points)}
              className="w-full rounded-xl border-2 border-zinc-200 bg-white p-4 text-left text-base text-zinc-900 transition-all hover:border-yellow-400 hover:bg-yellow-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Abbrechen-Link */}
        <div className="mt-6 text-center">
          <button
            onClick={resetQuiz}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
          >
            Quiz abbrechen
          </button>
        </div>
      </div>
    );
  }

  return null;
}

