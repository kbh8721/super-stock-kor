const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  'console.log("Falling back to mock data due to API limit or error.");',
  'console.log("Quota exceeded, using mock data for demo.");'
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts catch log");
