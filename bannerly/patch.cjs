const fs = require('fs'); 
const file = 'node_modules/react-dom/cjs/react-dom-server.node.development.js'; 
let code = fs.readFileSync(file, 'utf8'); 
code = code.replace(/throw new Error\("Objects are not valid as a React child/g, "console.error('REACT RENDER ERROR OBJ:', node); throw new Error(\"Objects are not valid as a React child"); 
fs.writeFileSync(file, code);
