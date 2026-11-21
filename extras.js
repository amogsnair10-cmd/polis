/* Extras: daily challenge, weekly recap, share cards. Classic script that shares app.js's globals (S, allS, today, LUM, toast, getLesson...). */
(()=>{
const $=id=>document.getElementById(id);
const DAY=864e5,parse=d=>Date.parse(d+'T00:00:00');
const P=n=>String(n).padStart(2,'0');
/* ---------- seeded random so the daily set is the same all day ---------- */
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

/* ---------- daily challenge ---------- */
function dailyDone(){try{return allS().some(({p})=>(p.dc||[]).includes(today()))}catch(e){return false}}
async function openDaily(){
  if(dailyDone())return;
  const done=Object.keys(S.done).filter(i=>IDX[i]&&!i.endsWith('-T'));if(done.length<3)return;
  const r=rng(hash(today()+SUB.id)),pool=[...done];for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const pick=pool.slice(0,5);let quiz=[];
  try{const ls_=await Promise.all(pick.map(getLesson)),taken=pick.map(()=>new Set());
    for(let i=0;i<5;i++){const j=i%pick.length,l=ls_[j];let qi,t=0;do{qi=Math.floor(r()*l.quiz.length)}while(taken[j].has(qi)&&++t<30);taken[j].add(qi);quiz.push({...l.quiz[qi],_r:{id:pick[j],q:qi},_t:l.title})}}
  catch(e){alert('The challenge could not load. Check your connection.');return}
  L.DAILY={title:'Daily challenge',emoji:'☀',cards:[],quiz};await openL('DAILY');
  const c=deck.querySelector('.cover');if(c)c.innerHTML=`${LUM('daily-1','lumcov')}<div class="tag">Daily challenge</div><h2>Five questions. One a day.</h2><p class="hint">Swipe left to begin</p>`;
}
window.openDaily=openDaily;

/* ---------- weekly numbers ---------- */
function monday(d){const x=new Date(d);const wd=(x.getDay()+6)%7;x.setDate(x.getDate()-wd);return x}
const dstr=d=>`${d.getFullYear()}-${P(d.getMonth()+1)}-${P(d.getDate())}`;
function weekStats(mon){
  const dates=[...Array(7)].map((_,i)=>{const d=new Date(mon);d.setDate(d.getDate()+i);return dstr(d)}),set=new Set(dates);
  const t={lessons:0,xp:0,days:0,a:0,n:0},per={};
  for(const{s,p}of allS()){for(const d of dates){const g=(p.log||{})[d];if(!g)continue;t.lessons+=g.l||0;t.xp+=g.xp||0;t.a+=g.a||0;t.n+=g.n||0;const q=per[s.id]=per[s.id]||{title:s.title,a:0,n:0};q.a+=g.a||0;q.n+=g.n||0}}
  t.days=[...allDays()].filter(d=>set.has(d)).length;
  const ranked=Object.values(per).filter(x=>x.n>=5).map(x=>({...x,acc:x.a/x.n})).sort((a,b)=>b.acc-a.acc);
  t.best=ranked[0]||null;t.worst=ranked.length>1?ranked[ranked.length-1]:null;t.acc=t.n?t.a/t.n:null;t.dates=dates;return t}
function weekToShow(){const now=new Date(),wd=(now.getDay()+6)%7;/* Sun -> this week; Mon -> last week */
  if(wd===6)return monday(now);if(wd===0){const m=monday(now);m.setDate(m.getDate()-7);return m}return null}

/* ---------- home cards ---------- */
function renderExtras(){
  const dc=$('daily');if(dc){const nd=Object.keys(S.done).filter(i=>!i.endsWith('-T')).length,done=dailyDone();
    dc.hidden=nd<3;dc.classList.toggle('isdone',done);dc.disabled=done;
    if(nd>=3){dc.onclick=done?null:openDaily;dc.innerHTML=`<span class="ltile">${LUM(done?'streak-1':'daily-1')}</span><div><div class="day">Daily challenge</div><b>${done?'Done for today':'5 questions, once a day'}</b><small>${done?'A new set arrives tomorrow':'+25 bonus XP, +15 more for a perfect score'}</small></div><span class="go">${done?'✓':'Start'}</span>`}}
  const rc=$('recapcard');if(rc){const m=weekToShow(),key=m?dstr(m):'',seen=(()=>{try{return localStorage.getItem('lb:recap')}catch(e){return null}})();
    const st=m?weekStats(m):null,show=m&&seen!==key&&st&&(st.lessons||st.n||st.days);
    rc.hidden=!show;if(show){rc.onclick=()=>openRecap(m,true);rc.innerHTML=`<span class="ltile">${LUM('rewards-3')}</span><div><div class="day">Your week</div><b>${st.lessons} lesson${st.lessons==1?'':'s'}, ${st.xp} XP</b><small>See your weekly recap</small></div><span class="go">Open</span>`}}
}
window.renderExtras=renderExtras;

/* ---------- recap sheet ---------- */
function modal(html,cls){const old=$('xmodal');if(old)old.remove();const m=document.createElement('div');m.id='xmodal';m.className='xm '+(cls||'');m.innerHTML=`<div class="xm-in marble"><button class="x xm-x" aria-label="Close">×</button>${html}</div>`;
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.xm-x'))m.remove()});document.body.appendChild(m);return m}
function pct(x){return x==null?'–':Math.round(x*100)+'%'}
function openRecap(mon,mark){
  mon=mon||monday(new Date());const st=weekStats(mon),prev=new Date(mon);prev.setDate(prev.getDate()-7);const pv=weekStats(prev);
  if(mark){try{localStorage.setItem('lb:recap',dstr(mon))}catch(e){}const rc=$('recapcard');if(rc)rc.hidden=true}
  const d=(a,b)=>a>b?`<i class="up">+${a-b}</i>`:a<b?`<i class="dn">${a-b}</i>`:'';
  const end=new Date(mon);end.setDate(end.getDate()+6);const rng_=`${mon.getDate()} ${mon.toLocaleString('en',{month:'short'})} to ${end.getDate()} ${end.toLocaleString('en',{month:'short'})}`;
  const empty=!(st.lessons||st.n||st.days);
  const m=modal(`<div class="rc-top"><span class="ltile lg">${LUM(empty?'daily-3':st.lessons>=5?'rewards-3':'streak-1')}</span><div><div class="tag">Your week</div><h2>${rng_}</h2></div></div>
    ${empty?'<p class="rc-none">Nothing yet this week. One lesson fills the first box.</p>':`<div class="rc-grid">
      <div><b>${st.lessons}</b><small>lessons ${d(st.lessons,pv.lessons)}</small></div>
      <div><b>${st.xp}</b><small>XP ${d(st.xp,pv.xp)}</small></div>
      <div><b>${st.days}/7</b><small>study days ${d(st.days,pv.days)}</small></div>
      <div><b>${pct(st.acc)}</b><small>quiz accuracy</small></div></div>
      <div class="rc-dots">${st.dates.map(x=>`<span class="${allDays().has(x)?'on':''}" title="${x}"></span>`).join('')}</div>
      ${st.best?`<p class="rc-line"><b>Strongest:</b> ${esc(st.best.title)} <em>${pct(st.best.acc)}</em></p>`:'<p class="rc-line">Answer a few more quiz questions and your strongest subject shows up here.</p>'}
      ${st.worst?`<p class="rc-line"><b>Needs love:</b> ${esc(st.worst.title)} <em>${pct(st.worst.acc)}</em></p>`:''}`}
    <div class="rc-btns"><button class="start" id="rcShare">Share my week</button></div>`);
  const b=m.querySelector('#rcShare');if(b)b.onclick=()=>shareCard('week',{st,range:rng_});
}
window.openRecap=openRecap;

/* ---------- share cards (drawn on a canvas, 1080 x 1350) ---------- */
const img=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
const cv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function stars(c,W,H,seed){const r=rng(seed);for(let i=0;i<110;i++){c.globalAlpha=.15+r()*.55;c.fillStyle='#fff';c.beginPath();c.arc(r()*W,r()*H*.85,.6+r()*1.8,0,7);c.fill()}c.globalAlpha=1}
function glow(c,x,y,rad,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2)}
function fit(c,text,x,y,max,size,font,weight){let s=size;do{c.font=`${weight||700} ${s}px ${font}`;s-=4}while(c.measureText(text).width>max&&s>24);c.fillText(text,x,y)}
async function drawCard(kind,d){
  const W=1080,H=1350,cvs=document.createElement('canvas');cvs.width=W;cvs.height=H;const c=cvs.getContext('2d');
  const night=cv('--night')||'#0b1428',lapis=cv('--lapis')||'#13294b',gold=cv('--gold')||'#f2c46d',acc=cv('--accent-rgb')||'242,196,109';
  const F=`"Cinzel","Cormorant Garamond",Georgia,serif`,B=`"Manrope","Inter",system-ui,sans-serif`,H2=`"Caveat","Segoe Print",cursive`;
  try{await document.fonts.load('700 80px Cinzel');await document.fonts.load('500 30px Manrope')}catch(e){}
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,lapis);bg.addColorStop(.55,night);bg.addColorStop(1,'#04060d');c.fillStyle=bg;c.fillRect(0,0,W,H);
  stars(c,W,H,7);glow(c,W/2,H*.62,720,acc,.34);
  c.textAlign='center';c.fillStyle=gold;c.globalAlpha=.9;c.font=`700 40px ${F}`;c.letterSpacing='10px';c.fillText('LIGHT BULB',W/2,112);c.letterSpacing='0px';c.globalAlpha=1;
  let pose,top;
  if(kind==='streak'){pose=d.n>=30?'streak-6':d.n>=7?'streak-5':'streak-1';
    c.fillStyle='#fff';fit(c,String(d.n),W/2,470,820,340,F,700);c.fillStyle=gold;c.font=`400 76px ${H2}`;c.fillText(d.n==1?'day streak':'day streak',W/2,562);
    if(d.bank){c.fillStyle='#cfeaff';c.font=`600 38px ${B}`;c.fillText(`❄ ${d.bank} streak freeze${d.bank>1?'s':''} saved up`,W/2,626)}
    c.fillStyle='rgba(255,255,255,.75)';c.font=`500 34px ${B}`;c.fillText(d.sub||'',W/2,H-86)}
  else if(kind==='badge'){pose=d.pose;
    const R=250,cx=W/2,cy=520,g=c.createConicGradient?c.createConicGradient(.5,cx,cy):null;
    const tier=d.tier==='l'?['#fff1b8','#e0a93a','#fff7d6','#b9791c','#ffe08a','#e0a93a']:d.tier==='g'?['#ffe9a6','#c08a1e','#ffe9a6']:d.tier==='s'?['#eef2f8','#8795a8','#eef2f8']:['#d9a56b','#8a5a2b','#d9a56b'];
    if(g){tier.forEach((col,i)=>g.addColorStop(i/(tier.length-1),col));c.fillStyle=g}else c.fillStyle=gold;c.beginPath();c.arc(cx,cy,R,0,7);c.fill();c.lineWidth=10;c.strokeStyle='rgba(255,255,255,.7)';c.stroke();
    const im=await img(`art/lumen/${pose}.webp`);if(im){c.save();c.beginPath();c.arc(cx,cy,R-12,0,7);c.clip();const k=(R*1.9)/im.height;c.drawImage(im,cx-im.width*k/2,cy+R*.95-im.height*k,im.width*k,im.height*k);c.restore()}
    c.fillStyle=gold;c.font=`400 62px ${H2}`;c.fillText('badge won',W/2,880);c.fillStyle='#fff';fit(c,d.name,W/2,980,900,96,F,700);
    c.fillStyle='rgba(255,255,255,.8)';c.font=`500 40px ${B}`;c.fillText(d.desc,W/2,1050);pose=null}
  else{pose='rewards-3';c.fillStyle='#fff';c.font=`700 74px ${F}`;c.fillText('My week',W/2,300);c.fillStyle=gold;c.font=`400 56px ${H2}`;c.fillText(d.range,W/2,370);
    const rows=[[d.st.lessons,'lessons'],[d.st.xp,'XP'],[d.st.days+'/7','study days'],[d.st.acc==null?'–':Math.round(d.st.acc*100)+'%','quiz accuracy']];
    rows.forEach((r,i)=>{const x=210+(i%2)*660,y=520+Math.floor(i/2)*210;c.fillStyle='#fff';c.font=`700 120px ${F}`;c.textAlign='center';c.fillText(String(r[0]),x,y);c.fillStyle='rgba(255,255,255,.7)';c.font=`500 38px ${B}`;c.fillText(r[1],x,y+56)});
    c.textAlign='center';if(d.st.best){c.fillStyle=gold;c.font=`600 40px ${B}`;c.fillText('Strongest: '+d.st.best.title,W/2,960)}
    top=1}
  if(pose){const im=await img(`art/lumen/${pose}.webp`);if(im){const h=kind==='streak'?560:380,k=h/im.height;c.drawImage(im,W/2-im.width*k/2,H-h-(kind==='streak'?120:90),im.width*k,h)}}
  c.fillStyle='rgba(255,255,255,.6)';c.textAlign='center';c.font=`500 32px ${B}`;c.fillText('lightbulb.amogbuilds.net',W/2,H-40);
  return cvs}
async function nativeShare(cvs,text){
  const blob=await new Promise(r=>cvs.toBlob(r,'image/png'));
  try{const file=new File([blob],'light-bulb.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text});return 'shared'}}catch(e){if(e&&e.name==='AbortError')return 'cancel'}
  const C=window.Capacitor&&Capacitor.Plugins;
  if(C&&C.Filesystem&&C.Share){try{const b64=cvs.toDataURL('image/png').split(',')[1];const r=await C.Filesystem.writeFile({path:'share/light-bulb.png',data:b64,directory:'CACHE',recursive:true});await C.Share.share({title:'Light Bulb',text,url:r.uri,dialogTitle:'Share'});return 'shared'}catch(e){}}
  try{if(navigator.share){await navigator.share({text:text+' https://lightbulb.amogbuilds.net'});return 'shared'}}catch(e){if(e&&e.name==='AbortError')return 'cancel'}
  return 'none'}
async function shareCard(kind,d){
  window.Feel&&Feel.play('open');
  const m=modal(`<div class="tag">Share</div><h2 class="shr-h">${kind==='streak'?'Your streak':kind==='badge'?'Your badge':'Your week'}</h2><div class="shr-prev"><span>Making your card…</span></div><div class="rc-btns"><button class="start" id="shGo" disabled>Share</button><a class="linkbtn" id="shDl" download="light-bulb.png" hidden>Save image</a></div><p class="note" id="shMsg"></p>`,'shr');
  const cvs=await drawCard(kind,d);if(!document.body.contains(m))return;
  const url=cvs.toDataURL('image/png');m.querySelector('.shr-prev').innerHTML=`<img src="${url}" alt="Your share card">`;
  const dl=m.querySelector('#shDl');dl.href=url;dl.hidden=false;
  const text=kind==='streak'?`I'm on a ${d.n}-day streak on Light Bulb.`:kind==='badge'?`I just won the "${d.name}" badge on Light Bulb.`:`My week on Light Bulb: ${d.st.lessons} lessons, ${d.st.xp} XP.`;
  const go=m.querySelector('#shGo');go.disabled=false;
  go.onclick=async()=>{const r=await nativeShare(cvs,text);const msg=m.querySelector('#shMsg');if(r==='none')msg.textContent='Sharing is not available here. Press and hold the picture to save it, then post it.';else if(r==='shared')window.Feel&&Feel.play('good')}}
window.shareCard=shareCard;
window.shareStreak=()=>{const r=runs();shareCard('streak',{n:r.cur,bank:r.bank,sub:`${stats().lessons} lessons finished · level ${lvlOf(stats().xp).n}`})};
window.shareBadge=id=>{const b=badgeState().all.find(x=>x.id===id);if(b&&b.got)shareCard('badge',{name:b.t,desc:b.d,tier:b.tier,pose:(window.BADGEPOSE||{})[id]||'rewards-2'})};
})();
