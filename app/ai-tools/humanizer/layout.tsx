import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Humanizer | Bypass AI Detection & Naturalize Text",
    description: "Convert AI-generated content into human-like writing with Tecsub's AI Humanizer. Improve readability and bypass detection from GPTZero and others.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
