const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "const [budget, setBudget] = useState('');\n",
  ""
);
code = code.replace(
  "budget: budget",
  "" // wait, the line is `const query = new URLSearchParams({ targetStock: stock, market: currentMarket, budget: budget }).toString();`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
