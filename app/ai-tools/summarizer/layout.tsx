import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Text Summarizer | Instantly Condense Long Articles",
    description: "Summarize long articles, essays, and documents instantly with Tecsub's AI Text Summarizer. Choose between short, medium, or bullet-point summaries.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
