const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "가장 중요한 점은 **반드시 구글 검색 도구(Google Search grounding)를 활용하여 오늘 날짜 기준의 실제 최신 주가를 검색하여 반영**해야 한다는 것입니다. 임의로 지어낸 과거 가격을 사용하지 마세요.",
  "제공된 현재가(fetchedPriceStr)를 바탕으로 분석하세요. 임의로 지어낸 과거 가격을 사용하지 마세요."
);

fs.writeFileSync('server.ts', code);
console.log("Patched prompt");
