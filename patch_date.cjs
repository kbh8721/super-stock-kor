const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `      setCurrentTime(new Date().toLocaleString('ko-KR', { 
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));`;

const replacement = `      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      setCurrentTime(\`\${now.getFullYear()}.\${pad(now.getMonth()+1)}.\${pad(now.getDate())} \${pad(now.getHours())}:\${pad(now.getMinutes())}:\${pad(now.getSeconds())}\`);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched date logic");
