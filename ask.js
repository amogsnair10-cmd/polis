// "Ask a doubt": sends the current lesson and card to Claude with the user's own API key.
// The key is stored only in this browser (localStorage). Loaded on demand by app.js.
import Anthropic from "./vendor/anthropic-sdk-1.3.0.js";

const plain = h => h.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const threads = {}; // lessonId -> message history, kept for follow-up questions this session

export async function ask({ apiKey, model, subject, lessonId, lesson, cardIndex, question, onText }) {
  const card = lesson.cards[cardIndex];
  const system =
    `You are a patient tutor inside a study app. Subject: ${subject}. Lesson: "${lesson.title}".\n` +
    `Answer the learner's doubt in plain, short sentences, at the same depth as the lesson. ` +
    `Use the lesson below as context, but correct it if it is wrong, and say when facts may have changed since it was written. ` +
    `Keep answers under about 250 words unless asked for more. Use plain text with simple lists; no markdown headings.\n\n` +
    `LESSON TEXT:\n` + lesson.cards.map((c, i) => `[Card ${i + 1}] ${plain(c.h)}: ${plain(c.b)}`).join("\n");
  const tkey = lessonId + "|" + model;
  const history = threads[tkey] || (threads[tkey] = []);
  const where = card ? `(I'm on card ${cardIndex + 1}: "${plain(card.h)}")\n` : "";
  history.push({ role: "user", content: where + question });
  if (model.startsWith("gemini")) return askGemini({ apiKey, model, system, history, onText });
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const stream = client.beta.messages.stream({
    model,
    max_tokens: 4000,
    system,
    messages: history,
    output_config: { effort: "medium" },
    // On a policy decline the API retries on a fallback model inside the same call.
    ...(model === "claude-haiku-5-5" ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }),
  });
  let text = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      text += event.delta.text;
      onText(text);
    }
  }
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") {
    history.pop();
    throw new Error("Claude declined to answer this one. Try rephrasing the question.");
  }
  history.push({ role: "assistant", content: msg.content });
  return text;
}

export function forget(lessonId) { for (const k in threads) if (k.startsWith(lessonId + "|")) delete threads[k]; }

// Gemini (Google AI Studio key). Streams the answer inside the app via the Gemini REST API.
async function askGemini({ apiKey, model, system, history, onText }) {
  // Google returns 503/429 when a model is busy: retry once, then fall back to other current Flash models.
  const tries = [model, model, "gemini-3.8-flash", "gemini-3.5-flash"];
  let res, lastErr = "";
  for (let t = 0; t < tries.length; t++) {
    if (t) await new Promise(r => setTimeout(r, 1200 * t));
    const body = JSON.stringify(apiKey ? {
      systemInstruction: { parts: [{ text: system }] },
      contents: history.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 4000 },
    } : { model: tries[t], system, history });
    res = apiKey
      ? await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${tries[t]}:streamGenerateContent?alt=sse`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body })
      : await fetch(`${window.LB_API || ""}/api/ask-gemini`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    if (res.ok) break;
    try { const j = await res.clone().json(); lastErr = (j.error && j.error.message) || ""; } catch (e) {}
    if (![429, 500, 503, 404].includes(res.status)) break;
    if (t === 0) onText("Gemini is busy, retrying…");
  }
  if (!res.ok) {
    history.pop();
    const bad = res.status === 400 || res.status === 403;
    const e = new Error(bad ? "Gemini rejected that key." : (res.status === 503 || res.status === 429 ? "Gemini is overloaded right now. Try again in a minute." : `Gemini error ${res.status}`) + (lastErr && !bad ? " (" + lastErr.slice(0, 120) + ")" : ""));
    e.status = bad ? 401 : res.status;
    throw e;
  }
  const reader = res.body.getReader(), dec = new TextDecoder();
  let buf = "", text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      try {
        const j = JSON.parse(line.slice(5));
        const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
        for (const p of parts) if (p.text && !p.thought) { text += p.text; onText(text); }
      } catch (e) {}
    }
  }
  if (!text) { history.pop(); throw new Error("Gemini returned no answer. Try rephrasing."); }
  history.push({ role: "assistant", content: text });
  return text;
}
