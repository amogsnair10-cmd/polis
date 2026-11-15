# Selling Light Bulb: plan

Status: draft for decision. Written 15 Nov 2026. Not legal or tax advice. Numbers marked "estimate" are guesses, not data.

## 1. The short version

- The current app is a test run of the publishing pipeline. Its content is public, and nothing stops anyone downloading it.
- Recommendation: build a new private app, **Light Bulb Pro** (new repo `lightbulb-pro`). It launches **free**, with a free sample. One purchase of **Rs 499** unlocks the full PSIR course. Sell PSIR only at first.
- Do not charge money until four things are true: facts are checked against sources, a real paywall runs on a server, the legal basics are done, and there is a support and refund route.
- Earliest realistic paid launch: about 4 to 6 months from now (roughly March to May 2027). Content checking is the bottleneck, not code.
- Honest view: this can bring in pocket money. A living income is unlikely (see section 6).

## 2. Who buys, and at what price

**Buyers.** UPSC aspirants, mostly aged 22 to 30, who are taking PSIR as their optional. They already pay for:
- Coaching. Offline courses often cost tens of thousands of rupees (estimate).
- Test series. Usually a few thousand rupees per series (estimate).
- Printed or PDF notes.
- Free YouTube and Telegram content.

**What would make them pay:**
1. Saves time. A complete PSIR course on the phone, in short daily lessons.
2. Can be trusted. Every fact has a source they can check.
3. Gives practice they cannot get free: PYQ-style questions and answer-writing with feedback.
4. Costs much less than one test series.

**Pricing options**

| Option | Buyer pays | Good for us | Bad for us |
|---|---|---|---|
| A. One-time | Rs 499, full PSIR | Simple. Matches one exam cycle. The owner's idea. | No ongoing income. Updates are unpaid. |
| B. Subscription | e.g. Rs 149 a month or Rs 499 a year | Steady income for updates | Students cancel after the exam. Monthly payments are harder to sell. |
| C. Sample plus per-subject | e.g. Rs 199 per subject | Low entry price | Many purchases to manage. Confusing. |

**Recommendation: option A.** One price, one product, easy to explain. Add a yearly current-affairs update (option B) later, once there are paying users.

**Money after fees (estimate).**
- Google Play keeps 15% of sales (up to $1M a year).
- GST: if Rs 499 is the price shown including 18% GST, the base is about Rs 423. About Rs 360 reaches the owner before income tax. Ask an accountant how GST applies.

| Free installs | Buy rate (guess) | Sales | Approx. money to owner |
|---|---|---|---|
| 1,000 | 3% | 30 | Rs 10,800 |
| 5,000 | 3% | 150 | Rs 54,000 |
| 20,000 | 2% | 400 | Rs 1.44 lakh |

**Refunds.** Google Play handles refund requests for in-app purchases. You set the policy in the Play Console. Suggested: full refund within 7 days if the buyer asks. Say this on the purchase screen and on the refund page.

**Why free first.** Google does not let a free app become paid later. The current test app is free, so it can never be sold. Launch the new app free, with a paid unlock inside. That keeps the option to change price or add a subscription.

## 3. What must be true before charging

| Item | Today | Needed before paid launch |
|---|---|---|
| Content accuracy | The AI wrote lessons from memory. The PSIR check (`docs/CHECK_PSIR.md`) fixed 7 clear errors. About 50 or more items are still marked uncertain. Many are 2026 current-affairs claims nobody has confirmed. | Every fact in the paid lessons traced to a source (book, Constitution text, PIB, MEA). A second person checks each one. A "last checked" date on each lesson. |
| UPSC-style questions | A few quiz questions per lesson. | A question bank for PSIR. See `docs/ADAPTIVE_QUESTIONS_PLAN.md`. |
| Previous-year questions | `pyq.json` is not written. Four writer jobs hit the weekly limit (reset 18 Nov, 13:00 UTC). | Real PYQs, checked against official papers. Never label generated questions as past papers. |
| Mains answer practice | None. | 10 to 20 model answers per paper, a writing structure, and some feedback method. Human checking costs money. AI feedback needs a written rubric and a clear disclaimer. |
| A real paywall | Lessons are public static files on the Cloudflare site. The owner's full access is a hash in `account.js`, which anyone can read in the source. That is not security. | Paid lessons served only by a Cloudflare Worker that checks sign-in and entitlement. Entitlement written only by the server, after Google Play confirms the purchase (Play Developer API). Firestore rules block the app from writing entitlements. The free sample stays public. Paid content is cleared from offline cache on sign-out. The owner gets full access as an entitlement, not a hash. |
| Sign-in and sync | Sync-safety fix is from 15 Nov. | Two weeks of testers with no lost-progress reports. |

## 4. Legal and compliance

- **Name and disclaimer.** Do not use "UPSC" in the app name, icon or brand. Use "for UPSC aspirants" only in descriptions. Footer: "Not affiliated with, endorsed by or approved by the Union Public Service Commission." Check the hero emblem does not look like the national emblem. Its use is restricted by law (State Emblem of India (Prohibition of Improper Use) Act, 2005).
- **Photos.** About 1,200 from Wikimedia. Only CC-BY, CC-BY-SA and public domain are used. Needed: a credits page with each photo's author, licence and link, and a lawyer's view on CC-BY-SA in a paid product.
- **Text.** Write in our own words. Do not copy topper notes or book passages beyond short, attributed quotes.
- **Google Play rules.**
  - Digital content unlocked inside the app must use Play Billing.
  - Apps with sign-in must let users delete their account from inside the app and give a web link. This is already built; check the web link works.
  - The Data Safety form must match what the app really collects.
- **Privacy.** `privacy.html` must add payments, refunds, support, how long data is kept, and the Digital Personal Data Protection Act 2023 duties (rules are being phased in). Ask a lawyer.
- **Support and grievances.** Use a support email on a domain (not a personal address). India's E-Commerce Rules 2020 expect a grievance contact for platforms. Ask whether they apply to an app seller.
- **Terms and refund page.** Needed before charging.
- **Business and tax.** Choose a form (sole proprietor, LLP or company) with an accountant. GST: check the registration threshold. Sales through a platform such as Google Play may need GST registration regardless of turnover. Income tax applies to app income. Check with an accountant.

## 5. Clone checklist and timeline

**Keep:** app code and design (`index.html`, `styles.css`, `themes.js`), lesson format, build and lint scripts, Firebase sign-in, account deletion, the privacy page layout.

**Change:**
- New package ID. The test app's ID cannot be reused.
- New signing key. Enrol in Google Play App Signing: Google holds the app key, and you hold an upload key. Back the upload key up in two safe places, outside the repo. Without this, losing a key means the app can never be updated.
- New Firebase project for paying users. The test project (`light-bulb-3a6fe`) stays for testers.
- Paid lessons move out of the repo into private storage (for example Cloudflare R2), served by a Worker with an entitlement check.
- Remove the client-side `FULL` list. Port or delete unused Netlify functions.
- The test site is public today. At paid launch, it must show only the free sample. The test app either becomes sample-only or is unpublished.
- New domain for the paid site. Add it to Firebase authorised domains.
- Store listing: title, description, screenshots (starter files in `store/`), feature graphic, privacy URL, support email.

**Timeline (part-time, weeks from start):**
- **Weeks 1 to 2:** decisions (price, name, business form), new repo, package ID, signing key, Firebase project.
- **Weeks 2 to 8:** PSIR fact-check sprint (the biggest job). PYQ data after the 18 Nov reset. Model answers.
- **Weeks 3 to 7:** Worker, entitlement, Play purchase check, paywall screen, restore-purchases button.
- **Weeks 6 to 8:** legal pages, privacy update, Data Safety form, support email, refund page, GST advice.
- **Weeks 8 to 10:** closed test with at least 12 testers for 14 days (Play's rule for newer developer accounts; check ours), then production review.
- **Weeks 10 to 12 and after:** launch free with the PSIR unlock. Watch refunds, crashes and sign-in problems for a month.
- Other subjects come after the first paying users, once they are checked too.

## 6. Risks and honest odds

| Risk | What happens | What we do |
|---|---|---|
| Wrong facts reach paying users | Refunds, bad reviews, complaints | Check before the paywall. Keep a public corrections log. |
| Copyright or UPSC complaint | Store takedown | Disclaimer, photo credits, a ready reply and takedown plan |
| Low sales | Little or no income | Sample first. Set a stop point (below). |
| Free competition | YouTube, Telegram, free notes | Sell trust and practice, not notes |
| Google rejects or suspends the account | Launch delayed or sales stop | Follow policy. Keep the account clean. |
| Lost signing key | App cannot be updated | Play App Signing and two backups |
| Server cost or abuse | Unexpected bills | Free tiers, rate limits, monthly check |
| Owner time and support load | Burnout, slow replies | Support hours, FAQ, canned replies |
| Content goes stale | Paid content out of date | "Last checked" dates. Yearly update. |

**Odds (my guesses, not data):**
- A working paywall and an accurate PSIR course launched by mid-2027: about 2 in 3, if the fact-check gets done.
- At least 100 paying buyers within 6 months of launch: about 1 in 3, with some promotion through study groups and word of mouth.
- Replacing a living income of about Rs 50,000 a month within a year: under 1 in 10.

**Stop rule.** If there are fewer than 30 sales in the first 3 months of the paid launch, keep the app free as a study tool, stop paid promotion and reassess.

**Decisions needed from the owner:**
1. Yes or no to: free app, Rs 499 unlock, PSIR only.
2. Budget for an expert fact-check (per-subject cost to be quoted).
3. Business form, and an accountant for GST and tax.
