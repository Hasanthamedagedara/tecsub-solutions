import PaymentRemindersClient from "./PaymentRemindersClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Custom Payment Reminders | TECSUB Solutions',
    description: 'Set up daily, specific, or custom date payment notification reminders easily with our app. Never miss a due date again. දිනපතා හෝ ඔබට අවශ්‍ය දිනවලට Payment Notifications ලබාගන්න අපේ app එක භාවිතා කරන්න.',
};

export default function Page() {
    return <PaymentRemindersClient />;
}
