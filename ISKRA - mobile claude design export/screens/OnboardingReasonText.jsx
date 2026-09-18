/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingReasonText.jsx — Iskra onboarding: personal reason free-text input.

const RTX = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', fine: '#BBBBBB',
};

const MAX = 120;
const CHIPS = ['Zbog zdravlja', 'Zbog dece', 'Zbog para', 'Zbog sebe', 'Zbog partnera'];

function OnboardingReasonText({ onNext = () => {}, onBack = () => {} }) {
  const [val, setVal] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const ready = val.trim().length > 0;

  const setChip = (c) => setVal(c.slice(0, MAX));

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: RTX.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: RTX.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: RTX.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(8 / 19) * 100}%`, height: '100%', background: RTX.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${RTX.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: RTX.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Zapiši to svojim rečima.
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: RTX.sub, lineHeight: 1.6 }}>
          Pokazaćemo ti ovo svaki put kad bude najteže.
        </p>
      </div>

      {/* text area */}
      <div style={{ padding: '24px 26px 0', flexShrink: 0 }}>
        <div style={{
          position: 'relative', background: '#fff', borderRadius: 16,
          border: `1.5px solid ${focused ? RTX.accent : RTX.track}`,
          boxShadow: focused ? '0 0 0 3px rgba(232,98,26,0.10)' : 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          padding: 20, minHeight: 160, boxSizing: 'border-box',
        }}>
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value.slice(0, MAX))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Hoću da uštedim za letovanje"
            rows={4}
            style={{
              width: '100%', border: 'none', outline: 'none', resize: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 17, fontWeight: 500, color: RTX.text, lineHeight: 1.6,
              padding: 0, boxSizing: 'border-box',
            }}
          />
          <div style={{ position: 'absolute', right: 16, bottom: 12, fontSize: 12, fontWeight: 500, color: '#CCC' }}>{val.length} / {MAX}</div>
        </div>

        {/* example chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 }}>
          {CHIPS.map((c) => (
            <button key={c} onClick={() => setChip(c)} style={{
              flexShrink: 0, background: '#F1EEE9', border: 'none', borderRadius: 20, cursor: 'pointer',
              padding: '7px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: '#888',
              whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent',
            }}>{c}</button>
          ))}
        </div>

        <p style={{ margin: '16px 0 0', fontSize: 13, fontStyle: 'italic', fontWeight: 400, color: RTX.fine, textAlign: 'center' }}>
          Samo ti ovo vidiš. Nikad ne delimo.
        </p>
      </div>

      <div style={{ flex: 1 }} />

      {/* button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          disabled={!ready}
          onClick={() => { if (ready) onNext(); }}
          onMouseDown={() => ready && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${RTX.accent} 100%)` : '#F0D6C6',
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

Object.assign(window, { OnboardingReasonText });

})();
