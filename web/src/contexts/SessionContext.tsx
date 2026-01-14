/**
 * Session Context – Globaler State für Lern-Sessions
 * 
 * Verwaltet Session-Code, Profil und Fortschritt
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  generateSessionCode,
  saveSessionToLocal,
  loadSessionFromLocal,
} from "@/lib/session-manager";

interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

interface SessionContextType {
  sessionCode: string | null;
  profile: ProfileData | null;
  currentStep: number;
  completedSteps: number[];
  
  // Actions
  createSession: (profile: ProfileData) => Promise<string>;
  loadSession: (code: string) => Promise<boolean>;
  updateProgress: (step: number) => Promise<void>;
  markStepCompleted: (step: number) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Beim Start: Session aus localStorage laden
  useEffect(() => {
    const savedCode = loadSessionFromLocal();
    if (savedCode) {
      loadSession(savedCode);
    }
  }, []);

  // Session erstellen (nach Profil-Chat)
  async function createSession(profileData: ProfileData): Promise<string> {
    const code = generateSessionCode(profileData.name);
    
    try {
      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode: code,
          profile: profileData,
          currentStep: 3, // Profil wurde in Step 3 erstellt
          completedSteps: [1, 2, 3],
          stepData: {},
        }),
      });

      setSessionCode(code);
      setProfile(profileData);
      setCurrentStep(3);
      setCompletedSteps([1, 2, 3]);
      saveSessionToLocal(code);

      return code;
    } catch (error) {
      console.error("Session-Erstellung fehlgeschlagen:", error);
      throw error;
    }
  }

  // Session laden (via Code-Eingabe)
  async function loadSession(code: string): Promise<boolean> {
    try {
      const response = await fetch("/api/session/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode: code.toUpperCase().replace("-", "") }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      
      setSessionCode(data.sessionCode);
      setProfile(data.profile);
      setCurrentStep(data.currentStep);
      setCompletedSteps(data.completedSteps);
      saveSessionToLocal(data.sessionCode);

      return true;
    } catch (error) {
      console.error("Session-Laden fehlgeschlagen:", error);
      return false;
    }
  }

  // Fortschritt aktualisieren
  async function updateProgress(step: number) {
    if (!sessionCode) return;

    setCurrentStep(step);

    try {
      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode,
          profile,
          currentStep: step,
          completedSteps,
          stepData: {},
        }),
      });
    } catch (error) {
      console.error("Fortschritt-Update fehlgeschlagen:", error);
    }
  }

  // Step als abgeschlossen markieren
  async function markStepCompleted(step: number) {
    if (!sessionCode || completedSteps.includes(step)) return;

    const newCompleted = [...completedSteps, step];
    setCompletedSteps(newCompleted);

    try {
      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode,
          profile,
          currentStep,
          completedSteps: newCompleted,
          stepData: {},
        }),
      });
    } catch (error) {
      console.error("Step-Completion fehlgeschlagen:", error);
    }
  }

  return (
    <SessionContext.Provider
      value={{
        sessionCode,
        profile,
        currentStep,
        completedSteps,
        createSession,
        loadSession,
        updateProgress,
        markStepCompleted,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession muss innerhalb von SessionProvider verwendet werden");
  }
  return context;
}



