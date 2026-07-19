const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "const response = await fetch('/api/analyze', {",
  "const response = await fetch(window.location.origin + '/api/analyze', {"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx fetch url");
