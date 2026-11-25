#!/usr/bin/env python3
"""
Builds case-levelup.html from Dipesh's source file (brief of 24 Nov 2026).

The source lives outside the repo so Vercel never publishes it:
  ~/Downloads/levelup-source/levelup-case-study-source-*.md   (the newest is used)
Captions, alt text and sizes: docs/levelup/screens.json. The images are in assets/.

After Dipesh exports a fresh copy, put it in that folder and run, from the repo root:
  python3 docs/levelup/build_levelup.py

The words come from the source as they are. The page parts (head, header, footer, tables, images,
heading tree) come from the TaskGPT build script, so the two case studies stay alike. The
data-video values in the current case-levelup.html (Dipesh's animations) are kept on a rebuild.
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

SRC = os.path.expanduser('~/Downloads/levelup-source/')
PAGE = os.path.join(ROOT, 'case-levelup.html')
SCREENS = json.load(open(os.path.join(ROOT, 'docs/levelup/screens.json'), encoding='utf-8'))

# No hero (Dipesh, 25 Nov 2026): the page opens like the full TaskGPT case study, and the source's
# hero goes into it. Kept: the title, what LevelUp is (the opening paragraph), the dashboard picture,
# and these facts. Left out, because the Outcome section already says it: the second paragraph, the
# five numbers (the launch date is in Timeline) and the other facts.
KEEP_FACTS = ['Role', 'Team', 'Timeline', 'Platform']
SAID_IN_OUTCOME = ['Clients', 'Recognition']
READ_TIME = 'About 9 minutes to read'   # same pace as the full TaskGPT case study
# The opening paragraph: phrases in Fraunces italic, then the one with the hand-drawn line
# (see "Opening paragraphs" in CLAUDE.md). Every phrase is copied from that paragraph.
tg.LEDE_MARKS['levelup'] = (['a timed challenge', 'their own animated 3D characters'], 'wins something')
# Motion slots (brief, section 6): slot name -> the still image it shows until there is a video
SLOTS = {'hero': 'levelup-dashboard-1', 'overlay': 'levelup-overlay-1',
         'characters': 'levelup-characters-1', 'celebrate': 'levelup-celebrate-1'}
BEFORE_AFTER = 'Version 1.1 showed the score. The live product puts your own character on the screen.'
# The loop diagram (brief, section 5)
LOOP_TITLE = 'Every challenge runs the same loop'
LOOP = [('Set up', 'Manager, wizard'), ('Compete', 'Live leaderboard'), ('Celebrate', 'Flash screens'),
        ('Reward', 'Badges, points'), ('Review', 'Dashboard')]

TITLE = 'LevelUp case study: a game that runs on business logic | Dipesh Gurav'
DESC = ("How Dipesh Gurav designed LevelUp, TaskUs's gamification platform with animated 3D characters, "
        'presented at AWS Summit London 2025.')
# The bottom links follow the homepage's order (Dipesh, 25 Nov 2026), see CLAUDE.md
NEXT = '''<section class="next">
  <div class="wrap">
    <div class="mono next-label">Next case study</div>
    <a href="/case-taskgpt-full">
      <span class="nt">TaskGPT: <i>the AI that works inside the call</i></span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>'''


def kept_videos():
    """Dipesh's data-video values in the page as it is now, so a rebuild keeps his animations."""
    if not os.path.exists(PAGE):
        return {}
    old = open(PAGE, encoding='utf-8').read()
    return dict(re.findall(r'id="motion-([a-z]+)" data-video="([^"]*)"', old))


VIDEOS = kept_videos()
used = []


def figure(name, slot=None, eager=False):
    s = SCREENS[name]
    used.append(name)
    extra = f' motion-slot" id="motion-{slot}" data-video="{attr(VIDEOS.get(slot, ""))}' if slot else ''
    return (f'<figure class="shot{extra}"><div class="frame">{picture(name, s["alt"], s["w"], s["h"], eager)}</div>'
            f'<figcaption>{esc(s["caption"])}</figcaption></figure>')


def media(text):
    """The figures for a paragraph of markers: [IMAGE: ..], [IMAGE PAIR: ..], [BEFORE AND AFTER: ..], [MOTION SLOT: ..]"""
    marks = re.findall(r'\[(IMAGE PAIR|IMAGE|BEFORE AND AFTER|MOTION SLOT|LOOP DIAGRAM): ([^\]]+)\]', text)
    assert marks and not re.sub(r'\[[^\]]+\]', '', text).strip(), f'not only markers: {text[:80]}'
    slot_of = {}
    for kind, val in marks:
        if kind == 'MOTION SLOT':
            slot = val.split(',')[0].strip()
            slot_of[SLOTS[slot]] = slot
    out = []
    for kind, val in marks:
        names = re.findall(r'levelup-[a-z0-9]+-\d', val)
        if kind == 'IMAGE':
            out.append(figure(names[0], slot_of.get(names[0])))
        elif kind == 'IMAGE PAIR':
            out.append('<div class="pair">' + ''.join(figure(n, slot_of.get(n)) for n in names) + '</div>')
        elif kind == 'BEFORE AND AFTER':
            out.append('<figure class="pair-fig"><div class="pair">' + ''.join(figure(n) for n in names)
                       + f'</div><figcaption>{esc(BEFORE_AFTER)}</figcaption></figure>')
        elif kind == 'LOOP DIAGRAM':
            out.append(loop_html())
    return ''.join(out)


def loop_html():
    parts = []
    for i, (name, second) in enumerate(LOOP):
        if i:
            parts.append('<span class="lu-arrow" aria-hidden="true"><span class="g-wide">→</span><span class="g-narrow">↓</span></span>')
        here = ' is-centre' if name == 'Celebrate' else ''
        parts.append(f'<div class="loop-box{here}"><p class="loop-name">{name}</p><p class="loop-who">{second}</p></div>')
    return (f'<div class="loop lu-loop" role="figure" aria-label="{attr(LOOP_TITLE)}"><p class="loop-title">{esc(LOOP_TITLE)}</p>'
            f'<div class="lu-row">{"".join(parts)}</div>'
            '<p class="lu-return"><span class="lu-return-line" aria-hidden="true"></span><span class="lu-return-label">next challenge</span></p>'
            '<p class="lu-back">back to Set up</p></div>')


def main():
    files = sorted(glob.glob(os.path.join(SRC, 'levelup-case-study-source-*.md')), key=os.path.getmtime)
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

    # The opening, from the source's hero (see KEEP_FACTS)
    paras = [b['text'] for b in hero['blocks'] if b['t'] == 'p']
    title = re.fullmatch(r'\*\*(.+)\*\*', paras[0]).group(1)
    intro = paras[1]
    assert intro.startswith('LevelUp is '), intro[:40]
    facts = [b for b in hero['blocks'] if b['t'] == 'table'][1]
    assert [r[0] for r in facts['rows']] == KEEP_FACTS + SAID_IN_OUTCOME, facts['rows']
    hero_media = next(p for p in paras if p.startswith('[IMAGE'))
    poster = SLOTS['hero']
    assert poster in hero_media
    name, _, rest = title.partition(':')
    h1 = f'{esc(name)}: {esc(rest.strip())}'
    assert 'business logic' in h1
    h1 = h1.replace('business logic', '<i>business logic</i>')
    opening = (f'<h1>{h1}</h1>\n    <p class="readtime">{READ_TIME}</p>\n'
               f'    <p class="lede statement">{tg.statement(inline(intro), "levelup")}</p>\n'
               f'    {figure(poster, "hero", eager=True)}\n'
               f'    {table_html(["Fact", "Detail"], [r for r in facts["rows"] if r[0] in KEEP_FACTS], "LevelUp facts")}')

    # Body
    out, toc, ids = [], [], set()

    def new_id(text):
        i = slug(text)
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
            # **1. Your own animated character.** text -> a numbered h3, so it shows in the tree
            m = re.match(r'^\*\*(\d+)\.\s+(.+?)\.\*\*\s+(.*)$', b['text']) if b['t'] == 'p' else None
            if m:
                hid = new_id(f'{m.group(1)}. {m.group(2)}')
                out.append(f'<h3 id="{hid}"><span class="num">{m.group(1)}.</span> {inline(m.group(2))}</h3>')
                node['kids'].append({'id': hid, 'num': f'{m.group(1)}.', 'text': m.group(2), 'label': m.group(2), 'kids': []})
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
  <article class="doc lu-doc lu" id="content" tabindex="-1">
    {opening}
    {"".join(out)}
    <div class="doc-end"><a class="btn btn-outline" href="/#career"><span aria-hidden="true">←</span> Back to portfolio</a></div>
  </article>
</div>
</div>
{NEXT}'''
    html = tg.page('/case-levelup', TITLE, DESC, '/assets/levelup-dashboard-1.jpg', 'LevelUp', body, progress=True,
                   skip='#content', extra_before_main=bar)
    swaps = [
        ("<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->",
         "<!-- Built by docs/levelup/build_levelup.py from Dipesh's source file. Edit the source and rebuild rather than editing this file.\n"
         "     The one exception is data-video on the four motion slots: a rebuild keeps what is there (see \"Motion slots\" in CLAUDE.md). -->"),
        ('<link rel="stylesheet" href="/case-lead.css">\n', '<link rel="stylesheet" href="/case-lead.css">\n<link rel="stylesheet" href="/case-levelup.css">\n'),
        ('<script src="/case-lead.js" defer></script>\n', '<script src="/case-lead.js" defer></script>\n<script src="/motion-slots.js" defer></script>\n'),
    ]
    for a, b in swaps:
        assert html.count(a) == 1, a[:60]
        html = html.replace(a, b)
    assert '—' not in html, 'em dash'
    with open(PAGE, 'w', encoding='utf-8') as f:
        f.write(html)
    words = re.sub(r'<(figcaption|nav|svg)\b.*?</\1>', ' ', html[html.index('<main'):html.index('<section class="next">')], flags=re.S)
    words = re.sub(r'<[^>]+>', ' ', words)
    print(f'Wrote case-levelup.html: {len(toc)} sections, {sum(len(t["kids"]) for t in toc)} decisions, '
          f'{len(used)} screens, {len(re.findall(r"[A-Za-z0-9][^ ]*", words))} words without captions and tree')


if __name__ == '__main__':
    main()
