#!/usr/bin/env python3
"""Token-free quiz generator: writes each lesson's 10-question quiz (5 UPSC-style + 5 plain) with the free Gemini API.

  GEMINI_API_KEY=... python3 scripts/gen_quiz.py [subject ...] [--limit N] [--lesson ID] [--mock]

- Questions are built ONLY from the lesson's own cards. Format is checked in code (exact option sets).
- A second Gemini pass verifies every question against the cards; anything not clearly supported is regenerated
  (up to 2 retries) and, if it still fails, the lesson is left unchanged.
- Resumable: art/quiz_state.json records finished lessons. Stops politely when the free quota runs out.
"""
import json,os,re,sys,time,urllib.request,urllib.error,random
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATE=R+'/art/quiz_state.json'
MODELS=[m for m in os.environ.get('GEMINI_MODELS','gemini-3.5-flash,gemini-3.8-flash').split(',') if m]
S2={"1 only","2 only","1 and 2 only","Neither 1 nor 2"}
S3={"1 and 2 only","2 and 3 only","1 and 3 only","1, 2 and 3"}
HOW={"Only one","Only two","All three","None"}
AR={"Both Statement-I and Statement-II are individually true and Statement-II is the correct explanation of Statement-I",
"Both Statement-I and Statement-II are individually true but Statement-II is not the correct explanation of Statement-I",
"Statement-I is true but Statement-II is false","Statement-I is false but Statement-II is true"}
BRIEF="""You write multiple-choice quizzes for UPSC civil-services aspirants from ONE lesson's cards. Use ONLY facts printed in the cards you are given. Never add outside facts. Never mention 'the lesson' or 'the card' in a question.
Return JSON: {"questions":[{"type":"S2|S3|HOW|PAIRS|AR|NOT|PLAIN","q":"...","o":["A","B","C","D"],"a":0,"w":"..."}, ... exactly 10]}.
EXACT MIX: 5 UPSC-style + 5 PLAIN.
UPSC-style (5): two 'Consider the following statements' questions (type S2 with 2 statements, or S3 with 3 statements), one 'How many of the statements given above are correct?' (type HOW, 3 statements) or a pairs question (type PAIRS: 'Consider the following pairs ... How many pairs are correctly matched?', 3 pairs), one Statement-I/Statement-II (type AR), one 'Which one of the following is NOT ...' (type NOT).
PLAIN (5): one clear stem, four short options, one correct (type PLAIN).
Use \\n inside q so every statement/pair is on its own line, e.g. 'Consider the following statements:\\n1. ...\\n2. ...\\nWhich of the statements given above is/are correct?'.
Option sets are FIXED for these types (use these exact strings, any order):
S2: "1 only","2 only","1 and 2 only","Neither 1 nor 2". S3: "1 and 2 only","2 and 3 only","1 and 3 only","1, 2 and 3". HOW and PAIRS: "Only one","Only two","All three","None".
AR: Question text 'Consider the following statements:\\nStatement-I: ...\\nStatement-II: ...\\nWhich one of the following is correct in respect of the above statements?' with options exactly: "Both Statement-I and Statement-II are individually true and Statement-II is the correct explanation of Statement-I","Both Statement-I and Statement-II are individually true but Statement-II is not the correct explanation of Statement-I","Statement-I is true but Statement-II is false","Statement-I is false but Statement-II is true".
HOW STATEMENTS ARE WRITTEN: false statements must look plausible: change ONE detail (a name, date, place or cause) or add an absolute (only, all, always, never, solely) to an otherwise true sentence. Hedge words (may, can, generally, primarily) usually make a statement true; use hedges and absolutes deliberately in both directions. Do not make a false statement absurd. Design options so elimination works.
'w' explains in one short clause per statement why it is true or false. Spread the correct answer position 'a' (0-3) across the 10 questions (no position more than 4 times). Keep each question under 90 words."""
VERIFY="""You are a strict fact-checker. You get a lesson's cards and quiz questions with the marked correct option. For each question decide:
SUPPORTED = the question's claims and the marked answer are stated in, or directly follow from, the cards (judge each statement separately for statement/pair questions); UNSUPPORTED = the answer or a key claim is not in the cards; WRONG = the cards contradict the marked answer.
Return JSON: {"verdicts":[{"i":0,"verdict":"SUPPORTED|UNSUPPORTED|WRONG","why":"short"}, ...]} one per question in order."""
def plain(h):
    h=re.sub(r'<svg.*?</svg>',' ',h,flags=re.S);h=re.sub(r'<[^>]+>',' ',h);return re.sub(r'\s+',' ',h).strip()
def lesson_text(L):
    return f"TITLE: {L['title']}\n"+'\n'.join(f"[{c['tag']}] {plain(c['h'])}: {plain(c['b'])}" for c in L['cards'])
def classify(q):
    t=q['q'];o=set(q['o'])
    if o==S2:return 'S2'
    if o==S3:return 'S3'
    if o==AR:return 'AR'
    if o==HOW:return 'PAIRS' if 'pairs' in t.lower() else 'HOW'
    if re.search(r'\bNOT\b|odd one out|does not belong',t) and not t.startswith('Consider'):return 'NOT'
    return 'PLAIN'
def validate(qs):
    """Return a list of problems (empty = fine)."""
    p=[]
    if not isinstance(qs,list) or len(qs)!=10:return ['need exactly 10 questions']
    pos=[0,0,0,0];styled=0
    for i,q in enumerate(qs):
        try:
            if not (isinstance(q['q'],str) and q['q'].strip() and isinstance(q['w'],str) and q['w'].strip()):p.append(f'{i}: empty q/w')
            if not (isinstance(q['o'],list) and len(q['o'])==4 and len(set(q['o']))==4 and all(isinstance(x,str) and x.strip() for x in q['o'])):p.append(f'{i}: need 4 distinct options');continue
            if q['a'] not in (0,1,2,3):p.append(f'{i}: bad answer index');continue
            pos[q['a']]+=1
        except Exception:p.append(f'{i}: malformed');continue
        c=classify(q)
        if c!='PLAIN':styled+=1
        if c in('S2','S3','HOW','PAIRS','AR') and not q['q'].startswith('Consider the following'):p.append(f'{i}: {c} must start with "Consider the following"')
        if c=='S2' and not re.search(r'\n2\. ',q['q']):p.append(f'{i}: S2 needs statement 2')
        if c=='S3' and not re.search(r'\n3\. ',q['q']):p.append(f'{i}: S3 needs statement 3')
        if c in('HOW','PAIRS') and not re.search(r'\n3\. ',q['q']):p.append(f'{i}: needs 3 items')
        if re.search(r'\bthe (lesson|card|cards|text)\b|according to the (lesson|card)',q['q'],re.I):p.append(f'{i}: mentions the lesson')
        if len(q['q'].split())>130:p.append(f'{i}: too long')
    if styled!=5:p.append(f'need 5 UPSC-style questions, found {styled}')
    if max(pos)>4:p.append('answer positions not spread')
    return p
def call(model,system,user,key,mock=None):
    if mock:return mock(system,user)
    body=json.dumps({"systemInstruction":{"parts":[{"text":system}]},"contents":[{"role":"user","parts":[{"text":user}]}],"generationConfig":{"responseMimeType":"application/json","temperature":0.55}}).encode()
    url=f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    for t in range(5):
        try:
            r=urllib.request.Request(url,data=body,headers={"Content-Type":"application/json","x-goog-api-key":key})
            d=json.load(urllib.request.urlopen(r,timeout=120))
            txt=d['candidates'][0]['content']['parts'][0]['text'];return json.loads(txt)
        except urllib.error.HTTPError as e:
            if e.code==429:
                msg=e.read().decode()[:300]
                if 'per day' in msg.lower() or 'daily' in msg.lower():raise Quota(msg)
                time.sleep(20*(t+1));continue
            if e.code in(500,502,503,504):time.sleep(8*(t+1));continue
            if e.code in(400,404):raise ModelError(f'{model}: HTTP {e.code}')
            raise
        except (json.JSONDecodeError,KeyError,IndexError):time.sleep(3)
    raise ModelError(f'{model}: gave up')
class Quota(Exception):pass
class ModelError(Exception):pass
def ask(system,user,key,mock=None):
    last=None
    for m in MODELS:
        try:return call(m,system,user,key,mock)
        except ModelError as e:last=e
    raise last or ModelError('no models')
def make(L,key,mock=None):
    cards=lesson_text(L)
    for attempt in range(3):
        d=ask(BRIEF,cards+"\n\nExisting questions for topic reference only (rewrite, do not copy):\n"+'\n'.join('- '+x['q'].split('\n')[0][:110] for x in L['quiz']),key,mock)
        qs=[{k:q[k] for k in('q','o','a','w')} for q in (d.get('questions') or []) if isinstance(q,dict) and all(k in q for k in('q','o','a','w'))]
        pr=validate(qs)
        if pr:print('   format:',pr[:3]);continue
        marked='\n\n'.join(f"Q{i}: {q['q']}\nOptions: "+' | '.join(f"({'abcd'[j]}) {o}" for j,o in enumerate(q['o']))+f"\nMarked correct: ({'abcd'[q['a']]})" for i,q in enumerate(qs))
        v=ask(VERIFY,cards+"\n\nQUESTIONS:\n"+marked,key,mock)
        bad=[x for x in (v.get('verdicts') or []) if x.get('verdict')!='SUPPORTED']
        if len(v.get('verdicts') or [])==10 and not bad:return qs
        print('   verify rejected',len(bad),'question(s):',[(b.get('i'),b.get('why','')[:60]) for b in bad][:3])
    return None
def main():
    args=sys.argv[1:];mock=None
    lim=int(args[args.index('--limit')+1]) if '--limit' in args else 40
    only=args[args.index('--lesson')+1] if '--lesson' in args else None
    if '--mock' in args:mock=globals()['_mock']
    subs=[a for a in args if not a.startswith('--') and a not in (str(lim),only)]
    key=os.environ.get('GEMINI_API_KEY','')
    if not key and not mock:print('No GEMINI_API_KEY: nothing to do.');return
    state=json.load(open(STATE)) if os.path.exists(STATE) else {}
    done=0
    for s in json.load(open(R+'/subjects.json')):
        if subs and s['id'] not in subs:continue
        d=s.get('dir','.');idx=json.load(open(f'{R}/{d}/lessons/index.json'))
        for lid in idx:
            if only and lid!=only:continue
            K=f"{s['id']}/{lid}"
            if state.get(K)=='u5':continue
            if done>=lim:break
            f=f'{R}/{d}/lessons/{lid}.json';L=json.load(open(f))
            print(K,L['title'][:50])
            try:qs=make(L,key,mock)
            except Quota as e:print('Free quota used up for today; stopping.');json.dump(state,open(STATE,'w'),indent=0,sort_keys=True);return
            except ModelError as e:print('   model error:',e);continue
            if qs:
                L['quiz']=qs;json.dump(L,open(f,'w'),indent=2,ensure_ascii=False);open(f,'a').write('\n');state[K]='u5';done+=1
                json.dump(state,open(STATE,'w'),indent=0,sort_keys=True)
            else:print('   left unchanged')
            if not mock:time.sleep(6)
    print('lessons written:',done)
def _mock(system,user):
    if system==VERIFY:return {"verdicts":[{"i":i,"verdict":"SUPPORTED","why":""} for i in range(10)]}
    mk=lambda q,o,a:{"q":q,"o":o,"a":a,"w":"1 true. 2 false."}
    st=["Consider the following statements:\n1. A\n2. B\nWhich of the statements given above is/are correct?",]
    qs=[mk(st[0],["1 only","2 only","1 and 2 only","Neither 1 nor 2"],0),
        mk("Consider the following statements:\n1. A\n2. B\n3. C\nWhich of the statements given above is/are correct?",["1 and 2 only","2 and 3 only","1 and 3 only","1, 2 and 3"],1),
        mk("Consider the following statements:\n1. A\n2. B\n3. C\nHow many of the statements given above are correct?",["Only one","Only two","All three","None"],2),
        mk("Consider the following statements:\nStatement-I: x\nStatement-II: y\nWhich one of the following is correct in respect of the above statements?",sorted(AR),3),
        mk("Which one of the following is NOT a feature?",["a","b","c","d"],0)]
    qs+=[mk(f"Plain question {i}?",["w","x","y","z"],[1,2,3,0,1][i]) for i in range(5)]
    return {"questions":qs}
if __name__=='__main__':main()
