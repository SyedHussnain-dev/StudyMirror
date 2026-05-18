export type Mode = "beginner" | "viva" | "strict";
export type InterviewMode = Mode;

export interface Message {
  role: "user" | "ai" | "assistant";
  content: string;
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

export const MODE_LABELS: Record<InterviewMode, string> = {
  beginner: "Beginner Interviewer",
  viva: "Viva Mode",
  strict: "Strict Professor",
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
