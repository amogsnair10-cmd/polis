import json,re,sys,glob,os
ids=sys.argv[1:]
for lid in ids:
    d=json.load(open(f'subjects/world/lessons/{lid}.json'))
    print(f"## {lid} | {d['title']} | cards={len(d['cards'])}")
    for k,c in enumerate(d['cards']):
        b=re.sub(r'<[^>]+>',' ',c.get('b') or '')
        b=re.sub(r'\s+',' ',b).strip()[:200]
        print(f"  {k}: {c.get('h')} :: {b}")
