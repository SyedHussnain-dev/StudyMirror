export type TopicDifficulty = "beginner" | "intermediate" | "advanced";
export type TopicCategory =
  | "programming"
  | "cs-fundamentals"
  | "web-dev"
  | "data-ml"
  | "systems"
  | "math-science";

export interface TopicItem {
  id: string;
  title: string;
  category: TopicCategory;
  difficulty: TopicDifficulty;
  description: string;
  estimatedMinutes: number;
  prerequisites?: string[];
}

export const CATEGORY_LABELS: Record<TopicCategory, string> = {
  programming: "Programming",
  "cs-fundamentals": "CS Fundamentals",
  "web-dev": "Web Development",
  "data-ml": "Data & ML",
  systems: "Systems & DevOps",
  "math-science": "Math & Science",
};

export const CATEGORY_COLORS: Record<TopicCategory, string> = {
  programming: "violet",
  "cs-fundamentals": "sky",
  "web-dev": "emerald",
  "data-ml": "amber",
  systems: "rose",
  "math-science": "violet",
};

export const DIFFICULTY_LABELS: Record<TopicDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const TOPIC_LIBRARY: TopicItem[] = [
  {
    id: "oop",
    title: "Object-Oriented Programming",
    category: "programming",
    difficulty: "beginner",
    description: "Classes, inheritance, polymorphism, encapsulation, and abstraction.",
    estimatedMinutes: 15,
  },
  {
    id: "dsa-basics",
    title: "Data Structures & Algorithms",
    category: "cs-fundamentals",
    difficulty: "intermediate",
    description: "Arrays, trees, graphs, sorting, searching, and time complexity.",
    estimatedMinutes: 20,
  },
  {
    id: "react-hooks",
    title: "React Hooks & State Management",
    category: "web-dev",
    difficulty: "intermediate",
    description: "useState, useEffect, custom hooks, and state patterns.",
    estimatedMinutes: 15,
    prerequisites: ["JavaScript fundamentals"],
  },
  {
    id: "db-normalization",
    title: "Database Normalization",
    category: "data-ml",
    difficulty: "intermediate",
    description: "1NF through 3NF, denormalization trade-offs, and schema design.",
    estimatedMinutes: 12,
  },
  {
    id: "rest-api",
    title: "REST API Design",
    category: "web-dev",
    difficulty: "intermediate",
    description: "HTTP methods, status codes, versioning, and resource modeling.",
    estimatedMinutes: 15,
  },
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    category: "data-ml",
    difficulty: "beginner",
    description: "Supervised vs unsupervised learning, training, and evaluation.",
    estimatedMinutes: 18,
  },
  {
    id: "system-design",
    title: "System Design Fundamentals",
    category: "systems",
    difficulty: "advanced",
    description: "Scalability, load balancing, caching, and distributed systems.",
    estimatedMinutes: 25,
    prerequisites: ["Networking basics", "Databases"],
  },
  {
    id: "tcp-ip",
    title: "TCP/IP Networking",
    category: "systems",
    difficulty: "intermediate",
    description: "OSI model, TCP vs UDP, DNS, and how the internet works.",
    estimatedMinutes: 15,
  },
  {
    id: "git",
    title: "Git Version Control",
    category: "systems",
    difficulty: "beginner",
    description: "Commits, branches, merges, rebases, and collaboration workflows.",
    estimatedMinutes: 10,
  },
  {
    id: "docker",
    title: "Docker & Containerization",
    category: "systems",
    difficulty: "intermediate",
    description: "Images, containers, volumes, and container orchestration basics.",
    estimatedMinutes: 15,
  },
  {
    id: "microservices",
    title: "Microservices Architecture",
    category: "systems",
    difficulty: "advanced",
    description: "Service boundaries, communication patterns, and trade-offs vs monoliths.",
    estimatedMinutes: 20,
    prerequisites: ["REST API Design", "System Design Fundamentals"],
  },
  {
    id: "calculus-limits",
    title: "Calculus: Limits & Derivatives",
    category: "math-science",
    difficulty: "intermediate",
    description: "Limits, continuity, differentiation rules, and real-world applications.",
    estimatedMinutes: 18,
  },
  {
    id: "cloud-aws",
    title: "Cloud Computing (AWS)",
    category: "systems",
    difficulty: "intermediate",
    description: "EC2, S3, Lambda, IAM, and core cloud architecture patterns.",
    estimatedMinutes: 20,
  },
  {
    id: "recursion",
    title: "Recursion & Dynamic Programming",
    category: "cs-fundamentals",
    difficulty: "advanced",
    description: "Base cases, memoization, tabulation, and classic DP patterns.",
    estimatedMinutes: 22,
    prerequisites: ["Data Structures & Algorithms"],
  },
  {
    id: "typescript",
    title: "TypeScript Fundamentals",
    category: "programming",
    difficulty: "beginner",
    description: "Types, interfaces, generics, and type-safe JavaScript patterns.",
    estimatedMinutes: 12,
  },
];

export function getTopicsByCategory(category: TopicCategory): TopicItem[] {
  return TOPIC_LIBRARY.filter((t) => t.category === category);
}

export function getTopicById(id: string): TopicItem | undefined {
  return TOPIC_LIBRARY.find((t) => t.id === id);
}

export function searchTopics(query: string): TopicItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOPIC_LIBRARY;
  return TOPIC_LIBRARY.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}
