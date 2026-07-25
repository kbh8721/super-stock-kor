const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "tools: [{ googleSearch: {} }],",
  "// tools: [{ googleSearch: {} }],"
);

fs.writeFileSync('server.ts', code);
console.log("Removed search tool");
