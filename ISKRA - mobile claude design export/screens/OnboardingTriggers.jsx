/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingTriggers.jsx — Iskra onboarding: smoking triggers (multi-select).

const TRG = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999',
};

function TgIcon({ size = 24, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const CoffeeI = (p) => <TgIcon {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M6 2v2M10 2v2M14 2v2" /></TgIcon>;
const ForkI = (p) => <TgIcon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" /><path d="M5 11v11" /><path d="M5 2v4" /><path d="M19 2v20" /><path d="M19 14c2 0 2.5-2 2.5-5 0-4-1-7-2.5-7s-2.5 3-2.5 7c0 3 .5 5 2.5 5Z" /></TgIcon>;
const BeerI = (p) => <TgIcon {...p}><path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6M13 12v6" /><path d="M14 7.5c1.5 0 3 .8 3 2.5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.7 1.5-2.5 3-2.5" /><path d="M7 7.5a2.5 2.5 0 0 1 .5-4.5A3 3 0 0 1 13 3a2.5 2.5 0 0 1 1 4.5" /></TgIcon>;
const StormI = (p) => <TgIcon {...p}><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></TgIcon>;
const PeopleI = (p) => <TgIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></TgIcon>;
const LaptopI = (p) => <TgIcon {...p}><rect x="3" y="5" width="18" height="11" rx="2" /><path d="M2 20h20" /></TgIcon>;
const ClockI = (p) => <TgIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3.5 2" /></TgIcon>;

const TRIGGERS = [
  { key: 'kafa', label: 'Jutarnja kafa', color: '#BA7517', Icon: CoffeeI },
  { key: 'jelo', label: 'Posle jela', color: '#3A7A3A', Icon: ForkI },
  { key: 'alkohol', label: 'Kafana i alkohol', color: '#6B52A8', Icon: BeerI },
  { key: 'stres', label: 'Stres na poslu', color: '#4A6080', Icon: StormI },
  { key: 'kolege', label: 'Pauza sa kolegama', color: '#D4547E', Icon: PeopleI },
  { key: 'komp', label: 'Sedenje za kompom', color: '#2E8B80', Icon: LaptopI },
  { key: 'dosada', label: 'Čekanje i dosada', color: '#999999', Icon: ClockI },
];

function TriggerPill({ t, selected, onClick, full }) {
  return (
    <button onClick={onClick} style={{
      cursor: 'pointer', fontFamily: 'inherit', minHeight: 104, gridColumn: full ? '1 / -1' : 'auto',
      background: selected ? `linear-gradient(180deg, #F0701F 0%, ${TRG.accent} 100%)` : '#fff',
      border: selected ? `2px solid ${TRG.accent}` : `1.5px solid ${TRG.track}`,
      borderRadius: 14, padding: selected ? '15px 13px' : '15.5px 13.5px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 11,
      boxShadow: selected ? '0 6px 16px rgba(232,98,26,0.26)' : 'none',
      transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <t.Icon size={24} color={selected ? '#fff' : t.color} />
      <span style={{ fontSize: 13, fontWeight: 600, color: selected ? '#fff' : TRG.text, textAlign: 'center', lineHeight: 1.3 }}>{t.label}</span>
    </button>
  );
}

function OnboardingTriggers({ onNext = () => {}, onBack = () => {} }) {
  const [sel, setSel] = React.useState([]);
  const [pressed, setPressed] = React.useState(false);
  const ready = sel.length >= 1;
  const toggle = (key) => setSel((cur) => cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: TRG.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: TRG.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: TRG.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(10 / 18) * 100}%`, height: '100%', background: TRG.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${TRG.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: TRG.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Kada ti se najviše puši?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: TRG.sub, lineHeight: 1.45 }}>
          Koristićemo ovo da ti pomognemo u tim konkretnim momentima.
        </p>
      </div>

      {/* grid */}
      <div style={{ flex: 1, padding: '26px 26px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TRIGGERS.map((t, i) => (
            <TriggerPill key={t.key} t={t} full={i === TRIGGERS.length - 1} selected={sel.includes(t.key)} onClick={() => toggle(t.key)} />
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
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${TRG.accent} 100%)` : '#F0D6C6',
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

Object.assign(window, { OnboardingTriggers });

})();
