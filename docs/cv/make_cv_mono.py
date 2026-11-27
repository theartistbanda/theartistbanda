# CV Mono for the CV (cv/Dipesh-Gurav-CV-master.html), from the recipe in its comment:
#   brew install fonttools; $(brew --prefix fonttools)/libexec/bin/python docs/cv/make_cv_mono.py ~/Library/Fonts cv/fonts
# The result matches the fonts in the 24 Nov 2026 PDF glyph for glyph (checked 27 Nov 2026).
# DejaVu Sans Mono with a fixed amount added to every
# glyph advance (205 units for Regular, 307 for Bold), family "CV Mono".
import sys
from fontTools.ttLib import TTFont
src_dir, out_dir = sys.argv[1], sys.argv[2]
for src, out, add, style, ps in [('DejaVuSansMono.ttf', 'CV-Mono.ttf', 205, 'Regular', 'CVMono-Regular'),
                                 ('DejaVuSansMono-Bold.ttf', 'CV-Mono-Bold.ttf', 307, 'Bold', 'CVMono-Bold')]:
    f = TTFont(f'{src_dir}/{src}')
    hm = f['hmtx'].metrics
    for g, (adv, lsb) in hm.items():
        hm[g] = (adv + add, lsb)
    f['hhea'].advanceWidthMax = max(a for a, _ in hm.values())
    f['OS/2'].xAvgCharWidth += add
    full = 'CV Mono' if style == 'Regular' else 'CV Mono Bold'
    name = f['name']
    for rec in list(name.names):
        if rec.nameID in (1, 2, 3, 4, 6, 16, 17):
            name.removeNames(nameID=rec.nameID)
    # The same names as the fonts embedded in the 24 Nov 2026 PDF
    uid = 'DejaVu Sans Mono' if style == 'Regular' else 'DejaVu Sans Mono Bold'
    for nid, val in [(1, 'CV Mono'), (2, style), (3, uid), (4, f'CV Mono {style}'), (6, ps)]:
        name.setName(val, nid, 3, 1, 0x409)
        name.setName(val, nid, 1, 0, 0)
    f.save(f'{out_dir}/{out}')
    print(out, 'advance of "A":', hm[f.getBestCmap()[ord("A")]][0])
