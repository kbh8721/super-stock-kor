const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  `const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStock: stock, market: currentMarket, budget: budget }),
      });`,
  `const query = new URLSearchParams({ targetStock: stock, market: currentMarket, budget: budget }).toString();
      const response = await fetch('/api/analyze?' + query);`
);
fs.writeFileSync('src/App.tsx', appCode);
console.log("Patched App.tsx to use GET");

// Patch server.ts
let serverCode = fs.readFileSync('server.ts', 'utf-8');
serverCode = serverCode.replace(
  "app.post('/api/analyze', async (req, res) => {",
  "app.get('/api/analyze', async (req, res) => {"
);
serverCode = serverCode.replace(
  "const body = req.body || {};",
  "const body = req.query || {};"
);
// Also fix any remaining req.body just in case
serverCode = serverCode.replace(
  "const targetStock = req.body.targetStock || '';",
  "const targetStock = body.targetStock || '';"
);
serverCode = serverCode.replace(
  "const market = req.body.market || 'KR';",
  "const market = body.market || 'KR';"
);
serverCode = serverCode.replace(
  "const budget = req.body.budget || '';",
  "const budget = body.budget || '';"
);

fs.writeFileSync('server.ts', serverCode);
console.log("Patched server.ts to use GET");
