# Spread correct answers evenly across A-D. Usage: python3 scripts/shuffle_answers.py [dir]
# Skips questions whose options refer to each other ("all of the above", "both", "none").
import json,os,sys,random
d=os.path.join(os.path.dirname(__file__),'..',sys.argv[1] if len(sys.argv)>1 else '.','lessons')
skip=('above','both','none of','neither','a and b','all of')
for f in sorted(os.listdir(d)):
    if not f[0].isdigit():continue
    p=os.path.join(d,f);l=json.load(open(p));rnd=random.Random(f);n=0
    for i,q in enumerate(l['quiz']):
        if any(k in o.lower() for o in q['o'] for k in skip):continue
        target=(i+rnd.randrange(4))%4
        right=q['o'][q['a']];rest=[o for j,o in enumerate(q['o']) if j!=q['a']];rnd.shuffle(rest)
        rest.insert(target,right);q['o']=rest;q['a']=target;n+=1
    json.dump(l,open(p,'w'),ensure_ascii=False,indent=1);open(p,'a').write('\n')
print('shuffled')
