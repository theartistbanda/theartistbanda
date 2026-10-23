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
  // Primary pairs dark ink text on accent (~5:1, AA) or paper on ink (~15:1).
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
function ABanner() {
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
    href: "#contact",
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
function VariantA() {
  return /*#__PURE__*/React.createElement("div", {
    style: aStyles.root
  }, /*#__PURE__*/React.createElement("a", {
    href: "#main",
    className: "skip-link"
  }, "Skip to content"), /*#__PURE__*/React.createElement(CustomCursor, {
    accent: A.accent
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 82
    }
  }, /*#__PURE__*/React.createElement(ABanner, null), /*#__PURE__*/React.createElement(ANav, null)), /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    style: {
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement(AHero, null), /*#__PURE__*/React.createElement(AMetrics, null), /*#__PURE__*/React.createElement(AWork, null), /*#__PURE__*/React.createElement(APrinciples, null), /*#__PURE__*/React.createElement(ACareer, null), /*#__PURE__*/React.createElement(AAbout, null), /*#__PURE__*/React.createElement(AOrigin, null), /*#__PURE__*/React.createElement(AContact, null)), /*#__PURE__*/React.createElement(AFooter, null));
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
function ANav() {
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
  const links = ['Work', 'Principles', 'Career', 'Studio', 'Origin'];
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
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      flexShrink: 0
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
  }, links.map((x, i) => /*#__PURE__*/React.createElement("li", {
    key: x
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${x.toLowerCase()}`,
    "data-cursor": "hover",
    style: {
      color: A.mute,
      textDecoration: 'none',
      display: 'flex',
      gap: 6
    }
  }, x)))), bp.isDesktop && /*#__PURE__*/React.createElement("div", {
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
    href: "#contact",
    "data-cursor": "hover",
    className: "cta cta-primary",
    style: {
      ...aStyles.cta,
      color: A.paper,
      background: A.accent,
      padding: bp.isMobile ? '10px 12px' : '10px 16px',
      textDecoration: 'none',
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center',
      flexShrink: 0
    }
  }, bp.isMobile ? 'Hire me' : 'Available for work', " ", /*#__PURE__*/React.createElement("span", {
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
    key: x,
    href: `#${x.toLowerCase()}`,
    onClick: () => setOpen(false),
    style: {
      ...aStyles.mono,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '14px 0',
      color: A.ink,
      textDecoration: 'none',
      borderBottom: `1px solid ${A.line}`
    }
  }, x, " ", /*#__PURE__*/React.createElement("span", null, "\u2192")))));
}

// ─── HERO ────────────────────────────────────────────────────────────────────
const SHOW_HERO_ACCENT_BOX = false; // toggle to bring back the orange block in the headline

function AHero() {
  const bp = useBreakpoint();
  const [scroll, setScroll] = React.useState(0);
  React.useEffect(() => {
    const on = () => setScroll(window.scrollY);
    window.addEventListener('scroll', on, {
      passive: true
    });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const reduceMotion = React.useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const parallax = reduceMotion ? 0 : Math.min(scroll * 0.25, 80);
  // Side-by-side headline/caption needs real breathing room - below this, fall back
  // to the original full-width stacked headline so the 2-line break never gets
  // squeezed into wrapping a 3rd line at the 1024px desktop breakpoint edge.
  const wideLayout = bp.w >= 1360;
  const vPad = bp.isMobile ? '48px' : bp.isTablet ? '64px' : '80px';
  const side = sp(bp);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: `${vPad} ${side} ${bp.isMobile ? '40px' : '48px'}`,
      borderBottom: `1px solid ${A.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto'
    }
  }, !bp.isMobile && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: bp.isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: 24,
      marginBottom: bp.isTablet ? 40 : 64,
      ...aStyles.mono
    }
  }, /*#__PURE__*/React.createElement("div", null, PORTFOLIO.role, " \xB7 est. 2015"), /*#__PURE__*/React.createElement("div", null, PORTFOLIO.location, " \xB7 Open UK-wide"), bp.isDesktop && /*#__PURE__*/React.createElement("div", null, "Portfolio / vol. MMXXVI"), bp.isDesktop && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.accent
    }
  }, "\u25CF"), " Open to work \xB7 immediate joiner")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: wideLayout ? 'minmax(0, 1fr) 400px' : '1fr',
      gap: wideLayout ? 56 : 24,
      alignItems: wideLayout ? 'center' : 'start'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: '"Inter Tight", "Inter", sans-serif',
      fontWeight: 500,
      fontSize: bp.isDesktop ? 'clamp(56px, 4.2vw, 68px)' : 'clamp(48px, 10vw, 168px)',
      lineHeight: bp.isDesktop ? 1.06 : 0.92,
      letterSpacing: bp.isDesktop ? '-0.03em' : '-0.04em',
      margin: 0,
      color: A.ink
    }
  }, bp.isDesktop ? /*#__PURE__*/React.createElement(React.Fragment, null, "Designing for the", /*#__PURE__*/React.createElement("br", null), "humans behind the", ' ', SHOW_HERO_ACCENT_BOX && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 'clamp(32px, 5vw, 64px)',
      height: 'clamp(24px, 3.6vw, 46px)',
      background: A.accent,
      verticalAlign: 'middle',
      marginRight: 8,
      transform: `translateY(${parallax * 0.3}px)`,
      transition: 'transform 0.1s linear'
    },
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      fontWeight: 400,
      color: A.accent
    }
  }, "pixels.")) : /*#__PURE__*/React.createElement(React.Fragment, null, "Designing for", /*#__PURE__*/React.createElement("br", null), "the humans", /*#__PURE__*/React.createElement("br", null), "behind the", ' ', SHOW_HERO_ACCENT_BOX && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 'clamp(48px, 10vw, 160px)',
      height: 'clamp(34px, 7vw, 110px)',
      background: A.accent,
      verticalAlign: 'middle',
      marginRight: 12,
      transform: `translateY(${parallax * 0.3}px)`,
      transition: 'transform 0.1s linear'
    },
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      fontWeight: 400,
      color: A.accent
    }
  }, "pixels."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: wideLayout ? 0 : 40
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: bp.isMobile ? 16 : 18,
      lineHeight: 1.45,
      letterSpacing: '-0.01em',
      margin: 0,
      color: A.ink2
    }
  }, PORTFOLIO.lead), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#work",
    "data-cursor": "hover",
    className: "cta cta-outline",
    style: {
      ...aStyles.cta,
      padding: '13px 16px',
      border: `1px solid rgba(var(--ink-rgb), 0.2)`,
      color: A.accent,
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, "View the index ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("a", {
    href: "#contact",
    "data-cursor": "hover",
    className: "cta cta-outline",
    style: {
      ...aStyles.cta,
      fontWeight: 500,
      padding: '13px 16px',
      border: `1px solid rgba(var(--ink-rgb), 0.2)`,
      color: A.ink,
      textDecoration: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, "Start a project ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow",
    style: {
      color: A.accent
    }
  }, "\u2192")))))));
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
  }, "Selected Work \xB7 2018\u20132026"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: bp.isMobile ? 28 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0
    }
  }, "Eight products. Four markets.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.mute
    }
  }, "Measurable behaviour change."))), bp.isDesktop && /*#__PURE__*/React.createElement("div", {
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
  }, PORTFOLIO.projects.filter(p => p.selected !== false).map(p => /*#__PURE__*/React.createElement(AProjectRow, {
    key: p.id,
    p: p
  })))));
}
function AProjectRow({
  p
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
    borderBottom: `1px solid ${A.line}`
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
  }, "An open competition.", /*#__PURE__*/React.createElement("br", null), "A golden bird.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: A.accent
    }
  }, "A mark India picked up.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: 'rgba(var(--ink-rgb), 0.82)',
      maxWidth: bp.isDesktop ? 480 : '100%',
      marginTop: 40
    }
  }, "I entered an open MyGov competition to design a mark for the Aatmnirbhar Bharat campaign: the Indian tricolour and Ashok Chakra fused with a golden bird, a reference to the country once being called sone ki chidiya. The competition was never formally decided. The mark was taken up by the PM SVANidhi scheme and used by manufacturers marking Indian-made goods, without credit."), /*#__PURE__*/React.createElement("p", {
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
  }, "Six beliefs that decide", /*#__PURE__*/React.createElement("br", null), "every design call.")), /*#__PURE__*/React.createElement("div", {
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
  }, " about my role at ", orgName), /*#__PURE__*/React.createElement("span", {
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
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: A.ink
    }
  }, c.from), /*#__PURE__*/React.createElement("span", null, "\u2192 ", c.to), c.current && /*#__PURE__*/React.createElement("span", {
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
function ACareer() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  return /*#__PURE__*/React.createElement("section", {
    id: "career",
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
  }, "Curriculum vitae"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: bp.isMobile ? 28 : 44,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0
    }
  }, "Eleven years,", /*#__PURE__*/React.createElement("br", null), "four cities, over a million downloads.")), /*#__PURE__*/React.createElement("a", {
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
  }, "easier"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.75,
      color: A.ink2,
      borderTop: `1px solid ${A.line}`,
      paddingTop: 32
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "I have spent around eleven years in design, and I love what I do: solving problems in human-computer interaction. I grew up watching technology promise to make life easier, then complicate it. Forms that run too long, menus that hide the one thing you need, apps that help and frustrate in equal measure. Closing that gap is the work I thrive on."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16
    }
  }, "For most of my career I have been an individual contributor on projects with no clear brief. There was always an idea, a problem or a gap, and how and where to start was mine to decide. I preferred it that way. Co-founding a production house with college friends, and handling over 200 clients in under three years, removed every inch of hesitation I had about speaking to a room, winning people over to an idea and turning them into long-term stakeholders."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16
    }
  }, "Screens are just a medium. How a product feels comes from the person's experience, and the screen comes later. Understanding people and their behaviour comes first, whether I am designing an AI tool for operators on live calls, a wellbeing app, or a logo that ended up on Indian-made goods across the country."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16
    }
  }, "The work has taken me to a billion-person market in India, to Gulf users who read right to left, and to enterprise teams in 14 countries. YourHour, a wellbeing app I designed, ships in 22 languages and has passed a million downloads. Every one of those audiences taught me that \"intuitive\" carries a quiet question, ", /*#__PURE__*/React.createElement("em", null, "intuitive for whom"), ". Knowing beats assuming, so the answer comes from sitting alongside users, not from a report."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16
    }
  }, "The simplest things are the hardest to create. Ask a room full of people what a product should have and they will list dozens of features. Ask them to prune the list and the room goes quiet. Minimalism inspires me, and my layouts leave no room for unnecessary friction: clean on the surface, built cleanly behind the scenes."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16
    }
  }, "Away from work I read, and I lose hours to brain games. Both keep me practised at the thing design needs most: finding the pattern under the noise."))), /*#__PURE__*/React.createElement("div", {
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
  }, ['11 years', '14 countries', '1M+ downloads shipped'].map(v => /*#__PURE__*/React.createElement("div", {
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
  }, "meaningful.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'rgba(var(--ink-rgb), 0.80)',
      maxWidth: bp.isDesktop ? 460 : '100%',
      marginTop: 32
    }
  }, "Open to senior product design roles, consulting, and conversations with people who care about the humans behind the pixels.")), bp.isDesktop && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: bp.isDesktop ? 0 : 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...aStyles.mono,
      color: 'rgba(var(--ink-rgb), 0.65)',
      marginBottom: 10
    }
  }, "Direct lines"), PORTFOLIO.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    "data-cursor": "hover",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: bp.isMobile ? 12 : 16,
      padding: '9px 0',
      textDecoration: 'none',
      color: A.ink,
      transition: 'padding-left .2s'
    },
    onMouseEnter: e => e.currentTarget.style.paddingLeft = '8px',
    onMouseLeave: e => e.currentTarget.style.paddingLeft = '0'
  }, /*#__PURE__*/React.createElement("span", {
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
    type: l.label
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
      whiteSpace: 'nowrap'
    }
  }, l.value)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: A.accent,
      fontSize: 16,
      flexShrink: 0
    }
  }, "\u2192"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: bp.isDesktop ? 'flex-end' : 'flex-start'
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
  }, "Thanks, ", senderName, ".", /*#__PURE__*/React.createElement("br", null), "I'll be in touch.")), /*#__PURE__*/React.createElement("p", {
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
  }, "Or drop me a line directly.")), /*#__PURE__*/React.createElement("div", {
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
    className: "cta cta-primary",
    style: {
      ...aStyles.cta,
      padding: '18px 20px',
      width: '100%',
      background: sending ? 'rgba(var(--ink-rgb), 0.1)' : A.accent,
      color: sending ? A.ink : A.paper,
      border: 'none',
      cursor: sending ? 'default' : 'pointer',
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, sending ? 'Sending…' : 'Send transmission', " ", /*#__PURE__*/React.createElement("span", {
    className: "cta-arrow"
  }, "\u2192")))))))));
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
      color: error ? A.accent : 'rgba(var(--ink-rgb), 0.65)'
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
  }, "+44 7352 673152"))), /*#__PURE__*/React.createElement("div", {
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
