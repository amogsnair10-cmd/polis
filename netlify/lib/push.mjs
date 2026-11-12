// Shared helpers: VAPID keys are generated once and kept in Netlify Blobs (never in the repo).
import { getStore } from "@netlify/blobs";
import webpush from "web-push";
export const store = () => getStore("push");
export async function keys() {
  const s = store();
  let k = await s.get("vapid", { type: "json" });
  if (!k) { k = webpush.generateVAPIDKeys(); await s.setJSON("vapid", k); }
  return k;
}
export async function sender() {
  const k = await keys();
  webpush.setVapidDetails("https://amoglightbulb.netlify.app", k.publicKey, k.privateKey);
  return webpush;
}
export const subKey = endpoint => "sub/" + Buffer.from(endpoint).toString("base64url").slice(-80);
