/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingTiming.jsx — Iskra onboarding: quit timing (single-select, auto-advance).

const TMG = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', tint: '#FEF0E8',
};

function TIcon({ size = 24, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const Bolt = (p) => <TIcon {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></TIcon>;
const Cal = (p) => <TIcon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></TIcon>;
const Check = (p) => <TIcon {...p}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></TIcon>;

const OPTIONS = [
  { key: 'odmah', title: 'Odmah', sub: 'Počinjemo danas', color: '#E8621A', Icon: Bolt },
  { key: 'uskoro', title: 'Uskoro', sub: 'Izaberi datum', color: '#4A6080', Icon: Cal },
  { key: 'vec', title: 'Već sam prestao/la', sub: 'Nastavljam streak', color: '#3A7A3A', Icon: Check },
];

function TimingCard({ o, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      background: selected ? `linear-gradient(180deg, #F0701F 0%, ${TMG.accent} 100%)` : '#fff',
      border: selected ? `2px solid ${TMG.accent}` : `1.5px solid ${TMG.track}`,
      borderRadius: 16, padding: selected ? '19px 23px' : '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: selected ? '0 6px 16px rgba(232,98,26,0.26)' : 'none',
      transition: 'background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <o.Icon size={23} color={selected ? TMG.accent : o.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 500, color: selected ? '#fff' : TMG.text, letterSpacing: '-0.01em' }}>{o.title}</div>
        <div style={{ fontSize: 13, fontWeight: 400, color: selected ? 'rgba(255,255,255,0.85)' : TMG.sub, marginTop: 3 }}>{o.sub}</div>
      </div>
      <svg width="9" height="15" viewBox="0 0 9 15" style={{ flexShrink: 0 }}>
        <path d="M1.5 1.5l6 6-6 6" stroke={selected ? '#fff' : '#CFCBC4'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function OnboardingTiming({ onNext = () => {}, onBack = () => {} }) {
  const [sel, setSel] = React.useState(null);
  const choose = (key) => {
    setSel(key);
    setTimeout(() => onNext(key), 300);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: TMG.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: TMG.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: TMG.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(11 / 18) * 100}%`, height: '100%', background: TMG.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${TMG.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: TMG.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Kada hoćeš da prestaneš?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: TMG.sub, lineHeight: 1.45 }}>
          Nema pogrešnog odgovora.
        </p>
      </div>

      {/* options */}
      <div style={{ flex: 1, padding: '28px 26px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPTIONS.map((o) => (
          <TimingCard key={o.key} o={o} selected={sel === o.key} onClick={() => choose(o.key)} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingTiming });

})();
