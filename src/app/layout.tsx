import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyMirror — If you can explain it, you understand it",
  description:
    "AI-powered Feynman Technique study partner. Explain concepts to a confused AI student that probes, challenges, and evaluates your true understanding.",
  keywords: [
    "study",
    "learning",
    "feynman technique",
    "AI tutor",
    "understanding",
    "education",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950">{children}</body>
    </html>
  );
}
