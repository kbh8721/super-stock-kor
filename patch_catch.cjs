const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldCatch = `    } catch (error: any) {
      const errStr = String(error.message || error).toLowerCase();
      if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('400') || errStr.includes('503') || errStr.includes('resource_exhausted')) {
        console.log("Using mock data due to API limit.");`;

const newCatch = `    } catch (error: any) {
      console.error('Error generating analysis:', error);
      console.log("Falling back to mock data due to error.");
      if (true) {`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts catch block");
