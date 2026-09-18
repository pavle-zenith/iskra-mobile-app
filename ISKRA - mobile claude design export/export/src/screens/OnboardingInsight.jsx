/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingInsight.jsx — Iskra onboarding, step 3/11: encouragement interstitial.

const INS = {
  bg: '#FEF6F0', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#888888', fine: '#BBBBBB',
};

function OnboardingInsight({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: INS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: INS.text,
    }}>
      {/* progress bar */}
      <div style={{ height: 2, background: INS.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(3 / 11) * 100}%`, height: '100%', background: INS.accent }} />
      </div>

      {/* back arrow */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(232,98,26,0.12)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B79E92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* center insight block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 30px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: INS.accent, letterSpacing: '2px', marginBottom: 20, whiteSpace: 'nowrap' }}>ZNAJ OVO</div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, color: INS.text, textAlign: 'center', lineHeight: 1.32, letterSpacing: '-0.02em', textWrap: 'balance' }}>
          Svaka osoba koja je prestala je jednom počela.
        </h1>
        <p style={{ margin: '22px 0 0', fontSize: 16, fontWeight: 400, color: INS.sub, textAlign: 'center', lineHeight: 1.5, textWrap: 'balance' }}>
          Nije važno koliko si puta pokušao/la. Važno je da si ovde.
        </p>
      </div>

      {/* fine print citation */}
      <div style={{ flexShrink: 0, padding: '0 34px 22px' }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: INS.fine, textAlign: 'center', lineHeight: 1.5 }}>
          Istraživanja pokazuju da prosečna osoba pokuša 8–10 puta pre nego što trajno prestane.<sup style={{ fontSize: 9 }}>1</sup>
          <br />
          <span style={{ fontStyle: 'italic' }}>Hughes et al., Tobacco Control Journal</span>
        </p>
      </div>

      {/* primary button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} onClick={onNext}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${INS.accent} 100%)`,
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Razumem
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingInsight });

})();
