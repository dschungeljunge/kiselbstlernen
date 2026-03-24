"use client";

/**
 * ReflexionContext – State-Management für /reflexion
 *
 * Verwaltet: Profil aus Lern-Code, Situations-Kontext,
 * gewählte Strategien und Eingaben pro Strategie.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface SituationData {
  text: string;
  kiZusammenfassung: string;
}

export interface StrategyData {
  chatHistory: Message[];
  formAnswers: Record<string, string>;
  interactiveAnswers: Record<string, unknown>;
  selbsteinschaetzung: number;
  naechsterSchritt: string;
  abgeschlossen: boolean;
}

const DEFAULT_STRATEGY_DATA: StrategyData = {
  chatHistory: [],
  formAnswers: {},
  interactiveAnswers: {},
  selbsteinschaetzung: 0,
  naechsterSchritt: "",
  abgeschlossen: false,
};

interface ReflexionState {
  sessionCode: string | null;
  profile: ProfileData | null;
  situation: SituationData | null;
  selectedStrategies: string[];
  strategies: Record<string, StrategyData>;
  isLoading: boolean;
}

interface ReflexionContextType extends ReflexionState {
  setProfile: (profile: ProfileData) => void;
  setSituation: (situation: SituationData) => void;
  setSelectedStrategies: (strategies: string[]) => void;
  updateStrategy: (code: string, data: Partial<StrategyData>) => void;
  saveToDatabase: () => Promise<void>;
  getNextStrategy: (currentCode: string) => string | null;
}

const ReflexionContext = createContext<ReflexionContextType | null>(null);

export function ReflexionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ReflexionState>({
    sessionCode: null,
    profile: null,
    situation: null,
    selectedStrategies: [],
    strategies: {},
    isLoading: true,
  });

  // Session aus localStorage laden + Profil aus Supabase holen
  useEffect(() => {
    const code =
      typeof window !== "undefined"
        ? localStorage.getItem("canvas_session_code")
        : null;

    if (!code) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    fetch("/api/session/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode: code }),
    })
      .then((r) => r.json())
      .then((data) => {
        const reflexionData = data.stepData?.reflexion ?? {};
        setState((prev) => ({
          ...prev,
          sessionCode: code,
          profile: data.profile ?? null,
          situation: reflexionData.situation ?? null,
          selectedStrategies: reflexionData.selectedStrategies ?? [],
          strategies: reflexionData.strategies ?? {},
          isLoading: false,
        }));
      })
      .catch(() => {
        setState((prev) => ({
          ...prev,
          sessionCode: code,
          isLoading: false,
        }));
      });
  }, []);

  const setProfile = useCallback((profile: ProfileData) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const setSituation = useCallback((situation: SituationData) => {
    setState((prev) => ({ ...prev, situation }));
  }, []);

  const setSelectedStrategies = useCallback((strategies: string[]) => {
    setState((prev) => ({ ...prev, selectedStrategies: strategies }));
  }, []);

  const updateStrategy = useCallback(
    (code: string, data: Partial<StrategyData>) => {
      setState((prev) => ({
        ...prev,
        strategies: {
          ...prev.strategies,
          [code]: {
            ...DEFAULT_STRATEGY_DATA,
            ...prev.strategies[code],
            ...data,
          },
        },
      }));
    },
    []
  );

  const saveToDatabase = useCallback(async () => {
    const currentState = await new Promise<ReflexionState>((resolve) => {
      setState((prev) => {
        resolve(prev);
        return prev;
      });
    });

    if (!currentState.sessionCode) return;

    await fetch("/api/reflection/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionCode: currentState.sessionCode,
        reflexionData: {
          situation: currentState.situation,
          selectedStrategies: currentState.selectedStrategies,
          strategies: currentState.strategies,
        },
      }),
    });
  }, []);

  const getNextStrategy = useCallback(
    (currentCode: string): string | null => {
      const selected = state.selectedStrategies;
      const idx = selected.indexOf(currentCode);
      if (idx === -1 || idx === selected.length - 1) return null;
      return selected[idx + 1];
    },
    [state.selectedStrategies]
  );

  return (
    <ReflexionContext.Provider
      value={{
        ...state,
        setProfile,
        setSituation,
        setSelectedStrategies,
        updateStrategy,
        saveToDatabase,
        getNextStrategy,
      }}
    >
      {children}
    </ReflexionContext.Provider>
  );
}

export function useReflexion(): ReflexionContextType {
  const ctx = useContext(ReflexionContext);
  if (!ctx)
    throw new Error("useReflexion must be used within ReflexionProvider");
  return ctx;
}
