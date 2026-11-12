// Run: node scripts/build.js
// Checks every lesson, writes lessons/index.json and the service worker's file list.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');process.chdir(root);
const subjects=JSON.parse(fs.readFileSync('subjects.json','utf8'));
const errs=[],warn=[],lessonFiles=[];
for(const sub of subjects){
const dir=sub.dir==='.'?'':sub.dir+'/';
if(!fs.existsSync(dir+'syllabus.json')){if(!sub.soon)errs.push(`${sub.id}: missing ${dir}syllabus.json`);continue}
if(!fs.existsSync(dir+'lessons'))fs.mkdirSync(dir+'lessons',{recursive:true});
const map=JSON.parse(fs.readFileSync(dir+'syllabus.json','utf8'));
const titles={};map.forEach((p,pi)=>p.units.forEach((u,ui)=>u[1].forEach((t,k)=>titles[`${pi}-${ui}-${k}`]=t)));
const idx={};
const words=h=>h.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
for(const f of fs.readdirSync(dir+'lessons').filter(f=>/^\d+-\d+-\d+\.json$/.test(f)).sort()){
  const id=f.slice(0,-5),e=m=>errs.push(`${sub.id}/${id}: ${m}`);let l;
  try{l=JSON.parse(fs.readFileSync(dir+'lessons/'+f,'utf8'))}catch(x){e('bad JSON '+x.message);continue}
  if(!titles[id])e('id not in syllabus');
  if(l.id!==id)e('id field does not match file name');
  if(!l.title||!l.emoji)e('missing title or emoji');
  if(!Array.isArray(l.cards)||l.cards.length<8||l.cards.length>16)e(`needs 8-16 cards, has ${l.cards&&l.cards.length}`);
  (l.cards||[]).forEach((c,i)=>{if(!c.tag||!c.h||!c.b)e(`card ${i+1} missing tag/h/b`);const w=words(c.b);if(w>200)warn.push(`${sub.id}/${id} card ${i+1}: ${w} words`)});
  if(!(l.cards||[]).some(c=>c.cls==='exam'))e('no exam card');
  if(!Array.isArray(l.quiz)||l.quiz.length!==10)e('needs 10 quiz questions');
  (l.quiz||[]).forEach((q,i)=>{if(!q.q||!Array.isArray(q.o)||q.o.length!==4||!(q.a>=0&&q.a<4)||!q.w)e(`quiz ${i+1} malformed`)});
  if(!l.verified)e('missing verified date');
  idx[id]={title:l.title,n:l.cards.length,q:l.quiz.length};
}
if(!errs.length)fs.writeFileSync(dir+'lessons/index.json',JSON.stringify(idx)+'\n');
// Search index: lesson title plus each card's heading and plain text.
if(!errs.length){const plain=h=>h.replace(/<svg[\s\S]*?<\/svg>/g,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
  const si=Object.keys(idx).map(id=>{const l=JSON.parse(fs.readFileSync(dir+'lessons/'+id+'.json','utf8'));return [id,l.title,l.cards.map(c=>[plain(c.h),plain(c.b)])]});
  fs.writeFileSync(dir+'lessons/search.json',JSON.stringify(si));}
lessonFiles.push(dir+'syllabus.json',dir+'lessons/index.json',dir+'lessons/search.json',...Object.keys(idx).map(i=>`${dir}lessons/${i}.json`));
console.log(`${sub.id}: ${Object.keys(idx).length} lessons`);
}
warn.forEach(w=>console.warn('warn:',w));
if(errs.length){errs.forEach(x=>console.error('error:',x));process.exit(1)}
const art=fs.existsSync('art')?fs.readdirSync('art').map(f=>'art/'+f):[];
const files=['./','index.html','styles.css','app.js','themes.js','icons.js','ask.js','vendor/anthropic-sdk-1.3.0.js','subjects.json','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png',...art,...lessonFiles];
const h=crypto.createHash('sha1');files.filter(f=>f!=='./').forEach(f=>{if(fs.existsSync(f))h.update(fs.readFileSync(f))});
const sw=fs.readFileSync('scripts/sw.template.js','utf8').replace('__VERSION__',h.digest('hex').slice(0,10)).replace('__FILES__',JSON.stringify(files));
fs.writeFileSync('sw.js',sw);
console.log('ok');
