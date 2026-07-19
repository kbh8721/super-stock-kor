const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldCatch = `    } catch (error: any) {
      console.error('Error generating analysis:', error);
      console.log("Falling back to mock data due to error.");
      if (true) {`;

const newCatch = `    } catch (error: any) {
      console.log("Falling back to mock data due to API limit or error.");
      if (true) {`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts catch block again");
