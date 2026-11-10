// Run once: node scripts/icons.js  (renders icons/icon.svg to PNGs)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const svg=fs.readFileSync(path.join(__dirname,'../icons/icon.svg'),'utf8');
for(const s of [180,192,512]){const p=await b.newPage({viewport:{width:s,height:s}});await p.setContent(`<style>*{margin:0}svg{width:${s}px;height:${s}px;display:block}</style>${svg}`);await p.screenshot({path:path.join(__dirname,`../icons/icon-${s}.png`)});}
await b.close()})();
