"use client";

/**
 * SessionContext – Fortschritts-Management für den linearen Kurs
 *
 * Lädt die Session aus dem Lern-Code (localStorage) und stellt
 * updateProgress / markStepCompleted für alle Step-Seiten bereit.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { loadSessionFromLocal, saveSessionToLocal } from "@/lib/session-manager";

interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

interface SessionState {
  sessionCode: string | null;
  profile: ProfileData | null;
  currentStep: number;
  completedSteps: number[];
  stepData: Record<string, unknown>;
  isLoading: boolean;
}

interface LoadSessionResult {
  success: boolean;
  currentStep?: number;
}

interface SessionContextType extends SessionState {
  updateProgress: (step: number) => Promise<void>;
  markStepCompleted: (step: number) => Promise<void>;
  setProfile: (profile: ProfileData, code: string) => void;
  refreshSession: () => Promise<void>;
  loadSession: (code: string) => Promise<LoadSessionResult>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>({
    sessionCode: null,
    profile: null,
    currentStep: 1,
    completedSteps: [],
    stepData: {},
    isLoading: true,
  });

  const loadSession = useCallback(async (code: string): Promise<LoadSessionResult> => {
    try {
      const res = await fetch("/api/session/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode: code }),
      });
      if (!res.ok) return { success: false };
      const data = await res.json();
      if (data.error) return { success: false };
      setState({
        sessionCode: code,
        profile: data.profile ?? null,
        currentStep: data.currentStep ?? 1,
        completedSteps: data.completedSteps ?? [],
        stepData: data.stepData ?? {},
        isLoading: false,
      });
      saveSessionToLocal(code);
      return { success: true, currentStep: data.currentStep ?? 1 };
    } catch {
      setState((prev) => ({ ...prev, sessionCode: code, isLoading: false }));
      return { success: false };
    }
  }, []);

  useEffect(() => {
    const code = loadSessionFromLocal();
    if (code) {
      loadSession(code);
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [loadSession]);

  const saveProgress = useCallback(
    async (updates: Partial<{ currentStep: number; completedSteps: number[] }>) => {
      const code =
        updates.currentStep !== undefined
          ? state.sessionCode
          : state.sessionCode;
      if (!code) return;

      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode: code, ...updates }),
      });
    },
    [state.sessionCode]
  );

  const updateProgress = useCallback(
    async (step: number) => {
      setState((prev) => {
        const newStep = Math.max(prev.currentStep, step);
        if (newStep !== prev.currentStep) {
          saveProgress({ currentStep: newStep });
        }
        return { ...prev, currentStep: newStep };
      });
    },
    [saveProgress]
  );

  const markStepCompleted = useCallback(
    async (step: number) => {
      setState((prev) => {
        if (prev.completedSteps.includes(step)) return prev;
        const updated = [...prev.completedSteps, step];
        saveProgress({ completedSteps: updated });
        return { ...prev, completedSteps: updated };
      });
    },
    [saveProgress]
  );

  const setProfile = useCallback((profile: ProfileData, code: string) => {
    setState((prev) => ({ ...prev, profile, sessionCode: code }));
  }, []);

  const refreshSession = useCallback(async () => {
    const code = state.sessionCode ?? loadSessionFromLocal();
    if (code) await loadSession(code);
  }, [state.sessionCode, loadSession]);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        updateProgress,
        markStepCompleted,
        setProfile,
        refreshSession,
        loadSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
