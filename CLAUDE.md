# dipeshgurav.com: rules for Claude

Static portfolio site, deployed to Vercel from `main`. This file is excluded from the public site by `.vercelignore`. Rules and facts below were last refreshed from Dipesh's content brief of 22 Oct 2026; his CV (`dipesh-gurav-cv.pdf`, 21 Oct 2026) is the reference for wording.

- Homepage copy lives in `shared.jsx` and `variant-a.jsx`. Edit those, then run `npm run build` to regenerate `shared.js` and `variant-a.js`. Never hand-edit only the compiled files. Babel writes `·` and `–` as escapes (`\xB7`, `–`) in the compiled files, so grep for a plain fragment when checking.
- Case studies are the static `case-*.html` pages. Link to them with clean URLs (`/case-levelup`).
- Work on a branch and check the Vercel preview before merging to `main`. `main` is the live site.
- `cv/dipesh-gurav-cv.html` is an old, unpublished CV source (excluded in `.vercelignore`). It still carries retired claims; never republish it as is.
- **Accessibility:** the site was audited to WCAG 2.2 AA on 23 Oct 2026 (axe-core clean on all nine pages, plus manual keyboard, reflow and contrast checks). Keep it that way: never hide the system cursor (the orange ring is decoration only), keep the skip links and `scroll-padding-top`, keep text at 4.5:1 and UI outlines at 3:1, no ticking or endlessly looping motion, and check new headlines at 320px wide. Re-run axe after layout changes.
- **Colours and themes:** every colour lives in `theme.css` as a variable (light is the default, `html[data-theme="dark"]` is the toggle). Pages and JSX only reference variables (`var(--ink)`, or `rgba(var(--ink-rgb), 0.2)` for tints); never hard-code a hex or rgba value in a page. The accent differs per theme (#BD3F0C light, #E05320 dark) because #E05320 is only 3.9:1 on white. `theme.js` runs the header toggle and remembers the choice; a two-line script at the top of each page applies it before render. Check both themes with axe after any colour change.
- **TaskGPT images:** since 23 Oct 2026 the page shows only `taskgpt-dashboard.webp` (cover, homepage card and link preview `taskgpt-dashboard.jpg`) and `taskgpt-feedback.webp`, both cut from `taskgpt-overview.webp`. The config, report and old cover screens are hidden in an HTML comment on `case-taskgpt.html` while Dipesh revamps them; restore from there.
- **Case page type scale:** each case page ends its `<style>` with a "Type and spacing pass" block (h1 up to 80px, h2 32px, tighter hero). Edit that block rather than the older rules above it. Pages with a Figma prototype also carry a sticky orange "View case study in Figma" button in the nav (`.nav-figma`).
- The contact form posts to a Google Apps Script. Its spam guard lives in `docs/contact-form-apps-script.gs` and must match the form rules in `variant-a.jsx`.

## 2. Hard content rules

1. **11 years** of experience. Never 12, "12+" or "11+".
2. **EvaluateUs: accuracy up 17%.** Just "accuracy", never "accuracy and speed", never 70%, never any £9,500 figure.
3. **LevelUp has no percentage.** No "40% engagement", no "attrition dropped".
4. **Never mention PCAF.**
5. **WCAG 2.2 AA**, never 2.1. Plain "WCAG AA" is fine on older work (YourHour, JEGO).
6. **YourHour:** over a million downloads ("1M+" is fine), 4.6 stars, 70,000+ reviews, 22 languages, 300+ research sessions. Never "millions", never 80,000 reviews.
7. **14 countries belongs to TaskUs; 22 languages belongs to YourHour.** Never blend them. Never "used by millions".
8. **EarlyFoods:** nearly 400 customer survey replies (394 of 500+ sent), sales up 33% within two months (Dipesh, 30 Oct 2026; earlier copy said "in a month"). Never "400 interviews" or "400+ parents". **Never put UAE on EarlyFoods; UAE belongs only to JEGO.**
9. **No years on EarlyFoods or JEGO.** Their real dates fall inside the TaskUs period.
10. **Aatmnirbhar Bharat mark:** an entry to an open MyGov competition (tricolour and Ashok Chakra fused with a golden bird, a nod to *sone ki chidiya*). The competition was never formally decided. The mark was taken up by the PM SVANidhi scheme (micro-credit for street vendors) and used by manufacturers marking Indian-made goods, without credit. Never "no brief", "officially adopted", "overnight", "one night", "by morning" or "national identity" as if it were a commission.
11. **AutoQA in public copy:** never say a senior leader turned a requirements document into a front end with AI, and never say fixes were planned into a version two.
12. **Design system:** he extended and scaled an existing global foundation; he did not build it from scratch. Don't write "I owned it from tokens".
13. **Management:** 0 years of formal line management. He hired and mentored junior and mid-level designers at Mindefy. At TaskUs he was the founding and only designer. No "Team Leadership".
14. **Names:** Manish Pandya (never Pandeya), Bryce Maddock, Yahya Hussain.
15. **No em dashes, no double hyphens** in any text, alt text or meta. Use commas, full stops, colons or semicolons. En dashes in year ranges and the existing → arrows are fine.
16. **No faith or religion claims** about any audience. The JEGO faith points came from an AI conversation, not research; they were removed on 22 Oct 2026. Never reintroduce "Islamic", "secular", "spiritual", "faith", "ritual", "blessings" or anything like them.
17. **Don't invent.** Earlier versions of this site were partly AI-written and picked up details nobody verified. Add no number, place, client type or claim that isn't in section 3. When unsure, cut rather than embellish.
18. **Stories a stranger can picture:** who used it and what changed for them, not stacked jargon.
21. **No full stops in headings, sub headings or short taglines** (Dipesh, 23 Oct 2026). Join fragments with commas, e.g. "TaskGPT, the AI that works inside the call". Body text keeps normal punctuation.
19. **Right to work:** keep it on the website as "Right to work in the UK · No sponsorship required", never "Full" (banner, availability card, meta, noscript, llms.txt). Don't add it anywhere new, and leave it off the CV. (Decided 8 Oct 2026, confirmed 22 Oct.)
20. **The Artist Banda:** he *founded* it. "Co-founded" only ever refers to the earlier production house. **Repos Energy** is the company; **Repos Pay** is the product he worked on. Never describe "a payment and energy mobility ecosystem".

## 3. Verified facts (the only numbers and claims to use)

| Topic | Fact |
|---|---|
| Experience | 11 years in design (counted from 2015) |
| Headline title | Senior Product Designer (LinkedIn and CV). The hero details row keeps "Lead Product Designer", his actual TaskUs title. "est. 2015" was removed and the hero summary opens "Product designer behind…" (Dipesh, 23 Oct 2026). |
| TaskUs | Lead Product Designer, Apr 2021 to Jul 2026, "Remote" (not "Remote, UK"). Founding and only designer of the Digital IT team, hired by Manish Pandya. |
| TaskUs products | Multi-tenant, owned by TaskUs, sold to client companies on subscription. Around 35,000 daily users across 14 countries (the suite, not one product). Around 20 products went live, not counting individual TaskGPT tools. |
| TaskGPT | AI for agents on live calls, across OpenAI, PaLM 2 and LLaMA. Much of it a Chrome extension inside the tool agents already used. A multi-tenant admin where clients were onboarded and each campaign got its own tools, AI model and knowledge base. Kept AI-suggested labels only where they matched the business's own terms. Instrumentation: usage, answer quality and guardrails, token cost, agent feedback. Call-handling time and operational costs each down 20%. Moving it behind an encrypted layer solved the privacy problem and made it 20% faster (kept on the site by Dipesh, 22 Oct 2026). |
| EvaluateUs | AI-scored hiring, coaching and training assessments; one result, three readers (candidate, assessor, manager). Reporting was the real value. Accuracy up 17%. Got its own theme so it could be sold to external clients. |
| LevelUp | Managers set targets, challenges and rewards; agents compete as their own 3D characters (18 fully rigged, Three.js) on live leaderboards. Everyone who takes part wins something. First gamification work at TaskUs, became the company standard, showcased at AWS Summit London 2025. Launched 31 January 2024. |
| AutoQA | Last TaskUs product, automated review of agent calls. First build surfaced insight but didn't help anyone act; he held it to its own goal (flagged agents into training and one-to-ones), wrote a UX review, worked with the SVP, director and dev manager to break fixes into small steps, cut what phase one didn't need to protect a three-month timeline. AI hunted edge cases; his review began where it ran out. |
| Maestro | An AI assistant inside Google Chat. Team leads asked plain questions (who was late on shift, which agent had the most flagged calls) and got a summary, charts and a next action such as booking coaching, instead of logging into several reporting tools. He took it from proof of concept to product and demoed it to clients alongside VPs and directors. Approved for the site 22 Oct 2026; not on the CV or LinkedIn. No numbers (see held back). |
| Design system | Extended the global foundation across around 20 shipped products, adding a TaskGPT component layer and a separate EvaluateUs theme. Mobile and web, 14 countries, WCAG 2.2 AA. "As the only designer, it was the only way to scale myself." |
| AI workflow | Claude connected to Figma, Claude Code, Cursor, Figma Make, v0, Lovable. Explores several directions in parallel and prototypes in code. Time to concept down 60%. |
| Mindefy Technologies | Product Designer, Mar 2017 to Feb 2021, Indore, India (formerly Mind-e-fy Solutions). Intern to sole product designer. Hired and mentored junior and mid-level designers. |
| YourHour | 2018 to 2020, at Mindefy. Sole designer end to end. Awareness and small wins instead of shame. Figures in rule 6. "I'd rather earn a habit than engineer a compulsion." |
| YourSlice | Companion app to YourHour for tracking and managing specific habits, on the same design system. |
| GreenBill | Paperless receipts and invoicing, four apps on one system (shoppers, merchant web point of sale, merchant mobile, admin). Usability testing toolkit caught 85% of issues before development. |
| JEGO | Mindefy client project, UAE. Wellbeing and mentorship video streaming, redesigned right-to-left first for Gulf audiences. Usability satisfaction up 25%. From his own project notes: mentor profiles shown up front so people trust the person behind each course; "Jego Mastery" let mentors set course sequences so people knew where to start. |
| Kidster | Digital school diary (attendance, homework, parent-teacher meetings, notices). Traction but not enough money; focus moved to YourHour. |
| The Artist Banda | Product Design Consultant & Founder, 2015 to 2017 on the website (changed from 2014 by Dipesh, 30 Oct 2026; the CV PDF matches), Bengaluru. He founded it (independent consultancy). Earlier co-ran a production house with college friends: 200+ clients in under three years. |
| EarlyFoods | Food for expecting mothers and young children, founder-led, growing through Instagram reels, Shopify. Analytics and founder said price; heatmaps and nearly 400 survey replies said trust. Rebuilt around sourcing and certification, fixed hidden buttons and age filters, easy reorder. Sales up 33% within two months, confirmed by a follow-up survey. Sits under The Artist Banda. No market stated. |
| Repos Pay | A product of Repos Energy (the company). Credit platform for fuel delivery: pump owners extend credit; businesses apply for and draw it down. Sits under The Artist Banda. |
| ZuQA | API testing tool; progressive disclosure cut developer onboarding time 15%. |
| Job App Assistant | Designed, coded and deployed solo in one session (Node.js, Claude API), 2026. job-app-assistant.onrender.com (sleeps when idle; open it once before checking links). |
| Education | Interaction Design Foundation, UX, UI and Interaction Design, 2015 to 2017. MAAC, AD3D Edge+ Diploma: Design, Animation and VFX, 2012 to 2014. B.Com with Computer Science, 2011 to 2014. |
| Contact | contact@dipeshgurav.com · +44 7352 673152 (UK) · +91 90094 80090 (India, added 23 Oct 2026 at Dipesh's request) · linkedin.com/in/dipeshgurav-design · dribbble.com/dipeshgurav9 (correct; `theartistbanda` 404s on Dribbble, so don't "fix" it) · behance.net/theartistbanda |
| Keywords | Dipesh confirmed on 22 Oct 2026 that he stands behind "A/B Testing", "Experimentation", "Conversion Rate Optimisation", "Digital Health" and "HealthTech" in skills chips and meta. Keep them. |

**Held back, never publish without Dipesh's say-so:** EvaluateUs coaching and training numbers up 38% and knowledge transfer 23% faster; Maestro's 29% and 23%.

## 4. Retired claims (grep list)

Search the whole repo (HTML, JSX, compiled JS, llms.txt, meta, alt text, JSON-LD, noscript). Every hit must be fixed or consciously kept, with the reason given to Dipesh. Hits inside `cv/dipesh-gurav-cv.html` (unpublished) and `README.md` (repo-only) are known and can be ignored.

- `40%`, `engagement lift`, `attrition`
- `PCAF`, `Persona-Centric`
- `2.1` (WCAG)
- `12 years`, `12+`, `11+`
- `70%`, `9,500`, `accuracy and speed`, `Accuracy & speed`
- `400+`, `400 interviews`, `parent interviews`, `80,000`
- `millions`, `used by millions`, `22 countries`
- `no brief`, `No brief`, `Zero brief`, `Briefs received`, `officially adopted`, `Official government adoption`, `national identity`, `overnight`, `One night`, `By morning`
- `Repos Energy`: may appear only as the company behind Repos Pay, never as "a payment and energy mobility ecosystem"
- `Full right to work`
- `Remote, UK`, `Independent Project`, `Pandeya`, `Team Leadership`
- `owned it from tokens`, `co-founded`
- Faith or religion anywhere on the site: `Islam`, `secular`, `spiritual`, `faith`, `ritual`, `blessing`, `civilisational`
- On `case-earlyfoods.html` only: `UAE`
- `insurance claims`, `2020–2025`, `2021` next to YourHour
- Em dash: use your Grep tool (ripgrep) with the pattern `\x{2014}`, or in the terminal `rg -n "\x{2014}" .` (macOS grep has no `-P`, so don't rely on it)
- Double hyphen in prose: Grep tool or `rg -n "\s-{2}\s" -g "*.html" -g "*.jsx" -g "*.txt" .` (ignore CSS custom properties and HTML comments)
