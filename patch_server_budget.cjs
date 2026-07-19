const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "const budget = body.budget || '';\n",
  ""
);

code = code.replace(
  "${budget ? `[예산 조건]: 사용자의 보유 현금은 ${budget}입니다. 포트폴리오를 구성할 때 이 예산 내에서 매수 가능한 주식(1주 이상)을 고려해 주시고, 비싼 주식이라면 비중을 어떻게 가져갈지도 반영해 추천해 주세요.` : ''}\n",
  ""
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts budget");
