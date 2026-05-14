import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Plagiarism Checker | Verify Content Originality & Authenticity",
    description: "Check your content for plagiarism with Tecsub's advanced analyzer. Get detailed similarity reports for essays, research papers, and articles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
