/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// SplashScreen.jsx — Iskra welcome / splash. Minimal, typographic, warm.

const SPL = {
  bg: '#F7F6F3', accent: '#E8621A', accentDeep: '#C9530F',
  text: '#1A1A1A', sub: '#999999',
};

function SplashScreen({ onStart = () => {}, onLogin = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: SPL.bg, fontFamily: '"Manrope", system-ui, sans-serif',
      color: SPL.text, padding: '58px 30px 42px', boxSizing: 'border-box',
    }}>
      {/* brand mark — top third */}
      <div style={{ marginTop: 78, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          fontSize: 30, fontWeight: 500, letterSpacing: '4px',
          color: SPL.text, paddingLeft: 4,
        }}>ISKRA</div>
        <div style={{ width: 30, height: 2, borderRadius: 2, background: SPL.accent, marginTop: 18 }} />
      </div>

      {/* tagline — center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{
          margin: 0, textAlign: 'center', fontSize: 22, fontWeight: 600,
          lineHeight: 1.55, color: SPL.text, letterSpacing: '-0.01em', textWrap: 'balance',
        }}>
          Znaš da treba.<br />
          Iskra ti pomaže da konačno i hoćeš.
        </p>
      </div>

      {/* actions — bottom third */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} onClick={onStart}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${SPL.accent} 100%)`,
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.3), 0 2px 5px rgba(232,98,26,0.22)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Počni
        </button>
        <button style={{
          marginTop: 20, background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 14.5, fontWeight: 500, color: SPL.sub,
          WebkitTapHighlightColor: 'transparent',
        }} onClick={onLogin}>Već imam nalog</button>
      </div>
    </div>
  );
}

Object.assign(window, { SplashScreen });

})();
