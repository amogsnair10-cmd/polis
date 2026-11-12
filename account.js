// Accounts: Google or phone sign-in (Firebase), cloud sync of progress and doubts, and the "My learning" screen.
// Loaded in the background by app.js. Uses app.js globals: SUBJ, SUB, S, ls, loadSubject, renderHome, openL, show, esc, today, ds.
import {
  initializeApp, getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signOut, signInWithCredential,
  initializeFirestore, persistentLocalCache, doc, getDoc, setDoc, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp,
} from "./vendor/firebase-13.1.0.js";

const app = initializeApp({
  apiKey: "AIzaSyDgAqbSPaX7uyKnY7cNF3N9-UWlwZGX8AA",
  authDomain: "light-bulb-3a6fe.firebaseapp.com",
  projectId: "light-bulb-3a6fe",
  storageBucket: "light-bulb-3a6fe.firebasestorage.app",
  messagingSenderId: "880679235067",
  appId: "1:880679235067:web:1caa9e0bb1b746584e6f5e",
});
const auth = getAuth(app);
const db = initializeFirestore(app, { localCache: persistentLocalCache() });
let user = null, pushTimer = null;

// Android app: Google blocks sign-in inside app web views, so sign in on a small page in Chrome
// (auth.html) and come back through the lightbulb:// link with a Google ID token.
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
async function googleSignIn() {
  if (!NATIVE) return signInWithPopup(auth, new GoogleAuthProvider());
  await window.Capacitor.Plugins.Browser.open({ url: new URL("auth.html", location.href).href });
}
if (NATIVE && window.Capacitor.Plugins.App) window.Capacitor.Plugins.App.addListener("appUrlOpen", async ({ url }) => {
  if (!url || !url.startsWith("lightbulb://auth")) return;
  const idt = new URL(url.replace("lightbulb://", "https://x/")).searchParams.get("idt");
  try { window.Capacitor.Plugins.Browser.close(); } catch (e) {}
  if (idt) try { await signInWithCredential(auth, GoogleAuthProvider.credential(idt)); if (document.getElementById("me").classList.contains("on")) openMe(); } catch (e) { alert("Sign-in didn't finish. Try again."); }
});

const storeKey = s => s.store || "polis:" + s.id;
const readLocal = s => { try { return JSON.parse(ls.get(storeKey(s)) || "null") || { done: {}, scores: {}, days: [] } } catch (e) { return { done: {}, scores: {}, days: [] } } };
function merge(a, b) {
  const o = { done: { ...(a.done || {}), ...(b.done || {}) }, scores: { ...(a.scores || {}) }, days: [...new Set([...(a.days || []), ...(b.days || [])])].sort(), tests: { ...(a.tests || {}) } };
  for (const k in b.scores || {}) o.scores[k] = Math.max(o.scores[k] || 0, b.scores[k]);
  for (const k in b.tests || {}) o.tests[k] = Math.max(o.tests[k] || 0, b.tests[k]);
  return o;
}

// ---------- sync ----------
async function pull() {
  const snap = await getDoc(doc(db, "users", user.uid));
  const cloud = (snap.exists() && snap.data().progress) || {};
  const out = {};
  for (const s of SUBJ) {
    const m = merge(readLocal(s), cloud[s.id] || {});
    ls.set(storeKey(s), JSON.stringify(m));
    out[s.id] = m;
  }
  await setDoc(doc(db, "users", user.uid), {
    progress: out, name: user.displayName || "", phone: user.phoneNumber || "", email: user.email || "", updated: serverTimestamp(),
  }, { merge: true });
  if (SUB) { loadProgress(); renderHome(); }
}
function pushSoon() {
  if (!user) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const progress = {};
    for (const s of SUBJ) progress[s.id] = readLocal(s);
    setDoc(doc(db, "users", user.uid), { progress, updated: serverTimestamp() }, { merge: true }).catch(() => {});
  }, 1500);
}
window.onProgress = pushSoon;
window.onDoubt = d => { if (user) addDoc(collection(db, "users", user.uid, "doubts"), { ...d, ts: serverTimestamp() }).catch(() => {}); };

// ---------- sign-in UI ----------
const box = document.getElementById("acct");
function render() {
  if (user) {
    const who = user.displayName || user.phoneNumber || user.email || "Signed in";
    box.innerHTML = `<div class="acct-row"><span class="avatar">${esc(who[0] || "•")}</span><div><b>${esc(who)}</b><small>Progress and doubts are saved to your account.</small></div></div>
      <button class="start" id="meBtn">My learning</button><button class="linkbtn" id="outBtn">Sign out</button>`;
    document.getElementById("meBtn").onclick = () => { document.getElementById("sheet").hidden = true; openMe(); };
    document.getElementById("outBtn").onclick = () => signOut(auth);
  } else {
    box.innerHTML = `<p class="note">Sign in to save your progress and doubts, and see how your learning is going.</p>
      <button class="choice signin" id="gBtn"><span class="g">G</span><span>Continue with Google</span></button>
      <p class="note" id="aMsg"></p><div id="rc"></div>`;
    const msg = t => document.getElementById("aMsg").textContent = t;
    document.getElementById("gBtn").onclick = async () => {
      try { await googleSignIn(); }
      catch (e) { msg("Google sign-in didn't finish: " + (e.code || e.message)); }
    };
  }
}
onAuthStateChanged(auth, async u => { user = u; render(); if (u) { try { await pull(); } catch (e) { console.warn("sync", e); } } });

// ---------- My learning ----------
async function openMe() {
  const v = document.getElementById("me");
  const all = SUBJ.map(s => ({ s, p: readLocal(s) }));
  const days = new Set(all.flatMap(x => x.p.days || []));
  const done = all.reduce((n, x) => n + Object.keys(x.p.done || {}).length, 0);
  const sc = all.flatMap(x => Object.values(x.p.scores || {}));
  const avg = sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length * 100) : 0;
  let st = 0; { const d = new Date(); if (!days.has(ds(d))) d.setDate(d.getDate() - 1); while (days.has(ds(d))) { st++; d.setDate(d.getDate() - 1); } }
  // 12-week heatmap
  let heat = ""; const start = new Date(); start.setDate(start.getDate() - 83 - start.getDay());
  for (let w = 0; w < 12; w++) { heat += "<div>"; for (let d = 0; d < 7; d++) { const t = new Date(start); t.setDate(start.getDate() + w * 7 + d); heat += `<i class="${days.has(ds(t)) ? "on" : ""}${t > new Date() ? " fut" : ""}"></i>`; } heat += "</div>"; }
  // per subject, and weak chapters
  const idxs = await Promise.all(SUBJ.map(s => fetch((s.dir === "." ? "" : s.dir + "/") + "lessons/index.json").then(r => r.json()).catch(() => ({}))));
  const maps = await Promise.all(SUBJ.map(s => fetch((s.dir === "." ? "" : s.dir + "/") + "syllabus.json").then(r => r.json()).catch(() => [])));
  const subj = all.map(({ s, p }, i) => {
    const total = Object.keys(idxs[i]).length, n = Object.keys(p.done || {}).length;
    const ss = Object.values(p.scores || {}), a = ss.length ? Math.round(ss.reduce((x, y) => x + y, 0) / ss.length * 100) : null;
    return { s, total, n, a };
  }).filter(x => x.n > 0);
  const weak = [];
  all.forEach(({ s, p }, i) => {
    const by = {};
    for (const [id, v] of Object.entries(p.scores || {})) { const u = id.split("-").slice(0, 2).join("-"); (by[u] = by[u] || []).push(v); }
    for (const [u, arr] of Object.entries(by)) if (arr.length) {
      const [pi, ui] = u.split("-"), name = maps[i][pi] && maps[i][pi].units[ui] ? maps[i][pi].units[ui][0] : u;
      weak.push({ s, u, name, a: arr.reduce((x, y) => x + y, 0) / arr.length });
    }
  });
  weak.sort((x, y) => x.a - y.a);
  let doubts = [];
  if (user) try { (await getDocs(query(collection(db, "users", user.uid, "doubts"), orderBy("ts", "desc"), limit(40)))).forEach(d => doubts.push(d.data())); } catch (e) {}
  v.innerHTML = `<div class="bar"><button class="x" id="meClose" aria-label="Close">×</button><h2 class="me-h">My learning</h2></div>
   <div class="me">
    ${user ? "" : `<div class="me-signin"><b>Save your progress and doubts</b><small>Sign in once and everything syncs across devices.</small><button class="start" id="meG">Continue with Google</button><p class="note" id="meMsg"></p></div>`}
    <div class="me-stats"><div><b>${st}</b><small>day streak</small></div><div><b>${done}</b><small>lessons</small></div><div><b>${days.size}</b><small>study days</small></div><div><b>${sc.length ? avg + "%" : "–"}</b><small>quiz average</small></div></div>
    <h3>Last 12 weeks</h3><div class="heat">${heat}</div>
    <h3>Subjects</h3>${subj.length ? subj.map(x => `<button class="me-sub" data-s="${x.s.id}"><span class="sic" style="--a:${(THEMES[x.s.theme] || THEMES.polis).vars["--gold"] || "#c9a45c"};--b:${(THEMES[x.s.theme] || THEMES.polis).vars["--lapis"] || "#13294b"}">${icon(x.s.id)}</span><span class="me-sub-t"><b>${x.s.title}</b> · ${x.s.name}<i style="--w:${Math.round(x.n / Math.max(1, x.total) * 100)}%"></i><small>${x.n} of ${x.total} lessons${x.a != null ? " · quiz " + x.a + "%" : ""}</small></span></button>`).join("") : `<p class="note">Finish a lesson and it shows up here.</p>`}
    ${weak.length ? `<h3>Revise these</h3>${weak.slice(0, 5).map(w => `<button class="me-weak" data-s="${w.s.id}" data-u="${w.u}"><b>${esc(w.name)}</b><small>${w.s.title} · quiz ${Math.round(w.a * 100)}%</small><span>Revise →</span></button>`).join("")}` : ""}
    <h3>Your doubts</h3>${user ? (doubts.length ? doubts.map(d => `<button class="me-doubt" data-s="${esc(d.subject || "")}" data-l="${esc(d.lessonId || "")}"><small>${esc(d.subjectTitle || "")} · ${esc(d.lessonTitle || "")}</small><b>${esc(d.q || "")}</b><span>${esc((d.a || "").slice(0, 220))}${(d.a || "").length > 220 ? "…" : ""}</span></button>`).join("") : `<p class="note">Questions you ask with the ? button will be saved here.</p>`) : `<p class="note">Sign in to save your doubts.</p>`}
   </div>`;
  show("me");
  document.getElementById("meClose").onclick = back;
  const g = document.getElementById("meG");
  if (g) g.onclick = async () => { try { await googleSignIn(); if (!NATIVE) openMe(); } catch (e) { document.getElementById("meMsg").textContent = "Sign-in didn't finish: " + (e.code || e.message); } };
  v.querySelectorAll(".me-sub").forEach(b => b.onclick = async () => { await loadSubject(b.dataset.s); back(); });
  v.querySelectorAll(".me-weak").forEach(b => b.onclick = async () => { await loadSubject(b.dataset.s); const [p, u] = b.dataset.u.split("-"); openTest(+p, +u); });
  v.querySelectorAll(".me-doubt").forEach(b => b.onclick = async () => { if (!b.dataset.s || !b.dataset.l) return; await loadSubject(b.dataset.s); openL(b.dataset.l); });
}
window.openMe = openMe;
