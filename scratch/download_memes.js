const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'memes');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const memes = {
    drake: "https://api.memegen.link/images/drake.png",
    harold: "https://api.memegen.link/images/harold.png",
    both: "https://api.memegen.link/images/both.png",
    success: "https://api.memegen.link/images/success.png"
};

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    console.log("Downloading default meme templates...");
    for (const [name, url] of Object.entries(memes)) {
        const dest = path.join(targetDir, `${name}.png`);
        try {
            await downloadFile(url, dest);
            console.log(`Successfully downloaded: ${name}.png`);
        } catch (err) {
            console.error(`Failed to download ${name}.png:`, err.message);
        }
    }
    console.log("Done.");
}

run();
