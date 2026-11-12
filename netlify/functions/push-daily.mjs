// Runs every hour. Sends each reader their reminder at their chosen local hour,
// and a streak warning at 9 pm if they haven't studied today.
import { store, sender } from "../lib/push.mjs";
const pick = a => a[Math.floor(Math.random() * a.length)];
function message(u, warn) {
  const nx = u.next ? `“${u.next}”` : "your next lesson";
  if (warn) return { title: `🔥 Your ${u.streak}-day streak ends at midnight`, body: `One lesson saves it. ${nx} takes about 15 minutes.` };
  if (u.chapterLeft > 0 && u.chapterLeft <= 2)
    return { title: `${u.chapterLeft} lesson${u.chapterLeft > 1 ? "s" : ""} to finish ${u.chapter}`, body: `Finish it and the chapter test unlocks. Next: ${nx}.` };
  if (u.streak >= 2) return pick([
    { title: `🔥 Day ${u.streak + 1} is waiting`, body: `Keep the streak alive: ${nx}.` },
    { title: `${u.streak} days in a row. Make it ${u.streak + 1}.`, body: `Today: ${nx}.` }]);
  return pick([
    { title: "💡 Today's lesson is ready", body: `${u.subject}: ${nx}. About 15 minutes.` },
    { title: "Ten minutes now, one step closer", body: `${nx} is next in ${u.subject}.` },
    { title: "Your brain wants a light bulb moment", body: `Pick up ${nx} where you left off.` }]);
}
export default async () => {
  const s = store(), wp = await sender(), now = Date.now();
  const { blobs } = await s.list({ prefix: "sub/" });
  for (const { key } of blobs) {
    const u = await s.get(key, { type: "json" }); if (!u) continue;
    const local = new Date(now - u.tz * 60000), day = local.toISOString().slice(0, 10), hour = local.getUTCHours();
    const studied = u.doneDay === day;
    let msg = null, tag = null;
    if (hour === u.hour && !studied && u.sentDay !== day) { msg = message(u, false); tag = "daily"; }
    else if (hour === 21 && !studied && u.streak > 0 && u.warnDay !== day) { msg = message(u, true); tag = "warn"; }
    if (!msg) continue;
    try {
      await wp.sendNotification(u.sub, JSON.stringify({ ...msg, url: "/?go=continue" }), { TTL: 3600 });
      if (tag === "daily") u.sentDay = day; else u.warnDay = day;
      await s.setJSON(key, u);
    } catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await s.delete(key); }
  }
  return new Response("ok");
};
export const config = { schedule: "@hourly" };
