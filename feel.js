/* Feel: haptics and small synthesized sounds (no audio files). Both can be switched off in Me. */
(()=>{
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const on=k=>ls.get('lb:'+k)!=='0';
const lvl=(k,d)=>{const v=parseInt(ls.get('lb:'+k),10);return isNaN(v)?d:Math.max(0,Math.min(100,v))};
const VOL=()=>lvl('vol',85)/100,HS=()=>lvl('hs',60)/60;
let ctx=null,master=null,verb=null,combo=0;
function ac(){if(!on('snd'))return null;try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();
  master=ctx.createGain();const cp=ctx.createDynamicsCompressor();cp.threshold.value=-16;cp.knee.value=12;cp.ratio.value=5;cp.attack.value=.003;cp.release.value=.12;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=9000;master.connect(cp);cp.connect(lp);lp.connect(ctx.destination);
  /* soft room echo: two short feedback delays, mixed low */
  verb=ctx.createGain();verb.gain.value=.22;const d1=ctx.createDelay(.5),d2=ctx.createDelay(.5),fb=ctx.createGain(),hp=ctx.createBiquadFilter();d1.delayTime.value=.083;d2.delayTime.value=.137;fb.gain.value=.38;hp.type='lowpass';hp.frequency.value=3200;
  verb.connect(d1);verb.connect(d2);d1.connect(hp);d2.connect(hp);hp.connect(fb);fb.connect(d1);fb.connect(d2);hp.connect(master)}
  if(ctx.state==='suspended')ctx.resume();master.gain.value=VOL()*1.9;return ctx}catch(e){return null}}
/* one voice: pure, bell (inharmonic partials), wood (short pluck) */
function voice(f,t0,d,o={}){const c=ac();if(!c)return;const a=c.currentTime+t0,v=(o.v||.16)*1.7,kind=o.k||'bell',send=o.send===undefined?.6:o.send;
  const out=c.createGain();out.gain.setValueAtTime(0.0001,a);out.gain.exponentialRampToValueAtTime(v,a+(o.att||.008));out.gain.exponentialRampToValueAtTime(0.0001,a+d);out.connect(master);if(send){const sg=c.createGain();sg.gain.value=send;out.connect(sg);sg.connect(verb)}
  const parts=kind==='bell'?[[1,1],[2.76,.32],[5.4,.12],[8.93,.05]]:kind==='wood'?[[1,1],[2.1,.35]]:kind==='pure'?[[1,1],[2,.12]]:kind==='soft'?[[1,1],[2,.7],[3,.45],[4,.25],[5,.12]]:[[1,1],[2,.2]];
  parts.forEach(([m,g],i)=>{const osc=c.createOscillator(),pg=c.createGain();osc.type=kind==='saw'?'sawtooth':'sine';osc.frequency.setValueAtTime(f*m,a);if(o.to)osc.frequency.exponentialRampToValueAtTime(o.to*m,a+d);
    pg.gain.setValueAtTime(g,a);pg.gain.exponentialRampToValueAtTime(0.0001,a+d*(i?.55:1));osc.connect(pg);pg.connect(out);osc.start(a);osc.stop(a+d+.06)})}
function noise(t0,d,fq,v,type,att){const c=ac();if(!c)return;const a=c.currentTime+t0,len=Math.max(1,Math.floor(c.sampleRate*d)),buf=c.createBuffer(1,len,c.sampleRate),da=buf.getChannelData(0);for(let i=0;i<len;i++)da[i]=(Math.random()*2-1)*(1-i/len);
  const src=c.createBufferSource();src.buffer=buf;const f=c.createBiquadFilter();f.type=type||'bandpass';f.frequency.value=fq;f.Q.value=type?.7:1.2;const g=c.createGain();if(att){g.gain.setValueAtTime(0.0001,a);g.gain.linearRampToValueAtTime(v*1.7,a+att)}else g.gain.value=v*1.7;src.connect(f);f.connect(g);g.connect(master);src.start(a)}
/* C major pentatonic, so any run of notes sounds good */
const P=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1567.98];
const SND={
  /* tap: a guitar-pick "tock". A short woody pluck with a tiny tonal click on its front edge. Purely tonal, no noise, so nothing can sound like a snare. */
  tap:()=>{const r=.97+Math.random()*.06;voice(1250*r,0,.06,{k:'wood',v:.2,to:880*r,send:0});voice(2900*r,0,.012,{k:'pure',v:.12,to:2300*r,send:0});voice(420*r,.004,.05,{k:'wood',v:.12,to:300*r,send:0})},
  /* release: a smaller, higher tick */
  up:()=>{const r=.97+Math.random()*.06;voice(1700*r,0,.03,{k:'wood',v:.09,to:1350*r,send:0});voice(3300*r,0,.008,{k:'pure',v:.05,send:0})},
  open:()=>{voice(260,0,.08,{k:'pure',v:.18,to:140,send:.05});voice(390,.03,.06,{k:'pure',v:.08,to:260,send:.05})},
  /* swipe: a soft "whoom". A mid-range harmonic sweep that glides down (phones cannot play below ~200 Hz), under a slow breath of air that fades in and out. */
  swipe:()=>{voice(380,0,.42,{k:'soft',v:.2,to:175,send:.25,att:.1});noise(0,.42,1100,.1,'lowpass',.14)},
  /* lesson start: a soft two-note "ba-dum" lift */
  start:()=>{voice(P[2],0,.35,{v:.12});voice(P[5],.09,.5,{v:.14,send:.7});voice(P[9],.18,.6,{v:.1,send:.8})},
  /* xp / count-up tick: a tiny bright bell, rises as the number climbs */
  xp:()=>{const r=1+Math.min(Feel._xp||0,14)*.045;Feel._xp=(Feel._xp||0)+1;voice(1568*r,0,.12,{v:.08,send:.3})},
  /* combo milestone: extra sparkle on top of the right-answer chime */
  combo:()=>{[8,10,12,13].forEach((n,i)=>voice(P[n],i*.055,.5,{v:.09,send:.9}));noise(.1,.2,7500,.05)},
  good:()=>{const i=Math.min(combo,5);combo++;const r=P[4+i];voice(r,0,.5,{v:.13});voice(r*1.5,.07,.55,{v:.1});voice(r*2,.15,.6,{v:.07,send:.8});if(combo>=3)noise(.1,.12,6500,.04);if(combo===5||combo===10||combo===15)setTimeout(SND.combo,140)},
  bad:()=>{combo=0;voice(233,0,.28,{k:'saw',v:.05,to:196,send:.1});voice(174,.08,.34,{k:'wood',v:.1,to:150,send:.2})},
  done:()=>{[0,2,4,5,7].forEach((n,i)=>voice(P[n+3],i*.085,.7,{v:.12}));voice(P[8],.45,.9,{v:.09,send:.9});noise(.43,.25,7000,.05)},
  badge:()=>{[5,7,9,11].forEach((n,i)=>voice(P[n],i*.09,.9,{v:.12,send:.8}));voice(P[12],.4,1.2,{v:.08,send:1});noise(.38,.35,8000,.05)},
  level:()=>{[3,5,7,8,10,12].forEach((n,i)=>voice(P[n],i*.08,.85,{v:.12,send:.8}));voice(P[13],.55,1.5,{v:.09,send:1});voice(P[6],.55,1.5,{v:.06,send:1});noise(.5,.45,8500,.06)},
  streak:()=>{voice(P[3],0,.3,{v:.11});voice(P[6],.1,.3,{v:.11});voice(P[9],.2,.5,{v:.11,send:.8})}
};
/* Haptics as little scores: [kind, delay-ms]. Native (Capacitor Haptics) gets real impact strengths; the browser fallback gets a vibrate pattern. */
const SEQ={
  up:[],start:[['m',0],['m',100]],xp:[['sel',0]],combo:[['m',0],['h',90]],
  tap:[['l',0]],
  open:[['m',0]],
  swipe:[['l',0]],
  good:[['m',0],['m',110],['h',230]],                       /* tick, thump, bright finish */
  bad:[['h',0],['h',140],['w',300]],                                 /* hard knock, then a dull warning */
  done:[['l',0],['l',80],['m',170],['s',290]],
  badge:[['l',0],['l',70],['m',140],['m',210],['h',300],['s',430]],  /* building up like a drum roll */
  level:[['l',0],['l',60],['l',120],['m',190],['m',260],['h',340],['h',430],['s',560]],
  streak:[['m',0],['m',110],['s',230]]
};
/* strength in ms: phones barely feel anything under ~20 ms, so these are deliberately firm */
const MS={sel:14,l:28,m:48,h:90,w:80,s:60};
const ms=t=>Math.max(1,Math.round((MS[t]||40)*HS()));
function step(H,t){try{
  if(t==='sel')return H.vibrate?H.vibrate({duration:ms('sel')}):H.selectionChanged&&H.selectionChanged();
  const d=ms(t);
  if(H.vibrate)H.vibrate({duration:d});                                      /* raw, strong vibration */
  if(t==='h')H.impact({style:'HEAVY'});else if(t==='m')H.impact({style:'MEDIUM'});else if(t==='s')H.notification({type:'SUCCESS'});else if(t==='w')H.notification({type:'WARNING'})}catch(e){}}
function buzz(k){if(!on('hap')||HS()===0)return;const seq=SEQ[k];if(!seq)return;
  const H=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics;
  if(H){if(k==='swipe'||k==='tap'){try{H.selectionStart&&H.selectionStart()}catch(e){}}
    seq.forEach(([t,d])=>d?setTimeout(()=>step(H,t),d):step(H,t));return}
  /* fallback: stitch the steps into one vibrate pattern */
  try{if(!navigator.vibrate)return;const pat=[];let at=0;seq.forEach(([t,d])=>{const on_=ms(t);if(d>at){if(pat.length)pat.push(d-at);else pat.push(0)}else if(pat.length)pat.push(10);pat.push(on_);at=d+on_});
    if(pat[0]===0)pat.shift();navigator.vibrate(pat)}catch(e){}}
function diag(){const H=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics,L=[];
  L.push('Sound switch: '+(on('snd')?'on':'off')+' · Vibration switch: '+(on('hap')?'on':'off'));
  L.push('Audio: '+(ctx?ctx.state:(window.AudioContext||window.webkitAudioContext?'not started yet':'not supported')));
  L.push('Native haptics plugin: '+(H?'found':'not found (needs the newest app)'));
  L.push('Browser vibrate: '+(navigator.vibrate?'available':'not available'));
  L.push('Inside the app: '+(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()?'yes':'no'));return L.join('\n')}
window.Feel={diag,play(k){if(k==='tap'&&this._t&&performance.now()-this._t<40)return;this._t=performance.now();buzz(k);const f=SND[k];if(f)try{f()}catch(e){}},
  get snd(){return on('snd')},get hap(){return on('hap')},get vol(){return lvl('vol',85)},get hs(){return lvl('hs',60)},setLevel(k,v){ls.set('lb:'+k,String(v));if(k==='vol'&&master)master.gain.value=VOL()*1.9},
  set(k,v){ls.set('lb:'+k,v?'1':'0');if(v)this.play('tap')}};
/* unlock audio on every gesture until the browser lets it run (Android WebView can be strict) */
function unlock(){if(!on('snd'))return;const c=ac();if(!c)return;try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}catch(e){}
  if(c.state==='running'){['pointerdown','touchend','click','keydown'].forEach(t=>removeEventListener(t,unlock,true))}}
['pointerdown','touchend','click','keydown'].forEach(t=>addEventListener(t,unlock,{capture:true,passive:true}));
/* buttons answer the moment your finger lands, which is what makes them feel physical */
let _down=null;
document.addEventListener('pointerup',e=>{if(_down){_down=null;if(on('snd'))try{SND.up()}catch(x){}}},{passive:true,capture:true});
document.addEventListener('pointerdown',e=>{const t=e.target.closest('button,.choice,.pick,.me-weak,.me-sub,.metabs button,.x');if(!t||t.classList.contains('opt')||t.disabled)return;_down=t;Feel.play('tap')},{passive:true,capture:true});
})();
