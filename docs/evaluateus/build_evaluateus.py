#!/usr/bin/env python3
"""
Builds case-evaluateus.html from Dipesh's source file (brief of 25 Nov 2026).

The source lives outside the repo so Vercel never publishes it:
  ~/Downloads/evaluateus-source/evaluateus-case-study-source-*.md   (the newest is used)
Captions, alt text and sizes: docs/evaluateus/screens.json. The images are in assets/
(evaluateus-*-1 and voiceai-*-1; the voiceai- prefix is only a file name, never a product name).

After Dipesh exports a fresh copy, put it in that folder and run, from the repo root:
  python3 docs/evaluateus/build_evaluateus.py

The words come from the source as they are, apart from COPY_SWAPS. The page parts (head, header, footer, tables, images,
heading tree) come from the TaskGPT build script and the styles from the LevelUp page, so the three
case studies stay alike.
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
from build_taskgpt import attr, esc, inline, list_html, parse, picture, slug, table_html, toc_html  # noqa: E402

SRC = os.path.expanduser('~/Downloads/evaluateus-source/')
PAGE = os.path.join(ROOT, 'case-evaluateus.html')
SCREENS = json.load(open(os.path.join(ROOT, 'docs/evaluateus/screens.json'), encoding='utf-8'))

# No hero, like the LevelUp page (Dipesh, 25 Nov 2026): the source's hero goes into the page. Kept: the
# title, what EvaluateUs is (the opening paragraph), the dashboard picture, and these facts. Left out,
# because the story already says it: the second paragraph, the five numbers and the other facts.
KEEP_FACTS = ['Role', 'Team', 'Timeline', 'Platform']
SAID_IN_STORY = ['Clients', 'Status']
READ_TIME = 'About 11 minutes to read'
HERO_IMAGE = 'evaluateus-dashboard-1'
# The opening paragraph: phrases in Fraunces italic, then the one with the hand-drawn line
# (see "Opening paragraphs" in CLAUDE.md). Every phrase is copied from that paragraph.
tg.LEDE_MARKS['evaluateus'] = (['hire, coach and train agents', 'what happens next'], 'three people')
# Headings whose text or id differs from the source (brief, section 3.1)
H3_TEXT = {'Admins set the rules. Managers work inside them': 'Admins set the rules, managers work inside them'}
IDS = {'Admins set the rules, managers work inside them': 'admins-set-the-rules'}
# Dipesh's wording after the source export (25 Nov 2026): the dates
COPY_SWAPS = [
    ('First version launched at the end of 2024. AI scenario version: September 2025 to March 2026',
     'First version went live in December 2025. AI scenario version: September 2025 to March 2026'),
    ('When the AI version came in, the first version was already in testing.',
     'The first version went live in December 2025, and the AI scenario version went into testing in February 2026.'),
]
BEFORE_AFTER = 'The flow would grow, with settings inside settings. The full page gives every setting room.'

TITLE = 'EvaluateUs case study: from typed questions to a live AI customer | Dipesh Gurav'
DESC = ('How Dipesh Gurav designed EvaluateUs, a TaskUs AI assessment platform that grew from typed questions '
        'to AI customers on mock calls.')
# The bottom links follow the homepage's order (Dipesh, 25 Nov 2026), see CLAUDE.md
NEXT = '''<section class="next">
  <div class="wrap">
    <div class="mono next-label">Next case study</div>
    <a href="/case-yourhour">
      <span class="nt">YourHour: <i>breaking digital addiction, compassionately</i></span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>'''

used = []


def figure(name, eager=False):
    s = SCREENS[name]
    used.append(name)
    return (f'<figure class="shot"><div class="frame">{picture(name, s["alt"], s["w"], s["h"], eager)}</div>'
            f'<figcaption>{esc(s["caption"])}</figcaption></figure>')


def media(text):
    """The figures for a marker: [IMAGE: ..], [IMAGE PAIR: ..] or [BEFORE AND AFTER: ..]"""
    m = re.fullmatch(r'\[(IMAGE PAIR|IMAGE|BEFORE AND AFTER): ([^\]]+)\]', text.strip())
    assert m, f'not a marker: {text[:80]}'
    names = re.findall(r'(?:evaluateus|voiceai)-[a-z0-9-]+-\d', m.group(2))
    assert len(names) == (1 if m.group(1) == 'IMAGE' else 2), names
    if m.group(1) == 'IMAGE':
        return figure(names[0])
    pair = '<div class="pair">' + ''.join(figure(n) for n in names) + '</div>'
    if m.group(1) == 'IMAGE PAIR':
        return pair
    return f'<figure class="pair-fig">{pair}<figcaption>{esc(BEFORE_AFTER)}</figcaption></figure>'


def main():
    files = sorted(glob.glob(os.path.join(SRC, 'evaluateus-case-study-source-*.md')), key=os.path.getmtime)
    if not files:
        sys.exit(f'No source file in {SRC}')
    source = open(files[-1], encoding='utf-8').read()
    for a, b in COPY_SWAPS:
        if a in source:
            source = source.replace(a, b)
        elif b not in source:
            print(f'  note: the source has neither wording of "{a[:50]}", check COPY_SWAPS')
    assert 'end of 2024' not in source, 'the first version went live in December 2025'
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
    assert body_secs[-1]['title'] == 'What I learned', body_secs[-1]['title']

    # The opening, from the source's hero (see KEEP_FACTS)
    paras = [b['text'] for b in hero['blocks'] if b['t'] == 'p']
    title = re.fullmatch(r'\*\*(.+)\*\*', paras[0]).group(1)
    intro = paras[1]
    assert intro.startswith('EvaluateUs is '), intro[:40]
    facts = [b for b in hero['blocks'] if b['t'] == 'table'][1]
    assert [r[0] for r in facts['rows']] == KEEP_FACTS + SAID_IN_STORY, facts['rows']
    assert f'[IMAGE: {HERO_IMAGE}]' in paras
    name, _, rest = title.partition(':')
    h1 = f'{esc(name)}: {esc(rest.strip())}'
    assert 'a live AI customer' in h1
    h1 = h1.replace('a live AI customer', '<i>a live AI customer</i>')
    opening = (f'<h1>{h1}</h1>\n    <p class="readtime">{READ_TIME}</p>\n'
               f'    <p class="lede statement">{tg.statement(inline(intro), "evaluateus")}</p>\n'
               f'    {figure(HERO_IMAGE, eager=True)}\n'
               f'    {table_html(["Fact", "Detail"], [r for r in facts["rows"] if r[0] in KEEP_FACTS], "EvaluateUs facts")}')

    # Body
    out, toc, ids = [], [], set()

    def new_id(text):
        i = IDS.get(text) or slug(re.sub(r"['’]", '', text))
        assert i and i not in ids, f'duplicate id {i}'
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
            # **1. One wizard for every assessment.** text -> a numbered h3, so it shows in the tree
            m = re.match(r'^\*\*(\d+)\.\s+(.+?)\.\*\*\s+(.*)$', b['text']) if b['t'] == 'p' else None
            if m:
                text = H3_TEXT.get(m.group(2), m.group(2))
                hid = new_id(text)
                out.append(f'<h3 id="{hid}"><span class="num">{m.group(1)}.</span> {inline(text)}</h3>')
                node['kids'].append({'id': hid, 'num': f'{m.group(1)}.', 'text': text, 'label': text, 'kids': []})
                out.append(f'<p>{inline(m.group(3))}</p>')
            elif b['t'] == 'p':
                out.append(f'<p>{inline(b["text"])}</p>')
            elif b['t'] in ('ul', 'ol'):
                out.append(list_html(b))
            elif b['t'] == 'table':
                out.append(table_html(b['head'], b['rows'], s['title']))
            else:
                sys.exit(f'Unhandled block {b}')

    assert sorted(used) == sorted(SCREENS), set(SCREENS) ^ set(used)

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
  <article class="doc lu-doc eu" id="content" tabindex="-1">
    {opening}
    {"".join(out)}
    <div class="doc-end"><a class="btn btn-outline" href="/#career"><span aria-hidden="true">←</span> Back to portfolio</a></div>
  </article>
</div>
</div>
{NEXT}'''
    html = tg.page('/case-evaluateus', TITLE, DESC, f'/assets/{HERO_IMAGE}.jpg', 'EvaluateUs', body, progress=True,
                   skip='#content', extra_before_main=bar)
    swaps = [
        ("<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->",
         "<!-- Built by docs/evaluateus/build_evaluateus.py from Dipesh's source file. Edit the source and rebuild rather than editing this file. -->"),
        ('<link rel="stylesheet" href="/case-lead.css">\n', '<link rel="stylesheet" href="/case-lead.css">\n<link rel="stylesheet" href="/case-levelup.css">\n'),
    ]
    for a, b in swaps:
        assert html.count(a) == 1, a[:60]
        html = html.replace(a, b)
    assert '—' not in html, 'em dash'
    with open(PAGE, 'w', encoding='utf-8') as f:
        f.write(html)

    def words(part):
        part = re.sub(r'<(figcaption|nav|svg)\b.*?</\1>', ' ', part, flags=re.S)
        return len(re.findall(r'[A-Za-z0-9][^ ]*', re.sub(r'<[^>]+>', ' ', part)))
    print(f'Wrote case-evaluateus.html: {len(toc)} sections, {sum(len(t["kids"]) for t in toc)} decisions, '
          f'{len(used)} screens, {words(" ".join(out))} words of story, {words(opening)} more in the opening')


if __name__ == '__main__':
    main()
