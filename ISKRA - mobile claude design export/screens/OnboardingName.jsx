/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingName.jsx — Iskra onboarding, step 2/11: name input.

const ONB = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', placeholder: '#BBBBBB',
};

function OnboardingName({ onNext = () => {}, onBack = () => {} }) {
  const [name, setName] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const ready = name.trim().length > 0;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: ONB.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: ONB.text,
    }}>
      {/* progress bar */}
      <div style={{ height: 2, background: ONB.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(2 / 11) * 100}%`, height: '100%', background: ONB.accent }} />
      </div>

      {/* back arrow */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${ONB.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* content */}
      <div style={{ flex: 1, padding: '34px 26px 0', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: ONB.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Kako da te zovemo?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 16, fontWeight: 400, color: ONB.sub, lineHeight: 1.45 }}>
          Koristićemo ovo ime kroz celu aplikaciju.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Tvoje ime"
          style={{
            marginTop: 30, width: '100%', height: 56, boxSizing: 'border-box',
            borderRadius: 12, border: `1px solid ${focused ? ONB.accent : ONB.track}`,
            padding: '0 16px', fontSize: 16, fontFamily: 'inherit', color: ONB.text,
            background: '#fff', outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(232,98,26,0.10)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
        />
      </div>

      {/* primary button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          disabled={!ready}
          onClick={() => { if (ready) onNext(); }}
          onMouseDown={() => ready && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${ONB.accent} 100%)` : '#F0D6C6',
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

Object.assign(window, { OnboardingName });

})();
