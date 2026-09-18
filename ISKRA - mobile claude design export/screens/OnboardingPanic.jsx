/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingPanic.jsx — Iskra onboarding: panic button demo (climax).

const PNC = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#888888', fine: '#BBBBBB',
};

function OnboardingPanic({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: PNC.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: PNC.text,
    }}>
      <style>{`
        @keyframes iskraPulse {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes iskraBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }
      `}</style>

      {/* progress */}
      <div style={{ height: 2, background: PNC.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(14 / 18) * 100}%`, height: '100%', background: PNC.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${PNC.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* top copy */}
      <div style={{ padding: '30px 26px 0', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: PNC.accent, letterSpacing: '2px', marginBottom: 12 }}>PROBA</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: PNC.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Hajde da vežbamo jedan trenutak.
        </h1>
        <p style={{ margin: '14px 0 0', fontSize: 15, fontWeight: 400, color: PNC.sub, lineHeight: 1.6 }}>
          Zatvori oči. Zamisli da ti se sada puši. Oseti taj osećaj. Kad budeš spreman/na — pritisni.
        </p>
      </div>

      {/* panic button */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* pulse rings */}
          <span style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: `2px solid ${PNC.accent}`, animation: 'iskraPulse 2.4s ease-out infinite' }} />
          <span style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: `2px solid ${PNC.accent}`, animation: 'iskraPulse 2.4s ease-out infinite', animationDelay: '1.2s' }} />
          {/* dashed ring */}
          <div style={{ position: 'absolute', width: 188, height: 188, borderRadius: '50%', border: `1.5px dashed rgba(232,98,26,0.3)` }} />
          {/* button */}
          <button
            onClick={onNext}
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
            style={{
              width: 160, height: 160, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: `radial-gradient(circle at 50% 35%, #F0701F, ${PNC.accent})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: pressed ? '0 6px 18px rgba(232,98,26,0.42)' : '0 16px 44px rgba(232,98,26,0.42), 0 4px 12px rgba(232,98,26,0.3)',
              transform: pressed ? 'scale(0.95)' : 'scale(1)',
              animation: pressed ? 'none' : 'iskraBreathe 3.4s ease-in-out infinite',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease',
              WebkitTapHighlightColor: 'transparent', position: 'relative', zIndex: 1,
            }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#fff">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </button>
        </div>

        <div style={{ fontSize: 16, fontWeight: 500, color: PNC.accent, marginTop: 30, whiteSpace: 'nowrap' }}>Imam poriv</div>
      </div>

      {/* bottom note */}
      <div style={{ flexShrink: 0, padding: '0 40px 46px' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 400, color: PNC.fine, textAlign: 'center', lineHeight: 1.5 }}>
          Svaki poriv traje 3 do 5 minuta. Iskra će te provesti kroz njega.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingPanic });

})();
