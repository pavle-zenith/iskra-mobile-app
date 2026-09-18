/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// HomeScreenV3.jsx — Iskra home, new color system.
// Ember-orange brand (#E8621A) for Iskra actions; four pastel category families.

const ISK3 = {
  bg: '#FDFCFA', card: '#FFFFFF', border: '#ECE9E3',
  brand: '#E8621A', brandDeep: '#C9530F', brandSoft: '#FBEAE0',
  text: '#1A1A1A', sub: '#999999', faint: '#F1EDE6',
  shadow: '0 4px 14px rgba(26,22,15,0.04), 0 1px 2px rgba(26,22,15,0.022)',
  shadowSm: '0 2px 8px rgba(26,22,15,0.035)',
};
// category families: cards stay white — color lives on the icon + its container
const CAT = {
  novac:    { fg: '#3A7A3A', chip: '#E1F1E1' }, // green (money — matches Money Saved page)
  cigare:   { fg: '#C24A43', chip: '#FBE9E7' }, // red   (cigarettes)
  zdravlje: { fg: '#3A7A3A', chip: '#E1F1E1' }, // green (health)
};

function Icon3({ size = 24, stroke = '#1A1A1A', sw = 1.9, fill = 'none', children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}

const FlameIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
  </Icon3>
);
const CoinIcon3 = (p) => (
  <Icon3 {...p}>
    <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
  </Icon3>
);
const CigOffIcon3 = (p) => (
  <Icon3 {...p}>
    <rect x="2.5" y="13" width="13.5" height="4" rx="1.4" />
    <line x1="11.5" y1="13" x2="11.5" y2="17" />
    <path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" />
    <line x1="3" y1="4" x2="21" y2="20.5" />
  </Icon3>
);
const LeafIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </Icon3>
);
const SparkIcon3 = (p) => (
  <Icon3 {...p} sw={p.sw || 1.8}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
  </Icon3>
);
const HouseIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" />
    <path d="M9 21.5V13h6v8.5" />
  </Icon3>
);
const FlagIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M4 22V4" /><path d="M4 4h11l-1.5 3.5L15 11H4" />
  </Icon3>
);
const UsersIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon3>
);
const UserIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </Icon3>
);
const BookIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z" />
  </Icon3>
);
const ActivityIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Icon3>
);
const LungsIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M12 4v8" />
    <path d="M9.5 9.5c-2 0-4 2-4 6 0 2 .5 4 2.2 4 1.3 0 1.8-1.1 1.8-2.6V11c0-.85-.7-1.5-1.5-1.5Z" />
    <path d="M14.5 9.5c2 0 4 2 4 6 0 2-.5 4-2.2 4-1.3 0-1.8-1.1-1.8-2.6V11c0-.85.7-1.5 1.5-1.5Z" />
  </Icon3>
);
const MoleculeIcon3 = (p) => (
  <Icon3 {...p}>
    <circle cx="6" cy="7" r="2" /><circle cx="17.5" cy="8.5" r="2" /><circle cx="11" cy="17.5" r="2" />
    <path d="M7.9 6.4 15.6 8" /><path d="M7.2 8.7 9.8 15.6" /><path d="M16.2 10.2 12.5 15.8" />
  </Icon3>
);

// ── Goals ───────────────────────────────────────────────────
function GoalBar({ pct, color }) {
  return (
    <div style={{ width: '100%', height: 4, borderRadius: 999, background: ISK3.faint, overflow: 'hidden' }}>
      <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: color }} />
    </div>
  );
}

function GoalsSection({ onOpen = () => {}, onOpenRoadmap = () => {}, onSlip = () => {}, onKnowledge = () => {} }) {
  const teal = '#2E8B80';
  const GOALS = [
    { key: 'zdravlje', name: 'Zdravlje', color: '#D4547E', pct: 70, Icon: ActivityIcon3 },
    { key: 'pluca', name: 'Pluća', color: '#4A8AC4', pct: 45, Icon: LungsIcon3 },
    { key: 'ekologija', name: 'Ekologija', color: '#3A7A3A', pct: 60, Icon: LeafIcon3 },
    { key: 'finansije', name: 'Finansije', color: '#2E8B80', pct: 80, Icon: CoinIcon3 },
    { key: 'telo', name: 'Telo', color: '#C4724A', pct: 50, Icon: UserIcon3 },
    { key: 'nikotin', name: 'Nikotin', color: '#6B52A8', pct: 35, Icon: MoleculeIcon3 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 22 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: ISK3.text, letterSpacing: '-0.01em' }}>Moj napredak</div>

      {/* daily knowledge card */}
      <button onClick={onKnowledge} style={{
        position: 'relative', overflow: 'hidden', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        border: 'none', borderRadius: 20, padding: 20,
        background: 'linear-gradient(150deg, #1F6B68 0%, #1A5C5A 100%)',
        boxShadow: '0 8px 22px rgba(26,92,90,0.26)', WebkitTapHighlightColor: 'transparent',
      }}>
        {/* decorative book */}
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: -18, right: -22, opacity: 0.08, pointerEvents: 'none' }}>
          <path d="M12 6.5C10.5 5 8 4.5 4.5 4.5V18C8 18 10.5 18.5 12 20M12 6.5C13.5 5 16 4.5 19.5 4.5V18C16 18 13.5 18.5 12 20M12 6.5V20" />
        </svg>

        {/* top row */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 20 }}>DNEVNO ZNANJE</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>3 min</span>
        </div>

        {/* title */}
        <div style={{ position: 'relative', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.4, marginTop: 12, letterSpacing: '-0.01em' }}>Zašto kafa i cigareta idu zajedno — i kako to razdvojiti.</div>

        {/* excerpt */}
        <div style={{ position: 'relative', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 8 }}>Uslovni refleks koji traje godinama može da se promeni. Evo kako...</div>

        {/* bottom row */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h13v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" /><path d="M17 10h2.2a2.3 2.3 0 0 1 0 4.6H17" /><path d="M7 3.5c0 1-.8 1.3-.8 2.3M11 3.5c0 1-.8 1.3-.8 2.3" /></svg>
            Okidači
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#fff' }}>
            Čitaj danas
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </div>
      </button>

      {/* next goal */}
      <button onClick={onOpenRoadmap} style={{
        background: '#F8FBFA', border: `1px solid #E8EFEC`, borderRadius: 18, width: '100%',
        padding: '15px 16px 17px', boxShadow: ISK3.shadow, cursor: 'pointer', fontFamily: 'inherit',
        textAlign: 'left', display: 'block', WebkitTapHighlightColor: 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, background: '#E6F2EF', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LungsIcon3 size={23} stroke={teal} sw={1.9} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: teal, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>Sledeći cilj</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: ISK3.text, letterSpacing: '-0.01em' }}>Pluća počinju da se čiste</div>
          </div>
        </div>
        <GoalBar pct={45} color={teal} />
      </button>
      {/* 3x2 category grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {GOALS.map((g) => (
          <button key={g.key} onClick={() => onOpen(g.key)} style={{
            background: ISK3.card, border: `1px solid ${ISK3.border}`, borderRadius: 14,
            padding: '15px 11px 13px', boxShadow: ISK3.shadowSm, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center', WebkitTapHighlightColor: 'transparent',
          }}>
            <g.Icon size={25} stroke={g.color} sw={1.9} />
            <span style={{ fontSize: 12, fontWeight: 700, color: g.color, marginTop: 9, marginBottom: 12 }}>{g.name}</span>
            <GoalBar pct={g.pct} color={g.color} />
          </button>
        ))}
      </div>

      {/* total time tracker — never resets */}
      <div style={{
        background: ISK3.card, border: `1px solid ${ISK3.border}`, borderRadius: 16,
        padding: 18, boxShadow: ISK3.shadowSm, marginTop: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2h12M6 22h12" /><path d="M6 2c0 4 3 5.5 6 8 3-2.5 6-4 6-8" /><path d="M6 22c0-4 3-5.5 6-8 3 2.5 6 4 6 8" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, color: ISK3.sub }}>Na putu si već</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: ISK3.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>47 dana 6 sati</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: ISK3.sub, marginTop: 3 }}>od kada si počeo/la</div>
        </div>
      </div>

      {/* slip log button — muted, in-scroll */}
      <button onClick={onSlip} style={{
        width: '100%', height: 52, borderRadius: 16, background: ISK3.card,
        border: `1.5px solid ${ISK3.border}`, cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 15, fontWeight: 400, color: ISK3.sub, marginTop: 3,
        WebkitTapHighlightColor: 'transparent',
      }}>Zapalio/la sam</button>
      <div style={{ fontSize: 12, fontWeight: 400, color: '#CCC', textAlign: 'center', marginTop: 1 }}>Beležimo sve — bez osude.</div>
    </div>
  );
}

// ── Weekly tracker ──────────────────────────────────────────
function WeekTracker3({ onCheckIn = () => {}, done = false }) {
  const days = [
    { l: 'Pon', s: 'done' }, { l: 'Uto', s: 'done' }, { l: 'Sre', s: 'done' },
    { l: 'Čet', s: 'done' }, { l: 'Pet', s: 'done' }, { l: 'Sub', s: done ? 'celebrate' : 'today' },
    { l: 'Ned', s: 'future' },
  ];
  return (
    <button onClick={onCheckIn} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'block',
      background: ISK3.card, border: `1px solid ${ISK3.border}`, borderRadius: 18,
      padding: '17px 16px 18px', boxShadow: ISK3.shadow, overflow: 'hidden', WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 15.5, fontWeight: 700, color: ISK3.text, letterSpacing: '-0.01em' }}>Ova nedelja</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: ISK3.sub, whiteSpace: 'nowrap' }}>{done ? '6' : '5'} / 7</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((d) => (
          <div key={d.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: (d.s === 'today' || d.s === 'celebrate') ? ISK3.brandDeep : ISK3.sub }}>{d.l}</span>
            {d.s === 'done' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `linear-gradient(180deg, #F0701F, ${ISK3.brand})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(232,98,26,0.26)',
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7.5 6 11l5.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            {d.s === 'celebrate' && (
              <div style={{ position: 'relative', width: 30, height: 30 }}>
                {/* pulse ring */}
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${ISK3.brand}`,
                  animation: 'wk3Pulse 1.6s ease-out infinite',
                }} />
                {/* confetti */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const leftSide = i % 2 === 0;
                  const spread = (Math.floor(i / 2) / 9); // 0..1
                  const ang = (leftSide ? 200 : 340) - (leftSide ? -1 : 1) * spread * 55; // upper arc
                  const dist = 30 + (i % 5) * 6;
                  const tx = Math.cos(ang * Math.PI / 180) * dist;
                  const ty = Math.sin(ang * Math.PI / 180) * dist - 6;
                  const cols = ['#E8621A', '#FEF0E8', '#3A7A3A', '#FFFFFF'];
                  const col = cols[i % 4];
                  const rect = i % 3 === 0;
                  return (
                    <span key={i} style={{
                      position: 'absolute', left: '50%', top: '50%', width: rect ? 5 : 4, height: rect ? 7 : 4,
                      borderRadius: rect ? 1 : '50%', background: col,
                      boxShadow: col === '#FFFFFF' ? '0 0 0 0.5px rgba(0,0,0,0.05)' : 'none',
                      ['--tx']: tx + 'px', ['--ty']: ty + 'px', ['--rot']: (i * 47 % 360) + 'deg',
                      animation: 'wk3Confetti 0.6s cubic-bezier(0.15,0.7,0.4,1) both',
                    }} />
                  );
                })}
                {/* filled circle + check */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', position: 'relative', zIndex: 1,
                  background: `linear-gradient(180deg, #F0701F, ${ISK3.brand})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(232,98,26,0.3)', animation: 'wk3Pop 0.4s cubic-bezier(0.2,0.9,0.3,1.3) both',
                }}>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5 6 11l5.5-7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
            {d.s === 'today' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: '#fff', border: `2px solid ${ISK3.brand}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'subPulse 1.8s ease-in-out infinite',
              }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: ISK3.brand, lineHeight: 1 }}>?</span>
              </div>
            )}
            {d.s === 'future' && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: ISK3.faint, border: `1px solid ${ISK3.border}` }} />
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes subPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(232,98,26,0.25); }
          50% { opacity: 0.35; box-shadow: 0 0 10px rgba(232,98,26,0); }
        }
        @keyframes wk3Pulse {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.9); }
        }
        @keyframes wk3Pop {
          0% { transform: scale(0); } 100% { transform: scale(1); }
        }
        @keyframes wk3Confetti {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          25% { opacity: 1; }
          100% { opacity: 1; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)); }
        }
      `}</style>
    </button>
  );
}

// ── Live countdown (USPEH / purple) ─────────────────────────
function Countdown3({ onClick }) {
  const quitRef = React.useRef(Date.now() - ((47 * 86400 + 6 * 3600 + 18 * 60 + 42) * 1000));
  const [t, setT] = React.useState(() => calc(quitRef.current));
  function calc(start) {
    let s = Math.floor((Date.now() - start) / 1000);
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    return { d, h, m, s };
  }
  React.useEffect(() => {
    const id = setInterval(() => setT(calc(quitRef.current)), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  const cells = [
    { v: t.d, l: 'DANA' }, { v: pad(t.h), l: 'SATI' },
    { v: pad(t.m), l: 'MINUTA' }, { v: pad(t.s), l: 'SEKUNDE' },
  ];
  return (
    <button onClick={onClick} style={{
      background: ISK3.card, border: `1px solid ${ISK3.border}`, borderRadius: 18,
      padding: '15px 10px 17px', boxShadow: ISK3.shadow, width: '100%', display: 'block',
      cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 13 }}>
        <SparkIcon3 size={14} stroke={ISK3.brand} sw={2} />
        <span style={{ fontSize: 12, fontWeight: 700, color: ISK3.brand, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>SLOBODAN SI</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
        {cells.map((c, i) => (
          <React.Fragment key={c.l}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 33, fontWeight: 700, color: ISK3.text, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{c.v}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: ISK3.sub, letterSpacing: '0.06em', marginTop: 7 }}>{c.l}</span>
            </div>
            {i < 3 && <div style={{ width: 1, alignSelf: 'center', height: 26, background: ISK3.border }} />}
          </React.Fragment>
        ))}
      </div>
    </button>
  );
}

function StatCard3({ icon, value, label, cat, onClick }) {
  const C = CAT[cat];
  return (
    <button onClick={onClick} style={{
      flex: 1, background: ISK3.card, border: `1px solid ${ISK3.border}`, borderRadius: 18,
      padding: '16px 16px 15px', boxShadow: ISK3.shadow, textAlign: 'left',
      cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit', display: 'block', width: '100%',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11, background: C.chip,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
      }}>{icon(C.fg)}</div>
      <div style={{ fontSize: 25, fontWeight: 700, color: ISK3.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: C.fg, marginTop: 6, fontWeight: 600 }}>{label}</div>
    </button>
  );
}

function NavItem3({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '4px 0', WebkitTapHighlightColor: 'transparent',
    }}>
      {icon(active ? ISK3.brand : '#BDBAB3')}
      <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, color: active ? ISK3.brandDeep : ISK3.sub }}>{label}</span>
    </button>
  );
}

const ChevronR3 = ({ size = 18, stroke = '#CFCBC4' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 6l6 6-6 6" /></svg>
);
const ArrowLeft3 = ({ size = 20, stroke = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
);
const ShareIcon3 = ({ size = 18, stroke = '#E8621A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
  </svg>
);

const QUOTE = {
  n: 47,
  tag: 'Humor',
  teaser: 'Lako je prestati pušiti. Prestajao sam...',
  full: 'Lako je prestati pušiti. Prestajao sam stotinu puta.',
  author: 'Mark Twain',
  desc: 'Američki književnik, 1835–1910',
  comment: 'Mark Twain je pušio čibuke ceo život. Ali je ovo razumeo. Ti si na danu 47 — streak koji on nikad nije dostigao.',
};

const QuoteMarkIcon3 = (p) => (
  <Icon3 {...p}>
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
  </Icon3>
);

function QuoteCard({ onOpen }) {
  return (
    <button onClick={onOpen} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      background: ISK3.card, border: `1px solid ${ISK3.border}`, borderRadius: 18,
      boxShadow: ISK3.shadow, padding: '16px 16px 15px',
      display: 'flex', alignItems: 'center', gap: 13,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11, background: ISK3.brandSoft, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <QuoteMarkIcon3 size={20} stroke={ISK3.brand} sw={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: ISK3.sub, marginBottom: 3 }}>Quote dana #{QUOTE.n}</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: ISK3.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{QUOTE.teaser}</div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: ISK3.sub, marginTop: 6 }}>— {QUOTE.author}</div>
      </div>
      <ChevronR3 size={18} />
    </button>
  );
}

function CheckInOverlay({ onClose, onClean, onSlip }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      padding: '0 20px', animation: 'ciFade 0.2s ease both',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderRadius: 24, padding: 28,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'ciPop 0.24s cubic-bezier(0.2,0.9,0.3,1.2) both',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: ISK3.brandSoft }} />
            <svg width="60" height="60" viewBox="0 0 24 24" fill={ISK3.brand} style={{ position: 'relative' }}>
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
            </svg>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, background: ISK3.brandSoft,
            borderRadius: 999, padding: '6px 12px', marginTop: 2,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={ISK3.brand}>
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: ISK3.brand }}>Dan 48</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: ISK3.text, letterSpacing: '-0.01em' }}>Kako je prošao dan?</div>
          <div style={{ fontSize: 14, fontWeight: 400, color: ISK3.sub, marginTop: 6 }}>Budi iskren/a sa sobom.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          <button onClick={onClean} style={{
            height: 56, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: `linear-gradient(180deg, #F0701F 0%, ${ISK3.brand} 100%)`, color: '#fff',
            fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 20px rgba(232,98,26,0.28)', WebkitTapHighlightColor: 'transparent',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
            Čist sam danas
          </button>
          <button onClick={onSlip} style={{
            height: 56, borderRadius: 16, background: '#fff', border: `1.5px solid #E8E8E8`, cursor: 'pointer',
            fontFamily: 'inherit', color: ISK3.sub, fontSize: 16, fontWeight: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, WebkitTapHighlightColor: 'transparent',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" /><line x1="3" y1="4" x2="21" y2="20.5" />
            </svg>
            Zapalio/la sam
          </button>
        </div>

        <div style={{ fontSize: 12, fontWeight: 400, color: '#CCC', textAlign: 'center', marginTop: 16 }}>Ako zatvoriš, podrazumevamo da si čist/a.</div>
      </div>
      <style>{`
        @keyframes ciFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ciPop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

function HomeScreenV3() {
  const [tab, setTab] = React.useState('home');
  const [pressed, setPressed] = React.useState(false);
  const [view, setView] = React.useState('home');
  const [porivLevel, setPorivLevel] = React.useState(7);
  const [checkIn, setCheckIn] = React.useState(false);
  const [weekDone, setWeekDone] = React.useState(false);
  const [progressSheet, setProgressSheet] = React.useState(false);
  const Z = CAT.zdravlje;
  if (view === 'slip' && window.SlipScreen) return <window.SlipScreen onContinue={() => setView('slipRecap')} onReflect={() => window.SlipReflectScreen ? setView('slipReflect') : setView('slipRecap')} />;
  if (view === 'slipReflect' && window.SlipReflectScreen) return <window.SlipReflectScreen onClose={() => setView('slip')} onContinue={() => setView('slipRecap')} />;
  if (view === 'slipRecap' && window.SlipRecapScreen) return <window.SlipRecapScreen onContinue={() => { setView('home'); setProgressSheet(true); }} />;
  if (view === 'saznaj' && window.KnowledgeScreen) return <window.KnowledgeScreen onHome={() => setView('home')} />;
  if (view === 'milestoni' && window.MilestoniScreen) return <window.MilestoniScreen onHome={() => setView('home')} onKnowledge={() => window.KnowledgeScreen && setView('saznaj')} />;
  if (view === 'quote' && window.QuoteScreen) return <window.QuoteScreen onBack={() => setView('home')} />;
  if (view === 'money' && window.MoneyScreen) return <window.MoneyScreen onBack={() => setView('home')} onCigarettes={() => window.CigarettesScreen && setView('cigarettes')} />;
  if (view === 'time' && window.TimeScreen) return <window.TimeScreen onBack={() => setView('home')} />;
  if (view.startsWith('cat:') && window.CategoryScreen) return <window.CategoryScreen cat={view.slice(4)} onBack={() => setView('home')} />;
  if (view === 'roadmap' && window.GoalsRoadmapScreen) return <window.GoalsRoadmapScreen onBack={() => setView('home')} />;
  if (view === 'cigarettes' && window.CigarettesScreen) return <window.CigarettesScreen onBack={() => setView('home')} onMoney={() => window.MoneyScreen && setView('money')} />;
  if (view === 'settings' && window.SettingsScreen) return <window.SettingsScreen onBack={() => setView('home')} />;
  if (view === 'poriv' && window.PorivEntry) return <window.PorivEntry onStart={(d) => { if (d && d.strength) setPorivLevel(d.strength); setView('porivMode'); }} onClose={() => setView('home')} />;
  if (view === 'porivMode' && window.PorivMode) return <window.PorivMode level={porivLevel} onClose={() => setView('home')} onTool={(k) => {
    if (k === 'voda' && window.WaterScreen) setView('tool:voda');
    else if (k === 'disem' && window.BreathingScreen) setView('tool:disem');
    else if (k === 'razlozi' && window.RazloziScreen) setView('tool:razlozi');
    else if (k === 'setam' && window.SetamScreen) setView('tool:setam');
    else if (k === 'posmatram' && window.PosmatramScreen) setView('tool:posmatram');
    else if (k === 'igram' && window.IgramScreen) setView('tool:igram');
    else setView('porivSuccess');
  }} />;
  if (view === 'tool:voda' && window.WaterScreen) return <window.WaterScreen onClose={() => setView('porivSuccess')} />;
  if (view === 'tool:disem' && window.BreathingScreen) return <window.BreathingScreen onClose={() => setView('porivSuccess')} onDone={() => setView('porivSuccess')} />;
  if (view === 'tool:razlozi' && window.RazloziScreen) return <window.RazloziScreen onClose={() => setView('porivMode')} onStay={() => setView('porivSuccess')} />;
  if (view === 'tool:setam' && window.SetamScreen) return <window.SetamScreen onClose={() => setView('porivSuccess')} />;
  if (view === 'tool:posmatram' && window.PosmatramScreen) return <window.PosmatramScreen onClose={() => setView('porivSuccess')} />;
  if (view === 'tool:igram' && window.IgramScreen) return <window.IgramScreen onClose={() => setView('porivSuccess')} />;
  if (view === 'porivSuccess' && window.PorivSuccessScreen) return <window.PorivSuccessScreen onHome={() => setView('home')} />;
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column', position: 'relative',
      background: ISK3.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: ISK3.text,
    }}>
      {checkIn && <CheckInOverlay onClose={() => setCheckIn(false)} onClean={() => { setCheckIn(false); setWeekDone(true); }} onSlip={() => { setCheckIn(false); if (window.SlipScreen) setView('slip'); }} />}
      {progressSheet && window.ProgressSheet && <window.ProgressSheet onClose={() => setProgressSheet(false)} />}
      <div style={{ flex: 1, overflowY: 'auto', padding: '58px 20px 10px' }}>
        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <button onClick={() => setView('settings')} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', padding: 2.5,
              background: `linear-gradient(135deg, #F0701F, ${ISK3.brand})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%', background: ISK3.brandSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, color: ISK3.brandDeep,
              }}>P</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: ISK3.sub, lineHeight: 1.1 }}>Zdravo,</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: ISK3.text, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Pavle</div>
            </div>
          </button>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: ISK3.brandSoft, borderRadius: 999, padding: '8px 13px',
          }}>
            <FlameIcon3 size={16} stroke={ISK3.brand} sw={2} />
            <span style={{ fontSize: 14, fontWeight: 700, color: ISK3.brandDeep }}>47</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <WeekTracker3 onCheckIn={() => setCheckIn(true)} done={weekDone} />
          <Countdown3 onClick={() => window.TimeScreen && setView('time')} />
          <div style={{ display: 'flex', gap: 12 }}>
            <StatCard3 cat="novac" onClick={() => window.MoneyScreen && setView('money')} icon={(c) => <CoinIcon3 size={20} stroke={c} sw={2} />} value="18.800" label="RSD uštedeno" />
            <StatCard3 cat="cigare" onClick={() => window.CigarettesScreen && setView('cigarettes')} icon={(c) => <CigOffIcon3 size={20} stroke={c} sw={1.9} />} value="940" label="cigareta odbijeno" />
          </div>

          {/* quote of the day */}
          <QuoteCard onOpen={() => setView('quote')} />

          {/* Moji ciljevi */}
          <GoalsSection onOpen={(key) => { if (window.CategoryScreen && key === 'zdravlje') setView('cat:' + key); }} onOpenRoadmap={() => { if (window.GoalsRoadmapScreen) setView('roadmap'); }} onSlip={() => { if (window.SlipScreen) setView('slip'); }} onKnowledge={() => { if (window.KnowledgeScreen) setView('saznaj'); }} />
        </div>
      </div>

      {/* footer */}
      <div style={{ flexShrink: 0, padding: '8px 20px 0' }}>
        <button
          onClick={() => setView('poriv')}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${ISK3.brand} 100%)`,
            color: '#fff', fontSize: 16.5, fontWeight: 700, letterSpacing: '0.01em', whiteSpace: 'nowrap',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.32), 0 2px 5px rgba(232,98,26,0.25)',
            transform: pressed ? 'scale(0.975)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          <SparkIcon3 size={18} stroke="#fff" sw={2.1} />
          Imam poriv
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          paddingTop: 11, paddingBottom: 28, marginTop: 9, borderTop: `1px solid ${ISK3.border}`,
        }}>
          <NavItem3 icon={(c) => <HouseIcon3 size={23} stroke={c} sw={tab === 'home' ? 2.1 : 1.9} />} label="Početna" active={tab === 'home'} onClick={() => setTab('home')} />
          <NavItem3 icon={(c) => <FlagIcon3 size={23} stroke={c} sw={tab === 'ms' ? 2.1 : 1.9} />} label="Milestoni" active={tab === 'ms'} onClick={() => { if (window.MilestoniScreen) setView('milestoni'); else setTab('ms'); }} />
          <NavItem3 icon={(c) => <BookIcon3 size={23} stroke={c} sw={tab === 'comm' ? 2.1 : 1.9} />} label="Saznaj" active={tab === 'comm'} onClick={() => { if (window.KnowledgeScreen) setView('saznaj'); else setTab('comm'); }} />
          <NavItem3 icon={(c) => <UserIcon3 size={23} stroke={c} sw={tab === 'prof' ? 2.1 : 1.9} />} label="Profil" active={tab === 'prof'} onClick={() => setTab('prof')} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreenV3 });

})();
