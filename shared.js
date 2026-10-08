// Shared utilities for all portfolio variants
// -----------------------------------------------------------------------------

// Scroll-reveal hook (intersection-observer)
function useReveal(options = {}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.unobserve(el);
      }
    }, {
      threshold: options.threshold ?? 0.12,
      root: options.root ?? null
    });
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
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = now => {
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
  const {
    decimals = 0,
    suffix = '',
    prefix = ''
  } = opts;
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
  lead: 'Lead product designer behind an enterprise AI suite that cut call-handling time and costs by 20%, products used by around 35,000 people a day in 14 countries, a wellbeing app with over a million downloads in 22 languages, and a mark manufacturers across India use on Indian-made goods.',
  metrics: [{
    value: 20,
    suffix: '%',
    label: 'Call-handling time and cost cut',
    sub: 'TaskGPT @ TaskUs'
  }, {
    value: 17,
    suffix: '%',
    label: 'Assessment accuracy',
    sub: 'EvaluateUs'
  }, {
    value: 33,
    suffix: '%',
    label: 'Sales in a month',
    sub: 'EarlyFoods'
  }, {
    value: 1,
    suffix: 'M+',
    label: 'Downloads · YourHour',
    sub: 'Play Store verified'
  }],
  projects: [{
    id: 'levelup',
    index: '01',
    year: 2024,
    title: 'LevelUp',
    kicker: 'Gamification · Enterprise SaaS · 3D',
    tagline: 'Work that plays like a game.',
    body: 'An enterprise gamification platform serving two audiences at once: managers configure KPIs, challenges and rewards; agents live inside them as avatars, leaderboards and live wins. It became the company standard and was showcased at AWS Summit London 2025.',
    stats: [['AWS', 'Summit London 2025'], ['35K', 'Suite daily users'], ['2', 'Audiences, one system'], ['3D', 'Three.js characters']],
    tags: ['Gamification', 'Enterprise SaaS', 'Dual-audience', 'Design Systems'],
    image: '/assets/levelup-cover.webp',
    href: '/case-levelup'
  }, {
    id: 'taskgpt',
    index: '02',
    year: 2024,
    title: 'TaskGPT',
    kicker: 'AI productivity · Enterprise · 14 countries',
    tagline: 'AI that works inside the live call.',
    body: 'End-to-end design of an OpenAI + PaLM 2 + LLaMA suite for agents on live customer calls across 14 countries. Call-handling time and operational costs each down 20%.',
    stats: [['20%', 'Less call-handling time'], ['35K', 'Suite daily users'], ['14', 'Countries']],
    tags: ['AI Interface', 'Enterprise', 'Design Systems'],
    image: '/assets/taskgpt-cover.webp',
    href: '/case-taskgpt'
  }, {
    id: 'evaluateus',
    index: '03',
    year: 2023,
    title: 'EvaluateUs',
    kicker: 'Assessment platform · Enterprise · TaskUs',
    tagline: 'Data-heavy evaluation, made humane.',
    body: 'UX strategy and full redesign of an enterprise assessment platform: evaluation workflows, scoring criteria and results data. Accuracy rose 17%.',
    stats: [['17%', 'Accuracy lift'], ['AA', 'WCAG 2.2']],
    tags: ['Enterprise UX', 'Data-dense UI', 'Assessment'],
    image: '/assets/evaluateus-cover.webp',
    href: '/case-evaluateus'
  }, {
    id: 'yourhour',
    index: '04',
    year: 2021,
    title: 'YourHour',
    kicker: 'Digital wellbeing · India · 1M+ downloads',
    tagline: 'Breaking digital addiction at scale.',
    body: 'Behavioural psychology and compassionate UX to help people reclaim their attention without becoming another addictive feed.',
    stats: [['1M+', 'Downloads'], ['70K+', 'Reviews'], ['22', 'Languages'], ['4.6★', 'Play Store']],
    tags: ['Behavioural Design', 'Digital Health', 'HealthTech', 'Android · iOS', 'Cross-cultural'],
    image: '/assets/yourhour-cover.webp',
    href: '/case-yourhour'
  }, {
    id: 'aatmnirbhar',
    index: '05',
    year: 2020,
    title: 'Aatmnirbhar',
    kicker: 'Brand mark · Open MyGov competition',
    tagline: 'A competition entry India picked up.',
    body: 'An open MyGov competition entry, taken up by PM SVANidhi and used by manufacturers marking Indian-made goods.',
    stats: [['Nationwide', 'Used on Indian-made goods'], ['MyGov', 'Open competition'], ['PM SVANidhi', 'Took up the mark']],
    tags: ['Brand', 'Identity', 'Cultural'],
    image: '/assets/aatmnirbhar-cover.webp',
    href: '/case-aatmnirbhar'
  }, {
    id: 'jego',
    index: '06',
    year: '',
    title: 'JEGO',
    kicker: 'Wellbeing streaming · UAE',
    tagline: 'Mentors for the Gulf, designed with cultural nuance.',
    body: 'A video platform connecting Gulf users with world-class mentors. Typography, RTL patterns and ritual-led onboarding built for the UAE market.',
    stats: [['UAE', 'Primary market'], ['RTL', 'First-class']],
    tags: ['Video UX', 'Streaming', 'Localisation'],
    image: '/assets/jego-cover.webp',
    href: '/case-jego'
  }, {
    id: 'earlyfoods',
    index: '07',
    year: '',
    title: 'EarlyFoods',
    kicker: 'E-commerce · Organic baby food',
    tagline: 'Designed for trust, not conversion.',
    body: 'A brand parents can feel safe with, because they are feeding it to their children. Emotional UX over checkout funnels.',
    stats: [['33%', 'Sales in a month'], ['Trust', 'KPI']],
    tags: ['E-commerce', 'Conversion Rate Optimisation', 'Emotional UX'],
    image: '/assets/earlyfoods-cover.webp',
    href: '/case-earlyfoods'
  }, {
    id: 'job-app-assistant',
    index: '08',
    year: 2026,
    title: 'Job App Assistant',
    kicker: 'Generative AI · Solo build · Live product',
    tagline: 'Building the back room, from scratch.',
    body: 'A working AI web application: designed, coded, and deployed in a single session. Node.js, Claude API, real server. Not a prototype.',
    stats: [['1 day', 'Build time'], ['4', 'Files'], ['Live', 'Status']],
    tags: ['Generative AI Tools', 'AI Interfaces', 'Solo build'],
    image: '/assets/jaa-cover.webp',
    href: '/case-job-app-assistant'
  }],
  principles: [{
    n: '01',
    title: 'If it confuses you, it is the design’s fault',
    body: 'Technology is supposed to make life easier. When people struggle, the design failed, and that is always fixable.'
  }, {
    n: '02',
    title: 'Behaviour first, visuals second',
    body: 'Stunning interfaces that change nothing are decoration. Start with: what will the user do differently on Tuesday?'
  }, {
    n: '03',
    title: 'Cross-cultural design is a skill, not a checklist',
    body: 'Intuitive is local. Shipping for India, the Gulf and enterprise teams in 14 countries taught me: empathy is not assumed, it is researched.'
  }, {
    n: '04',
    title: 'Emotion is a design material',
    body: 'The gap between apps people try once and apps they use daily is almost always emotional. Trust, delight, belonging: architectable.'
  }, {
    n: '05',
    title: 'Measure what you made',
    body: 'Every project ties to a metric: 20% less call-handling time, 17% more accurate assessments, 33% more sales in a month. Good design earns its seat at the business table.'
  }, {
    n: '06',
    title: 'Simplicity is deeper understanding, not fewer features',
    body: 'Close the gap between complexity in the world and clarity in the mind. That is the entire job.'
  }],
  career: [{
    from: '2021',
    to: '2026',
    role: 'Lead Product Designer',
    org: 'TaskUs · Global BPO · Remote',
    body: ['I was the founding and only designer on TaskUs\'s Digital IT team. Every product we built was multi-tenant, sold to client companies on subscription, and used by around 35,000 people a day across 14 countries; around 20 of them went live. I designed for two very different audiences: agents using AI during live customer calls, and the administrators configuring the systems behind them. My first job was in a call centre, so for the agent tools, I used to be the user.', 'TaskGPT, an AI suite for agents on live customer calls, working across OpenAI, PaLM 2 and LLaMA. Much of it ran as a Chrome extension inside the tool agents already used, so nobody had to switch windows mid-call. I also designed how we measured it: usage, answer quality, token cost and agent feedback. Call-handling time and operational costs each fell 20%, and moving it behind an encrypted layer solved the privacy problem and made it 20% faster.', 'EvaluateUs, where an AI scored hiring, coaching and training assessments and one dashboard served three people. The candidate wanted to know how they did, the assessor needed to trust the AI\'s score enough to stand behind it, and the manager wanted to know if it was helping the team. I designed each view around that person\'s next decision. Accuracy rose 17%.', 'LevelUp, gamification. Managers set targets, challenges and rewards; agents play as their own 3D characters on live leaderboards, built in Three.js. Everyone who takes part wins something, and the best players go into a hall of fame. It was the first gamification work at TaskUs, became the company standard, and was showcased at AWS Summit London 2025.', 'Design system. I owned it from tokens through to shipped component libraries, keeping mobile and web consistent across 14 countries and built to WCAG 2.2 AA rather than patched afterwards. As the only designer, the system was also the only way to scale myself.', 'AI in the workflow. Claude, Cursor, Figma Make, v0 and Lovable let me build several UX directions in parallel, which surfaced edge cases and let me test a mental model before a stakeholder review instead of after one. Time to concept fell 60%.'],
    tags: ['AI Design', 'Generative AI Tools', 'Experimentation', 'Enterprise UX', 'Design Systems', 'Founding designer'],
    current: false
  }, {
    from: '2017',
    to: '2021',
    role: 'Product Designer',
    org: 'Mindefy Technologies · Indore, India',
    body: ['I joined Mindefy as an intern and became its sole designer. At Mindefy, I designed products across digital wellbeing, finance, e-commerce, streaming and mentorship. This was where I developed my belief that good design is not just about simplifying screens, it is about understanding what people need emotionally, culturally and behaviourally.', 'Designed YourHour, a digital wellbeing app that reached more than 1 million downloads, with 70,000+ reviews, a 4.6-star rating and support for 22 languages. Based on more than 300 research sessions, the experience encouraged healthier digital habits through compassionate, non-punitive interventions.', 'Redesigned JEGO, a video streaming, wellbeing and mentorship platform with an RTL-first approach shaped around Gulf cultural contexts. Usability satisfaction increased by 25%.', 'GreenBill, paperless receipts and invoicing across four apps: one for shoppers, a web point of sale and a mobile app for merchants, and an admin console. Picture a shopkeeper ringing up a sale on their phone while the owner watches sales across every branch. The usability testing toolkit I built caught 85% of issues before development.', 'Kidster, a digital school diary for attendance, homework, parent-teacher meetings and notices. It found traction but not enough money, and the company rightly moved its focus to YourHour. It taught me to ask the money question as early as the user question.', 'YourSlice: A companion app to YourHour, focusing on enhancing productivity by helping users track and manage specific habits. Built with a cohesive design system that aligns with YourHour\'s branding, YourSlice offers users an extended platform for self-improvement and habit formation.', 'Hired and mentored junior and mid-level designers, for client products and for Mindefy\'s own.'],
    tags: ['Fintech', 'Mobile', 'Wellbeing UX']
  }, {
    from: '2014',
    to: '2017',
    role: 'Product Design Consultant & Founder',
    org: 'The Artist Banda · Bengaluru, India',
    body: ['I co-founded a small studio helping new businesses start from nothing: identity, photography, design and the marketing that followed. I ran the team, the client conversations and the projects from onboarding through to delivery. Brand identity is still the work I love most.', 'EarlyFoods, food for expecting mothers and young children. The analytics and the founder both pointed at price; heatmaps and a survey with nearly 400 customer replies pointed at trust. I rebuilt the store around sourcing and certification before price, fixed buttons parents couldn\'t find and age filters that didn\'t match how they shop, and made reordering easy. Sales rose 33% in a month.', 'Designed an end-to-end payment and energy mobility ecosystem across mobile app, web portal and field-operations dashboard for Repos Energy. The work connected real-time transactions with the practical needs of people working on the ground.', 'ZuQA, API testing tool. Postman had no low-code API testing at the time; a friend was building the concept and I joined as design hand. Progressive disclosure cut cognitive load and developer onboarding time by 15%.'],
    tags: ['Brand', 'Product Strategy', 'Wellbeing UX']
  }],
  skills: ['Behavioural UX', 'AI Interfaces', 'Generative AI Tools', 'Design Systems', 'Multi-audience Platforms', 'Data-dense Enterprise UX', 'A/B Testing', 'Experimentation', 'Cross-cultural', 'Figma', 'Motion', 'Conversion Rate Optimisation', 'Hiring & mentoring', 'Accessibility · WCAG 2.2 AA', 'RTL-first', 'Product Strategy'],
  notable: ['Aatmnirbhar Bharat mark, used on Indian-made goods', 'YourHour · 4.6★ · 1M+ downloads', 'LevelUp at AWS Summit London 2025', 'Repos Energy fuel-delivery', '300+ research sessions on YourHour'],
  links: [{
    label: 'Email',
    value: 'contact@dipeshgurav.com',
    href: 'mailto:contact@dipeshgurav.com'
  }, {
    label: 'Phone',
    value: '+44 7352 673152',
    href: 'tel:+447352673152'
  }, {
    label: 'LinkedIn',
    value: 'in/dipeshgurav-design',
    href: 'https://www.linkedin.com/in/dipeshgurav-design/'
  }, {
    label: 'Dribbble',
    value: 'dipeshgurav9',
    href: 'https://dribbble.com/dipeshgurav9'
  }, {
    label: 'Behance',
    value: 'theartistbanda',
    href: 'https://www.behance.net/theartistbanda'
  }]
};

// Placeholder pattern: hatched monospace label. Used wherever we do not have
// a real screenshot; the mix is intentional per the brief.
function Placeholder({
  label,
  ratio = '16/9',
  tone = 'ink',
  style
}) {
  const colors = tone === 'ink' ? {
    bg: '#080604',
    fg: 'rgba(237,234,228,0.55)',
    line: 'rgba(237,234,228,0.08)'
  } : {
    bg: '#1C1916',
    fg: 'rgba(237,234,228,0.35)',
    line: 'rgba(237,234,228,0.06)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: ratio,
      background: colors.bg,
      backgroundImage: `repeating-linear-gradient(135deg, transparent 0 11px, ${colors.line} 11px 12px)`,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"JetBrains Mono", ui-monospace, "Menlo", monospace',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: colors.fg,
      background: colors.bg,
      padding: '3px 8px'
    }
  }, label));
}

// Custom cursor: renders a small ink dot and a larger ring that lags behind.
// Respects a data-cursor="hover|text" attribute on hovered elements.
function CustomCursor({
  accent = '#C2410C'
}) {
  const dot = React.useRef(null);
  const ring = React.useRef(null);
  const modeRef = React.useRef('default');
  const [mode, setMode] = React.useState('default');
  const coarse = React.useMemo(() => matchMedia('(pointer: coarse)').matches, []);
  React.useEffect(() => {
    if (coarse) return;
    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0;
    const onMove = e => {
      dx = e.clientX;
      dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
      const t = e.target.closest?.('[data-cursor]');
      const next = t ? t.getAttribute('data-cursor') : 'default';
      if (next !== modeRef.current) {
        modeRef.current = next;
        setMode(next);
      }
    };
    let raf;
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  const ringSize = mode === 'hover' ? 48 : mode === 'text' ? 4 : 32;
  if (coarse) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: dot,
    "aria-hidden": "true",
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: 6,
      height: 6,
      borderRadius: 99,
      background: accent,
      pointerEvents: 'none',
      zIndex: 9999,
      mixBlendMode: mode === 'text' ? 'normal' : 'difference'
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: ring,
    "aria-hidden": "true",
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: ringSize,
      height: ringSize,
      borderRadius: 99,
      border: `1px solid ${accent}`,
      pointerEvents: 'none',
      zIndex: 9999,
      transition: 'width .18s, height .18s, border-radius .18s',
      marginLeft: (32 - ringSize) / 2,
      marginTop: (32 - ringSize) / 2
    }
  }));
}

// Responsive breakpoint hook
function useBreakpoint() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return {
    isMobile: w < 640,
    isTablet: w >= 640 && w < 1024,
    isDesktop: w >= 1024,
    w
  };
}
Object.assign(window, {
  useReveal,
  useCounter,
  fmt,
  Placeholder,
  CustomCursor,
  PORTFOLIO,
  useBreakpoint
});
