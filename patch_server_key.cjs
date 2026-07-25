const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });",
  "throw new Error('GEMINI_API_KEY is missing.');"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server API key error handling");
