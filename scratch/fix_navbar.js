const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../components/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Match the malformed animate line and replace it with proper structured layout properties
const regex = /animate=\{\{\s*opacity:\s*1,\s*y:\s*0,\s*scal\s*\{\/\*\s*User\s*Info\s*Header\s*\*\//;
if (regex.test(content)) {
    content = content.replace(regex, `animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="kdj-profile-menu"
                                            >
                                                {/* User Info Header */}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Navbar fixed successfully via regex match!");
} else {
    // Let's do a direct split/join replacement on the unique substring
    const badSubstring = "animate={{ opacity: 1, y: 0, scal                                                {/* User Info Header */}";
    const goodSubstring = `animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="kdj-profile-menu"
                                            >
                                                {/* User Info Header */}`;
    if (content.includes(badSubstring)) {
        content = content.split(badSubstring).join(goodSubstring);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Navbar fixed successfully via direct substring replace!");
    } else {
        console.log("Could not find the target bad string pattern.");
    }
}
