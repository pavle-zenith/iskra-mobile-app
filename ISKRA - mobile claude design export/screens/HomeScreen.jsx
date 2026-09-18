/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// HomeScreen.jsx — Iskra quit-smoking app home screen (Serbian market)
// Liven-inspired: warm, minimal, premium. Single amber accent.

const ISK = {
  bg: '#F7F6F3',
  card: '#FFFFFF',
  border: '#ECE9E3',
  accent: '#EF9F27',
  accentDeep: '#E08E12',
  accentSoft: '#FEF3E2',
  text: '#1A1A1A',
  sub: '#999999',
  faint: '#F1EDE6',
};

// ── Generic stroke-icon wrapper ──────────────────────────────
function Icon({ size = 24, stroke = '#1A1A1A', sw = 1.9, children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={style}>
      {children}
    </svg>
  );
}

const SlidersIcon = (p) => (
  <Icon {...p}>
    <line x1="21" x2="14" y1="5" y2="5" /><line x1="10" x2="3" y1="5" y2="5" />
    <line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" />
    <line x1="21" x2="16" y1="19" y2="19" /><line x1="12" x2="3" y1="19" y2="19" />
    <circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="10" cy="12" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="14" cy="19" r="1.7" fill="currentColor" stroke="none" />
  </Icon>
);
const CoinIcon = (p) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
  </Icon>
);
const WindIcon = (p) => (
  <Icon {...p}>
    <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
    <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
    <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
  </Icon>
);
const LeafIcon = (p) => (
  <Icon {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </Icon>
);
const SparkIcon = (p) => (
  <Icon {...p} sw={p.sw || 1.7}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
  </Icon>
);
const HouseIcon = (p) => (
  <Icon {...p}>
    <path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" />
    <path d="M9 21.5V13h6v8.5" />
  </Icon>
);
const TrophyIcon = (p) => (
  <Icon {...p}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </Icon>
);
const UsersIcon = (p) => (
  <Icon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);
const UserIcon = (p) => (
  <Icon {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </Icon>
);

// ── Hero progress ring around the day count ──────────────────
function HeroRing({ children }) {
  const r = 104, c = 2 * Math.PI * r, pct = 0.62;
  return (
    <div style={{ position: 'relative', width: 232, height: 232, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* soft amber glow */}
      <div style={{
        position: 'absolute', inset: 18, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 45%, rgba(239,159,39,0.14), rgba(239,159,39,0) 68%)',
      }} />
      <svg width="232" height="232" viewBox="0 0 232 232" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F6B752" />
            <stop offset="100%" stopColor="#EF9F27" />
          </linearGradient>
        </defs>
        <circle cx="116" cy="116" r={r} fill="none" stroke={ISK.faint} strokeWidth="9" />
        <circle cx="116" cy="116" r={r} fill="none" stroke="url(#ring)" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 116 116)" />
      </svg>
      <div style={{ position: 'relative', textAlign: 'center' }}>{children}</div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div style={{
      flex: 1, background: ISK.card, border: `1px solid ${ISK.border}`,
      borderRadius: 18, padding: '18px 18px 17px',
      boxShadow: '0 1px 2px rgba(26,22,15,0.03)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11, background: ISK.accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 27, fontWeight: 700, color: ISK.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: ISK.sub, marginTop: 7, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function NavItem({ icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '6px 0', WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        width: 46, height: 34, borderRadius: 11,
        background: active ? ISK.accentSoft : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.18s ease',
      }}>
        {icon(active ? ISK.accent : '#BDBAB3')}
      </div>
    </button>
  );
}

function HomeScreen() {
  const [tab, setTab] = React.useState('home');
  const [pressed, setPressed] = React.useState(false);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: ISK.bg, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      color: ISK.text, position: 'relative',
    }}>
      {/* scroll region */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '60px 22px 8px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              fontSize: 15, fontWeight: 700, letterSpacing: '0.34em', color: ISK.text,
            }}>ISKRA</span>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 13, background: ISK.card,
            border: `1px solid ${ISK.border}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SlidersIcon size={20} stroke="#A8A5A0" sw={1.8} />
          </button>
        </div>

        {/* hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 6, marginBottom: 26 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: ISK.accentSoft, color: ISK.accentDeep,
            borderRadius: 999, padding: '7px 14px', fontSize: 12.5, fontWeight: 600,
            letterSpacing: '0.01em', marginBottom: 6,
          }}>
            <SparkIcon size={13} stroke={ISK.accent} sw={2} />
            Slobodan si već
          </div>
          <HeroRing>
            <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.04em', color: ISK.text }}>47</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: ISK.accent, marginTop: 2, letterSpacing: '0.02em' }}>dana</div>
          </HeroRing>
        </div>

        {/* stat cards */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <StatCard icon={<CoinIcon size={21} stroke={ISK.accent} sw={2} />} value="18.800" label="RSD uštedeno" />
          <StatCard icon={<WindIcon size={21} stroke={ISK.accent} sw={2} />} value="940" label="cigareta odbijeno" />
        </div>

        {/* milestone card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 15,
          background: ISK.card, border: `1px solid ${ISK.border}`, borderRadius: 18,
          padding: '15px 17px', boxShadow: '0 1px 2px rgba(26,22,15,0.03)',
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14, background: ISK.accentSoft, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LeafIcon size={23} stroke={ISK.accent} sw={1.9} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: ISK.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>Za 3h</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: ISK.text, letterSpacing: '-0.01em' }}>Pluća počinju da se čiste</div>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
            <path d="M1 1l6 6-6 6" stroke="#CFCBC4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* footer: CTA + nav (fixed) */}
      <div style={{ flexShrink: 0, padding: '8px 22px 0' }}>
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 58, borderRadius: 17, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F4AE3E 0%, ${ISK.accent} 100%)`,
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            whiteSpace: 'nowrap',
            boxShadow: pressed
              ? '0 1px 3px rgba(239,159,39,0.3)'
              : '0 8px 22px rgba(239,159,39,0.34), 0 2px 5px rgba(239,159,39,0.25)',
            transform: pressed ? 'scale(0.975)' : 'scale(1)',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          <SparkIcon size={19} stroke="#fff" sw={2.1} />
          Imam kraving
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          paddingTop: 12, paddingBottom: 30, marginTop: 10,
          borderTop: `1px solid ${ISK.border}`,
        }}>
          <NavItem icon={(c) => <HouseIcon size={24} stroke={c} sw={tab === 'home' ? 2.1 : 1.9} />} active={tab === 'home'} onClick={() => setTab('home')} />
          <NavItem icon={(c) => <TrophyIcon size={24} stroke={c} sw={tab === 'trophy' ? 2.1 : 1.9} />} active={tab === 'trophy'} onClick={() => setTab('trophy')} />
          <NavItem icon={(c) => <UsersIcon size={24} stroke={c} sw={tab === 'users' ? 2.1 : 1.9} />} active={tab === 'users'} onClick={() => setTab('users')} />
          <NavItem icon={(c) => <UserIcon size={24} stroke={c} sw={tab === 'user' ? 2.1 : 1.9} />} active={tab === 'user'} onClick={() => setTab('user')} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen });

})();
