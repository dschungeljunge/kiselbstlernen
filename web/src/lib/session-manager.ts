/**
 * Session Manager – Anonyme Fortschritts-Speicherung
 * 
 * Generiert Session-Codes und verwaltet Lernfortschritte
 */

interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

interface SessionData {
  sessionCode: string;
  profile: ProfileData | null;
  currentStep: number;
  completedSteps: number[];
  stepData: Record<string, any>;
}

/**
 * Generiert einen Session-Code aus dem Profil-Namen
 * Format: 6 Zeichen (Großbuchstaben + Zahlen)
 * Beispiel: "HL9HML", "K3X7PN"
 */
export function generateSessionCode(profileName?: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Ohne I, O, 0, 1 (Verwechslungsgefahr)
  let code = "";
  
  // Wenn Profil-Name vorhanden, nutze erste Buchstaben als Hint
  if (profileName) {
    const words = profileName
      .split(" ")
      .filter((w) => w.length > 2)
      .slice(0, 2);
    
    if (words.length >= 2) {
      code = words
        .map((w) => w[0].toUpperCase())
        .join("")
        .slice(0, 2);
    }
  }
  
  // Rest auffüllen mit Random
  while (code.length < 6) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return code;
}

/**
 * Formatiert Session-Code für bessere Lesbarkeit
 * "HL9HML" → "HL9-HML"
 */
export function formatSessionCode(code: string): string {
  if (code.length === 6) {
    return `${code.slice(0, 3)}-${code.slice(3)}`;
  }
  return code;
}

/**
 * Speichert Session im localStorage (client-side Cache)
 */
export function saveSessionToLocal(sessionCode: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("canvas_session_code", sessionCode);
  }
}

/**
 * Lädt Session aus localStorage
 */
export function loadSessionFromLocal(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("canvas_session_code");
  }
  return null;
}

/**
 * Löscht Session aus localStorage
 */
export function clearSessionFromLocal() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("canvas_session_code");
  }
}



