const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "throw new Error(errorData.error || '분석 데이터를 가져오는데 실패했습니다.');",
  "throw new Error(errorData.error || `에러 발생: HTTP ${response.status}. 분석 데이터를 가져오는데 실패했습니다.`);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched error message");
