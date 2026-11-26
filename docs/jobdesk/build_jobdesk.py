#!/usr/bin/env python3
"""
Builds case-job-desk.html from Dipesh's source file (brief of 26 Nov 2026).

The source lives outside the repo so Vercel never publishes it:
  ~/Downloads/jobdesk-source/job-desk-case-study-source-*.md   (the newest is used)
Captions, alt text and sizes: docs/jobdesk/screens.json. The images are in assets/ (jobdesk-*-1), and the
walkthrough video is in docs/videos.json ("jobdesk").

After Dipesh exports a fresh copy, put it in that folder and run, from the repo root:
  python3 docs/jobdesk/build_jobdesk.py

The words come from the source as they are, apart from COPY_SWAPS. The page parts come from the TaskGPT build
script and the styles from the LevelUp page, so it reads like the Maestro, EvaluateUs and LevelUp pages.
Job Desk is a personal project, not a TaskUs product: nothing on this page may call it one.
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

SRC = os.path.expanduser('~/Downloads/jobdesk-source/')
PAGE = os.path.join(ROOT, 'case-job-desk.html')
SCREENS = json.load(open(os.path.join(ROOT, 'docs/jobdesk/screens.json'), encoding='utf-8'))

# No hero, like the Maestro, EvaluateUs and LevelUp pages (Dipesh, 26 Nov 2026): no chips and no number strip,
# because the Outcome section gives the same numbers. Kept: the title, both opening paragraphs, the
# walkthrough video and every fact.
FACTS = ['Role', 'Team', 'Timeline', 'Platform', 'Agents', 'Data', 'Status']
READ_TIME = 'About 10 minutes to read'
# The opening paragraph: phrases in Fraunces italic, then the one with the hand-drawn line
# (see "Opening paragraphs" in CLAUDE.md). Every phrase is copied from that paragraph.
tg.LEDE_MARKS['jobdesk'] = (['one web page with a shared database', 'in my own browser'], 'four AI agents')
# Heading ids (brief, section 4.1)
IDS = {
    'The brief': 'the-brief', 'The limits I wrote first': 'the-limits-i-wrote-first',
    'How the desk fits together': 'how-the-desk-fits-together', 'How it changed in use': 'how-it-changed-in-use',
    'Designing the desk': 'designing-the-desk',
    'One row per job, wherever it is listed': 'one-row-per-job',
    'A score that explains itself': 'a-score-that-explains-itself',
    'Small teams first, with evidence': 'small-teams-first',
    'Everything for one application in one place': 'everything-for-one-application',
    'Know where replies come from': 'know-where-replies-come-from',
    'A way out, and a way back': 'a-way-out-and-a-way-back',
    'Designing the agents': 'designing-the-agents',
    'Clear lines between the agents': 'clear-lines-between-the-agents',
    'Facts come from one record': 'facts-come-from-one-record',
    'Every run shows its working': 'every-run-shows-its-working',
    'A browser agent with good manners': 'a-browser-agent-with-good-manners',
    'I set the pace': 'i-set-the-pace',
    'What broke, and what I changed': 'what-broke', 'How I built it': 'how-i-built-it', 'Outcome': 'outcome',
    'Other things I built alone': 'other-things-i-built-alone', 'What I learned': 'what-i-learned',
}
# Dipesh's answers of 26 Nov 2026: Pattern Desk stays off the site until he gives it context (CLAUDE.md),
# and Job App Assistant links to its case study
COPY_SWAPS = [
    ('- **Pattern Desk.** A seven-day market pattern board for India, the UK and the USA, with data from Twelve Data and Alpha Vantage.\n', ''),
    ('- **Job App Assistant.** ', '- **[Job App Assistant](/case-job-app-assistant).** '),
]
# The two tables scroll sideways inside their own frame on a phone
TABLE_LABELS = {'How the desk fits together': 'Job Desk agents', 'How it changed in use': 'How Job Desk changed in use'}
BEFORE_AFTER = 'Mark a job Expired and it leaves the list, and its pack drops out of the counts. Restore puts it back.'
SLIM = ['jobdesk-narrow-1']   # a tall, narrow screen: at most 420px wide, centred
# The loop diagram (brief, section 4.4)
LOOP_TITLE = 'Every role runs the same loop'
LOOP = [('Find', 'Agents 1 and 4'), ('Score', 'Fit and team size'), ('Prepare', 'Agent 2 writes the pack'),
        ('Apply', 'Me, and only me'), ('Track', 'Agent 3 reads the inbox')]
LOOP_HIGHLIGHT = 'Apply'

TITLE = 'Job Desk case study: four agents do the legwork, I make the calls | Dipesh Gurav'
DESC = ('How Dipesh Gurav designed and built Job Desk, a job search desk with four AI agents that prepare '
        'everything and never press submit.')
# The bottom links follow the homepage's order (Dipesh, 26 Nov 2026), see CLAUDE.md
NEXT = '''<section class="next">
  <div class="wrap">
    <div class="mono next-label">Next case study</div>
    <a href="/case-job-app-assistant">
      <span class="nt">Job App Assistant: <i>building the back room, from scratch</i></span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>'''
# Words that must never be on this page (CLAUDE.md, retired claims)
BANNED = ['auto-apply', 'applies for me', 'the agents applied', 'built by AI', 'AI built it', 'claude.ai/artifact',
          'trig_', 'lorem', 'Pattern Desk', 'used by']

used = []


def figure(name):
    s = SCREENS[name]
    used.append(name)
    cls = 'shot slim' if name in SLIM else 'shot'
    return (f'<figure class="{cls}"><div class="frame">{picture(name, s["alt"], s["w"], s["h"])}</div>'
            f'<figcaption>{esc(s["caption"])}</figcaption></figure>')


def loop_html():
    parts = []
    for i, (name, second) in enumerate(LOOP):
        if i:
            parts.append('<span class="lu-arrow" aria-hidden="true"><span class="g-wide">→</span><span class="g-narrow">↓</span></span>')
        here = ' is-centre' if name == LOOP_HIGHLIGHT else ''
        parts.append(f'<div class="loop-box{here}"><p class="loop-name">{name}</p><p class="loop-who">{esc(second)}</p></div>')
    return (f'<div class="loop lu-loop" role="figure" aria-label="{attr(LOOP_TITLE)}"><p class="loop-title">{esc(LOOP_TITLE)}</p>'
            f'<div class="lu-row">{"".join(parts)}</div>'
            '<p class="lu-return"><span class="lu-return-line" aria-hidden="true"></span><span class="lu-return-label">next Run now</span></p>'
            '<p class="lu-back">back to Find</p></div>')


def media(text):
    """The figures for a marker: [IMAGE: ..], [IMAGE PAIR: ..], [BEFORE AND AFTER: ..] or [DIAGRAM: jobdesk-loop]"""
    m = re.fullmatch(r'\[(IMAGE PAIR|IMAGE|BEFORE AND AFTER|DIAGRAM): ([^\]]+)\]', text.strip())
    assert m, f'not a marker: {text[:80]}'
    if m.group(1) == 'DIAGRAM':
        assert m.group(2) == 'jobdesk-loop', m.group(2)
        return loop_html()
    names = re.findall(r'jobdesk-[a-z-]+?-\d', m.group(2))
    assert len(names) == (1 if m.group(1) == 'IMAGE' else 2), names
    if m.group(1) == 'IMAGE':
        return figure(names[0])
    pair = '<div class="pair">' + ''.join(figure(n) for n in names) + '</div>'
    if m.group(1) == 'IMAGE PAIR':
        return pair
    return f'<figure class="pair-fig">{pair}<figcaption>{esc(BEFORE_AFTER)}</figcaption></figure>'


def scroll_table(head, rows, label):
    """A table that scrolls sideways inside its frame, reachable by keyboard"""
    t = table_html(head, rows, label)
    assert t.startswith('<div class="table-wrap" role="region"')
    return t.replace('<div class="table-wrap" role="region"', '<div class="table-wrap" tabindex="0" role="region"', 1)


def main():
    files = sorted(glob.glob(os.path.join(SRC, 'job-desk-case-study-source-*.md')), key=os.path.getmtime)
    if not files:
        sys.exit(f'No source file in {SRC}')
    source = open(files[-1], encoding='utf-8').read()
    for a, b in COPY_SWAPS:
        if a in source:
            source = source.replace(a, b)
        elif b and b not in source:
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
    assert body_secs[0]['title'] == 'The brief' and body_secs[-1]['title'] == 'What I learned'

    # The opening, from the source's hero
    paras = [b['text'] for b in hero['blocks'] if b['t'] == 'p']
    title = re.fullmatch(r'\*\*(.+)\*\*', paras[0]).group(1)
    intro, second = paras[1], paras[2]
    assert intro.startswith('Job Desk is ') and second.startswith('The agents prepare.'), (intro[:30], second[:30])
    facts = [b for b in hero['blocks'] if b['t'] == 'table'][1]
    assert [r[0] for r in facts['rows']] == FACTS, facts['rows']
    assert '[VIDEO: jobdesk-walkthrough]' in paras
    name, _, rest = title.partition(':')
    h1 = f'{esc(name)}: {esc(rest.strip())}'
    assert h1.endswith('I make the calls')
    h1 = h1.replace('I make the calls', '<i>I make the calls</i>')
    opening = (f'<h1>{h1}</h1>\n    <p class="readtime">{READ_TIME}</p>\n'
               f'    <p class="lede statement">{tg.statement(inline(intro), "jobdesk")}</p>\n'
               f'    <p>{inline(second)}</p>\n'
               f'    {tg.case_video("jobdesk")}\n'
               f'    {table_html(["Fact", "Detail"], facts["rows"], "Job Desk facts")}')

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
                # ### 1. One row per job, wherever it is listed -> a numbered h3, so it shows in the tree
                m = re.fullmatch(r'(\d+)\.\s+(.+)', b['text'])
                text = m.group(2)
                hid = new_id(text)
                out.append(f'<h3 id="{hid}"><span class="num">{m.group(1)}.</span> {inline(text)}</h3>')
                node['kids'].append({'id': hid, 'num': f'{m.group(1)}.', 'text': text, 'label': text, 'kids': []})
            elif b['t'] == 'p':
                out.append(f'<p>{inline(b["text"])}</p>')
            elif b['t'] in ('ul', 'ol'):
                out.append(list_html(b))
            elif b['t'] == 'table':
                out.append(scroll_table(b['head'], b['rows'], TABLE_LABELS[s['title']]))
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
    html = tg.page('/case-job-desk', TITLE, DESC, '/assets/jobdesk-leads-1.jpg', 'Job Desk', body, progress=True,
                   skip='#content', extra_before_main=bar)
    swaps = [
        ("<!-- Built by docs/taskgpt/build_taskgpt.py from Dipesh's source files. Edit the source and rebuild rather than editing this file. -->",
         "<!-- Built by docs/jobdesk/build_jobdesk.py from Dipesh's source file. Edit the source and rebuild rather than editing this file. -->"),
        ('<link rel="stylesheet" href="/case-lead.css">\n', '<link rel="stylesheet" href="/case-lead.css">\n<link rel="stylesheet" href="/case-levelup.css">\n'),
    ]
    for a, b in swaps:
        assert html.count(a) == 1, a[:60]
        html = html.replace(a, b)
    assert '—' not in html, 'em dash'
    for w in BANNED:
        assert w.lower() not in html.lower(), f'"{w}" is on the page'
    assert 'TaskUs product' not in html
    with open(PAGE, 'w', encoding='utf-8') as f:
        f.write(html)

    def words(part):
        part = re.sub(r'<(figcaption|nav|svg|table)\b.*?</\1>', ' ', part, flags=re.S)
        return len(re.findall(r'[A-Za-z0-9][^ ]*', re.sub(r'<[^>]+>', ' ', part)))
    print(f'Wrote case-job-desk.html: {len(toc)} sections, {sum(len(t["kids"]) for t in toc)} decisions, '
          f'{len(used)} screens, {words(" ".join(out))} words of story, {words(opening)} more in the opening')


if __name__ == '__main__':
    main()
