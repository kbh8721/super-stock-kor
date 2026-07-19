const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetJSX = `            <div className="relative w-full sm:w-48">
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="보유 현금 (예: 1000만원)"
                className="block w-full px-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              />
            </div>`;

code = code.replace(targetJSX, "");
fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx JSX");
