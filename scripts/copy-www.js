// Copies the web app into www/ for the Android build (Capacitor serves www/).
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'www');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
for(const f of ['index.html','styles.css','app.js','ask.js','themes.js','sw.js','subjects.json','syllabus.json','manifest.webmanifest','lessons','subjects','vendor','icons','art'])
  if(fs.existsSync(path.join(root,f)))fs.cpSync(path.join(root,f),path.join(out,f),{recursive:true});
console.log('www ready');
