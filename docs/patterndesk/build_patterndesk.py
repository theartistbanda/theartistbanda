#!/usr/bin/env python3
"""
Builds case-pattern-desk.html from Dipesh's source file (brief of 26 Nov 2026).

The source lives outside the repo so Vercel never publishes it:
  ~/Downloads/patterndesk-source/pattern-desk-case-study-source-*.md   (the newest is used)
Captions, alt text and sizes: docs/patterndesk/screens.json. The images are in assets/ (patterndesk-*-1), and the
walkthrough video is in docs/videos.json ("patterndesk").

After Dipesh exports a fresh copy, put it in that folder and run, from the repo root:
  python3 docs/patterndesk/build_patterndesk.py

The words come from the source as they are, apart from COPY_SWAPS. The page parts come from the TaskGPT build
script and the styles from the LevelUp page, so it reads like the Job Desk, Maestro and EvaluateUs pages.
Pattern Desk is a personal project, not a TaskUs product, and it is information, not trade advice: nothing on this
page may say that it predicts the market, trades on its own or made Dipesh money (CLAUDE.md).
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

SRC = os.path.expanduser('~/Downloads/patterndesk-source/')
PAGE = os.path.join(ROOT, 'case-pattern-desk.html')
SCREENS = json.load(open(os.path.join(ROOT, 'docs/patterndesk/screens.json'), encoding='utf-8'))

# No hero, like the Job Desk page (Dipesh, 26 Nov 2026): no chips and no number strip, because the facts table
# (Scope) and the story give the same numbers. Kept: the title, the opening paragraph, the video and every fact.
FACTS = ['Role', 'Collaborator', 'Timeline', 'Platform', 'Agents', 'Data', 'Scope', 'Status']
READ_TIME = 'About 10 minutes to read'
DISCLAIMER = 'It is information, not trade advice: I decide and I trade.'   # word for word, in the opening
# The opening paragraph: phrases in Fraunces italic, then the one with the hand-drawn line
# (see "Opening paragraphs" in CLAUDE.md). Every phrase is copied from that paragraph.
tg.LEDE_MARKS['patterndesk'] = (['what index traders watch', 'three paths with closing triggers'], 'every call')
# Heading ids (brief, section 4.1)
IDS = {
    'The brief': 'the-brief', 'Seven iterations, one live board': 'seven-iterations',
    'The day the board was wrong': 'the-day-the-board-was-wrong',
    'Checking the board against history': 'checking-against-history',
    'Agents that do the research, a page that does the maths': 'agents-and-the-page',
    'Key design decisions': 'key-design-decisions',
    'Odds and triggers, never a promise': 'odds-and-triggers',
    'Read the crowd before the news': 'read-the-crowd',
    'A score with no black box': 'a-score-with-no-black-box',
    'One fact, one home': 'one-fact-one-home',
    'Plain words for a daily read': 'plain-words',
    'Honest about what it does not know': 'honest-about-what-it-does-not-know',
    'A record that learns': 'a-record-that-learns',
    'Layers a trader can switch': 'layers-a-trader-can-switch',
    'Designing as an engineer': 'designing-as-an-engineer', 'Outcome': 'outcome',
    'What I learned': 'what-i-learned', 'What I would do next': 'what-i-would-do-next',
}
# The tools table links the other two case studies (brief, section 4.3)
COPY_SWAPS = [
    ('| Job Desk (link: `case-job-desk.html`) |', '| [Job Desk](/case-job-desk) |'),
    ('| Job App Assistant (link: `case-job-app-assistant.html`) |', '| [Job App Assistant](/case-job-app-assistant) |'),
]
# Screens the source places that stay off the page, with the reason. The file is not in assets/ either.
LEFT_OFF = {
    'patterndesk-context-1': 'six named traders and analysts with their views in other words (Dipesh, 26 Nov 2026)',
}
# Each table scrolls sideways inside its own frame on a phone
TABLE_LABELS = {'Seven iterations, one live board': 'How Pattern Desk changed, version by version',
                'Designing as an engineer': 'Tools I designed and built alone',
                'Outcome': 'Pattern Desk call record'}
RECORD = 'Outcome'   # the call record: numbers right-aligned, the "All" row bold

# The architecture diagram (brief, section 4.4)
ARCH_TITLE = 'Agents write the facts, the page does the maths'
ARCH_SUB = 'How one refresh moves from the sources to the board'
ARCH = [
    ('Sources', [('Quote APIs', 'Twelve Data, Alpha Vantage'), ('Web research', 'positioning, flows, news and levels'),
                 ('Bar data', 'Yahoo Finance, through Firecrawl')], None),
    ('Agents', [('I ask', '"refresh the board"'), ('Weekday refresh', 'pre-open and close work, 3 markets'),
                ('Sunday reset', 'grades setups, top 5, history, Monday')], None),
    ('Data store', '15 datasets, by agents', 'One home per fact, each with date and source'),
    ('Page', [('Desk', '3 markets at a glance'), ('Market pages', 'India, UK and USA'),
              ('Charts', '9 instruments, 5 timeframes, backtest')], 'Calcs run in the browser'),
]
ARCH_STORE = ['brief and markets', 'signals and paths', 'levels and closes', 'day cards', 'scorecard and setups',
              'prices and voices', 'calendar and history', 'episodes and decade']
ARCH_HIGHLIGHT = 'I ask'
ARCH_SKIP = 'Live quotes and bars skip the agents and go straight to the page'
ARCH_SKIP_NARROW = 'Live quotes and bars go straight from the sources to the page'

TITLE = 'Pattern Desk case study: a trading desk that shows its working | Dipesh Gurav'
DESC = ('How Dipesh Gurav designed and built Pattern Desk, a live market board with AI research agents that grades '
        'its own calls in the open.')
# "(Built with AI)" after the name in the title and in the link to Job App Assistant, as on the homepage cards
AI_NOTE = '<span class="ai-note">(Built with AI)</span>'
# The bottom links follow the homepage's order (Dipesh, 26 Nov 2026), see CLAUDE.md
NEXT = f'''<section class="next">
  <div class="wrap">
    <div class="mono next-label">Next case study</div>
    <a href="/case-job-app-assistant">
      <span class="nt">Job App Assistant {AI_NOTE}: <i>building the back room, from scratch</i></span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>'''
# Words that must never be on this page (CLAUDE.md, retired claims)
BANNED = ['predicts the market', 'beats the market', 'trading bot', 'auto-trade', 'built by AI', 'AI built it',
          'claude.ai/artifact', 'trig_', 'lorem', '48% accurate', 'TaskUs product']

used = []


def figure(name):
    s = SCREENS[name]
    used.append(name)
    return (f'<figure class="shot"><div class="frame">{picture(name, s["alt"], s["w"], s["h"])}</div>'
            f'<figcaption>{esc(s["caption"])}</figcaption></figure>')


def arrow():
    return ('<span class="lu-arrow pd-arrow" aria-hidden="true"><span class="g-wide">→</span>'
            '<span class="g-narrow">↓</span></span>')


def arch_html():
    cols = []
    for name, boxes, foot in ARCH:
        inner = []
        if isinstance(boxes, str):   # the data store: one box with its list
            inner.append(f'<div class="loop-box pd-store"><p class="loop-name">{esc(boxes)}</p>'
                         f'<ul>{"".join(f"<li>{esc(x)}</li>" for x in ARCH_STORE)}</ul></div>')
        else:
            for i, (box, line) in enumerate(boxes):
                here = ' is-centre' if box == ARCH_HIGHLIGHT else ''
                inner.append(f'<div class="loop-box{here}"><p class="loop-name">{esc(box)}</p>'
                             f'<p class="pd-line">{esc(line)}</p></div>')
                if box == ARCH_HIGHLIGHT:   # "I ask" starts the two agents below it
                    inner.append('<span class="pd-down" aria-hidden="true">↓</span>')
        if foot:
            inner.append(f'<p class="pd-foot">{esc(foot)}</p>')
        cols.append(f'<div class="pd-col"><p class="pd-col-name">{esc(name)}</p>{"".join(inner)}</div>')
    return (f'<div class="loop pd-arch" role="figure" aria-label="{attr(ARCH_TITLE)}">'
            f'<p class="loop-title">{esc(ARCH_TITLE)}</p><p class="pd-sub">{esc(ARCH_SUB)}</p>'
            f'<div class="pd-row">{arrow().join(cols)}</div>'
            f'<p class="pd-skip"><span class="pd-skip-line" aria-hidden="true"></span>'
            f'<span class="pd-skip-label">{esc(ARCH_SKIP)}</span></p>'
            f'<p class="pd-skip-narrow">{esc(ARCH_SKIP_NARROW)}</p></div>')


def media(text):
    """The figures for a marker: [IMAGE: ..] or [DIAGRAM: patterndesk-architecture]"""
    m = re.fullmatch(r'\[(IMAGE|DIAGRAM): ([^\]]+)\]', text.strip())
    assert m, f'not a marker: {text[:80]}'
    if m.group(1) == 'DIAGRAM':
        assert m.group(2) == 'patterndesk-architecture', m.group(2)
        return arch_html()
    name = m.group(2).strip()
    if name in LEFT_OFF:
        return ''
    return figure(name)


def scroll_table(head, rows, label):
    """A table that scrolls sideways inside its frame, reachable by keyboard"""
    t = table_html(head, rows, label)
    assert t.startswith('<div class="table-wrap" role="region"')
    return t.replace('<div class="table-wrap" role="region"', '<div class="table-wrap" tabindex="0" role="region"', 1)


def record_table(head, rows, label):
    """The call record: the number columns right-aligned, and the "All" row bold"""
    assert rows[-1][0] == 'All' and len(head) == 5, rows[-1]
    out = [f'<div class="table-wrap" tabindex="0" role="region" aria-label="{attr(label)}">',
           f'<table class="cols-5 pd-record"><thead><tr><th scope="col">{inline(head[0])}</th>']
    out += [f'<th scope="col" class="num">{inline(h)}</th>' for h in head[1:]]
    out.append('</tr></thead><tbody>')
    for r in rows:
        total = ' class="total"' if r[0] == 'All' else ''
        out.append(f'<tr{total}><th scope="row">{inline(r[0])}</th>' +
                   ''.join(f'<td class="num">{inline(c)}</td>' for c in r[1:]) + '</tr>')
    out.append('</tbody></table></div>')
    return ''.join(out)


def main():
    files = sorted(glob.glob(os.path.join(SRC, 'pattern-desk-case-study-source-*.md')), key=os.path.getmtime)
    if not files:
        sys.exit(f'No source file in {SRC}')
    source = open(files[-1], encoding='utf-8').read()
    for a, b in COPY_SWAPS:
        if a in source:
            source = source.replace(a, b)
        elif b not in source:
            print(f'  note: the source has neither wording of "{a[:50]}", check COPY_SWAPS')
    # The notes above "## Hero" are for the builder, not the page
    source = source[source.index('## Hero'):]
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
    assert body_secs[0]['title'] == 'The brief' and body_secs[-1]['title'] == 'What I would do next'

    # The opening, from the source's hero
    paras = [b['text'] for b in hero['blocks'] if b['t'] == 'p']
    title = re.fullmatch(r'\*\*(.+)\*\*', paras[0]).group(1)
    assert paras[1] == READ_TIME, paras[1]
    intro = paras[2]
    assert intro.startswith('Pattern Desk is ') and intro.endswith(DISCLAIMER), intro[-80:]
    facts = [b for b in hero['blocks'] if b['t'] == 'table'][1]
    assert [r[0] for r in facts['rows']] == FACTS, facts['rows']
    assert '[VIDEO: patterndesk-walkthrough]' in paras
    name, _, rest = title.partition(':')
    m = re.fullmatch(r'(.+?)_(.+)_', rest.strip())   # "a trading desk that _shows its working_"
    # "(Built with AI)" after the name, as on the homepage card (Dipesh, 26 Nov 2026)
    h1 = f'{esc(name)} {AI_NOTE}: {esc(m.group(1))}<i>{esc(m.group(2))}</i>'
    opening = (f'<h1>{h1}</h1>\n    <p class="readtime">{READ_TIME}</p>\n'
               f'    <p class="lede statement">{tg.statement(inline(intro), "patterndesk")}</p>\n'
               f'    {tg.case_video("patterndesk")}\n'
               f'    {table_html(["Fact", "Detail"], facts["rows"], "Pattern Desk facts")}')

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
            elif b['t'] == 'h' and b['level'] == 3:
                # "### 1. Odds and triggers ..." is a numbered decision; "### The day the board was wrong" is not.
                # Both are h3, so they show in the tree.
                m = re.fullmatch(r'(\d+)\.\s+(.+)', b['text'])
                num, text = (m.group(1) + '.', m.group(2)) if m else ('', b['text'])
                hid = new_id(text)
                lead = f'<span class="num">{num}</span> ' if num else ''
                out.append(f'<h3 id="{hid}">{lead}{inline(text)}</h3>')
                node['kids'].append({'id': hid, 'num': num, 'text': text, 'label': text, 'kids': []})
            elif b['t'] == 'p':
                out.append(f'<p>{inline(b["text"])}</p>')
            elif b['t'] in ('ul', 'ol'):
                out.append(list_html(b))
            elif b['t'] == 'table':
                label = TABLE_LABELS[s['title']]
                out.append(record_table(b['head'], b['rows'], label) if s['title'] == RECORD
                           else scroll_table(b['head'], b['rows'], label))
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
    html = tg.page('/case-pattern-desk', TITLE, DESC, '/assets/patterndesk-desk-1.jpg', 'Pattern Desk', body,
                   progress=True, skip='#content', extra_before_main=bar)
    swaps = [
        ("<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->",
         "<!-- Built by docs/patterndesk/build_patterndesk.py from Dipesh's source file. Edit the source and rebuild rather than editing this file. -->"),
        ('<link rel="stylesheet" href="/case-lead.css">\n', '<link rel="stylesheet" href="/case-lead.css">\n<link rel="stylesheet" href="/case-levelup.css">\n'),
    ]
    for a, b in swaps:
        assert html.count(a) == 1, a[:60]
        html = html.replace(a, b)
    assert '—' not in html, 'em dash'
    for w in BANNED:
        assert w.lower() not in html.lower(), f'"{w}" is on the page'
    # The opening says it; decision 6 also describes the board's own label, in Dipesh's words
    assert DISCLAIMER in opening and html.count('not trade advice') == 2, html.count('not trade advice')
    for f in LEFT_OFF:
        assert f not in html, f
    with open(PAGE, 'w', encoding='utf-8') as f:
        f.write(html)

    def words(part, tables=False):
        drop = 'figcaption|nav|svg' + ('' if tables else '|table')
        part = re.sub(rf'<({drop})\b.*?</\1>', ' ', part, flags=re.S)
        part = re.sub(r'<div class="loop pd-arch".*?class="pd-skip-narrow">.*?</p></div>', ' ', part, flags=re.S)
        return len(re.findall(r'[A-Za-z0-9][^ ]*', re.sub(r'<[^>]+>', ' ', part)))
    story = ' '.join(out)
    print(f'Wrote case-pattern-desk.html: {len(toc)} sections, {sum(len(t["kids"]) for t in toc)} sub-sections, '
          f'{len(used)} screens, {words(story)} words of story ({words(story, True)} with the tables), '
          f'{words(opening)} more in the opening')


if __name__ == '__main__':
    main()
