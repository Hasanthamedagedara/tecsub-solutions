import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tecsub Online Tools | Free Software & Engineering Utilities",
    description: "Explore a wide range of free online tools including PDF editors, text converters, JSON formatters, and AI writing assistants by Tecsub Solutions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
