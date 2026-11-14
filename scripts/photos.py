"""Finds free-licence photos (Wikimedia Commons, via Wikipedia lead images) for each lesson,
colour-grades them to the subject's theme and saves WebP files in art/photos/<subject>/.
One cover photo per lesson (from the title) plus up to 2 card photos (from card headings).
Resumable: keys already in photos.json are skipped. Run: python3 scripts/photos.py [subject ...]"""
import io,json,os,re,subprocess,sys,time,urllib.parse,urllib.request
from PIL import Image,ImageEnhance,ImageOps,ImageFilter,ImageChops
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=R+'/photos.json' if len(sys.argv)<2 else R+'/photos-'+'-'.join(sys.argv[1:])+'.json'
UA={'User-Agent':'LightBulbStudyApp/1.0 (free educational app; picks Wikimedia lead images)'}
HINT={'psir':'political','history':'India','geography':'geography','environment':'ecology','world':'history','communism':'communist','astronomy':'astronomy','physics':'physics','chemistry':'chemistry','biology':'biology','quantum':'quantum'}
OK=re.compile(r'^\s*(public domain|pd\b|cc0|cc[- ]by)',re.I)
BAD=re.compile(r'(nude|gage_skidmore|press_conference|musician|rock_band|logo|flag_of|coat_of_arms|map_of|locator|icon|symbol|signature|seal_of|emblem)',re.I)
THEMES=json.loads(subprocess.check_output(['node','-e',"global.window={};eval(require('fs').readFileSync('themes.js','utf8').replace(/const THEMES/,'global.THEMES'));const o={};for(const k in THEMES)o[k]=THEMES[k].vars;console.log(JSON.stringify(o))"],cwd=R))
def hexrgb(h,d):h=(h or d).strip().lstrip('#');h=h if len(h)==6 else d.lstrip('#');return tuple(int(h[i:i+2],16) for i in (0,2,4))
def get(u,raw=False):
  for t in range(6):
    try:
      r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=40).read()
      return r if raw else json.loads(r)
    except Exception as e:time.sleep(4*(t+1))
  return None if raw else {}
def api(host,**p):p.update(format='json',formatversion=2);time.sleep(.25);return get(f'https://{host}/w/api.php?'+urllib.parse.urlencode(p))
STOP=set('what when where which about their there these those with from into over under between core idea ideas recap exam lens part role key more than this that some does basic simple introduction overview nature theory concept concepts meaning modern how why the and for its'.split())
def kw(t):return {w[:5] for w in re.findall(r'[a-z]{4,}',t.lower()) if w not in STOP}
def find(q,used,must):
  r=api('en.wikipedia.org',action='query',generator='search',gsrsearch=q,gsrlimit=5,prop='pageimages',piprop='name',pilicense='free')
  pages=sorted(r.get('query',{}).get('pages',[]),key=lambda p:p.get('index',99))
  # relevance: the Wikipedia article's title must share a real word with the topic
  pages=[p for p in pages if kw(p.get('title',''))&must]
  files=[p['pageimage'] for p in pages if p.get('pageimage') and not p['pageimage'].lower().endswith(('.svg','.gif','.tif','.tiff','.ogv','.ogg','.webm','.pdf')) and p['pageimage'] not in used and not BAD.search(p['pageimage'])]
  if not files:return None
  ii=api('commons.wikimedia.org',action='query',titles='|'.join('File:'+f for f in files[:6]),prop='imageinfo',iiprop='url|size|extmetadata',iiurlwidth=1200)
  info={p['title'][5:].replace(' ','_'):p for p in ii.get('query',{}).get('pages',[]) if p.get('imageinfo')}
  for f in files:
    p=info.get(f.replace(' ','_'))
    if not p:continue
    i=p['imageinfo'][0];m=i.get('extmetadata',{});lic=re.sub('<[^>]+>','',m.get('LicenseShortName',{}).get('value',''))
    if min(i['width'],i['height'])<450 or not OK.match(lic) or re.search(r'\bNC\b|\bND\b|non-?commercial|no ?deriv',lic,re.I):continue
    art=re.sub(r'\s+',' ',re.sub('<[^>]+>','',m.get('Artist',{}).get('value','Unknown'))).strip()[:70]
    return {'file':f,'url':i.get('thumburl') or i['url'],'page':i['descriptionurl'],'license':lic.strip(),'artist':art}
def lead_images(titles):
  # exact English Wikipedia articles -> free lead image file names (batched, follows redirects)
  out={}
  for i in range(0,len(titles),40):
    chunk=titles[i:i+40]
    r=api('en.wikipedia.org',action='query',titles='|'.join(chunk),prop='pageimages',piprop='name',pilicense='free',redirects=1)
    q=r.get('query',{});m={t:t for t in chunk}
    for k in ('normalized','redirects'):
      for x in q.get(k,[]):
        for t,v in list(m.items()):
          if v==x['from']:m[t]=x['to']
    img={p['title']:p.get('pageimage') for p in q.get('pages',[])}
    for t in chunk:out[t]=img.get(m[t])
  return out
def file_info(files):
  out={}
  files=[f for f in files if f]
  for i in range(0,len(files),40):
    ii=api('commons.wikimedia.org',action='query',titles='|'.join('File:'+f for f in files[i:i+40]),prop='imageinfo',iiprop='url|size|extmetadata',iiurlwidth=1400)
    for p in ii.get('query',{}).get('pages',[]):
      if not p.get('imageinfo'):continue
      i0=p['imageinfo'][0];m=i0.get('extmetadata',{});lic=re.sub('<[^>]+>','',m.get('LicenseShortName',{}).get('value','')).strip()
      if min(i0['width'],i0['height'])<450 or not OK.match(lic) or re.search(r'\bNC\b|\bND\b|non-?commercial|no ?deriv',lic,re.I):continue
      art=re.sub(r'\s+',' ',re.sub('<[^>]+>','',m.get('Artist',{}).get('value','Unknown'))).strip()[:70]
      out[p['title'][5:].replace(' ','_')]={'url':i0.get('thumburl') or i0['url'],'page':i0['descriptionurl'],'license':lic,'artist':art}
  return out
def grade(raw,night,gold):
  im=ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
  if im.mode in('RGBA','LA','P'):im=im.convert('RGBA');bg=Image.new('RGBA',im.size,(245,242,234,255));bg.alpha_composite(im);im=bg
  im=im.convert('RGB')
  im=ImageOps.fit(im,(1200,768),Image.LANCZOS,centering=(.5,.38))
  im=ImageOps.autocontrast(im,cutoff=.8)
  im=ImageEnhance.Color(im).enhance(.97)
  lut=[int(255*((x/255)**1.08*0.95+0.025)) for x in range(256)]*3   # gentle film curve, lifted blacks
  im=im.point(lut)
  L=im.convert('L')
  sh=ImageOps.invert(L).point(lambda v:int(v*.18));hi=L.point(lambda v:int(max(0,v-130)*.14))
  im=Image.composite(Image.new('RGB',im.size,night),im,sh)
  im=Image.composite(Image.new('RGB',im.size,gold),im,hi)
  w,h=im.size;v=Image.new('L',(w,h),0);v.paste(255,(int(w*.08),int(h*.08),int(w*.92),int(h*.92)))
  v=v.filter(ImageFilter.GaussianBlur(min(w,h)*.18))
  im=Image.composite(im,Image.new('RGB',im.size,night),v.point(lambda x:int(150+x*105/255)))
  b=io.BytesIO();im.save(b,'WEBP',quality=70,method=6);return b.getvalue()
def main():
  picks=json.load(open(OUT)) if os.path.exists(OUT) else {}
  main=json.load(open(R+'/photos.json')) if os.path.exists(R+'/photos.json') else {}
  if OUT!=R+'/photos.json':  # resume from what's already published for these subjects
    for k,v in main.items():
      if k.split('/')[0] in sys.argv[1:]:picks.setdefault(k,v)
  used={v['file'] for v in list(picks.values())+list(main.values()) if v}
  only=set(sys.argv[1:]);n=0
  for s in json.load(open(R+'/subjects.json')):
    sid,d=s['id'],s.get('dir','.')
    if only and sid not in only:continue
    t=THEMES.get(s.get('theme'),{});night=hexrgb(t.get('--night'),'#0c1c36');gold=hexrgb(t.get('--gold'),'#c9a45c')
    os.makedirs(f'{R}/art/photos/{sid}',exist_ok=True)
    qf=f'{R}/art/photo_queries/{sid}.json'
    if os.path.exists(qf):  # v2: exact Wikipedia article chosen per card
      Q=json.load(open(qf));done={k for k in picks if k.startswith(sid+'/') and picks[k] and picks[k].get('v')==2}
      for k in [k for k in list(picks) if k.startswith(sid+'/') and k not in done]:picks[k]=None
      lids=list(json.load(open(f'{R}/{d}/lessons/index.json')))
      for lid in lids:
        keys=[k for k in Q if (k==lid or k.startswith(lid+'_')) and Q[k] and f'{sid}/{k}' not in done]
        if not keys:continue
        li=lead_images(sorted({Q[k] for k in keys}))
        fi=file_info(sorted({li[Q[k]] for k in keys if li.get(Q[k]) and not li[Q[k]].lower().endswith(('.svg','.gif','.tif','.tiff','.ogv','.ogg','.webm','.pdf'))}))
        for k in keys:
          K=f'{sid}/{k}';f=li.get(Q[k]);info=f and fi.get(f.replace(' ','_'))
          p=None
          if info and (f not in used or k==lid):
            raw=get(info['url'],raw=True)
            try:open(f'{R}/art/photos/{K}.webp','wb').write(grade(raw,night,gold));used.add(f);p=info
            except Exception as e:print('grade fail',K,e)
          picks[K]=p and {'src':f'art/photos/{K}.webp','credit':f"{p['artist']} · {p['license']}",'page':p['page'],'file':f,'v':2}
          print(K,'|',Q[k],'->',f if p else None,flush=True);n+=1
        json.dump(picks,open(OUT,'w'),indent=0,ensure_ascii=False)
      continue
    for lid in json.load(open(f'{R}/{d}/lessons/index.json')):
      L=json.load(open(f'{R}/{d}/lessons/{lid}.json'));nc=len(L['cards'])
      jobs=[(lid,L['title'])]+[(f'{lid}_{k}',re.sub('<[^>]+>','',L['cards'][k]['h']).strip()) for k in sorted({max(1,nc//3),max(2,2*nc//3)}) if k<nc]
      for key,q in jobs:
        K=f'{sid}/{key}'
        if K in picks:continue
        must=kw(q) or kw(L['title'])
        p=find(q,used,must) or find(q+' '+HINT.get(sid,''),used,must) or (key!=lid and find(q+' '+L['title'],used,must))
        if p:
          raw=get(p['url'],raw=True)
          try:open(f'{R}/art/photos/{K}.webp','wb').write(grade(raw,night,gold));used.add(p['file'])
          except Exception as e:print('grade fail',K,e);p=None
        picks[K]=p and {'src':f'art/photos/{K}.webp','credit':f"{p['artist']} · {p['license']}",'page':p['page'],'file':p['file']}
        print(K,'|',q,'->',p and p['file'],flush=True);n+=1
        if n%20==0:json.dump(picks,open(OUT,'w'),indent=0,ensure_ascii=False)
  json.dump(picks,open(OUT,'w'),indent=0,ensure_ascii=False)
if __name__=='__main__':main()
