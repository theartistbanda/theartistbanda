#!/usr/bin/env python3
"""
Builds case-repos-pay.html from Dipesh's source file (brief of 27 Nov 2026).

The source lives outside the repo so Vercel never publishes it:
  ~/Downloads/repos-pay-source/repos-pay-case-study-source-*.md   (the newest is used)
Captions, alt text and sizes: docs/repospay/screens.json. The images are in assets/ (repos-pay-*-1).

After Dipesh exports a fresh copy, put it in that folder and run, from the repo root:
  python3 docs/repospay/build_repospay.py

The words come from the source as they are. The page parts come from the TaskGPT build script and the styles
from the LevelUp page, so it reads like the Job Desk, Pattern Desk and Maestro pages. Repos Pay is client work for
Repos Energy: not Mindefy work and not TaskUs work (CLAUDE.md).
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'docs', 'taskgpt'))
sys.dont_write_bytecode = True
import build_taskgpt as tg  # noqa: E402
from build_taskgpt import attr, esc, inline, list_html, parse, picture, table_html, toc_html  # noqa: E402

SRC = os.path.expanduser('~/Downloads/repos-pay-source/')
PAGE = os.path.join(ROOT, 'case-repos-pay.html')
SCREENS = json.load(open(os.path.join(ROOT, 'docs/repospay/screens.json'), encoding='utf-8'))

# No hero, like the Job Desk and Pattern Desk pages (Dipesh, 27 Nov 2026: "follow our style"): no chips and no
# number strip. Kept: the title, the three opening paragraphs, the dashboard picture and every fact.
FACTS = ['Role', 'Team', 'Timeline', 'Platforms', 'Users', 'Status']
READ_TIME = 'About 9 minutes to read'
HERO = 'repos-pay-hero-1'
TITLE_ITALIC = 'with trust on both sides'
# The opening paragraph: phrases in Fraunces italic, then the one with the hand-drawn line
# (see "Opening paragraphs" in CLAUDE.md). Every phrase is copied from that paragraph.
tg.LEDE_MARKS['repospay'] = (['diesel to the doorstep', 'long cycles'], 'credit is a risk')
# Heading ids (brief, section 4.1)
IDS = {
    'The brief': 'the-brief', 'Three users, one deal': 'three-users-one-deal', 'Research': 'research',
    'Key design decisions': 'key-design-decisions',
    'Credit is a choice inside the normal order': 'credit-is-a-choice',
    'Ask two questions: how much, and how long': 'how-much-and-how-long',
    'The full cost comes before the signature': 'full-cost-before-the-signature',
    'A signature that works on any device': 'a-signature-that-works-on-any-device',
    'Both sides sign': 'both-sides-sign',
    'A score the customer can improve': 'a-score-the-customer-can-improve',
    'Onboarding that shows where you are': 'onboarding-that-shows-where-you-are',
    'Offline payments still count': 'offline-payments-still-count',
    'What is owed, always in view': 'what-is-owed-always-in-view',
    'One place for Repos to hold the risk': 'one-place-to-hold-the-risk',
    'Trust shown, not only promised': 'trust-shown-not-only-promised',
    'A brand inside a brand': 'a-brand-inside-a-brand',
    'A moment of delight at the end': 'a-moment-of-delight',
    'From Finserv to Repos Pay': 'from-finserv-to-repos-pay', "The partner's day": 'the-partners-day',
    'Outcome': 'outcome', 'What I learned': 'what-i-learned',
}
# Image layouts (brief, section 4.3). Phone screens are tall and narrow, so they get a width cap.
PHONE_CAP = {'repos-pay-energy-score-1': 'rp-w420'}
PAIR_LAYOUT = {   # first image of the pair -> layout class
    'repos-pay-order-app-1': 'rp-mixed',          # a phone next to a web screen: 1 to 2 from 1024px
    'repos-pay-partner-pending-1': 'rp-phones',   # two phones: side by side from 640px
    'repos-pay-admin-agreement-1': 'rp-stack',    # two big web screens: stacked at every width
    'repos-pay-signature-before-1': 'rp-stack',   # two wide images: before on top, after below
    'repos-pay-old-onboarding-1': 'rp-phones rp-tall',
}
PAIR_CAPTIONS = {   # one caption under a before-and-after pair
    'repos-pay-signature-before-1': 'Draw, type or upload: one signature box for every screen that needs a signature.',
    'repos-pay-old-onboarding-1': 'The same onboarding, renamed and rebuilt around the order.',
}
# The order-placed animation: Dipesh's recording (27 Nov 2026), played like the hero videos (case-video.js), at most
# 360px wide like the other phone screens. The still from the export stays in assets/ but is not on the page.
ANIMATION_STILL = 'repos-pay-order-placed-1'
ANIMATION_VIDEO = 'repospay-order'   # docs/videos.json
UNUSED = {ANIMATION_STILL}

TITLE = 'Repos Pay case study: diesel on credit, with trust on both sides | Dipesh Gurav'
DESC = ('How Dipesh Gurav designed Repos Pay, diesel on credit for Repos Energy, across customer, partner and admin '
        'apps, with trust on both sides.')
# The bottom links follow the homepage's order (Dipesh, 27 Nov 2026): Repos Pay comes before Aatmnirbhar
NEXT = '''<section class="next">
  <div class="wrap">
    <div class="mono next-label">Next case study</div>
    <a href="/case-aatmnirbhar">
      <span class="nt">Aatmnirbhar: <i>a mark India picked up</i></span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>'''
# Words that must never be on this page (CLAUDE.md, retired claims; brief, section 9)
BANNED = [r'\bChetan\b', r'Walnuj', r'Walunj', r'Carmelita', r'Shen Zhi', r'\bcoins?\b', r'\bcrypto', r'\btokens?\b',
          r'PDFace', r'lorem', r'mobility ecosystem', r'Mindefy']
OLD_NAMES = re.compile(r'Finserv|Diesel Score')
OLD_SECTION = 'from-finserv-to-repos-pay'

used = []


def figure(name, cls='', eager=False):
    s = SCREENS[name]
    used.append(name)
    return (f'<figure class="shot{(" " + cls) if cls else ""}"><div class="frame">'
            f'{picture(name, s["alt"], s["w"], s["h"], eager)}</div>'
            f'<figcaption>{esc(s["caption"])}</figcaption></figure>')


def media(text):
    """The figures for a marker: [IMAGE: ..], [IMAGE PAIR: ..], [BEFORE AND AFTER: ..] or [ANIMATION: ..]"""
    m = re.match(r'\[(IMAGE PAIR|IMAGE|BEFORE AND AFTER|ANIMATION): ([^\]]+)\]', text.strip())
    assert m, f'not a marker: {text[:80]}'
    kind = m.group(1)
    names = re.findall(r'repos-pay-[a-z-]+?-\d', m.group(2))
    assert len(names) == (2 if kind in ('IMAGE PAIR', 'BEFORE AND AFTER') else 1), names
    if kind == 'ANIMATION':
        assert names[0] == ANIMATION_STILL, names
        v = tg.case_video(ANIMATION_VIDEO)
        assert v.startswith('<figure class="shot case-video'), v[:60]
        # The width class goes after "shot case-video": tg.page loads case-video.js only when it finds that text
        return v.replace('<figure class="shot case-video', '<figure class="shot case-video rp-w360', 1)
    if kind == 'IMAGE':
        return figure(names[0], PHONE_CAP.get(names[0], ''))
    pair = f'<div class="pair {PAIR_LAYOUT[names[0]]}">' + ''.join(figure(n) for n in names) + '</div>'
    if kind == 'IMAGE PAIR':
        return pair
    return f'<figure class="pair-fig">{pair}<figcaption>{esc(PAIR_CAPTIONS[names[0]])}</figcaption></figure>'


def main():
    files = sorted(glob.glob(os.path.join(SRC, 'repos-pay-case-study-source-*.md')), key=os.path.getmtime)
    if not files:
        sys.exit(f'No source file in {SRC}')
    source = open(files[-1], encoding='utf-8').read()
    # The notes above "## Hero", and "Screens" and "Still open" at the end, are for the builder, not the page
    source = source[source.index('## Hero'):]
    source = source[:source.index('\n---\n\n## Screens')]
    blocks = parse(source)

    # Sections by ## heading
    secs, cur = [], None
    for b in blocks:
        if b['t'] == 'h' and b['level'] == 2:
            cur = {'title': b['text'].rstrip('.'), 'blocks': []}
            secs.append(cur)
        elif cur is not None:
            cur['blocks'].append(b)
    hero, body_secs = secs[0], secs[1:]
    assert hero['title'] == 'Hero', hero['title']
    assert body_secs[0]['title'] == 'The brief' and body_secs[-1]['title'] == 'What I learned'

    # The opening, from the source's hero
    paras = [b['text'] for b in hero['blocks'] if b['t'] == 'p']
    title = re.fullmatch(r'\*\*(.+)\*\*', paras[0]).group(1)
    intro, second, third = paras[1], paras[2], paras[3]
    assert intro.startswith('Repos Energy delivers diesel') and second.startswith('Repos Pay is the credit service')
    assert third.startswith('In the same project'), third[:40]
    facts = [b for b in hero['blocks'] if b['t'] == 'table'][1]
    assert [r[0] for r in facts['rows']] == FACTS, facts['rows']
    assert any(p.startswith(f'[IMAGE: {HERO}]') for p in paras)
    name, _, rest = title.partition(':')
    rest = rest.strip()
    assert rest.endswith(TITLE_ITALIC), rest
    h1 = f'{esc(name)}: {esc(rest[:-len(TITLE_ITALIC)])}<i>{esc(TITLE_ITALIC)}</i>'
    opening = (f'<h1>{h1}</h1>\n    <p class="readtime">{READ_TIME}</p>\n'
               f'    <p class="lede statement">{tg.statement(inline(intro), "repospay")}</p>\n'
               f'    <p>{inline(second)}</p>\n    <p>{inline(third)}</p>\n'
               f'    {figure(HERO, eager=True)}\n'
               f'    {table_html(["Fact", "Detail"], facts["rows"], "Repos Pay facts")}')

    # Body
    out, toc, ids = [], [], set()

    def new_id(text):
        i = IDS[text]
        assert i not in ids, f'duplicate id {i}'
        ids.add(i)
        return i

    for s in body_secs:
        i = new_id(s['title'])
        out.append(f'<h2 id="{i}">{inline(s["title"])}</h2>')
        node = {'id': i, 'num': '', 'text': s['title'], 'label': s['title'], 'kids': []}
        toc.append(node)
        for b in s['blocks']:
            if b['t'] == 'p' and b['text'].startswith('['):
                out.append(media(b['text']))
                continue
            # **1. Credit is a choice inside the normal order.** text -> a numbered h3, so it shows in the tree
            m = re.match(r'^\*\*(\d+)\.\s+(.+?)\.\*\*\s+(.*)$', b['text']) if b['t'] == 'p' else None
            if m:
                text = m.group(2)
                hid = new_id(text)
                out.append(f'<h3 id="{hid}"><span class="num">{m.group(1)}.</span> {inline(text)}</h3>')
                node['kids'].append({'id': hid, 'num': f'{m.group(1)}.', 'text': text, 'label': text, 'kids': []})
                out.append(f'<p>{inline(m.group(3))}</p>')
            elif b['t'] == 'p':
                out.append(f'<p>{inline(b["text"])}</p>')
            elif b['t'] in ('ul', 'ol'):
                out.append(list_html(b))
            else:
                sys.exit(f'Unhandled block {b}')

    assert sorted(used) == sorted(set(SCREENS) - UNUSED), set(SCREENS) ^ set(used) ^ UNUSED
    assert len(toc) == 8 and sum(len(t['kids']) for t in toc) == 13, (len(toc), [len(t['kids']) for t in toc])

    # The old names only in their own section, and in the line that explains FPC (brief, section 9)
    story = ''.join(out)
    for part in re.split(r'(?=<h2 id=")', story):
        if part.startswith(f'<h2 id="{OLD_SECTION}"'):
            continue
        rest_names = OLD_NAMES.findall(part.replace('Finserv Pay Check (FPC)', ''))
        assert not rest_names, f'old name outside its section: {rest_names} in {part[:60]}'
    assert not OLD_NAMES.search(opening)

    bar = ('<div class="reader-bar"><button type="button" class="toc-open" aria-expanded="false" aria-controls="toc">'
           '<span class="toc-open-icon" aria-hidden="true"></span>Contents</button>'
           '<span class="reader-current" id="reader-current"></span></div>')
    body = f'''<div class="wrap">
<div class="reader lu-reader">
  <div class="toc-backdrop" hidden></div>
  <nav class="toc" id="toc" aria-label="Case study contents">
    <div class="toc-top"><span class="mono">Contents</span><button type="button" class="toc-close">Close<span class="sr-only"> contents</span></button></div>
    <ol class="toc-list">{toc_html(toc)}</ol>
  </nav>
  <article class="doc lu-doc eu rp" id="content" tabindex="-1">
    {opening}
    {story}
    <div class="doc-end"><a class="btn btn-outline" href="/#career"><span aria-hidden="true">←</span> Back to portfolio</a></div>
  </article>
</div>
</div>
{NEXT}'''
    html = tg.page('/case-repos-pay', TITLE, DESC, f'/assets/{HERO}.jpg', 'Repos Pay', body, progress=True,
                   skip='#content', extra_before_main=bar)
    swaps = [
        ("<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->",
         "<!-- Built by docs/repospay/build_repospay.py from Dipesh's source file. Edit the source and rebuild rather than editing this file. -->"),
        ('<link rel="stylesheet" href="/case-lead.css">\n', '<link rel="stylesheet" href="/case-lead.css">\n<link rel="stylesheet" href="/case-levelup.css">\n'),
    ]
    for a, b in swaps:
        assert html.count(a) == 1, a[:60]
        html = html.replace(a, b)
    assert '—' not in html, 'em dash'
    visible = re.sub(r'<(script|style)\b.*?</\1>', ' ', html, flags=re.S)
    for w in BANNED:
        assert not re.search(w, visible, re.I), f'"{w}" is on the page'
    with open(PAGE, 'w', encoding='utf-8') as f:
        f.write(html)

    def words(part):
        part = re.sub(r'<(figcaption|nav|svg|table)\b.*?</\1>', ' ', part, flags=re.S)
        return len(re.findall(r'[A-Za-z0-9][^ ]*', re.sub(r'<[^>]+>', ' ', part)))
    print(f'Wrote case-repos-pay.html: {len(toc)} sections, {sum(len(t["kids"]) for t in toc)} decisions, '
          f'{len(used)} screens, {words(story)} words of story, {words(opening)} more in the opening')


if __name__ == '__main__':
    main()
