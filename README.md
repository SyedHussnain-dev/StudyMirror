# StudyMirror 🧠

> **If you can explain it, you understand it.**

StudyMirror is an AI-powered learning tool built on the Feynman Technique. Instead of the AI teaching you, **you teach the AI**. By forcing active recall and explanation, StudyMirror exposes gaps in your knowledge and tests your true conceptual understanding.

---

## 🚨 The Problem

**The Illusion of Competence:** Students often read textbooks, highlight notes, or watch tutorials and feel like they understand a topic. However, this is usually just passive recognition. When pressed to explain the concept from scratch, they struggle. Students don't know what they don't know until they are tested in high-stakes environments like exams or interviews.

## 💡 The Solution

StudyMirror flips the traditional AI tutoring paradigm. It acts as a "confused junior student" who asks you to explain a topic. 

It **never** gives you the answer. Instead, it asks relentless, probing questions, challenges vague statements, asks for real-world examples, and forces you to articulate the "why" and "how" behind a concept. After an intense back-and-forth session, it evaluates your understanding and gives you a structured grade.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui
- **Animations:** Framer Motion
- **AI Engine:** Google Gemini SDK (`gemini-2.5-flash`)

---

## 🤖 AI Components

StudyMirror relies on a dual-agent architecture powered by Google Gemini, separated into two distinct state machines:

### 1. The Interview Engine (Persona-Driven Chat)
Powered by a strict, highly engineered system prompt, the AI adopts the persona of a confused junior student. 
- **Core Rules:** It is explicitly instructed *never* to teach, *never* to provide definitions, and *never* to give generic praise. 
- **Question Rotation:** It analyzes the user's responses and dynamically rotates through question types: definition checks, example requests, internal mechanism probes, and edge-case challenges.
- **Modes:** Supports adjustable strictness (Beginner, Viva, Strict Professor) modifying the AI's tone and technical expectations.

### 2. The Evaluation Engine (Structured JSON Analysis)
Once a conversation reaches a sufficient depth (typically 6 turns), a secondary AI pass is triggered.
- **Transcript Analysis:** It reviews the entire chat history as an expert evaluator.
- **Structured Output:** It is forced to output a strictly typed JSON schema containing a 0-100 overall score.
- **Categorical Breakdown:** It grades the user across 5 metrics (Concept Accuracy, Depth of Explanation, Examples Used, Clarity, Missing Concept Coverage) and highlights strengths, vague points, and actionable revision suggestions.

