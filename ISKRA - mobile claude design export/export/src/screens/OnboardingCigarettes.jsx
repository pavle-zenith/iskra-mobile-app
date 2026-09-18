/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingCigarettes.jsx — Iskra onboarding: cigarettes per day stepper.

const CIG = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', fine: '#BBBBBB',
};

function OnboardingCigarettes({ onNext = () => {}, onBack = () => {} }) {
  const [count, setCount] = React.useState(20);
  const [perPack, setPerPack] = React.useState(20);
  const [ppFocused, setPpFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const dec = () => setCount((c) => Math.max(1, c - 1));
  const inc = () => setCount((c) => Math.min(80, c + 1));

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: CIG.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: CIG.text,
    }}>
      {/* progress bar */}
      <div style={{ height: 2, background: CIG.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(3 / 17) * 100}%`, height: '100%', background: CIG.accent }} />
      </div>

      {/* back arrow */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${CIG.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: CIG.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Koliko cigareta dnevno si pušio/la?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: CIG.sub, lineHeight: 1.45 }}>
          Koristimo ovo da izračunamo tvoje uštedine.
        </p>
      </div>

      {/* stepper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          {/* minus */}
          <button onClick={dec} style={{
            width: 52, height: 52, borderRadius: '50%', background: '#fff',
            border: `1px solid ${CIG.track}`, cursor: count > 1 ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: count > 1 ? 1 : 0.45, WebkitTapHighlightColor: 'transparent',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A968F" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>

          {/* number */}
          <div style={{ minWidth: 86, textAlign: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 600, color: CIG.text, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: CIG.sub, marginTop: 8 }}>cigareta dnevno</div>
          </div>

          {/* plus */}
          <button onClick={inc} style={{
            width: 52, height: 52, borderRadius: '50%', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${CIG.accent} 100%)`,
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 5px 14px rgba(232,98,26,0.3)', WebkitTapHighlightColor: 'transparent',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div style={{ fontSize: 13, fontWeight: 400, color: CIG.fine, marginTop: 40, textAlign: 'center' }}>
          Prosek u Srbiji je oko 15 cigareta dnevno.
        </div>

        {/* divider + cigarettes-per-pack input */}
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '0 26px', marginTop: 32 }}>
          <div style={{ height: 1, background: '#EEEEEE' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: CIG.text, whiteSpace: 'nowrap' }}>Cigara u pakli</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: CIG.sub, marginTop: 2 }}>Najčešće 20</div>
            </div>
            <input
              value={perPack}
              onChange={(e) => setPerPack(e.target.value.replace(/\D/g, '').slice(0, 2))}
              onFocus={() => setPpFocused(true)}
              onBlur={() => setPpFocused(false)}
              inputMode="numeric"
              placeholder="20"
              style={{
                width: 84, height: 52, textAlign: 'center', boxSizing: 'border-box',
                borderRadius: 12, border: `1.5px solid ${ppFocused ? CIG.accent : CIG.track}`,
                background: '#fff', color: CIG.text, fontSize: 24, fontWeight: 600, fontFamily: 'inherit',
                outline: 'none', WebkitTapHighlightColor: 'transparent',
                transition: 'border-color 0.15s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* primary button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          onClick={onNext}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${CIG.accent} 100%)`,
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Nastavi
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingCigarettes });

})();
