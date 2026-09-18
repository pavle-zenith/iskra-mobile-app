/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingCost.jsx — Iskra onboarding: AHA moment, inverted ember screen.

const CST = {
  bg: '#E8621A', accent: '#E8621A',
  white: '#FFFFFF', sub: '#999999',
};

function OnboardingCost({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: CST.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: CST.white,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.3)', marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(6 / 18) * 100}%`, height: '100%', background: '#fff' }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.16)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* center block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 28px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#fff', opacity: 0.7, marginBottom: 16, whiteSpace: 'nowrap' }}>TVOJI PODACI</div>

        <div style={{ fontSize: 18, fontWeight: 400, color: '#fff', textAlign: 'center', lineHeight: 1.4, marginBottom: 22 }}>
          Godišnje trošiš na cigarete
        </div>

        {/* white card */}
        <div style={{
          width: '100%', background: CST.white, borderRadius: 24, padding: '32px 24px',
          boxShadow: '0 20px 48px rgba(120,44,0,0.3)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 80, fontWeight: 700, color: CST.accent, letterSpacing: '-0.04em', lineHeight: 0.95, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>146.000</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: CST.accent, marginTop: 8, letterSpacing: '0.02em' }}>RSD</div>
          </div>

          <div style={{ height: 1, background: '#EEECE8', margin: '22px 0 16px' }} />

          <div style={{ fontSize: 14, fontWeight: 500, color: CST.sub, textAlign: 'center' }}>= 10 dana odmora na moru</div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 500, color: '#fff', opacity: 0.92, textAlign: 'center', lineHeight: 1.45, marginTop: 26, textWrap: 'balance' }}>
          Iskra ti vraća taj novac — dan po dan.
        </div>
      </div>

      {/* button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          onClick={onNext}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: '#fff', color: CST.accent, fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(120,44,0,0.25)' : '0 8px 22px rgba(120,44,0,0.26)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Nastavi
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingCost });

})();
