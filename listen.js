/* Listen: reads the lesson aloud with the phone's own voice (Google TTS on Android).
   In the app it uses the native text-to-speech plugin; in a browser, speechSynthesis.
   Reads the cover and every lesson card (not the quiz), moving the deck along as it goes. */
(function(){
  const btn=document.getElementById('lisBtn'),deck=document.getElementById('deck');
  const TTS=window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()&&Capacitor.Plugins.TextToSpeech;
  const web=!TTS&&'speechSynthesis' in window;
  if(!TTS&&!web){btn.remove();return}
  const RATES=[1,1.25,1.5,0.85];let ri=+(localStorage.getItem('lisRate')||0)%RATES.length;
  let on=false,run=0,hold;
  function chunks(t){return (t.replace(/\s+/g,' ').match(/[^.!?;:]+[.!?;:]*\s*/g)||[t]).reduce((a,s)=>{if(a.length&&(a[a.length-1]+s).length<220)a[a.length-1]+=s;else a.push(s);return a},[]).map(s=>s.trim()).filter(Boolean)}
  function say(t){const rate=RATES[ri];
    if(TTS)return TTS.speak({text:t,lang:'en-IN',rate,category:'playback'}).catch(()=>{});
    return new Promise(r=>{const u=new SpeechSynthesisUtterance(t);u.lang='en-IN';u.rate=rate;const v=speechSynthesis.getVoices().find(v=>/en-IN/.test(v.lang)&&/Google/.test(v.name))||speechSynthesis.getVoices().find(v=>/en-(IN|GB)/.test(v.lang));if(v)u.voice=v;u.onend=u.onerror=r;speechSynthesis.speak(u);
      clearInterval(hold);hold=setInterval(()=>{if(speechSynthesis.speaking){speechSynthesis.pause();speechSynthesis.resume()}},10000)})} // Chrome stalls on long text without this nudge
  function textOf(ci){const c=ci.cloneNode(true);c.querySelectorAll('.cr,.hint,svg,.dd,figure,button,.more').forEach(e=>e.remove());return c.innerText}
  async function play(){const id=++run;on=true;btn.classList.add('on');btn.textContent='❚❚';
    let i=Math.round(deck.scrollLeft/deck.clientWidth);
    while(on&&id===run&&i<=(window.LCOUNT||0)){
      const cd=deck.children[i];if(!cd)break;const ci=cd.querySelector('.ci');
      deck.querySelectorAll('.ci.reading').forEach(e=>e.classList.remove('reading'));ci.classList.add('reading');
      if(Math.round(deck.scrollLeft/deck.clientWidth)!==i)deck.scrollTo({left:i*deck.clientWidth,behavior:'smooth'});
      for(const s of chunks(textOf(ci))){if(!on||id!==run)return;await say(s)}
      if(Math.round(deck.scrollLeft/deck.clientWidth)!==i){i=Math.round(deck.scrollLeft/deck.clientWidth);continue} // reader swiped: follow them
      i++;}
    if(id===run)stop()}
  function stop(){on=false;run++;clearInterval(hold);btn.classList.remove('on');btn.textContent='▶';
    deck.querySelectorAll('.ci.reading').forEach(e=>e.classList.remove('reading'));
    if(TTS)TTS.stop().catch(()=>{});else speechSynthesis.cancel()}
  window.stopListen=stop;
  btn.onclick=()=>on?stop():play();
  // long-press changes speed
  let lp;btn.addEventListener('pointerdown',()=>{lp=setTimeout(()=>{lp='x';ri=(ri+1)%RATES.length;localStorage.setItem('lisRate',ri);btn.dataset.rate=RATES[ri]+'×';btn.classList.add('rate');setTimeout(()=>btn.classList.remove('rate'),1400)},550)});
  btn.addEventListener('pointerup',e=>{if(lp==='x'){e.preventDefault();btn.onclick=null;setTimeout(()=>btn.onclick=()=>on?stop():play(),50)}clearTimeout(lp)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&web)stop()});
})();
