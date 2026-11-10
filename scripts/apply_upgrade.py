# Usage: python3 scripts/apply_upgrade.py scripts/upgrades/<batch>.json
# Each entry: {"id": {"cards": [...extra cards, inserted before 'Indian angle'], "quiz": [...extra questions]}}
import json,sys
U=json.load(open(sys.argv[1]))
for i,u in U.items():
    p=f'lessons/{i}.json';d=json.load(open(p))
    tags=[c['tag'] for c in d['cards']]
    at=tags.index('Indian angle') if 'Indian angle' in tags else len(tags)-1
    d['cards'][at:at]=u.get('cards',[])
    d['quiz']+=u.get('quiz',[])
    json.dump(d,open(p,'w'),ensure_ascii=False,indent=1);open(p,'a').write('\n')
    print(i,len(d['cards']),'cards',len(d['quiz']),'q')
