const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  `const query = new URLSearchParams({ targetStock: stock, market: currentMarket,  }).toString();
      const response = await fetch('/api/analyze?' + query);`,
  `const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStock: stock, market: currentMarket })
      });`
);
fs.writeFileSync('src/App.tsx', appCode);
console.log("Patched App.tsx to use POST");

// Patch server.ts
let serverCode = fs.readFileSync('server.ts', 'utf-8');
serverCode = serverCode.replace(
  "app.get('/api/analyze', async (req, res) => {",
  "app.post('/api/analyze', async (req, res) => {"
);
serverCode = serverCode.replace(
  "const body = req.query || {};",
  "const body = req.body || {};"
);

fs.writeFileSync('server.ts', serverCode);
console.log("Patched server.ts to use POST");
