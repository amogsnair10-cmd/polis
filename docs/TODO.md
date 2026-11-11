# Done
- Search bar (⌕ Search on the home screen): searches titles and card text across every subject and jumps to the matching card.
- Ask a doubt (? in a lesson): uses the reader's own Anthropic API key, stored only on the phone. Sends the lesson and current card as context. Models: Claude Opus 5.5 (default), Sonnet 5.5, Haiku 5.5. SDK is bundled in vendor/ (@anthropic-ai/sdk 1.3.0).

# Next ideas
- Top up thin lessons (run `node scripts/lint.js subjects/<id>` to list them).
- Review screen for wrong answers; spaced-repetition re-quizzes; daily reminder.
