/* Polis app shell. Lessons live in lessons/<id>.json and load when opened.
   lessons/index.json lists the lessons that exist (built by scripts/build.js). */
let MAP=[],IDX={};const L={};
let S={done:{},scores:{},days:[]};
try{const s=localStorage.getItem('polis');if(s)S=JSON.parse(s)}catch(e){}
// Scores are stored as a fraction (0-1). Old saves stored a count out of 5.
for(const k in S.scores)if(S.scores[k]>1)S.scores[k]/=5;
const save=()=>{try{localStorage.setItem('polis',JSON.stringify(S))}catch(e){}};
let ids=[];
// Dates are the phone's local calendar day (IST for Indian users), never UTC.
const ds=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const today=()=>ds(new Date());
function streak(){let n=0,d=new Date();const set=new Set(S.days);if(!set.has(ds(d)))d.setDate(d.getDate()-1);while(set.has(ds(d))){n++;d.setDate(d.getDate()-1)}return n}
const unitOf=id=>{const [p,u]=id.split('-');return MAP[p].units[u][0]};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wreath=`<svg class="wreath" viewBox="0 0 200 110"><g fill="#a8792a">${[...Array(9)].map((_,i)=>{const a=(200-i*16)*Math.PI/180,x=100+70*Math.cos(a),y=100-70*Math.sin(a)*0.9;return `<ellipse cx="${x}" cy="${y}" rx="5" ry="12" transform="rotate(${-(200-i*16)+90} ${x} ${y})"/>`}).join('')}${[...Array(9)].map((_,i)=>{const a=(-20+i*16)*Math.PI/180,x=100+70*Math.cos(a),y=100-70*Math.sin(a)*0.9;return `<ellipse cx="${x}" cy="${y}" rx="5" ry="12" transform="rotate(${-(-20+i*16)+90} ${x} ${y})"/>`}).join('')}</g></svg>`;

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
  const r=await fetch(`lessons/${id}.json`);if(!r.ok)throw new Error(r.status);
  return L[id]=await r.json();
}
async function openL(id){
  let l;try{l=await getLesson(id)}catch(e){alert('This lesson could not load. Check your connection and try again.');return}
  cur=id;
  let h=`<div class="cd"><div class="ci marble cover"><div class="em">${l.emoji}</div><div class="tag">${unitOf(id)}</div><h2>${l.title}</h2><p class="hint">Swipe left to begin</p></div></div>`;
  l.cards.forEach(c=>h+=`<div class="cd"><div class="ci marble ${c.cls||''}"><div class="tag">${c.tag}</div><h2>${c.h}</h2>${c.b}</div></div>`);
  l.quiz.forEach((q,i)=>h+=`<div class="cd"><div class="ci marble"><div class="tag">Question ${i+1} of ${l.quiz.length}</div><h2 style="font-size:21px">${q.q}</h2>${q.o.map((o,j)=>`<button class="opt" data-q="${i}" data-j="${j}">${o}</button>`).join('')}<div class="why" id="w${i}"></div></div></div>`);
  h+=`<div class="cd"><div class="ci marble cover" id="end"><div class="tag">Answer every question to finish</div></div></div>`;
  deck.innerHTML=h;window.ans={};show('lesson');deck.scrollLeft=0;upd();deck.querySelectorAll('.ci').forEach(c=>{if(c.scrollHeight>c.clientHeight+4){const m=document.createElement('div');m.className='more';m.textContent='Scroll down for more';c.appendChild(m);c.addEventListener('scroll',()=>{if(c.scrollTop+c.clientHeight>=c.scrollHeight-30)m.style.opacity=0},{passive:true})}});
}
deck.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b)return;const q=+b.dataset.q,j=+b.dataset.j;if(ans[q]!==undefined)return;
  const Q=L[cur].quiz[q];ans[q]=j===Q.a;b.parentNode.querySelectorAll('.opt').forEach((o,k)=>{if(k===Q.a)o.classList.add('r');else if(k===j)o.classList.add('w')});
  const w=document.getElementById('w'+q);w.innerHTML=(j===Q.a?'<b>Correct.</b> ':'<b>Not quite.</b> ')+Q.w;w.classList.add('on');
  if(Object.keys(ans).length===L[cur].quiz.length)finish()});
function finish(){const s=Object.values(ans).filter(Boolean).length;const f=s/L[cur].quiz.length;S.done[cur]=1;S.scores[cur]=f;if(!S.days.includes(today()))S.days.push(today());save();
  document.getElementById('end').innerHTML=`${wreath}<div class="score">${s} / ${L[cur].quiz.length}</div><h2 style="margin-top:14px">${f>=.8?'Laurels earned':f>=.6?'Solid work':'Worth another read'}</h2><p>${f>=.8?'You know this well enough to write on it.':f>=.6?'Skim the cards you missed once more.':'Come back to this one tomorrow.'}</p><button class="start" onclick="back()">Back to the syllabus</button>`}
function upd(){const n=deck.children.length,i=Math.round(deck.scrollLeft/deck.clientWidth);document.getElementById('pg').style.width=((i+1)/n*100)+'%';document.getElementById('cnt').textContent=`${i+1}/${n}`}
deck.addEventListener('scroll',()=>requestAnimationFrame(upd));
function show(v){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===v));window.scrollTo(0,0)}
function back(){show('home');renderHome()}
document.getElementById('close').onclick=back;

(async()=>{
  const [m,x]=await Promise.all([fetch('syllabus.json').then(r=>r.json()),fetch('lessons/index.json').then(r=>r.json())]);
  MAP=m;IDX=x;ids=[];MAP.forEach((p,pi)=>p.units.forEach((u,ui)=>{for(let k=0;k<u[1].length;k++)ids.push(`${pi}-${ui}-${k}`)}));
  renderHome();
})();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
