"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  createEmptyLessonDocument,
  type ConclusionData,
  type DimensionCode,
  type DimensionReflectionData,
  type LessonDescriptionData,
  type LessonReflectionDocument,
} from "@/lib/reflexion-redesign";

export interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Legacy-Typen für ältere API-Routen und Export-Hilfen, die nach dem Redesign
// nicht mehr von der UI verwendet werden.
export interface SituationData {
  text: string;
  kiZusammenfassung: string;
  prompt?: string;
}

export interface StrategyData {
  chatHistory: Message[];
  formAnswers: Record<string, string>;
  interactiveAnswers: Record<string, unknown>;
  selbsteinschaetzung: number;
  naechsterSchritt: string;
  abgeschlossen: boolean;
}

interface ReflexionState {
  sessionCode: string | null;
  profile: ProfileData | null;
  lesson: LessonReflectionDocument;
  isLoading: boolean;
  isSaving: boolean;
}

interface ReflexionContextType extends ReflexionState {
  setProfile: (profile: ProfileData) => void;
  updateDescription: (data: Partial<LessonDescriptionData>) => void;
  updateDimension: (
    code: DimensionCode,
    data: Partial<DimensionReflectionData>
  ) => void;
  updateConclusion: (data: Partial<ConclusionData>) => void;
  saveToDatabase: (overrides?: Partial<LessonReflectionDocument>) => Promise<string | null>;
  publishLesson: () => Promise<void>;
}

const ReflexionContext = createContext<ReflexionContextType | null>(null);

export function ReflexionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ReflexionState>({
    sessionCode: null,
    profile: null,
    lesson: createEmptyLessonDocument(),
    isLoading: true,
    isSaving: false,
  });

  useEffect(() => {
    const code =
      typeof window !== "undefined"
        ? localStorage.getItem("canvas_session_code")
        : null;

    if (!code) {
      queueMicrotask(() => {
        setState((prev) => ({ ...prev, isLoading: false }));
      });
      return;
    }

    const sessionCode = code;

    async function load() {
      try {
        const [sessionResponse, lessonResponse] = await Promise.all([
          fetch("/api/session/load", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionCode }),
          }),
          fetch(`/api/reflection/lesson?sessionCode=${encodeURIComponent(sessionCode)}`),
        ]);

        const sessionData = sessionResponse.ok ? await sessionResponse.json() : {};
        const lessonData = lessonResponse.ok ? await lessonResponse.json() : {};
        const emptyDoc = createEmptyLessonDocument();
        const loadedLesson = lessonData.lesson
          ? {
              ...emptyDoc,
              ...lessonData.lesson,
              description: {
                ...emptyDoc.description,
                ...lessonData.lesson.description,
              },
              dimensions: Object.fromEntries(
                Object.entries(emptyDoc.dimensions).map(([code, defaults]) => {
                  const incoming = (lessonData.lesson.dimensions ?? {})[code] ?? {};
                  return [
                    code,
                    {
                      ...defaults,
                      ...incoming,
                      answers: { ...defaults.answers, ...(incoming.answers ?? {}) },
                      choices: { ...defaults.choices, ...(incoming.choices ?? {}) },
                      interactiveAnswers: {
                        ...defaults.interactiveAnswers,
                        ...(incoming.interactiveAnswers ?? {}),
                      },
                    },
                  ];
                }),
              ) as typeof emptyDoc.dimensions,
              conclusion: {
                ...emptyDoc.conclusion,
                ...lessonData.lesson.conclusion,
              },
            }
          : emptyDoc;

        setState((prev) => ({
          ...prev,
          sessionCode,
          profile: sessionData.profile ?? null,
          lesson: loadedLesson,
          isLoading: false,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          sessionCode,
          isLoading: false,
        }));
      }
    }

    void load();
  }, []);

  const setProfile = useCallback((profile: ProfileData) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const updateDescription = useCallback((data: Partial<LessonDescriptionData>) => {
    setState((prev) => ({
      ...prev,
      lesson: {
        ...prev.lesson,
        description: {
          ...prev.lesson.description,
          ...data,
        },
      },
    }));
  }, []);

  const updateDimension = useCallback(
    (code: DimensionCode, data: Partial<DimensionReflectionData>) => {
      setState((prev) => {
        const current = prev.lesson.dimensions[code];
        return {
          ...prev,
          lesson: {
            ...prev.lesson,
            dimensions: {
              ...prev.lesson.dimensions,
              [code]: {
                ...current,
                ...data,
                answers: {
                  ...(current.answers ?? {}),
                  ...(data.answers ?? {}),
                },
                choices: {
                  ...(current.choices ?? {}),
                  ...(data.choices ?? {}),
                },
                interactiveAnswers: {
                  ...(current.interactiveAnswers ?? {}),
                  ...(data.interactiveAnswers ?? {}),
                },
              },
            },
          },
        };
      });
    },
    []
  );

  const updateConclusion = useCallback((data: Partial<ConclusionData>) => {
    setState((prev) => ({
      ...prev,
      lesson: {
        ...prev.lesson,
        conclusion: {
          ...prev.lesson.conclusion,
          ...data,
        },
      },
    }));
  }, []);

  const saveToDatabase = useCallback(async (overrides?: Partial<LessonReflectionDocument>) => {
    const currentState = await new Promise<ReflexionState>((resolve) => {
      setState((prev) => {
        resolve(prev);
        return prev;
      });
    });

    if (!currentState.sessionCode) return null;
    const lessonToSave = {
      ...currentState.lesson,
      ...overrides,
      description: {
        ...currentState.lesson.description,
        ...overrides?.description,
      },
      dimensions: {
        ...currentState.lesson.dimensions,
        ...overrides?.dimensions,
      },
      conclusion: {
        ...currentState.lesson.conclusion,
        ...overrides?.conclusion,
      },
    };

    setState((prev) => ({ ...prev, isSaving: true }));
    try {
      const response = await fetch("/api/reflection/lesson/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode: currentState.sessionCode,
          lesson: lessonToSave,
        }),
      });
      const payload = await response.json();
      const lessonId = payload.lessonId ?? lessonToSave.lessonId ?? null;

      setState((prev) => ({
        ...prev,
        lesson: {
          ...lessonToSave,
          lessonId,
        },
        isSaving: false,
      }));
      return lessonId;
    } catch {
      setState((prev) => ({ ...prev, isSaving: false }));
      return null;
    }
  }, []);

  const publishLesson = useCallback(async () => {
    const currentState = await new Promise<ReflexionState>((resolve) => {
      setState((prev) => {
        resolve(prev);
        return prev;
      });
    });

    if (!currentState.sessionCode) return;

    await fetch("/api/reflection/lesson/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionCode: currentState.sessionCode,
        lessonId: currentState.lesson.lessonId,
      }),
    });
  }, []);

  return (
    <ReflexionContext.Provider
      value={{
        ...state,
        setProfile,
        updateDescription,
        updateDimension,
        updateConclusion,
        saveToDatabase,
        publishLesson,
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
