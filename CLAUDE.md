# dipeshgurav.com: rules for Claude

Static portfolio site, deployed to Vercel from `main`. This file is excluded from the public site by `.vercelignore`.

- Homepage copy lives in `shared.jsx` and `variant-a.jsx`. Edit those, then run `npm run build` to regenerate `shared.js` and `variant-a.js`. Never hand-edit only the compiled files.
- Case studies are the static `case-*.html` pages. Link to them with clean URLs (`/case-levelup`).
- Work on a branch and check the Vercel preview before merging to `main`. `main` is the live site.

## 2. Hard content rules

1. **11 years** of experience. Never 12, never "12+", and use "11 years" rather than "11+".
2. **EvaluateUs: accuracy up 17%.** Say "accuracy", not "accuracy and speed". Never 70%. Never mention any £9,500 per month figure.
3. **LevelUp has no engagement figure.** The "40% engagement lift" is not real. Remove it everywhere, along with "attrition dropped" (also unverified).
4. **Never mention PCAF** (the "Persona-Centric Analysis Framework"). Dipesh doesn't recognise it.
5. **WCAG 2.2 AA**, never 2.1. Where a page says just "WCAG AA" for older work (YourHour, JEGO), leaving out the version is fine.
6. **YourHour: over a million downloads** ("1M+" is fine), 22 languages, 4.6 stars, 70,000+ reviews, 300+ research sessions. Never "millions" of anything about Dipesh's reach.
7. **EarlyFoods: nearly 400 customer survey responses** (394 replies from 500+ sent), sales up **33% in a month**. Never "400 interviews", "400+ parents" or "400+ parent interviews".
8. **Aatmnirbhar Bharat mark:** an entry to an **open MyGov competition**. Design: the Indian tricolour and Ashok Chakra fused with a golden bird, a reference to India once being called *sone ki chidiya*. The competition was **never formally decided**. The mark was **taken up by the PM SVANidhi scheme** (a micro-credit scheme for street vendors) and **used by manufacturers marking Indian-made goods, without credit**. Never say "no brief", "zero brief", "officially adopted", "official government adoption" or "national identity" as if it were an official commission. Don't say "one night" or "by morning" unless Dipesh confirms it (see decisions in the fixes file).
9. **No years on EarlyFoods or JEGO.** Their real dates fall inside the TaskUs period, so a year there contradicts the career timeline.
10. **AutoQA on public pages:** don't say a senior leader turned a requirements document into a front end with AI, and don't say fixes were planned into a version two.
11. **Right to work and sponsorship:** keep it on the website (banner, availability card, meta, noscript, llms.txt). Leave it off the CV. (Decided 8 Oct 2026.)
12. **No em dashes. No double hyphens in text.** Use commas, full stops, colons or semicolons. En dashes in year ranges (2023–2024) and the existing → arrows are fine.
13. **Names:** Manish Pandya (never Pandeya), Bryce Maddock, Yahya Hussain.
14. **Management:** Dipesh has **0 years of formal line management**. He **hired and mentored junior and mid-level designers at Mindefy**. Say exactly that. Don't use "Team Leadership" or "Leadership" in a way that implies he managed a team at TaskUs, where he was the only designer.
15. **Don't invent.** Earlier versions of this site were partly AI-written and picked up details nobody verified. Add no number, place, date, client type or claim that isn't in section 3 or 4. When unsure, cut rather than embellish.
16. **No dates after April 2021 on non-TaskUs work.** He joined TaskUs in April 2021. Mindefy and Artist Banda client projects (EarlyFoods, JEGO) carry no years, so nothing reads like moonlighting. EarlyFoods sits under The Artist Banda, JEGO under Mindefy.
17. **UAE belongs to JEGO only.** EarlyFoods has no stated market.
18. **Repos and YourSlice:** leave their copy alone unless Dipesh asks.
19. **Stories a stranger can picture.** Explain work through who used it and what changed for them, not stacked jargon.

## 3. Verified facts (the only numbers to use)

| Topic | Fact |
|---|---|
| Experience | 11 years in design (counted from 2015) |
| TaskUs | Lead Product Designer, Apr 2021 to Jul 2026, location "Remote" (not "Remote, UK") |
| TaskUs role | Founding and only designer of the Digital IT team. Hired by Manish Pandya. |
| TaskUs products | Multi-tenant, owned by TaskUs, sold to client companies on subscription. Around 35,000 daily users across 14 countries (this figure is for the product suite, not TaskGPT alone). Around 20 products went live, not counting individual TaskGPT tools. |
| TaskGPT | Call-handling time down 20%; operational costs down 20%. Moving it behind an encrypted layer solved the privacy problem and made it 20% faster. Models: OpenAI, PaLM 2, LLaMA (already on the site; fine to keep). |
| EvaluateUs | Accuracy up 17% |
| LevelUp | No percentage. Company-wide standard for gamification. Showcased at AWS Summit London 2025. 18 fully rigged 3D characters built in Three.js. Launch date 31 January 2024 is on the current page from Dipesh's own material; fine to keep. |
| Design system | Tokens to shipped components, mobile and web, 14 countries, WCAG 2.2 AA |
| AI workflow | Time to concept down 60%. Tools: Claude, Cursor, Figma Make, v0, Lovable. Claude connected to Figma. |
| YourHour | Over a million downloads, 22 languages, 4.6 stars, 70,000+ reviews, 300+ research sessions. A Mindefy product. Sole designer end to end. |
| EarlyFoods | Nearly 400 survey responses (394 of 500+ sent). Sales up 33% in a month. Shown under The Artist Banda. No year, no market. |
| JEGO | Usability satisfaction up 25%. RTL-first for Gulf audiences. A Mindefy client project. No year. |
| GreenBill | Four apps. Usability testing toolkit caught 85% of issues before development. |
| ZuQA | Developer onboarding time down 15% |
| Production house | Co-founded with college friends; over 200 clients in under three years |
| Mindefy Technologies | Mar 2017 to Feb 2021, Indore, India. Joined as an intern, became sole designer, later hired and mentored designers. |
| The Artist Banda | 2014 to 2017 (decided; drop any "clients to 2022") |
| Contact | contact@dipeshgurav.com · +44 7352 673152 · linkedin.com/in/dipeshgurav-design |
| Dribbble | **dribbble.com/dipeshgurav9** (correct and live; `dribbble.com/theartistbanda` returns 404, so don't "fix" it) |
| Behance | behance.net/theartistbanda |

**Held back until Dipesh confirms:** some EvaluateUs and Maestro figures exist but are not cleared for the site. Don't publish any number not in the table above.

## 6. Retired claims (grep list)

Search the whole repo (HTML, JSX, compiled JS, llms.txt, meta tags, alt text, JSON-LD, noscript) for each of these. Every hit must be fixed or consciously kept, with the reason given to Dipesh.

- `40%`, `40 <` (split stat markup), `engagement lift`, `attrition`
- `PCAF`, `Persona-Centric`
- `2.1` (WCAG)
- `12 years`, `12+`, `11+`
- `70%`, `9,500`
- `400+`, `400 interviews`, `parent interviews`
- `millions`, `used by millions`
- `no brief`, `No brief`, `Zero brief`, `zero brief`, `Briefs received`
- `officially adopted`, `Officially adopted`, `Official government adoption`, `national identity`
- `One night`, `one night`, `By morning`, `1 Night`
- `Repos Energy` (kept on purpose, see rule 18)
- `UAE` on EarlyFoods
- `Remote, UK`
- `Independent Project`
- `Pandeya`
- `Team Leadership`
- Em dash: use your Grep tool (ripgrep) with the pattern `\x{2014}`, or in the terminal `rg -n "\x{2014}" .` (macOS grep has no `-P`, so don't rely on it)
- Double hyphen in prose: Grep tool or `rg -n "\s-{2}\s" -g "*.html" -g "*.jsx" -g "*.txt" .` (ignore CSS custom properties and HTML comments)

