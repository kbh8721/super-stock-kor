const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  'name: "삼성전자",\n              code: "005930",',
  'name: market === "US" ? "Apple" : "삼성전자",\n              code: market === "US" ? "AAPL" : "005930",'
);
code = code.replace(
  'name: "SK하이닉스",\n              code: "000660",\n              currentPrice: formatPrice(skInfo?.price || 185000),',
  'name: market === "US" ? "Microsoft" : "SK하이닉스",\n              code: market === "US" ? "MSFT" : "000660",\n              currentPrice: formatPrice(skInfo?.price || (market === "US" ? 400 : 185000)),'
);
code = code.replace(
  'buyRange: `${formatPrice((skInfo?.price || 185000) * 0.98)} ~ ${formatPrice((skInfo?.price || 185000) * 1.02)}`,',
  'buyRange: `${formatPrice((skInfo?.price || (market === "US" ? 400 : 185000)) * 0.98)} ~ ${formatPrice((skInfo?.price || (market === "US" ? 400 : 185000)) * 1.02)}`,'
);
code = code.replace(
  'stopLoss: { percent: -7, price: formatPrice((skInfo?.price || 185000) * 0.93) },',
  'stopLoss: { percent: -7, price: formatPrice((skInfo?.price || (market === "US" ? 400 : 185000)) * 0.93) },'
);
code = code.replace(
  'target1: { percent: 15, price: formatPrice((skInfo?.price || 185000) * 1.15), period: "1개월" },',
  'target1: { percent: 15, price: formatPrice((skInfo?.price || (market === "US" ? 400 : 185000)) * 1.15), period: "1개월" },'
);
code = code.replace(
  'target2: { percent: 25, price: formatPrice((skInfo?.price || 185000) * 1.25), period: "3개월" },',
  'target2: { percent: 25, price: formatPrice((skInfo?.price || (market === "US" ? 400 : 185000)) * 1.25), period: "3개월" },'
);

code = code.replace(
  'name: "현대차",\n              code: "005380",\n              currentPrice: formatPrice(hyundaiInfo?.price || 245000),',
  'name: market === "US" ? "Nvidia" : "현대차",\n              code: market === "US" ? "NVDA" : "005380",\n              currentPrice: formatPrice(hyundaiInfo?.price || (market === "US" ? 120 : 245000)),'
);
code = code.replace(
  'buyRange: `${formatPrice((hyundaiInfo?.price || 245000) * 0.98)} ~ ${formatPrice((hyundaiInfo?.price || 245000) * 1.02)}`,',
  'buyRange: `${formatPrice((hyundaiInfo?.price || (market === "US" ? 120 : 245000)) * 0.98)} ~ ${formatPrice((hyundaiInfo?.price || (market === "US" ? 120 : 245000)) * 1.02)}`,'
);
code = code.replace(
  'stopLoss: { percent: -6, price: formatPrice((hyundaiInfo?.price || 245000) * 0.94) },',
  'stopLoss: { percent: -6, price: formatPrice((hyundaiInfo?.price || (market === "US" ? 120 : 245000)) * 0.94) },'
);
code = code.replace(
  'target1: { percent: 12, price: formatPrice((hyundaiInfo?.price || 245000) * 1.12), period: "1.5개월" },',
  'target1: { percent: 12, price: formatPrice((hyundaiInfo?.price || (market === "US" ? 120 : 245000)) * 1.12), period: "1.5개월" },'
);
code = code.replace(
  'target2: { percent: 18, price: formatPrice((hyundaiInfo?.price || 245000) * 1.18), period: "3개월" },',
  'target2: { percent: 18, price: formatPrice((hyundaiInfo?.price || (market === "US" ? 120 : 245000)) * 1.18), period: "3개월" },'
);


fs.writeFileSync('server.ts', code);
console.log("Patched server.ts successfully");
