// Character for the case study pages (Dipesh, 23 to 24 Nov 2026), see case-lead.css. It only
// wraps words in spans: it never adds, drops or changes one.
// 1. The opening paragraph (.lede.statement) fills from grey to ink once as the page opens.
// 2. Figures in every paragraph (17%, 35,000, 70,000+, 300+, 1M+, a million) are set in the
//    serif italic, as on the homepage.
// 3. Every section heading gets the hand-drawn line under one word: the last word of its italic
//    phrase, or its last word. It draws once as the section scrolls in.
// 4. Every section's first paragraph is set larger and fills from grey to ink once in view.
(function () {
  var main = document.querySelector('main');
  if (!main) return;
  var still = !window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = 'http://www.w3.org/2000/svg';

  function textNodes(root) {
    var out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while (w.nextNode()) out.push(w.currentNode);
    return out;
  }

  // Words into spans, so they can fill one after another
  function splitWords(p) {
    var words = [];
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            var s = document.createElement('span');
            s.className = 'w';
            s.textContent = t;
            frag.appendChild(s);
            words.push(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.namespaceURI !== SVG && !n.classList.contains('sr-only')) {
          // (text only screen readers hear, such as "opens in a new tab", is left as it is)
          split(n);
        }
      });
    })(p);
    return words;
  }
  function stagger(words, total, start) {
    var step = Math.min(30, total / Math.max(1, words.length));
    words.forEach(function (w, i) { w.style.animationDelay = Math.round(start + i * step) + 'ms'; });
    return start + words.length * step;
  }

  function line(width) {
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 300 24');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS(SVG, 'path');
    path.setAttribute('d', 'M4 15 C 52 6, 98 20, 150 12 S 246 5, 296 13');
    path.setAttribute('pathLength', '1');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', width);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(path);
    return svg;
  }

  // Things in view get .is-in once, then are left alone
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      e.target.classList.remove('is-waiting');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.25 }) : null;
  function watch(el) {
    if (still || !io) { el.classList.add('is-in'); return; }
    el.classList.add('is-waiting');
    io.observe(el);
  }

  // 2. Figures
  var FIG = /(\b\d{1,3}(?:,\d{3})+\+?|\b\d+(?:\.\d+)?%|\b\d+\+(?=[\s.,;:)]|$)|\b\d+(?:\.\d+)?[MK]\+?|\b(?:a|one) million\b)/g;
  var SKIP = 'a, button, h1, h2, h3, h4, h5, h6, figcaption, table, code, nav, footer, .statement, .mono, .stats, .stat, .meta, .chips, .crumb, .kind, .toc, .btn, .cap, .n, .ns, .fig, .impact, .cover-stat, .mf-grid';
  Array.prototype.slice.call(main.querySelectorAll('p, li')).forEach(function (el) {
    if (el.closest(SKIP)) return;
    textNodes(el).forEach(function (n) {
      if (!n.parentNode || n.parentNode.closest(SKIP)) return;
      var t = n.textContent;
      FIG.lastIndex = 0;
      if (!FIG.test(t)) return;
      var frag = document.createDocumentFragment(), last = 0, m;
      FIG.lastIndex = 0;
      while ((m = FIG.exec(t))) {
        if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index)));
        var s = document.createElement('span');
        s.className = 'fig';
        s.textContent = m[0];
        frag.appendChild(s);
        last = m.index + m[0].length;
      }
      if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  });

  // 1. The opening paragraph
  var lede = document.querySelector('.lede.statement');
  if (lede) {
    if (still) {
      lede.classList.add('is-filling');
    } else {
      var end = stagger(splitWords(lede), 1400, 150);
      lede.style.setProperty('--line-delay', Math.round(end + 300) + 'ms');
      lede.classList.add('is-filling');
    }
  }

  // 3. Section headings
  var STOP = /^(a|an|the|of|on|in|to|up|it|is|at|by|for|and|or|from|with|as|be|we|its|off|out)$/i;
  var HEADS = 'section.body .section-head h2, .story-body .block > h2, .doc h2.part .part-title, .doc h3';
  Array.prototype.slice.call(main.querySelectorAll(HEADS)).forEach(function (h) {
    var italics = h.querySelectorAll('i, em');
    var scope = italics.length ? italics[italics.length - 1] : h;
    var nodes = textNodes(scope).filter(function (n) { return /\S/.test(n.textContent) && !n.parentNode.closest('.num, .part-num'); });
    var n = nodes[nodes.length - 1];
    if (!n) return;
    var m = n.textContent.match(/^([\s\S]*?)(\S+?)([.,!?:;)]*)(\s*)$/);
    if (!m) return;
    var pre = m[1], word = m[2];
    // A short word ("up", "on", "it", "from") takes the word before it: "picked up", "shipped it"
    if (word.length < 3 || STOP.test(word)) {
      var pm = pre.match(/^([\s\S]*?)(\S+\s+)$/);
      if (pm) { pre = pm[1]; word = pm[2] + word; }
    }
    // An opening bracket stays outside the line: "AuthorAI (TaskScribe)" marks "TaskScribe"
    if (word.charAt(0) === '(') { pre += '('; word = word.slice(1); }
    m[1] = pre;
    var mark = document.createElement('span');
    mark.className = 'sec-mark';
    mark.textContent = word;
    mark.appendChild(line(h.closest('.doc') ? '2.2' : '2.6'));
    var frag = document.createDocumentFragment();
    if (m[1]) frag.appendChild(document.createTextNode(m[1]));
    frag.appendChild(mark);
    if (m[3] || m[4]) frag.appendChild(document.createTextNode(m[3] + m[4]));
    n.parentNode.replaceChild(frag, n);
    watch(mark);
  });

  // 4. Each section's first paragraph
  var OPENERS = 'section.body .prose > p:first-child, section.body .hub-body > p:first-child, ' +
                '.story-body .block > p.lead, .story-body .block > .facts + p, .story-body .block > h2 + p, .doc h3 + p';
  Array.prototype.slice.call(main.querySelectorAll(OPENERS)).forEach(function (p) {
    if (p.classList.contains('statement') || p.className.replace(/\b(lead)\b/, '').trim()) return;
    if (p.querySelector('.btn') || p.textContent.trim().length < 60) return;
    p.classList.add('opener');
    if (!still) stagger(splitWords(p), 1100, 80);
    watch(p);
  });
})();
