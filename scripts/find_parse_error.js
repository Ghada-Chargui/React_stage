const fs=require('fs');const parser=require('@babel/parser');const code=fs.readFileSync('src/pages/parent/ParentDashboardPage.js','utf8');
function tryParseSlice(end){try{parser.parse(code.slice(0,end),{sourceType:'module',plugins:['jsx']});return null;}catch(e){return e.message;}}
for(let i=100;i<=code.length;i+=100){const msg=tryParseSlice(i);if(msg){console.log('Error at approx char',i, msg);process.exit(0);} }
console.log('No error in slices');
