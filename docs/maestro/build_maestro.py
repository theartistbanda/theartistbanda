#!/usr/bin/env python3
"""
Builds case-maestro.html from Dipesh's source file (brief of 25 Nov 2026).

The source lives outside the repo so Vercel never publishes it:
  ~/Downloads/maestro-source/maestro-case-study-source-*.md   (the newest is used)
Captions, alt text and sizes: docs/maestro/screens.json. The images are in assets/ (maestro-*-1).

After Dipesh exports a fresh copy, put it in that folder and run, from the repo root:
  python3 docs/maestro/build_maestro.py

The words come from the source as they are. The page parts come from the TaskGPT build script and the
styles from the LevelUp page. Maestro is its own product: nothing on this page may name TaskGPT.
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

SRC = os.path.expanduser('~/Downloads/maestro-source/')
PAGE = os.path.join(ROOT, 'case-maestro.html')
SCREENS = json.load(open(os.path.join(ROOT, 'docs/maestro/screens.json'), encoding='utf-8'))

# No hero, like the LevelUp and EvaluateUs pages (Dipesh, 25 Nov 2026): the source's hero goes into the
# page. Kept: the title, what Maestro is (the opening paragraph), the morning brief picture, and these
# facts. Left out, because the story already says it: the second paragraph, the five numbers and the
# other facts.
KEEP_FACTS = ['Role', 'Team', 'Timeline', 'Platform', 'Data']
ALL_FACTS = ['Role', 'Team', 'Timeline', 'Platform', 'Users', 'Data', 'Status']
READ_TIME = 'About 9 minutes to read'
HERO_IMAGE = 'maestro-brief-1'
# The opening paragraph: phrases in Fraunces italic, then the one with the hand-drawn line
# (see "Opening paragraphs" in CLAUDE.md). Every phrase is copied from that paragraph.
tg.LEDE_MARKS['maestro'] = (['a question in plain words', 'the likely cause'], 'inside Google Chat')
# Ids that differ from the rule (brief, section 3.1)
IDS = {'Start the shift with a brief, not a dashboard': 'start-the-shift-with-a-brief',
       'Training for the person, not the team': 'training-for-the-person',
       'Ask for trust first, then earn it': 'ask-for-trust-first',
       'Want me to keep an eye on this?': 'keep-an-eye-on-this'}
# Only these sections turn their bold numbered lead-ins into headings
NUMBERED = ['Key design decisions', 'The later version: from an answer to a watch']
BEFORE_AFTER = 'The same AHT number, split into talk time, hold time and after-call work.'
# The full brief scrolls inside its own box; the three option cards are capped at 640px
SCROLL_BOX = {'maestro-brief-full-1': 'Full morning brief, scrollable'}
NARROW = ['maestro-watch-options-1']

TITLE = "Maestro case study: your team's numbers, in the chat you already use | Dipesh Gurav"
DESC = ('How Dipesh Gurav designed Maestro, a TaskUs AI assistant in Google Chat that brings team leads '
        'their numbers, causes and next steps.')
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
    pic = picture(name, s["alt"], s["w"], s["h"], eager)
    if name in SCROLL_BOX:
        pic = f'<div class="scroll-box" tabindex="0" role="region" aria-label="{attr(SCROLL_BOX[name])}">{pic}</div>'
    cls = 'shot scrolls' if name in SCROLL_BOX else 'shot narrow' if name in NARROW else 'shot'
    return (f'<figure class="{cls}"><div class="frame">{pic}</div>'
            f'<figcaption>{esc(s["caption"])}</figcaption></figure>')


def media(text):
    """The figures for a marker: [IMAGE: ..], [IMAGE PAIR: ..] or [BEFORE AND AFTER: ..]"""
    m = re.fullmatch(r'\[(IMAGE PAIR|IMAGE|BEFORE AND AFTER): ([^\]]+)\](?: \(tall: show it in a scroll box\))?', text.strip())
    assert m, f'not a marker: {text[:80]}'
    names = re.findall(r'maestro-[a-z0-9-]+-\d', m.group(2))
    assert len(names) == (1 if m.group(1) == 'IMAGE' else 2), names
    if m.group(1) == 'IMAGE':
        return figure(names[0])
    pair = '<div class="pair">' + ''.join(figure(n) for n in names) + '</div>'
    if m.group(1) == 'IMAGE PAIR':
        return pair
    return f'<figure class="pair-fig">{pair}<figcaption>{esc(BEFORE_AFTER)}</figcaption></figure>'


def main():
    files = sorted(glob.glob(os.path.join(SRC, 'maestro-case-study-source-*.md')), key=os.path.getmtime)
    if not files:
        sys.exit(f'No source file in {SRC}')
    blocks = parse(open(files[-1], encoding='utf-8').read())

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
    assert intro.startswith('Maestro is '), intro[:40]
    facts = [b for b in hero['blocks'] if b['t'] == 'table'][1]
    assert [r[0] for r in facts['rows']] == ALL_FACTS, facts['rows']
    assert f'[IMAGE: {HERO_IMAGE}]' in paras
    name, _, rest = title.partition(':')
    h1 = f'{esc(name)}: {esc(rest.strip())}'
    assert 'in the chat you already use' in h1
    h1 = h1.replace('in the chat you already use', '<i>in the chat you already use</i>')
    opening = (f'<h1>{h1}</h1>\n    <p class="readtime">{READ_TIME}</p>\n'
               f'    <p class="lede statement">{tg.statement(inline(intro), "maestro")}</p>\n'
               f'    {figure(HERO_IMAGE, eager=True)}\n'
               f'    {table_html(["Fact", "Detail"], [r for r in facts["rows"] if r[0] in KEEP_FACTS], "Maestro facts")}')

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
            # **1. Start the shift with a brief, not a dashboard.** text -> a numbered h3, so it shows in the tree
            m = re.match(r'^\*\*(\d+)\.\s+(.+?)\.?\*\*\s+(.*)$', b['text']) if b['t'] == 'p' else None
            if m:
                assert s['title'] in NUMBERED, s['title']
                text = m.group(2).strip('"')
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
    html = tg.page('/case-maestro', TITLE, DESC, f'/assets/{HERO_IMAGE}.jpg', 'Maestro', body, progress=True,
                   skip='#content', extra_before_main=bar)
    swaps = [
        ("<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->",
         "<!-- Built by docs/maestro/build_maestro.py from Dipesh's source file. Edit the source and rebuild rather than editing this file. -->"),
        ('<link rel="stylesheet" href="/case-lead.css">\n', '<link rel="stylesheet" href="/case-lead.css">\n<link rel="stylesheet" href="/case-levelup.css">\n'),
    ]
    for a, b in swaps:
        assert html.count(a) == 1, a[:60]
        html = html.replace(a, b)
    assert '—' not in html, 'em dash'
    assert 'TaskGPT' not in html, 'Maestro is not part of TaskGPT'
    with open(PAGE, 'w', encoding='utf-8') as f:
        f.write(html)

    def words(part):
        part = re.sub(r'<(figcaption|nav|svg)\b.*?</\1>', ' ', part, flags=re.S)
        return len(re.findall(r'[A-Za-z0-9][^ ]*', re.sub(r'<[^>]+>', ' ', part)))
    print(f'Wrote case-maestro.html: {len(toc)} sections, {sum(len(t["kids"]) for t in toc)} decisions, '
          f'{len(used)} screens, {words(" ".join(out))} words of story, {words(opening)} more in the opening')


if __name__ == '__main__':
    main()
