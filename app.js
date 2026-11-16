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
const save=()=>{ls.set(key(),JSON.stringify(S));window.onProgress&&window.onProgress()};
/* ---------- review: wrong quiz answers come back after 1, 3, 7 and 21 days ----------
   Kept inside the progress object (S.rev) so it syncs with everything else. step 4 = learned. */
const RDAYS=[1,3,7,21];
const dayStart=n=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d.getTime()};
const rdue=()=>(S.rev||[]).filter(r=>r.step<4&&r.due<=Date.now());
function rmark(id,q,ok){S.rev=S.rev||[];let r=S.rev.find(r=>r.id===id&&r.q===q);
  if(!r){if(ok)return;r={id,q,step:-1};S.rev.push(r)}
  r.step=ok?r.step+1:0;r.due=r.step<4?dayStart(RDAYS[r.step]):0;r.t=Date.now();save()}
let PYQ={};
/* ---------- Inspector Lumen (mascot): poses live in art/lumen/<sheet>-<n>.webp ---------- */
const LUM=(k,c='')=>`<img class="lum ${c}" src="art/lumen/${k}.webp" alt="" loading="lazy" decoding="async" onerror="this.remove()">`;
const SUBJPOSE={psir:'subjects-a-1',history:'subjects-a-2',geography:'subjects-a-3',environment:'subjects-a-4',world:'subjects-a-5',communism:'subjects-a-6',astronomy:'subjects-b-1',physics:'subjects-b-2',chemistry:'subjects-b-3',biology:'subjects-b-4',quantum:'subjects-b-5'};
function lumenSay(){const days=allDays(),st=streak(),h=new Date().getHours(),did=days.has(today()),sp=SUBJPOSE[SUB.id]||'expressions-angles-1';
  if(!days.size)return[sp,'Inspector Lumen. I will be going through the files with you.'];
  if(did){if(st>=30)return['streak-6',st+' days. I am not smiling. I am just fine.'];if(st>=7)return['streak-5',st+' days running. Noted.'];if(st===1&&days.size>1)return[sp,'Back at it. Good.'];return[sp,'Noted. The streak stands at '+st+'.']}
  if(st>0){if(h>=22)return['daily-3','Late. A short lesson still counts.'];if(h>=18)return['streak-2','Streak in danger. One lesson will do.'];if(h<9)return['daily-1',"Morning. Today's case file is open."];return[sp,"Today's case file is open: "+SUB.title+'.']}
  return['streak-3','Fresh start. I will be here.']}
function renderLumen(){const[k,t]=lumenSay(),hero=document.getElementById('lumenhero'),el=document.getElementById('lumenline');
  if(hero)hero.innerHTML=LUM(k);
  if(el)el.innerHTML=`<small>Inspector Lumen</small><span>${esc(t)}</span>`}
const endPose=f=>f>=.999?'sunglasses-2':f>=.8?'streak-1':f>=.6?'expressions-angles-4':f>=.3?'expressions-angles-2':'daily-6';
/* ---------- points, levels and badges ----------
   XP is stored per subject in S.xp (synced with progress). Badges are worked out from saved progress,
   so they can't get out of step; lb:badges remembers which ones were already celebrated. */
const LEVELS=[[0,'Beginner'],[100,'Learner'],[300,'Student'],[700,'Scholar'],[1500,'Adept'],[3000,'Expert'],[6000,'Master'],[12000,'Sage']];
const lvlOf=xp=>{let i=0;while(i+1<LEVELS.length&&xp>=LEVELS[i+1][0])i++;const a=LEVELS[i][0],b=LEVELS[i+1]?LEVELS[i+1][0]:null;return{n:i+1,name:LEVELS[i][1],xp,next:b,pct:b?Math.round((xp-a)/(b-a)*100):100}};
function allS(){return SUBJ.map(s=>{let p=null;try{p=JSON.parse(ls.get(s.store||('polis:'+s.id))||'null')}catch(e){}return{s,p:p||{}}})}
function stats(){const all=allS(),days=new Set();let lessons=0,perfect=0,tests=0,tests80=0,learned=0,xp=0,rv=0,mixN=0,mixBest=0,subs=0;
  all.forEach(({p})=>{(p.days||[]).forEach(d=>days.add(d));const dn=Object.keys(p.done||{}).length;lessons+=dn;if(dn)subs++;
    perfect+=Object.values(p.scores||{}).filter(v=>v>=.999).length;Object.values(p.tests||{}).forEach(v=>{tests++;if(v>=.8)tests80++});
    learned+=(p.rev||[]).filter(r=>r.step>=4).length;xp+=p.xp||0;rv+=p.rv||0;mixN+=p.mixN||0;mixBest=Math.max(mixBest,p.mixBest||0)});
  const sorted=[...days].sort();let best=0,run=0,prev=null;sorted.forEach(d=>{const t=Date.parse(d);run=prev!==null&&Math.round((t-prev)/864e5)===1?run+1:1;prev=t;best=Math.max(best,run)});
  return{lessons,perfect,tests,tests80,learned,xp,rv,mixN,mixBest,subs,best}}
const BADGES=[
 ['first','First Step','Finish your first lesson','✦','b',A=>A.lessons>=1],
 ['l10','Getting Serious','Finish 10 lessons','✎','b',A=>A.lessons>=10],
 ['l25','Scholar','Finish 25 lessons','❖','s',A=>A.lessons>=25],
 ['l100','Centurion','Finish 100 lessons','♛','g',A=>A.lessons>=100],
 ['s3','On a Roll','Study 3 days in a row','☀','b',A=>A.best>=3],
 ['s7','Week Warrior','Study 7 days in a row','☀','s',A=>A.best>=7],
 ['s30','Unstoppable','Study 30 days in a row','☀','g',A=>A.best>=30],
 ['p1','Sharp','Score 10 out of 10 on a quiz','◎','b',A=>A.perfect>=1],
 ['p10','Flawless','Score full marks on 10 quizzes','◎','s',A=>A.perfect>=10],
 ['t1','Chapter Champion','Score 80% or more on a chapter test','⚑','b',A=>A.tests80>=1],
 ['t5','Test Taker','Finish 5 chapter tests','⚑','s',A=>A.tests>=5],
 ['r1','Second Look','Finish a review session','↻','b',A=>A.rv>=1],
 ['r10','Made to Stick','Master 10 questions through review','↻','s',A=>A.learned>=10],
 ['r50','Elephant Memory','Master 50 questions through review','↻','g',A=>A.learned>=50],
 ['m1','Mixed Bag','Finish a mixed revision test','⚄','b',A=>A.mixN>=1],
 ['m80','Sharp Recall','Score 80% or more on a mixed test','⚄','s',A=>A.mixBest>=.8],
 ['sub3','Polymath','Finish lessons in 3 different subjects','✺','s',A=>A.subs>=3],
 ['sub6','Renaissance','Finish lessons in 6 different subjects','✺','g',A=>A.subs>=6],
 ['x500','Rising Star','Earn 500 XP','★','s',A=>A.xp>=500],
 ['x3000','Legend','Earn 3000 XP','★','g',A=>A.xp>=3000],
 ['l250','Living Library','Finish 250 lessons','','l',A=>A.lessons>=250],
 ['l500','The Archivist','Finish 500 lessons','','l',A=>A.lessons>=500],
 ['s60','Iron Habit','Study 60 days in a row','','l',A=>A.best>=60],
 ['s100','Hundred Days','Study 100 days in a row','','l',A=>A.best>=100],
 ['p50','Perfectionist','Score full marks on 50 quizzes','','l',A=>A.perfect>=50],
 ['r200','Never Forget','Master 200 questions through review','','l',A=>A.learned>=200],
 ['t20','Examiner\'s Nightmare','Score 80% or more on 20 chapter tests','','l',A=>A.tests80>=20],
 ['mx100','Perfect Mix','Score 100% on a mixed test','','l',A=>A.mixBest>=.999],
 ['sub11','Omniscient','Finish lessons in all 11 subjects','','l',A=>A.subs>=11],
 ['x10000','Mythic','Earn 10000 XP','','l',A=>A.xp>=10000]];
function badgeState(){const A=stats();return{A,level:lvlOf(A.xp),all:BADGES.map(b=>({id:b[0],t:b[1],d:b[2],g:b[3],tier:b[4],got:b[5](A)}))}}
window.badgeState=badgeState;
function toast(h){let t=document.getElementById('toasts');if(!t){t=document.createElement('div');t.id='toasts';document.body.appendChild(t)}
  const e=document.createElement('div');e.className='toast';e.innerHTML=h;t.appendChild(e);setTimeout(()=>{e.classList.add('out');setTimeout(()=>e.remove(),600)},CALM?3500:4200)}
/* quiet=true records what is already earned without celebrating (first run, after sign-in) */
function checkBadges(quiet){const st=badgeState(),got=st.all.filter(b=>b.got).map(b=>b.id);let seen=null;try{seen=JSON.parse(ls.get('lb:badges')||'null')}catch(e){}
  if(seen&&!quiet)st.all.filter(b=>b.got&&!seen.includes(b.id)).forEach((b,i)=>setTimeout(()=>toast(`<span class="ltile sm">${b.tier==='l'?LUM('rewards-3'):LUM('rewards-2')}</span><span><small>${b.tier==='l'?'Legendary badge':'New badge'}</small><b>${b.t}</b></span>`),i*900));
  ls.set('lb:badges',JSON.stringify([...new Set([...(seen||[]),...got])]));renderLevel()}
window.checkBadges=checkBadges;
function renderLevel(){const el=document.getElementById('lvl');if(!el)return;const v=lvlOf(stats().xp);
  el.innerHTML=`<span class="lv">Level ${v.n}</span><span class="ln">${v.name}</span><i><b style="width:${v.pct}%"></b></i><span class="xp">${v.xp} XP${v.next?' · '+(v.next-v.xp)+' to next':''}</span>`}
const xpLine=(xp,lv0)=>{const v=lvlOf(stats().xp);return`<div class="xpgain"><b>+${xp} XP</b><span>Level ${v.n} · ${v.name}</span>${v.n>lv0?'<em>Level up</em>':''}</div>`};

const path=f=>(SUB.dir==='.'?'':SUB.dir+'/')+f;
let ids=[];
// Dates are the phone's local calendar day (IST for Indian users), never UTC.
const ds=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const today=()=>ds(new Date());
/* A study day in ANY subject counts: the main streak is across all subjects (dates use this phone's own clock). */
function allDays(){const set=new Set(S.days);try{allS().forEach(({p})=>(p.days||[]).forEach(d=>set.add(d)))}catch(e){}return set}
function streak(){let n=0,d=new Date();const set=allDays();if(!set.has(ds(d)))d.setDate(d.getDate()-1);while(set.has(ds(d))){n++;d.setDate(d.getDate()-1)}return n}
const unitOf=id=>{const [p,u]=id.split('-');return MAP[p]?MAP[p].units[u][0]:'Review'};
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
  const due=rdue().length,rv=document.getElementById('rev');
  rv.hidden=!due;if(due)rv.innerHTML=`<span class="ltile">${LUM('review-1')}</span><div><div class="day">Review</div><b>${due} question${due==1?'':'s'} you missed</b><small>About ${Math.max(1,Math.round(due*.4))} min · they come back until they stick</small></div><span class="go">Start</span>`;
  const mx=document.getElementById('mix'),nd=Object.keys(S.done).filter(i=>!i.endsWith('-T')).length;
  mx.hidden=nd<3;if(nd>=3)mx.innerHTML=`<span class="ltile">${LUM('review-6')}</span><div><div class="day">Mixed revision</div><b>20 questions from everything so far</b><small>${S.mixBest?'Best '+Math.round(S.mixBest*100)+'% · ':''}+20 bonus XP</small></div><span class="go">Start</span>`;
  renderLevel();renderLumen();
  let h='',num=0;
  MAP.forEach((p,pi)=>{h+=`<div class="sec"><h3>${p.t}</h3><p>${p.p}</p></div>`;
    p.units.forEach((u,ui)=>{const live=u[1].some((_,k)=>IDX[`${pi}-${ui}-${k}`]);
      h+=`<div class="unit${live?' live':''}${pi==0&&ui<2?' open':''}"><button onclick="this.parentNode.classList.toggle('open')" aria-label="${esc(u[0])}">${doodle(pi+'-'+ui)}<span class="t">${u[0]}${u[2]?'<em class="hy">Asked often</em>':''}</span><span class="c">${live?'Open':u[1].length+' lessons'}</span><span class="chev"></span></button><div class="ls"><div class="lsi">`;
      for(let k=0;k<u[1].length;k++){num++;const id=`${pi}-${ui}-${k}`,l=IDX[id];
        h+=l?`<button class="les${S.done[id]?' done':''}" onclick="openL('${id}')"><span class="num">${S.done[id]?'✓':num}</span>${l.title}${PYQ[id]?'<em class="pq">PYQ</em>':''}</button>`:`<div class="les soon"><span class="num">${num}</span>${u[1][k]}</div>`}
      if(u[1].every((_,k)=>IDX[`${pi}-${ui}-${k}`])){const tid=`${pi}-${ui}-T`,sc=S.tests&&S.tests[tid];h+=`<button class="les test" onclick="openTest(${pi},${ui})"><span class="num">✎</span>Chapter test${sc!=null?` · best ${Math.round(sc*100)}%`:''}</button>`}
      h+=`</div></div></div>`})});
  document.getElementById('map').innerHTML=h;
}
const deck=document.getElementById('deck');let cur;
async function getLesson(id){
  if(L[id])return L[id];
  const r=await fetch(path(`lessons/${id}.json`));if(!r.ok)throw new Error(r.status);
  return L[id]=await r.json();
}
let PHOTOS={};
/* Graded free-licence photo for a lesson (key "id") or card (key "id_k"), with a small credit. */
function photo(key,cls){const p=PHOTOS[SUB.id+'/'+key];if(!p)return '';const ar=p.w&&p.h?Math.max(.8,Math.min(1.9,p.w/p.h)).toFixed(3):'1.5625';const c=p.credit.replace(/[<>&"]/g,'');
  const dia=/\.png$/i.test(p.file||'')?' dia':'';
  return `<figure class="ph ${cls}${dia}" style="--ar:${ar}"><img src="${p.src}" alt="" loading="lazy" decoding="async" onload="this.classList.add('in')" onerror="this.parentNode.remove()"><a class="cr" href="${p.page}" target="_blank" rel="noopener">${c}</a></figure>`}
async function openL(id,card){
  let l;try{l=await getLesson(id)}catch(e){alert('This lesson could not load. Check your connection and try again.');return}
  cur=id;lastI=-1;if(!/^(REVIEW|MIX)$|-T$/.test(id))ls.set('lb:last',JSON.stringify({s:SUB.id,id,t:l.title,ts:Date.now(),card:-1}));
  const cp=photo(id,'big');
  let h=`<div class="cd"><div class="ci marble cover">${id.endsWith('-T')?LUM('review-3','lumcov'):''}${id.endsWith('-T')?'':(cp||ldood(id,'dd big')||doodle(id,'dd big')||`<div class="em">${l.emoji}</div>`)}<div class="tag">${unitOf(id)}</div><h2>${l.title}</h2><p class="hint">Swipe left to begin</p>${cp?ldood(id,'dd pb'):''}</div></div>`;
  const have=(DOODLES.lessons||{})[SUB.id]||[],pool=have.filter(n=>n===id||n.startsWith(id+'_')),POS=['r','b','t','l','b','r','l','t'],off=[...id].reduce((x,ch)=>x+ch.charCodeAt(0),0);
  l.cards.forEach((c,k)=>{const ph=photo(id+'_'+k,'card');let pos=POS[(k+off)%POS.length];if(ph&&pos==='t')pos='r';
    const nm=have.includes(id+'_'+k)?id+'_'+k:(pool.length?pool[(k+1)%pool.length]:''),d=nm?ldood(nm,'dd p'+pos):'';
    h+=`<div class="cd"><div class="ci marble ${c.cls||''}">${ph}${pos==='t'?d:''}<div class="cb">${pos==='r'||pos==='l'?d:''}<div class="tag">${c.tag}</div><h2>${c.h}</h2>${c.b}</div>${pos==='b'?d:''}</div></div>`});
  const pq=PYQ[id];
  if(pq&&pq.length)h+=`<div class="cd"><div class="ci marble"><div class="tag">Asked in UPSC</div><h2>Previous year questions</h2>${pq.map(x=>`<blockquote class="pyq">${esc(x.q)}<small>${x.y} · ${esc(x.p)}${x.m?' · '+x.m+' marks':''}</small></blockquote>`).join('')}</div></div>`;
  l.quiz.forEach((q,i)=>h+=`<div class="cd"><div class="ci marble"><div class="tag">${q._t?esc(q._t):`Question ${i+1} of ${l.quiz.length}`}</div><h2 class="qq" style="font-size:20px">${q.q}</h2>${q.o.map((o,j)=>`<button class="opt" data-q="${i}" data-j="${j}">${o}</button>`).join('')}<div class="why" id="w${i}"></div></div></div>`);
  h+=`<div class="cd"><div class="ci marble cover" id="end"><div class="tag">Answer every question to finish</div></div></div>`;
  deck.innerHTML=h;window.LCOUNT=l.cards.length+(pq&&pq.length?1:0);deck.querySelectorAll('.ci').forEach(c=>io.observe(c));window.ans={};show('lesson');deck.scrollLeft=card>=0?(card+1)*deck.clientWidth:0;upd();deck.querySelectorAll('.ci').forEach(c=>{const g=c.querySelector('.dd.pb');if(g){const body=c.scrollHeight-g.offsetHeight-14,room=c.clientHeight-body-30;if(room<70)g.remove();else if(room<g.offsetHeight)g.style.height=room+'px'}
    c.querySelectorAll('.dd.pt,.dd.pr,.dd.pl').forEach(d=>{if(c.scrollHeight>c.clientHeight+4)d.remove()})});
  deck.querySelectorAll('.ci').forEach(c=>{if(c.scrollHeight>c.clientHeight+4){const m=document.createElement('div');m.className='more';m.textContent='Scroll down for more';c.parentNode.appendChild(m);c.addEventListener('scroll',()=>{m.classList.toggle('gone',c.scrollTop+c.clientHeight>=c.scrollHeight-30)},{passive:true})}});
}
deck.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b)return;const q=+b.dataset.q,j=+b.dataset.j;if(ans[q]!==undefined)return;
  const Q=L[cur].quiz[q];ans[q]=j===Q.a;if(Q._r)rmark(Q._r.id,Q._r.q,j===Q.a);else if(j!==Q.a&&!cur.endsWith('-T'))rmark(cur,q,false);b.parentNode.querySelectorAll('.opt').forEach((o,k)=>{if(k===Q.a)o.classList.add('r');else if(k===j)o.classList.add('w')});
  const w=document.getElementById('w'+q);w.innerHTML=(j===Q.a?'<b>Correct.</b> ':'<b>Not quite.</b> ')+Q.w;w.classList.add('on');setTimeout(()=>w.scrollIntoView({behavior:CALM?'auto':'smooth',block:'nearest'}),250);
  if(Object.keys(ans).length===L[cur].quiz.length)finish()});
function countUp(el,to){if(!el)return;if(CALM){el.textContent=to;return}let n=0;const step=()=>{el.textContent=n;if(n++<to)setTimeout(step,1000/Math.max(to,1))};step()}
function goQ(i){deck.scrollTo({left:(1+(window.LCOUNT||0)+i)*deck.clientWidth,behavior:CALM?'auto':'smooth'})}
function meter(sc,n,f){const C=(2*Math.PI*54).toFixed(1),tier=f>=.8?'gold':f>=.6?'silver':'amber';
  const dots=Array.from({length:n},(_,i)=>`<button class="dt ${ans[i]?'ok':'bad'}" onclick="goQ(${i})" aria-label="Question ${i+1}: ${ans[i]?'correct':'missed'}"></button>`).join('');
  const first=Array.from({length:n},(_,i)=>i).find(i=>!ans[i]);
  return `<div class="endhead">${LUM(endPose(f),'qres')}<div class="meter ${tier}"><svg viewBox="0 0 140 140" aria-hidden="true"><circle class="trk" cx="70" cy="70" r="54"/><circle class="arc" id="mArc" cx="70" cy="70" r="54" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 70 70)"/></svg><div class="mc"><b id="scN">0</b><small>of ${n}</small></div><span class="pc">${Math.round(f*100)}%</span></div></div>
  <div class="dots">${dots}</div>${first!==undefined?`<button class="linkbtn rv" onclick="goQ(${first})">See what I missed</button>`:''}`}
function animMeter(f){const a=document.getElementById('mArc');if(!a)return;const C=parseFloat(a.getAttribute('stroke-dasharray'));a.style.strokeDashoffset=C*(1-f)}
function finish(){const sc=Object.values(ans).filter(Boolean).length,n=L[cur].quiz.length,f=sc/n,lv0=lvlOf(stats().xp).n;let xp=0,title,msg;
  if(!S.days.includes(today())){xp+=10;S.days.push(today())}
  if(cur==='REVIEW'){xp+=3*sc;S.rv=(S.rv||0)+1;const left=n-sc;title=left?'Getting there':'All of them, first try';msg=left?`${left} will come back tomorrow. The rest return in a few days, then a week, then three weeks.`:'These return in a few days to make sure they stay.'}
  else if(cur==='MIX'){xp+=20+4*sc;S.mixBest=Math.max(S.mixBest||0,f);S.mixN=(S.mixN||0)+1;title=f>=.8?'Sharp recall':f>=.6?'Holding steady':'Rusty in places';msg=f>=.8?'That is what lasting memory looks like.':'The ones you missed will come back in your reviews.'}
  else{if(cur.endsWith('-T')){xp+=10+4*sc;S.tests=S.tests||{};S.tests[cur]=Math.max(f,S.tests[cur]||0)}else{xp+=S.done[cur]?5+2*sc:30+5*sc;S.done[cur]=1;S.scores[cur]=f}
    title=f>=.8?'Laurels earned':f>=.6?'Solid work':'Worth another read';msg=f>=.8?'You know this well enough to write on it.':f>=.6?'Skim the cards you missed once more.':'Come back to this one tomorrow.'}
  S.xp=(S.xp||0)+xp;save();pushSync();
  document.getElementById('end').innerHTML=`${meter(sc,n,f)}<h2 style="margin-top:6px">${title}</h2><p>${msg}</p>${xpLine(xp,lv0)}<button class="start" onclick="back()">Back to the syllabus</button>`;
  setTimeout(()=>{countUp(document.getElementById('scN'),sc);animMeter(f)},300);
  setTimeout(()=>{checkBadges();const v=lvlOf(stats().xp);if(v.n>lv0)toast(`<span class="ltile sm">${LUM('rewards-6')}</span><span><small>Level up</small><b>Level ${v.n} · ${v.name}</b></span>`)},1400)}
let curCard=0;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.35});
let lastI=-1;
function upd(){const n=deck.children.length,i=Math.round(deck.scrollLeft/deck.clientWidth),nc=window.LCOUNT||0,nq=(L[cur]&&L[cur].quiz.length)||0;curCard=i-1;
  const pg=document.getElementById('pg'),pr=pg.parentNode;pg.style.width=((i+1)/n*100)+'%';pr.style.setProperty('--split',nc?((nc+1)/n*100)+'%':'-9px');pr.classList.toggle('inq',i>nc);
  document.getElementById('cnt').textContent=i===0?(nc?nc+' cards':nq+' questions'):i<=nc?`Card ${i}/${nc}`:i<=nc+nq?`Question ${i-nc}/${nq}`:'Done';
  if(i!==lastI){lastI=i;if(nc&&i>=1&&i<=nc&&!/^(REVIEW|MIX)$|-T$/.test(cur)){try{const l=JSON.parse(ls.get('lb:last')||'{}');if(l.id===cur){l.card=i-1;ls.set('lb:last',JSON.stringify(l))}}catch(e){}}}}
deck.addEventListener('scroll',()=>requestAnimationFrame(upd));
/* ---------- motion helpers: every screen change crossfades smoothly ---------- */
const CALM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function morph(fn){return fn()}
function show(v,kind){const nv=document.getElementById(v);if(nv.classList.contains('on'))return;
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===v));window.scrollTo(0,0);
  if(CALM)return;kind=kind||(v==='lesson'?'up':v==='home'?'down':'fade');
  nv.classList.remove('enter-up','enter-down','enter-fade');void nv.offsetWidth;nv.classList.add('enter-'+kind);
  setTimeout(()=>nv.classList.remove('enter-'+kind),900)}
function softSwap(fn){const h=document.getElementById('home');if(CALM)return fn();h.classList.add('swap-out');setTimeout(async()=>{await fn();const a=document.getElementById('heroArt');await Promise.race([a.ready,new Promise(r=>setTimeout(r,800))]);scrollTo(0,0);h.classList.remove('swap-out');h.classList.add('swap-in');setTimeout(()=>h.classList.remove('swap-in'),1000)},450)}
function openSheetEl(s){s.hidden=false;s.classList.remove('closing')}
function closeSheetEl(s){if(s.hidden)return;s.classList.add('closing');setTimeout(()=>{s.hidden=true;s.classList.remove('closing')},CALM?0:420)}
function back(){window.stopListen&&stopListen();show('home');renderHome()}
document.getElementById('close').onclick=back;

/* ---------- themes ---------- */
const loadedFonts=new Set();
function applyTheme(id){
  const t=THEMES[id]||THEMES.polis,root=document.documentElement;
  Object.keys(THEMES).forEach(k=>Object.keys(THEMES[k].vars).forEach(v=>root.style.removeProperty(v)));
  Object.entries(t.vars).forEach(([k,v])=>root.style.setProperty(k,v));
  /* fonts are bundled in fonts/fonts.css */
  const art=document.getElementById('heroArt');
  const img=(SUB&&SUB.hero)||t.heroImage;
  art.parentNode.classList.toggle('has-img',!!img);
  if(img){const im=new Image();im.alt='';im.className='heroimg';im.decoding='async';im.src=img;art.replaceChildren(im);
    art.ready=(im.decode?im.decode():new Promise(r=>im.onload=r)).catch(()=>{}).then(()=>im.classList.add('in'))}
  if(img&&SUB&&SUB.heroVideo&&!CALM&&!(navigator.connection&&navigator.connection.saveData)){const v=document.createElement('video');v.className='herovid';v.muted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.preload='auto';v.setAttribute('aria-hidden','true');
    v.innerHTML=`<source src="${SUB.heroVideo}.webm" type="video/webm"><source src="${SUB.heroVideo}.mp4" type="video/mp4">`;
    v.addEventListener('canplay',()=>{v.play().catch(()=>{});v.classList.add('in')},{once:true});art.appendChild(v)}
  if(!img){art.innerHTML=`<svg viewBox="0 0 360 260" aria-hidden="true"><defs><radialGradient id="eg"><stop offset="0" stop-color="var(--gold)" stop-opacity=".4"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="130" r="120" fill="url(#eg)"/><circle cx="180" cy="130" r="78" fill="none" stroke="var(--gold)" stroke-width="2"/><circle cx="180" cy="130" r="64" fill="none" stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 5"/><text x="180" y="152" font-size="62" text-anchor="middle">${t.glyph||'✦'}</text></svg>`;art.ready=Promise.resolve()}
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
  const [m,x]=await Promise.all([fetch(path('syllabus.json')).then(r=>r.json()),fetch(path('lessons/index.json')).then(r=>r.json()),fetch(path('pyq.json')).then(r=>r.ok?r.json():{}).catch(()=>({})).then(j=>PYQ=j)]);
  MAP=m;IDX=x;ids=[];MAP.forEach((p,pi)=>p.units.forEach((u,ui)=>{for(let k=0;k<u[1].length;k++)ids.push(`${pi}-${ui}-${k}`)}));
  renderHome();
}
const sheet=document.getElementById('sheet');
function openSheet(onlySubj){
  document.getElementById('sheetAcct').hidden=onlySubj===true;document.getElementById('subjH').textContent=onlySubj===true?'Choose a subject':'Subjects';
  document.getElementById('subjList').innerHTML=SUBJ.map(s=>{const t=THEMES[s.theme]||THEMES.polis,a=t.vars['--gold']||'#c9a45c',b=t.vars['--lapis']||'#13294b';
    return `<button class="choice${s.id===SUB.id?' on':''}" onclick="pickSubject('${s.id}')"><span class="sic" style="--a:${a};--b:${b}">${icon(s.id)}</span><span><strong>${s.title}</strong> · ${s.name}<small>${s.full}</small></span></button>`}).join('');
  openSheetEl(sheet)}
/* Switch subject: preload the next subject's data and art first, then fade out, swap while hidden and fade in. */
async function pickSubject(id){closeSheetEl(sheet);if(SUB&&id===SUB.id)return;
  const n=SUBJ.find(s=>s.id===id)||SUBJ[0],t=THEMES[n.theme]||THEMES.polis,img=n.hero||t.heroImage;
  const pre=Promise.all([img?(()=>{const i=new Image();i.src=img;return i.decode().catch(()=>{})})():0]);
  await Promise.race([pre,new Promise(r=>setTimeout(r,1500))]);softSwap(()=>loadSubject(id))}
function pickTheme(k){ls.set('theme:'+SUB.id,k);applyTheme(k);openSheet()}
document.getElementById('pick').onclick=()=>openSheet(true);
document.getElementById('mine').onclick=()=>window.openMe?window.openMe():openSheet();
document.getElementById('sheetClose').onclick=()=>closeSheetEl(sheet);
sheet.addEventListener('click',e=>{if(e.target===sheet)closeSheetEl(sheet)});

/* ---------- daily reminders (web push) ---------- */
const API=window.LB_API||'';  // server for push + built-in Gemini (Cloudflare, later). Empty = off.
const pushOn=document.getElementById('pushOn'),pushHour=document.getElementById('pushHour'),pushNote=document.getElementById('pushNote');
for(let h=5;h<=23;h++)pushHour.add(new Option((h%12||12)+(h<12?' am':' pm'),h));
pushHour.value=ls.get('pushHour')||'19';pushOn.checked=ls.get('push')==='1';
const b64=s=>{const p='='.repeat((4-s.length%4)%4),r=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(r,c=>c.charCodeAt(0))};
function studyState(){const next=ids.find(i=>IDX[i]&&!S.done[i]);let chapter='',left=0;
  if(next){const [p,u]=next.split('-');chapter=MAP[p].units[u][0];left=MAP[p].units[u][1].filter((_,k)=>!S.done[`${p}-${u}-${k}`]).length}
  return {streak:streak(),doneDay:allDays().has(today())?today():'',subject:SUB.title,next:next?IDX[next].title:'',chapter,chapterLeft:left}}
/* In the Android app (Capacitor), reminders are scheduled on the phone and the widget reads the study state. */
const CAP=window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform();
async function nativeSync(off){const P=Capacitor.Plugins,st=studyState(),studied=!!st.doneDay;
  const [cp,cu]=(ids.find(i=>IDX[i]&&!S.done[i])||'0-0-0').split('-'),chTotal=MAP[cp]?MAP[cp].units[cu][1].length:0;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()||'#F2C46D';
  const sstreak=days=>{const set=new Set(days||[]);let n=0,d=new Date();if(!set.has(ds(d)))d.setDate(d.getDate()-1);while(set.has(ds(d))){n++;d.setDate(d.getDate()-1)}return n};
  const subjects=allS().map(({s,p})=>({t:s.title,streak:sstreak(p.days),done:Object.keys(p.done||{}).length})).filter(x=>x.done||x.streak).sort((a,b)=>b.streak-a.streak||b.done-a.done).slice(0,4);
  try{await P.Preferences.set({key:'widget',value:JSON.stringify({...st,sid:SUB.id,studiedToday:studied,days:[...allDays()].sort().slice(-60),chapterTotal:chTotal,accent,subjects})})}catch(e){}
  const LN=P.LocalNotifications;if(!LN)return;
  try{const pend=await LN.getPending();if(pend.notifications.length)await LN.cancel({notifications:pend.notifications.map(n=>({id:n.id}))})}catch(e){}
  if(off||ls.get('push')!=='1')return;
  const h=+pushHour.value,nx=st.next?`“${st.next}”`:'your next lesson',list=[];
  for(let d=0;d<7;d++){const t=new Date();t.setDate(t.getDate()+d);t.setHours(h,0,0,0);if(t<=new Date()||(d===0&&studied))continue;
    const sk=st.streak+(d===0?0:0);list.push({id:100+d,title:sk>=2?`🔥 Keep your ${sk}-day streak going`:'💡 Today’s lesson is ready',body:`${st.subject}: ${nx}. About 15 minutes.`,schedule:{at:t,allowWhileIdle:true}})}
  const w=new Date();w.setHours(21,0,0,0);
  if(!studied&&st.streak>0&&w>new Date())list.push({id:200,title:`🔥 Your ${st.streak}-day streak ends at midnight`,body:`One lesson saves it: ${nx}.`,schedule:{at:w,allowWhileIdle:true}});
  if(list.length)await LN.schedule({notifications:list.map(n=>({...n,extra:{url:'./?go=continue'}}))})}
async function pushSync(off){if(CAP)return nativeSync(off);try{
  if(!('serviceWorker' in navigator)||!('PushManager' in window))return;
  const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
  if(off){if(sub){await fetch(API+'/api/push-sync',{method:'POST',body:JSON.stringify({sub,off:true})});await sub.unsubscribe()}return}
  if(ls.get('push')!=='1')return;
  if(!API)return;
  if(!sub){const {key}=await fetch(API+'/api/push-key').then(r=>r.json());sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(key)})}
  await fetch(API+'/api/push-sync',{method:'POST',body:JSON.stringify({sub,hour:+pushHour.value,tz:new Date().getTimezoneOffset(),...studyState()})});
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
/* ---------- loading screen ---------- */
(()=>{const box=document.querySelector('#splash .sp-stars');if(!box)return;let h='';
  for(let i=0;i<45;i++){const z=(Math.random()*2.2+.6).toFixed(1);h+=`<b style="left:${(Math.random()*100).toFixed(2)}%;top:${(Math.random()*100).toFixed(2)}%;--z:${z}px;--t:${(Math.random()*3+2).toFixed(1)}s;--d:${(Math.random()*3).toFixed(1)}s"></b>`}
  box.innerHTML=h})();
const splashStart=Date.now();
function hideSplash(){const s=document.getElementById('splash');if(!s||s.classList.contains('out'))return;setTimeout(()=>{s.classList.add('out');setTimeout(()=>s.remove(),800)},Math.max(0,1800-(Date.now()-splashStart)))}
setTimeout(hideSplash,6000);
let DOODLES={};
const mk=(u,cls)=>`<i class="${cls}" style="--u:url('${u}')"></i>`;
const doodle=(id,cls='dd')=>{const [p,u]=id.split('-'),k=p+'-'+u;return SUB&&((DOODLES.units||{})[SUB.id]||[]).includes(k)?mk(`art/doodles/${SUB.id}/${k}.svg`,cls):''};
// lesson doodles: cover (lessonId) and key cards (lessonId_k)
const ldood=(name,cls)=>SUB&&((DOODLES.lessons||{})[SUB.id]||[]).includes(name)?mk(`art/doodles/${SUB.id}/L/${name}.svg`,cls):'';
(async()=>{SUBJ=await fetch('subjects.json').then(r=>r.json());DOODLES=await fetch('doodles.json').then(r=>r.json()).catch(()=>({}));fetch('photos.json').then(r=>r.json()).then(j=>PHOTOS=j).catch(()=>{});await loadSubject(ls.get('subject')||SUBJ[0].id);await Promise.race([document.getElementById('heroArt').ready,new Promise(r=>setTimeout(r,3500))]);checkBadges(true);hideSplash();handleGo();import('./account.js').catch(e=>{const a=document.getElementById('acct');if(a)a.innerHTML='<p class="note">Sign-in needs the internet. Your progress is still saved on this phone.</p>'});pushSync()})();
/* ---------- chapter tests: 15 questions drawn from every lesson in the chapter ---------- */
async function openReview(){const due=rdue().sort((a,b)=>a.due-b.due).slice(0,15),quiz=[];
  try{for(const r of due){const l=await getLesson(r.id);if(l.quiz[r.q])quiz.push({...l.quiz[r.q],_r:r,_t:l.title})}}catch(e){alert('Review could not load. Check your connection.');return}
  if(!quiz.length)return;L.REVIEW={title:'Review',emoji:'↻',cards:[],quiz};await openL('REVIEW');
  const c=deck.querySelector('.cover');if(c)c.innerHTML=`${LUM('review-1','lumcov')}<div class="tag">Review</div><h2>${quiz.length} question${quiz.length==1?'':'s'} you missed</h2><p class="hint">Swipe left to begin</p>`}
/* Mixed revision: 20 questions drawn from lessons you have finished, leaning towards the ones you scored lower on. */
async function openMix(){const done=Object.keys(S.done).filter(i=>IDX[i]&&!i.endsWith('-T'));if(done.length<3)return;
  const pick=done.map(i=>({i,k:(S.scores[i]??.7)+Math.random()*.5})).sort((a,b)=>a.k-b.k).slice(0,Math.min(12,done.length)).map(x=>x.i),pool=[];
  try{const ls_=await Promise.all(pick.map(getLesson));ls_.forEach((l,j)=>{const idx=l.quiz.map((_,q)=>q).sort(()=>Math.random()-.5).slice(0,2);idx.forEach(q=>pool.push({...l.quiz[q],_r:{id:pick[j],q},_t:l.title}))})}
  catch(e){alert('The test could not load. Check your connection.');return}
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const quiz=pool.slice(0,20);L.MIX={title:'Mixed revision',emoji:'⚄',cards:[],quiz};await openL('MIX');
  const c=deck.querySelector('.cover');if(c)c.innerHTML=`${LUM('review-6','lumcov')}<div class="tag">Mixed revision</div><h2>${quiz.length} questions from across what you've learned</h2><p class="hint">Swipe left to begin</p>`}
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
  if(q.length<2){out.innerHTML=`<div class="lumsearch"><span class="ltile lg">${LUM('study-1')}</span><p>What are we looking for?</p></div>`;return}
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
document.getElementById('srch').onclick=()=>{show('search');runSearch();document.getElementById('q').focus()};
document.getElementById('srchClose').onclick=back;
document.getElementById('q').addEventListener('input',()=>{clearTimeout(qTimer);qTimer=setTimeout(runSearch,200)});
document.getElementById('qAll').onchange=runSearch;
document.getElementById('results').addEventListener('click',async e=>{const b=e.target.closest('.hit');if(!b)return;const x=document.getElementById('results')._hits[+b.dataset.k];
  if(x.sub.id!==SUB.id)await loadSubject(x.sub.id);openL(x.id,x.card)});

/* ---------- ask a doubt ---------- */
const askSheet=document.getElementById('askSheet'),chat=document.getElementById('chat');
const isGem=m=>m.startsWith('gemini'),keyName=m=>isGem(m)?'askKeyGemini':'askKey';
function keyHint(){const m=document.getElementById('model').value,k=document.getElementById('apiKey');k.placeholder=isGem(m)?(window.LB_API?'Optional: your own Gemini key (built-in one is used if empty)':'Your Gemini API key (from aistudio.google.com)'):'sk-ant-… (from console.anthropic.com)';k.value=''}
function askView(){const m=ls.get('askModel')||'gemini-flash-latest';document.getElementById('model').value=m;keyHint();const has=(isGem(m)&&!!window.LB_API)||!!ls.get(keyName(m));document.getElementById('keyBox').hidden=has;document.getElementById('chatBox').hidden=!has}
document.getElementById('askBtn').onclick=()=>{if(askSheet._lesson!==cur){chat.innerHTML='';askSheet._lesson=cur}askView();openSheetEl(askSheet)};
document.getElementById('askClose').onclick=()=>closeSheetEl(askSheet);
askSheet.addEventListener('click',e=>{if(e.target===askSheet)closeSheetEl(askSheet)});
document.getElementById('model').onchange=()=>{const m=document.getElementById('model').value;keyHint();if((isGem(m)&&window.LB_API)||ls.get(keyName(m))){ls.set('askModel',m);askView()}};
document.getElementById('saveKey').onclick=()=>{const m=document.getElementById('model').value,k=document.getElementById('apiKey').value.trim();ls.set('askModel',m);if(k)ls.set(keyName(m),k);if(!(isGem(m)&&window.LB_API)&&!ls.get(keyName(m)))return;askView()};
document.getElementById('changeKey').onclick=()=>{document.getElementById('keyBox').hidden=false;document.getElementById('chatBox').hidden=true};
document.getElementById('sendDoubt').onclick=async()=>{
  const ta=document.getElementById('doubt'),q=ta.value.trim();if(!q)return;ta.value='';
  const me=document.createElement('div');me.className='qa me';me.textContent=q;chat.appendChild(me);
  const ai=document.createElement('div');ai.className='qa ai';ai.textContent='Thinking…';chat.appendChild(ai);chat.scrollTop=chat.scrollHeight;
  if(!navigator.onLine){ai.textContent='You are offline. Asking a doubt needs the internet.';return}
  try{const {ask}=await import('./ask.js');
    const ansText=await ask({apiKey:ls.get(keyName(ls.get('askModel')||'gemini-flash-latest'))||'',model:ls.get('askModel')||'gemini-flash-latest',subject:SUB.full,lessonId:SUB.id+'/'+cur,lesson:L[cur],cardIndex:Math.max(0,Math.min(curCard,L[cur].cards.length-1)),question:q,onText:t=>{ai.textContent=t;chat.scrollTop=chat.scrollHeight}});window.onDoubt&&window.onDoubt({subject:SUB.id,subjectTitle:SUB.title,lessonId:cur,lessonTitle:L[cur].title,q,a:ansText})}
  catch(err){ai.textContent=(err&&err.status===401)?'That API key was rejected. Tap "Change key or model".':'Could not get an answer: '+(err&&err.message||err)}};

if('serviceWorker' in navigator){
  /* No forced reload on an update: the worker asks the network first, so pages are already fresh. */
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(r=>{r.update();navigator.serviceWorker.ready.then(g=>setTimeout(()=>{try{g.active&&g.active.postMessage('warm')}catch(e){}},6000))}).catch(()=>{}))}

/* Hide hosting badges or toolbars injected by the host (e.g. "Powered by Netlify"). */
(()=>{const kill=n=>{if(n.nodeType!==1||n.closest('.view,.sheet,.ambient'))return;
  const t=(n.textContent||'')+' '+(n.id||'')+' '+(n.className&&n.className.baseVal!==undefined?n.className.baseVal:n.className||'')+' '+(n.getAttribute('href')||'')+' '+(n.getAttribute('src')||'');
  if(/netlify/i.test(t))n.remove()};
  const sweep=()=>[...document.body.children].forEach(kill);
  new MutationObserver(m=>m.forEach(r=>r.addedNodes.forEach(kill))).observe(document.body,{childList:true});
  sweep();setTimeout(sweep,1500);setTimeout(sweep,5000)})();
