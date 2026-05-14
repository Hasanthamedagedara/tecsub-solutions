import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Prompt Generator | Master ChatGPT, Claude & Gemini",
    description: "Generate highly optimized prompts for AI models like ChatGPT, Claude, and Gemini. Professional templates for writing, coding, and marketing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
