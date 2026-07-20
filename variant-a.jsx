// Variant A: SWISS GRID (Responsive)
// Desktop: strict 12-col grid. Tablet: 2-col adaptive. Mobile: single column.

// Paste your deployed Google Apps Script URL here after setup:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhhi3HmoZQ5Omybk_s424iDbCbdbDDXTCOFfGYhl9jjVqny_VoS9q0g-WLwCW6-5sX/exec';

const A = {
  paper: '#0F0D0B',
  paper2: '#1C1916',
  ink: '#EDEAE4',
  ink2: '#9A948D',
  mute: '#8C8680',
  line: 'rgba(237,234,228,0.09)',
  accent: '#E05320',
  accentSoft: '#2A1208',
  surf: '#080604',
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
  return (
    <React.Fragment>
      <style>{`@keyframes abPulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
      <div style={{
        background: A.surf,
        borderBottom: '1px solid rgba(237,234,228,0.1)',
        padding: `9px ${side}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: 99, background: A.accent,
          display: 'inline-block', flexShrink: 0,
          animation: 'abPulse 2s ease-in-out infinite'
        }} />
        <span style={{ ...aStyles.mono, color: 'rgba(244,241,236,0.72)', fontSize: bp.isMobile ? 9 : 10 }}>
          {bp.isMobile
            ? 'Right to work in the UK · Available now'
            : 'Full right to work in the UK · No sponsorship required · Available now · Remote, hybrid or on-site'}
        </span>
        <a href="#contact" data-cursor="hover" style={{
          ...aStyles.mono, fontSize: bp.isMobile ? 9 : 10, fontWeight: 500,
          color: A.accent, textDecoration: 'none', flexShrink: 0
        }}>Get in touch →</a>
      </div>
    </React.Fragment>
  );
}

function VariantA() {
  return (
    <div style={aStyles.root}>
      <CustomCursor accent={A.accent} />
      <div style={{ position: 'sticky', top: 0, zIndex: 82 }}>
        <ABanner />
        <ANav />
      </div>
      <main>
        <AHero />
        <AMetrics />
        <AWork />
        <AOrigin />
        <APrinciples />
        <ACareer />
        <AAbout />
        <AContact />
      </main>
      <AFooter />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function ANav() {
  const bp = useBreakpoint();
  const [t, setT] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      setT(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const links = ['Work', 'Origin', 'Principles', 'Career', 'Studio'];

  return (
    <nav style={{
      background: 'rgba(15,13,11,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${A.line}`
    }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto',
        padding: `0 ${sp(bp)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, gap: 16
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: A.accent, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Dipesh Gurav</span>
        </div>

        {/* Desktop nav links */}
        {bp.isDesktop && (
          <ul style={{ display: 'flex', gap: 28, listStyle: 'none', padding: 0, margin: 0, ...aStyles.mono }}>
            {links.map((x, i) => (
              <li key={x}>
                <a href={`#${x.toLowerCase()}`} data-cursor="hover"
                  style={{ color: A.mute, textDecoration: 'none', display: 'flex', gap: 6 }}>
                  {x}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Clock: desktop only */}
        {bp.isDesktop && (
          <div style={aStyles.mono}>
            <span style={{ color: A.ink }}>● </span>{t}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#contact" data-cursor="hover" style={{
            ...aStyles.cta, color: A.paper, background: A.accent,
            padding: '10px 16px', textDecoration: 'none',
            display: 'inline-flex', gap: 8, alignItems: 'center', flexShrink: 0
          }}>
            {bp.isMobile ? 'Hire me →' : 'Available for work →'}
          </a>

          {/* Hamburger: tablet + mobile */}
          {!bp.isDesktop && (
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
              style={{
                background: 'none', border: `1px solid ${A.line}`,
                padding: '8px 10px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0
              }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 18, height: 1, background: A.ink }} />
              ))}
            </button>
          )}
        </div>
      </div>

      {/* Mobile / tablet dropdown */}
      {!bp.isDesktop && open && (
        <div style={{ background: A.paper, borderTop: `1px solid ${A.line}`, padding: `8px ${sp(bp)} 16px` }}>
          {links.map((x) => (
            <a key={x} href={`#${x.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{
                ...aStyles.mono, display: 'flex', justifyContent: 'space-between',
                padding: '14px 0', color: A.ink, textDecoration: 'none',
                borderBottom: `1px solid ${A.line}`
              }}>
              {x} <span>→</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function AHero() {
  const bp = useBreakpoint();
  const [scroll, setScroll] = React.useState(0);

  React.useEffect(() => {
    const on = () => setScroll(window.scrollY);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const reduceMotion = React.useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const parallax = reduceMotion ? 0 : Math.min(scroll * 0.25, 80);
  const vPad = bp.isMobile ? '48px' : bp.isTablet ? '64px' : '80px';
  const side = sp(bp);

  return (
    <section style={{ padding: `${vPad} ${side} ${bp.isMobile ? '40px' : '48px'}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>

        {/* Meta row: hidden on mobile */}
        {!bp.isMobile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: bp.isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 24, marginBottom: bp.isTablet ? 40 : 64, ...aStyles.mono
          }}>
            <div>{PORTFOLIO.role} · est. 2014</div>
            <div>{PORTFOLIO.location} · Open UK-wide</div>
            {bp.isDesktop && <div>Portfolio / vol. MMXXVI</div>}
            {bp.isDesktop && (
              <div>
                <span style={{ color: A.accent }}>●</span> Open to work · immediate joiner
              </div>
            )}
          </div>
        )}

        {/* Headline */}
        <h1 style={{
          fontFamily: '"Inter Tight", "Inter", sans-serif',
          fontWeight: 500,
          fontSize: 'clamp(48px, 10vw, 168px)',
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          margin: 0,
          color: A.ink
        }}>
          Designing for<br />
          the humans<br />
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: bp.isMobile ? 12 : 24 }}>
            behind the
            <span style={{
              display: 'inline-block',
              width: 'clamp(48px, 10vw, 160px)',
              height: 'clamp(34px, 7vw, 110px)',
              background: A.accent,
              transform: `translateY(${parallax * 0.3}px)`,
              transition: 'transform 0.1s linear'
            }} aria-hidden />
          </span><br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>pixels.</span>
        </h1>

        {/* Caption row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1fr' : 'repeat(12, 1fr)',
          gap: 24,
          marginTop: bp.isMobile ? 40 : 80,
          alignItems: 'start'
        }}>
          <div style={bp.isDesktop ? { gridColumn: 'span 5' } : {}}>
            <p style={{ fontSize: bp.isMobile ? 16 : 18, lineHeight: 1.45, letterSpacing: '-0.01em', margin: 0, color: A.ink2 }}>
              {PORTFOLIO.lead}
            </p>
          </div>


          <div style={{
            gridColumn: bp.isDesktop ? 'span 3' : undefined,
            display: 'flex', flexDirection: 'column', gap: 8,
            marginTop: bp.isMobile ? 16 : 0
          }}>
            <a href="#work" data-cursor="hover" style={{
              ...aStyles.cta, padding: '13px 16px', background: A.ink, color: A.paper,
              textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              View the index <span style={{ color: A.accent }}>→</span>
            </a>
            <a href="#contact" data-cursor="hover" style={{
              ...aStyles.cta, fontWeight: 500, padding: '13px 16px', border: `1px solid rgba(237,234,228,0.2)`,
              color: A.ink, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              Start a project <span style={{ color: A.accent }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── METRICS ─────────────────────────────────────────────────────────────────
// Extracted to avoid calling useCounter inside .map() (hooks-in-loop violation)
function AMetricItem({ m, i, inView, bp }) {
  const v = useCounter(m.value, inView, 1400 + i * 120);
  return (
    <div style={{
      padding: bp.isMobile ? '20px 16px' : '24px 28px',
      borderRight: `1px solid ${A.line}`,
      display: 'flex', flexDirection: 'column', gap: 6
    }}>
      <div style={aStyles.mono}>0{i + 1} / 04</div>
      <div style={{ fontSize: bp.isMobile ? 40 : 56, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, color: A.ink, marginTop: 8 }}>
        {fmt(v, { decimals: 0 })}<span style={{ color: A.accent }}>{m.suffix}</span>
      </div>
      <div style={{ fontSize: 13, color: A.ink, marginTop: 8 }}>{m.label}</div>
      <div style={aStyles.mono}>{m.sub}</div>
    </div>
  );
}

function AMetrics() {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal({ threshold: 0.2 });
  const cols = bp.isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)';
  const side = sp(bp);
  return (
    <section ref={ref} style={{ borderBottom: `1px solid ${A.line}`, padding: `32px ${side}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: cols, borderLeft: `1px solid ${A.line}` }}>
        {PORTFOLIO.metrics.map((m, i) => (
          <AMetricItem key={i} m={m} i={i} inView={inView} bp={bp} />
        ))}
      </div>
    </section>
  );
}

// ─── WORK ────────────────────────────────────────────────────────────────────
function AWork() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '56px' : '96px';
  return (
    <section id="work" style={{ padding: `${vPad} ${side}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isMobile ? '1fr' : bp.isTablet ? '1fr 1fr' : 'repeat(12, 1fr)',
          gap: 24, marginBottom: bp.isMobile ? 32 : 64
        }}>
          <div style={bp.isDesktop ? { gridColumn: 'span 7' } : {}}>
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Selected Work · 2020–2025</div>
            <h2 style={{ fontSize: bp.isMobile ? 28 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              Eight products. Four markets.<br />
              <span style={{ color: A.mute }}>Measurable behaviour change.</span>
            </h2>
          </div>
          {bp.isDesktop && (
            <div style={{ gridColumn: 'span 4', alignSelf: 'end', textAlign: 'right', ...aStyles.mono }}>
              Click any row to<br />open the case study.
            </div>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${A.line}` }}>
          {PORTFOLIO.projects.filter(p => p.selected !== false).map((p) => <AProjectRow key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

function AProjectRow({ p }) {
  const bp = useBreakpoint();
  const [ref, inView] = useReveal();
  const [hover, setHover] = React.useState(false);

  const baseStyle = {
    textDecoration: 'none', color: A.ink,
    opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)',
    transition: 'opacity .6s, transform .6s, background .18s',
    borderBottom: `1px solid ${A.line}`
  };

  // Mobile: simple two-column card
  if (bp.isMobile) {
    return (
      <a ref={ref} href={p.href} style={{
        ...baseStyle, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '20px 0'
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 6 }}>{p.title}</div>
          <div style={{ fontSize: 12, color: A.ink2 }}>{p.tagline}</div>
          <div style={{ ...aStyles.mono, marginTop: 6 }}>{p.kicker}</div>
        </div>
        <span style={{ color: A.accent, fontSize: 20, flexShrink: 0, marginLeft: 16 }}>→</span>
      </a>
    );
  }

  // Tablet: 4-column
  if (bp.isTablet) {
    return (
      <a ref={ref} href={p.href}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          ...baseStyle, display: 'grid',
          gridTemplateColumns: '1fr 1fr 32px',
          gap: 16, alignItems: 'center', padding: '24px 8px',
          background: hover ? A.paper2 : 'transparent'
        }}>
        <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em' }}>{p.title}</span>
        <span style={{ fontSize: 13, color: A.ink2 }}>{p.tagline}</span>
        <span style={{ fontSize: 18, color: hover ? A.accent : A.mute, transition: 'color .18s', textAlign: 'right' }}>
          {hover ? '→' : '·'}
        </span>
      </a>
    );
  }

  // Desktop: full 6-column with hover preview
  return (
    <a ref={ref} href={p.href} data-cursor="hover"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...baseStyle, display: 'grid',
        gridTemplateColumns: '2fr 3fr 2fr 1.2fr 40px',
        gap: 24, alignItems: 'center', padding: '28px 8px',
        position: 'relative',
        background: hover ? A.paper2 : 'transparent'
      }}>
      <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>
        {p.title}
      </span>
      <span style={{ fontSize: 14, color: A.ink2, letterSpacing: '-0.005em' }}>{p.tagline}</span>
      <span style={aStyles.mono}>{p.kicker}</span>
      <span style={{ ...aStyles.mono, textAlign: 'right' }}>{p.year}</span>
      <span style={{ fontSize: 18, color: hover ? A.accent : A.mute, transition: 'color .18s', textAlign: 'right' }}>
        {hover ? '→' : '·'}
      </span>
      <div style={{
        position: 'absolute', left: '20%', top: '100%', width: 280,
        pointerEvents: 'none', zIndex: 20,
        opacity: hover ? 1 : 0, transform: hover ? 'translateY(4px)' : 'translateY(-4px)',
        transition: 'opacity .22s, transform .22s'
      }}>
        {p.image
          ? <img src={p.image} alt="" loading="lazy" decoding="async" style={{ width: '100%', display: 'block', boxShadow: '0 20px 60px rgba(20,17,15,0.22)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          : <Placeholder label={`${p.id}.png`} tone="ink" />
        }
      </div>
    </a>
  );
}

// ─── ORIGIN ──────────────────────────────────────────────────────────────────
function AOrigin() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';

  return (
    <section id="origin" style={{ background: A.surf, color: A.ink, padding: `${vPad} ${side}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isDesktop ? 'repeat(12, 1fr)' : '1fr',
          gap: 24
        }}>

          {/* Left */}
          <div style={bp.isDesktop ? { gridColumn: 'span 7' } : {}}>
            {bp.isDesktop && <div style={{ marginBottom: 12 }} />}
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 20 }}>The origin story</div>
            <h2 style={{
              fontSize: 'clamp(36px, 7vw, 88px)',
              fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: 0
            }}>
              One night.<br />
              Zero brief.<br />
              <span style={{ fontStyle: 'italic', color: A.accent }}>A national symbol.</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(237,234,228,0.82)', maxWidth: bp.isDesktop ? 480 : '100%', marginTop: 40 }}>
              May 2020. India launches Aatmnirbhar Bharat. I open Illustrator. By morning, the logo is on government
              campaigns, manufacturer packaging and news tickers across the country. Officially adopted for PM SVANidhi.
              No brief. No client. No credit.
            </p>
            <p style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: bp.isMobile ? 18 : 22, lineHeight: 1.4, color: A.ink, marginTop: 32, maxWidth: bp.isDesktop ? 520 : '100%' }}>
              "Good design does not ask permission; it simply works for people."
            </p>
          </div>

          {/* Right: stats */}
          <div style={{
            gridColumn: bp.isDesktop ? 'span 5' : undefined,
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            border: `1px solid rgba(244,241,236,0.12)`,
            marginTop: bp.isMobile ? 48 : bp.isTablet ? 48 : 0
          }}>
            {[
              ['90%', 'Manufacturers using it'],
              ['1 night', 'From blank to national'],
              ['PM SVANidhi', 'Official adoption'],
              ['0', 'Briefs received']
            ].map(([n, l], i) => (
              <div key={i} style={{
                padding: bp.isMobile ? '20px 16px' : 28,
                borderRight: i % 2 === 0 ? `1px solid rgba(244,241,236,0.12)` : 'none',
                borderBottom: i < 2 ? `1px solid rgba(244,241,236,0.12)` : 'none'
              }}>
                <div style={{ fontSize: bp.isMobile ? 28 : 40, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
                <div style={{ ...aStyles.mono, color: 'rgba(237,234,228,0.70)', marginTop: 12 }}>{l}</div>
              </div>
            ))}
            <div style={{ gridColumn: 'span 2', padding: bp.isMobile ? '20px 16px' : 28, background: 'rgba(194,65,12,0.1)', borderTop: `1px solid rgba(244,241,236,0.08)` }}>
              <div style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: bp.isMobile ? 18 : 22, color: A.accent, letterSpacing: '-0.01em' }}>
                Design captures culture, not just pixels.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRINCIPLES ──────────────────────────────────────────────────────────────
function APrinciples() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const cols = bp.isMobile ? '1fr' : bp.isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <section id="principles" style={{ padding: `${vPad} ${side}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ marginBottom: bp.isMobile ? 32 : 48 }}>
          {bp.isDesktop && <div style={{ marginBottom: 8 }} />}
          <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Operating principles</div>
          <h2 style={{ fontSize: bp.isMobile ? 28 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
            Six beliefs that decide<br />every design call.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, borderTop: `1px solid ${A.line}`, borderLeft: `1px solid ${A.line}` }}>
          {PORTFOLIO.principles.map((p, i) => (
            <div key={i} style={{
              padding: bp.isMobile ? '24px 20px' : 32,
              borderRight: `1px solid ${A.line}`, borderBottom: `1px solid ${A.line}`,
              minHeight: bp.isMobile ? 'auto' : 240,
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ ...aStyles.mono, color: A.accent }}>Principle</span>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: A.line }} />
              </div>
              <h3 style={{ fontSize: bp.isMobile ? 17 : 20, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0, marginBottom: 16, color: A.ink }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 13.5, color: A.mute, lineHeight: 1.6, margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CAREER ──────────────────────────────────────────────────────────────────
// Extracted to avoid calling useReveal inside .map() (hooks-in-loop violation)
function ACareerItem({ c, i, bp }) {
  const [ref, inView] = useReveal();

  const gridCols = bp.isMobile
    ? '72px 1fr'
    : bp.isTablet
    ? '72px 1fr 1fr'
    : '64px 260px 3fr 1fr';

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
        <span style={{ color: A.ink }}>{c.from}</span>
        <span>→ {c.to}</span>
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
            <span style={{ fontSize: 13, color: A.accent, fontWeight: 400, letterSpacing: 0 }}>{c.org}</span>
          </span>
        )}
        {!bp.isDesktop && (
          <div>
            <div style={{ fontSize: bp.isMobile ? 16 : 20, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{c.role}</div>
            <div style={{ fontSize: 13, color: A.accent, marginTop: 4 }}>{c.org}</div>
            <p style={{ fontSize: 13, color: A.mute, lineHeight: 1.65, margin: '12px 0 0' }}>{c.body}</p>
            {c.nda && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: A.accent, display: 'inline-block', flexShrink: 0, marginTop: 3 }} />
                <span style={{ ...aStyles.mono, fontSize: 9, color: A.accent, lineHeight: 1.6 }}>{c.nda}</span>
              </div>
            )}
            {bp.isMobile && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                {c.tags.map((t) => (
                  <span key={t} style={{ ...aStyles.mono, fontSize: 9, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2 }}>{t}</span>
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
            <span key={t} style={{ ...aStyles.mono, fontSize: 9, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2 }}>{t}</span>
          ))}
        </div>
      )}

      {/* Desktop: body + NDA note + tags in separate columns */}
      {bp.isDesktop && (
        <div>
          <span style={{ fontSize: 13.5, color: A.mute, lineHeight: 1.65 }}>{c.body}</span>
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
            <span key={t} style={{ ...aStyles.mono, fontSize: 9, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2, textTransform: 'uppercase' }}>{t}</span>
          ))}
        </span>
      )}
    </div>
  );
}

function ACareer() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';

  return (
    <section id="career" style={{ padding: `${vPad} ${side}`, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
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
            <h2 style={{ fontSize: bp.isMobile ? 28 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              Twelve years,<br />four cities, millions of users.
            </h2>
          </div>
          <a href="/dipesh-gurav-cv.pdf" download data-cursor="hover" style={{
            ...aStyles.cta, fontWeight: 500, padding: '12px 16px', border: `1px solid rgba(237,234,228,0.2)`,
            color: A.ink, textDecoration: 'none', flexShrink: 0,
            display: 'inline-flex', gap: 10, alignItems: 'center'
          }}>
            Download PDF résumé <span style={{ color: A.accent }}>→</span>
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

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function AAbout() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';

  const sidebarRow = (label, children, last = false) => (
    <div style={{ padding: '20px 24px', borderBottom: last ? 'none' : `1px solid ${A.line}` }}>
      <div style={{ ...aStyles.mono, color: A.mute, marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );

  return (
    <section id="studio" style={{ padding: `${vPad} ${side}`, background: A.paper, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isDesktop ? 'repeat(12, 1fr)' : '1fr',
          gap: 24,
          alignItems: 'start'
        }}>
          {/* Main bio */}
          <div style={bp.isDesktop ? { gridColumn: 'span 7' } : {}}>
            {bp.isDesktop && <div style={{ marginBottom: 8 }} />}
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>The person behind the work</div>
            <h2 style={{ fontSize: bp.isMobile ? 26 : 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0, marginBottom: 40 }}>
              I became a designer because<br />technology is supposed to make<br />life <span style={{ fontStyle: 'italic' }}>easier</span>.
            </h2>
            <div style={{ fontSize: 15, lineHeight: 1.75, color: A.ink2, borderTop: `1px solid ${A.line}`, paddingTop: 32 }}>
              <p style={{ margin: 0 }}>I grew up watching technology promise to simplify life, then complicate it. A form too long. A menu that hides the thing you need. An app that helps and frustrates in equal measure. That gap between what technology promises and what it actually does became my professional obsession.</p>
              <p style={{ marginTop: 16 }}>The work has taken me across industries: enterprise AI, consumer wellbeing, e-commerce, national identity, but the design problem is always the same: reduce the distance between what someone needs to do and what the product lets them do. The medium changes. The brief does not.</p>
              <p style={{ marginTop: 16 }}>I have designed for a billion-person market, a Gulf audience shaped by faith and cultural ritual, and enterprise operators in fourteen countries. Each taught me that the word "intuitive" carries an unspoken postscript: <em>intuitive for whom</em>. The answer is never assumed. It is always researched.</p>
              <p style={{ marginTop: 16 }}>Off-hours I water plants, tidy rooms and keep simple rituals. They remind me why clarity matters, in life and in the grid.</p>
            </div>
          </div>

          {/* Sidebar: unified panel */}
          <div style={{
            gridColumn: bp.isDesktop ? 'span 5' : undefined,
            marginTop: bp.isMobile || bp.isTablet ? 48 : 0,
            background: A.paper2,
            border: `1px solid ${A.line}`,
          }}>
            {sidebarRow('Availability', (
              <>
                <div style={{ fontSize: 14, color: A.ink, lineHeight: 1.6 }}>Open to work · Immediate joiner</div>
                <div style={{ fontSize: 14, color: A.ink2, lineHeight: 1.6 }}>Remote · Hybrid · On-site · UK-wide</div>
              </>
            ))}
            {sidebarRow('Experience', (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['12+ years', '14 countries', '1M+ downloads shipped'].map((v) => (
                  <div key={v} style={{ fontSize: 14, color: A.ink, lineHeight: 1.5 }}>{v}</div>
                ))}
              </div>
            ))}
            {sidebarRow('Skills · Tools', (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PORTFOLIO.skills.map((s) => (
                  <span key={s} style={{ fontSize: 11, padding: '5px 9px', background: A.paper, color: A.ink2, border: `1px solid ${A.line}` }}>{s}</span>
                ))}
              </div>
            ))}
            {sidebarRow('Notable', (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PORTFOLIO.notable.map((n) => (
                  <li key={n} style={{ fontSize: 12.5, display: 'flex', gap: 10, alignItems: 'flex-start', color: A.ink2 }}>
                    <span style={{ color: A.accent, flexShrink: 0, lineHeight: 1.6 }}>·</span>{n}
                  </li>
                ))}
              </ul>
            ), true)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
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

function AContact() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const vPad = bp.isMobile ? '72px' : '120px';
  const [form, setForm] = React.useState({ name: '', email: '', msg: '' });
  const [errors, setErrors] = React.useState({});
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [senderName, setSenderName] = React.useState('');
  const [sendError, setSendError] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.msg.trim().length < 8) errs.msg = 'Tell me a bit more';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    setSendError(false);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name: form.name, email: form.email, message: form.msg })
      });
      setSenderName(form.name);
      setForm({ name: '', email: '', msg: '' });
      setSent(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{ background: A.surf, color: A.ink, padding: `${vPad} ${side}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: bp.isDesktop ? '7fr 5fr' : '1fr',
          gap: bp.isMobile ? 48 : 64,
          alignItems: bp.isDesktop ? 'stretch' : 'start'
        }}>
          {/* Left: intro top, links pushed to bottom */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              {bp.isDesktop && <div style={{ marginBottom: 12 }} />}
              <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Let's work together</div>
              <h2 style={{
                fontSize: 'clamp(36px, 7vw, 88px)',
                fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: 0
              }}>
                Let's build<br />
                something <span style={{ fontStyle: 'italic', color: A.accent }}>meaningful.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(237,234,228,0.80)', maxWidth: bp.isDesktop ? 460 : '100%', marginTop: 32 }}>
                Open to senior product design roles, consulting, and conversations with people who care about the humans behind the pixels.
              </p>
            </div>
            {/* Spacer: pushes links to bottom on desktop */}
            {bp.isDesktop && <div style={{ flex: 1 }} />}
            <div style={{ marginTop: bp.isDesktop ? 0 : 40 }}>
              <div style={{ ...aStyles.mono, color: 'rgba(237,234,228,0.65)', marginBottom: 10 }}>Direct lines</div>
              {PORTFOLIO.links.map((l) => (
                <a key={l.label} href={l.href} data-cursor="hover"
                  style={{
                    display: 'flex', alignItems: 'center', gap: bp.isMobile ? 12 : 16,
                    padding: '9px 0',
                    textDecoration: 'none', color: A.ink, transition: 'padding-left .2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseLeave={(e) => e.currentTarget.style.paddingLeft = '0'}>
                  <span aria-hidden="true" style={{
                    width: 36, height: 36, flexShrink: 0,
                    border: `1px solid rgba(244,241,236,0.16)`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: A.accent
                  }}>
                    <AContactIcon type={l.label} />
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                    <span style={{ ...aStyles.mono, fontSize: 9 }}>{l.label}</span>
                    <span style={{
                      fontSize: bp.isMobile ? 15 : 17, fontWeight: 500, letterSpacing: '-0.01em',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>{l.value}</span>
                  </span>
                  <span style={{ marginLeft: 'auto', color: A.accent, fontSize: 16, flexShrink: 0 }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: form pinned to bottom, aligning with first link */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: bp.isDesktop ? 'flex-end' : 'flex-start'
          }}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 12 }}>/ Message received</div>
                  <h3 style={{
                    fontSize: bp.isMobile ? 22 : 28,
                    fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.2,
                    margin: 0, color: A.ink
                  }}>
                    Thanks, {senderName}.<br />I'll be in touch.
                  </h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(237,234,228,0.80)', margin: 0 }}>
                  Your message landed safely. I read every enquiry personally and typically reply within 48 hours.
                </p>
                <button onClick={() => { setSent(false); setSendError(false); }} data-cursor="hover"
                  style={{
                    ...aStyles.cta, fontWeight: 500, padding: '14px 20px',
                    background: 'transparent', color: A.ink,
                    border: `1px solid rgba(237,234,228,0.2)`,
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'border-color .2s'
                  }}>
                  Send another message <span style={{ color: A.accent }}>→</span>
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ ...aStyles.mono, color: 'rgba(237,234,228,0.65)', marginBottom: 12 }}>Write to me</div>
                  <h3 style={{
                    fontSize: bp.isMobile ? 22 : 28,
                    fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1,
                    margin: 0, color: A.ink
                  }}>
                    Or drop me a line directly.
                  </h3>
                </div>
                <AField label="Name" placeholder="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
                <AField label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
                <AField label="Message" multiline placeholder="What are we building?" value={form.msg} onChange={(v) => setForm({ ...form, msg: v })} error={errors.msg} />
                {sendError && (
                  <p style={{ ...aStyles.mono, color: A.accent, margin: 0 }}>
                    Something went wrong. Try emailing me directly.
                  </p>
                )}
                <button type="submit" data-cursor="hover" disabled={sending}
                  style={{
                    ...aStyles.cta, padding: '15px 20px',
                    background: sending ? 'rgba(237,234,228,0.1)' : A.accent,
                    color: sending ? A.ink : A.paper, border: 'none', cursor: sending ? 'default' : 'pointer',
                    textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'background .2s'
                  }}>
                  {sending ? 'Sending…' : 'Send transmission'} <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AField({ label, type = 'text', value, onChange, error, multiline, placeholder }) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', ...aStyles.mono, color: focus ? A.accent : 'rgba(237,234,228,0.75)', marginBottom: 8, transition: 'color .2s', cursor: 'text' }}>
        <span>{label}</span>
        {error && <span style={{ color: A.accent }}>✱ {error}</span>}
      </label>
      <Tag
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        data-cursor="text"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={multiline ? 4 : undefined}
        style={{
          width: '100%',
          background: focus ? 'rgba(224,83,32,0.05)' : 'rgba(237,234,228,0.04)',
          border: `1px solid ${focus ? A.accent : 'rgba(237,234,228,0.16)'}`,
          padding: '12px 14px', color: A.ink, fontSize: 16,
          fontFamily: 'inherit', outline: 'none', resize: 'vertical',
          transition: 'border-color .2s, background .2s'
        }} />
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function AFooter() {
  const bp = useBreakpoint();
  const side = sp(bp);
  const monoLight = { ...aStyles.mono, color: 'rgba(237,234,228,0.65)' };

  return (
    <footer style={{ background: A.surf, padding: `72px ${side} 64px`, color: 'rgba(237,234,228,0.65)', borderTop: `1px solid rgba(237,234,228,0.10)` }}>
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

Object.assign(window, { VariantA, ABanner, ANav, AHero, AMetrics, AWork, AOrigin, APrinciples, ACareer, AAbout, AContact, AFooter });
