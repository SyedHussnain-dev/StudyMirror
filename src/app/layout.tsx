import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ApiKeySetup from "@/components/ApiKeySetup";
import Navbar from "@/components/Navbar";

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
    "interview practice",
    "active recall",
  ],
  authors: [{ name: "StudyMirror" }],
  openGraph: {
    title: "StudyMirror — Master Any Topic by Teaching AI",
    description:
      "Stop rereading. Start proving understanding. AI-powered learning through the Feynman Technique.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#020617]">
        <Navbar />
        {children}
        <ApiKeySetup />
      </body>
    </html>
  );
}
