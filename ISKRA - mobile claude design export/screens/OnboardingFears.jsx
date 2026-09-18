/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingFears.jsx — Iskra onboarding: fears about quitting (multi-select).

const FRS = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', tint: '#FEF0E8',
};

function FrIcon({ size = 24, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const BoltI = (p) => <FrIcon {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></FrIcon>;
const StormI = (p) => <FrIcon {...p}><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></FrIcon>;
const ChatI = (p) => <FrIcon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></FrIcon>;
const WarnI = (p) => <FrIcon {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></FrIcon>;
const FlameI = (p) => <FrIcon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" /></FrIcon>;
const ScaleI = (p) => <FrIcon {...p}><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></FrIcon>;

const FEARS = [
  { key: 'porivi', label: 'Jaki porivi', color: '#E8621A', Icon: BoltI },
  { key: 'stres', label: 'Stres bez cigarete', color: '#4A6080', Icon: StormI },
  { key: 'kafana', label: 'Kafana i društvo', color: '#6B52A8', Icon: ChatI },
  { key: 'neuspeh', label: 'Strah od neuspeha', color: '#BA7517', Icon: WarnI },
  { key: 'razdraz', label: 'Razdražljivost', color: '#D4547E', Icon: FlameI },
  { key: 'kilaza', label: 'Dobitak na kilaži', color: '#3A7A3A', Icon: ScaleI },
];

function FearPill({ f, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      cursor: 'pointer', fontFamily: 'inherit', minHeight: 104,
      background: selected ? `linear-gradient(180deg, #F0701F 0%, ${FRS.accent} 100%)` : '#fff',
      border: selected ? `2px solid ${FRS.accent}` : `1.5px solid ${FRS.track}`,
      borderRadius: 14, padding: selected ? '15px 13px' : '15.5px 13.5px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 11,
      boxShadow: selected ? '0 6px 16px rgba(232,98,26,0.26)' : 'none',
      transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <f.Icon size={24} color={selected ? '#fff' : f.color} />
      <span style={{ fontSize: 14, fontWeight: 600, color: selected ? '#fff' : FRS.text, textAlign: 'center', lineHeight: 1.3 }}>{f.label}</span>
    </button>
  );
}

function OnboardingFears({ onNext = () => {}, onBack = () => {} }) {
  const [sel, setSel] = React.useState([]);
  const [pressed, setPressed] = React.useState(false);
  const ready = sel.length >= 1;
  const toggle = (key) => setSel((cur) => cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: FRS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: FRS.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: FRS.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(9 / 18) * 100}%`, height: '100%', background: FRS.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${FRS.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: FRS.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Šta te brine kod prestanka?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: FRS.sub, lineHeight: 1.45 }}>
          Budi iskren/a. Tu smo da pomognemo.
        </p>
      </div>

      {/* grid */}
      <div style={{ flex: 1, padding: '26px 26px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {FEARS.map((f) => (
            <FearPill key={f.key} f={f} selected={sel.includes(f.key)} onClick={() => toggle(f.key)} />
          ))}
        </div>
      </div>

      {/* button */}
      <div style={{ flexShrink: 0, padding: '16px 26px 42px' }}>
        <button
          disabled={!ready}
          onClick={() => { if (ready) onNext(); }}
          onMouseDown={() => ready && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${FRS.accent} 100%)` : '#F0D6C6',
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: ready && !pressed ? '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)' : 'none',
            transform: pressed ? 'scale(0.985)' : 'scale(1)',
            transition: 'transform 0.12s ease, box-shadow 0.15s ease, background 0.2s ease',
          }}>
          Nastavi
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingFears });

})();
