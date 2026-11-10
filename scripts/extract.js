// One-off: pull the prototype's lessons out of index.html into lessons/*.json
const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
const js=src.slice(src.indexOf('const D = {'),src.indexOf('let S={done'));
const {D,L}=new Function(js+';return {D,L}')();
for(const [id,l] of Object.entries(L)){
  fs.writeFileSync(`lessons/${id}.json`,JSON.stringify({id,title:l.title,emoji:l.emoji,cards:l.cards,quiz:l.quiz,sources:[],verified:"2026-11-10"},null,1)+'\n');
}
console.log(Object.keys(L));
