const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../components/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `{notificationsList.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="p-2.5 rounded-xl transition-all"`;

const targetStrUnix = `{notificationsList.map((notif) => (\n                                            <div\n                                                key={notif.id}\n                                                className="p-2.5 rounded-xl transition-all"`;

const replacement = `{notificationsList.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => {
                                                    if (notif.href) {
                                                        router.push(notif.href);
                                                        setNotificationsOpen(false);
                                                    }
                                                }}
                                                className="p-2.5 rounded-xl transition-all cursor-pointer hover:bg-white/5"`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    console.log("Replaced Windows notification block.");
} else if (content.includes(targetStrUnix)) {
    content = content.replace(targetStrUnix, replacement.replace(/\r\n/g, '\n'));
    console.log("Replaced Unix notification block.");
} else {
    // Regex fallback
    const regex = /\{notificationsList\.map\(\(notif\) => \([\r\n\s]*<div[\r\n\s]*key=\{notif\.id\}[\r\n\s]*className="p-2\.5 rounded-xl transition-all"/;
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        console.log("Replaced via RegEx fallback.");
    } else {
        console.log("Target not found for notification click update.");
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Update run complete.");
