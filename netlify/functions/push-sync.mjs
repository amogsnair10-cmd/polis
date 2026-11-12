// The app saves its subscription and study state here (streak, next lesson, reminder time).
import { store, subKey } from "../lib/push.mjs";
export default async req => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const b = await req.json().catch(() => null);
  if (!b || !b.sub || !b.sub.endpoint) return new Response("bad request", { status: 400 });
  const k = subKey(b.sub.endpoint), s = store();
  if (b.off) { await s.delete(k); return Response.json({ ok: true, off: true }); }
  const old = (await s.get(k, { type: "json" })) || {};
  const clean = v => String(v ?? "").slice(0, 140);
  await s.setJSON(k, { ...old, sub: b.sub, hour: Math.min(23, Math.max(0, +b.hour || 19)), tz: +b.tz || -330,
    streak: +b.streak || 0, doneDay: clean(b.doneDay), subject: clean(b.subject), next: clean(b.next), chapterLeft: +b.chapterLeft || 0,
    chapter: clean(b.chapter), updated: Date.now() });
  return Response.json({ ok: true });
};
export const config = { path: "/api/push-sync" };
