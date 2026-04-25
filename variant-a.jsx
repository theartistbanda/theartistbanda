// Variant A — SWISS GRID
// Strict 12-col grid, mono + humanist sans, tiny type, one warm accent.
// Very "Kunsthalle catalogue" — hairlines, field notes, a single red/rust dot.

const A = {
  paper: '#F4F1EC',
  paper2: '#EAE5DC',
  ink: '#14110F',
  ink2: '#2A2622',
  mute: '#6E6A63',
  line: 'rgba(20,17,15,0.14)',
  accent: '#C2410C',
  accentSoft: '#F4D9C8'
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
    fontFamily: 'ui-monospace, "JetBrains Mono", "IBM Plex Mono", Menlo, monospace',
    fontSize: 10,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: A.mute
  }
};

function VariantA() {
  const accent = A.accent;
  return (
    <div style={aStyles.root}>
      <CustomCursor accent={accent} />
      <ANav />
      <AHero />
      <AMetrics />
      <AWork />
      <AOrigin />
      <APrinciples />
      <ACareer />
      <AAbout />
      <AContact />
      <AFooter />
    </div>);

}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function ANav() {
  const [t, setT] = React.useState('');
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      // London time — static offset; good enough for a portfolio chrome.
      setT(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 80,
        background: 'rgba(244,241,236,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${A.line}`
      }}>
      
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '2fr 5fr 2fr 3fr', alignItems: 'center', height: 56, gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: A.accent, display: 'inline-block' }} />
          <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Dipesh Gurav</span>
          <span style={aStyles.mono}>/ 001</span>
        </div>
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none', padding: 0, margin: 0, ...aStyles.mono }}>
          {['Index', 'Work', 'Origin', 'Career', 'Studio'].map((x, i) =>
          <li key={x}>
              <a
              href={`#${x.toLowerCase()}`}
              data-cursor="hover"
              style={{ color: A.mute, textDecoration: 'none', display: 'flex', gap: 6 }}>
              
                <span style={{ color: A.ink }}>{String(i).padStart(2, '0')}</span>
                {x}
              </a>
            </li>
          )}
        </ul>
        <div style={aStyles.mono}>
          <span style={{ color: A.ink }}>● </span>{t}
        </div>
        <div style={{ textAlign: 'right' }}>
          <a
            href="#contact"
            data-cursor="hover"
            style={{
              ...aStyles.mono, color: A.paper, background: A.ink,
              padding: '8px 14px', textDecoration: 'none', display: 'inline-flex',
              gap: 8, alignItems: 'center'
            }}>
            
            Available for work →
          </a>
        </div>
      </div>
    </nav>);

}

// ─── HERO ────────────────────────────────────────────────────────────────────
function AHero() {
  const [scroll, setScroll] = React.useState(0);
  React.useEffect(() => {
    const on = () => setScroll(window.scrollY);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const parallax = Math.min(scroll * 0.25, 80);

  return (
    <section style={{ padding: '80px 32px 48px', borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        {/* Meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 64, ...aStyles.mono }}>
          <div style={{ gridColumn: 'span 3' }}>{PORTFOLIO.role} · est. 2013</div>
          <div style={{ gridColumn: 'span 3' }}>{PORTFOLIO.location} · 52.9548°N</div>
          <div style={{ gridColumn: 'span 3' }}>Portfolio / vol. MMXXVI</div>
          <div style={{ gridColumn: 'span 3', textAlign: 'right' }}>
            <span style={{ color: A.accent }}>●</span> Currently designing for TaskUs
          </div>
        </div>

        {/* Oversized statement */}
        <h1
          style={{
            fontFamily: '"Inter Tight", "Inter", sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(64px, 10vw, 168px)',
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            margin: 0,
            color: A.ink
          }}>
          
          Designing for<br />
          the humans<br />
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 24 }}>
            behind the
            <span
              style={{
                display: 'inline-block',
                width: 'clamp(80px, 10vw, 160px)',
                height: 'clamp(56px, 7vw, 110px)',
                background: A.accent,
                transform: `translateY(${parallax * 0.3}px)`,
                transition: 'transform 0.1s linear'
              }}
              aria-hidden />
            
          </span><br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>pixels.</span>
        </h1>

        {/* Caption row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginTop: 80, alignItems: 'start' }}>
          <div style={{ gridColumn: 'span 1', ...aStyles.mono }}>§ 00</div>
          <div style={{ gridColumn: 'span 5' }}>
            <p style={{ fontSize: 18, lineHeight: 1.45, letterSpacing: '-0.01em', margin: 0, color: A.ink2 }}>
              {PORTFOLIO.lead}
            </p>
          </div>
          <div style={{ gridColumn: 'span 3', ...aStyles.mono }}>
            <div style={{ color: A.ink, marginBottom: 6 }}>Fig. 001</div>
            A self-portrait<br />in hairlines, headlines,<br />and one rust square.
          </div>
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="#work" data-cursor="hover" style={{ ...aStyles.mono, padding: '12px 16px', background: A.ink, color: A.paper, textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
              View the index <span>→</span>
            </a>
            <a href="#contact" data-cursor="hover" style={{ ...aStyles.mono, padding: '12px 16px', border: `1px solid ${A.line}`, color: A.ink, textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
              Start a project <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>);

}

// ─── METRICS ─────────────────────────────────────────────────────────────────
function AMetrics() {
  const [ref, inView] = useReveal({ threshold: 0.2 });
  return (
    <section ref={ref} style={{ borderBottom: `1px solid ${A.line}`, padding: '32px 32px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderLeft: `1px solid ${A.line}` }}>
        {PORTFOLIO.metrics.map((m, i) => {
          const v = useCounter(m.value, inView, 1400 + i * 120);
          return (
            <div key={i} style={{ padding: '24px 28px', borderRight: `1px solid ${A.line}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={aStyles.mono}>0{i + 1} / 04</div>
              <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, color: A.ink, marginTop: 8 }}>
                {fmt(v, { decimals: 0 })}<span style={{ color: A.accent }}>{m.suffix}</span>
              </div>
              <div style={{ fontSize: 13, color: A.ink, marginTop: 8 }}>{m.label}</div>
              <div style={{ ...aStyles.mono }}>{m.sub}</div>
            </div>);

        })}
      </div>
    </section>);

}

// ─── WORK ────────────────────────────────────────────────────────────────────
function AWork() {
  return (
    <section id="work" style={{ padding: '96px 32px', borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 64 }}>
          <div style={{ gridColumn: 'span 1', ...aStyles.mono }}>§ 01</div>
          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Selected Work · 2020 — 2025</div>
            <h2 style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              Five products. Four markets.<br />
              <span style={{ color: A.mute }}>Measurable behaviour change.</span>
            </h2>
          </div>
          <div style={{ gridColumn: 'span 4', alignSelf: 'end', textAlign: 'right', ...aStyles.mono }}>
            The index below is chronological. Click any row to<br />open the case study.
          </div>
        </div>

        {/* Index table */}
        <div style={{ borderTop: `1px solid ${A.ink}` }}>
          {PORTFOLIO.projects.map((p) =>
          <AProjectRow key={p.id} p={p} />
          )}
        </div>
      </div>
    </section>);

}

function AProjectRow({ p }) {
  const [ref, inView] = useReveal();
  const [hover, setHover] = React.useState(false);
  return (
    <a
      ref={ref}
      href={p.href}
      data-cursor="hover"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 2fr 3fr 2fr 1.2fr 40px',
        gap: 24,
        alignItems: 'center',
        padding: '28px 8px',
        borderBottom: `1px solid ${A.line}`,
        textDecoration: 'none',
        color: A.ink,
        position: 'relative',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: 'opacity .6s, transform .6s, background .18s',
        background: hover ? A.paper2 : 'transparent'
      }}>
      
      <span style={{ ...aStyles.mono, color: A.ink }}>{p.index}</span>
      <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            width: 8, height: 8, borderRadius: 99,
            background: hover ? A.accent : 'transparent',
            border: `1px solid ${hover ? A.accent : A.line}`,
            transition: 'background .18s, border-color .18s'
          }} />
        
        {p.title}
      </span>
      <span style={{ fontSize: 14, color: A.ink2, letterSpacing: '-0.005em' }}>{p.tagline}</span>
      <span style={aStyles.mono}>{p.kicker}</span>
      <span style={{ ...aStyles.mono, textAlign: 'right' }}>{p.year}</span>
      <span style={{ fontSize: 18, color: hover ? A.accent : A.mute, transition: 'color .18s', textAlign: 'right' }}>
        {hover ? '→' : '·'}
      </span>

      {/* Hover preview — absolute, left-aligned under row, subtle */}
      <div
        style={{
          position: 'absolute', left: '20%', top: '100%', width: 280,
          pointerEvents: 'none', zIndex: 20,
          opacity: hover ? 1 : 0, transform: hover ? 'translateY(4px)' : 'translateY(-4px)',
          transition: 'opacity .22s, transform .22s'
        }}>
        
        {p.image ?
        <img src={p.image} alt="" style={{ width: '100%', display: 'block', boxShadow: `0 20px 60px rgba(20,17,15,0.22)` }}
        onError={(e) => {e.currentTarget.style.display = 'none';}} /> :

        <Placeholder label={`${p.id}.png`} tone="ink" />
        }
      </div>
    </a>);

}

// ─── ORIGIN ──────────────────────────────────────────────────────────────────
function AOrigin() {
  return (
    <section id="origin" style={{ background: A.ink, color: A.paper, padding: '120px 32px', borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
        <div style={{ gridColumn: 'span 1', ...aStyles.mono, color: 'rgba(244,241,236,0.55)' }}>§ 02</div>
        <div style={{ gridColumn: 'span 6' }}>
          <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 20 }}>The origin story</div>
          <h2 style={{ fontSize: 'clamp(44px, 5vw, 88px)', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
            One night.<br />
            Zero brief.<br />
            <span style={{ fontStyle: 'italic', color: A.accent }}>A national symbol.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(244,241,236,0.7)', maxWidth: 480, marginTop: 40 }}>
            May 2020. India launches Aatmnirbhar Bharat. I open Illustrator. By morning, the logo is on government
            campaigns, manufacturer packaging and news tickers across the country. Officially adopted for PM SVANidhi.
            No brief. No client. No credit.
          </p>
          <p style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.4, color: A.paper, marginTop: 32, maxWidth: 520 }}>
            “Good design does not ask permission — it simply works for people.”
          </p>
        </div>
        <div style={{ gridColumn: 'span 5', display: 'grid', gridTemplateColumns: '1fr 1fr', border: `1px solid rgba(244,241,236,0.12)` }}>
          {[
          ['90%', 'Manufacturers using it'],
          ['1 night', 'From blank to national'],
          ['PM SVANidhi', 'Official adoption'],
          ['0', 'Briefs received']].
          map(([n, l], i) =>
          <div key={i} style={{ padding: 28, borderRight: i % 2 === 0 ? `1px solid rgba(244,241,236,0.12)` : 'none', borderBottom: i < 2 ? `1px solid rgba(244,241,236,0.12)` : 'none' }}>
              <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
              <div style={{ ...aStyles.mono, color: 'rgba(244,241,236,0.55)', marginTop: 12 }}>{l}</div>
            </div>
          )}
          <div style={{ gridColumn: 'span 2', padding: 28, background: 'rgba(194,65,12,0.1)', borderTop: `1px solid rgba(244,241,236,0.08)` }}>
            <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: A.accent, letterSpacing: '-0.01em' }}>
              Design captures culture, not just pixels.
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ─── PRINCIPLES ──────────────────────────────────────────────────────────────
function APrinciples() {
  return (
    <section id="principles" style={{ padding: '120px 32px', borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 48 }}>
          <div style={{ gridColumn: 'span 1', ...aStyles.mono }}>§ 03</div>
          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Operating principles</div>
            <h2 style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              Six beliefs that decide<br />every design call.
            </h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${A.line}`, borderLeft: `1px solid ${A.line}` }}>
          {PORTFOLIO.principles.map((p, i) =>
          <div key={i} style={{ padding: 32, borderRight: `1px solid ${A.line}`, borderBottom: `1px solid ${A.line}`, minHeight: 240, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ ...aStyles.mono, color: A.accent }}>Principle / {p.n}</span>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: A.line }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0, marginBottom: 16, color: A.ink }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 13.5, color: A.mute, lineHeight: 1.6, margin: 0 }}>{p.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ─── CAREER ──────────────────────────────────────────────────────────────────
function ACareer() {
  return (
    <section id="career" style={{ padding: '120px 32px', borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 48 }}>
          <div style={{ gridColumn: 'span 1', ...aStyles.mono }}>§ 04</div>
          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>Curriculum vitae</div>
            <h2 style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              Twelve years,<br />four cities, millions of users.
            </h2>
          </div>
          <a href="#" data-cursor="hover" style={{ gridColumn: 'span 4', alignSelf: 'end', justifySelf: 'end', ...aStyles.mono, padding: '10px 14px', border: `1px solid ${A.line}`, color: A.ink, textDecoration: 'none' }}>
            Download PDF résumé →
          </a>
        </div>
        <div>
          {PORTFOLIO.career.map((c, i) => {
            const [ref, inView] = useReveal();
            return (
              <div
                key={i}
                ref={ref}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 120px 1fr 2fr 1fr',
                  gap: 24,
                  padding: '32px 8px',
                  borderTop: i === 0 ? `1px solid ${A.ink}` : `1px solid ${A.line}`,
                  alignItems: 'start',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateY(16px)',
                  transition: 'opacity .6s, transform .6s'
                }}>
                
                <span style={{ ...aStyles.mono, color: A.ink }}>0{i + 1}</span>
                <span style={{ ...aStyles.mono, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: A.ink }}>{c.from}</span>
                  <span>→ {c.to}</span>
                  {c.current &&
                  <span style={{ color: A.accent, marginTop: 6 }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: A.accent, marginRight: 6 }} />
                      NOW
                    </span>
                  }
                </span>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
                  {c.role}<br />
                  <span style={{ fontSize: 13, color: A.accent, fontWeight: 400, letterSpacing: 0 }}>{c.org}</span>
                </span>
                <span style={{ fontSize: 13.5, color: A.mute, lineHeight: 1.65 }}>{c.body}</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' }}>
                  {c.tags.map((t) =>
                  <span key={t} style={{ ...aStyles.mono, fontSize: 9, padding: '4px 7px', border: `1px solid ${A.line}`, color: A.ink2, textTransform: 'uppercase' }}>{t}</span>
                  )}
                </span>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function AAbout() {
  return (
    <section id="studio" style={{ padding: '120px 32px', background: A.paper2, borderBottom: `1px solid ${A.line}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
        <div style={{ gridColumn: 'span 1', ...aStyles.mono }}>§ 05</div>
        <div style={{ gridColumn: 'span 7' }}>
          <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>The person behind the work</div>
          <h2 style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, marginBottom: 32 }}>
            I became a designer because<br />technology is supposed to make<br />life <span style={{ fontStyle: 'italic' }}>easier</span>.
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: A.ink2, maxWidth: 560 }}>
            <p style={{ margin: 0 }}>If a product confuses you, the problem is not you — it is the design. That one belief has driven every project across twelve years in this field.</p>
            <p style={{ marginTop: 16 }}>My work spans AI productivity tools that reduced operational costs by 20%, digital wellness apps with millions of downloads in 22 languages, fintech that strips friction out of money, and a national symbol now used by 90% of Indian manufacturers.</p>
            <p style={{ marginTop: 16 }}>Shipping across India, the UAE and fourteen other countries taught me that “intuitive” is always culturally specific. Building for a billion-user context, a Gulf market and a global enterprise requires empathy deeper than personas.</p>
            <p style={{ marginTop: 16 }}>Off-hours I water plants, tidy rooms and keep simple rituals. They remind me why clarity matters — in life and in the grid.</p>
          </div>
        </div>
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AInfoCard label="Currently" value={['Lead Designer · TaskUs', 'Nottingham, UK']} />
          <AInfoCard label="Experience" value={['12+ years', '14 countries', 'Millions of users']} />
          <div style={{ background: A.paper, border: `1px solid ${A.line}`, padding: 20 }}>
            <div style={{ ...aStyles.mono, color: A.mute, marginBottom: 12 }}>Skills · Tools</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PORTFOLIO.skills.map((s) =>
              <span key={s} style={{ fontSize: 11, padding: '5px 9px', background: A.paper2, color: A.ink, border: `1px solid ${A.line}` }}>{s}</span>
              )}
            </div>
          </div>
          <div style={{ background: A.paper, border: `1px solid ${A.line}`, padding: 20 }}>
            <div style={{ ...aStyles.mono, color: A.mute, marginBottom: 12 }}>Notable</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PORTFOLIO.notable.map((n) =>
              <li key={n} style={{ fontSize: 12.5, display: 'flex', gap: 10, color: A.ink2 }}>
                  <span style={{ color: A.accent }}>—</span>{n}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}

function AInfoCard({ label, value }) {
  return (
    <div style={{ background: A.paper, border: `1px solid ${A.line}`, padding: 20 }}>
      <div style={{ ...aStyles.mono, color: A.mute, marginBottom: 10 }}>{label}</div>
      {value.map((v, i) =>
      <div key={i} style={{ fontSize: 14, color: A.ink, lineHeight: 1.4 }}>{v}</div>
      )}
    </div>);

}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function AContact() {
  const [form, setForm] = React.useState({ name: '', email: '', msg: '' });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.msg.trim().length < 8) errs.msg = 'Tell me a bit more';
    setErrors(errs);
    if (!Object.keys(errs).length) setSent(true);
  };
  return (
    <section id="contact" style={{ background: A.ink, color: A.paper, padding: '120px 32px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 48 }}>
        <div style={{ gridColumn: 'span 1', ...aStyles.mono, color: 'rgba(244,241,236,0.45)' }}>§ 06</div>
        <div style={{ gridColumn: 'span 6', width: "6px" }}>
          <div style={{ ...aStyles.mono, color: A.accent, marginBottom: 16 }}>End · Let us collaborate</div>
          <h2 style={{ fontSize: 'clamp(44px, 5vw, 88px)', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
            Let us build<br />
            something <span style={{ fontStyle: 'italic', color: A.accent }}>meaningful.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(244,241,236,0.65)', maxWidth: 460, marginTop: 32 }}>
            Open to senior product design roles, consulting, and conversations with people who care about the humans behind the pixels.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column' }}>
            {PORTFOLIO.links.map((l, i) =>
            <a
              key={l.label}
              href={l.href}
              data-cursor="hover"
              style={{
                display: 'grid', gridTemplateColumns: '80px 1fr 40px', gap: 24, alignItems: 'center',
                padding: '18px 0', borderTop: i === 0 ? `1px solid rgba(244,241,236,0.15)` : 'none',
                borderBottom: `1px solid rgba(244,241,236,0.15)`,
                textDecoration: 'none', color: A.paper, transition: 'padding-left .2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.paddingLeft = '12px'}
              onMouseLeave={(e) => e.currentTarget.style.paddingLeft = '0'}>
              
                <span style={{ ...aStyles.mono, color: 'rgba(244,241,236,0.45)' }}>/ {String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {l.label} — <span style={{ color: 'rgba(244,241,236,0.6)', fontWeight: 400 }}>{l.value}</span>
                </span>
                <span style={{ color: A.accent, fontSize: 18 }}>→</span>
              </a>
            )}
          </div>
        </div>
        <div style={{ gridColumn: 'span 5', gridColumnStart: 8, width: "300px" }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 60 }}>
            <AField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
            <AField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
            <AField label="Message" multiline value={form.msg} onChange={(v) => setForm({ ...form, msg: v })} error={errors.msg} />
            <button
              type="submit"
              data-cursor="hover"
              disabled={sent}
              style={{
                ...aStyles.mono, padding: '14px 20px', background: sent ? 'rgba(244,241,236,0.1)' : A.accent,
                color: A.paper, border: 'none', cursor: sent ? 'default' : 'pointer',
                textAlign: 'left', display: 'flex', justifyContent: 'space-between', transition: 'background .2s'
              }}>
              
              {sent ? 'Message transmitted ✓' : 'Send transmission'} <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </section>);

}

function AField({ label, type = 'text', value, onChange, error, multiline }) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...aStyles.mono, color: focus ? A.accent : 'rgba(244,241,236,0.45)', marginBottom: 8, transition: 'color .2s' }}>
        <span>{label}</span>
        {error && <span style={{ color: A.accent }}>✱ {error}</span>}
      </div>
      <Tag
        type={type}
        value={value}
        data-cursor="text"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={multiline ? 4 : undefined}
        style={{
          width: '100%', background: 'transparent',
          borderBottom: `1px solid ${focus ? A.accent : 'rgba(244,241,236,0.3)'}`,
          borderTop: 0, borderLeft: 0, borderRight: 0,
          padding: '10px 0', color: A.paper, fontSize: 16,
          fontFamily: 'inherit', outline: 'none', resize: 'vertical', transition: 'border-color .2s'
        }} />
      
    </div>);

}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function AFooter() {
  const monoLight = { ...aStyles.mono, color: 'rgba(244,241,236,0.45)' };
  return (
    <footer style={{ background: A.ink, padding: '72px 32px 64px', color: 'rgba(244,241,236,0.45)', borderTop: `1px solid rgba(244,241,236,0.12)` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, alignItems: 'center' }}>
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={monoLight}>© MMXXVI Dipesh Gurav</span>
          <span style={monoLight}>All rights, all wrongs reserved.</span>
        </div>
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={monoLight}>Typeset in Inter Tight + JetBrains Mono.</span>
          <span style={monoLight}>Grid: 12 col × 24 gutter. Hairlines at 1px.</span>
        </div>
        <div style={{ gridColumn: 'span 4' }} />
      </div>
    </footer>);

}

Object.assign(window, { VariantA, ANav, AHero, AMetrics, AWork, AOrigin, APrinciples, ACareer, AAbout, AContact, AFooter });