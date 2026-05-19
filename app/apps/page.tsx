import AppsPage from "@/components/AppsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Download TECSUB Apps | Payment & Due Date Reminder",
    description: "Set up daily, specific, or custom date payment notification reminders easily with our app. Never miss a due date again. High-performance utility apps for Android.",
    keywords: [
        "TECSUB Apps", 
        "Payment Reminder App", 
        "Due Date Notification App", 
        "Direct APK Download", 
        "Android Utility Tools",
        "Set custom date reminders",
        "Tecsub Solutions Mobile"
    ]
};

export default function Page() {
    return (
        <main className="min-h-screen bg-black">
            <AppsPage />
        </main>
    );
}
