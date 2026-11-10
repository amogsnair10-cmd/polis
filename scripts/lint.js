// Free checks so no model has to do them. Usage: node scripts/lint.js [dir]   (dir defaults to ".")
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..',process.argv[2]||'.','lessons');
const strip=h=>h.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,' ');
const words=h=>strip(h).split(/\s+/).filter(Boolean).length;
const out=[],seenQ={},pos=[0,0,0,0];let cross=0;
for(const f of fs.readdirSync(dir).filter(f=>/^\d+-\d+-\d+\.json$/.test(f)).sort()){
  const id=f.slice(0,-5),l=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),p=m=>out.push(`${id}: ${m}`);
  if(l.cards.length<10)p(`only ${l.cards.length} cards (aim 10-14)`);
  const tags=l.cards.map(c=>c.tag);
  if(!tags.includes('Indian angle'))p('no "Indian angle" card');
  if(l.cards[l.cards.length-1].cls!=='exam')p('exam card is not last');
  if(!l.cards.some(c=>/<svg/.test(c.b)))p('no diagram');
  l.cards.forEach((c,i)=>{const w=words(c.b);if(w>220)p(`card ${i+1} has ${w} words, split it`);if(w<45&&!/<svg/.test(c.b))p(`card ${i+1} has only ${w} words`);
    for(const m of c.b.matchAll(/font-size="([\d.]+)"/g))if(+m[1]<10){p(`card ${i+1} diagram text ${m[1]}px (min 10)`);break}});
  const qs=l.quiz.map(q=>q.q.toLowerCase().replace(/\W+/g,' ').trim());
  qs.forEach((q,i)=>{const k=q.slice(0,60);if(seenQ[k]&&seenQ[k].startsWith(id+' '))p(`quiz ${i+1} repeats ${seenQ[k]}`);else if(seenQ[k])cross++;else seenQ[k]=`${id} q${i+1}`;pos[l.quiz[i].a]++});
  l.quiz.forEach((q,i)=>{if(new Set(q.o).size<4)p(`quiz ${i+1} has duplicate options`)});
  if(l.quiz.every(q=>q.a===l.quiz[0].a))p('every answer is in the same position');
}
out.forEach(x=>console.log(x));
console.log(`\n${out.length} issue(s). ${cross} question(s) also asked in another lesson (fine for revision). Answer positions A-D: ${pos.join(' / ')}`);
