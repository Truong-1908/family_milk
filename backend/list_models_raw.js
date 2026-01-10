const https = require('https');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
if (!key) { console.error("No key"); process.exit(1); }

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Raw Data:", data);
        }
    });
}).on('error', (e) => console.error(e));
