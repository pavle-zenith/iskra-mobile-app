/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// ReviewModal.jsx — Iskra: iOS-style "rate us" review prompt (onboarding step).

const RVM = {
  bg: '#FEF6F0', accent: '#E8621A', card: '#FFFFFF', border: '#F0E4DA',
  text: '#1A1A1A', sub: '#888888', track: '#E8E8E8',
};

function ReviewModal({ onNext = () => {}, onBack = () => {} }) {
  const [rating, setRating] = React.useState(5);
  const [pressed, setPressed] = React.useState(false);

  return (
    <div style={{
      height: '100%', position: 'relative',
      background: RVM.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: RVM.text,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* faint backdrop content hint */}
      <div style={{ flex: 1 }} />

      {/* modal card */}
      <div style={{
        position: 'absolute', top: '50%', left: 24, right: 24, transform: 'translateY(-50%)',
        background: RVM.card, borderRadius: 24, padding: '30px 26px 26px',
        boxShadow: '0 24px 60px rgba(120,44,0,0.18)', textAlign: 'center',
      }}>
        {/* app glyph */}
        <div style={{
          width: 64, height: 64, borderRadius: 17, margin: '0 auto 18px',
          background: `linear-gradient(180deg, #F0701F 0%, ${RVM.accent} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 18px rgba(232,98,26,0.32)',
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
          </svg>
        </div>

        <h1 style={{ margin: 0, fontSize: 21, fontWeight: 600, color: RVM.text, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          Uživaš u aplikaciji Iskra?
        </h1>
        <p style={{ margin: '10px 0 0', fontSize: 14.5, fontWeight: 400, color: RVM.sub, lineHeight: 1.5 }}>
          Tvoja ocena pomaže drugima u Srbiji da krenu istim putem.
        </p>

        {/* stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              WebkitTapHighlightColor: 'transparent', lineHeight: 0,
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill={n <= rating ? RVM.accent : '#EDE7E0'}
                style={{ transition: 'fill 0.12s ease' }}>
                <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17l-6 3.4 1.4-6.8L2.3 9l6.9-.7L12 2Z" />
              </svg>
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 54, borderRadius: 15, border: 'none', cursor: 'pointer', marginTop: 26,
            background: `linear-gradient(180deg, #F0701F 0%, ${RVM.accent} 100%)`,
            color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.28)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Oceni Iskru
        </button>
        <button onClick={onNext} style={{
          marginTop: 14, background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, color: RVM.sub,
          WebkitTapHighlightColor: 'transparent',
        }}>Ne sada</button>
      </div>

      <div style={{ flex: 1 }} />
    </div>
  );
}

Object.assign(window, { ReviewModal });

})();
