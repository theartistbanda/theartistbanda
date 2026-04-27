// Shared utilities for all portfolio variants
// -----------------------------------------------------------------------------

// Scroll-reveal hook (intersection-observer)
function useReveal(options = {}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold: options.threshold ?? 0.12, root: options.root ?? null }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// Animated counter — ticks from 0 to target once in view
function useCounter(target, inView, duration = 1600) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * target);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return val;
}

// Format counter values — strips trailing .0 and optionally formats with commas
function fmt(n, opts = {}) {
  const { decimals = 0, suffix = '', prefix = '' } = opts;
  const fixed = Number(n).toFixed(decimals);
  const clean = decimals > 0 ? fixed : Math.round(Number(fixed)).toString();
  return prefix + clean + suffix;
}

// -----------------------------------------------------------------------------
// Portfolio content — single source of truth so all three variants render
// the same Dipesh Gurav story without drift.
// -----------------------------------------------------------------------------
const PORTFOLIO = {
  name: 'Dipesh Gurav',
  role: 'Product Designer',
  location: 'Nottingham, UK',
  years: 12,
  tagline: 'Designing for the humans behind the pixels.',
  lead:
    'Senior product designer behind AI tools cutting enterprise costs 20%, a wellbeing app with 10M users in 22 languages, and a logo adopted as a national identity by 90% of Indian manufacturers.',
  metrics: [
    { value: 10, suffix: 'M+', label: 'Users on YourHour', sub: '22 languages' },
    { value: 20, suffix: '%', label: 'Enterprise cost cut', sub: 'TaskGPT @ TaskUs' },
    { value: 40, suffix: '%', label: 'Engagement lift', sub: 'LevelUp gamification' },
    { value: 90, suffix: '%', label: 'Indian manufacturers', sub: 'Aatmnirbhar logo' },
  ],
  projects: [
    {
      id: 'yourhour',
      index: '01',
      year: 2021,
      title: 'YourHour',
      kicker: 'Digital wellbeing · India · 10M users',
      tagline: 'Breaking digital addiction at scale.',
      body:
        'Behavioural psychology and compassionate UX to help millions reclaim attention — without becoming another addictive feed.',
      stats: [
        ['10M+', 'Users'],
        ['70K', 'Reviews'],
        ['22', 'Languages'],
        ['4.7★', 'Play Store'],
      ],
      tags: ['Behavioural Design', 'Android · iOS', 'Cross-cultural'],
      image:
        'https://static.wixstatic.com/media/704115_17adaf507abb4773b8ce8ef702ab12ef~mv2.png/v1/fill/w_1200,h_675,al_c,q_90,enc_avif,quality_auto/704115_17adaf507abb4773b8ce8ef702ab12ef~mv2.png',
      href: 'case-yourhour.html',
    },
    {
      id: 'taskgpt',
      index: '02',
      year: 2024,
      title: 'TaskGPT',
      kicker: 'AI productivity · Enterprise · 35K DAU',
      tagline: 'An AI suite that paid for itself.',
      body:
        'End-to-end design on an OpenAI + PaLM 2 + LLaMA suite for 35,000 daily operators. Call handling time down 20%.',
      stats: [
        ['20%', 'Cost saved'],
        ['35K', 'Daily users'],
        ['14', 'Countries'],
      ],
      tags: ['AI Interface', 'Enterprise', 'Design Systems'],
      image: null,
      href: 'case-taskgpt.html',
    },
    {
      id: 'aatmnirbhar',
      index: '03',
      year: 2020,
      title: 'Aatmnirbhar',
      kicker: 'National identity · Government of India',
      tagline: 'One night. Zero brief. A national symbol.',
      body:
        'Drawn overnight in May 2020. Adopted for PM SVANidhi. Now used by roughly 90% of Indian manufacturers.',
      stats: [
        ['90%', 'Adoption'],
        ['1 night', 'To ship'],
        ['PM SVANidhi', 'Official'],
      ],
      tags: ['Brand', 'Identity', 'Cultural'],
      image: null,
      href: 'case-aatmnirbhar.html',
    },
    {
      id: 'jego',
      index: '04',
      year: 2022,
      title: 'JEGO',
      kicker: 'Wellbeing streaming · UAE',
      tagline: 'Mentors for the Gulf, designed with cultural nuance.',
      body:
        'A video platform connecting Gulf users with world-class mentors. Typography, RTL patterns and ritual-led onboarding built for the UAE market.',
      stats: [
        ['UAE', 'Primary market'],
        ['RTL', 'First-class'],
      ],
      tags: ['Video UX', 'Streaming', 'Localisation'],
      image: null,
      href: 'case-jego.html',
    },
    {
      id: 'earlyfoods',
      index: '05',
      year: 2022,
      title: 'EarlyFoods',
      kicker: 'E-commerce · Organic baby food · UAE',
      tagline: 'Designed for trust, not conversion.',
      body:
        'A brand parents can feel safe with — because they are feeding it to their children. Emotional UX over checkout funnels.',
      stats: [
        ['UAE', 'Market'],
        ['Trust', 'KPI'],
      ],
      tags: ['E-commerce', 'Emotional UX'],
      image: null,
      href: 'case-earlyfoods.html',
    },
  ],
  principles: [
    {
      n: '01',
      title: 'If it confuses you, it is the design’s fault',
      body:
        'Technology is supposed to make life easier. When people struggle, the design failed — and that is always fixable.',
    },
    {
      n: '02',
      title: 'Behaviour first, visuals second',
      body:
        'Stunning interfaces that change nothing are decoration. Start with: what will the user do differently on Tuesday?',
    },
    {
      n: '03',
      title: 'Cross-cultural design is a skill, not a checklist',
      body:
        'Intuitive is local. Shipping across India, the UAE and 14 other countries taught me: empathy is not assumed, it is researched.',
    },
    {
      n: '04',
      title: 'Emotion is a design material',
      body:
        'The gap between apps people try once and apps they use daily is almost always emotional. Trust, delight, belonging — architectable.',
    },
    {
      n: '05',
      title: 'Measure what you made',
      body:
        'Every project ties to a metric. 20% cost cut. 40% engagement. Good design earns its seat at the business table.',
    },
    {
      n: '06',
      title: 'Simplicity is deeper understanding, not fewer features',
      body:
        'Close the gap between complexity in the world and clarity in the mind. That is the entire job.',
    },
  ],
  career: [
    {
      from: '2022',
      to: 'Now',
      role: 'Lead UI/UX Designer',
      org: 'TaskUs · Nottingham, UK',
      body:
        'Lead designer on enterprise products for 35K+ daily users in 14 countries. Shipped TaskGPT, EvaluateUs, and the LevelUp gamification ecosystem. Authored the PCAF framework now used across TaskUs products.',
      tags: ['AI Design', 'Enterprise UX', 'Design Systems', 'Leadership'],
      current: true,
    },
    {
      from: '2018',
      to: '2022',
      role: 'Product Design Consultant',
      org: 'The Artist Banda · Indore → UK',
      body:
        'Ran a consultancy. Designed YourHour, JEGO, EarlyFoods; drew the Aatmnirbhar Bharat national logo overnight in May 2020.',
      tags: ['Brand', 'Product Strategy', 'Wellbeing UX'],
    },
    {
      from: '2015',
      to: '2018',
      role: 'Senior Product Designer',
      org: 'Mind-e-fy Technologies',
      body:
        'Led product design for wellbeing and fintech — Repos Energy fuel-delivery UX, a paperless receipt system, multiple fintech products.',
      tags: ['Fintech', 'Mobile', 'Sustainability'],
    },
    {
      from: '2012',
      to: '2014',
      role: 'Masters · UI/UX, Graphics & Animation',
      org: 'MAAC Indore',
      body: 'Formal training in interaction design, motion graphics and visual communication.',
      tags: ['UI/UX', 'Motion'],
    },
  ],
  skills: [
    'Behavioural UX',
    'AI Interfaces',
    'Design Systems',
    'Cross-cultural',
    'Figma',
    'AR/VR',
    'Three.js',
    'Team Leadership',
    'Product Strategy',
  ],
  notable: [
    'Aatmnirbhar Bharat national logo',
    'YourHour · 4.7★ · 10M users',
    'AWS Summit London 2025',
    'Repos Energy fuel-delivery',
    '300+ user interviews',
  ],
  links: [
    { label: 'Email', value: 'contact@dipeshgurav.com', href: 'mailto:contact@dipeshgurav.com' },
    { label: 'LinkedIn', value: 'in/dipeshgurav-design', href: 'https://www.linkedin.com/in/dipeshgurav-design/' },
    { label: 'Dribbble', value: 'dipeshgurav9', href: 'https://dribbble.com/dipeshgurav9' },
    { label: 'Behance', value: 'theartistbanda', href: 'https://www.behance.net/theartistbanda' },
  ],
};

// Placeholder pattern — hatched monospace label. Used wherever we do not have
// a real screenshot; the mix is intentional per the brief.
function Placeholder({ label, ratio = '16/9', tone = 'ink', style }) {
  const colors =
    tone === 'ink'
      ? { bg: '#14110F', fg: 'rgba(244,241,236,0.55)', line: 'rgba(244,241,236,0.08)' }
      : { bg: '#ECE7DE', fg: 'rgba(20,17,15,0.55)', line: 'rgba(20,17,15,0.07)' };
  return (
    <div
      style={{
        aspectRatio: ratio,
        background: colors.bg,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 11px, ${colors.line} 11px 12px)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: 'ui-monospace, "JetBrains Mono", "Menlo", monospace',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.fg,
          background: colors.bg,
          padding: '3px 8px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Custom cursor — renders a small ink dot and a larger ring that lags behind.
// Respects a data-cursor="hover|text" attribute on hovered elements.
function CustomCursor({ accent = '#C2410C' }) {
  const dot = React.useRef(null);
  const ring = React.useRef(null);
  const [mode, setMode] = React.useState('default');
  React.useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    let rx = 0, ry = 0, dx = 0, dy = 0;
    const onMove = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
      const t = e.target.closest?.('[data-cursor]');
      setMode(t ? t.getAttribute('data-cursor') : 'default');
    };
    let raf;
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
  const ringSize = mode === 'hover' ? 48 : mode === 'text' ? 4 : 32;
  return (
    <React.Fragment>
      <div
        ref={dot}
        style={{
          position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: 99,
          background: accent, pointerEvents: 'none', zIndex: 9999,
          mixBlendMode: mode === 'text' ? 'normal' : 'difference',
        }}
      />
      <div
        ref={ring}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: ringSize, height: ringSize, borderRadius: 99,
          border: `1px solid ${accent}`,
          pointerEvents: 'none', zIndex: 9999,
          transition: 'width .18s, height .18s, border-radius .18s',
          marginLeft: (32 - ringSize) / 2, marginTop: (32 - ringSize) / 2,
        }}
      />
    </React.Fragment>
  );
}

// Responsive breakpoint hook
function useBreakpoint() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
}

Object.assign(window, { useReveal, useCounter, fmt, Placeholder, CustomCursor, PORTFOLIO, useBreakpoint });
