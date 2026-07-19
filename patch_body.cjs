const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "const targetStock = req.body.targetStock || '';",
  "const body = req.body || {};\n    const targetStock = body.targetStock || '';"
);
code = code.replace(
  "const market = req.body.market || 'KR'; // 'KR' or 'US'",
  "const market = body.market || 'KR'; // 'KR' or 'US'"
);
code = code.replace(
  "const budget = req.body.budget || '';",
  "const budget = body.budget || '';"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts body parsing");
