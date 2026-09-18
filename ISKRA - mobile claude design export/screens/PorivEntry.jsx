/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// PorivEntry.jsx — Iskra craving entry screen (transitional, fast, minimal).

const PE = {
  bg: '#FDFCFA', accent: '#E8621A', track: '#E0E0E0',
  text: '#1A1A1A', sub: '#999999', fine: '#BBBBBB', tint: '#FEF0E8',
};

function PeIcon({ size = 18, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const CoffeeI = (p) => <PeIcon {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M6 2v2M10 2v2M14 2v2" /></PeIcon>;
const SunI = (p) => <PeIcon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></PeIcon>;
const PeopleI = (p) => <PeIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></PeIcon>;
const StormI = (p) => <PeIcon {...p}><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></PeIcon>;
const ForkI = (p) => <PeIcon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" /><path d="M5 11v11" /><path d="M19 2v20" /><path d="M19 14c2 0 2.5-2 2.5-5 0-4-1-7-2.5-7s-2.5 3-2.5 7c0 3 .5 5 2.5 5Z" /></PeIcon>;
const BeerI = (p) => <PeIcon {...p}><path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6M13 12v6" /><path d="M14 7.5c1.5 0 3 .8 3 2.5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.7 1.5-2.5 3-2.5" /><path d="M7 7.5a2.5 2.5 0 0 1 .5-4.5A3 3 0 0 1 13 3a2.5 2.5 0 0 1 1 4.5" /></PeIcon>;
const ClockI = (p) => <PeIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3.5 2" /></PeIcon>;
const QI = (p) => <PeIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.6-2.8 2.6" /><path d="M12 17h.01" /></PeIcon>;

const TRIGGERS = [
  { key: 'kafa', label: 'Trenutno pijem kafu', chip: '#FEF3E2', color: '#BA7517', Icon: CoffeeI },
  { key: 'budjenje', label: 'Upravo sam se probudio/la', chip: '#FEF0E8', color: '#E8621A', Icon: SunI },
  { key: 'okolina', label: 'Svi oko mene puše', chip: '#EDF2F8', color: '#4A6080', Icon: PeopleI },
  { key: 'stres', label: 'Jako sam pod stresom', chip: '#EDF2F8', color: '#4A6080', Icon: StormI },
  { key: 'jelo', label: 'Upravo sam završio/la sa jelom', chip: '#EDF7ED', color: '#3A7A3A', Icon: ForkI },
  { key: 'alkohol', label: 'Pijem alkohol', chip: '#F0EDF8', color: '#6B52A8', Icon: BeerI },
  { key: 'dosada', label: 'Dosadno mi je', chip: '#F1EEE9', color: '#999999', Icon: ClockI },
  { key: 'drugo', label: 'Nešto drugo', chip: '#F1EEE9', color: '#999999', Icon: QI },
];

function PorivEntry({ onStart = () => {}, onClose = () => {} }) {
  const [strength, setStrength] = React.useState(5);
  const [moved, setMoved] = React.useState(false);
  const [trigger, setTrigger] = React.useState(null);
  const [pressed, setPressed] = React.useState(false);
  const ready = moved && trigger !== null;

  const pct = ((strength - 1) / 9) * 100;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: PE.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: PE.text,
    }}>
      {/* top bar */}
      <div style={{ padding: '56px 22px 0', flexShrink: 0 }}>
        <button onClick={onClose} style={{
          width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div style={{ flexShrink: 0, padding: '0 26px' }}>
        {/* craving strength */}
        <h2 style={{ margin: '32px 0 0', fontSize: 22, fontWeight: 500, color: PE.text, letterSpacing: '-0.01em' }}>
          Koliko jak je poriv?
        </h2>

        <div style={{ position: 'relative', height: 44, marginTop: 14 }}>
          <span style={{
            position: 'absolute', bottom: 0,
            left: `calc(${pct}% + ${14 - (pct / 100) * 28}px)`, transform: 'translateX(-50%)',
            fontSize: 36, fontWeight: 700, color: PE.accent, fontVariantNumeric: 'tabular-nums',
            transition: 'left 0.05s linear', lineHeight: 1, whiteSpace: 'nowrap',
          }}>{strength}</span>
        </div>

        {/* slider */}
        <div style={{ position: 'relative', marginTop: 4, padding: '14px 0' }}>
          <div style={{ position: 'relative', height: 6, borderRadius: 3, background: PE.track }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: PE.accent, borderRadius: 3 }} />
          </div>
          <input
            type="range" min="1" max="10" value={strength}
            onChange={(e) => { setStrength(parseInt(e.target.value, 10)); setMoved(true); }}
            aria-label="Jačina poriva"
            style={{
              position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
              width: '100%', margin: 0, WebkitAppearance: 'none', appearance: 'none', background: 'transparent', cursor: 'pointer',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: PE.sub }}>Blag</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: PE.sub }}>Nepodnošljiv</span>
        </div>

        {/* trigger */}
        <h2 style={{ margin: '28px 0 0', fontSize: 22, fontWeight: 500, color: PE.text, letterSpacing: '-0.01em' }}>
          Šta te navelo?
        </h2>
      </div>

      {/* scrollable trigger list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 26px 4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {TRIGGERS.map((t) => {
            const on = trigger === t.key;
            return (
              <button key={t.key} onClick={() => setTrigger(t.key)} style={{
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                display: 'flex', alignItems: 'center', gap: 13,
                borderRadius: 12, padding: on ? '13px 15px' : '13.5px 15.5px',
                border: on ? `1.5px solid ${PE.accent}` : `1px solid #EEEEEE`,
                background: on ? `linear-gradient(180deg, #F0701F 0%, ${PE.accent} 100%)` : '#fff',
                boxShadow: on ? '0 4px 12px rgba(232,98,26,0.24)' : 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'background 0.13s ease, border-color 0.13s ease, box-shadow 0.13s ease',
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 10, background: on ? '#fff' : t.chip, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <t.Icon size={18} color={on ? PE.accent : t.color} sw={1.9} />
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: on ? '#fff' : PE.text }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* primary button */}
      <div style={{ flexShrink: 0, padding: '12px 26px 38px' }}>
        <button
          disabled={!ready}
          onClick={() => { if (ready) onStart({ strength, trigger }); }}
          onMouseDown={() => ready && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${PE.accent} 100%)` : '#E4D3C7',
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: ready && !pressed ? '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)' : 'none',
            transform: pressed ? 'scale(0.985)' : 'scale(1)',
            transition: 'transform 0.12s ease, box-shadow 0.15s ease, background 0.2s ease',
          }}>
          Pokreni
        </button>
        <p style={{ margin: '12px 0 0', fontSize: 12, fontWeight: 400, color: PE.fine, textAlign: 'center' }}>
          Porivi traju 3 do 5 minuta. Prođe uvek.
        </p>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 2px solid ${PE.accent};
          box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 2px solid ${PE.accent};
          box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: pointer;
        }
        input[type=range]::-webkit-slider-runnable-track { background: transparent; }
        input[type=range]:focus { outline: none; }
      `}</style>
    </div>
  );
}

Object.assign(window, { PorivEntry });

})();
