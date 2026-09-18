/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingReasons.jsx — Iskra onboarding: reasons to quit (multi-select, max 3).

const RSN = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', tint: '#FEF0E8',
};

function RIcon({ size = 24, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const HeartI = (p) => <RIcon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" /></RIcon>;
const PeopleI = (p) => <RIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></RIcon>;
const CoinI = (p) => <RIcon {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></RIcon>;
const DumbbellI = (p) => <RIcon {...p}><path d="M6 7v10M4 9.5v5M18 7v10M20 9.5v5M6 12h12" /></RIcon>;
const BirdI = (p) => <RIcon {...p}><path d="M4 13 Q 8 7 12 13 Q 16 7 20 13" /></RIcon>;
const StethoI = (p) => <RIcon {...p}><path d="M5 3v5a4 4 0 0 0 8 0V3" /><path d="M9 12v3a5 5 0 0 0 10 0v-1.5" /><circle cx="19" cy="11" r="2" /></RIcon>;

const REASONS = [
  { key: 'zdravlje', label: 'Zdravlje', color: '#D4547E', Icon: HeartI },
  { key: 'porodica', label: 'Porodica', color: '#4A6080', Icon: PeopleI },
  { key: 'pare', label: 'Pare', color: '#2E8B80', Icon: CoinI },
  { key: 'forma', label: 'Fizička forma', color: '#3A7A3A', Icon: DumbbellI },
  { key: 'sloboda', label: 'Sloboda', color: '#6B52A8', Icon: BirdI },
  { key: 'pritisak', label: 'Pritisak doktora ili partnera', color: '#BA7517', Icon: StethoI },
];

function ReasonPill({ r, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      cursor: 'pointer', fontFamily: 'inherit', minHeight: 104,
      background: selected ? `linear-gradient(180deg, #F0701F 0%, ${RSN.accent} 100%)` : '#fff',
      border: selected ? `2px solid ${RSN.accent}` : `1.5px solid ${RSN.track}`,
      borderRadius: 14, padding: selected ? '15px 13px' : '15.5px 13.5px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 11,
      boxShadow: selected ? '0 6px 16px rgba(232,98,26,0.26)' : 'none',
      transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <r.Icon size={24} color={selected ? '#fff' : r.color} />
      <span style={{ fontSize: 14, fontWeight: 600, color: selected ? '#fff' : RSN.text, textAlign: 'center', lineHeight: 1.3 }}>{r.label}</span>
    </button>
  );
}

function OnboardingReasons({ onNext = () => {}, onBack = () => {} }) {
  const [sel, setSel] = React.useState([]);
  const [pressed, setPressed] = React.useState(false);
  const ready = sel.length >= 1;

  const toggle = (key) => setSel((cur) => {
    if (cur.includes(key)) return cur.filter((k) => k !== key);
    if (cur.length >= 3) return cur; // max 3
    return [...cur, key];
  });

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: RSN.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: RSN.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: RSN.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(7 / 18) * 100}%`, height: '100%', background: RSN.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${RSN.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: RSN.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Zašto hoćeš da prestaneš?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: RSN.sub, lineHeight: 1.45 }}>
          Izaberi do 3 razloga. Koristićemo ih tokom tvog putovanja.
        </p>
      </div>

      {/* grid */}
      <div style={{ flex: 1, padding: '26px 26px 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {REASONS.map((r) => (
            <ReasonPill key={r.key} r={r} selected={sel.includes(r.key)} onClick={() => toggle(r.key)} />
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
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${RSN.accent} 100%)` : '#F0D6C6',
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

Object.assign(window, { OnboardingReasons });

})();
