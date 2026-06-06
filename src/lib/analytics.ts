import type { SessionRecord, StreakData } from "./types";

export interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  bestScore: number;
  topicsStudied: number;
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: Record<string, number>;
  scoreHistory: { date: string; score: number; topic: string }[];
  weakTopics: { topic: string; score: number; lastStudied: number }[];
  categoryBreakdown: Record<string, number>;
}

export function computeDashboardStats(
  sessions: SessionRecord[],
  streak: StreakData
): DashboardStats {
  const completed = sessions.filter((s) => s.evaluation !== null);
  const scores = completed.map((s) => s.evaluation!.overallScore);

  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const uniqueTopics = new Set(sessions.map((s) => s.topic.toLowerCase()));

  const scoreHistory = completed
    .slice(0, 10)
    .map((s) => ({
      date: new Date(s.completedAt || s.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: s.evaluation!.overallScore,
      topic: s.topic,
    }))
    .reverse();

  // Group by topic, keep lowest score as "weak area"
  const topicScores = new Map<string, { score: number; lastStudied: number }>();
  for (const s of completed) {
    const key = s.topic.toLowerCase();
    const existing = topicScores.get(key);
    const score = s.evaluation!.overallScore;
    const ts = s.completedAt || s.createdAt;
    if (!existing || score < existing.score) {
      topicScores.set(key, { score, lastStudied: ts });
    } else if (ts > existing.lastStudied) {
      topicScores.set(key, { ...existing, lastStudied: ts });
    }
  }

  const weakTopics = [...topicScores.entries()]
    .map(([topic, data]) => ({ topic, ...data }))
    .filter((t) => t.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const categoryBreakdown: Record<string, number> = {};
  for (const s of completed) {
    const cats = s.evaluation!.categories;
    const avg =
      (cats.conceptAccuracy +
        cats.depthOfExplanation +
        cats.examplesUsed +
        cats.clarityOfExplanation +
        cats.missingConceptCoverage) /
      5;
    const label = s.mode;
    categoryBreakdown[label] = Math.round(
      ((categoryBreakdown[label] || 0) + avg) / (categoryBreakdown[label] ? 2 : 1)
    );
  }

  return {
    totalSessions: sessions.length,
    completedSessions: completed.length,
    averageScore,
    bestScore,
    topicsStudied: uniqueTopics.size,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    weeklyActivity: streak.weeklyActivity,
    scoreHistory,
    weakTopics,
    categoryBreakdown,
  };
}

export function getLast7DaysActivity(
  weeklyActivity: Record<string, number>
): { day: string; count: number; label: string }[] {
  const days: { day: string; count: number; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days.push({
      day: key,
      count: weeklyActivity[key] || 0,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}
