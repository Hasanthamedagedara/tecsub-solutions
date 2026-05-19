import LanguageSwitchClient from "./LanguageSwitchClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Trilingual Language Options | TECSUB Solutions',
    description: 'දිනපතා හෝ ඔයාට අවශ්ය දිනවලට Payment Notifications ලබාගන්න අපේ app එක භාවිතා කරන්න. Access all platform features, developer tools, and academic courses seamlessly in English, Sinhala, and Tamil.',
};

export default function Page() {
    return <LanguageSwitchClient />;
}
