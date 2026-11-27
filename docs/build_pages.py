#!/usr/bin/env python3
"""Writes about.html (23 Nov 2026; career.html too until the CV moved onto the homepage).

Both pages run the homepage's React bundle; <body data-page> tells init.js which page to render.
This script writes their <head> (title, description, link previews) and the <noscript> text that
crawlers without JavaScript read, from the same content as the page: shared.jsx (via the
compiled shared.js). Run it after `npm run build` whenever the About or CV copy changes:

    npm run build && python3 docs/build_pages.py
"""
import html
import json
import re
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://dipeshgurav.com'

PAGES = {
    'about': {
        'title': 'About | Dipesh Gurav, Product Designer',
        'desc': ('Dipesh Gurav, product designer in Nottingham, UK: nine years in numbers, six beliefs behind '
                 'every design call, the person behind the work, and how to reach him.'),
        'schema': 'AboutPage',
        'name': 'About Dipesh Gurav',
    },
}


def portfolio():
    js = ("global.window={};global.React={};"
          "require('vm').runInThisContext(require('fs').readFileSync('shared.js','utf8'));"
          "process.stdout.write(JSON.stringify(window.PORTFOLIO));")
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))


def esc(s):
    return html.escape(s, quote=True)


def plain(s):
    """Bio text marks italics with *asterisks*; noscript keeps them as <em>."""
    parts = s.split('*')
    return ''.join(f'<em>{esc(p)}</em>' if i % 2 else esc(p) for i, p in enumerate(parts))


def linked(s):
    """Career text marks links as [text](/path) (Repos Pay, 27 Nov 2026); noscript keeps them as links."""
    parts = re.split(r'\[([^\]]+)\]\(([^)\s]+)\)', s)
    out = esc(parts[0])
    for i in range(1, len(parts), 3):
        out += f'<a href="{esc(parts[i + 1])}">{esc(parts[i])}</a>' + esc(parts[i + 2])
    return out


def noscript_about(P):
    m = ''.join(f'<li>{esc(str(x["value"]) + x["suffix"])}: {esc(x["label"])}</li>' for x in P['metrics'])
    pr = ''.join(f'<li><strong>{esc(x["title"])}</strong>: {esc(x["body"])}</li>' for x in P['principles'])
    bio = ''.join(f'<p>{plain(x)}</p>' for x in P['bio'])
    contact = ''.join(f'<li>{esc(x["label"])}: <a href="{esc(x["href"])}">{esc(x["value"])}</a></li>' for x in P['links'])
    return f'''<h1>{esc(P["tagline"])}</h1>
    <h2>I became a designer because technology is supposed to make life easier</h2>
    {bio}
    <h2>Six beliefs that decide every design call</h2>
    <ol>{pr}</ol>
    <h2 id="origin">An open competition, a golden bird, a mark India picked up</h2>
    <p>{esc(P["origin"])}</p>
    <ul>{m}</ul>
    <h2 id="contact">Drop a Hi!</h2>
    <ul>{contact}</ul>
    <p><a href="/#career">Career and case studies</a></p>'''


def noscript_career(P):
    out = ['<h1>Nine years, four cities, over a million downloads</h1>',
           '<p><a href="/dipesh-gurav-cv.pdf">Download the PDF CV</a></p>']
    for c in P['career']:
        dates = f' ({c["from"]} to {c["to"]})' if c.get('from') else ''
        out.append(f'<h2>{esc(c["role"])}, {esc(c["org"])}{esc(dates)}</h2>')
        out += [f'<p>{linked(x)}</p>' for x in c['body']]
        cases = [next(p for p in P['projects'] if p['id'] == i) for i in c.get('products', [])]
        if cases:
            out.append('<p>Case studies: ' + ' · '.join(f'<a href="{esc(p["href"])}">{esc(p["title"])}</a>' for p in cases) + '</p>')
    out.append('<p><a href="/about">About me</a> · <a href="/about#contact">Contact</a> · <a href="/">Experience</a></p>')
    return '\n    '.join(out)


def page(slug, P):
    c = PAGES[slug]
    assert len(c['desc']) <= 160, (slug, len(c['desc']))
    url = f'{SITE}/{slug}'
    ld = json.dumps({'@context': 'https://schema.org', '@type': c['schema'], 'name': c['name'], 'url': url,
                     'mainEntity': {'@type': 'Person', 'name': P['name'],
                                    # His old name, signed on some Behance projects (Dipesh, 23 Nov 2026)
                                    'alternateName': 'The Artist Banda', 'url': SITE}}, indent=2)
    body = noscript_about(P)
    out = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Written by docs/build_pages.py: edit the copy in shared.jsx, then run `npm run build && python3 docs/build_pages.py` -->
<title>{esc(c["title"])}</title>
<meta name="description" content="{esc(c["desc"])}">
<meta name="author" content="Dipesh Gurav">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{esc(c["title"])}">
<meta property="og:description" content="{esc(c["desc"])}">
<meta property="og:image" content="{SITE}/assets/og-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Dipesh Gurav">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(c["title"])}">
<meta name="twitter:description" content="{esc(c["desc"])}">
<meta name="twitter:image" content="{SITE}/assets/og-card.png">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<script type="application/ld+json">
{ld}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Fraunces:ital,wght@1,300;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<script>(function(d,t){{try{{t=localStorage.getItem('theme')}}catch(e){{}}if(t!=='dark'&&t!=='light')t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.setAttribute('data-theme',t)}})(document.documentElement)</script>
<link rel="stylesheet" href="/theme.css">
<link rel="stylesheet" href="/site.css">
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body data-page="{slug}">
<div id="root"></div>

<!-- Fallback content for crawlers that do not execute JavaScript -->
<noscript>
  <main style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 24px;color:var(--ink);background:var(--paper);">
    {body}
  </main>
</noscript>

<script defer src="/react.min.js"></script>
<script defer src="/react-dom.min.js"></script>
<script defer src="shared.js"></script>
<script defer src="variant-a.js"></script>
<script defer src="init.js"></script>
<script defer src="/theme.js"></script>
</body>
</html>
'''
    assert '—' not in out, f'em dash in {slug}'
    assert ' -- ' not in out, f'double hyphen in {slug}'
    return out


def main():
    P = portfolio()
    for slug in PAGES:
        with open(os.path.join(ROOT, f'{slug}.html'), 'w', encoding='utf-8') as f:
            f.write(page(slug, P))
    print('Wrote', ', '.join(f'{s}.html' for s in PAGES))


if __name__ == '__main__':
    main()
