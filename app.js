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
      if(u[1].every((_,k)=>IDX[`${pi}-${ui}-${k}`])){const tid=`${pi}-${ui}-T`,sc=S.tests&&S.tests[tid];h+=`<button class="les test" onclick="openTest(${pi},${ui})"><span class="num">✎</span>Chapter test${sc!=null?` · best ${Math.round(sc*100)}%`:''}</button>`}
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
function finish(){const s=Object.values(ans).filter(Boolean).length;const f=s/L[cur].quiz.length;if(cur.endsWith('-T')){S.tests=S.tests||{};S.tests[cur]=Math.max(f,S.tests[cur]||0)}else{S.done[cur]=1;S.scores[cur]=f}if(!S.days.includes(today()))S.days.push(today());save();pushSync();
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
  art.parentNode.classList.toggle('has-img',!!img);
  if(img)art.innerHTML=`<img src="${img}" alt="">`;
  else if(t.hero==='polis')art.innerHTML=POLIS_HERO;
  else art.innerHTML=`<svg viewBox="0 0 360 260" aria-hidden="true"><defs><radialGradient id="eg"><stop offset="0" stop-color="var(--gold)" stop-opacity=".4"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="130" r="120" fill="url(#eg)"/><circle cx="180" cy="130" r="78" fill="none" stroke="var(--gold)" stroke-width="2"/><circle cx="180" cy="130" r="64" fill="none" stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 5"/><text x="180" y="152" font-size="62" text-anchor="middle">${t.glyph||'✦'}</text></svg>`;
  document.querySelector('meta[name=theme-color]').setAttribute('content',getComputedStyle(root).getPropertyValue('--night').trim());
}
const themeFor=s=>s.theme;

/* Shrink the big title until it fits the screen width. */
function fitName(){const el=document.getElementById('appName');el.style.fontSize='';
  requestAnimationFrame(()=>{let f=parseFloat(getComputedStyle(el).fontSize),max=el.parentNode.clientWidth-24;el.style.whiteSpace='nowrap';
    while(el.scrollWidth>max&&f>24){f-=2;el.style.fontSize=f+'px'}})}
addEventListener('resize',()=>SUB&&fitName());
if(document.fonts)document.fonts.addEventListener('loadingdone',()=>SUB&&fitName());
/* ---------- subjects ---------- */
async function loadSubject(id){
  SUB=SUBJ.find(s=>s.id===id&&!s.soon)||SUBJ[0];ls.set('subject',SUB.id);
  applyTheme(themeFor(SUB));
  document.getElementById('appName').textContent=SUB.title.toUpperCase();fitName();
  document.getElementById('motto').innerHTML=SUB.motto;
  document.getElementById('foot').textContent=SUB.foot;
  document.getElementById('pickName').innerHTML=icon(SUB.id,'ic sm')+' '+SUB.name;
  document.title='Light Bulb · '+SUB.title+' ('+SUB.name+')';
  L={};loadProgress();
  const [m,x]=await Promise.all([fetch(path('syllabus.json')).then(r=>r.json()),fetch(path('lessons/index.json')).then(r=>r.json())]);
  MAP=m;IDX=x;ids=[];MAP.forEach((p,pi)=>p.units.forEach((u,ui)=>{for(let k=0;k<u[1].length;k++)ids.push(`${pi}-${ui}-${k}`)}));
  renderHome();
}
const sheet=document.getElementById('sheet');
function openSheet(){
  document.getElementById('subjList').innerHTML=SUBJ.map(s=>{const t=THEMES[s.theme]||THEMES.polis,a=t.vars['--gold']||'#c9a45c',b=t.vars['--lapis']||'#13294b';
    return `<button class="choice${s.id===SUB.id?' on':''}" onclick="pickSubject('${s.id}')"><span class="sic" style="--a:${a};--b:${b}">${icon(s.id)}</span><span><strong>${s.title}</strong> · ${s.name}<small>${s.full}</small></span></button>`}).join('');
  sheet.hidden=false}
function pickSubject(id){sheet.hidden=true;loadSubject(id)}
function pickTheme(k){ls.set('theme:'+SUB.id,k);applyTheme(k);openSheet()}
document.getElementById('pick').onclick=openSheet;
document.getElementById('sheetClose').onclick=()=>sheet.hidden=true;
sheet.addEventListener('click',e=>{if(e.target===sheet)sheet.hidden=true});

/* ---------- daily reminders (web push) ---------- */
const pushOn=document.getElementById('pushOn'),pushHour=document.getElementById('pushHour'),pushNote=document.getElementById('pushNote');
for(let h=5;h<=23;h++)pushHour.add(new Option((h%12||12)+(h<12?' am':' pm'),h));
pushHour.value=ls.get('pushHour')||'19';pushOn.checked=ls.get('push')==='1';
const b64=s=>{const p='='.repeat((4-s.length%4)%4),r=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(r,c=>c.charCodeAt(0))};
function studyState(){const next=ids.find(i=>IDX[i]&&!S.done[i]);let chapter='',left=0;
  if(next){const [p,u]=next.split('-');chapter=MAP[p].units[u][0];left=MAP[p].units[u][1].filter((_,k)=>!S.done[`${p}-${u}-${k}`]).length}
  return {streak:streak(),doneDay:S.days.includes(today())?today():'',subject:SUB.title,next:next?IDX[next].title:'',chapter,chapterLeft:left}}
/* In the Android app (Capacitor), reminders are scheduled on the phone and the widget reads the study state. */
const CAP=window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform();
async function nativeSync(off){const P=Capacitor.Plugins,st=studyState(),studied=!!st.doneDay;
  try{await P.Preferences.set({key:'widget',value:JSON.stringify({...st,studiedToday:studied})})}catch(e){}
  const LN=P.LocalNotifications;if(!LN)return;
  try{const pend=await LN.getPending();if(pend.notifications.length)await LN.cancel({notifications:pend.notifications.map(n=>({id:n.id}))})}catch(e){}
  if(off||ls.get('push')!=='1')return;
  const h=+pushHour.value,nx=st.next?`“${st.next}”`:'your next lesson',list=[];
  for(let d=0;d<7;d++){const t=new Date();t.setDate(t.getDate()+d);t.setHours(h,0,0,0);if(t<=new Date()||(d===0&&studied))continue;
    const sk=st.streak+(d===0?0:0);list.push({id:100+d,title:sk>=2?`🔥 Keep your ${sk}-day streak going`:'💡 Today’s lesson is ready',body:`${st.subject}: ${nx}. About 15 minutes.`,schedule:{at:t,allowWhileIdle:true}})}
  const w=new Date();w.setHours(21,0,0,0);
  if(!studied&&st.streak>0&&w>new Date())list.push({id:200,title:`🔥 Your ${st.streak}-day streak ends at midnight`,body:`One lesson saves it: ${nx}.`,schedule:{at:w,allowWhileIdle:true}});
  if(list.length)await LN.schedule({notifications:list.map(n=>({...n,extra:{url:'/?go=continue'}}))})}
async function pushSync(off){if(CAP)return nativeSync(off);try{
  if(!('serviceWorker' in navigator)||!('PushManager' in window))return;
  const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
  if(off){if(sub){await fetch('/api/push-sync',{method:'POST',body:JSON.stringify({sub,off:true})});await sub.unsubscribe()}return}
  if(ls.get('push')!=='1')return;
  if(!sub){const {key}=await fetch('/api/push-key').then(r=>r.json());sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(key)})}
  await fetch('/api/push-sync',{method:'POST',body:JSON.stringify({sub,hour:+pushHour.value,tz:new Date().getTimezoneOffset(),...studyState()})});
}catch(e){console.warn('push',e)}}
pushOn.onchange=async()=>{
  if(pushOn.checked){
    if(CAP){const r=await Capacitor.Plugins.LocalNotifications.requestPermissions();if(r.display!=='granted'){pushOn.checked=false;pushNote.textContent='Notifications are blocked. Allow them in Android settings for Light Bulb.';return}
      ls.set('push','1');pushNote.textContent='On. You’ll get a reminder at '+pushHour.selectedOptions[0].text+'.';pushSync();return}
    if(!('Notification' in window)||!('PushManager' in window)){pushOn.checked=false;pushNote.textContent='This browser can’t show reminders. Install the app from Chrome first.';return}
    const perm=await Notification.requestPermission();
    if(perm!=='granted'){pushOn.checked=false;pushNote.textContent='Notifications are blocked. Allow them in Chrome’s site settings, then try again.';return}
    ls.set('push','1');pushNote.textContent='On. You’ll get a reminder at '+pushHour.selectedOptions[0].text+'.';pushSync()}
  else{ls.set('push','0');pushNote.textContent='Off.';pushSync(true)}};
pushHour.onchange=()=>{ls.set('pushHour',pushHour.value);if(pushOn.checked){pushNote.textContent='On. You’ll get a reminder at '+pushHour.selectedOptions[0].text+'.';pushSync()}};

/* ---------- shortcuts (?go=continue|test|search) ---------- */
function handleGo(){const go=new URLSearchParams(location.search).get('go');if(!go)return;history.replaceState(null,'',location.pathname);
  const next=ids.find(i=>IDX[i]&&!S.done[i]);
  if(go==='continue'&&next)openL(next);
  else if(go==='test'&&next){const [p,u]=next.split('-');openTest(+p,+u)}
  else if(go==='search'){show('search');document.getElementById('q').focus()}}

if(CAP&&Capacitor.Plugins.LocalNotifications)Capacitor.Plugins.LocalNotifications.addListener('localNotificationActionPerformed',()=>{const n=ids.find(i=>IDX[i]&&!S.done[i]);if(n)openL(n)});
(async()=>{SUBJ=await fetch('subjects.json').then(r=>r.json());await loadSubject(ls.get('subject')||SUBJ[0].id);handleGo();pushSync()})();
/* ---------- chapter tests: 15 questions drawn from every lesson in the chapter ---------- */
async function openTest(pi,ui){const u=MAP[pi].units[ui],pool=[];
  try{for(let k=0;k<u[1].length;k++){const l=await getLesson(`${pi}-${ui}-${k}`);l.quiz.forEach(q=>pool.push(q))}}catch(e){alert('The test could not load. Check your connection.');return}
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const id=`${pi}-${ui}-T`;L[id]={title:'Chapter test: '+u[0],emoji:'✎',cards:[],quiz:pool.slice(0,Math.min(15,pool.length))};openL(id)}

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
