/* App shell for every subject. subjects.json lists subjects; each has a folder (dir) holding
   syllabus.json and lessons/<id>.json (lessons/index.json is built by scripts/build.js).
   Themes live in themes.js. */
let MAP=[],IDX={},L={},SUBJ=[],SUB=null;
let S={done:{},scores:{},days:[]};
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const key=()=>SUB.store||('polis:'+SUB.id);
function loadProgress(){S={done:{},scores:{},days:[]};const s=ls.get(key());if(s)try{S=JSON.parse(s)}catch(e){}
  // Scores are stored as a fraction (0-1). Old saves stored a count out of 5.
  for(const k in S.scores)if(S.scores[k]>1)S.scores[k]/=5}
const save=()=>ls.set(key(),JSON.stringify(S));
const path=f=>(SUB.dir==='.'?'':SUB.dir+'/')+f;
let ids=[];
// Dates are the phone's local calendar day (IST for Indian users), never UTC.
const ds=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const today=()=>ds(new Date());
function streak(){let n=0,d=new Date();const set=new Set(S.days);if(!set.has(ds(d)))d.setDate(d.getDate()-1);while(set.has(ds(d))){n++;d.setDate(d.getDate()-1)}return n}
const unitOf=id=>{const [p,u]=id.split('-');return MAP[p].units[u][0]};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wreath=`<svg class="wreath" viewBox="0 0 200 110"><g style="fill:var(--goldd)">${[...Array(9)].map((_,i)=>{const a=(200-i*16)*Math.PI/180,x=100+70*Math.cos(a),y=100-70*Math.sin(a)*0.9;return `<ellipse cx="${x}" cy="${y}" rx="5" ry="12" transform="rotate(${-(200-i*16)+90} ${x} ${y})"/>`}).join('')}${[...Array(9)].map((_,i)=>{const a=(-20+i*16)*Math.PI/180,x=100+70*Math.cos(a),y=100-70*Math.sin(a)*0.9;return `<ellipse cx="${x}" cy="${y}" rx="5" ry="12" transform="rotate(${-(-20+i*16)+90} ${x} ${y})"/>`}).join('')}</g></svg>`;

function renderHome(){
  const done=Object.keys(S.done).length;
  document.getElementById('sDone').firstChild.textContent=done;document.querySelector('#sDone small').textContent=done==1?'lesson':'lessons';
  document.getElementById('sStreak').firstChild.textContent=streak();
  const sc=Object.values(S.scores);document.getElementById('sAvg').firstChild.textContent=sc.length?Math.round(sc.reduce((a,b)=>a+b,0)/sc.length*100)+'%':'–';
  const next=ids.find(i=>IDX[i]&&!S.done[i]),t=document.getElementById('today');
  if(next){const n=ids.indexOf(next)+1;t.innerHTML=`<div class="day">Day ${n} of ${ids.length} · ${unitOf(next)}</div><h2>${IDX[next].title}</h2><p>${IDX[next].n} cards, then a ${IDX[next].q}-question quiz. About ${Math.round(IDX[next].n*1.5+IDX[next].q*0.5)} minutes.</p><button class="start" onclick="openL('${next}')">Start lesson</button>`}
  else t.innerHTML=`<div class="day">All caught up</div><h2>You've finished every lesson written so far</h2><p>New lessons arrive soon. Revise anything from the syllabus below.</p>`;
  let h='',num=0;
  MAP.forEach((p,pi)=>{h+=`<div class="sec"><h3>${p.t}</h3><p>${p.p}</p></div>`;
    p.units.forEach((u,ui)=>{const live=u[1].some((_,k)=>IDX[`${pi}-${ui}-${k}`]);
      h+=`<div class="unit${live?' live':''}${pi==0&&ui<2?' open':''}"><button onclick="this.parentNode.classList.toggle('open')" aria-label="${esc(u[0])}"><span class="t">${u[0]}${u[2]?'<em class="hy">Asked often</em>':''}</span><span class="c">${live?'Open':u[1].length+' lessons'}</span><span class="chev"></span></button><div class="ls">`;
      for(let k=0;k<u[1].length;k++){num++;const id=`${pi}-${ui}-${k}`,l=IDX[id];
        h+=l?`<button class="les${S.done[id]?' done':''}" onclick="openL('${id}')"><span class="num">${S.done[id]?'✓':num}</span>${l.title}</button>`:`<div class="les soon"><span class="num">${num}</span>${u[1][k]}</div>`}
      h+=`</div></div>`})});
  document.getElementById('map').innerHTML=h;
}
const deck=document.getElementById('deck');let cur;
async function getLesson(id){
  if(L[id])return L[id];
  const r=await fetch(path(`lessons/${id}.json`));if(!r.ok)throw new Error(r.status);
  return L[id]=await r.json();
}
async function openL(id,card){
  let l;try{l=await getLesson(id)}catch(e){alert('This lesson could not load. Check your connection and try again.');return}
  cur=id;
  let h=`<div class="cd"><div class="ci marble cover"><div class="em">${l.emoji}</div><div class="tag">${unitOf(id)}</div><h2>${l.title}</h2><p class="hint">Swipe left to begin</p></div></div>`;
  l.cards.forEach(c=>h+=`<div class="cd"><div class="ci marble ${c.cls||''}"><div class="tag">${c.tag}</div><h2>${c.h}</h2>${c.b}</div></div>`);
  l.quiz.forEach((q,i)=>h+=`<div class="cd"><div class="ci marble"><div class="tag">Question ${i+1} of ${l.quiz.length}</div><h2 style="font-size:21px">${q.q}</h2>${q.o.map((o,j)=>`<button class="opt" data-q="${i}" data-j="${j}">${o}</button>`).join('')}<div class="why" id="w${i}"></div></div></div>`);
  h+=`<div class="cd"><div class="ci marble cover" id="end"><div class="tag">Answer every question to finish</div></div></div>`;
  deck.innerHTML=h;deck.querySelectorAll('.ci').forEach(c=>io.observe(c));window.ans={};show('lesson');deck.scrollLeft=card>=0?(card+1)*deck.clientWidth:0;upd();deck.querySelectorAll('.ci').forEach(c=>{if(c.scrollHeight>c.clientHeight+4){const m=document.createElement('div');m.className='more';m.textContent='Scroll down for more';c.appendChild(m);c.addEventListener('scroll',()=>{if(c.scrollTop+c.clientHeight>=c.scrollHeight-30)m.style.opacity=0},{passive:true})}});
}
deck.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b)return;const q=+b.dataset.q,j=+b.dataset.j;if(ans[q]!==undefined)return;
  const Q=L[cur].quiz[q];ans[q]=j===Q.a;b.parentNode.querySelectorAll('.opt').forEach((o,k)=>{if(k===Q.a)o.classList.add('r');else if(k===j)o.classList.add('w')});
  const w=document.getElementById('w'+q);w.innerHTML=(j===Q.a?'<b>Correct.</b> ':'<b>Not quite.</b> ')+Q.w;w.classList.add('on');
  if(Object.keys(ans).length===L[cur].quiz.length)finish()});
function finish(){const s=Object.values(ans).filter(Boolean).length;const f=s/L[cur].quiz.length;S.done[cur]=1;S.scores[cur]=f;if(!S.days.includes(today()))S.days.push(today());save();
  document.getElementById('end').innerHTML=`${wreath}<div class="score">${s} / ${L[cur].quiz.length}</div><h2 style="margin-top:14px">${f>=.8?'Laurels earned':f>=.6?'Solid work':'Worth another read'}</h2><p>${f>=.8?'You know this well enough to write on it.':f>=.6?'Skim the cards you missed once more.':'Come back to this one tomorrow.'}</p><button class="start" onclick="back()">Back to the syllabus</button>`}
let curCard=0;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.35});
function upd(){const n=deck.children.length,i=Math.round(deck.scrollLeft/deck.clientWidth);curCard=i-1;document.getElementById('pg').style.width=((i+1)/n*100)+'%';document.getElementById('cnt').textContent=`${i+1}/${n}`}
deck.addEventListener('scroll',()=>requestAnimationFrame(upd));
function show(v){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===v));window.scrollTo(0,0)}
function back(){show('home');renderHome()}
document.getElementById('close').onclick=back;

/* ---------- themes ---------- */
const POLIS_HERO=document.getElementById('heroArt').innerHTML;
const loadedFonts=new Set();
function applyTheme(id){
  const t=THEMES[id]||THEMES.polis,root=document.documentElement;
  Object.keys(THEMES).forEach(k=>Object.keys(THEMES[k].vars).forEach(v=>root.style.removeProperty(v)));
  Object.entries(t.vars).forEach(([k,v])=>root.style.setProperty(k,v));
  if(t.fonts&&!loadedFonts.has(t.fonts)){loadedFonts.add(t.fonts);const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+t.fonts+'&display=swap';document.head.appendChild(l)}
  const art=document.getElementById('heroArt');
  const img=(SUB&&SUB.hero)||t.heroImage;
  if(img)art.innerHTML=`<img src="${img}" alt="">`;
  else if(t.hero==='polis')art.innerHTML=POLIS_HERO;
  else art.innerHTML=`<svg viewBox="0 0 360 260" aria-hidden="true"><defs><radialGradient id="eg"><stop offset="0" stop-color="var(--gold)" stop-opacity=".4"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="130" r="120" fill="url(#eg)"/><circle cx="180" cy="130" r="78" fill="none" stroke="var(--gold)" stroke-width="2"/><circle cx="180" cy="130" r="64" fill="none" stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 5"/><text x="180" y="152" font-size="62" text-anchor="middle">${t.glyph||'✦'}</text></svg>`;
  document.querySelector('meta[name=theme-color]').setAttribute('content',getComputedStyle(root).getPropertyValue('--night').trim());
}
const themeFor=s=>ls.get('theme:'+s.id)||s.theme;

/* ---------- subjects ---------- */
async function loadSubject(id){
  SUB=SUBJ.find(s=>s.id===id&&!s.soon)||SUBJ[0];ls.set('subject',SUB.id);
  applyTheme(themeFor(SUB));
  document.getElementById('appName').textContent=SUB.title.toUpperCase();
  document.getElementById('motto').innerHTML=SUB.motto;
  document.getElementById('foot').textContent=SUB.foot;
  document.getElementById('pickName').textContent=SUB.name;
  document.title='Light Bulb · '+SUB.title+' ('+SUB.name+')';
  L={};loadProgress();
  const [m,x]=await Promise.all([fetch(path('syllabus.json')).then(r=>r.json()),fetch(path('lessons/index.json')).then(r=>r.json())]);
  MAP=m;IDX=x;ids=[];MAP.forEach((p,pi)=>p.units.forEach((u,ui)=>{for(let k=0;k<u[1].length;k++)ids.push(`${pi}-${ui}-${k}`)}));
  renderHome();
}
const sheet=document.getElementById('sheet');
function openSheet(){
  document.getElementById('subjList').innerHTML=SUBJ.map(s=>`<button class="choice${s.id===SUB.id?' on':''}" ${s.soon?'disabled':''} onclick="pickSubject('${s.id}')"><span class="sw" style="background:${(THEMES[s.theme].vars['--lapis'])||'#13294b'}"></span><span>${s.name}<small>${s.full}${s.soon?' · coming soon':''}</small></span></button>`).join('');
  const cur=themeFor(SUB);
  document.getElementById('themeList').innerHTML=Object.entries(THEMES).map(([k,t])=>`<button class="choice${k===cur?' on':''}" onclick="pickTheme('${k}')"><span class="sw" style="background:linear-gradient(135deg,${t.vars['--lapis']||'#13294b'} 50%,${t.vars['--gold']||'#c9a45c'} 50%)"></span><span>${t.name}<small>${t.note}</small></span></button>`).join('');
  sheet.hidden=false}
function pickSubject(id){sheet.hidden=true;loadSubject(id)}
function pickTheme(k){ls.set('theme:'+SUB.id,k);applyTheme(k);openSheet()}
document.getElementById('pick').onclick=openSheet;
document.getElementById('sheetClose').onclick=()=>sheet.hidden=true;
sheet.addEventListener('click',e=>{if(e.target===sheet)sheet.hidden=true});

(async()=>{SUBJ=await fetch('subjects.json').then(r=>r.json());loadSubject(ls.get('subject')||SUBJ[0].id)})();
/* ---------- search ---------- */
const SI={};
async function searchIndex(sub){if(!SI[sub.id]){const r=await fetch((sub.dir==='.'?'':sub.dir+'/')+'lessons/search.json');SI[sub.id]=r.ok?await r.json():[]}return SI[sub.id]}
const hl=(t,ws)=>{let e=esc(t);ws.forEach(w=>{e=e.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')});return e};
let qTimer;
async function runSearch(){
  const q=document.getElementById('q').value.trim().toLowerCase(),out=document.getElementById('results');
  if(q.length<2){out.innerHTML='';return}
  const ws=q.split(/\s+/),subs=document.getElementById('qAll').checked?SUBJ:[SUB],hits=[];
  for(const sub of subs){const idx=await searchIndex(sub);
    for(const [id,title,cards] of idx){const tl=title.toLowerCase();let best=-1,score=0;
      if(ws.every(w=>tl.includes(w)))score=100;
      cards.forEach(([h,b],i)=>{const t=(h+' '+b).toLowerCase();if(ws.every(w=>t.includes(w))){const sc=(ws.every(w=>h.toLowerCase().includes(w))?20:5);if(sc+score>score&&best<0){best=i}score+=sc}});
      if(score)hits.push({sub,id,title,score,card:best,snip:best>=0?cards[best]:null})}}
  hits.sort((a,b)=>b.score-a.score);
  out.innerHTML=hits.slice(0,60).map((x,k)=>{let snip='';if(x.snip){const t=x.snip[1],i=Math.max(0,t.toLowerCase().indexOf(ws[0])-60);snip=(i?'…':'')+t.slice(i,i+160)+'…'}
    return `<button class="hit" data-k="${k}"><b>${hl(x.title,ws)}</b><small>${esc(x.sub.title)} · ${x.snip?hl(x.snip[0],ws):'Lesson'}</small><span>${hl(snip,ws)}</span></button>`}).join('')||'<p class="note" style="color:var(--sub)">No lessons match.</p>';
  out._hits=hits;
}
document.getElementById('srch').onclick=()=>{show('search');document.getElementById('q').focus()};
document.getElementById('srchClose').onclick=back;
document.getElementById('q').addEventListener('input',()=>{clearTimeout(qTimer);qTimer=setTimeout(runSearch,200)});
document.getElementById('qAll').onchange=runSearch;
document.getElementById('results').addEventListener('click',async e=>{const b=e.target.closest('.hit');if(!b)return;const x=document.getElementById('results')._hits[+b.dataset.k];
  if(x.sub.id!==SUB.id)await loadSubject(x.sub.id);openL(x.id,x.card)});

/* ---------- ask a doubt ---------- */
const askSheet=document.getElementById('askSheet'),chat=document.getElementById('chat');
function askView(){const has=!!ls.get('askKey');document.getElementById('keyBox').hidden=has;document.getElementById('chatBox').hidden=!has;
  document.getElementById('model').value=ls.get('askModel')||'claude-haiku-5-5'}
document.getElementById('askBtn').onclick=()=>{if(askSheet._lesson!==cur){chat.innerHTML='';askSheet._lesson=cur}askView();askSheet.hidden=false};
document.getElementById('askClose').onclick=()=>askSheet.hidden=true;
document.getElementById('saveKey').onclick=()=>{const k=document.getElementById('apiKey').value.trim();if(!k)return;ls.set('askKey',k);ls.set('askModel',document.getElementById('model').value);document.getElementById('apiKey').value='';askView()};
document.getElementById('changeKey').onclick=()=>{document.getElementById('keyBox').hidden=false;document.getElementById('chatBox').hidden=true};
document.getElementById('sendDoubt').onclick=async()=>{
  const ta=document.getElementById('doubt'),q=ta.value.trim();if(!q)return;ta.value='';
  const me=document.createElement('div');me.className='qa me';me.textContent=q;chat.appendChild(me);
  const ai=document.createElement('div');ai.className='qa ai';ai.textContent='Thinking…';chat.appendChild(ai);chat.scrollTop=chat.scrollHeight;
  if(!navigator.onLine){ai.textContent='You are offline. Asking a doubt needs the internet.';return}
  try{const {ask}=await import('./ask.js');
    await ask({apiKey:ls.get('askKey'),model:ls.get('askModel')||'claude-haiku-5-5',subject:SUB.full,lessonId:SUB.id+'/'+cur,lesson:L[cur],cardIndex:Math.max(0,Math.min(curCard,L[cur].cards.length-1)),question:q,onText:t=>{ai.textContent=t;chat.scrollTop=chat.scrollHeight}})}
  catch(err){ai.textContent=(err&&err.status===401)?'That API key was rejected. Tap "Change key or model".':'Could not get an answer: '+(err&&err.message||err)}};

if('serviceWorker' in navigator){const had=!!navigator.serviceWorker.controller;let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&!reloaded){reloaded=true;location.reload()}});
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>r.update()))}
