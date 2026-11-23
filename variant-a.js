function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  surf: 'var(--surf)'
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
// (Dipesh, 23 Nov 2026). Its section, cards, data and nav link stay in the code: set to true to show.
const SHOW_BUILT = false;

// Old links to homepage sections that moved on 23 Nov 2026 go to their new pages
const MOVED_SECTIONS = {
  '#contact': '/about#contact',
  '#origin': '/about#origin',
  '#studio': '/about#studio',
  '#principles': '/about#principles',
  '#career': '/career'
};
function ABanner({
  page = 'home'
}) {
  const bp = useBreakpoint();
  const side = sp(bp);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `@keyframes abPulse{0%,100%{opacity:1}50%{opacity:.35}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      background: A.surf,
      borderBottom: '1px solid rgba(var(--ink-rgb), 0.1)',
      padding: `9px ${side}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: A.accent,
      display: 'inline-block',
      flexShrink: 0,
      animation: 'abPulse 2s ease-in-out 3'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      color: 'rgba(var(--ink-rgb), 0.72)',
      fontSize: bp.isMobile ? 9 : 10
    }
  }, bp.isMobile ? 'Right to work in the UK · Available now' : 'Right to work in the UK · No sponsorship required · Available now · Remote, hybrid or on-site'), /*#__PURE__*/React.createElement("a", {
    href: contactHref(page),
    "data-cursor": "hover",
    style: {
      ...aStyles.mono,
      fontSize: bp.isMobile ? 9 : 10,
      fontWeight: 500,
      color: A.accent,
      textDecoration: 'none',
      flexShrink: 0
    }
  }, "Get in touch \u2192")));
}

// Back from a case study should land where the visitor left the homepage, not at the top.
// React renders after load, so the browser's own scroll restore fires before the content
// exists. Remember the position ourselves and restore it once the page has rendered.
const HOME_SCROLL_KEY = 'home-scroll-y';
function useHomeScrollMemory() {
  React.useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const save = () => {
      try {
        sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(window.scrollY)));
      } catch (e) {}
    };
    window.addEventListener('pagehide', save);
    let y = 0;
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      // Browser Back, or the "← Portfolio" link on a case page (it sets home-restore)
      if (nav && nav.type === 'back_forward' || sessionStorage.getItem('home-restore') === '1') {
        y = Number(sessionStorage.getItem(HOME_SCROLL_KEY)) || 0;
      }
      sessionStorage.removeItem('home-restore');
    } catch (e) {}
    const target = location.hash && document.getElementById(location.hash.slice(1));
    const go = () => {
      if (y) window.scrollTo(0, y);else if (target) target.scrollIntoView();
    };
    if (y || target) {
      requestAnimationFrame(() => requestAnimationFrame(go));
      // Web fonts can shift the layout slightly; settle once more when they are ready
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    }
    return () => window.removeEventListener('pagehide', save);
  }, []);
}

// Header, main and footer shared by the three React pages (home, /about, /career)
function ASiteShell({
  page,
  children
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    style: aStyles.root
  }, /*#__PURE__*/React.createElement("a", {
    href: "#main",
    className: "skip-link"
  }, "Skip to content"), /*#__PURE__*/React.createElement(CustomCursor, {
    accent: A.accent
  }), /*#__PURE__*/React.createElement("header", {
    ref: headerRef,
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 82
    }
  }, /*#__PURE__*/React.createElement(ABanner, {
    page: page
  }), /*#__PURE__*/React.createElement(ANav, {
    page: page
  })), /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    style: {
      outline: 'none'
    }
  }, children), /*#__PURE__*/React.createElement(AFooter, null));
}

// Homepage, kept short (Dipesh, 23 Nov 2026): the hello, the work (TaskGPT first, with its products
// as cards) and what he has built with AI. The numbers, beliefs,
// bio, origin story and contact live on /about, the CV on /career.
function VariantA() {
  const moved = MOVED_SECTIONS[location.hash];
  React.useLayoutEffect(() => {
    if (moved) location.replace(moved);
  }, []);
  useHomeScrollMemory();
  return /*#__PURE__*/React.createElement(ASiteShell, {
    page: "home"
  }, /*#__PURE__*/React.createElement(AHero, null), /*#__PURE__*/React.createElement(AWork, null), SHOW_BUILT && /*#__PURE__*/React.createElement(ABuilt, null));
}

// /about: intro, the four numbers, the six beliefs, the full bio, then the origin story and contact
function AboutPage() {
  useHashTarget();
  return /*#__PURE__*/React.createElement(ASiteShell, {
    page: "about"
  }, /*#__PURE__*/React.createElement(AAboutIntro, null), /*#__PURE__*/React.createElement(AMetrics, null), /*#__PURE__*/React.createElement(APrinciples, null), /*#__PURE__*/React.createElement(AAbout, null), /*#__PURE__*/React.createElement(AOrigin, null), /*#__PURE__*/React.createElement(AContact, null));
}

// /career: the CV
function CareerPage() {
  useHashTarget();
  return /*#__PURE__*/React.createElement(ASiteShell, {
    page: "career"
  }, /*#__PURE__*/React.createElement(ACareer, {
    first: true
  }), /*#__PURE__*/React.createElement(ANextBand, {
    links: [['About me', '/about'], ['Get in touch', '/about#contact']]
  }));
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
// Light/dark switch. /theme.js handles the click and remembers the choice;
// /theme.css swaps the icon and the screen reader label to match the theme.
function AThemeToggle() {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "theme-toggle",
    "data-theme-toggle": "",
    "data-cursor": "hover"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "icon-moon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"
  })), /*#__PURE__*/React.createElement("svg", {
    className: "icon-sun",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sr-only label-to-dark"
  }, "Switch to dark theme"), /*#__PURE__*/React.createElement("span", {
    className: "sr-only label-to-light"
  }, "Switch to light theme"));
}

// About and Career are pages; Experience is a section of the homepage. Origin (on /about) left
// the menu on 23 Nov 2026 (Dipesh).
const NAV_LINKS = [{
  label: 'Experience',
  anchor: '#work',
  on: 'home'
}, {
  label: 'Built with AI',
  anchor: '#built',
  on: 'home',
  hidden: !SHOW_BUILT
}, {
  label: 'About',
  page: 'about',
  href: '/about'
}, {
  label: 'Career',
  page: 'career',
  href: '/career'
}];
const PAGE_PATH = {
  home: '/',
  about: '/about',
  career: '/career'
};
function ANav({
  page = 'home'
}) {
  const bp = useBreakpoint();
  const [t, setT] = React.useState('');
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const tick = () => {
      // UK local time, so BST and GMT switch over on their own
      // Hours and minutes only, so it changes once a minute instead of ticking (WCAG 2.2.2)
      const uk = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setT(`${uk} UK`);
    };
    tick();
    const i = setInterval(tick, 15000);
    return () => clearInterval(i);
  }, []);
  const links = NAV_LINKS.filter(l => !l.hidden).map(l => ({
    ...l,
    href: l.anchor ? page === l.on ? l.anchor : `${PAGE_PATH[l.on]}${l.anchor}` : l.href,
    current: l.page === page
  }));
  const isHome = page === 'home';
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      background: 'rgba(var(--paper-rgb), 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: `0 ${sp(bp)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      gap: bp.isMobile ? 10 : 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    "data-cursor": "hover",
    "aria-label": isHome ? 'Dipesh Gurav, back to top' : 'Dipesh Gurav, home',
    onClick: e => {
      if (!isHome) return;
      e.preventDefault();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: reduce ? 'auto' : 'smooth'
      });
      if (location.hash) history.replaceState(null, '', location.pathname);
    },
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      flexShrink: 0,
      color: 'inherit',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: A.accent,
      display: 'inline-block',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "Dipesh Gurav")), bp.isDesktop && /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      gap: 28,
      listStyle: 'none',
      padding: 0,
      margin: 0,
      ...aStyles.mono
    }
  }, links.map(x => /*#__PURE__*/React.createElement("li", {
    key: x.label
  }, /*#__PURE__*/React.createElement("a", {
    href: x.href,
    "data-cursor": "hover",
    "aria-current": x.current ? 'page' : undefined,
    className: x.current ? 'nav-current' : undefined,
    style: {
      color: x.current ? A.ink : A.mute,
      textDecoration: x.current ? undefined : 'none',
      display: 'flex',
      gap: 6
    }
  }, x.label)))), bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: aStyles.mono
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.ink
    }
  }, "\u25CF "), t), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: bp.isMobile ? 8 : 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(AThemeToggle, null), /*#__PURE__*/React.createElement("a", {
    href: contactHref(page),
    "data-cursor": "hover",
    className: "cta cta-primary wipe",
    style: {
      ...aStyles.cta,
      color: A.paper,
      backgroundColor: A.accent,
      padding: bp.isMobile ? '10px 12px' : '10px 16px',
      textDecoration: 'none',
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center',
      flexShrink: 0
    }
  }, bp.isMobile ? 'Contact' : 'Get in touch', " ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow"
  }, "\u2192")), !bp.isDesktop && /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    "aria-label": "Menu",
    "aria-expanded": open,
    style: {
      background: 'none',
      border: `1px solid ${A.line}`,
      padding: '8px 10px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flexShrink: 0
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'block',
      width: 18,
      height: 1,
      background: A.ink
    }
  }))))), !bp.isDesktop && open && /*#__PURE__*/React.createElement("div", {
    style: {
      background: A.paper,
      borderTop: `1px solid ${A.line}`,
      padding: `8px ${sp(bp)} 16px`
    }
  }, links.map(x => /*#__PURE__*/React.createElement("a", {
    key: x.label,
    href: x.href,
    onClick: () => setOpen(false),
    "aria-current": x.current ? 'page' : undefined,
    style: {
      ...aStyles.mono,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 0',
      color: A.ink,
      textDecoration: 'none',
      fontWeight: x.current ? 600 : undefined,
      borderBottom: `1px solid ${A.line}`
    }
  }, x.label, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192")))));
}

// A word with a hand-drawn line under it, which draws itself once (.scribble in /site.css).
// `delay` is how long it waits: after the homepage hello has faded in, or sooner on /about.
function AScribble({
  children,
  stroke = 5,
  delay
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "scribble-wrap"
  }, children, /*#__PURE__*/React.createElement("svg", {
    className: "scribble",
    viewBox: "0 0 300 24",
    preserveAspectRatio: "none",
    "aria-hidden": "true",
    focusable: "false",
    style: delay ? {
      '--scribble-delay': delay
    } : undefined
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 15 C 52 6, 98 20, 150 12 S 246 5, 296 13",
    pathLength: "1",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke"
  })));
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
  const bigW = bp.isMobile ? 'clamp(44px, calc((100vw - 32px) * 0.19), 88px)' : bp.isTablet ? 'clamp(76px, calc((100vw - 48px) * 0.135), 124px)' : 'clamp(100px, 9.6vw, 172px)';
  const smallW = bp.isMobile ? 'clamp(30px, 10vw, 46px)' : bp.isTablet ? 'clamp(44px, 6.4vw, 64px)' : 'clamp(52px, 4.4vw, 76px)';
  const big = `min(${bigW}, ${room} * 0.2)`;
  const small = `min(${smallW}, ${room} * 0.1)`;
  return /*#__PURE__*/React.createElement("section", {
    className: "hero-full",
    style: {
      padding: `${bp.isMobile ? 40 : 64}px ${side}`,
      borderBottom: `1px solid ${A.line}`,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "hello hand",
    style: {
      fontSize: small,
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: 0,
      color: A.ink2,
      margin: 0
    }
  }, hi), /*#__PURE__*/React.createElement("p", {
    className: "hello hello-2 hand",
    style: {
      fontSize: big,
      fontWeight: 600,
      lineHeight: 0.98,
      letterSpacing: '-0.005em',
      color: A.ink,
      margin: `${bp.isMobile ? 16 : 20}px 0 0`,
      textWrap: 'pretty'
    }
  }, words.join(' '), ' ', /*#__PURE__*/React.createElement(AScribble, {
    stroke: bp.isMobile ? 3 : 5
  }, last))));
}

// ─── ABOUT INTRO (/about) ────────────────────────────────────────────────────
// The tagline and summary that used to open the homepage, followed on the page by the numbers.
// The heading is in the homepage's hand-drawn face, his own voice (Dipesh, 23 Nov 2026), at heading
// size rather than full screen so the numbers stay in view.
function AAboutIntro() {
  const bp = useBreakpoint();
  const side = sp(bp);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `${bp.isMobile ? '48px' : '88px'} ${side} ${bp.isMobile ? '40px' : '64px'}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 20
    }
  }, "About"), /*#__PURE__*/React.createElement("h1", {
    className: "hand",
    style: {
      fontWeight: 600,
      fontSize: bp.isMobile ? 'clamp(44px, 13vw, 64px)' : bp.isTablet ? 'clamp(60px, 9vw, 88px)' : 'clamp(72px, 6.6vw, 112px)',
      lineHeight: 1,
      letterSpacing: '-0.005em',
      textWrap: 'balance',
      margin: 0,
      maxWidth: 1100,
      color: A.ink
    }
  }, "Designing for the humans behind the ", /*#__PURE__*/React.createElement(AScribble, {
    stroke: bp.isMobile ? 3 : 4,
    delay: ".4s"
  }, "pixels")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: bp.isMobile ? 16 : 18,
      lineHeight: 1.55,
      letterSpacing: '-0.01em',
      color: A.ink2,
      maxWidth: 760,
      margin: `${bp.isMobile ? 20 : 28}px 0 0`
    }
  }, PORTFOLIO.lead)));
}

// ─── NEXT (end of /about and /career) ────────────────────────────────────────
function ANextBand({
  links
}) {
  const bp = useBreakpoint();
  const side = sp(bp);
  const btn = {
    ...aStyles.cta,
    padding: '13px 18px',
    border: `1px solid rgba(var(--ink-rgb), 0.2)`,
    textDecoration: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    minWidth: bp.isMobile ? 0 : 220,
    color: A.ink,
    fontWeight: 500
  };
  return /*#__PURE__*/React.createElement("section", {
    "aria-label": "Where next",
    style: {
      padding: `${bp.isMobile ? '48px' : '72px'} ${side}`,
      background: A.surf
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'flex',
      flexDirection: bp.isMobile ? 'column' : 'row',
      gap: 12
    }
  }, links.map(([label, href]) => /*#__PURE__*/React.createElement("a", {
    key: href,
    href: href,
    "data-cursor": "hover",
    className: "cta cta-outline",
    style: btn
  }, label, " ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow",
    style: {
      color: A.accent
    }
  }, "\u2192")))));
}

// ─── METRICS ─────────────────────────────────────────────────────────────────
// Extracted to avoid calling useCounter inside .map() (hooks-in-loop violation)
function AMetricItem({
  m,
  i,
  inView,
  bp
}) {
  const v = useCounter(m.value || 0, inView, 1400 + i * 120);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: bp.isMobile ? '20px 16px' : '24px 28px',
      borderRight: `1px solid ${A.line}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: aStyles.mono
  }, "0", i + 1, " / 04"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: bp.isMobile ? 40 : 56,
      fontWeight: 500,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color: A.ink,
      marginTop: 8
    }
  }, m.text ? m.text : /*#__PURE__*/React.createElement(React.Fragment, null, fmt(v, {
    decimals: 0
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.accent
    }
  }, m.suffix))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: A.ink,
      marginTop: 8
    }
  }, m.label), /*#__PURE__*/React.createElement("div", {
    style: aStyles.mono
  }, m.sub));
}
function AMetrics() {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal({
    threshold: 0.2
  });
  const cols = bp.isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)';
  const side = sp(bp);
  return /*#__PURE__*/React.createElement("section", {
    ref: ref,
    style: {
      borderBottom: `1px solid ${A.line}`,
      padding: `32px ${side}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: cols,
      borderLeft: `1px solid ${A.line}`
    }
  }, PORTFOLIO.metrics.map((m, i) => /*#__PURE__*/React.createElement(AMetricItem, {
    key: i,
    m: m,
    i: i,
    inView: inView,
    bp: bp
  }))));
}

// ─── WORK ────────────────────────────────────────────────────────────────────
function AWork() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '56px' : '96px';
  return /*#__PURE__*/React.createElement("section", {
    id: "work",
    style: {
      padding: `${vPad} ${side}`,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1fr' : 'repeat(12, 1fr)',
      gap: 24,
      marginBottom: bp.isMobile ? 32 : 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bp.isDesktop ? {
      gridColumn: 'span 7'
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 16
    }
  }, "Experience \xB7 2018\u20132026"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: bp.isMobile ? 28 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0
    }
  }, "Eight products, four markets,", /*#__PURE__*/React.createElement("br", null), "measurable behaviour change")), bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 4',
      alignSelf: 'end',
      textAlign: 'right',
      ...aStyles.mono
    }
  }, "Click any row to", /*#__PURE__*/React.createElement("br", null), "open the case study.")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${A.line}`
    }
  }, PORTFOLIO.projects.filter(p => p.selected !== false).map(p => p.groups ? /*#__PURE__*/React.createElement(React.Fragment, {
    key: p.id
  }, /*#__PURE__*/React.createElement(AProjectRow, {
    p: p,
    joined: true
  }), /*#__PURE__*/React.createElement(AProductRail, {
    p: p
  })) : /*#__PURE__*/React.createElement(AProjectRow, {
    key: p.id,
    p: p
  })))));
}

// TaskGPT's own case studies as cards under its row (Dipesh, 23 Nov 2026), in the hub's groups.
// One sideways-scrolling rail; thin vertical lines divide the groups. Swipe, scroll, Tab
// through the cards, or use the arrow buttons. Fades at an edge show there is more.
function AProductRail({
  p
}) {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal();
  const rail = React.useRef(null);
  const [edge, setEdge] = React.useState({
    start: true,
    end: false
  });
  const update = React.useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
    });
  }, []);
  React.useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);
  const go = dir => {
    const el = rail.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: dir * Math.round(el.clientWidth * 0.8),
      behavior: reduce ? 'auto' : 'smooth'
    });
  };
  const count = p.groups.reduce((n, g) => n + g.items.length, 0);
  const cardW = bp.isMobile ? 228 : 264;
  const fade = 40;
  const mask = `linear-gradient(to right, ${edge.start ? '#000' : 'transparent'} 0, #000 ${fade}px, #000 calc(100% - ${fade}px), ${edge.end ? '#000' : 'transparent'} 100%)`;
  const arrow = (dir, label, disabled) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rail-btn",
    "data-cursor": "hover",
    "aria-label": label,
    disabled: disabled,
    onClick: () => go(dir)
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, dir < 0 ? '←' : '→'));
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      borderBottom: `1px solid ${A.line}`,
      padding: bp.isMobile ? '4px 0 32px' : '4px 8px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(16px)',
      transition: 'opacity .6s, transform .6s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: aStyles.mono
  }, "Inside ", p.title, " \xB7 ", count, " case studies"), /*#__PURE__*/React.createElement("a", {
    href: p.full,
    "data-cursor": "hover",
    className: "sub-link",
    style: {
      ...aStyles.mono,
      color: A.ink,
      fontWeight: 500
    }
  }, "The full case study ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))), !bp.isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, arrow(-1, `Scroll ${p.title} products back`, edge.start), arrow(1, `Scroll ${p.title} products forward`, edge.end))), /*#__PURE__*/React.createElement("div", {
    ref: rail,
    className: "rail",
    onScroll: update,
    role: "region",
    "aria-label": `${p.title} products`,
    style: {
      maskImage: mask,
      WebkitMaskImage: mask
    }
  }, p.groups.map((g, gi) => {
    const id = `${p.id}-group-${g.label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
    return /*#__PURE__*/React.createElement("div", {
      key: g.label,
      style: {
        flex: '0 0 auto',
        paddingLeft: gi ? 24 : 0,
        marginLeft: gi ? 24 : 0,
        borderLeft: gi ? `1px solid ${A.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement("p", {
      id: id,
      style: {
        ...aStyles.mono,
        margin: '0 0 12px'
      }
    }, g.label, " \xB7 ", g.items.length), /*#__PURE__*/React.createElement("ul", {
      "aria-labelledby": id,
      style: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        gap: 16
      }
    }, g.items.map(([name, href, img, line]) => /*#__PURE__*/React.createElement("li", {
      key: href,
      style: {
        flex: `0 0 ${cardW}px`,
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: href,
      "data-cursor": "hover",
      className: "rail-card"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rail-thumb"
    }, /*#__PURE__*/React.createElement("img", {
      src: `/assets/${img}.webp`,
      alt: "",
      loading: "lazy",
      decoding: "async"
    })), /*#__PURE__*/React.createElement("span", {
      className: "rail-name"
    }, name), /*#__PURE__*/React.createElement("span", {
      className: "rail-line"
    }, line))))));
  })));
}

// ─── BUILT WITH AI ───────────────────────────────────────────────────────────
// Working tools Dipesh designed and built with AI (Dipesh, 23 Nov 2026). Data: PORTFOLIO.builds.
function ABuilt() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '56px' : '96px';
  return /*#__PURE__*/React.createElement("section", {
    id: "built",
    style: {
      padding: `${vPad} ${side}`,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: bp.isMobile ? 32 : 48,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 16
    }
  }, "Built with AI \xB7 2026"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: bp.isMobile ? 28 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0
    }
  }, "I design it, then I build it"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: bp.isMobile ? 15 : 17,
      lineHeight: 1.6,
      color: A.ink2,
      margin: '20px 0 0'
    }
  }, "The same product thinking, taken all the way to working software with Claude.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 24,
      gridTemplateColumns: bp.isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr'
    }
  }, PORTFOLIO.builds.map(b => /*#__PURE__*/React.createElement(ABuildCard, {
    key: b.id,
    b: b
  })))));
}
function ABuildCard({
  b
}) {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal();
  const titleId = `build-${b.id}`;
  return /*#__PURE__*/React.createElement("article", {
    ref: ref,
    "aria-labelledby": titleId,
    style: {
      border: `1px solid ${A.line}`,
      display: 'flex',
      flexDirection: 'column',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(16px)',
      transition: 'opacity .6s, transform .6s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '16 / 9',
      background: A.surf,
      borderBottom: `1px solid ${A.line}`,
      overflow: 'hidden'
    }
  }, b.image ? /*#__PURE__*/React.createElement("img", {
    src: b.image,
    alt: "",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      display: 'block'
    }
  }) :
  /*#__PURE__*/
  // No screenshot of a private build: its markets, set as type
  React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: bp.isMobile ? 6 : 10,
      padding: bp.isMobile ? 24 : 40
    }
  }, (b.markets || []).map(m => /*#__PURE__*/React.createElement("div", {
    key: m,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      borderBottom: `1px solid ${A.line}`,
      paddingBottom: bp.isMobile ? 6 : 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: bp.isMobile ? 22 : 34,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      color: A.ink
    }
  }, m), /*#__PURE__*/React.createElement("span", {
    style: aStyles.mono
  }, "Signal board"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: bp.isMobile ? 20 : 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    id: titleId,
    style: {
      fontSize: bp.isMobile ? 22 : 28,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      margin: 0
    }
  }, b.title), /*#__PURE__*/React.createElement("span", {
    style: aStyles.mono
  }, b.status, " \xB7 ", b.year)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: A.ink2,
      margin: 0
    }
  }, b.line), /*#__PURE__*/React.createElement("p", {
    style: {
      ...aStyles.mono,
      margin: 0
    }
  }, b.stack), b.links.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 'auto 0 0',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px 20px'
    }
  }, b.links.map(([label, href]) => /*#__PURE__*/React.createElement("li", {
    key: href
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    "data-cursor": "hover",
    className: "sub-link",
    style: {
      ...aStyles.mono,
      color: A.ink,
      fontWeight: 500,
      display: 'inline-block',
      padding: '6px 0'
    }
  }, label, " ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))))), b.note && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: A.mute,
      margin: 0
    }
  }, b.note)));
}
function AProjectRow({
  p,
  joined
}) {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal();
  const [hover, setHover] = React.useState(false);
  // The preview covers the rows below, so Escape must hide it (WCAG 1.4.13)
  React.useEffect(() => {
    if (!hover) return;
    const onKey = e => {
      if (e.key === 'Escape') setHover(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hover]);
  const baseStyle = {
    textDecoration: 'none',
    color: A.ink,
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : 'translateY(16px)',
    transition: 'opacity .6s, transform .6s, background .18s',
    // A row with its product list below it: the list carries the dividing line
    borderBottom: joined ? 'none' : `1px solid ${A.line}`
  };

  // Mobile: simple two-column card
  if (bp.isMobile) {
    return /*#__PURE__*/React.createElement("a", {
      ref: ref,
      href: p.href,
      style: {
        ...baseStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 500,
        letterSpacing: '-0.015em',
        marginBottom: 6
      }
    }, p.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: A.ink2
      }
    }, p.tagline), /*#__PURE__*/React.createElement("div", {
      style: {
        ...aStyles.mono,
        marginTop: 6
      }
    }, p.kicker)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: A.accent,
        fontSize: 20,
        flexShrink: 0,
        marginLeft: 16
      }
    }, "\u2192"));
  }

  // Tablet: 4-column
  if (bp.isTablet) {
    return /*#__PURE__*/React.createElement("a", {
      ref: ref,
      href: p.href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        ...baseStyle,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 32px',
        gap: 16,
        alignItems: 'center',
        padding: '24px 8px',
        background: hover ? A.paper2 : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: '-0.015em'
      }
    }, p.title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: A.ink2
      }
    }, p.tagline), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: hover ? A.accent : A.mute,
        transition: 'color .18s',
        textAlign: 'right'
      }
    }, hover ? '→' : '·'));
  }

  // Desktop: full 6-column with hover preview
  return /*#__PURE__*/React.createElement("a", {
    ref: ref,
    href: p.href,
    "data-cursor": "hover",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...baseStyle,
      display: 'grid',
      gridTemplateColumns: '2fr 3fr 2fr 1.2fr 40px',
      gap: 24,
      alignItems: 'center',
      padding: '28px 8px',
      position: 'relative',
      background: hover ? A.paper2 : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      fontWeight: 500,
      letterSpacing: '-0.02em'
    }
  }, p.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: A.ink2,
      letterSpacing: '-0.005em'
    }
  }, p.tagline), /*#__PURE__*/React.createElement("span", {
    style: aStyles.mono
  }, p.kicker), /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      textAlign: 'right'
    }
  }, p.year), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: hover ? A.accent : A.mute,
      transition: 'color .18s',
      textAlign: 'right'
    }
  }, hover ? '→' : '·'), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '20%',
      top: '100%',
      width: 280,
      pointerEvents: 'none',
      zIndex: 20,
      opacity: hover ? 1 : 0,
      transform: hover ? 'translateY(4px)' : 'translateY(-4px)',
      transition: 'opacity .22s, transform .22s'
    }
  }, p.image ? /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: "",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      display: 'block',
      boxShadow: '0 20px 60px rgba(20,17,15,0.22)'
    },
    onError: e => {
      e.currentTarget.style.display = 'none';
    }
  }) : /*#__PURE__*/React.createElement(Placeholder, {
    label: `${p.id}.png`,
    tone: "ink"
  })));
}

// ─── ORIGIN ──────────────────────────────────────────────────────────────────
function AOrigin() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  return /*#__PURE__*/React.createElement("section", {
    id: "origin",
    style: {
      background: A.surf,
      color: A.ink,
      padding: `${vPad} ${side}`,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isDesktop ? 'repeat(12, 1fr)' : '1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bp.isDesktop ? {
      gridColumn: 'span 7'
    } : {}
  }, bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 20
    }
  }, "The origin story"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(36px, 7vw, 88px)',
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      margin: 0
    }
  }, "An open competition,", /*#__PURE__*/React.createElement("br", null), "a golden bird,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: A.accent
    }
  }, "a mark India picked up")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: 'rgba(var(--ink-rgb), 0.82)',
      maxWidth: bp.isDesktop ? 480 : '100%',
      marginTop: 40
    }
  }, PORTFOLIO.origin), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 300,
      fontStyle: 'italic',
      fontSize: bp.isMobile ? 18 : 22,
      lineHeight: 1.4,
      color: A.ink,
      marginTop: 32,
      maxWidth: bp.isDesktop ? 520 : '100%'
    }
  }, "\"Good design does not ask permission; it simply works for people.\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: bp.isDesktop ? 'span 5' : undefined,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      // Logo row takes any spare height so the quote row never gapes below its line
      gridTemplateRows: '1fr auto',
      border: `1px solid rgba(var(--ink-rgb), 0.12)`,
      marginTop: bp.isMobile ? 48 : bp.isTablet ? 48 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2',
      background: 'var(--panel)',
      padding: bp.isMobile ? '32px 24px' : '48px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/aatmnirbhar-logo.webp",
    alt: "The Aatmnirbhar Bharat mark: a bird with saffron, white and green wings rising around the Ashok Chakra, with Aatmnirbhar Bharat written in Devanagari below",
    style: {
      width: bp.isMobile ? '60%' : '55%',
      maxWidth: 260,
      height: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2',
      padding: bp.isMobile ? '20px 16px' : 28,
      background: 'var(--accent-tint)',
      borderTop: `1px solid rgba(var(--ink-rgb), 0.08)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 300,
      fontStyle: 'italic',
      fontSize: bp.isMobile ? 18 : 22,
      color: 'var(--accent-strong)',
      letterSpacing: '-0.01em'
    }
  }, "Design captures culture, not just pixels."))))));
}

// ─── PRINCIPLES ──────────────────────────────────────────────────────────────
function APrinciples() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const cols = bp.isMobile ? '1fr' : bp.isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  return /*#__PURE__*/React.createElement("section", {
    id: "principles",
    style: {
      padding: `${vPad} ${side}`,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: bp.isMobile ? 32 : 48
    }
  }, bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 16
    }
  }, "Operating principles"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: bp.isMobile ? 28 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0
    }
  }, "Six beliefs that decide", /*#__PURE__*/React.createElement("br", null), "every design call")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: cols,
      borderTop: `1px solid ${A.line}`,
      borderLeft: `1px solid ${A.line}`
    }
  }, PORTFOLIO.principles.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: bp.isMobile ? '24px 20px' : 32,
      borderRight: `1px solid ${A.line}`,
      borderBottom: `1px solid ${A.line}`,
      minHeight: bp.isMobile ? 'auto' : 240,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      color: A.accent
    }
  }, "Principle ", p.n), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: A.line
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: bp.isMobile ? 17 : 20,
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      margin: 0,
      marginBottom: 16,
      color: A.ink
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: A.mute,
      lineHeight: 1.6,
      margin: 0
    }
  }, p.body))))));
}

// ─── CAREER ──────────────────────────────────────────────────────────────────
// Extracted to avoid calling useReveal inside .map() (hooks-in-loop violation)
// First paragraph always shows; the rest opens on request, so the CV section stays short.
// One button under the text switches between "Read more" and "Show less". The hidden
// paragraphs stay in the page (hidden attribute), so search engines still read them.
function ACareerBody({
  c,
  i,
  gap
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const [first, ...rest] = c.body;
  const restId = `career-more-${i}`;
  const orgName = c.org.split(' · ')[0];
  const toggle = () => {
    // Collapsing removes a lot of text: bring the role back into view if its top has scrolled away
    if (open && ref.current && ref.current.getBoundingClientRect().top < 104) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      ref.current.scrollIntoView({
        block: 'start',
        behavior: reduce ? 'auto' : 'smooth'
      });
    }
    setOpen(o => !o);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      fontSize: 15,
      color: A.ink2,
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, first), rest.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: restId,
    className: "cv-more",
    hidden: !open
  }, rest.map((para, pi) => /*#__PURE__*/React.createElement("p", {
    key: pi,
    style: {
      margin: `${gap}px 0 0`
    }
  }, para))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cv-toggle",
    "data-cursor": "hover",
    "aria-expanded": open,
    "aria-controls": restId,
    onClick: toggle
  }, open ? 'Show less' : 'Read more', /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " about ", c.about || `my role at ${orgName}`), /*#__PURE__*/React.createElement("span", {
    className: "cv-toggle-icon",
    "aria-hidden": "true"
  }, open ? '↑' : '↓'))));
}
function ACareerItem({
  c,
  i,
  bp
}) {
  const [ref, inView] = useReveal();
  const gridCols = bp.isMobile ? '72px 1fr' : bp.isTablet ? '72px 1fr 1fr' : '64px 260px 3fr 1fr';
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'grid',
      gridTemplateColumns: gridCols,
      gap: bp.isMobile ? 16 : 24,
      padding: bp.isMobile ? '24px 0' : '32px 8px',
      borderTop: `1px solid ${A.line}`,
      alignItems: 'start',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(16px)',
      transition: 'opacity .6s, transform .6s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, c.from && /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.ink
    }
  }, c.from), c.to && /*#__PURE__*/React.createElement("span", null, "\u2192 ", c.to), c.current && /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.accent,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: 99,
      background: A.accent,
      marginRight: 4
    }
  }), "NOW")), /*#__PURE__*/React.createElement("div", null, bp.isDesktop && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: '-0.015em',
      lineHeight: 1.2
    }
  }, c.role, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: A.accent,
      fontWeight: 400,
      letterSpacing: 0
    }
  }, c.org)), !bp.isDesktop && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: bp.isMobile ? 16 : 20,
      fontWeight: 500,
      letterSpacing: '-0.015em',
      lineHeight: 1.2
    }
  }, c.role), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: A.accent,
      marginTop: 4
    }
  }, c.org), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(ACareerBody, {
    c: c,
    i: i,
    gap: 10
  })), c.nda && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: A.accent,
      display: 'inline-block',
      flexShrink: 0,
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      fontSize: 9,
      color: A.accent,
      lineHeight: 1.6
    }
  }, c.nda)), bp.isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 12
    }
  }, c.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      ...aStyles.mono,
      fontSize: 10,
      padding: '4px 7px',
      border: `1px solid ${A.line}`,
      color: A.ink2
    }
  }, t))))), bp.isTablet && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      alignItems: 'flex-start',
      paddingTop: 4
    }
  }, c.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      ...aStyles.mono,
      fontSize: 10,
      padding: '4px 7px',
      border: `1px solid ${A.line}`,
      color: A.ink2
    }
  }, t))), bp.isDesktop && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ACareerBody, {
    c: c,
    i: i,
    gap: 12
  }), c.nda && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: A.accent,
      display: 'inline-block',
      flexShrink: 0,
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      fontSize: 9,
      color: A.accent,
      lineHeight: 1.6
    }
  }, c.nda))), bp.isDesktop && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      alignItems: 'flex-start'
    }
  }, c.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      ...aStyles.mono,
      fontSize: 10,
      padding: '4px 7px',
      border: `1px solid ${A.line}`,
      color: A.ink2,
      textTransform: 'uppercase'
    }
  }, t))));
}

// `first`: the section opens its own page (/career), so its heading is the page's h1
function ACareer({
  first = false
}) {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const topPad = first ? bp.isMobile ? '48px' : '88px' : vPad;
  const Heading = first ? 'h1' : 'h2';
  return /*#__PURE__*/React.createElement("section", {
    id: "career",
    style: {
      padding: `${topPad} ${side} ${vPad}`,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: bp.isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: bp.isMobile ? 'flex-start' : 'flex-end',
      gap: 24,
      marginBottom: bp.isMobile ? 32 : 48
    }
  }, /*#__PURE__*/React.createElement("div", null, bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 16
    }
  }, "Curriculum vitae"), /*#__PURE__*/React.createElement(Heading, {
    style: {
      fontSize: bp.isMobile ? 28 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0
    }
  }, "Nine years,", /*#__PURE__*/React.createElement("br", null), "four cities, over a million downloads")), /*#__PURE__*/React.createElement("a", {
    href: "/dipesh-gurav-cv.pdf",
    download: true,
    "data-cursor": "hover",
    className: "cta cta-outline",
    style: {
      ...aStyles.cta,
      fontWeight: 500,
      padding: '12px 16px',
      border: `1px solid rgba(var(--ink-rgb), 0.2)`,
      color: A.ink,
      textDecoration: 'none',
      flexShrink: 0,
      display: 'inline-flex',
      gap: 10,
      alignItems: 'center'
    }
  }, "Download PDF r\xE9sum\xE9 ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow",
    style: {
      color: A.accent
    }
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", null, PORTFOLIO.career.map((c, i) => /*#__PURE__*/React.createElement(ACareerItem, {
    key: i,
    c: c,
    i: i,
    bp: bp
  })))));
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function AAbout() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const sidebarRow = (label, children, last = false) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      borderBottom: last ? 'none' : `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.mute,
      marginBottom: 12
    }
  }, label), children);
  return /*#__PURE__*/React.createElement("section", {
    id: "studio",
    style: {
      padding: `${vPad} ${side}`,
      background: A.paper,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isDesktop ? 'repeat(12, 1fr)' : '1fr',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: bp.isDesktop ? {
      gridColumn: 'span 7'
    } : {}
  }, bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 16
    }
  }, "The person behind the work"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: bp.isMobile ? 26 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0,
      marginBottom: 40
    }
  }, "I became a designer because", /*#__PURE__*/React.createElement("br", null), "technology is supposed to make", /*#__PURE__*/React.createElement("br", null), "life ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "easier")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.75,
      color: A.ink2,
      borderTop: `1px solid ${A.line}`,
      paddingTop: 32
    }
  }, PORTFOLIO.bio.map((para, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      margin: i ? '16px 0 0' : 0
    }
  }, para.split(/\*(.+?)\*/).map((part, j) => j % 2 ? /*#__PURE__*/React.createElement("em", {
    key: j
  }, part) : part))))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: bp.isDesktop ? 'span 5' : undefined,
      marginTop: bp.isMobile || bp.isTablet ? 48 : 0,
      background: A.paper2,
      border: `1px solid ${A.line}`
    }
  }, sidebarRow('Availability', /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: A.ink,
      lineHeight: 1.6
    }
  }, "Open to work \xB7 Immediate joiner"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: A.ink2,
      lineHeight: 1.6
    }
  }, "Remote \xB7 Hybrid \xB7 On-site \xB7 UK-wide"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: A.ink2,
      lineHeight: 1.6
    }
  }, "No sponsorship required"))), sidebarRow('Experience', /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, ['9 years', '14 countries', '1M+ downloads shipped'].map(v => /*#__PURE__*/React.createElement("div", {
    key: v,
    style: {
      fontSize: 14,
      color: A.ink,
      lineHeight: 1.5
    }
  }, v)))), sidebarRow('Skills · Tools', /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, PORTFOLIO.skills.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      fontSize: 11,
      padding: '5px 9px',
      background: A.paper,
      color: A.ink2,
      border: `1px solid ${A.line}`
    }
  }, s)))), sidebarRow('Notable', /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, PORTFOLIO.notable.map(n => /*#__PURE__*/React.createElement("li", {
    key: n,
    style: {
      fontSize: 12.5,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      color: A.ink2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.accent,
      flexShrink: 0,
      lineHeight: 1.6
    }
  }, "\xB7"), n))), true)))));
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
// Small flags for the phone numbers. SVG rather than emoji: Windows renders flag emoji as letters.
function AFlag({
  code
}) {
  const s = {
    width: 18,
    height: 12,
    display: 'block',
    flexShrink: 0,
    boxShadow: '0 0 0 1px rgba(var(--ink-rgb), 0.15)'
  };
  if (code === 'gb') {
    return /*#__PURE__*/React.createElement("svg", {
      style: s,
      viewBox: "0 0 60 30",
      "aria-hidden": "true",
      preserveAspectRatio: "none"
    }, /*#__PURE__*/React.createElement("clipPath", {
      id: "flag-gb-t"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"
    })), /*#__PURE__*/React.createElement("rect", {
      width: "60",
      height: "30",
      fill: "#012169"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0,0 L60,30 M60,0 L0,30",
      stroke: "#fff",
      strokeWidth: "6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0,0 L60,30 M60,0 L0,30",
      clipPath: "url(#flag-gb-t)",
      stroke: "#C8102E",
      strokeWidth: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M30,0 v30 M0,15 h60",
      stroke: "#fff",
      strokeWidth: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M30,0 v30 M0,15 h60",
      stroke: "#C8102E",
      strokeWidth: "6"
    }));
  }
  return /*#__PURE__*/React.createElement("svg", {
    style: s,
    viewBox: "0 0 30 20",
    "aria-hidden": "true",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "30",
    height: "20",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "30",
    height: "6.67",
    fill: "#FF9933"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "13.33",
    width: "30",
    height: "6.67",
    fill: "#138808"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "10",
    r: "2.6",
    fill: "none",
    stroke: "#000080",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "10",
    r: "0.7",
    fill: "#000080"
  }));
}
function AContactIcon({
  type
}) {
  const s = {
    width: 16,
    height: 16,
    display: 'block'
  };
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (type) {
    case 'Email':
      return /*#__PURE__*/React.createElement("svg", _extends({
        style: s,
        viewBox: "0 0 24 24"
      }, p), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "14"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "3 7 12 13 21 7"
      }));
    case 'Phone':
      return /*#__PURE__*/React.createElement("svg", _extends({
        style: s,
        viewBox: "0 0 24 24"
      }, p), /*#__PURE__*/React.createElement("path", {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      }));
    case 'LinkedIn':
      return /*#__PURE__*/React.createElement("svg", _extends({
        style: s,
        viewBox: "0 0 24 24"
      }, p), /*#__PURE__*/React.createElement("path", {
        d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "9",
        width: "4",
        height: "12"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "4",
        cy: "4",
        r: "2"
      }));
    case 'Dribbble':
      return /*#__PURE__*/React.createElement("svg", _extends({
        style: s,
        viewBox: "0 0 24 24"
      }, p), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", _extends({
        style: s,
        viewBox: "0 0 24 24"
      }, p), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "7",
        height: "7"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "3",
        width: "7",
        height: "7"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "7",
        height: "7"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "14",
        width: "7",
        height: "7"
      }));
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
    const words = s.split(/\s+/).filter(w => /\p{L}/u.test(w));
    if (!s) return 'Tell me what you have in mind';
    if (s.length < 20 || words.length < 3) return 'A sentence or two helps me reply properly';
    if (s.length > MSG_MAX) return `Keep it under ${MSG_MAX.toLocaleString('en-GB')} characters`;
    return '';
  }
};
function editDistance(a, b) {
  const row = Array.from({
    length: b.length + 1
  }, (_, i) => i);
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
  let best = '',
    bestDist = 3;
  for (const d of MAIL_DOMAINS) {
    const dist = editDistance(domain, d);
    if (dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  if (best) return `${user}@${best}`;
  const fixedTld = domain.replace(/\.(con|cmo|ocm|comm|cpm|vom|xom)$/, '.com');
  return fixedTld !== domain ? `${user}@${fixedTld}` : '';
}

// ─── DIRECT LINES ────────────────────────────────────────────────────────────
const lineRow = bp => ({
  display: 'flex',
  alignItems: 'center',
  gap: bp.isMobile ? 12 : 16,
  padding: '9px 0',
  textDecoration: 'none',
  color: A.ink,
  transition: 'padding-left .2s'
});
const lineNudge = {
  onMouseEnter: e => {
    e.currentTarget.style.paddingLeft = '8px';
  },
  onMouseLeave: e => {
    e.currentTarget.style.paddingLeft = '0';
  }
};

// Icon, small label and value: shared by the links and the copy-email button
function ALineBody({
  l,
  bp,
  end
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 36,
      height: 36,
      flexShrink: 0,
      border: `1px solid rgba(var(--ink-rgb), 0.16)`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: A.accent
    }
  }, /*#__PURE__*/React.createElement(AContactIcon, {
    type: l.label.split(' · ')[0]
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...aStyles.mono,
      fontSize: 9
    }
  }, l.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: bp.isMobile ? 15 : 17,
      fontWeight: 500,
      letterSpacing: '-0.01em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, l.flag && /*#__PURE__*/React.createElement(AFlag, {
    code: l.flag
  }), l.value)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      marginLeft: 'auto',
      color: A.accent,
      fontSize: 16,
      flexShrink: 0,
      display: 'inline-flex'
    }
  }, end));
}

// Phones open the dialler; profiles (LinkedIn, Dribbble, Behance) open in a new tab
function ADirectLink({
  l,
  bp
}) {
  const external = /^https?:/.test(l.href);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: l.href,
    "data-cursor": "hover",
    style: lineRow(bp)
  }, lineNudge, external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {}), /*#__PURE__*/React.createElement(ALineBody, {
    l: l,
    bp: bp,
    end: external ? '↗' : '→'
  }), external && /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, " (opens in new tab)"));
}

// Email copies the address instead of opening a mail app. A tooltip on hover and keyboard
// focus says "Click to copy", then "Copied"; a live region tells screen reader users.
// Escape hides the tooltip (WCAG 1.4.13). If copying fails, it falls back to the mail app.
function ACopyEmail({
  l,
  bp
}) {
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
        t.value = l.value;
        t.setAttribute('readonly', '');
        t.style.position = 'fixed';
        t.style.opacity = '0';
        document.body.appendChild(t);
        t.select();
        ok = document.execCommand('copy');
        t.remove();
      } catch (e2) {
        ok = false;
      }
    }
    if (!ok) {
      window.location.href = l.href;
      return;
    }
    setTipHidden(false);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  const icon = {
    width: 16,
    height: 16,
    display: 'block',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-cursor": "hover",
    className: 'copy-email' + (copied ? ' is-copied' : '') + (tipHidden ? ' tip-hidden' : ''),
    "aria-label": `Email ${l.value}, copy to clipboard`,
    onClick: copy,
    onKeyDown: e => {
      if (e.key === 'Escape') setTipHidden(true);
    },
    onBlur: () => setTipHidden(false),
    onMouseEnter: lineNudge.onMouseEnter,
    onMouseLeave: e => {
      setTipHidden(false);
      lineNudge.onMouseLeave(e);
    },
    style: {
      ...lineRow(bp),
      position: 'relative',
      width: '100%',
      background: 'none',
      border: 0,
      font: 'inherit',
      textAlign: 'left',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(ALineBody, {
    l: l,
    bp: bp,
    end: copied ? /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      style: icon
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "5 12.5 10 17.5 19 7"
    })) : /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      style: icon
    }, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "9",
      width: "11",
      height: "11",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 15V5a1 1 0 0 1 1-1h10"
    }))
  }), /*#__PURE__*/React.createElement("span", {
    className: "copy-tip",
    "aria-hidden": "true"
  }, copied ? 'Copied' : 'Click to copy')), /*#__PURE__*/React.createElement("span", {
    className: "sr-only",
    "aria-live": "polite"
  }, copied ? 'Email address copied' : ''));
}
function AContact() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    msg: '',
    website: ''
  });
  const [errors, setErrors] = React.useState({});
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [senderName, setSenderName] = React.useState('');
  const [sendError, setSendError] = React.useState(false);
  const openedAt = React.useRef(Date.now());
  const emailHint = suggestEmail(form.email);

  // Check a field when the visitor leaves it; once it shows an error, recheck as they type
  const update = (key, v) => {
    setForm(f => ({
      ...f,
      [key]: v
    }));
    if (errors[key]) setErrors(e => ({
      ...e,
      [key]: contactRules[key](v)
    }));
  };
  // Skip empty fields the visitor only tabbed through; Send still checks everything
  const check = key => {
    if (!form[key].trim() && !errors[key]) return;
    setErrors(e => ({
      ...e,
      [key]: contactRules[key](form[key])
    }));
  };
  const finish = name => {
    setSenderName(name.trim());
    setForm({
      name: '',
      email: '',
      msg: '',
      website: ''
    });
    setErrors({});
    setSent(true);
  };
  const submit = async e => {
    e.preventDefault();
    const errs = {};
    for (const key of ['name', 'email', 'msg']) {
      const err = contactRules[key](form[key]);
      if (err) errs[key] = err;
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = ['name', 'email', 'msg'].find(k => errs[k]);
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
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.msg.trim(),
          website: form.website,
          elapsed: String(elapsed)
        })
      });
      finish(form.name);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      background: A.surf,
      color: A.ink,
      padding: `${vPad} ${side}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isDesktop ? '7fr 5fr' : '1fr',
      gap: bp.isMobile ? 48 : 64,
      alignItems: bp.isDesktop ? 'stretch' : 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", null, bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 16
    }
  }, "Let's work together"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(36px, 7vw, 88px)',
      fontWeight: 500,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      margin: 0
    }
  }, "Let's build", /*#__PURE__*/React.createElement("br", null), "something ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: A.accent
    }
  }, "meaningful")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'rgba(var(--ink-rgb), 0.80)',
      maxWidth: bp.isDesktop ? 460 : '100%',
      marginTop: 32
    }
  }, "Open to senior product design roles, consulting, and conversations with people who care about the humans behind the pixels."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      // Matches the 12px spacer above "Let's work together" so both columns start level
      paddingTop: bp.isDesktop ? 12 : 0
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      marginBottom: 12
    }
  }, "/ Message received"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: bp.isMobile ? 22 : 28,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      margin: 0,
      color: A.ink
    }
  }, "Thanks, ", senderName, /*#__PURE__*/React.createElement("br", null), "I'll be in touch")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'rgba(var(--ink-rgb), 0.80)',
      margin: 0
    }
  }, "Your message landed safely. I read every enquiry personally and typically reply within 48 hours."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSent(false);
      setSendError(false);
    },
    "data-cursor": "hover",
    className: "cta cta-outline",
    style: {
      ...aStyles.cta,
      fontWeight: 500,
      padding: '14px 20px',
      background: 'transparent',
      color: A.ink,
      border: `1px solid rgba(var(--ink-rgb), 0.2)`,
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, "Send another message ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow",
    style: {
      color: A.accent
    }
  }, "\u2192"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    noValidate: true,
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: 'rgba(var(--ink-rgb), 0.65)',
      marginBottom: 12
    }
  }, "Write to me"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: bp.isMobile ? 22 : 28,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      margin: 0,
      color: A.ink
    }
  }, "Or drop me a line directly")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(ACropMarks, {
    reach: bp.isMobile ? 10 : 20
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${A_RULE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement(AField, {
    id: "field-name",
    label: "Full Name",
    placeholder: "Your full name",
    autoComplete: "name",
    value: form.name,
    onChange: v => update('name', v),
    onBlur: () => check('name'),
    error: errors.name,
    cellStyle: bp.isMobile ? {} : {
      borderRight: `1px solid ${A_RULE}`
    }
  }), /*#__PURE__*/React.createElement(AField, {
    id: "field-email",
    label: "Email",
    type: "email",
    placeholder: "you@company.com",
    autoComplete: "email",
    value: form.email,
    onChange: v => update('email', v),
    onBlur: () => check('email'),
    error: errors.email,
    hint: errors.email === '' && emailHint && /*#__PURE__*/React.createElement("span", null, "Did you mean", ' ', /*#__PURE__*/React.createElement("button", {
      type: "button",
      "data-cursor": "hover",
      onClick: () => update('email', emailHint),
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: A.accent,
        textDecoration: 'underline',
        cursor: 'pointer',
        overflowWrap: 'anywhere',
        textAlign: 'left'
      }
    }, emailHint), "?"),
    cellStyle: bp.isMobile ? {
      borderTop: `1px solid ${A_RULE}`
    } : {}
  })), /*#__PURE__*/React.createElement(AField, {
    id: "field-msg",
    label: "Message",
    multiline: true,
    placeholder: "What are we building?",
    value: form.msg,
    onChange: v => update('msg', v),
    onBlur: () => check('msg'),
    error: errors.msg,
    hint: form.msg.length > MSG_MAX * 0.8 && `${form.msg.length.toLocaleString('en-GB')} / ${MSG_MAX.toLocaleString('en-GB')}`,
    cellStyle: {
      borderTop: `1px solid ${A_RULE}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: -10000,
      width: 1,
      height: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "field-website"
  }, "Website"), /*#__PURE__*/React.createElement("input", {
    id: "field-website",
    name: "website",
    type: "text",
    tabIndex: -1,
    autoComplete: "off",
    value: form.website,
    onChange: e => setForm(f => ({
      ...f,
      website: e.target.value
    }))
  })), sendError && /*#__PURE__*/React.createElement("p", {
    style: {
      ...aStyles.mono,
      color: A.accent,
      margin: 0,
      padding: '14px 20px',
      borderTop: `1px solid ${A_RULE}`
    }
  }, "Something went wrong. Try emailing me directly."), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    "data-cursor": "hover",
    disabled: sending,
    className: "cta cta-primary wipe",
    style: {
      ...aStyles.cta,
      padding: '18px 20px',
      width: '100%',
      backgroundColor: sending ? 'rgba(var(--ink-rgb), 0.1)' : A.accent,
      color: sending ? A.ink : A.paper,
      border: 'none',
      cursor: sending ? 'default' : 'pointer',
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, sending ? 'Sending…' : 'Send', " ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow"
  }, "\u2192"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: bp.isMobile ? 48 : 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: 'rgba(var(--ink-rgb), 0.65)',
      marginBottom: 12
    }
  }, "Direct lines"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isDesktop ? 'repeat(3, minmax(0, 1fr))' : bp.isTablet ? 'repeat(2, minmax(0, 1fr))' : '1fr',
      columnGap: 40,
      rowGap: 4
    }
  }, PORTFOLIO.links.map(l => l.label === 'Email' ? /*#__PURE__*/React.createElement(ACopyEmail, {
    key: l.label,
    l: l,
    bp: bp
  }) : /*#__PURE__*/React.createElement(ADirectLink, {
    key: l.label,
    l: l,
    bp: bp
  }))))));
}

// Field outlines at 3:1 or more against the sheet in both themes (WCAG 1.4.11)
const A_RULE = 'var(--rule)';

// Registration marks: hairlines that run past each corner of the sheet
function ACropMarks({
  reach
}) {
  const line = {
    position: 'absolute',
    background: A_RULE,
    pointerEvents: 'none'
  };
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...line,
      height: 1,
      top: 0,
      left: -reach,
      right: -reach
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...line,
      height: 1,
      bottom: 0,
      left: -reach,
      right: -reach
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...line,
      width: 1,
      left: 0,
      top: -reach,
      bottom: -reach
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...line,
      width: 1,
      right: 0,
      top: -reach,
      bottom: -reach
    }
  }));
}
function AField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  hint,
  multiline,
  placeholder,
  autoComplete,
  cellStyle
}) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const note = error || hint;
  return /*#__PURE__*/React.createElement("div", {
    className: "a-field",
    style: {
      padding: '16px 20px 14px',
      minWidth: 0,
      background: focus ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
      transition: 'background .2s',
      ...cellStyle
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      ...aStyles.mono,
      color: focus ? A.accent : 'rgba(var(--ink-rgb), 0.75)',
      marginBottom: 6,
      transition: 'color .2s',
      cursor: 'text'
    }
  }, /*#__PURE__*/React.createElement("span", null, label, /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.accent
    }
  }, "*"))), /*#__PURE__*/React.createElement(Tag, {
    id: id,
    type: type,
    value: value,
    placeholder: placeholder,
    autoComplete: autoComplete,
    "aria-required": "true",
    "aria-invalid": !!error,
    "aria-describedby": `${id}-note`,
    "data-cursor": "text",
    onChange: e => onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => {
      setFocus(false);
      onBlur && onBlur();
    },
    rows: multiline ? 5 : undefined,
    style: {
      display: 'block',
      width: '100%',
      background: 'transparent',
      border: 'none',
      padding: '4px 0',
      color: A.ink,
      fontSize: 16,
      lineHeight: 1.5,
      fontFamily: 'inherit',
      outline: 'none',
      resize: multiline ? 'vertical' : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    id: `${id}-note`,
    "aria-live": "polite",
    style: {
      fontSize: 13,
      lineHeight: 1.4,
      marginTop: note ? 6 : 0,
      color: error ? A.accent : 'rgba(var(--ink-rgb), 0.65)',
      fontWeight: error ? 500 : 400
    }
  }, error ? `✱ ${error}` : hint));
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function AFooter() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const monoLight = {
    ...aStyles.mono,
    color: 'rgba(var(--ink-rgb), 0.65)'
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: A.surf,
      padding: `72px ${side} 64px`,
      color: 'rgba(var(--ink-rgb), 0.65)',
      borderTop: `1px solid rgba(var(--ink-rgb), 0.10)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: bp.isMobile ? '1fr' : '1fr 1fr',
      gap: bp.isMobile ? 24 : 32,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: monoLight
  }, "\xA9 MMXXVI Dipesh Gurav"), /*#__PURE__*/React.createElement("span", {
    style: monoLight
  }, "All rights, all wrongs reserved."), /*#__PURE__*/React.createElement("span", {
    style: monoLight
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:contact@dipeshgurav.com",
    style: {
      color: 'inherit'
    }
  }, "contact@dipeshgurav.com"), ' · ', /*#__PURE__*/React.createElement("a", {
    href: "tel:+447352673152",
    style: {
      color: 'inherit'
    }
  }, "+44 7352 673152"), ' · ', /*#__PURE__*/React.createElement("a", {
    href: "tel:+919009480090",
    style: {
      color: 'inherit'
    }
  }, "+91 90094 80090"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      textAlign: bp.isMobile ? 'left' : 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: monoLight
  }, "Typeset in Inter Tight + JetBrains Mono."), /*#__PURE__*/React.createElement("span", {
    style: monoLight
  }, "Grid: 12 col \xD7 24 gutter. Hairlines at 1px."))));
}
Object.assign(window, {
  VariantA,
  AboutPage,
  CareerPage,
  ABuilt,
  ABanner,
  ANav,
  AHero,
  AMetrics,
  AWork,
  AOrigin,
  APrinciples,
  ACareer,
  AAbout,
  AContact,
  AFooter
});
