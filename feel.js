/* Feel: haptics and small synthesized sounds (no audio files). Both can be switched off in Me. */
(()=>{
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const on=k=>ls.get('lb:'+k)!=='0';
let ctx=null,master=null,verb=null,combo=0;
function ac(){if(!on('snd'))return null;try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();
  master=ctx.createGain();master.gain.value=.55;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7500;master.connect(lp);lp.connect(ctx.destination);
  /* soft room echo: two short feedback delays, mixed low */
  verb=ctx.createGain();verb.gain.value=.22;const d1=ctx.createDelay(.5),d2=ctx.createDelay(.5),fb=ctx.createGain(),hp=ctx.createBiquadFilter();d1.delayTime.value=.083;d2.delayTime.value=.137;fb.gain.value=.38;hp.type='lowpass';hp.frequency.value=3200;
  verb.connect(d1);verb.connect(d2);d1.connect(hp);d2.connect(hp);hp.connect(fb);fb.connect(d1);fb.connect(d2);hp.connect(master)}
  if(ctx.state==='suspended')ctx.resume();return ctx}catch(e){return null}}
/* one voice: pure, bell (inharmonic partials), wood (short pluck) */
function voice(f,t0,d,o={}){const c=ac();if(!c)return;const a=c.currentTime+t0,v=o.v||.16,kind=o.k||'bell',send=o.send===undefined?.6:o.send;
  const out=c.createGain();out.gain.setValueAtTime(0.0001,a);out.gain.exponentialRampToValueAtTime(v,a+.008);out.gain.exponentialRampToValueAtTime(0.0001,a+d);out.connect(master);if(send){const sg=c.createGain();sg.gain.value=send;out.connect(sg);sg.connect(verb)}
  const parts=kind==='bell'?[[1,1],[2.76,.32],[5.4,.12],[8.93,.05]]:kind==='wood'?[[1,1],[2.1,.35]]:[[1,1],[2,.2]];
  parts.forEach(([m,g],i)=>{const osc=c.createOscillator(),pg=c.createGain();osc.type=kind==='saw'?'sawtooth':'sine';osc.frequency.setValueAtTime(f*m,a);if(o.to)osc.frequency.exponentialRampToValueAtTime(o.to*m,a+d);
    pg.gain.setValueAtTime(g,a);pg.gain.exponentialRampToValueAtTime(0.0001,a+d*(i?.55:1));osc.connect(pg);pg.connect(out);osc.start(a);osc.stop(a+d+.06)})}
function noise(t0,d,fq,v){const c=ac();if(!c)return;const a=c.currentTime+t0,len=Math.max(1,Math.floor(c.sampleRate*d)),buf=c.createBuffer(1,len,c.sampleRate),da=buf.getChannelData(0);for(let i=0;i<len;i++)da[i]=(Math.random()*2-1)*(1-i/len);
  const src=c.createBufferSource();src.buffer=buf;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fq;f.Q.value=1.2;const g=c.createGain();g.gain.value=v;src.connect(f);f.connect(g);g.connect(master);src.start(a)}
/* C major pentatonic, so any run of notes sounds good */
const P=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1567.98];
const SND={
  tap:()=>voice(1180,0,.07,{k:'wood',v:.07,send:.1}),
  open:()=>{voice(660,0,.09,{k:'wood',v:.07,send:.15});voice(990,.05,.1,{k:'wood',v:.05,send:.15})},
  swipe:()=>{noise(0,.07,2600,.05);voice(700,0,.05,{k:'wood',v:.035,send:0})},
  good:()=>{const i=Math.min(combo,5);combo++;const r=P[4+i];voice(r,0,.5,{v:.13});voice(r*1.5,.07,.55,{v:.1});voice(r*2,.15,.6,{v:.07,send:.8});if(combo>=3)noise(.1,.12,6500,.04)},
  bad:()=>{combo=0;voice(233,0,.28,{k:'saw',v:.05,to:196,send:.1});voice(174,.08,.34,{k:'wood',v:.1,to:150,send:.2})},
  done:()=>{[0,2,4,5,7].forEach((n,i)=>voice(P[n+3],i*.085,.7,{v:.12}));voice(P[8],.45,.9,{v:.09,send:.9});noise(.43,.25,7000,.05)},
  badge:()=>{[5,7,9,11].forEach((n,i)=>voice(P[n],i*.09,.9,{v:.12,send:.8}));voice(P[12],.4,1.2,{v:.08,send:1});noise(.38,.35,8000,.05)},
  level:()=>{[3,5,7,8,10,12].forEach((n,i)=>voice(P[n],i*.08,.85,{v:.12,send:.8}));voice(P[13],.55,1.5,{v:.09,send:1});voice(P[6],.55,1.5,{v:.06,send:1});noise(.5,.45,8500,.06)},
  streak:()=>{voice(P[3],0,.3,{v:.11});voice(P[6],.1,.3,{v:.11});voice(P[9],.2,.5,{v:.11,send:.8})}
};
const PAT={tap:10,swipe:5,good:[14,36,22,36,34],bad:[60,50,40],done:[16,40,16,40,16,40,70],badge:[22,34,22,34,22,34,26,50,110],level:[18,30,22,30,26,30,30,30,34,30,140],streak:[20,30,30,30,50],open:8};
function buzz(k){if(!on('hap'))return;const p=PAT[k];try{const H=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics;
  if(H){if(k==='good')H.notification({type:'SUCCESS'});else if(k==='bad')H.notification({type:'ERROR'});else if(k==='badge'||k==='level'||k==='done')H.notification({type:'SUCCESS'});else H.impact({style:k==='tap'||k==='open'||k==='swipe'?'LIGHT':'MEDIUM'});return}
  navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
window.Feel={play(k){if(k==='tap'&&this._t&&performance.now()-this._t<40)return;this._t=performance.now();buzz(k);const f=SND[k];if(f)try{f()}catch(e){}},
  get snd(){return on('snd')},get hap(){return on('hap')},
  set(k,v){ls.set('lb:'+k,v?'1':'0');if(v)this.play('tap')}};
/* unlock audio on the first touch (browsers require a gesture) */
addEventListener('pointerdown',()=>{if(on('snd'))ac()},{once:true,passive:true});
/* light feedback on common controls */
document.addEventListener('click',e=>{const t=e.target.closest('button,.opt,.choice,.pick,.me-weak,.me-sub');if(!t||t.classList.contains('opt'))return;Feel.play('tap')},{passive:true});
})();
