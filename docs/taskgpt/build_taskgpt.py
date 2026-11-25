#!/usr/bin/env python3
"""
Builds the TaskGPT pages from Dipesh's source files.

  case-taskgpt.html              hub
  case-taskgpt-full.html         the full case study, with a heading tree
  case-taskgpt-<name>.html       16 standalone case studies

Sources live outside the repo so Vercel never publishes them:
  ~/Downloads/taskgpt-source/taskgpt-case-study-source-*.md   (the newest is used)
  ~/Downloads/taskgpt-source/taskgpt-hub-copy-*.md
Screens: docs/taskgpt/screens.json (captions, alt text, sizes); the images are in assets/.

After Dipesh exports a fresh copy of either file, put it in that folder and run,
from the repo root:   python3 docs/taskgpt/build_taskgpt.py

The words come from the source files as they are. The only change is the job title:
"Lead Agile UI/UX Designer (product designer)" becomes "Lead Product Designer"
(Dipesh, 23 Nov 2026).
"""
import glob
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.expanduser('~/Downloads/taskgpt-source/')
SITE = 'https://dipeshgurav.com'
# Hero videos, by page: file, size, label, caption, and where to start (brief, 25 Nov 2026). One with
# a "hold" reason is left out, and its page keeps its first image at the top.
VIDEOS = {k: v for k, v in json.load(open(os.path.join(ROOT, 'docs/videos.json'), encoding='utf-8')).items()
          if not v.get('hold')}
TITLE_FROM = 'Lead Agile UI/UX Designer (product designer)'
TITLE_TO = 'Lead Product Designer'
# Dipesh's corrections, swapped here so they survive a fresh export of his Claude Doc; drop each
# one once the doc says the same. 23 Nov 2026: the hub's Outcome said "20%" three times. 24 Nov 2026:
# adoption after the commercial revamp rose 12%, not 20% (call-handling time and operational costs
# each fell 20%). For a day the site said "client onboarding" instead of adoption; that was wrong.
# His own wording is kept and only the number changes. Order matters: the hub's whole sentence first.
COPY_SWAPS = [
    ('All 11 products and 7 extensions went live. Call-handling time fell 20%, operating costs fell 20%, '
     'and after the commercial revamp, adoption rose by an average of 20%.',
     'All 11 products and 7 extensions went live, with call-handling time and operational costs each '
     'coming down 20%. After the commercial revamp, adoption rose by an average of 12%.'),
    ('after the commercial revamp, adoption rose by an average of 20%.',
     'after the commercial revamp, adoption rose by an average of 12%.'),
    ('After that revamp, adoption rose by an average of 20%.',
     'After that revamp, adoption rose by an average of 12%.'),
    ('After that revamp, adoption across the renamed products rose by an average of 20%.',
     'After that revamp, adoption across the renamed products rose by an average of 12%.'),
]

# What each product is, in the general words a reader might look for, since nobody outside
# TaskUs knows our names for them (Dipesh, 23 Nov 2026). Each is drawn from that product's own
# hub line, adds no claim, and shows in the product tree, on the hub cards and under each title.
# Short labels, so no full stops (rule 21).
DESCRIPTORS = {
    'assistai': 'Knowledge chatbot for agents',
    'authorai': 'AI writing assistant',
    'document-search': 'Questions across long documents',
    'home': 'One door to every product',
    'dashboard': 'AI usage, quality and cost',
    'observability': 'Trace every AI answer',
    'reports': 'View and download the data',
    'chatbotify': 'Build a chatbot without code',
    'knowledgebase': 'Edit the answers chatbots use',
    'agentic-ai': 'Build your own AI agent',
    'bcp': 'Switch to a backup AI engine',
    'translatebuddy': 'Translate replies in Zendesk',
    'shield': 'Wellbeing for content moderators',
    'shield-copilot': 'AI help for policy reviews',
    'deepfake-detection': 'Spot fake images',
    'productivity-tracker': 'Track sessions, breaks and tasks',
}

# The opening paragraph of each page is set as a statement (case-lead.css, Dipesh, 23 Nov 2026:
# character from the design, never new words). For each page: the phrases set in Fraunces italic,
# then the one phrase that gets the hand-drawn line. Every phrase is copied from that paragraph;
# if the source changes and a phrase is gone, the build says so and leaves it plain.
LEDE_MARKS = {
    'hub': (['live customer calls', 'All 11 products and 7 Chrome extensions'], 'the only designer'),
    'full': (['All 11 products and 7 Chrome extensions', 'around 35,000 people a day'], 'the only designer'),
    'assistai': (['the way they ask ChatGPT'], 'own knowledge base'),
    'authorai': (['almost any website'], 'One-click'),
    'document-search': (['more than 50 long client documents', 'reasoning and citation'], 'One question'),
    'home': (['One front door', 'not a control panel'], 'I pitched it'),
    'dashboard': (['Eight groups of KPIs', 'sold TaskGPT most'], 'client trust'),
    'observability': (['the evidence behind each answer'], '16 steps'),
    'reports': (['the rows behind the numbers'], 'One form'),
    'chatbotify': (['without code', 'about a day'], 'minutes'),
    'knowledgebase': (['write and version'], 'like GitHub'),
    'agentic-ai': (['chain of thought', 'live preview'], 'Anyone'),
    'bcp': (['a backup engine', 'every screen says so'], 'one action'),
    'translatebuddy': (['detects the language and prepares the reply'], 'review, edit and send'),
    'shield': (['content moderators'], 'six clear tools'),
    'shield-copilot': (['explains why'], 'every review'),
    'deepfake-detection': (['fake claim calls and fake articles'], 'a score'),
    'productivity-tracker': (['Sessions, breaks and time on each task'], 'the first campaign'),
}
# The hand-drawn line, the same one as under "human" on the homepage (AScribble in variant-a.jsx)
SCRIBBLE = ('<svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
            '<path d="M4 15 C 52 6, 98 20, 150 12 S 246 5, 296 13" pathLength="1" fill="none" '
            'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>')


def statement(h, key):
    """Wrap the page's chosen phrases in an already-rendered opening paragraph. Words unchanged."""
    figs, mark = LEDE_MARKS.get(key, ([], None))
    for f in figs + ([mark] if mark else []):
        e = esc(f)
        if h.count(e) != 1:
            print(f'  note: "{f}" is not in the {key} opening exactly once, so it stays plain')
            continue
        if f == mark:
            h = h.replace(e, f'<span class="fig mark">{e}{SCRIBBLE}</span>', 1)
        else:
            h = h.replace(e, f'<span class="fig">{e}</span>', 1)
    return h


def newest(pattern):
    files = sorted(glob.glob(os.path.join(SRC, pattern)), key=os.path.getmtime)
    if not files:
        sys.exit(f'No file matching {pattern} in {SRC}')
    return files[-1]


# ─── Text helpers ────────────────────────────────────────────────────────────

def esc(s):
    return html.escape(s, quote=False)


def attr(s):
    return html.escape(s, quote=True)


def clean_href(u):
    if u.startswith('http') or u.startswith('#') or u.startswith('mailto:'):
        return u
    u = re.sub(r'\.html(?=$|#)', '', u)
    return '/' + u.lstrip('/')


def inline(s):
    """Markdown inline: links, bold, italic. Escapes everything else."""
    s = esc(s)

    def link(m):
        text, url = m.group(1), html.unescape(m.group(2))
        if url.startswith('http'):
            return (f'<a href="{attr(url)}" target="_blank" rel="noopener noreferrer">{text}'
                    f'<span class="sr-only"> (opens in a new tab)</span></a>')
        return f'<a href="{attr(clean_href(url))}">{text}</a>'

    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\*\w])\*(?!\s)(.+?)(?<!\s)\*(?![\*\w])', r'<em>\1</em>', s)
    return s


def slug(text):
    """Heading id: drop a leading number, cut at the first colon, drop brackets."""
    t = re.sub(r'^\d+\.\s*', '', text)
    t = t.split(':')[0]
    t = re.sub(r'\([^)]*\)', '', t)
    return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')


def plain(md):
    """Markdown to plain text, for meta tags and labels."""
    t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', md)
    return re.sub(r'\*+', '', t).strip()


# ─── Markdown blocks ─────────────────────────────────────────────────────────

BLOCK_START = re.compile(r'^(#{1,6}\s|\||- |\d+\. )')


def parse(md):
    lines = md.split('\n')
    blocks, i = [], 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        m = re.match(r'^(#{1,6})\s+(.*)$', line)
        if m:
            blocks.append({'t': 'h', 'level': len(m.group(1)), 'text': m.group(2).strip()})
            i += 1
            continue
        if line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i += 1
            rows = [r for r in rows if not all(re.fullmatch(r':?-{3,}:?', c) for c in r)]
            blocks.append({'t': 'table', 'head': rows[0], 'rows': rows[1:]})
            continue
        if line.startswith('- '):
            items = []
            while i < len(lines) and lines[i].startswith('- '):
                items.append(lines[i][2:].strip())
                i += 1
            blocks.append({'t': 'ul', 'items': items})
            continue
        if re.match(r'^\d+\. ', line):
            items = []
            while i < len(lines) and re.match(r'^\d+\. ', lines[i]):
                items.append(re.sub(r'^\d+\.\s+', '', lines[i]).strip())
                i += 1
            blocks.append({'t': 'ol', 'items': items})
            continue
        buf = [line.strip()]
        i += 1
        while i < len(lines) and lines[i].strip() and not BLOCK_START.match(lines[i]):
            buf.append(lines[i].strip())
            i += 1
        blocks.append({'t': 'p', 'text': ' '.join(buf)})
    return blocks


def is_label(b):
    """A paragraph that is only a bold label, such as **What I designed**."""
    return b['t'] == 'p' and re.fullmatch(r'\*\*[^*]+\*\*', b['text']) is not None


def label_text(b):
    return b['text'].strip('*').rstrip('.')


def inline_label(b):
    """**The story.** It began ... → ('The story', 'It began ...')"""
    if b['t'] != 'p':
        return None
    m = re.match(r'^\*\*([^*]+?)\.\*\*\s+(.*)$', b['text'])
    return (m.group(1), m.group(2)) if m else None


def is_loop(b):
    return b['t'] == 'p' and b['text'].startswith('[LOOP DIAGRAM')


def table_html(head, rows, label):
    cols = len(head)
    out = [f'<div class="table-wrap" role="region" aria-label="{attr(label)}">',
           f'<table class="cols-{cols}"><thead><tr>']
    out += [f'<th scope="col">{inline(h)}</th>' for h in head]
    out.append('</tr></thead><tbody>')
    for r in rows:
        out.append('<tr>' + f'<th scope="row">{inline(r[0])}</th>' +
                   ''.join(f'<td>{inline(c)}</td>' for c in r[1:]) + '</tr>')
    out.append('</tbody></table></div>')
    return ''.join(out)


def list_html(b):
    tag = b['t']
    return f'<{tag}>' + ''.join(f'<li>{inline(x)}</li>' for x in b['items']) + f'</{tag}>'


# ─── Shared pieces ───────────────────────────────────────────────────────────

FONTS = ('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300;1,400'
         '&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap')

THEME_TOGGLE = '''<button type="button" class="theme-toggle" data-theme-toggle>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>
        <span class="sr-only label-to-dark">Switch to dark theme</span><span class="sr-only label-to-light">Switch to light theme</span>
      </button>'''


def page(path, title, desc, og_img, label, body, *, part_of=False, progress=False, skip='#main', extra_before_main=''):
    video_js = '\n<script src="/case-video.js" defer></script>' if 'class="shot case-video' in body else ''
    assert len(desc) <= 160, f'{path}: description is {len(desc)} characters'
    for s in (title, desc):
        assert '\u2014' not in s and ' -- ' not in s
    url = SITE + path
    ld = {
        '@context': 'https://schema.org', '@type': 'CreativeWork', 'name': title.split(' | ')[0],
        'description': desc, 'url': url, 'image': SITE + og_img,
        'author': {'@type': 'Person', 'name': 'Dipesh Gurav', 'url': SITE, 'jobTitle': TITLE_TO},
        'creator': {'@type': 'Person', 'name': 'Dipesh Gurav'},
    }
    if part_of:
        ld['isPartOf'] = {'@type': 'CreativeWork', 'name': 'TaskGPT', 'url': SITE + '/case-taskgpt-full'}
    bar = '<span class="progress" aria-hidden="true"><span></span></span>' if progress else ''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{attr(desc)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{attr(title)}">
<meta property="og:description" content="{attr(desc)}">
<meta property="og:image" content="{SITE}{og_img}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{attr(title)}">
<meta name="twitter:description" content="{attr(desc)}">
<meta name="twitter:image" content="{SITE}{og_img}">
<link rel="canonical" href="{url}">
<script type="application/ld+json">
{json.dumps(ld, indent=2, ensure_ascii=False)}
</script>
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel="stylesheet">
<script>document.documentElement.classList.add('js');(function(d,t){{try{{t=localStorage.getItem('theme')}}catch(e){{}}if(t!=='dark'&&t!=='light')t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.setAttribute('data-theme',t)}})(document.documentElement)</script>
<link rel="stylesheet" href="/theme.css">
<link rel="stylesheet" href="/case-taskgpt.css">
<link rel="stylesheet" href="/case-lead.css">
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->
<a href="{skip}" class="skip-link">Skip to content</a>

<nav class="site-nav">
  <div>
    <a href="/" class="back">← Portfolio</a>
    <span class="mono nav-label"><span class="dot" aria-hidden="true">●</span> {esc(label)}</span>
    <div class="nav-right">
      {THEME_TOGGLE}
      <a href="/about#contact" class="back">Contact →</a>
    </div>
  </div>
  {bar}
</nav>
{extra_before_main}
<main id="main" tabindex="-1">
{body}
</main>
<footer>
  © MMXXVI · Dipesh Gurav · Nottingham, UK · Designed with purpose, not just pixels · <a href="mailto:contact@dipeshgurav.com">contact@dipeshgurav.com</a> · <a href="tel:+447352673152">+44 7352 673152</a> · <a href="tel:+919009480090">+91 90094 80090</a>
</footer>

<script src="/theme.js" defer></script>
<script src="/case-nav.js" defer></script>
<script src="/case-reader.js" defer></script>
<script src="/case-lead.js" defer></script>{video_js}
</body>
</html>
'''


# The bottom links follow the homepage's order (Dipesh, 25 Nov 2026), see CLAUDE.md
NEXT_CASE = '''<section class="next">
  <div class="wrap">
    <div class="mono next-label">Next case study</div>
    <a href="/case-yourhour">
      <span class="nt">YourHour: <i>breaking digital addiction, compassionately</i></span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>'''


def picture(f, alt, w, h, eager=False):
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<picture><source type="image/webp" srcset="/assets/{f}.webp">'
            f'<img src="/assets/{f}.jpg" alt="{attr(alt)}" width="{w}" height="{h}" {load} decoding="async"></picture>')


def case_video(key):
    """A hero video (brief, 25 Nov 2026): a silent loop in the place of the page's first image. No
    autoplay attribute: case-video.js starts it when motion is allowed and it is on screen."""
    v = VIDEOS[key]
    start = f' data-start="{v["start"]}"' if v.get('start') else ''
    left = ' is-left' if v.get('corner') == 'left' else ''   # the Pause button goes in the clip's empty corner
    return (f'<figure class="shot case-video{left}" data-label="{attr(v["label"])}"{start}><div class="frame case-video-frame">'
            f'<video muted loop playsinline preload="metadata" width="{v["w"]}" height="{v["h"]}" '
            f'poster="/assets/{v["file"]}-poster.webp" aria-label="{attr(v["label"])}">'
            f'<source src="/assets/{v["file"]}.mp4" type="video/mp4"></video>'
            f'<button type="button" class="case-video-toggle">Play</button></div>'
            f'<figcaption>{esc(v["caption"])}</figcaption></figure>')


def placeholder(s, caption=True):
    """A held-back screen (see "hold" in screens.json): a labelled box, never a broken image."""
    shape = 'tall' if s['h'] / s['w'] > 0.9 else 'wide'
    cap = f'<figcaption>{esc(s["caption"])}</figcaption>' if caption else ''
    return (f'<figure class="shot ph ph-{shape}"><div class="frame"><p class="ph-text">Screen coming soon</p></div>{cap}</figure>')


def shot(s, eager=False, caption=True):
    if s.get('hold'):
        return placeholder(s, caption)
    tall = s['h'] / s['w'] > 0.9
    cap = f'<figcaption>{esc(s["caption"])}</figcaption>' if caption else ''
    return (f'<figure class="shot{" tall" if tall else ""}"><div class="frame">'
            f'{picture(s["file"], s["alt"], s["w"], s["h"], eager)}</div>{cap}</figure>')


# ─── The loop diagram (build brief, section 5) ───────────────────────────────

LOOP_TITLE = 'Every query feeds the next fix: set up, use, measure, improve'
LOOP_BOXES = [
    ('setup', 'Set up', 'Admins and knowledge owners',
     ['Chatbotify: bot, model, masking', 'KB Utility: versioned articles', 'Agentic AI: agents, tools, connectors']),
    ('use', 'Use', 'Agents on calls, chats and tickets',
     ['Home Page: every product and instance', 'AssistAI: answers from the client KB', 'AuthorAI, Document Search, 7 extensions']),
    ('measure', 'Measure', 'Managers, operations managers, AI ops',
     ['TaskGPT Dashboard: use, quality, cost', 'Observability: every step of a query', 'Reports: rows to view and export']),
    ('improve', 'Improve', 'Reviewers and knowledge owners',
     ['Review: is the answer acceptable?', 'Knowledge gaps listed as real queries', 'Owners publish a new KB version']),
]
LOOP_ARROWS = [('a1', '→', 'goes live'), ('a2', '↓', 'every query logged'),
               ('a3', '←', 'gaps, failures'), ('a4', '↑', 'fixes published')]


def loop_html():
    def line(t):
        if ':' in t:
            name, rest = t.split(':', 1)
            return f'<li><strong>{esc(name)}</strong>:{esc(rest)}</li>'
        return f'<li>{esc(t)}</li>'

    parts = []
    for (key, name, who, lines), (akey, glyph, text) in zip(LOOP_BOXES, LOOP_ARROWS):
        centre = ' is-centre' if key == 'measure' else ''
        parts.append(f'<div class="loop-box lb-{key}{centre}"><p class="loop-name">{name}</p>'
                     f'<p class="loop-who">{esc(who)}</p><ul>{"".join(line(l) for l in lines)}</ul></div>')
        back = '<span class="loop-back">back to Set up</span>' if akey == 'a4' else ''
        parts.append(f'<div class="loop-arrow la-{akey}"><span class="glyph" aria-hidden="true">'
                     f'<span class="g-wide">{glyph}</span><span class="g-narrow">↓</span></span>'
                     f'<span class="loop-label">{esc(text)}</span>{back}</div>')
    band = ('<div class="loop-band"><p class="loop-name">Protect, under every step</p>'
            '<p>PII masking, guardrails in and out, sensitive-information check, BCP backup engine, roles</p></div>')
    return (f'<div class="loop" role="figure" aria-label="{attr(LOOP_TITLE)}">'
            f'<p class="loop-title">{esc(LOOP_TITLE)}</p><div class="loop-grid">{"".join(parts)}{band}</div></div>')


# ─── Pages and their order (hub order is also previous and next order) ───────

PAGES = [
    # slug, standalone name, kind, id in the full case study
    ('assistai', 'AssistAI', 'product', 'assistai'),
    ('authorai', 'AuthorAI', 'product', 'authorai'),
    ('document-search', 'Document Search', 'product', 'document-search'),
    ('home', 'Home Page', 'product', 'home-page'),
    ('dashboard', 'TaskGPT Dashboard', 'product', 'taskgpt-dashboard'),
    ('observability', 'Observability', 'product', 'observability'),
    ('reports', 'Reports', 'product', 'reports'),
    ('chatbotify', 'Chatbotify', 'product', 'chatbotify'),
    ('knowledgebase', 'KnowledgeBase Utility', 'product', 'knowledgebase-utility'),
    ('agentic-ai', 'Agentic AI', 'product', 'agentic-ai'),
    ('bcp', 'BCP (Business Continuity Plan)', 'product', 'bcp'),
    ('translatebuddy', 'TranslateBuddy', 'extension', 'translatebuddy'),
    ('shield', 'Shield', 'extension', 'shield'),
    ('shield-copilot', 'Shield Co-Pilot', 'extension', 'shield-co-pilot'),
    ('deepfake-detection', 'Deepfake Detection', 'extension', 'deepfake-detection'),
    ('productivity-tracker', 'Productivity Tracker', 'extension', 'productivity-tracker'),
]
OWN_PAGE = {sec: (sl, name) for sl, name, _, sec in PAGES}
OWN_PAGE['taskscribe-and-authorai'] = ('authorai', 'AuthorAI')
EXT_LEADINS = ['TranslateBuddy', 'TaskScribe and AuthorAI', 'Shield Co-Pilot', 'Shield',
               'Deepfake Detection', 'Productivity Tracker']
EXT_ROW = {'translatebuddy': 'TranslateBuddy', 'shield': 'Shield', 'shield-copilot': 'Shield Co-Pilot',
           'deepfake-detection': 'Deepfake Detection', 'productivity-tracker': 'Productivity Tracker'}
EXT_DECISIONS = {
    'Go to the work': {'translatebuddy', 'shield', 'shield-copilot', 'deepfake-detection', 'productivity-tracker'},
    'Protect the people who see the worst content': {'shield', 'shield-copilot'},
    'Show confidence': {'translatebuddy', 'deepfake-detection'},
    'Ask the person to confirm': {'shield-copilot', 'translatebuddy', 'deepfake-detection'},
}
SHIELD_CAPTION = ("The developers' build put every tool behind rows of tab buttons on one cramped screen. "
                  "I turned it into six cards, with a screen for each tool.")
# Card thumbnails on the hub: the redesign, not the 'before' build
THUMB = {'shield': 1, 'productivity-tracker': 1}
# The top of the dashboard overview: the page cover, hub cover, hub card and link preview
DASH_CROP = {'file': 'taskgpt-hub-cover', 'w': 1600, 'h': 684, 'caption': 'Dashboard overview',
             'alt': 'TaskGPT dashboard overview for AssistAI, with campaign, line of business and site filters, '
                    'and KPI cards for users, engagement, responses, guardrails and sessions.'}


def card_thumb(sl, screens):
    if sl == 'dashboard':
        return DASH_CROP
    shots = screens[sl]
    order = [THUMB.get(sl, 0)] + [i for i in range(len(shots)) if i != THUMB.get(sl, 0)]
    return next((shots[i] for i in order if not shots[i].get('hold')), None)
CHIPS = [TITLE_TO, 'Only designer', 'TaskUs', '2022 to 2025', 'Live']


def own_link(sl, name):
    return (f'<p class="own-page"><a href="/case-taskgpt-{sl}">Read this as its own case study'
            f'<span class="sr-only">: {esc(name)}</span> <span aria-hidden="true">→</span></a></p>')


def crossrefs(h, full=False):
    """Point 'section 12' and 'One real moment' at the full case study."""
    base = '' if full else '/case-taskgpt-full'
    h = re.sub(r'\b([Ss]ection 12)\b', rf'<a href="{base}#chrome-extensions">\1</a>', h)
    h = h.replace('see "One real moment" in Part 1',
                  f'see <a href="{base}#one-real-moment">"One real moment"</a> in Part 1')
    return h


# ─── Full case study ─────────────────────────────────────────────────────────

def build_full(blocks, screens):
    title = next(b['text'] for b in blocks if b['t'] == 'h' and b['level'] == 1)
    body_blocks = [b for b in blocks if not (b['t'] == 'h' and b['level'] == 1)
                   and not (b['t'] == 'p' and b['text'].startswith('Source text for'))]

    out, toc, sections = [], [], {}
    ids = set()
    cur = {'h2': None, 'h3': None, 'h4': None}
    pending = None          # standalone link to add when the current section ends
    collect = None          # id whose blocks we are collecting for the standalone pages
    in_ext = False          # inside section 12
    table_no = {}
    first_p = True          # the opening paragraph is set as a statement
    shots_q = []            # this product's screens still to place (Dipesh, 23 Nov 2026: in the story)
    shot_placed = False
    used = set()

    def start_shots(sl):
        nonlocal shots_q, shot_placed
        shots_q, shot_placed = [], False
        if sl not in used:
            used.add(sl)
            shots_q = list(screens.get(sl, []))

    def flush():
        nonlocal pending, shots_q
        # The rest of this product's screens close its section, before the link to its own page
        out.extend(shot(x) for x in shots_q)
        shots_q = []
        if pending:
            out.append(own_link(*pending))
            pending = None

    def add_id(i):
        assert i not in ids, f'duplicate id {i}'
        ids.add(i)
        return i

    for b in body_blocks:
        if b['t'] == 'h':
            flush()
            text = b['text']
            if b['level'] == 2:
                i = add_id(slug(text))
                num, _, rest = text.partition(':')
                out.append(f'<h2 id="{i}" class="part"><span class="part-num">{esc(num)}</span> '
                           f'<span class="part-title">{inline(rest.strip())}</span></h2>')
                toc.append({'id': i, 'num': num, 'text': rest.strip(), 'label': rest.strip(), 'kids': []})
                cur.update(h2=i, h3=None, h4=None)
                collect, in_ext = None, False
            elif b['level'] == 3:
                i = add_id(slug(text))
                m = re.match(r'^(\d+)\.\s*(.*)$', text)
                num = f'{int(m.group(1)):02d}' if m else ''
                name = m.group(2) if m else text
                numhtml = f'<span class="num">{num}</span> ' if num else ''
                out.append(f'<h3 id="{i}">{numhtml}{inline(name)}</h3>')
                toc[-1]['kids'].append({'id': i, 'num': num, 'text': name, 'label': name, 'kids': []})
                cur.update(h3=i, h4=None)
                collect = i
                sections[i] = []
                in_ext = (i == 'chrome-extensions')
                if i in OWN_PAGE:
                    pending = OWN_PAGE[i]
                    start_shots(pending[0])
            continue

        # Section 12: a bold lead-in such as **TranslateBuddy.** becomes an h4
        if in_ext:
            lead = inline_label(b)
            if lead and lead[0] in EXT_LEADINS:
                flush()
                i = add_id(slug(lead[0]))
                out.append(f'<h4 id="{i}">{esc(lead[0])}</h4>')
                toc[-1]['kids'][-1]['kids'].append({'id': i, 'num': '', 'text': lead[0], 'label': lead[0], 'kids': []})
                cur['h4'] = i
                collect = i
                sections[i] = [{'t': 'p', 'text': lead[1]}]
                pending = OWN_PAGE.get(i)
                if pending:
                    start_shots(pending[0])
                out.append(f'<p>{crossrefs(inline(lead[1]), True)}</p>')
                continue
            if cur['h4'] and is_label(b):
                # the shared design decisions after the last extension belong to section 12
                flush()
                cur['h4'] = None
                collect = 'chrome-extensions'

        if collect:
            sections[collect].append(b)

        # A product's first screen goes in before its first labelled part (usually What I designed)
        if is_label(b) and shots_q and not shot_placed:
            out.append(shot(shots_q.pop(0)))
            shot_placed = True

        if is_loop(b):
            out.append(loop_html())
        elif b['t'] == 'p' and first_p and not is_label(b):
            first_p = False
            out.append(f'<p class="lede statement">{statement(crossrefs(inline(b["text"]), True), "full")}</p>')
        elif b['t'] == 'p':
            cls = ' class="label"' if is_label(b) else ''
            text = label_text(b) if is_label(b) else b['text']
            out.append(f'<p{cls}>{crossrefs(inline(text), True)}</p>')
        elif b['t'] in ('ul', 'ol'):
            out.append(crossrefs(list_html(b), True))
        elif b['t'] == 'table':
            where = cur['h4'] or cur['h3'] or cur['h2']
            table_no[where] = table_no.get(where, 0) + 1
            heading = next(n['label'] for n in walk(toc) if n['id'] == where)
            out.append(table_html(b['head'], b['rows'], f'{heading}, table {table_no[where]}'))
    flush()
    return title, out, toc, sections


def walk(nodes):
    for n in nodes:
        yield n
        yield from walk(n['kids'])


def toc_html(nodes, depth=1):
    items = []
    for n in nodes:
        num = f'<span class="toc-num">{esc(n["num"])}</span> ' if n['num'] else ''
        kind = DESCRIPTORS.get(OWN_PAGE[n['id']][0]) if n['id'] in OWN_PAGE else None
        kind = f'<span class="toc-desc">{esc(kind)}</span>' if kind else ''
        link = (f'<a href="#{n["id"]}" data-label="{attr(plain(n["label"]))}">'
                f'<span class="toc-name">{num}{esc(plain(n["text"]))}</span>{kind}</a>')
        if n['kids']:
            gid = f'toc-g-{n["id"]}'
            twist = (f'<button type="button" class="toc-twist" aria-expanded="true" aria-controls="{gid}" hidden>'
                     f'<span class="sr-only">Sections in {esc(plain(n["text"]))}</span></button>')
            items.append(f'<li class="toc-l{depth} has-kids"><div class="toc-row">{link}{twist}</div>'
                         f'<ol id="{gid}">{toc_html(n["kids"], depth + 1)}</ol></li>')
        else:
            items.append(f'<li class="toc-l{depth}"><div class="toc-row">{link}</div></li>')
    return ''.join(items)


def full_page(title, out, toc):
    name, _, rest = title.partition(':')
    h1 = f'{esc(name)}: {esc(rest.strip())}'.replace('inside the call', '<i>inside the call</i>')
    bar = ('<div class="reader-bar"><button type="button" class="toc-open" aria-expanded="false" aria-controls="toc">'
           '<span class="toc-open-icon" aria-hidden="true"></span>Contents</button>'
           '<span class="reader-current" id="reader-current"></span></div>')
    body = f'''<div class="wrap">
<div class="reader">
  <div class="toc-backdrop" hidden></div>
  <nav class="toc" id="toc" aria-label="Case study contents">
    <div class="toc-top"><span class="mono">Contents</span><button type="button" class="toc-close">Close<span class="sr-only"> contents</span></button></div>
    <ol class="toc-list">{toc_html(toc)}</ol>
  </nav>
  <article class="doc" id="content" tabindex="-1">
    <!-- No link back to the overview page above the title (Dipesh, 25 Nov 2026) -->
    <h1>{h1}</h1>
    <p class="readtime">About 35 minutes to read</p>
    <div class="doc-cover">{shot(DASH_CROP, True)}</div>
    {"".join(out)}
    <!-- The end of the read goes to the contact form (Dipesh, 24 Nov 2026; it went back to the hub) -->
    <div class="doc-end"><a class="btn btn-primary wipe" href="/about#contact">Get in touch <span aria-hidden="true">→</span></a></div>
  </article>
</div>
</div>
{NEXT_CASE}'''
    desc = ('The full TaskGPT case study: an enterprise AI suite for agents on live customer calls, '
            'from research to developer handover. By Dipesh Gurav.')
    return page('/case-taskgpt-full', 'TaskGPT · Full Case Study | Dipesh Gurav', desc,
                '/assets/taskgpt-hub-og.jpg', 'TaskGPT · Full case study', body,
                part_of=True, progress=True, skip='#content', extra_before_main=bar)


# ─── Hub ─────────────────────────────────────────────────────────────────────

CARD_RE = re.compile(r'^\*\*(.+?)\.\*\*\s+(.*?)\s*\[Read the case study →\]\(([^)]+)\)\s*$')


def hub_sections(blocks):
    secs, cur = [], None
    for b in blocks:
        if b['t'] == 'h' and b['level'] == 2:
            cur = {'title': b['text'], 'blocks': []}
            secs.append(cur)
        elif cur is not None:
            cur['blocks'].append(b)
    return secs


def hub_cards(secs):
    cards = {}
    for s in secs:
        for b in s['blocks']:
            m = CARD_RE.match(b['text']) if b['t'] == 'p' else None
            if m:
                sl = clean_href(m.group(3)).replace('/case-taskgpt-', '')
                cards[sl] = {'name': m.group(1), 'desc': m.group(2), 'slug': sl}
    return cards


def hub_groups(secs):
    """The hub's product groups in order: Use, Measure, Set up, Protect, then Chrome extensions."""
    groups = []
    for s in secs:
        title = re.sub(r'\s*\(id="[^"]+"\)$', '', s['title'])
        cur = None
        for b in s['blocks']:
            if b['t'] == 'h' and b['level'] == 3:
                cur = (b['text'], [])
                groups.append(cur)
                continue
            m = CARD_RE.match(b['text']) if b['t'] == 'p' else None
            if m:
                if cur is None:
                    cur = (title, [])
                    groups.append(cur)
                cur[1].append(clean_href(m.group(3)).replace('/case-taskgpt-', ''))
    return groups


def product_tree(groups, current, page_toc):
    """The tree on a product page: the full case study, then every product in its group with what
    it is in plain words. No link to the overview page (Dipesh, 25 Nov 2026). The current one is marked and lists its own parts."""
    names = {p[0]: p[1] for p in PAGES}
    items = ['<li class="toc-l1 toc-page"><div class="toc-row"><a href="/case-taskgpt-full">The full case study</a></div></li>']
    for title, slugs in groups:
        kids = []
        for sl in slugs:
            here = sl == current
            link = (f'<a href="/case-taskgpt-{sl}"{" aria-current=" + chr(34) + "page" + chr(34) if here else ""}>'
                    f'<span class="toc-name">{esc(names[sl])}</span><span class="toc-desc">{esc(DESCRIPTORS[sl])}</span></a>')
            sub = ''
            if here and page_toc:
                sub = '<ol>' + ''.join(f'<li class="toc-l3"><div class="toc-row"><a href="#{i}" data-label="{attr(t)}">{esc(t)}</a></div></li>'
                                       for i, t in page_toc) + '</ol>'
            kids.append(f'<li class="toc-l2{" is-here" if here else ""}"><div class="toc-row">{link}</div>{sub}</li>')
        items.append(f'<li class="toc-l1 toc-grouped"><div class="toc-row"><span class="toc-group">{esc(title)}</span></div>'
                     f'<ol>{"".join(kids)}</ol></li>')
    return ''.join(items)


def build_hub(secs, screens):
    hero = secs[0]['blocks']
    title = re.fullmatch(r'\*\*(.+)\*\*', hero[0]['text']).group(1)
    sub = hero[1]['text']
    stats = next(b for b in hero if b['t'] == 'table')
    name, _, rest = title.partition(':')
    h1 = f'{esc(name)}: {esc(rest.strip())}'.replace('inside the call', '<i>inside the call</i>')
    stat_cells = ''.join(f'<div class="stat"><div class="n">{esc(v)}</div><div class="mono">{esc(l)}</div></div>'
                         for v, l in zip(stats['head'], stats['rows'][0]))
    cover = {'file': 'taskgpt-hub-cover', 'w': 1600, 'h': 684,
             'alt': 'TaskGPT dashboard overview for AssistAI, with campaign, line of business and site filters, '
                    'and KPI cards for users, engagement, responses, guardrails and sessions.'}
    out = [f'''<section class="hero">
  <div class="wrap">
    <div class="meta">
      <div>Type / <span>Case Study</span></div>
      <div>Year / <span>2022–2025</span></div>
      <div>Role / <span>{TITLE_TO}</span></div>
      <div>Context / <span>Enterprise AI · 14 Countries</span></div>
    </div>
    <h1>{h1}</h1>
    <p class="lede statement">{statement(inline(sub), 'hub')}</p>
    <div class="hero-cta">
      <a class="btn btn-primary wipe" href="/case-taskgpt-full">Read the full case study <span aria-hidden="true">→</span></a>
      <a class="btn btn-outline" href="#products">See the products <span aria-hidden="true">↓</span></a>
    </div>
    <p class="cta-note">About 35 minutes to read</p>
    <div class="cover cover-shot">{picture(cover["file"], cover["alt"], cover["w"], cover["h"], eager=True)}</div>
    <div class="stats stats-5">{stat_cells}</div>
  </div>
</section>''']

    for s in secs[1:]:
        m = re.match(r'^(.*?)\s*\(id="([^"]+)"\)$', s['title'])
        h2, sid = (m.group(1), m.group(2)) if m else (s['title'], None)
        idattr = f' id="{sid}"' if sid else ''
        parts, cards, card_level = [], [], 'h3'

        def end_cards():
            if cards:
                parts.append('<ul class="cards" role="list">' + ''.join(cards) + '</ul>')
                cards.clear()

        for b in s['blocks']:
            if b['t'] == 'h' and b['level'] == 3:
                end_cards()
                parts.append(f'<h3 class="group-title">{esc(b["text"])}</h3>')
                card_level = 'h4'
                continue
            cm = CARD_RE.match(b['text']) if b['t'] == 'p' else None
            if cm:
                sl = clean_href(cm.group(3)).replace('/case-taskgpt-', '')
                thumb = card_thumb(sl, screens)
                if thumb:
                    th = (f'<div class="thumb"><img src="/assets/{thumb["file"]}.webp" alt="" '
                          f'width="{thumb["w"]}" height="{thumb["h"]}" loading="lazy" decoding="async"></div>')
                else:
                    th = '<div class="thumb thumb-ph"><span>Screens coming soon</span></div>'
                cards.append(f'<li class="card">{th}'
                             f'<{card_level}>{esc(cm.group(1))}</{card_level}><p class="kind">{esc(DESCRIPTORS[sl])}</p><p>{inline(cm.group(2))}</p>'
                             f'<a class="more" href="/case-taskgpt-{sl}">Read the case study'
                             f'<span class="sr-only">: {esc(cm.group(1))}</span> <span aria-hidden="true">→</span></a></li>')
                continue
            end_cards()
            if is_loop(b):
                parts.append(loop_html())
            elif b['t'] == 'p' and re.fullmatch(r'\[[^\]]+\]\([^)]+\)', b['text']):
                lm = re.fullmatch(r'\[([^\]]+)\]\(([^)]+)\)', b['text'])
                text, href = lm.group(1), clean_href(lm.group(2))
                if text.startswith('Read the full case study'):
                    parts.append(f'<p class="end-cta"><a class="btn btn-primary wipe" href="{href}">{esc(text)} '
                                 f'<span aria-hidden="true">→</span></a></p>')
                else:
                    label = text.replace('→', '').strip()
                    parts.append(f'<p class="more-link"><a href="{href}">{esc(label)} <span aria-hidden="true">→</span></a></p>')
            elif b['t'] == 'p':
                parts.append(f'<p>{inline(b["text"])}</p>')
            elif b['t'] in ('ul', 'ol'):
                parts.append(list_html(b))
        end_cards()
        out.append(f'''<section class="body"{idattr}>
  <div class="wrap">
    <div class="section-head"><h2>{esc(h2)}</h2></div>
    <div class="hub-body">{"".join(parts)}</div>
  </div>
</section>''')
    out.append(NEXT_CASE)
    desc = ('TaskGPT: an enterprise AI suite for agents on live customer calls. '
            'All 11 products and 7 Chrome extensions went live. Designed by Dipesh Gurav.')
    return page('/case-taskgpt', 'TaskGPT · Case Study | Dipesh Gurav', desc,
                '/assets/taskgpt-hub-og.jpg', 'TaskGPT', '\n'.join(out))


# ─── Standalone case studies ─────────────────────────────────────────────────

def meta_desc(name, oneliner):
    """'<Name>: <hub one-liner>. Part of TaskGPT, ...' kept under 160 characters."""
    tail = ' Part of TaskGPT, an enterprise AI suite designed by Dipesh Gurav.'
    sentences = re.findall(r'[^.?!]+[.?!]', plain(oneliner))
    first = sentences[0].strip()
    w = first.split(' ')[0]
    if not ((w.isupper() and len(w) > 1) or re.search(r'[A-Z].*[A-Z]', w)):
        first = first[0].lower() + first[1:]
    body = first
    for s in sentences[1:]:
        if len(f'{name}: {body} {s.strip()}{tail}') <= 160:
            body += ' ' + s.strip()
        else:
            break
    d = f'{name}: {body}{tail}'
    if len(d) > 160:
        d = f'{name}: {body}'
    if len(d) > 160:
        d = f'{re.sub(r" [(].*[)]", "", name)}: {body}'
    return d


def render_blocks(blocks):
    out = []
    for b in blocks:
        if b['t'] == 'p':
            out.append(f'<p>{crossrefs(inline(b["text"]))}</p>')
        elif b['t'] in ('ul', 'ol'):
            out.append(crossrefs(list_html(b)))
        elif b['t'] == 'table':
            out.append(b['html'] if 'html' in b else table_html(b['head'], b['rows'], b.get('label', 'Table')))
        elif b['t'] == 'raw':
            out.append(b['html'])
    return ''.join(out)


def groups_from(blocks):
    """Split a section into an intro and labelled groups (The story, What I designed, ...)."""
    intro, groups = [], []
    for b in blocks:
        lab = inline_label(b)
        if is_label(b):
            groups.append({'title': label_text(b), 'blocks': []})
        elif lab and lab[0] in ('The story',):
            groups.append({'title': lab[0], 'blocks': [{'t': 'p', 'text': lab[1]}]})
        elif groups:
            groups[-1]['blocks'].append(b)
        else:
            intro.append(b)
    return intro, groups


def facts_html(cells):
    return ('<dl class="facts">' + ''.join(f'<div><dt>{esc(k)}</dt><dd>{inline(v)}</dd></div>' for k, v in cells)
            + '</dl>')


def build_standalone(idx, sections, ext_table, ext_decisions, instrumented, popup, cards, screens, tree_groups):
    sl, name, kind, sec = PAGES[idx]
    card = cards[sl]
    shots = screens[sl]
    full_id = sec

    # Body
    if kind == 'product':
        intro, groups = groups_from(sections[sec])
        lead, intro = intro[0], intro[1:]
        if sl == 'dashboard':
            pos = next(i for i, g in enumerate(groups) if g['title'] == 'What I designed') + 1
            groups.insert(pos, {'title': 'What I instrumented', 'blocks': instrumented})
        if sl == 'home':
            row = ext_table['TaskGPT']
            groups.append({'title': 'The TaskGPT extension', 'blocks': [
                {'t': 'raw', 'html': facts_html([('Who it is for', row[1]), ('What it does', row[2]),
                                                  ('Where it runs', row[3]), ('First date in the file', row[4])])},
                {'t': 'p', 'text': popup}]})
        if sl == 'authorai':
            paras = sections['taskscribe-and-authorai']
            groups.append({'title': 'TaskScribe and AuthorAI', 'blocks': paras})
    else:
        lead = None
        row = ext_table[EXT_ROW[sl]]
        intro = [{'t': 'raw', 'html': facts_html([('Who it is for', row[1]), ('Where it runs', row[3]),
                                                   ('First date in the file', row[4])])}]
        intro += sections[sec]
        items = [d for d in ext_decisions if sl in next(v for k, v in EXT_DECISIONS.items() if d.startswith(k))]
        groups = [{'title': 'Design decisions', 'blocks': [{'t': 'ul', 'items': items}]}]

    ctx_tail = f'{name} is one of its 11 products.' if kind == 'product' else f'{name} is one of its 7 Chrome extensions.'
    context = ('TaskGPT is the AI suite I designed at TaskUs for agents on live customer calls, and for the people '
               'who set up, measure and improve the AI behind them. I was the only designer, from 2022 to 2025. '
               + ctx_tail)

    # Cover and screens. With a hero video, the first image moves down under the context box
    # (Dipesh, 25 Nov 2026) and no longer loads first.
    first = sl not in VIDEOS
    if sl == 'shield':
        cover = (f'<figure class="pair-fig"><div class="pair">{shot(shots[0], first, False)}{shot(shots[1], first, False)}</div>'
                 f'<figcaption>{esc(SHIELD_CAPTION)}</figcaption></figure>')
        rest = shots[2:]
    elif sl == 'productivity-tracker':
        cover = f'<div class="pair">{shot(shots[0], first)}{shot(shots[1], first)}</div>'
        rest = []
    elif sl == 'dashboard':
        cover = shot(DASH_CROP, first)
        rest = shots
    else:
        lead_i = next((i for i, x in enumerate(shots) if not x.get('hold')), 0)
        cover = shot(shots[lead_i], first)
        rest = [x for i, x in enumerate(shots) if i != lead_i]

    # "first_image": "off" leaves the first image out: on the Dashboard page it is a crop of the screen
    # that follows it (Dipesh, 25 Nov 2026)
    moved = (f'\n    <div class="cover-fig">{cover}</div>'
             if sl in VIDEOS and VIDEOS[sl].get('first_image') != 'off' else '')

    chips = ''.join(f'<li>{esc(c)}</li>' for c in CHIPS)
    # The story, with this product's screens placed between its parts (Dipesh, 23 Nov 2026:
    # the screens read best inside the story, not in a gallery at the end)
    queue = list(rest)

    def take():
        return shot(queue.pop(0)) if queue else ''

    story, page_toc = [], []
    if lead or intro:
        lead_html = f'<p class="lead">{inline(lead["text"])}</p>' if lead else ''
        story.append(f'<div class="block">{lead_html}{render_blocks(intro)}</div>')
        story.append(take())
    for g in groups:
        gid = slug(g['title'])
        page_toc.append((gid, g['title']))
        story.append(f'<div class="block"><h2 id="{gid}">{esc(g["title"])}</h2>{render_blocks(g["blocks"])}</div>')
        story.append(take())
    story += [shot(x) for x in queue]

    prev_p = PAGES[idx - 1] if idx > 0 else None
    next_p = PAGES[idx + 1] if idx < len(PAGES) - 1 else None
    nav = []
    if prev_p:
        nav.append(f'<a class="mf-prev" href="/case-taskgpt-{prev_p[0]}"><span class="mono">Previous</span>'
                   f'<span class="mf-name"><span aria-hidden="true">← </span>{esc(prev_p[1])}</span></a>')
    else:
        nav.append('<span class="mf-prev mf-empty"></span>')
    if next_p:
        nav.append(f'<a class="mf-next" href="/case-taskgpt-{next_p[0]}"><span class="mono">Next</span>'
                   f'<span class="mf-name">{esc(next_p[1])}<span aria-hidden="true"> →</span></span></a>')

    # The same reader as the full case study (Dipesh, 23 Nov 2026): every product stays in view
    # in the tree on the left, each with what it is in plain words, so nobody has to go back to
    # the hub to find the next one. Below 1024px the tree is a drawer.
    body = f'''<div class="wrap">
<div class="reader product-reader">
  <div class="toc-backdrop" hidden></div>
  <nav class="toc" id="toc" aria-label="TaskGPT case studies">
    <div class="toc-top"><span class="mono">TaskGPT</span><button type="button" class="toc-close">Close<span class="sr-only"> the list of products</span></button></div>
    <ol class="toc-list">{product_tree(tree_groups, sl, page_toc)}</ol>
  </nav>
  <article class="doc product" id="content" tabindex="-1">
    <nav aria-label="Breadcrumb"><ol class="crumb"><li><a href="/case-taskgpt-full">TaskGPT</a></li><li aria-current="page">{esc(name)}</li></ol></nav>
    <h1>{esc(name)}</h1>
    <p class="kind">{esc(DESCRIPTORS[sl])}</p>
    <p class="lede statement">{statement(inline(card["desc"]), sl)}</p>
    <ul class="chips" aria-label="Role and status">{chips}</ul>
    <div class="cover-fig">{case_video(sl) if sl in VIDEOS else cover}</div>
    <div class="context-box">
      <p>{context}</p>
      <p class="context-links"><a href="/case-taskgpt-full">See all of TaskGPT</a><a href="/case-taskgpt-full#{full_id}">Read the full case study</a></p>
    </div>{moved}
    <div class="story-body">{"".join(story)}</div>
    <section class="more-from" aria-labelledby="more-from">
      <h2 class="mono" id="more-from">More from TaskGPT</h2>
      <div class="mf-grid">{"".join(nav)}</div>
      <p class="mf-back"><a class="btn btn-outline" href="/case-taskgpt-full"><span aria-hidden="true">←</span> Back to TaskGPT</a></p>
    </section>
  </article>
</div>
</div>'''
    bar = ('<div class="reader-bar"><button type="button" class="toc-open" aria-expanded="false" aria-controls="toc">'
           '<span class="toc-open-icon" aria-hidden="true"></span>All products</button>'
           '<span class="reader-current" id="reader-current"></span></div>')
    usable = [x for x in shots if not x.get('hold')]
    if sl == 'dashboard':
        og = DASH_CROP['file']
    elif sl == 'shield':
        og = shots[1]['file']
    else:
        og = usable[0]['file'] if usable else 'taskgpt-hub-og'
    og_path = '/assets/taskgpt-hub-og.jpg' if og == 'taskgpt-hub-og' else f'/assets/{og}.jpg'
    return page(f'/case-taskgpt-{sl}', f'{name} · TaskGPT Case Study | Dipesh Gurav',
                meta_desc(name, card['desc']), og_path, f'TaskGPT · {name}', body, part_of=True,
                skip='#content', extra_before_main=bar)


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    case_md = open(newest('taskgpt-case-study-source-*.md'), encoding='utf-8').read()
    hub_md = open(newest('taskgpt-hub-copy-*.md'), encoding='utf-8').read()
    if TITLE_FROM in case_md:
        case_md = case_md.replace(TITLE_FROM, TITLE_TO)
    for old, new in COPY_SWAPS:
        hub_md = hub_md.replace(old, new)
        case_md = case_md.replace(old, new)
    # Adoption after the revamp is 12%; a new sentence giving it as 20% needs a COPY_SWAPS entry
    assert not re.search(r'adoption[^.]*20%', hub_md + case_md), 'adoption must say 12%, not 20%'
    screens = json.load(open(os.path.join(ROOT, 'docs/taskgpt/screens.json'), encoding='utf-8'))

    blocks = parse(case_md)
    title, out, toc, sections = build_full(blocks, screens)

    # Pieces the standalone pages borrow from other sections
    ext = sections['chrome-extensions']
    tbl = next(b for b in ext if b['t'] == 'table')
    ext_table = {r[0]: r for r in tbl['rows']}
    dec_i = next(i for i, b in enumerate(ext) if is_label(b) and label_text(b) == 'Design decisions')
    ext_decisions = ext[dec_i + 1]['items']
    share_i = next(i for i, b in enumerate(ext) if is_label(b) and label_text(b) == 'What the extensions share')
    popup_item = ext[share_i + 1]['items'][0]
    popup = ' '.join(re.findall(r'[^.]+\.', plain(popup_item))[:2]).strip()
    popup = popup.replace('A small popup that opens on the person\'s own numbers.',
                          '**A small popup that opens on the person\'s own numbers.**')
    dash = sections['dashboards-and-reports']
    ins_i = next(i for i, b in enumerate(dash) if b['t'] == 'p' and b['text'].startswith('**What I instrumented.**'))
    ins_text = inline_label(dash[ins_i])[1]
    ins_tbl = dash[ins_i + 1]
    instrumented = [{'t': 'p', 'text': ins_text},
                    {'t': 'table', 'head': ins_tbl['head'], 'rows': ins_tbl['rows'], 'label': 'What I instrumented'}]
    # Paragraphs of section 12 extensions arrive with the lead-in already removed
    for k in ('translatebuddy', 'taskscribe-and-authorai', 'shield', 'shield-co-pilot',
              'deepfake-detection', 'productivity-tracker'):
        sections[k] = [b for b in sections[k] if b['t'] == 'p']

    hub_blocks = parse(hub_md)
    secs = hub_sections(hub_blocks)
    cards = hub_cards(secs)
    assert set(cards) == {p[0] for p in PAGES}, set(cards) ^ {p[0] for p in PAGES}
    tree_groups = hub_groups(secs)
    assert sorted(x for _, g in tree_groups for x in g) == sorted(p[0] for p in PAGES), tree_groups

    written = {}
    written['case-taskgpt-full.html'] = full_page(title, out, toc)
    written['case-taskgpt.html'] = build_hub(secs, screens)
    for i, p in enumerate(PAGES):
        written[f'case-taskgpt-{p[0]}.html'] = build_standalone(
            i, sections, ext_table, ext_decisions, instrumented, popup, cards, screens, tree_groups)

    for name, text in written.items():
        assert '\u2014' not in text, f'em dash in {name}'
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
            f.write(text)
    print(f'Wrote {len(written)} pages')


if __name__ == '__main__':
    main()
