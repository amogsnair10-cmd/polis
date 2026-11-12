// Asks Gemini on the reader's behalf using the site's own key (Netlify env var GEMINI_API_KEY),
// so the key never ships to phones or the public repo. Streams the answer back as server-sent events.
export default async req => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return new Response("Server key not set", { status: 503 });
  const b = await req.json().catch(() => null);
  if (!b || !Array.isArray(b.history) || !b.history.length) return new Response("bad request", { status: 400 });
  const model = b.model === "gemini-pro-latest" ? "gemini-pro-latest" : "gemini-flash-latest";
  const contents = b.history.slice(-12).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content).slice(0, 4000) }] }));
  const up = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: String(b.system || "").slice(0, 60000) }] }, contents, generationConfig: { maxOutputTokens: 3000 } }),
  });
  return new Response(up.body, { status: up.status, headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } });
};
export const config = { path: "/api/ask-gemini" };
