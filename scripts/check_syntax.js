
import fs from 'fs';

const content = fs.readFileSync('c:/Users/ASUS/Desktop/tecsub current works/github new file web/tecsub solutions/app/chat/page.tsx', 'utf8');

let braces = 0;
let parens = 0;
let brackets = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') braces++;
    else if (char === '}') braces--;
    else if (char === '(') parens++;
    else if (char === ')') parens--;
    else if (char === '[') brackets++;
    else if (char === ']') brackets--;

    if (braces < 0 || parens < 0 || brackets < 0) {
        console.log(`Mismatch at index ${i}, line ${content.substring(0, i).split('\n').length}`);
        console.log(`Braces: ${braces}, Parens: ${parens}, Brackets: ${brackets}`);
        break;
    }
}

console.log(`Final counts - Braces: ${braces}, Parens: ${parens}, Brackets: ${brackets}`);
