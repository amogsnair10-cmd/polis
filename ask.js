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
  // No personal key: use the site's built-in Gemini (key kept on the server).
  const res = apiKey
    ? await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: history.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
          generationConfig: { maxOutputTokens: 4000 },
        }),
      })
    : await fetch(`${window.LB_API || ""}/api/ask-gemini`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, system, history }),
      });
  if (!res.ok) {
    history.pop();
    const e = new Error(res.status === 400 || res.status === 403 ? "Gemini rejected that key." : `Gemini error ${res.status}`);
    e.status = res.status === 400 || res.status === 403 ? 401 : res.status;
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
