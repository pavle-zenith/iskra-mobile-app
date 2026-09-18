/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// SlipScreen.jsx — Iskra non-judgmental slip response (warm, calm, safe).

const SL = {
  bg: '#FEF6F0', accent: '#E8621A', glow: '#FEF0E8', amber: '#BA7517',
  card: '#FFFFFF', border: '#ECE9E3', text: '#1A1A1A', sub: '#888888', muted: '#999999',
};

function SlipScreen({ onContinue = () => {}, onReflect = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: SL.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: SL.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 30px' }}>
        {/* illustration */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: SL.glow }} />
            <svg width="46" height="46" viewBox="0 0 24 24" fill={SL.accent} style={{ position: 'relative' }}>
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
            </svg>
          </div>
        </div>

        {/* headline */}
        <h1 style={{ margin: '24px 0 0', fontSize: 28, fontWeight: 600, color: SL.text, textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.25, textWrap: 'balance' }}>
          Jedan dan ne definiše put.
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 16, fontWeight: 400, color: SL.sub, textAlign: 'center', lineHeight: 1.6, textWrap: 'balance' }}>
          Svako ko je prestao je imao ovaj dan. Ti si i dalje ovde — to je važno.
        </p>

        {/* divider */}
        <div style={{ height: 1, background: '#E8E8E8', margin: '28px 0' }} />

        {/* total timer card */}
        <div style={{ background: SL.card, border: `1px solid ${SL.border}`, borderRadius: 16, padding: '16px 20px', boxShadow: '0 4px 14px rgba(120,44,0,0.05)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: SL.amber, letterSpacing: '1px' }}>47 DANA IZA TEBE.</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: SL.text, marginTop: 8, letterSpacing: '-0.01em' }}>47 dana · 6 sati · 19 minuta</div>
          <div style={{ fontSize: 12, fontWeight: 400, color: SL.muted, marginTop: 8 }}>I dalje brojiš. Ne resetuje se.</div>
        </div>

        {/* primary */}
        <button
          onClick={onContinue}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer', marginTop: 28,
            background: `linear-gradient(180deg, #F0701F 0%, ${SL.accent} 100%)`, color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.26), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Nastavljam
        </button>

        {/* secondary */}
        <button onClick={onReflect} style={{
          width: '100%', height: 56, borderRadius: 16, background: 'transparent', border: `1.5px solid ${SL.border}`, cursor: 'pointer',
          marginTop: 12, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: SL.muted,
          WebkitTapHighlightColor: 'transparent',
        }}>Šta me je nateralo?</button>
      </div>
    </div>
  );
}

Object.assign(window, { SlipScreen });

})();
