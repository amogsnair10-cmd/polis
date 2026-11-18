// Accounts: Google or phone sign-in (Firebase), cloud sync of progress and doubts, and the "My learning" screen.
// Loaded in the background by app.js. Uses app.js globals: SUBJ, SUB, S, ls, loadSubject, renderHome, openL, show, esc, today, ds.
import {
  initializeApp, getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signOut, signInWithCredential, deleteUser,
  initializeFirestore, persistentLocalCache, doc, getDoc, setDoc, deleteDoc, writeBatch, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp,
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
let user = null, pushTimer = null, pulled = false;

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
  // review list: one entry per question, the most recently updated copy wins
  const rev = new Map();
  for (const r of [...(a.rev || []), ...(b.rev || [])]) { const k = r.id + ":" + r.q, x = rev.get(k); if (!x || (r.t || 0) > (x.t || 0)) rev.set(k, r); }
  if (rev.size) o.rev = [...rev.values()];
  for (const k of ["xp", "rv", "mixN", "mixBest"]) { const v = Math.max(a[k] || 0, b[k] || 0); if (v) o[k] = v; }
  return o;
}

// ---------- sync ----------
async function pull() {
  const snap = await getDoc(doc(db, "users", user.uid));
  pulled = true; // from here on it is safe to write: the cloud copy has been merged in, so an empty phone can't overwrite it
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
  window.checkBadges && window.checkBadges(true);
}
function pushSoon() {
  if (!user) return;
  if (!pulled) { pull().catch(() => {}); return; }
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
// ---------- Delete account (Google Play requires this) ----------
async function deleteAccount() {
  if (!user) return;
  if (!confirm("Delete your account?\n\nThis removes your sign-in, your cloud progress and all saved doubts from our servers. Progress already on this phone stays. This cannot be undone.")) return;
  const u = user;
  try {
    const snap = await getDocs(collection(db, "users", u.uid, "doubts"));
    const b = writeBatch(db); snap.forEach(d => b.delete(d.ref)); await b.commit();
    await deleteDoc(doc(db, "users", u.uid));
    await deleteUser(u);
    alert("Your account and cloud data have been deleted.");
  } catch (e) {
    alert(e && e.code === "auth/requires-recent-login"
      ? "For your safety, please sign out, sign in again, and then tap Delete account once more. Your cloud data has already been removed."
      : "Could not finish deleting. Check your connection and try again.");
  }
}
window.deleteAccount = deleteAccount;
function render() {
  if (user) {
    const who = user.displayName || user.phoneNumber || user.email || "Signed in";
    if (window.LB_FULL) setTimeout(() => { const o = document.getElementById("outBtn"); if (o && !document.getElementById("fullTag")) o.insertAdjacentHTML("beforebegin", '<p class="note" id="fullTag">✦ Full access</p>'); }, 0);
    box.innerHTML = `<div class="acct-row"><span class="avatar">${esc(who[0] || "•")}</span><div><b>${esc(who)}</b><small>Progress and doubts are saved to your account.</small></div></div>
      <button class="start" id="meBtn">My learning</button><button class="linkbtn" id="outBtn">Sign out</button><button class="linkbtn danger" id="delBtn">Delete account</button>`;
    document.getElementById("meBtn").onclick = () => { document.getElementById("sheet").hidden = true; openMe(); };
    document.getElementById("outBtn").onclick = () => signOut(auth);
    document.getElementById("delBtn").onclick = deleteAccount;
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
const FULL = ["5cba96f376767cb010d8f709af75644a8496f4edf6849340ff44d089b5b9ad40"];
let firstCheck = true;
onAuthStateChanged(auth, async u => {
  user = u; window.LB_FULL = false; pulled = false;
  // Owner accounts get everything unlocked. Stored as a SHA-256 of the email so no address sits in the code.
  if (u && u.email) try { const h = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(u.email.trim().toLowerCase())))].map(b => b.toString(16).padStart(2, "0")).join(""); window.LB_FULL = FULL.includes(h); } catch (e) {}
  render();
  if (u) { closeWelcome(); try { await pull(); } catch (e) { console.warn("sync", e); } }
  else if (firstCheck && ls.get("welcomed") !== "1") setTimeout(showWelcome, 2400);
  firstCheck = false;
});

// First-run welcome: ask once to sign in so progress and doubts are saved.
function showWelcome() {
  if (user || document.getElementById("welcome")) return;
  // Never pop over another menu or an open lesson: wait until the home screen is clear.
  const busy = [...document.querySelectorAll(".sheet")].some(x => !x.hidden) || document.querySelector(".view.on:not(#home)");
  if (busy) { setTimeout(showWelcome, 1500); return; }
  const w = document.createElement("div"); w.id = "welcome";
  w.innerHTML = `<div class="w-in"><img class="lum" src="art/lumen/subjects-b-6.webp" alt=""><h2>Welcome to Light Bulb</h2>
    <p>Sign in once to keep your streak, progress and doubts safe across devices.</p>
    <button class="start" id="wG">Continue with Google</button><button class="linkbtn" id="wSkip">Not now</button><p class="note" id="wMsg"></p></div>`;
  document.body.appendChild(w);
  document.getElementById("wSkip").onclick = () => { ls.set("welcomed", "1"); closeWelcome(); };
  document.getElementById("wG").onclick = async () => { ls.set("welcomed", "1"); try { await googleSignIn(); } catch (e) { document.getElementById("wMsg").textContent = "Sign-in didn't finish: " + (e.code || e.message); } };
}
function closeWelcome() { const w = document.getElementById("welcome"); if (!w) return; w.classList.add("closing"); setTimeout(() => w.remove(), 460); }

// ---------- Restore by hand: for when progress was lost and the cloud copy can't bring it back ----------
async function subjectIds(s) {
  const base = (s.dir === "." ? "" : s.dir + "/");
  const [map, idx] = await Promise.all([fetch(base + "syllabus.json").then(r => r.json()), fetch(base + "lessons/index.json").then(r => r.json())]);
  const ids = []; map.forEach((p, pi) => p.units.forEach((u, ui) => { for (let k = 0; k < u[1].length; k++) { const id = `${pi}-${ui}-${k}`; if (idx[id]) ids.push(id); } }));
  return ids;
}
async function openRestore() {
  const ov = document.createElement("div"); ov.className = "sheet"; ov.id = "restoreSheet";
  ov.innerHTML = `<div class="sheet-in marble"><button class="x sx" id="rsX" aria-label="Close">×</button><h2>Restore my progress</h2><p class="note">Set how many lessons you had finished in each subject, in syllabus order. This only adds. It never removes anything.</p><div id="rsRows"><p class="note">Loading…</p></div></div>`;
  document.body.appendChild(ov);
  const close = () => { ov.classList.add("closing"); setTimeout(() => ov.remove(), 420); };
  ov.querySelector("#rsX").onclick = close; ov.onclick = e => { if (e.target === ov) close(); };
  let rows;
  try { rows = await Promise.all(SUBJ.filter(s => !s.soon).map(async s => ({ s, ids: await subjectIds(s), p: readLocal(s) }))); }
  catch (e) { ov.querySelector("#rsRows").innerHTML = '<p class="note">Could not load. Check your connection.</p>'; return; }
  ov.querySelector("#rsRows").innerHTML = rows.map((r, i) => {
    const have = r.ids.filter(id => (r.p.done || {})[id]).length;
    return `<label class="rs-row"><span><b>${esc(r.s.title)}</b> · ${esc(r.s.name)}<small>${r.ids.length} lessons</small></span><input type="number" inputmode="numeric" min="0" max="${r.ids.length}" value="${have}" data-i="${i}"></label>`;
  }).join("") + `<label class="rs-row"><span><b>Study streak</b><small>days in a row, up to yesterday</small></span><input type="number" inputmode="numeric" min="0" max="365" value="0" id="rsStreak"></label><button class="start" id="rsGo">Restore</button><p class="note" id="rsMsg"></p>`;
  ov.querySelector("#rsGo").onclick = () => {
    let added = 0;
    rows.forEach((r, i) => {
      const n = Math.max(0, Math.min(r.ids.length, +ov.querySelector(`input[data-i="${i}"]`).value || 0)), m = r.p; m.done = m.done || {};
      let fresh = 0; r.ids.slice(0, n).forEach(id => { if (!m.done[id]) { m.done[id] = 1; fresh++; } });
      if (fresh) { m.xp = (m.xp || 0) + fresh * 35; added += fresh; }
      if (r.s.id === SUB.id) { const sk = Math.max(0, Math.min(365, +ov.querySelector("#rsStreak").value || 0)); m.days = m.days || []; for (let d = 1; d <= sk; d++) { const t = new Date(); t.setDate(t.getDate() - d); if (!m.days.includes(ds(t))) m.days.push(ds(t)); } m.days.sort(); }
      ls.set(storeKey(r.s), JSON.stringify(m));
    });
    loadProgress(); renderHome(); pushSoon(); window.checkBadges && window.checkBadges(true);
    ov.querySelector("#rsMsg").textContent = added ? `Restored ${added} lesson${added == 1 ? "" : "s"}.` : "Nothing to add.";
    setTimeout(() => { close(); if (document.getElementById("me").classList.contains("on")) openMe(); }, 900);
  };
}
// ---------- My learning ----------
async function openMe() {
  const v = document.getElementById("me");
  const all = SUBJ.map(s => ({ s, p: readLocal(s) }));
  const stOf = arr => { const set = new Set(arr || []); let n = 0; const d = new Date(); if (!set.has(ds(d))) d.setDate(d.getDate() - 1); while (set.has(ds(d))) { n++; d.setDate(d.getDate() - 1); } return n; };
  const BS = window.badgeState ? window.badgeState() : null, lv = BS ? BS.level : { n: 1, name: "Beginner", xp: 0 };
  const nm = user ? (user.displayName || (user.email || "").split("@")[0] || "Learner") : "Guest learner";
  const ini = (nm[0] || "L").toUpperCase();
  let last = null; try { last = JSON.parse(ls.get("lb:last") || "null"); } catch (e) {}
  const lastS = last && SUBJ.find(s => s.id === last.s);
  const since = user && user.metadata && user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "";
  const chips = all.filter(x => (x.p.days || []).length || Object.keys(x.p.done || {}).length).map(x => ({ x, n: stOf(x.p.days) })).sort((p, q) => q.n - p.n);
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
   <div class="me" data-tab="me">
    <div class="metabs" role="tablist"><button role="tab" class="on" data-t="me">Me</button><button role="tab" data-t="chl">Challenges</button></div>
    <div class="me-prof"><span class="av">${esc(ini)}<img class="lface" src="art/lumen/face.webp" alt="" onerror="this.remove()">${user && user.photoURL ? `<img src="${esc(user.photoURL)}" referrerpolicy="no-referrer" alt="" onerror="this.remove()">` : ""}</span><div class="who"><h2>${esc(nm)}</h2><small>${user ? esc(user.email || user.phoneNumber || "") : "Not signed in"}${since ? " · Member since " + since : ""}</small><span class="chip">Level ${lv.n} · ${esc(lv.name)} · ${lv.xp} XP</span></div></div>
    ${last && lastS ? `<button class="me-cont" id="meCont"><small>Continue where you left off</small><b>${esc(last.t || "Last lesson")}</b><span>${esc(lastS.title)} · Resume →</span></button>` : ""}
    ${user ? "" : `<div class="me-signin"><b>Save your progress and doubts</b><small>Sign in once and everything syncs across devices.</small><button class="start" id="meG">Continue with Google</button><p class="note" id="meMsg"></p></div>`}
    <div class="me-stats"><div><b>${st}</b><small>day streak</small></div><div><b>${lv.xp}</b><small>XP</small></div><div><b>${done}</b><small>lessons</small></div><div><b>${days.size}</b><small>study days</small></div><div><b>${sc.length ? avg + "%" : "–"}</b><small>quiz average</small></div><div><b>${BS ? BS.all.filter(b => b.got).length + "/" + BS.all.length : "–"}</b><small>badges</small></div></div>
    ${chips.length ? `<h3>Streaks by subject</h3><div class="sstreaks">${chips.map(c => `<div class="sk"><span class="sic" style="--a:${(THEMES[c.x.s.theme] || THEMES.polis).vars["--gold"] || "#c9a45c"};--b:${(THEMES[c.x.s.theme] || THEMES.polis).vars["--lapis"] || "#13294b"}">${icon(c.x.s.id)}</span><div><b>${c.n}<i>🔥</i></b><small>${esc(c.x.s.title)}</small></div></div>`).join("")}</div>` : ""}
    ${(() => { const B = window.badgeState && window.badgeState(); if (!B) return ""; const v = B.level, got = B.all.filter(b => b.got).length;
      return `<div class="me-xp"><div class="top"><span class="lv">Level ${v.n}</span><b>${v.name}</b><span class="xp">${v.xp} XP</span></div><i><b style="width:${v.pct}%"></b></i><small>${v.next ? (v.next - v.xp) + " XP to the next level" : "Top level reached"}</small></div>
      <details class="bdrop"><summary><span>Badges</span><em class="cnt">${got} won</em><span class="bstrip">${B.all.filter(b => b.got).slice(0, 6).map(b => `<img src="art/lumen/${(window.BADGEPOSE || {})[b.id] || "face"}.webp" alt="">`).join("")}</span></summary>
        ${(() => { const E = B.all.filter(b => b.got); return E.length ? `<div class="badges">${E.map(b => `<div class="badge t-${b.tier}"><span class="bm"><img src="art/lumen/${(window.BADGEPOSE || {})[b.id] || "face"}.webp" alt="" loading="lazy" decoding="async"></span><b>${b.t}</b><small>${b.d}</small></div>`).join("")}</div>` : `<p class="bnone">Nothing won yet. Open Challenges below to see what to aim for.</p>`; })()}
      </details>
      <div class="chpane"><h3 class="chh">Challenges <em class="cnt">${B.all.length - got} to go</em></h3><p class="chs">Everything you can still win, closest first.</p>
        ${(() => { const L = B.all.filter(b => !b.got).sort((x, y) => (y.cur / y.need) - (x.cur / x.need)); const lab = b => b.unit === "mixBest" ? Math.round(b.cur * 100) + "% of " + Math.round(b.need * 100) + "%" : b.cur + " of " + b.need;
          return L.length ? `<div class="crows">${L.map(b => `<div class="crow t-${b.tier}"><span class="bm sm"><img src="art/lumen/${(window.BADGEPOSE || {})[b.id] || "face"}.webp" alt="" loading="lazy" decoding="async"></span><div class="ct"><b>${b.t}</b><small>${b.d}</small><i><u style="width:${Math.round(b.cur / b.need * 100)}%"></u></i></div><span class="cp">${lab(b)}</span></div>`).join("")}</div>` : `<p class="bnone">You have won every badge. Legend.</p>`; })()}
      </div>`; })()}
    <h3>Last 12 weeks</h3><div class="heat">${heat}</div>
    <h3>Subjects</h3>${subj.length ? subj.map(x => `<button class="me-sub" data-s="${x.s.id}"><span class="sic" style="--a:${(THEMES[x.s.theme] || THEMES.polis).vars["--gold"] || "#c9a45c"};--b:${(THEMES[x.s.theme] || THEMES.polis).vars["--lapis"] || "#13294b"}">${icon(x.s.id)}</span><span class="me-sub-t"><b>${x.s.title}</b> · ${x.s.name}<i style="--w:${Math.round(x.n / Math.max(1, x.total) * 100)}%"></i><small>${x.n} of ${x.total} lessons${x.a != null ? " · quiz " + x.a + "%" : ""}</small></span></button>`).join("") : `<div class="lumnote"><span class="ltile">${LUM("study-5")}</span><p>Finish a lesson and it shows up here.</p></div>`}
    ${weak.length ? `<h3>Revise these</h3>${weak.slice(0, 5).map(w => `<button class="me-weak" data-s="${w.s.id}" data-u="${w.u}"><b>${esc(w.name)}</b><small>${w.s.title} · quiz ${Math.round(w.a * 100)}%</small><span>Revise →</span></button>`).join("")}` : ""}
    ${user ? `<h3>Your account</h3><button class="me-weak" id="delAcct"><b>Delete my account and data</b><small>Removes your sign-in, cloud progress and doubts</small><span>Delete →</span></button>` : ""}
    <h3>Feel</h3><div class="feel"><label><span><b>Sound effects</b><small>Soft chimes and ticks</small></span><input type="checkbox" id="fSnd" ${window.Feel && Feel.snd ? "checked" : ""}></label><label><span><b>Vibration</b><small>Taps on answers and rewards</small></span><input type="checkbox" id="fHap" ${window.Feel && Feel.hap ? "checked" : ""}></label><button class="me-weak" id="fTest"><b>Test sound and vibration</b><small>Plays both and shows what this phone reports</small><span>Test →</span></button><pre class="fdiag" id="fDiag" hidden></pre></div>
    <h3>App</h3><button class="me-weak" id="rfBtn"><b>Refresh the app</b><small id="verTxt">Check for the newest version</small><span>Refresh →</span></button>
    <h3>Lost your progress?</h3><button class="me-weak" id="rsOpen"><b>Restore my progress</b><small>Tell the app how many lessons you had finished</small><span>Restore →</span></button>
    <h3>Your doubts</h3>${user ? (doubts.length ? doubts.map(d => `<button class="me-doubt" data-s="${esc(d.subject || "")}" data-l="${esc(d.lessonId || "")}"><small>${esc(d.subjectTitle || "")} · ${esc(d.lessonTitle || "")}</small><b>${esc(d.q || "")}</b><span>${esc((d.a || "").slice(0, 220))}${(d.a || "").length > 220 ? "…" : ""}</span></button>`).join("") : `<div class="lumnote"><span class="ltile">${LUM("sunglasses-5")}</span><p>Ask me anything with the ? button. Your doubts will be saved here.</p></div>`) : `<p class="note">Sign in to save your doubts.</p>`}
   </div>`;
  show("me");
  document.getElementById("meClose").onclick = back;
  const fs = document.getElementById("fSnd"), fh = document.getElementById("fHap");
  if (fs) fs.onchange = () => window.Feel && Feel.set("snd", fs.checked);
  const ft = document.getElementById("fTest");
  if (ft) ft.onclick = () => { window.Feel && (Feel.play("good"), setTimeout(() => Feel.play("badge"), 500)); const d = document.getElementById("fDiag"); d.hidden = false; d.textContent = window.Feel ? Feel.diag() : "feel.js did not load"; setTimeout(() => { d.textContent = window.Feel ? Feel.diag() : d.textContent; }, 900); };
  if (fh) fh.onchange = () => window.Feel && Feel.set("hap", fh.checked);
  v.querySelectorAll(".metabs button").forEach(b => b.onclick = () => { const me = v.querySelector(".me"); me.dataset.tab = b.dataset.t; v.querySelectorAll(".metabs button").forEach(x => x.classList.toggle("on", x === b)); window.scrollTo(0, 0); });
  const g = document.getElementById("meG");
  if (g) g.onclick = async () => { try { await googleSignIn(); if (!NATIVE) openMe(); } catch (e) { document.getElementById("meMsg").textContent = "Sign-in didn't finish: " + (e.code || e.message); } };
  fetch("sw.js", { cache: "no-store" }).then(r => r.text()).then(t => { const m = t.match(/const V='polis-([0-9a-f]+)'/); const e = document.getElementById("verTxt"); if (e && m) e.textContent = "Version " + m[1] + " · tap to refresh"; }).catch(() => {});
  const rf = document.getElementById("rfBtn"); if (rf) rf.onclick = async () => { rf.querySelector("span").textContent = "Refreshing…"; try { for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); for (const k of await caches.keys()) await caches.delete(k); } catch (e) {} location.reload(); };
  const mc = document.getElementById("meCont"); if (mc) mc.onclick = async () => { await loadSubject(last.s); openL(last.id, last.card >= 0 ? last.card : undefined); };
  const da = document.getElementById("delAcct"); if (da) da.onclick = deleteAccount;
  const ro = document.getElementById("rsOpen"); if (ro) ro.onclick = openRestore;
  v.querySelectorAll(".me-sub").forEach(b => b.onclick = async () => { await loadSubject(b.dataset.s); back(); });
  v.querySelectorAll(".me-weak:not(#rsOpen):not(#delAcct):not(#rfBtn):not(#fTest)").forEach(b => b.onclick = async () => { await loadSubject(b.dataset.s); const [p, u] = b.dataset.u.split("-"); openTest(+p, +u); });
  v.querySelectorAll(".me-doubt").forEach(b => b.onclick = async () => { if (!b.dataset.s || !b.dataset.l) return; await loadSubject(b.dataset.s); openL(b.dataset.l); });
}
window.openMe = openMe;
