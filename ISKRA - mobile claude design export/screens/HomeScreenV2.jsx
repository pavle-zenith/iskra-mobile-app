/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// HomeScreenV2.jsx — Iskra home, Kwit-style IA in warm Iskra visual language.

const ISK2 = {
  bg: '#F7F6F3', card: '#FFFFFF', border: '#ECE9E3',
  accent: '#EF9F27', accentDeep: '#E08E12', accentSoft: '#FEF3E2',
  text: '#1A1A1A', sub: '#999999', faint: '#F1EDE6',
};

function Icon2({ size = 24, stroke = '#1A1A1A', sw = 1.9, fill = 'none', children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {children}
    </svg>
  );
}

const FlameIcon = (p) => (
  <Icon2 {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
  </Icon2>
);
const CoinIcon2 = (p) => (
  <Icon2 {...p}>
    <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
  </Icon2>
);
const CigOffIcon = (p) => (
  <Icon2 {...p}>
    <rect x="2.5" y="13" width="13.5" height="4" rx="1.4" />
    <line x1="11.5" y1="13" x2="11.5" y2="17" />
    <path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" />
    <line x1="3" y1="4" x2="21" y2="20.5" />
  </Icon2>
);
const LeafIcon2 = (p) => (
  <Icon2 {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </Icon2>
);
const SparkIcon2 = (p) => (
  <Icon2 {...p} sw={p.sw || 1.8}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
  </Icon2>
);
const HouseIcon2 = (p) => (
  <Icon2 {...p}>
    <path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" />
    <path d="M9 21.5V13h6v8.5" />
  </Icon2>
);
const FlagIcon = (p) => (
  <Icon2 {...p}>
    <path d="M4 22V4" /><path d="M4 4h11l-1.5 3.5L15 11H4" />
  </Icon2>
);
const UsersIcon2 = (p) => (
  <Icon2 {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon2>
);
const UserIcon2 = (p) => (
  <Icon2 {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </Icon2>
);

// ── Weekly tracker ──────────────────────────────────────────
function WeekTracker() {
  const days = [
    { l: 'Pon', s: 'done' }, { l: 'Uto', s: 'done' }, { l: 'Sre', s: 'done' },
    { l: 'Čet', s: 'done' }, { l: 'Pet', s: 'done' }, { l: 'Sub', s: 'today' },
    { l: 'Ned', s: 'future' },
  ];
  return (
    <div style={{
      background: ISK2.card, border: `1px solid ${ISK2.border}`, borderRadius: 18,
      padding: '17px 16px 18px', boxShadow: '0 1px 2px rgba(26,22,15,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 15.5, fontWeight: 700, color: ISK2.text, letterSpacing: '-0.01em' }}>Ova nedelja</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: ISK2.sub, whiteSpace: 'nowrap' }}>5 / 7</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((d) => (
          <div key={d.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: d.s === 'today' ? ISK2.accentDeep : ISK2.sub }}>{d.l}</span>
            {d.s === 'done' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `linear-gradient(180deg, #F4AE3E, ${ISK2.accent})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(239,159,39,0.28)',
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7.5 6 11l5.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            {d.s === 'today' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: ISK2.accentSoft, border: `2px solid ${ISK2.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: ISK2.accent }} />
              </div>
            )}
            {d.s === 'future' && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: ISK2.faint, border: `1px solid ${ISK2.border}` }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Live countdown ──────────────────────────────────────────
function Countdown() {
  // anchor a quit date so the timer ticks realistically from 47d 06:18:42
  const quitRef = React.useRef(
    Date.now() - ((47 * 86400 + 6 * 3600 + 18 * 60 + 42) * 1000)
  );
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
    <div style={{
      background: ISK2.card, border: `1px solid ${ISK2.border}`, borderRadius: 18,
      padding: '15px 10px 17px', boxShadow: '0 1px 2px rgba(26,22,15,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 13 }}>
        <SparkIcon2 size={14} stroke={ISK2.accent} sw={2} />
        <span style={{ fontSize: 12, fontWeight: 600, color: ISK2.sub, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Slobodan si</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
        {cells.map((c, i) => (
          <React.Fragment key={c.l}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 33, fontWeight: 700, color: ISK2.text, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{c.v}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: ISK2.sub, letterSpacing: '0.06em', marginTop: 7 }}>{c.l}</span>
            </div>
            {i < 3 && <div style={{ width: 1, alignSelf: 'center', height: 26, background: ISK2.border }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StatCard2({ icon, value, label }) {
  return (
    <div style={{
      flex: 1, background: ISK2.card, border: `1px solid ${ISK2.border}`, borderRadius: 18,
      padding: '16px 16px 15px', boxShadow: '0 1px 2px rgba(26,22,15,0.03)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11, background: ISK2.accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
      }}>{icon}</div>
      <div style={{ fontSize: 25, fontWeight: 700, color: ISK2.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: ISK2.sub, marginTop: 6, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function NavItem2({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '4px 0', WebkitTapHighlightColor: 'transparent',
    }}>
      {icon(active ? ISK2.accent : '#BDBAB3')}
      <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, color: active ? ISK2.accentDeep : ISK2.sub }}>{label}</span>
    </button>
  );
}

function HomeScreenV2() {
  const [tab, setTab] = React.useState('home');
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: ISK2.bg, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: ISK2.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '58px 20px 10px' }}>
        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', padding: 2.5,
              background: `linear-gradient(135deg, #F6B752, ${ISK2.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%', background: ISK2.accentSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, color: ISK2.accentDeep,
              }}>P</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: ISK2.sub, lineHeight: 1.1 }}>Zdravo,</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: ISK2.text, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Pavle</div>
            </div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: ISK2.accentSoft, borderRadius: 999, padding: '8px 13px',
          }}>
            <FlameIcon size={16} stroke={ISK2.accent} sw={2} />
            <span style={{ fontSize: 14, fontWeight: 700, color: ISK2.accentDeep }}>47</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <WeekTracker />
          <Countdown />
          <div style={{ display: 'flex', gap: 12 }}>
            <StatCard2 icon={<CoinIcon2 size={20} stroke={ISK2.accent} sw={2} />} value="18.800" label="RSD uštedeno" />
            <StatCard2 icon={<CigOffIcon size={20} stroke={ISK2.accent} sw={1.9} />} value="940" label="cigareta odbijeno" />
          </div>

          {/* milestone */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: ISK2.card, border: `1px solid ${ISK2.border}`, borderRadius: 18,
            padding: '14px 16px', boxShadow: '0 1px 2px rgba(26,22,15,0.03)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13, background: ISK2.accentSoft, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LeafIcon2 size={22} stroke={ISK2.accent} sw={1.9} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ISK2.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>Za 3h</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: ISK2.text, letterSpacing: '-0.01em' }}>Pluća počinju da se čiste</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
              <path d="M1 1l6 6-6 6" stroke="#CFCBC4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ flexShrink: 0, padding: '8px 20px 0' }}>
        <button
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F4AE3E 0%, ${ISK2.accent} 100%)`,
            color: '#fff', fontSize: 16.5, fontWeight: 700, letterSpacing: '0.01em', whiteSpace: 'nowrap',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            boxShadow: pressed ? '0 1px 3px rgba(239,159,39,0.3)' : '0 8px 20px rgba(239,159,39,0.32), 0 2px 5px rgba(239,159,39,0.25)',
            transform: pressed ? 'scale(0.975)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          <SparkIcon2 size={18} stroke="#fff" sw={2.1} />
          Imam kraving
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          paddingTop: 11, paddingBottom: 28, marginTop: 9, borderTop: `1px solid ${ISK2.border}`,
        }}>
          <NavItem2 icon={(c) => <HouseIcon2 size={23} stroke={c} sw={tab === 'home' ? 2.1 : 1.9} />} label="Početna" active={tab === 'home'} onClick={() => setTab('home')} />
          <NavItem2 icon={(c) => <FlagIcon size={23} stroke={c} sw={tab === 'ms' ? 2.1 : 1.9} />} label="Milestoni" active={tab === 'ms'} onClick={() => setTab('ms')} />
          <NavItem2 icon={(c) => <UsersIcon2 size={23} stroke={c} sw={tab === 'comm' ? 2.1 : 1.9} />} label="Zajednica" active={tab === 'comm'} onClick={() => setTab('comm')} />
          <NavItem2 icon={(c) => <UserIcon2 size={23} stroke={c} sw={tab === 'prof' ? 2.1 : 1.9} />} label="Profil" active={tab === 'prof'} onClick={() => setTab('prof')} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreenV2 });

})();
