/* Equation typesetter. Lessons write formulas as plain words ("F = G m1 m2 / r squared").
   This turns them into readable equations at display time: stacked fractions, roots, powers, Greek letters, times signs.
   Nothing in the lesson files changes. */
(()=>{
const GREEK={theta:'θ',alpha:'α',beta:'β',gamma:'γ',delta:'δ',Delta:'Δ',lambda:'λ',Lambda:'Λ',mu:'μ',nu:'ν',pi:'π',omega:'ω',Omega:'Ω',sigma:'σ',Sigma:'Σ',rho:'ρ',tau:'τ',epsilon:'ε',phi:'φ',Phi:'Φ',psi:'ψ',eta:'η',kappa:'κ',chi:'χ'};
const esc=s=>s.replace(/&(?!amp;|lt;|gt;|#)/g,'&amp;');
/* split a string on a top-level character (outside brackets) */
function splitTop(s,re){const out=[];let d=0,last=0;for(let i=0;i<s.length;i++){const c=s[i];if(c==='<'){const e=s.indexOf('>',i);if(e>0){i=e;continue}}if('(['.includes(c))d++;else if(')]'.includes(c))d--;else if(!d){const m=s.slice(i).match(re);if(m&&m.index===0){out.push(s.slice(last,i));i+=m[0].length-1;last=i+1}}}out.push(s.slice(last));return out}
function stripWrap(s){s=s.trim();if(s[0]==='('&&s[s.length-1]===')'){let d=0;for(let i=0;i<s.length;i++){if(s[i]==='(')d++;else if(s[i]===')'){d--;if(!d&&i<s.length-1)return s}}return s.slice(1,-1)}return s}
function balanced(s,i){/* index just after the group starting at s[i]==='(' */let d=0;for(let k=i;k<s.length;k++){if(s[k]==='(')d++;else if(s[k]===')'){d--;if(!d)return k+1}}return s.length}
let STASH=[];
function roots(s){let r='',i=0;const key='square root of ';while(i<s.length){const j=s.indexOf(key,i);if(j<0){r+=s.slice(i);break}r+=s.slice(i,j);let k=j+key.length,inner;
  if(s[k]==='('){const e=balanced(s,k);inner=s.slice(k+1,e-1);k=e}else{const m=s.slice(k).match(/^[\w.]+(?:\s+squared)?/);inner=m?m[0]:'';k+=inner.length}
  STASH.push(`<span class="sq"><span class="rd">√</span><span class="rc">${tex(inner)}</span></span>`);r+='\u0001'+(STASH.length-1)+'\u0002';i=k}return r}
/* inline pieces that do not need structure */
function lite(s){
  s=s.replace(/\b(theta|alpha|beta|gamma|delta|Delta|lambda|Lambda|mu|nu|pi|omega|Omega|sigma|Sigma|rho|tau|epsilon|phi|Phi|psi|eta|kappa|chi)\b/g,m=>GREEK[m]);
  s=s.replace(/(\S+?)\s+to the power\s+(-?\d+)/g,'$1<sup>$2</sup>').replace(/\^\{?(-?[\w.]+)\}?/g,'<sup>$1</sup>');
  s=s.replace(/([\w)\]])\s+squared\b/g,'$1<sup>2</sup>').replace(/([\w)\]])\s+cubed\b/g,'$1<sup>3</sup>');
  s=s.replace(/(^|[\s(])x(?=\s+[\w(\[\u0001])/g,(m,p,off,str)=>{/* times sign, unless x is a plain variable before = */ return /^\s*=/.test(str.slice(off+m.length))?m:p+'×'});
  s=s.replace(/ - /g,' − ').replace(/->/g,'→').replace(/(^|\s)(\d+(?:\.\d+)?) x (\d)/g,'$1$2 × $3');
  s=s.replace(/\b([A-Z][a-z]?|[a-z])(\d+)(?![\d.])/g,(m,a,n)=>/^(?:e|E)$/.test(a)&&n.length>1?m:`${a}<sub>${n}</sub>`);
  s=s.replace(/\bln\b|\blog10\b|\blog\b|\bsin\b|\bcos\b|\btan\b/g,m=>`<span class="fn">${m}</span>`);
  return s}
function fracs(s){/* a / b with spaces around the slash, one per top-level term */
  const terms=splitTop(s,/^\s=\s|^=/);return terms.map(t=>{const hasPM=splitTop(t,/^\s[+−-]\s/).length>1;const parts=splitTop(t,/^\s\/\s/);
    if(parts.length===2&&!hasPM){return `<span class="fr"><span class="nu">${stripWrap(parts[0])}</span><span class="de">${stripWrap(parts[1])}</span></span>`}return t}).join(' = ')}
function outside(s,fn){return s.split(/(<[^>]+>)/).map(p=>p[0]==='<'?p:fn(p)).join('')}
function tex(s){const saved=STASH;STASH=[];s=s.trim();let r=roots(s);r=lite(r);r=outside(r,p=>p.replace(/\b([A-Z])([xyz])\b/g,'$1<sub>$2</sub>'));r=fracs(r);
  r=outside(r,p=>p.replace(/(^|[\s(×·+−=\/\u0002])([A-Za-z])(?![A-Za-z])/g,(m,pre,v,off,str)=>(/\s/.test(pre)&&/\d\s*$/.test(str.slice(0,off))&&/^[A-Z]$/.test(v))?m:`${pre}<i>${v}</i>`));
  const mine=STASH;STASH=saved;return r.replace(/\u0001(\d+)\u0002/g,(m,i)=>mine[+i])}
const hasEq=t=>/=/.test(t)&&t.length<150&&!/\?$/.test(t.trim())&&!/^\d+\.\s/.test(t.trim());
function glue(h){return h.replace(/(\d)\s([A-Za-zμΩ°]{1,4}|<i>[A-Za-z]<\/i>)(?=[\s.,;<)]|$)/g,'$1\u00a0$2')}
function row(t){return `<div class="eq"><span class="ex">${tex(t)}</span></div>`}
/* boxes: <div class="box"><h4>Title</h4> line <br> line </div> */
function boxes(h){return h.replace(/<div class="box">(<h4>[^<]*<\/h4>)?([\s\S]*?)<\/div>/g,(all,h4,body)=>{
  if(!/=/.test(body))return all;const lines=body.split(/<br\s*\/?>/i).map(x=>x.trim()).filter(Boolean);
  if(lines.some(l=>/<(ul|li|p)\b/.test(l)))return all;
  const eq=lines.filter(l=>hasEq(l.replace(/<[^>]+>/g,'')));if(!eq.length||/^<h4>(Think|Try|Check|Question)/i.test(h4||''))return all;
  const out=lines.map(l=>{const plain=l.replace(/<[^>]+>/g,'');if(!hasEq(plain))return `<div class="eqn">${l}</div>`;const p=plain.replace(/&amp;/g,'&'),m=p.match(/^([^=:]{3,48}):\s+(.+=.+)$/);return m?`<div class="eqn">${m[1]}</div>${row(m[2])}`:row(p)}).join('');
  return `<div class="box eqbox">${h4||''}${out}</div>`})}
/* equations inside a sentence: "so v = 10 m/s." */
function inline(h){return h.replace(/<p>([\s\S]*?)<\/p>/g,(all,body)=>{if(/<(svg|div|ul)/.test(body)||!/=/.test(body))return all;
  const parts=body.split(/(<[^>]+>)/);const t=parts.map(p=>p[0]==='<'?p:p.replace(/(^|[\s(])([A-Za-z\u0370-\u03ff][\w()\[\]]{0,14})\s=\s((?:(?!\.(?:\s|$)|;|,\s(?:so|then|and)\b)[^<])*)/g,(m,pre,lhs,rest)=>`${pre}<span class="eqi">${glue(tex(lhs+' = '+rest))}</span>`)).join('');const t2=t.split(/(<[^>]+>)/).map(p=>p[0]==='<'?p:p.replace(/(^|:\s|\.\s)([\d(][\d.,()\/ x+−-]{0,40}?)\s=\s((?:(?!\.(?:\s|$)|;)[^<])*)/g,(m,pre,l,rest)=>`${pre}<span class="eqi">${tex(l+' = '+rest)}</span>`)).join('');return `<p>${t2}</p>`})}
window.mathify=h=>{try{return inline(boxes(h))}catch(e){return h}};
})();
