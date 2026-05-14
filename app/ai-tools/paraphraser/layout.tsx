import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Paraphrasing Tool | Rewrite Text with Professional Clarity",
    description: "Rewrite sentences and paragraphs without changing their meaning. Use Tecsub's Paraphrasing Tool for academic, formal, or simple writing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
