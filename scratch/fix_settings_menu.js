const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../components/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Define safe replacements that ignore carriage returns
const oldContentStr = '<span>Settings</span>\r\n                                                         <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>\r\n                                                     </button>\r\n                                                 </div>="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>\r\n                                                     </button>\r\n                                                 </div>';

const oldContentStrUnix = '<span>Settings</span>\n                                                         <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>\n                                                     </button>\n                                                 </div>="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>\n                                                     </button>\n                                                 </div>';

const newContentStr = '<span>Settings</span>\r\n                                                         <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>\r\n                                                     </button>\r\n                                                 </div>';

if (content.includes(oldContentStr)) {
    content = content.replace(oldContentStr, newContentStr);
    console.log("Found Windows line endings, replacing...");
} else if (content.includes(oldContentStrUnix)) {
    content = content.replace(oldContentStrUnix, newContentStr.replace(/\r\n/g, '\n'));
    console.log("Found Unix line endings, replacing...");
} else {
    // Regular expression fallback
    const regex = /<span>Settings<\/span>[\s\S]*?<\/div>="16"[\s\S]*?<\/div>/;
    if (regex.test(content)) {
        content = content.replace(regex, `<span>Settings</span>
                                                         <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                                     </button>
                                                 </div>`);
        console.log("Matched via RegEx, replacing...");
    } else {
        console.log("Target not matched in Navbar.tsx. Verifying contents...");
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Repair run complete.");
