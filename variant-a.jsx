// Variant A: SWISS GRID (Responsive)
// Desktop: strict 12-col grid. Tablet: 2-col adaptive. Mobile: single column.

// Paste your deployed Google Apps Script URL here after setup:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhhi3HmoZQ5Omybk_s424iDbCbdbDDXTCOFfGYhl9jjVqny_VoS9q0g-WLwCW6-5sX/exec';

const A = {
  // Colours come from /theme.css so the light/dark toggle can swap them
  paper: 'var(--paper)',
  paper2: 'var(--paper2)',
  ink: 'var(--ink)',
  ink2: 'var(--ink2)',
  mute: 'var(--mute)',
  line: 'var(--line)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  surf: 'var(--surf)',
};

const aStyles = {
  root: {
    background: A.paper,
    color: A.ink,
    fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif',
    fontSize: 13,
    lineHeight: 1.5,
    letterSpacing: '-0.005em'
  },
  mono: {
    fontFamily: '"JetBrains Mono", ui-monospace, "IBM Plex Mono", Menlo, monospace',
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: A.mute
  },
  // CTA type scale: readable at arm's length, unlike the 10px meta labels.
  // Primary pairs paper text on the ink-coloured accent (about 17:1 or more).
  cta: {
    fontFamily: '"JetBrains Mono", ui-monospace, "IBM Plex Mono", Menlo, monospace',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase'
  }
};

// Consistent side padding per breakpoint
function sp(bp) {
  return bp.isMobile ? '16px' : bp.isTablet ? '24px' : '32px';
}

// ─── AVAILABILITY BANNER ─────────────────────────────────────────────────────
// The contact form lives at the bottom of /about; other pages link to it there
function contactHref(page) {
  return page === 'about' ? '#contact' : '/about#contact';
}

// React draws the page after load, so the browser cannot jump to a #section by itself.
// Jump once the page has rendered, and again when web fonts have settled the layout.
function useHashTarget() {
  React.useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (!target) return;
    const go = () => target.scrollIntoView();
    requestAnimationFrame(() => requestAnimationFrame(go));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  }, []);
}

// "Built with AI" (Job App Assistant, Pattern Desk) is hidden until it has proper context
// (Dipesh, 23 Nov 2026). Its section, cards and data stay in the code: set to true to show.
const SHOW_BUILT = false;

// Old links to homepage sections that moved on 23 Nov 2026 go to their new pages
// (#work was the Experience list, which became the CV on the homepage the same day.)
const MOVED_SECTIONS = {
  '#contact': '/about#contact', '#origin': '/about#origin', '#studio': '/about#studio',
  '#principles': '/about#principles', '#work': '/#career',
};

function ABanner({ page = 'home' }) {
  const bp = useBreakpoint();
  const side = sp(bp);
  return (
    <React.Fragment>
      <style>{`@keyframes abPulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
      <div style={{
        background: A.surf,
        borderBottom: '1px solid rgba(var(--ink-rgb), 0.1)',
        padding: `9px ${side}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 99, background: A.accent,
          display: 'inline-block', flexShrink: 0,
          animation: 'abPulse 2s ease-in-out 3'
        }} />
        <span style={{ ...aStyles.mono, color: 'rgba(var(--ink-rgb), 0.72)', fontSize: bp.isMobile ? 9 : 10 }}>
          {bp.isMobile
            ? 'Right to work in the UK · Available now'
            : 'Right to work in the UK · No sponsorship required · Available now · Remote, hybrid or on-site'}
        </span>
        <a href={contactHref(page)} data-cursor="hover" style={{
          ...aStyles.mono, fontSize: bp.isMobile ? 9 : 10, fontWeight: 500,
          color: A.accent, textDecoration: 'none', flexShrink: 0
        }}>Get in touch →</a>
      </div>
    </React.Fragment>
  );
}

// Back from a case study should land where the visitor left the homepage, not at the top.
// React renders after load, so the browser's own scroll restore fires before the content
// exists. Remember the position ourselves and restore it once the page has rendered.
const HOME_SCROLL_KEY = 'home-scroll-y';
function useHomeScrollMemory() {
  React.useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const save = () => { try { sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(window.scrollY))); } catch (e) {} };
    window.addEventListener('pagehide', save);

    let y = 0;
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      // Browser Back, or the "← Portfolio" link on a case page (it sets home-restore)
      if ((nav && nav.type === 'back_forward') || sessionStorage.getItem('home-restore') === '1') {
        y = Number(sessionStorage.getItem(HOME_SCROLL_KEY)) || 0;
      }
      sessionStorage.removeItem('home-restore');
    } catch (e) {}

    const target = location.hash && document.getElementById(location.hash.slice(1));
    const go = () => { if (y) window.scrollTo(0, y); else if (target) target.scrollIntoView(); };
    if (y || target) {
      requestAnimationFrame(() => requestAnimationFrame(go));
      // Web fonts can shift the layout slightly; settle once more when they are ready
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    }
    return () => window.removeEventListener('pagehide', save);
  }, []);
}

// Header, main and footer shared by the three React pages (home, /about, /career)
function ASiteShell({ page, children }) {
  // The homepage hero fills the screen below the sticky header: share the header's height
  const headerRef = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    set();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div style={aStyles.root}>
      <a href="#main" className="skip-link">Skip to content</a>
      <CustomCursor accent={A.accent} />
      <header ref={headerRef} style={{ position: 'sticky', top: 0, zIndex: 82 }}>
        <ABanner page={page} />
        <ANav page={page} />
      </header>
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </main>
      <AFooter />
    </div>
  );
}

// Homepage (Dipesh, 23 Nov 2026): the hello, then the CV company by company, each role with its
// case studies as cards; under TaskUs, TaskGPT stays expanded into its products. The Career page
// and the Experience list merged into this. The numbers, beliefs, bio, origin story and contact
// live on /about.
function VariantA() {
  const moved = MOVED_SECTIONS[location.hash];
  React.useLayoutEffect(() => { if (moved) location.replace(moved); }, []);
  useHomeScrollMemory();
  return (
    <ASiteShell page="home">
      <AHero />
      <ACareer />
      {SHOW_BUILT && <ABuilt />}
    </ASiteShell>
  );
}

// /about, redesigned as one page (Dipesh, 23 Nov 2026) rather than a stack of former homepage
// sections: the intro with the numbers, the person behind the work, the six beliefs, the origin
// story, then contact.
function AboutPage() {
  useHashTarget();
  return (
    <ASiteShell page="about">
      <AAboutIntro />
      <APerson />
      <ABeliefs />
      <AOrigin />
      <AContact />
    </ASiteShell>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
// Light/dark switch. /theme.js handles the click and remembers the choice;
// /theme.css swaps the icon and the screen reader label to match the theme.
function AThemeToggle() {
  return (
    <button type="button" className="theme-toggle" data-theme-toggle="" data-cursor="hover">
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" /></svg>
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></svg>
      <span className="sr-only label-to-dark">Switch to dark theme</span>
      <span className="sr-only label-to-light">Switch to light theme</span>
    </button>
  );
}

// The menu since 23 Nov 2026 (Dipesh): one "About me" button ("Career" on /about), in the outline style of the
// "Download PDF résumé" button. "Get in touch" lives only in the banner above. No link list, no
// clock, no hamburger.
function ANav({ page = 'home' }) {
  const bp = useBreakpoint();
  const isHome = page === 'home';
  const pad = bp.isMobile ? '10px 12px' : '10px 16px';
  const btn = {
    ...aStyles.cta, padding: pad, textDecoration: 'none',
    display: 'inline-flex', gap: 8, alignItems: 'center', flexShrink: 0
  };

  return (
    <nav aria-label="Main" style={{
      background: 'rgba(var(--paper-rgb), 0.92)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${A.line}`
    }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto',
        padding: `0 ${sp(bp)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, gap: bp.isMobile ? 8 : 16
      }}>
        {/* Logo: back to the top of the homepage, or to the homepage from another page */}
        <a href="/" data-cursor="hover" aria-label={isHome ? 'Dipesh Gurav, back to top' : 'Dipesh Gurav, home'}
          onClick={(e) => {
            if (!isHome) return;
            e.preventDefault();
            const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            if (location.hash) history.replaceState(null, '', location.pathname);
          }}
          style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexShrink: 0, color: 'inherit', textDecoration: 'none' }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: A.accent, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Dipesh Gurav</span>
        </a>

        <div style={{ display: 'flex', gap: bp.isMobile ? 8 : 12, alignItems: 'center' }}>
          <AThemeToggle />
          {/* On /about the button reads "Career" and goes back to the CV on the homepage (Dipesh, 24 Nov 2026) */}
          <a href={page === 'about' ? '/#career' : '/about'} data-cursor="hover" className="cta cta-outline"
            style={{ ...btn, fontWeight: 500, color: A.ink, border: '1px solid rgba(var(--ink-rgb), 0.2)' }}>
            {page === 'about' ? 'Career' : 'About me'} <span className="cta-arrow" style={{ color: A.accent }}>→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

// A word with a hand-drawn line under it, which draws itself once (.scribble in /site.css).
// `delay` is how long it waits: after the homepage hello has faded in, or sooner on /about.
function AScribble({ children, stroke = 5, delay }) {
  return (
    <span className="scribble-wrap">
      {children}
      <svg className="scribble" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false"
        style={delay ? { '--scribble-delay': delay } : undefined}>
        <path d="M4 15 C 52 6, 98 20, 150 12 S 246 5, 296 13" pathLength="1" fill="none"
          stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

// ─── CHARACTER ON /about (Dipesh, 24 Nov 2026) ───────────────────────────────
// The same pieces as the case studies (case-lead.css): the hand-drawn line under one word of each
// section heading, drawn once in view; each section's first paragraph larger and filling from grey
// to ink once in view; figures in the serif italic. Words never change. Styles in /site.css.
const FIG_RE = /(\b\d{1,3}(?:,\d{3})+\+?|\b\d+(?:\.\d+)?%|\b\d+\+(?=[\s.,;:)]|$)|\b\d+(?:\.\d+)?[MK]\+?|\b(?:a|one) million\b)/g;

function ASecLine({ children, stroke = 2.6 }) {
  const [ref, inView] = useReveal({ threshold: 0.6 });
  return (
    <span ref={ref} className={`sec-mark ${inView ? 'is-in' : 'is-waiting'}`}>
      {children}
      <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M4 15 C 52 6, 98 20, 150 12 S 246 5, 296 13" pathLength="1" fill="none"
          stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

// Text with *italics* and figures, optionally with every word in a span for the fill
function richText(text, fill) {
  const total = text.replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
  const step = Math.min(30, 1100 / Math.max(1, total));
  let n = 0;
  const words = (s, key) => s.split(/(\s+)/).filter(Boolean).map((w, x) => (
    /^\s+$/.test(w) || !fill ? w
      : <span key={`${key}-${x}`} className="w" style={{ animationDelay: `${Math.round(80 + (n++) * step)}ms` }}>{w}</span>
  ));
  return text.split(/\*(.+?)\*/).map((part, j) => {
    const nodes = [];
    let last = 0, m;
    FIG_RE.lastIndex = 0;
    while ((m = FIG_RE.exec(part))) {
      if (m.index > last) nodes.push(...words(part.slice(last, m.index), `${j}a${m.index}`));
      nodes.push(<span key={`${j}f${m.index}`} className="fig">{words(m[0], `${j}f${m.index}`)}</span>);
      last = m.index + m[0].length;
    }
    if (last < part.length) nodes.push(...words(part.slice(last), `${j}z`));
    return j % 2 ? <em key={j}>{nodes}</em> : <React.Fragment key={j}>{nodes}</React.Fragment>;
  });
}

// A section's first paragraph: fills from grey to ink once in view (all ink with reduced motion)
function AFill({ text, style }) {
  const [ref, inView] = useReveal({ threshold: 0.25 });
  return <p ref={ref} className={`opener ${inView ? 'is-in' : 'is-waiting'}`} style={style}>{richText(text, true)}</p>;
}

// ─── HERO ────────────────────────────────────────────────────────────────────
// Dipesh, 23 Nov 2026: only the hello, filling the screen below the header on every size.
// Left aligned and large enough to span the width, in a hand-drawn face (Caveat) for warmth,
// with a hand-drawn line under the last word. No title row, no buttons. The two lines fade in
// once and the line draws itself once (.hello, .scribble in /site.css); with reduced motion
// everything is simply there.
function AHero() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const [hi, line] = PORTFOLIO.hello;
  const words = line.split(' ');
  const last = words.pop();
  // As large as the screen allows. In Caveat "conversations" is about 4.6 times the font size wide,
  // so on phones the size follows the width and that word always fits on its line.
  // On short screens (a phone on its side, a small laptop) the height caps the size too, so the
  // whole hello always fits in the first screen.
  const room = 'calc(100vh - var(--header-h, 90px))';
  const bigW = bp.isMobile ? 'clamp(44px, calc((100vw - 32px) * 0.19), 88px)'
    : bp.isTablet ? 'clamp(76px, calc((100vw - 48px) * 0.135), 124px)'
    : 'clamp(100px, 9.6vw, 172px)';
  const smallW = bp.isMobile ? 'clamp(30px, 10vw, 46px)' : bp.isTablet ? 'clamp(44px, 6.4vw, 64px)' : 'clamp(52px, 4.4vw, 76px)';
  const big = `min(${bigW}, ${room} * 0.2)`;
  const small = `min(${smallW}, ${room} * 0.1)`;

  return (
    <section className="hero-full" style={{
      padding: `${bp.isMobile ? 40 : 64}px ${side}`, borderBottom: `1px solid ${A.line}`,
      display: 'flex', alignItems: 'center'
    }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', width: '100%' }}>
        <h1 className="hello hand" style={{
          fontSize: small, fontWeight: 500, lineHeight: 1, letterSpacing: 0,
          color: A.ink2, margin: 0
        }}>
          {hi}
        </h1>
        <p className="hello hello-2 hand" style={{
          fontSize: big, fontWeight: 600, lineHeight: 0.98, letterSpacing: '-0.005em',
          color: A.ink, margin: `${bp.isMobile ? 16 : 20}px 0 0`, textWrap: 'pretty'
        }}>
          {words.join(' ')}{' '}
          <AScribble stroke={bp.isMobile ? 3 : 5}>{last}</AScribble>
        </p>
      </div>
    </section>
  );
}

// ─── ABOUT PAGE (/about) ─────────────────────────────────────────────────────
// After the intro, each section keeps its label in a left rail on desktop (sticky while you read)
// and its content in the nine columns beside it, so the page reads as one piece.
function ARail({ id, label, tone, children }) {
  const bp = useBreakpoint();
  const side = sp(bp);
  return (
    <section id={id} style={{
      padding: `${bp.isMobile ? 64 : 112}px ${side}`,
      background: tone === 'surf' ? A.surf : A.paper, borderTop: `1px solid ${A.line}`
    }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto', display: 'grid',
        gridTemplateColumns: bp.isDesktop ? 'repeat(12, minmax(0, 1fr))' : 'minmax(0, 1fr)',
        columnGap: 24, rowGap: 20
      }}>
        <div style={bp.isDesktop ? { gridColumn: 'span 3' } : undefined}>
          <p style={{
            ...aStyles.mono, color: A.accent, margin: 0,
            ...(bp.isDesktop ? { position: 'sticky', top: 'calc(var(--header-h, 90px) + 32px)' } : {})
          }}>{label}</p>
        </div>
        <div style={{ gridColumn: bp.isDesktop ? 'span 9' : undefined, minWidth: 0 }}>{children}</div>
      </div>
    </section>
  );
}

function aboutH2(bp) {
  return { fontSize: bp.isMobile ? 28 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.08, margin: 0, color: A.ink, textWrap: 'balance', maxWidth: 900 };
}

// The opening: the tagline in the homepage's hand-drawn face (his own voice), and the four numbers
// as one quiet row rather than a band of boxes. (The summary moved to the homepage, 23 Nov 2026.)
function AAboutIntro() {
  const bp = useBreakpoint();
  const side = sp(bp);
  return (
    <section style={{ padding: `${bp.isMobile ? '48px' : '88px'} ${side} ${bp.isMobile ? '56px' : '96px'}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 20 }}>About</div>
        <h1 className="hand" style={{
          fontWeight: 600,
          fontSize: bp.isMobile ? 'clamp(44px, 13vw, 64px)' : bp.isTablet ? 'clamp(60px, 9vw, 88px)' : 'clamp(72px, 6.6vw, 112px)',
          lineHeight: 1, letterSpacing: '-0.005em', textWrap: 'balance',
          margin: 0, maxWidth: 1100, color: A.ink
        }}>
          Designing for the humans behind the <AScribble stroke={bp.isMobile ? 3 : 4} delay=".4s">pixels</AScribble>
        </h1>
      </div>
    </section>
  );
}

// The four numbers, above the contact form (Dipesh, 24 Nov 2026; they sat under the heading at
// the top of /about): the proof just before the ask.
function AAboutNumbers() {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal({ threshold: 0.2 });
  return (
    <ul ref={ref} style={{
      listStyle: 'none', padding: `0 0 ${bp.isMobile ? 32 : 40}px`, margin: `0 0 ${bp.isMobile ? 40 : 56}px`,
      borderBottom: `1px solid ${A.line}`, display: 'grid',
      gridTemplateColumns: bp.isDesktop ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
      columnGap: 24, rowGap: 32
    }}>
      {PORTFOLIO.metrics.map((m, i) => <AAboutNumber key={i} m={m} i={i} inView={inView} bp={bp} />)}
    </ul>
  );
}

// Counts up once when it comes into view (instantly with reduced motion)
function AAboutNumber({ m, i, inView, bp }) {
  const v = useCounter(m.value || 0, inView, 1400 + i * 120);
  return (
    <li style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: bp.isMobile ? 40 : 56, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, color: A.ink }}>
        {fmt(v, { decimals: 0 })}{m.suffix}
      </span>
      <span style={{ fontSize: 14, color: A.ink, marginTop: 8 }}>{m.label}</span>
      <span style={aStyles.mono}>{m.sub}</span>
    </li>
  );
}

// The person behind the work: the bio as a reading column (the first paragraph as its opening),
// then the facts that used to sit in a sidebar, laid out under it.
function APerson() {
  const bp = useBreakpoint();
  const [first, ...rest] = PORTFOLIO.bio;
  const factTitle = { ...aStyles.mono, margin: '0 0 12px', fontWeight: 400 };
  const line = { fontSize: 14, lineHeight: 1.6, color: A.ink2, margin: 0 };
  return (
    <ARail id="studio" label="The person behind the work">
      <h2 style={aboutH2(bp)}>
        I became a designer because technology is supposed to make life <span style={{ fontStyle: 'italic' }}><ASecLine>easier</ASecLine></span>
      </h2>
      <div style={{ maxWidth: 720, marginTop: bp.isMobile ? 28 : 40 }}>
        <AFill text={first} style={{ fontSize: bp.isMobile ? 18 : 21, lineHeight: 1.55, letterSpacing: '-0.01em', color: A.ink, margin: 0 }} />
        {rest.map((para, i) => (
          <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: A.ink2, margin: '20px 0 0' }}>{richText(para)}</p>
        ))}
      </div>
      <div style={{
        marginTop: bp.isMobile ? 48 : 72, paddingTop: 28, borderTop: `1px solid ${A.line}`,
        display: 'grid', columnGap: 24, rowGap: 36,
        gridTemplateColumns: bp.isDesktop ? 'repeat(3, minmax(0, 1fr))' : bp.isTablet ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)'
      }}>
        <div>
          <h3 style={factTitle}>Availability</h3>
          <p style={{ ...line, color: A.ink }}>Open to work · Immediate joiner</p>
          <p style={line}>Remote · Hybrid · On-site · UK-wide</p>
          <p style={line}>No sponsorship required</p>
        </div>
        <div>
          <h3 style={factTitle}>Experience</h3>
          {['9 years', '14 countries', '1M+ downloads shipped'].map((x) => <p key={x} style={{ ...line, color: A.ink }}>{x}</p>)}
        </div>
        <div>
          <h3 style={factTitle}>Notable</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PORTFOLIO.notable.map((n) => <li key={n} style={line}>{n}</li>)}
          </ul>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={factTitle}>Skills · Tools</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PORTFOLIO.skills.map((s) => (
              <li key={s} style={{ fontSize: 12, padding: '5px 10px', color: A.ink2, border: `1px solid ${A.line}` }}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </ARail>
  );
}

// The six beliefs, after the person (Dipesh, 23 Nov 2026): a numbered list in two columns
// instead of a grid of cards.
function ABeliefs() {
  const bp = useBreakpoint();
  return (
    <ARail id="principles" label="Operating principles" tone="surf">
      <h2 style={aboutH2(bp)}>Six beliefs that decide every design <ASecLine>call</ASecLine></h2>
      <ol style={{
        listStyle: 'none', padding: 0, margin: `${bp.isMobile ? 32 : 48}px 0 0`, display: 'grid',
        gridTemplateColumns: bp.isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))', columnGap: 48
      }}>
        {PORTFOLIO.principles.map((p) => (
          <li key={p.n} style={{
            borderTop: `1px solid ${A.line}`, padding: '24px 0 28px',
            display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', columnGap: 12
          }}>
            <span aria-hidden="true" style={{
              fontFamily: '"Fraunces", Georgia, serif', fontStyle: 'italic', fontWeight: 300,
              fontSize: bp.isMobile ? 24 : 28, lineHeight: 1, color: A.ink2, paddingTop: 1
            }}>{p.n}</span>
            <div>
              <h3 style={{ fontSize: bp.isMobile ? 18 : 21, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.25, margin: 0, color: A.ink }}>{p.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: A.ink2, margin: '10px 0 0' }}>{richText(p.body)}</p>
            </div>
          </li>
        ))}
      </ol>
    </ARail>
  );
}

// ─── TASKGPT PRODUCT RAIL (under TaskUs in the CV) ───────────────────────────
// TaskGPT's own case studies as cards (Dipesh, 23 Nov 2026), in the hub's groups, led by the full
// case study. It sits under TaskUs's case study cards, in the role's text column like every other
// role's cards. One sideways-scrolling rail; thin vertical lines divide the groups. Swipe, scroll, Tab
// through the cards, or use the arrow buttons. Fades at an edge show there is more.
// Hidden (Dipesh, 25 Nov 2026): set this to true to bring it back.
const SHOW_TASKGPT_RAIL = false;
function AProductRail({ p }) {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal();
  const rail = React.useRef(null);
  const fade = 40;
  const [edge, setEdge] = React.useState({ start: true, end: false });
  const update = React.useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);
  React.useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);
  const go = (dir) => {
    const el = rail.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
  };
  // Tabbing onto a card the rail only half shows: browsers leave it cut off at the edge, so bring
  // the whole card into view, clear of the edge fade (WCAG 2.4.11)
  const reveal = (e) => {
    const el = rail.current;
    const card = e.target.closest && e.target.closest('.rail-card');
    if (!el || !card) return;
    const c = card.getBoundingClientRect(), r = el.getBoundingClientRect();
    const room = fade + 8;
    if (c.left < r.left + room) el.scrollLeft -= (r.left + room - c.left);
    else if (c.right > r.right - room) el.scrollLeft += (c.right - (r.right - room));
  };

  const count = p.groups.reduce((n, g) => n + g.items.length, 0);
  const cardW = bp.isMobile ? 208 : 232;
  // Starts with the first product (Dipesh, 24 Nov 2026): the full case study card moved up into
  // the role's case study cards, in TaskGPT's place
  const groups = p.groups;
  const mask = `linear-gradient(to right, ${edge.start ? '#000' : 'transparent'} 0, #000 ${fade}px, #000 calc(100% - ${fade}px), ${edge.end ? '#000' : 'transparent'} 100%)`;
  const arrow = (dir, label, disabled) => (
    <button type="button" className="rail-btn" data-cursor="hover" aria-label={label} disabled={disabled}
      onClick={() => go(dir)}>
      <span aria-hidden="true">{dir < 0 ? '←' : '→'}</span>
    </button>
  );

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
      transition: 'opacity .6s, transform .6s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={aStyles.mono}>Inside {p.title} · {count} case studies</span>
        {!bp.isMobile && (
          <div style={{ display: 'flex', gap: 8 }}>
            {arrow(-1, `Scroll ${p.title} products back`, edge.start)}
            {arrow(1, `Scroll ${p.title} products forward`, edge.end)}
          </div>
        )}
      </div>

      <div ref={rail} className="rail" onScroll={update} onFocus={reveal} role="region" aria-label={`${p.title} products`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}>
        {groups.map((g, gi) => {
          const id = `${p.id}-group-${g.label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
          return (
            <div key={g.label} style={{
              flex: '0 0 auto',
              paddingLeft: gi ? 24 : 0, marginLeft: gi ? 24 : 0,
              borderLeft: gi ? `1px solid ${A.line}` : 'none'
            }}>
              <p id={id} style={{ ...aStyles.mono, margin: '0 0 12px' }}>{g.label} · {g.items.length}</p>
              <ul aria-labelledby={id} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 16 }}>
                {g.items.map(([name, href, img, line]) => (
                  // A real width, not a flex-basis: Safari sizes the group by the pictures' own width otherwise,
                  // which left long blank stretches between groups (25 Nov 2026)
                  <li key={href} style={{ flex: '0 0 auto', width: cardW, display: 'flex' }}>
                    <a href={href} data-cursor="hover" className="rail-card">
                      <span className="rail-thumb">
                        <img src={`/assets/${img}.webp`} alt="" loading="lazy" decoding="async" />
                      </span>
                      <span className="rail-name">{name}</span>
                      <span className="rail-line">{line}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BUILT WITH AI ───────────────────────────────────────────────────────────
// Working tools Dipesh designed and built with AI (Dipesh, 23 Nov 2026). Data: PORTFOLIO.builds.
function ABuilt() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '56px' : '96px';
  return (
    <section id="built" style={{ padding: `${vPad} ${side}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ marginBottom: bp.isMobile ? 32 : 48, maxWidth: 760 }}>
          <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Built with AI · 2026</div>
          <h2 style={{ fontSize: bp.isMobile ? 28 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
            I design it, then I build it
          </h2>
          <p style={{ fontSize: bp.isMobile ? 15 : 17, lineHeight: 1.6, color: A.ink2, margin: '20px 0 0' }}>
            The same product thinking, taken all the way to working software with Claude.
          </p>
        </div>
        <div style={{
          display: 'grid', gap: 24,
          gridTemplateColumns: bp.isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr'
        }}>
          {PORTFOLIO.builds.map((b) => <ABuildCard key={b.id} b={b} />)}
        </div>
      </div>
    </section>
  );
}

function ABuildCard({ b }) {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal();
  const titleId = `build-${b.id}`;
  return (
    <article ref={ref} aria-labelledby={titleId} style={{
      border: `1px solid ${A.line}`, display: 'flex', flexDirection: 'column',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
      transition: 'opacity .6s, transform .6s'
    }}>
      <div style={{ aspectRatio: '16 / 9', background: A.surf, borderBottom: `1px solid ${A.line}`, overflow: 'hidden' }}>
        {b.image ? (
          <img src={b.image} alt="" loading="lazy" decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
        ) : (
          // No screenshot of a private build: its markets, set as type
          <div aria-hidden="true" style={{
            height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: bp.isMobile ? 6 : 10, padding: bp.isMobile ? 24 : 40
          }}>
            {(b.markets || []).map((m) => (
              <div key={m} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                borderBottom: `1px solid ${A.line}`, paddingBottom: bp.isMobile ? 6 : 10
              }}>
                <span style={{ fontSize: bp.isMobile ? 22 : 34, fontWeight: 500, letterSpacing: '-0.02em', color: A.ink }}>{m}</span>
                <span style={aStyles.mono}>Signal board</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: bp.isMobile ? 20 : 28, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h3 id={titleId} style={{ fontSize: bp.isMobile ? 22 : 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>{b.title}</h3>
          <span style={aStyles.mono}>{b.status} · {b.year}</span>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: A.ink2, margin: 0 }}>{b.line}</p>
        <p style={{ ...aStyles.mono, margin: 0 }}>{b.stack}</p>
        {b.links.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
            {b.links.map(([label, href]) => (
              <li key={href}>
                <a href={href} data-cursor="hover" className="sub-link"
                  style={{ ...aStyles.mono, color: A.ink, fontWeight: 500, display: 'inline-block', padding: '6px 0' }}>
                  {label} <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {b.note && <p style={{ fontSize: 12.5, color: A.mute, margin: 0 }}>{b.note}</p>}
      </div>
    </article>
  );
}

// ─── ORIGIN (/about) ─────────────────────────────────────────────────────────
// The Aatmnirbhar story in the About rail: the words beside the mark, at the page's heading size.
// Wording rules: CLAUDE.md rule 10.
function AOrigin() {
  const bp = useBreakpoint();
  return (
    <ARail id="origin" label="A proud moment">
      <div style={{
        display: 'grid', alignItems: 'start', gap: bp.isDesktop ? 48 : 40,
        gridTemplateColumns: bp.isDesktop ? 'minmax(0, 5fr) minmax(0, 4fr)' : 'minmax(0, 1fr)'
      }}>
        <div>
          <h2 style={aboutH2(bp)}>
            An open competition, a golden bird,{' '}
            <span style={{ fontStyle: 'italic', display: 'block' }}>a mark India <ASecLine>picked up</ASecLine></span>
          </h2>
          <AFill text={PORTFOLIO.origin} style={{ fontSize: bp.isMobile ? 18 : 20, lineHeight: 1.6, letterSpacing: '-0.012em', color: A.ink, margin: '28px 0 0', maxWidth: 600 }} />
          <p style={{
            fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontStyle: 'italic',
            fontSize: bp.isMobile ? 18 : 21, lineHeight: 1.45, color: A.ink, margin: '28px 0 0', maxWidth: 520
          }}>
            "Good design does not ask permission; it simply works for people."
          </p>
          <p style={{ margin: '28px 0 0' }}>
            <a href="/case-aatmnirbhar" data-cursor="hover" className="sub-link"
              style={{ ...aStyles.mono, color: A.ink, fontWeight: 500, display: 'inline-block', padding: '6px 0' }}>
              Read the case study <span aria-hidden="true">→</span>
            </a>
          </p>
        </div>
        <figure style={{ margin: 0, border: `1px solid rgba(var(--ink-rgb), 0.12)` }}>
          <div style={{
            background: 'var(--panel)', padding: bp.isMobile ? '32px 24px' : '48px 40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <img
              src="/assets/aatmnirbhar-logo.webp"
              alt="The Aatmnirbhar Bharat mark: a bird with saffron, white and green wings rising around the Ashok Chakra, with Aatmnirbhar Bharat written in Devanagari below"
              style={{ width: bp.isMobile ? '60%' : '55%', maxWidth: 260, height: 'auto', display: 'block' }}
            />
          </div>
          <figcaption style={{
            padding: bp.isMobile ? '20px 16px' : 24, background: 'var(--accent-tint)',
            borderTop: `1px solid rgba(var(--ink-rgb), 0.08)`,
            fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontStyle: 'italic',
            fontSize: bp.isMobile ? 18 : 20, color: 'var(--accent-strong)', letterSpacing: '-0.01em'
          }}>
            Design captures culture, not just pixels.
          </figcaption>
        </figure>
      </div>
    </ARail>
  );
}

// ─── CAREER ──────────────────────────────────────────────────────────────────
// Extracted to avoid calling useReveal inside .map() (hooks-in-loop violation)
// First paragraph always shows; the rest opens on request, so the CV section stays short.
// One button under the text switches between "Read more" and "Show less". The hidden
// paragraphs stay in the page (hidden attribute), so search engines still read them.
function ACareerBody({ c, i, gap }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const [first, ...rest] = c.body;
  const restId = `career-more-${i}`;
  const orgName = c.org.split(' · ')[0];

  const toggle = () => {
    // Collapsing removes a lot of text: bring the role back into view if its top has scrolled away
    if (open && ref.current && ref.current.getBoundingClientRect().top < 104) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      ref.current.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
    setOpen((o) => !o);
  };

  return (
    <div ref={ref} style={{ fontSize: 15, color: A.ink2, lineHeight: 1.7 }}>
      <p style={{ margin: 0 }}>{first}</p>
      {rest.length > 0 && (
        <React.Fragment>
          <div id={restId} className="cv-more" hidden={!open}>
            {rest.map((para, pi) => (
              <p key={pi} style={{ margin: `${gap}px 0 0` }}>{para}</p>
            ))}
          </div>
          <button type="button" className="cv-toggle" data-cursor="hover"
            aria-expanded={open} aria-controls={restId} onClick={toggle}>
            {open ? 'Show less' : 'Read more'}
            <span className="sr-only"> about {c.about || `my role at ${orgName}`}</span>
            <span className="cv-toggle-icon" aria-hidden="true">{open ? '↑' : '↓'}</span>
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

// The case studies from each role (Dipesh, 23 Nov 2026): `products` on each career entry, by
// project id. All of them use the same card as TaskGPT's product rail.
function caseStudiesOf(c) {
  return (c.products || []).map((id) => PORTFOLIO.projects.find((p) => p.id === id)).filter(Boolean);
}
// The card a case study shows under its role. TaskGPT shows its full case study card instead of
// its own (Dipesh, 24 Nov 2026), and its products follow in the rail below.
function roleCard(p) {
  if (!p.fullCard) return p;
  const [title, href, img, tagline] = p.fullCard;
  return { id: p.id, title, href, thumb: `/assets/${img}.webp`, tagline };
}
function orgSlug(c) {
  return c.org.split(' · ')[0].toLowerCase().replace(/[^a-z]+/g, '-');
}

function ACaseCard({ p }) {
  return (
    <a href={p.href} data-cursor="hover" className="rail-card cv-card">
      <span className="rail-thumb"><img src={p.thumb || p.image} alt="" loading="lazy" decoding="async" /></span>
      {/* "(Built with AI)" after the name on Job Desk and Job App Assistant (Dipesh, 26 Nov 2026) */}
      <span className="rail-name">{p.title}{p.builtWithAI && <span className="rail-note"> (Built with AI)</span>}</span>
      <span className="rail-line">{p.tagline}</span>
    </a>
  );
}

// A role's case studies under its Read more, in the body column
function ACareerProducts({ c, bp }) {
  const items = caseStudiesOf(c);
  if (!items.length) return null;
  const labelId = `cv-cases-${orgSlug(c)}`;
  return (
    <div style={{ marginTop: 24 }}>
      <p id={labelId} style={{ ...aStyles.mono, margin: '0 0 12px' }}>
        Case studies<span className="sr-only"> from {c.about || c.org.split(' · ')[0]}</span>
      </p>
      <ul aria-labelledby={labelId} style={{
        listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16,
        // Two across on phones and tablets, three on desktop, or four in one row for a role with four
        gridTemplateColumns: `repeat(auto-fill, minmax(${bp.isMobile ? 116 : bp.isTablet ? 140 : items.length > 3 ? 130 : 176}px, 1fr))`
      }}>
        {items.map((p) => <li key={p.id} style={{ display: 'flex' }}><ACaseCard p={roleCard(p)} /></li>)}
      </ul>
    </div>
  );
}

function ACareerItem({ c, i, bp }) {
  const [ref, inView] = useReveal();
  // A case study with its own products (TaskGPT) opens into its rail under the role's cards
  const expanded = SHOW_TASKGPT_RAIL && caseStudiesOf(c).find((p) => p.groups);
  const cases = (
    <React.Fragment>
      <ACareerProducts c={c} bp={bp} />
      {expanded && <div style={{ marginTop: 32 }}><AProductRail p={expanded} /></div>}
    </React.Fragment>
  );

  // minmax(0, …): a column may not grow to fit TaskGPT's rail; the rail scrolls inside it instead
  const gridCols = bp.isMobile
    ? '72px minmax(0, 1fr)'
    : bp.isTablet
    ? '72px minmax(0, 1fr) minmax(0, 1fr)'
    : '64px 260px minmax(0, 3fr) minmax(0, 1fr)';

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: gridCols,
      gap: bp.isMobile ? 16 : 24,
      padding: bp.isMobile ? '24px 0' : '32px 8px',
      borderTop: `1px solid ${A.line}`,
      alignItems: 'start',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(16px)',
      transition: 'opacity .6s, transform .6s'
    }}>
      {/* Date range */}
      <span style={{ ...aStyles.mono, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {c.from && <span style={{ color: A.ink }}>{c.from}</span>}
        {c.to && <span>→ {c.to}</span>}
        {c.current && (
          <span style={{ color: A.accent, marginTop: 4 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: A.accent, marginRight: 4 }} />
            NOW
          </span>
        )}
      </span>

      {/* Role + org (always shown) */}
      <div>
        {bp.isDesktop && (
          <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            {c.role}<br />
            <span style={{ fontSize: 14, color: A.accent, fontWeight: 400, letterSpacing: 0 }}>{c.org}</span>
          </span>
        )}
        {!bp.isDesktop && (
          <div>
            <div style={{ fontSize: bp.isMobile ? 16 : 20, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{c.role}</div>
            <div style={{ fontSize: 14, color: A.accent, marginTop: 4 }}>{c.org}</div>
            <div style={{ marginTop: 12 }}>
              <ACareerBody c={c} i={i} gap={10} />
              {cases}
            </div>
            {c.nda && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: A.accent, display: 'inline-block', flexShrink: 0, marginTop: 3 }} />
                <span style={{ ...aStyles.mono, fontSize: 9, color: A.accent, lineHeight: 1.6 }}>{c.nda}</span>
              </div>
            )}
            {bp.isMobile && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                {c.tags.map((t) => (
                  <span key={t} style={{ ...aStyles.mono, fontSize: 10, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2 }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body: tablet third column */}
      {bp.isTablet && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start', paddingTop: 4 }}>
          {c.tags.map((t) => (
            <span key={t} style={{ ...aStyles.mono, fontSize: 10, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2 }}>{t}</span>
          ))}
        </div>
      )}

      {/* Desktop: body + NDA note + tags in separate columns */}
      {bp.isDesktop && (
        <div>
          <ACareerBody c={c} i={i} gap={12} />
          {cases}
          {c.nda && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: A.accent, display: 'inline-block', flexShrink: 0, marginTop: 3 }} />
              <span style={{ ...aStyles.mono, fontSize: 9, color: A.accent, lineHeight: 1.6 }}>{c.nda}</span>
            </div>
          )}
        </div>
      )}
      {bp.isDesktop && (
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' }}>
          {c.tags.map((t) => (
            <span key={t} style={{ ...aStyles.mono, fontSize: 10, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2, textTransform: 'uppercase' }}>{t}</span>
          ))}
        </span>
      )}
    </div>
  );
}

// ─── LEAD (homepage) ─────────────────────────────────────────────────────────
// The summary that opens the CV, set as a statement (Dipesh, 23 Nov 2026: keep his words exactly,
// give it character visually). The words fill from grey to ink as the paragraph scrolls up the
// screen, and the four figures are set in Fraunces italic. The grey is --mute, which still passes
// 4.5:1 in both themes, so text that has not filled in yet is readable. With reduced motion,
// everything is ink from the start and nothing moves.
const LEAD_FIGURES = ['20%', '35,000 people a day', 'a million downloads', 'Indian-made goods'];

function leadTokens(text) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${LEAD_FIGURES.map(esc).join('|')})`));
  const out = [];
  parts.forEach((part, i) => {
    part.split(/(\s+)/).forEach((t) => {
      if (!t) return;
      out.push(/^\s+$/.test(t) ? { space: t } : { word: t, fig: i % 2 === 1 });
    });
  });
  return out;
}

function ALead() {
  const bp = useBreakpoint();
  const ref = React.useRef(null);
  const tokens = React.useMemo(() => leadTokens(PORTFOLIO.lead), []);
  const total = tokens.filter((t) => t.word).length;
  const [reduce] = React.useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [lit, setLit] = React.useState(reduce ? total : 0);

  React.useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts when the paragraph's top is 85% down the screen, done when its bottom reaches halfway
      const start = vh * 0.85, end = vh * 0.5;
      const p = (start - r.top) / (start - end + r.height);
      setLit(Math.round(Math.max(0, Math.min(1, p)) * total));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  let n = 0;
  return (
    <p ref={ref} className="lead-statement" style={{
      fontSize: bp.isMobile ? 'clamp(24px, 7vw, 30px)' : 'clamp(30px, 2.9vw, 42px)',
      lineHeight: 1.24, letterSpacing: '-0.022em', fontWeight: 400,
      color: A.ink, maxWidth: 1180, margin: `0 0 ${bp.isMobile ? 64 : 112}px`, textWrap: 'pretty'
    }}>
      {tokens.map((t, i) => {
        if (t.space) return t.space;
        const on = n++ < lit;
        return (
          <span key={i} className={t.fig ? 'lead-fig' : undefined} style={{
            color: on ? A.ink : A.mute, whiteSpace: 'nowrap', // keeps "call-handling" and "Indian-made" whole
            transition: reduce ? 'none' : 'color .35s ease'
          }}>{t.word}</span>
        );
      })}
    </p>
  );
}

// The CV, on the homepage under the hello (it was /career until 23 Nov 2026)
function ACareer() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const topPad = vPad;
  const Heading = 'h2';

  return (
    <section id="career" style={{ padding: `${topPad} ${side} ${vPad}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        {/* The summary, before "Curriculum vitae" (moved here from /about, Dipesh, 23 Nov 2026) */}
        <ALead />
        <div style={{
          display: 'flex',
          flexDirection: bp.isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: bp.isMobile ? 'flex-start' : 'flex-end',
          gap: 24, marginBottom: bp.isMobile ? 32 : 48
        }}>
          <div>
            {bp.isDesktop && <div style={{ marginBottom: 8 }} />}
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Curriculum vitae</div>
            <Heading style={{ fontSize: bp.isMobile ? 28 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              Nine years,<br />four cities, over a million downloads
            </Heading>
          </div>
          <a href="/dipesh-gurav-cv.pdf" download data-cursor="hover" className="cta cta-outline" style={{
            ...aStyles.cta, fontWeight: 500, padding: '12px 16px', border: `1px solid rgba(var(--ink-rgb), 0.2)`,
            color: A.ink, textDecoration: 'none', flexShrink: 0,
            display: 'inline-flex', gap: 10, alignItems: 'center'
          }}>
            Download PDF résumé <span className="cta-arrow" style={{ color: A.accent }}>→</span>
          </a>
        </div>
        <div>
          {PORTFOLIO.career.map((c, i) => (
            <ACareerItem key={i} c={c} i={i} bp={bp} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
// Small flags for the phone numbers. SVG rather than emoji: Windows renders flag emoji as letters.
function AFlag({ code }) {
  const s = { width: 18, height: 12, display: 'block', flexShrink: 0, boxShadow: '0 0 0 1px rgba(var(--ink-rgb), 0.15)' };
  if (code === 'gb') {
    return (
      <svg style={s} viewBox="0 0 60 30" aria-hidden="true" preserveAspectRatio="none">
        <clipPath id="flag-gb-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#flag-gb-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    );
  }
  return (
    <svg style={s} viewBox="0 0 30 20" aria-hidden="true" preserveAspectRatio="none">
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.8" />
      <circle cx="15" cy="10" r="0.7" fill="#000080" />
    </svg>
  );
}

function AContactIcon({ type }) {
  const s = { width: 16, height: 16, display: 'block' };
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (type) {
    case 'Email':
      return (<svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="5" width="18" height="14" /><polyline points="3 7 12 13 21 7" /></svg>);
    case 'Phone':
      return (<svg style={s} viewBox="0 0 24 24" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
    case 'LinkedIn':
      return (<svg style={s} viewBox="0 0 24 24" {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>);
    case 'Dribbble':
      return (<svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" /></svg>);
    default:
      return (<svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>);
  }
}

// Contact form rules. The Apps Script repeats them (docs/contact-form-apps-script.gs),
// because a bot can post to APPS_SCRIPT_URL without loading this page.
const MSG_MAX = 2000;
const MIN_FILL_MS = 3000;
const LINK_RE = /https?:\/\/|www\./i;
const MAIL_DOMAINS = ['gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'yahoo.com', 'yahoo.co.uk', 'icloud.com', 'proton.me', 'protonmail.com', 'btinternet.com'];
// Real domains one letter away from the list above; never "correct" these
const MAIL_DOMAINS_KEEP = ['mail.com', 'gmx.com', 'me.com', 'mac.com', 'ymail.com', 'aol.com', 'live.co.uk'];

const contactRules = {
  name(v) {
    const s = v.trim();
    if (!s) return 'Tell me who\u2019s writing';
    if (s.length < 2 || !/\p{L}/u.test(s)) return 'That doesn’t look like a name';
    if (s.length > 80) return 'Keep it under 80 characters';
    if (LINK_RE.test(s)) return 'Links can go in the message';
    return '';
  },
  email(v) {
    const s = v.trim();
    if (!s) return 'Add your email so I can reply';
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(s) || s.includes('..')) return 'Check the email, something’s missing';
    return '';
  },
  msg(v) {
    const s = v.trim();
    const words = s.split(/\s+/).filter((w) => /\p{L}/u.test(w));
    if (!s) return 'Tell me what you have in mind';
    if (s.length < 20 || words.length < 3) return 'A sentence or two helps me reply properly';
    if (s.length > MSG_MAX) return `Keep it under ${MSG_MAX.toLocaleString('en-GB')} characters`;
    return '';
  }
};

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

// "name@gmial.com" → "name@gmail.com". A hint only; it never blocks sending.
function suggestEmail(v) {
  const s = v.trim().toLowerCase();
  const at = s.lastIndexOf('@');
  if (at < 1) return '';
  const user = s.slice(0, at);
  const domain = s.slice(at + 1);
  if (!domain || MAIL_DOMAINS.includes(domain) || MAIL_DOMAINS_KEEP.includes(domain)) return '';
  let best = '', bestDist = 3;
  for (const d of MAIL_DOMAINS) {
    const dist = editDistance(domain, d);
    if (dist < bestDist) { best = d; bestDist = dist; }
  }
  if (best) return `${user}@${best}`;
  const fixedTld = domain.replace(/\.(con|cmo|ocm|comm|cpm|vom|xom)$/, '.com');
  return fixedTld !== domain ? `${user}@${fixedTld}` : '';
}

// ─── DIRECT LINES ────────────────────────────────────────────────────────────
const lineRow = (bp) => ({
  display: 'flex', alignItems: 'center', gap: bp.isMobile ? 12 : 16,
  padding: '9px 0', textDecoration: 'none', color: A.ink, transition: 'padding-left .2s'
});
const lineNudge = {
  onMouseEnter: (e) => { e.currentTarget.style.paddingLeft = '8px'; },
  onMouseLeave: (e) => { e.currentTarget.style.paddingLeft = '0'; }
};

// Icon, small label and value: shared by the links and the copy-email button
function ALineBody({ l, bp, end }) {
  return (
    <React.Fragment>
      <span aria-hidden="true" style={{
        width: 36, height: 36, flexShrink: 0,
        border: `1px solid rgba(var(--ink-rgb), 0.16)`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: A.accent
      }}>
        <AContactIcon type={l.label.split(' · ')[0]} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ ...aStyles.mono, fontSize: 9 }}>{l.label}</span>
        <span style={{
          fontSize: bp.isMobile ? 15 : 17, fontWeight: 500, letterSpacing: '-0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 8
        }}>{l.flag && <AFlag code={l.flag} />}{l.value}</span>
      </span>
      <span aria-hidden="true" style={{ marginLeft: 'auto', color: A.accent, fontSize: 16, flexShrink: 0, display: 'inline-flex' }}>{end}</span>
    </React.Fragment>
  );
}

// Phones open the dialler; profiles (LinkedIn, Dribbble, Behance) open in a new tab
function ADirectLink({ l, bp }) {
  const external = /^https?:/.test(l.href);
  return (
    <a href={l.href} data-cursor="hover" style={lineRow(bp)} {...lineNudge}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      <ALineBody l={l} bp={bp} end={external ? '↗' : '→'} />
      {external && <span className="sr-only"> (opens in new tab)</span>}
    </a>
  );
}

// Email copies the address instead of opening a mail app. A tooltip on hover and keyboard
// focus says "Click to copy", then "Copied"; a live region tells screen reader users.
// Escape hides the tooltip (WCAG 1.4.13). If copying fails, it falls back to the mail app.
function ACopyEmail({ l, bp }) {
  const [copied, setCopied] = React.useState(false);
  const [tipHidden, setTipHidden] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(l.value);
      ok = true;
    } catch (e) {
      try {
        const t = document.createElement('textarea');
        t.value = l.value; t.setAttribute('readonly', '');
        t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        ok = document.execCommand('copy');
        t.remove();
      } catch (e2) { ok = false; }
    }
    if (!ok) { window.location.href = l.href; return; }
    setTipHidden(false);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const icon = { width: 16, height: 16, display: 'block', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <React.Fragment>
      <button type="button" data-cursor="hover"
        className={'copy-email' + (copied ? ' is-copied' : '') + (tipHidden ? ' tip-hidden' : '')}
        aria-label={`Email ${l.value}, copy to clipboard`}
        onClick={copy}
        onKeyDown={(e) => { if (e.key === 'Escape') setTipHidden(true); }}
        onBlur={() => setTipHidden(false)}
        onMouseEnter={lineNudge.onMouseEnter}
        onMouseLeave={(e) => { setTipHidden(false); lineNudge.onMouseLeave(e); }}
        style={{ ...lineRow(bp), position: 'relative', width: '100%', background: 'none', border: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
        <ALineBody l={l} bp={bp} end={copied
          ? <svg viewBox="0 0 24 24" style={icon}><polyline points="5 12.5 10 17.5 19 7" /></svg>
          : <svg viewBox="0 0 24 24" style={icon}><rect x="9" y="9" width="11" height="11" rx="1" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>} />
        <span className="copy-tip" aria-hidden="true">{copied ? 'Copied' : 'Click to copy'}</span>
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
    </React.Fragment>
  );
}

function AContact() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const [form, setForm] = React.useState({ name: '', email: '', msg: '', website: '' });
  const [errors, setErrors] = React.useState({});
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [senderName, setSenderName] = React.useState('');
  const [sendError, setSendError] = React.useState(false);
  const openedAt = React.useRef(Date.now());
  const emailHint = suggestEmail(form.email);

  // Check a field when the visitor leaves it; once it shows an error, recheck as they type
  const update = (key, v) => {
    setForm((f) => ({ ...f, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: contactRules[key](v) }));
  };
  // Skip empty fields the visitor only tabbed through; Send still checks everything
  const check = (key) => {
    if (!form[key].trim() && !errors[key]) return;
    setErrors((e) => ({ ...e, [key]: contactRules[key](form[key]) }));
  };

  const finish = (name) => {
    setSenderName(name.trim());
    setForm({ name: '', email: '', msg: '', website: '' });
    setErrors({});
    setSent(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    for (const key of ['name', 'email', 'msg']) {
      const err = contactRules[key](form[key]);
      if (err) errs[key] = err;
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = ['name', 'email', 'msg'].find((k) => errs[k]);
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    // Hidden field filled in, or the form sent faster than a person can type: a bot.
    // Show the normal thank-you so it learns nothing, and send nothing.
    const elapsed = Date.now() - openedAt.current;
    if (form.website || elapsed < MIN_FILL_MS) {
      finish(form.name);
      return;
    }

    setSending(true);
    setSendError(false);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          name: form.name.trim(), email: form.email.trim(), message: form.msg.trim(),
          website: form.website, elapsed: String(elapsed)
        })
      });
      finish(form.name);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    // In the /about rail like the sections above it (Dipesh, 23 Nov 2026): one heading, "Drop a Hi!",
    // then straight into the form, then the direct lines
    <ARail id="contact" label="Let's work together" tone="surf">
        <AAboutNumbers />
        <div>
          <h2 id="contact-heading" style={aboutH2(bp)}>Drop a <ASecLine>Hi</ASecLine>!</h2>
        </div>
        <div>
          <div style={{ marginTop: bp.isMobile ? 28 : 40, maxWidth: 760 }}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 12 }}>/ Message received</div>
                  <h3 style={{
                    fontSize: bp.isMobile ? 22 : 28,
                    fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2,
                    margin: 0, color: A.ink
                  }}>
                    Thanks, {senderName}<br />I'll be in touch
                  </h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(var(--ink-rgb), 0.80)', margin: 0 }}>
                  Your message landed safely. I read every enquiry personally and typically reply within 48 hours.
                </p>
                <button onClick={() => { setSent(false); setSendError(false); }} data-cursor="hover" className="cta cta-outline"
                  style={{
                    ...aStyles.cta, fontWeight: 500, padding: '14px 20px',
                    background: 'transparent', color: A.ink,
                    border: `1px solid rgba(var(--ink-rgb), 0.2)`,
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                  Send another message <span className="cta-arrow" style={{ color: A.accent }}>→</span>
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-labelledby="contact-heading" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Ruled sheet: hairline cells with crop marks at the corners, like a paper form */}
                <div style={{ position: 'relative' }}>
                  <ACropMarks reach={bp.isMobile ? 10 : 20} />
                  <div style={{ border: `1px solid ${A_RULE}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr' }}>
                      <AField id="field-name" label="Full Name" placeholder="Your full name" autoComplete="name" value={form.name}
                        onChange={(v) => update('name', v)} onBlur={() => check('name')} error={errors.name}
                        cellStyle={bp.isMobile ? {} : { borderRight: `1px solid ${A_RULE}` }} />
                      <AField id="field-email" label="Email" type="email" placeholder="you@company.com" autoComplete="email" value={form.email}
                        onChange={(v) => update('email', v)} onBlur={() => check('email')} error={errors.email}
                        hint={errors.email === '' && emailHint && (
                          <span>
                            Did you mean{' '}
                            <button type="button" data-cursor="hover" onClick={() => update('email', emailHint)}
                              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: A.accent, textDecoration: 'underline', cursor: 'pointer', overflowWrap: 'anywhere', textAlign: 'left' }}>
                              {emailHint}
                            </button>?
                          </span>
                        )}
                        cellStyle={bp.isMobile ? { borderTop: `1px solid ${A_RULE}` } : {}} />
                    </div>
                    <AField id="field-msg" label="Message" multiline placeholder="What are we building?" value={form.msg}
                      onChange={(v) => update('msg', v)} onBlur={() => check('msg')} error={errors.msg}
                      hint={form.msg.length > MSG_MAX * 0.8 && `${form.msg.length.toLocaleString('en-GB')} / ${MSG_MAX.toLocaleString('en-GB')}`}
                      cellStyle={{ borderTop: `1px solid ${A_RULE}` }} />
                    {/* Trap for bots: hidden from people and screen readers, so only a bot fills it in */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
                      <label htmlFor="field-website">Website</label>
                      <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off"
                        value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
                    </div>
                    {sendError && (
                      <p style={{ ...aStyles.mono, color: A.accent, margin: 0, padding: '14px 20px', borderTop: `1px solid ${A_RULE}` }}>
                        Something went wrong. Try emailing me directly.
                      </p>
                    )}
                    <button type="submit" data-cursor="hover" disabled={sending} className="cta cta-primary wipe"
                      style={{
                        ...aStyles.cta, padding: '18px 20px', width: '100%',
                        backgroundColor: sending ? 'rgba(var(--ink-rgb), 0.1)' : A.accent,
                        color: sending ? A.ink : A.paper, border: 'none', cursor: sending ? 'default' : 'pointer',
                        textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                      {sending ? 'Sending…' : 'Send'} <span className="cta-arrow">→</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Direct lines under the form. The India phone tile left on 23 Nov 2026 (Dipesh). */}
        {/* As wide as the form above it, so the last tile ends where the form ends (Dipesh, 23 Nov 2026) */}
        <div style={{ marginTop: bp.isMobile ? 48 : 64, maxWidth: 760 }}>
          <div style={{ ...aStyles.mono, color: 'rgba(var(--ink-rgb), 0.65)', marginBottom: 12 }}>Direct lines</div>
          <div style={{
            display: 'grid',
            // Two across within the form's width (three cut the email and LinkedIn short); one on phones
            gridTemplateColumns: bp.isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
            columnGap: 40, rowGap: 4
          }}>
            {PORTFOLIO.links.map((l) => (l.label === 'Email'
              ? <ACopyEmail key={l.label} l={l} bp={bp} />
              : <ADirectLink key={l.label} l={l} bp={bp} />))}
          </div>
        </div>
    </ARail>
  );
}

// Field outlines at 3:1 or more against the sheet in both themes (WCAG 1.4.11)
const A_RULE = 'var(--rule)';

// Registration marks: hairlines that run past each corner of the sheet
function ACropMarks({ reach }) {
  const line = { position: 'absolute', background: A_RULE, pointerEvents: 'none' };
  return (
    <div aria-hidden="true">
      <span style={{ ...line, height: 1, top: 0, left: -reach, right: -reach }} />
      <span style={{ ...line, height: 1, bottom: 0, left: -reach, right: -reach }} />
      <span style={{ ...line, width: 1, left: 0, top: -reach, bottom: -reach }} />
      <span style={{ ...line, width: 1, right: 0, top: -reach, bottom: -reach }} />
    </div>
  );
}

function AField({ id, label, type = 'text', value, onChange, onBlur, error, hint, multiline, placeholder, autoComplete, cellStyle }) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const note = error || hint;
  return (
    <div className="a-field" style={{
      padding: '16px 20px 14px', minWidth: 0,
      background: focus ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
      transition: 'background .2s', ...cellStyle
    }}>
      <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, ...aStyles.mono, color: focus ? A.accent : 'rgba(var(--ink-rgb), 0.75)', marginBottom: 6, transition: 'color .2s', cursor: 'text' }}>
        <span>{label}<span style={{ color: A.accent }}>*</span></span>
      </label>
      <Tag
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={`${id}-note`}
        data-cursor="text"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => { setFocus(false); onBlur && onBlur(); }}
        rows={multiline ? 5 : undefined}
        style={{
          display: 'block', width: '100%',
          background: 'transparent', border: 'none',
          padding: '4px 0', color: A.ink, fontSize: 16, lineHeight: 1.5,
          fontFamily: 'inherit', outline: 'none', resize: multiline ? 'vertical' : 'none'
        }} />
      {/* Always rendered so screen readers announce errors as they appear */}
      <div id={`${id}-note`} aria-live="polite" style={{
        fontSize: 13, lineHeight: 1.4, marginTop: note ? 6 : 0,
        color: error ? A.accent : 'rgba(var(--ink-rgb), 0.65)', fontWeight: error ? 500 : 400
      }}>
        {error ? `✱ ${error}` : hint}
      </div>
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function AFooter() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const monoLight = { ...aStyles.mono, color: 'rgba(var(--ink-rgb), 0.65)' };

  return (
    <footer style={{ background: A.surf, padding: `72px ${side} 64px`, color: 'rgba(var(--ink-rgb), 0.65)', borderTop: `1px solid rgba(var(--ink-rgb), 0.10)` }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr',
        gap: bp.isMobile ? 24 : 32,
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={monoLight}>© MMXXVI Dipesh Gurav</span>
          <span style={monoLight}>All rights, all wrongs reserved.</span>
          <span style={monoLight}>
            <a href="mailto:contact@dipeshgurav.com" style={{ color: 'inherit' }}>contact@dipeshgurav.com</a>
            {' · '}
            <a href="tel:+447352673152" style={{ color: 'inherit' }}>+44 7352 673152</a>
            {' · '}
            <a href="tel:+919009480090" style={{ color: 'inherit' }}>+91 90094 80090</a>
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: bp.isMobile ? 'left' : 'right' }}>
          <span style={monoLight}>Typeset in Inter Tight + JetBrains Mono.</span>
          <span style={monoLight}>Grid: 12 col × 24 gutter. Hairlines at 1px.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { VariantA, AboutPage, ABuilt, ABanner, ANav, AHero, ACareer, AAboutIntro, APerson, ABeliefs, AOrigin, AContact, AFooter });
