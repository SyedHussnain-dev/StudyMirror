"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionRecord, StreakData, InterviewMode, Message, Evaluation } from "./types";

interface AppStore {
  // Session history
  sessions: SessionRecord[];
  addSession: (session: SessionRecord) => void;
  updateSession: (id: string, updates: Partial<SessionRecord>) => void;
  deleteSession: (id: string) => void;
  getSessionById: (id: string) => SessionRecord | undefined;
  getRecentSessions: (limit?: number) => SessionRecord[];

  // Streak tracking
  streak: StreakData;
  recordStudySession: () => void;

  // Current session
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;

  // UI state
  soundEnabled: boolean;
  toggleSound: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getDayKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        totalSessions: 0,
        weeklyActivity: {},
      },
      currentSessionId: null,
      soundEnabled: true,
      sidebarOpen: false,

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      getSessionById: (id) => {
        return get().sessions.find((s) => s.id === id);
      },

      getRecentSessions: (limit = 10) => {
        return get().sessions.slice(0, limit);
      },

      recordStudySession: () => {
        const today = getTodayKey();
        const { streak } = get();

        if (streak.lastStudyDate === today) {
          // Already studied today, just increment total
          set((state) => ({
            streak: {
              ...state.streak,
              totalSessions: state.streak.totalSessions + 1,
              weeklyActivity: {
                ...state.streak.weeklyActivity,
                [today]: (state.streak.weeklyActivity[today] || 0) + 1,
              },
            },
          }));
          return;
        }

        // Check if streak continues (studied yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = getDayKey(yesterday);

        const isStreakContinued = streak.lastStudyDate === yesterdayKey;
        const newCurrentStreak = isStreakContinued ? streak.currentStreak + 1 : 1;
        const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

        set((state) => ({
          streak: {
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastStudyDate: today,
            totalSessions: state.streak.totalSessions + 1,
            weeklyActivity: {
              ...state.streak.weeklyActivity,
              [today]: (state.streak.weeklyActivity[today] || 0) + 1,
            },
          },
        }));
      },

      setCurrentSessionId: (id) => set({ currentSessionId: id }),

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "studymirror-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        streak: state.streak,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);

export function createSession(
  topic: string,
  mode: InterviewMode
): SessionRecord {
  return {
    id: crypto.randomUUID(),
    topic,
    mode,
    messages: [],
    evaluation: null,
    createdAt: Date.now(),
    completedAt: null,
    messageCount: 0,
  };
}
