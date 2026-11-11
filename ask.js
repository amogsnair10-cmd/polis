// "Ask a doubt": sends the current lesson and card to Claude with the user's own API key.
// The key is stored only in this browser (localStorage). Loaded on demand by app.js.
import Anthropic from "./vendor/anthropic-sdk-1.3.0.js";

const plain = h => h.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const threads = {}; // lessonId -> message history, kept for follow-up questions this session

export async function ask({ apiKey, model, subject, lessonId, lesson, cardIndex, question, onText }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const card = lesson.cards[cardIndex];
  const system =
    `You are a patient tutor inside a study app. Subject: ${subject}. Lesson: "${lesson.title}".\n` +
    `Answer the learner's doubt in plain, short sentences, at the same depth as the lesson. ` +
    `Use the lesson below as context, but correct it if it is wrong, and say when facts may have changed since it was written. ` +
    `Keep answers under about 250 words unless asked for more. Use plain text with simple lists; no markdown headings.\n\n` +
    `LESSON TEXT:\n` + lesson.cards.map((c, i) => `[Card ${i + 1}] ${plain(c.h)}: ${plain(c.b)}`).join("\n");
  const history = threads[lessonId] || (threads[lessonId] = []);
  const where = card ? `(I'm on card ${cardIndex + 1}: "${plain(card.h)}")\n` : "";
  history.push({ role: "user", content: where + question });

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

export function forget(lessonId) { delete threads[lessonId]; }
