export type Mode = "beginner" | "viva" | "strict";
export type InterviewMode = Mode;

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

export interface ChatRequest {
  topic: string;
  mode: InterviewMode;
  messages: Message[];
}

export interface ChatResponse {
  reply: string;
  evaluationReady: boolean;
}

export interface EvaluationCategories {
  conceptAccuracy: number;
  depthOfExplanation: number;
  examplesUsed: number;
  clarityOfExplanation: number;
  missingConceptCoverage: number;
}

export interface Evaluation {
  overallScore: number;
  categories: EvaluationCategories;
  strengths: string[];
  vaguePoints: string[];
  missingConcepts: string[];
  revisionSuggestions: string[];
}

export interface EvaluationRequest {
  topic: string;
  mode: InterviewMode;
  messages: Message[];
}

export interface SessionRecord {
  id: string;
  topic: string;
  mode: InterviewMode;
  messages: Message[];
  evaluation: Evaluation | null;
  createdAt: number;
  completedAt: number | null;
  messageCount: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalSessions: number;
  weeklyActivity: Record<string, number>;
}

export const MODE_LABELS: Record<InterviewMode, string> = {
  beginner: "Beginner",
  viva: "Viva",
  strict: "Strict",
};

export const MODE_DESCRIPTIONS: Record<InterviewMode, string> = {
  beginner: "Friendly and patient. Simple questions with occasional hints.",
  viva: "Academic and exam-style. Scenario-based with practical examples.",
  strict: "Tough but fair. Deep probing with technical precision expected.",
};

export const MODE_COLORS: Record<InterviewMode, string> = {
  beginner: "emerald",
  viva: "amber",
  strict: "rose",
};

export const CATEGORY_LABELS: Record<keyof EvaluationCategories, string> = {
  conceptAccuracy: "Concept Accuracy",
  depthOfExplanation: "Depth of Explanation",
  examplesUsed: "Examples Used",
  clarityOfExplanation: "Clarity",
  missingConceptCoverage: "Coverage",
};

export const EVALUATION_TURN_TARGET = 6;

export const POPULAR_TOPICS = [
  "Object-Oriented Programming",
  "React Hooks & State Management",
  "Database Normalization",
  "REST API Design",
  "Machine Learning Basics",
  "Data Structures & Algorithms",
  "System Design Fundamentals",
  "TCP/IP Networking",
  "Git Version Control",
  "Cloud Computing (AWS)",
  "Docker & Containerization",
  "Microservices Architecture",
];
