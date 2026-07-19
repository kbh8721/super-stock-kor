const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const target = `      let errorMessage = 'Failed to generate analysis.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Error generating analysis:', error);
      res.status(500).json({ error: errorMessage });
    }`;

code = code.replace(target, `    }`);

fs.writeFileSync('server.ts', code);
console.log("Cleaned up dead code in catch block.");
