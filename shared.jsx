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

// Animated counter: ticks from 0 to target once in view
function useCounter(target, inView, duration = 1600) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
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

// Format counter values: strips trailing .0 and optionally formats with commas
function fmt(n, opts = {}) {
  const { decimals = 0, suffix = '', prefix = '' } = opts;
  const fixed = Number(n).toFixed(decimals);
  const clean = decimals > 0 ? fixed : Math.round(Number(fixed)).toString();
  return prefix + clean + suffix;
}

// -----------------------------------------------------------------------------
// Portfolio content: single source of truth so all three variants render
// the same Dipesh Gurav story without drift.
// -----------------------------------------------------------------------------
const PORTFOLIO = {
  name: 'Dipesh Gurav',
  role: 'Lead Product Designer',
  location: 'Nottingham, UK',
  years: 11,
  tagline: 'Designing for the humans behind the pixels.',
  lead:
    'Lead product designer behind enterprise AI cutting costs 20% for around 35,000 daily users, a wellbeing app with 1M+ downloads in 22 languages, and a logo adopted as a national identity by a large number of manufacturers across India.',
  metrics: [
    { value: 40, suffix: '%', label: 'Engagement lift', sub: 'LevelUp gamification' },
    { value: 20, suffix: '%', label: 'Enterprise cost cut', sub: 'TaskGPT @ TaskUs' },
    { value: 1, suffix: 'M+', label: 'Downloads · YourHour', sub: 'Play Store verified' },
    { text: 'Nationwide', label: 'Manufacturer adoption', sub: 'Aatmnirbhar logo · India' },
  ],
  projects: [
    {
      id: 'levelup',
      index: '01',
      year: 2024,
      title: 'LevelUp',
      kicker: 'Gamification · Enterprise SaaS · 3D',
      tagline: 'Work that plays like a game.',
      body:
        'An enterprise gamification platform serving two audiences at once: managers configure KPIs, challenges and rewards; agents live inside them as avatars, leaderboards and live wins. Daily engagement rose 40%; now the company standard.',
      stats: [
        ['40%', 'Engagement lift'],
        ['35K', 'Daily users'],
        ['2', 'Audiences, one system'],
        ['3D', 'Three.js characters'],
      ],
      tags: ['Gamification', 'Enterprise SaaS', 'Dual-audience', 'Design Systems'],
      image: '/assets/levelup-cover.webp',
      href: 'case-levelup.html',
    },
    {
      id: 'taskgpt',
      index: '02',
      year: 2024,
      title: 'TaskGPT',
      kicker: 'AI productivity · Enterprise · 35K DAU',
      tagline: 'An AI suite that paid for itself.',
      body:
        'End-to-end design on an OpenAI + PaLM 2 + LLaMA suite for around 35,000 daily operators. Call handling time down 20%.',
      stats: [
        ['20%', 'Cost saved'],
        ['35K', 'Daily users'],
        ['14', 'Countries'],
      ],
      tags: ['AI Interface', 'Enterprise', 'Design Systems'],
      image: '/assets/taskgpt-cover.webp',
      href: 'case-taskgpt.html',
    },
    {
      id: 'evaluateus',
      index: '03',
      year: 2023,
      title: 'EvaluateUs',
      kicker: 'Assessment platform · Enterprise · TaskUs',
      tagline: 'Data-heavy evaluation, made humane.',
      body:
        'UX strategy and full redesign of an enterprise assessment platform: evaluation workflows, scoring criteria and results data. Accuracy and speed improved 17%.',
      stats: [
        ['17%', 'Accuracy lift'],
        ['AA', 'WCAG 2.1'],
      ],
      tags: ['Enterprise UX', 'Data-dense UI', 'Assessment'],
      image: '/assets/evaluateus-cover.webp',
      href: 'case-evaluateus.html',
    },
    {
      id: 'yourhour',
      index: '04',
      year: 2021,
      title: 'YourHour',
      kicker: 'Digital wellbeing · India · 1M+ downloads',
      tagline: 'Breaking digital addiction at scale.',
      body:
        'Behavioural psychology and compassionate UX to help millions reclaim attention without becoming another addictive feed.',
      stats: [
        ['1M+', 'Downloads'],
        ['70K+', 'Reviews'],
        ['22', 'Languages'],
        ['4.6★', 'Play Store'],
      ],
      tags: ['Behavioural Design', 'Digital Health', 'HealthTech', 'Android · iOS', 'Cross-cultural'],
      image: '/assets/yourhour-cover.webp',
      href: 'case-yourhour.html',
    },
    {
      id: 'aatmnirbhar',
      index: '05',
      year: 2020,
      title: 'Aatmnirbhar',
      kicker: 'National identity · Government of India',
      tagline: 'One night. Zero brief. A national symbol.',
      body:
        'Drawn overnight. Adopted for PM SVANidhi. Now used by a large number of manufacturers across India.',
      stats: [
        ['Nationwide', 'Adoption'],
        ['1 night', 'To ship'],
        ['PM SVANidhi', 'Official'],
      ],
      tags: ['Brand', 'Identity', 'Cultural'],
      image: '/assets/aatmnirbhar-cover.webp',
      href: 'case-aatmnirbhar.html',
    },
    {
      id: 'jego',
      index: '06',
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
      image: '/assets/jego-cover.webp',
      href: 'case-jego.html',
    },
    {
      id: 'earlyfoods',
      index: '07',
      year: 2022,
      title: 'EarlyFoods',
      kicker: 'E-commerce · Organic baby food · UAE',
      tagline: 'Designed for trust, not conversion.',
      body:
        'A brand parents can feel safe with, because they are feeding it to their children. Emotional UX over checkout funnels.',
      stats: [
        ['UAE', 'Market'],
        ['Trust', 'KPI'],
      ],
      tags: ['E-commerce', 'Conversion Rate Optimisation', 'Emotional UX'],
      image: '/assets/earlyfoods-cover.webp',
      href: 'case-earlyfoods.html',
    },
    {
      id: 'job-app-assistant',
      index: '08',
      year: 2025,
      title: 'Job App Assistant',
      kicker: 'Generative AI · Solo build · Live product',
      tagline: 'Building the back room, from scratch.',
      body:
        'A working AI web application: designed, coded, and deployed in a single session. Node.js, Claude API, real server. Not a prototype.',
      stats: [
        ['1 day', 'Build time'],
        ['4', 'Files'],
        ['Live', 'Status'],
      ],
      tags: ['Generative AI Tools', 'AI Interfaces', 'Solo build'],
      image: '/assets/jaa-cover.webp',
      href: 'case-job-app-assistant.html',
    },
  ],
  principles: [
    {
      n: '01',
      title: 'If it confuses you, it is the design’s fault',
      body:
        'Technology is supposed to make life easier. When people struggle, the design failed, and that is always fixable.',
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
        'The gap between apps people try once and apps they use daily is almost always emotional. Trust, delight, belonging: architectable.',
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
      from: '2021',
      to: '2026',
      role: 'Lead Product Designer',
      org: 'TaskUs · Global BPO · Remote, UK',
      body: [
        'My work spanned AI productivity, assessment platforms, gamification and design systems. I designed for two very different audiences: frontline operators using AI during live customer conversations, and administrators configuring the systems, quality standards and experiences behind them.',
        'TaskGPT, AI suite for customer service teams. Content generation and regeneration, writing assistance, fake detection, and a set of extensions on top. Designed for two audiences at the same time, the operator using AI inside a live customer call and the administrator setting quality standards behind them, working across OpenAI, PaLM 2 and LLaMA. Moving it behind an encrypted wall and into the flow of the call solved the privacy problem and improved performance and speed by 20% in one go.',
        'EvaluateUs, transforming complex hiring and training scoring, review and reporting workflows. Designed the whole thing: scoring criteria, review queues, results tables, and the reporting that came off them, built around how a reviewer actually moves through a case rather than how the rubric happens to be written down. Accuracy and speed improved by 17%.',
        'LevelUp, gamification. A two-sided system. Managers set the KPIs and the rewards attached to them; agents meet the same system as 3D avatars and live leaderboards, built in Three.js. It was the first gamification work at TaskUs and became the standard other teams built on. Improved engagement by 40%.',
        'Design system. I owned it from token architecture through to the shipped component libraries, keeping mobile and web consistent across 14 countries with accessibility built in rather than bolted on afterwards. As the only designer, the system was also the only way to scale myself.',
        'AI in the workflow. Claude, Cursor, Figma Make and v0 to build several UX directions in parallel, which surfaced edge cases and let me test a mental model before a stakeholder review instead of after one. Time-to-concept down 60%.',
      ],
      tags: ['AI Design', 'Generative AI Tools', 'Experimentation', 'Enterprise UX', 'Design Systems', 'Leadership'],
      current: false,
    },
    {
      from: '2017',
      to: '2021',
      role: 'Product Designer',
      org: 'Mindefy Technologies · Indore, India',
      body: [
        'At Mindefy, I designed products across digital wellbeing, finance, e-commerce, streaming and mentorship. This was where I developed my belief that good design is not just about simplifying screens, it is about understanding what people need emotionally, culturally and behaviourally.',
        'Designed YourHour, a digital wellbeing app that reached more than 1 million downloads, with 70,000+ reviews, a 4.6-star rating and support for 22 languages. Based on more than 300 research sessions, the experience encouraged healthier digital habits through compassionate, non-punitive interventions.',
        'EarlyFoods, e-commerce. A premium organic food brand for babies and young children. More than 400 interviews with parents showed the barrier was trust rather than price, so I rebuilt the buying experience around sourcing and provenance instead of discounting.',
        'Redesigned JEGO, a video streaming, wellbeing and mentorship platform with an RTL-first approach shaped around Gulf cultural contexts. Usability satisfaction increased by 25%.',
        'GreenBill, digital invoicing. A paperless receipt and invoicing system for supermarkets: OCR turns a paper receipt into a digital one, cutting operating cost and paper waste at the point of sale.',
        'Kidster, School Diary: Developed the UI/UX for Kidster, a digital school diary that streamlines communication between parents, teachers, and students. I focused on creating an engaging and accessible interface to support easy access to schedules, reminders, and communication tools, making Kidster a valuable resource for schools and families.',
        'YourSlice: A companion app to YourHour, focusing on enhancing productivity by helping users track and manage specific habits. Built with a cohesive design system that aligns with YourHour\'s branding, YourSlice offers users an extended platform for self-improvement and habit formation.',
        'Mentored junior designers and established a structured design pipeline, enhancing project delivery speed and design quality.',
      ],
      tags: ['Fintech', 'Mobile', 'Wellbeing UX'],
    },
    {
      from: '2015',
      to: '2017',
      role: 'Product Design Consultant & Founder',
      org: 'The Artist Banda · Bengaluru, India',
      body: [
        'I co-founded a small studio helping new businesses start from nothing: identity, photography, design and the marketing that followed. I ran the team, the client conversations and the projects from onboarding through to delivery. Brand Identity design I still love the most.',
        'I entered an open MyGov competition to design a mark for the Aatmnirbhar Bharat campaign: the Indian tricolour and Ashok Chakra fused with a golden bird, a reference to the country once being called sone ki chidiya. The competition was never formally decided. The mark was taken up by the PM SVANidhi scheme and used by manufacturers marking Indian-made goods, without credit.',
        'Designed an end-to-end payment and energy mobility ecosystem across mobile app, web portal and field-operations dashboard for Repos Energy. The work connected real-time transactions with the practical needs of people working on the ground.',
        'ZuQA, API testing tool. Postman had no low-code API testing at the time; a friend was building the concept and I joined as design hand. Progressive disclosure cut cognitive load and developer onboarding time by 15%.',
        'Job App Assistant: A live AI web app designed, coded and deployed solo in one session (Node.js + Claude API): job-app-assistant.onrender.com',
      ],
      tags: ['Brand', 'Product Strategy', 'Wellbeing UX'],
    },
  ],
  skills: [
    'Behavioural UX',
    'AI Interfaces',
    'Generative AI Tools',
    'Design Systems',
    'Multi-audience Platforms',
    'Data-dense Enterprise UX',
    'A/B Testing',
    'Experimentation',
    'Cross-cultural',
    'Figma',
    'Motion',
    'Conversion Rate Optimisation',
    'Team Leadership',
    'Product Strategy',
  ],
  notable: [
    'Aatmnirbhar Bharat national logo',
    'YourHour · 4.6★ · 1M+ downloads',
    'AWS Summit London 2025',
    'Repos Energy fuel-delivery',
    '300+ user interviews',
  ],
  links: [
    { label: 'Email', value: 'contact@dipeshgurav.com', href: 'mailto:contact@dipeshgurav.com' },
    { label: 'Phone', value: '+44 7352 673152', href: 'tel:+447352673152' },
    { label: 'LinkedIn', value: 'in/dipeshgurav-design', href: 'https://www.linkedin.com/in/dipeshgurav-design/' },
    { label: 'Dribbble', value: 'dipeshgurav9', href: 'https://dribbble.com/dipeshgurav9' },
    { label: 'Behance', value: 'theartistbanda', href: 'https://www.behance.net/theartistbanda' },
  ],
};

// Placeholder pattern: hatched monospace label. Used wherever we do not have
// a real screenshot; the mix is intentional per the brief.
function Placeholder({ label, ratio = '16/9', tone = 'ink', style }) {
  const colors =
    tone === 'ink'
      ? { bg: '#080604', fg: 'rgba(237,234,228,0.55)', line: 'rgba(237,234,228,0.08)' }
      : { bg: '#1C1916', fg: 'rgba(237,234,228,0.35)', line: 'rgba(237,234,228,0.06)' };
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
          fontFamily: '"JetBrains Mono", ui-monospace, "Menlo", monospace',
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

// Custom cursor: renders a small ink dot and a larger ring that lags behind.
// Respects a data-cursor="hover|text" attribute on hovered elements.
function CustomCursor({ accent = '#C2410C' }) {
  const dot = React.useRef(null);
  const ring = React.useRef(null);
  const modeRef = React.useRef('default');
  const [mode, setMode] = React.useState('default');
  const coarse = React.useMemo(() => matchMedia('(pointer: coarse)').matches, []);
  React.useEffect(() => {
    if (coarse) return;
    let rx = 0, ry = 0, dx = 0, dy = 0;
    const onMove = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
      const t = e.target.closest?.('[data-cursor]');
      const next = t ? t.getAttribute('data-cursor') : 'default';
      if (next !== modeRef.current) { modeRef.current = next; setMode(next); }
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
  if (coarse) return null;
  return (
    <React.Fragment>
      <div
        ref={dot}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: 99,
          background: accent, pointerEvents: 'none', zIndex: 9999,
          mixBlendMode: mode === 'text' ? 'normal' : 'difference',
        }}
      />
      <div
        ref={ring}
        aria-hidden="true"
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
