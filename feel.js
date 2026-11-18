/* Feel: haptics and small synthesized sounds (no audio files). Both can be switched off in Me. */
(()=>{
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const on=k=>ls.get('lb:'+k)!=='0';
let ctx=null,master=null;
function ac(){if(!on('snd'))return null;try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=.5;master.connect(ctx.destination)}if(ctx.state==='suspended')ctx.resume();return ctx}catch(e){return null}}
function tone(f,t0,d,o={}){const c=ac();if(!c)return;const a=c.currentTime+t0,osc=c.createOscillator(),g=c.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(f,a);if(o.to)osc.frequency.exponentialRampToValueAtTime(o.to,a+d);
  const v=o.v||.18;g.gain.setValueAtTime(0.0001,a);g.gain.exponentialRampToValueAtTime(v,a+.012);g.gain.exponentialRampToValueAtTime(0.0001,a+d);osc.connect(g);g.connect(master);osc.start(a);osc.stop(a+d+.05)}
const N={C5:523.25,D5:587.33,E5:659.25,G5:783.99,A5:880,C6:1046.5,E6:1318.5,G4:392,E4:329.63,C4:261.63};
const SND={
  tap:()=>tone(900,0,.05,{type:'triangle',v:.08,to:700}),
  swipe:()=>tone(520,0,.05,{type:'sine',v:.05,to:380}),
  good:()=>{tone(N.E5,0,.16,{type:'triangle'});tone(N.A5,.09,.26,{type:'triangle'})},
  bad:()=>{tone(220,0,.22,{type:'sawtooth',v:.09,to:150})},
  done:()=>{[N.C5,N.E5,N.G5,N.C6].forEach((f,i)=>tone(f,i*.09,.3,{type:'triangle',v:.14}))},
  badge:()=>{[N.G5,N.C6,N.E6].forEach((f,i)=>tone(f,i*.1,.45,{type:'triangle',v:.16}));tone(N.C6,.32,.7,{type:'sine',v:.1})},
  level:()=>{[N.C5,N.E5,N.G5,N.C6,N.E6,N.G5*2].forEach((f,i)=>tone(f,i*.08,.4,{type:'triangle',v:.14}))},
  streak:()=>{tone(300,0,.18,{type:'sine',to:600,v:.12});tone(N.C6,.15,.3,{type:'triangle',v:.12})},
  open:()=>tone(440,0,.07,{type:'sine',v:.06,to:620})
};
const PAT={tap:12,swipe:6,good:[18,40,30],bad:[45,60,45],done:[20,40,20,40,60],badge:[30,50,30,50,90],level:[30,50,30,50,30,50,120],streak:[25,40,40],open:8};
function buzz(k){if(!on('hap'))return;const p=PAT[k];try{const H=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.Haptics;
  if(H){if(k==='good')H.notification({type:'SUCCESS'});else if(k==='bad')H.notification({type:'ERROR'});else if(k==='badge'||k==='level'||k==='done')H.notification({type:'SUCCESS'});else H.impact({style:k==='tap'||k==='open'||k==='swipe'?'LIGHT':'MEDIUM'});return}
  navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
window.Feel={play(k){buzz(k);const f=SND[k];if(f)try{f()}catch(e){}},
  get snd(){return on('snd')},get hap(){return on('hap')},
  set(k,v){ls.set('lb:'+k,v?'1':'0');if(v)this.play('tap')}};
/* unlock audio on the first touch (browsers require a gesture) */
addEventListener('pointerdown',()=>{if(on('snd'))ac()},{once:true,passive:true});
/* light feedback on common controls */
document.addEventListener('click',e=>{const t=e.target.closest('button,.opt,.choice,.pick,.me-weak,.me-sub');if(!t||t.classList.contains('opt'))return;Feel.play('tap')},{passive:true});
})();
