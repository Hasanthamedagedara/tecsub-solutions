import DarkModeClient from "./DarkModeClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sleek Dark Mode & Light Mode | TECSUB Solutions',
    description: 'Experience eye-safe reading and beautiful adaptive glassmorphic theme transitions with our premium fine-tuned dark and white HSL lighting system.',
};

export default function Page() {
    return <DarkModeClient />;
}
