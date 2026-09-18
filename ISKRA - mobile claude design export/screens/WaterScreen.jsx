/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// WaterScreen.jsx — Iskra "Pijem vodu" craving tool. Immersive water-rising takeover.
// Two-layer technique: a blue base layer + a clipped white clone inside the rising
// water, so any text below the waterline reads white-on-blue and above reads blue-on-white.

const WS = {
  blue: '#2D6FA8',
  white: '#FFFFFF',
};

// ── shared content, rendered identically in both layers (color-driven) ──
function WaterContent({ color, mm, ss }) {
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: '"Manrope", system-ui, sans-serif' }}>
      {/* glass illustration */}
      <div style={{ position: 'absolute', top: 196, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <svg width="62" height="84" viewBox="0 0 62 84" fill="none">
          {/* water inside glass — 60% full */}
          <defs>
            <clipPath id="ws-glass-clip">
              <path d="M9 4 L53 4 L48 78 Q47.5 80 45 80 L17 80 Q14.5 80 14 78 Z" />
            </clipPath>
          </defs>
          <rect x="9" y="34" width="44" height="50" fill={color} opacity="0.22" clipPath="url(#ws-glass-clip)" />
          <path d="M9 34 Q20 31 31 34 Q42 37 53 34" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" clipPath="url(#ws-glass-clip)" />
          {/* glass outline */}
          <path d="M9 4 L53 4 L48 78 Q47.5 80 45 80 L17 80 Q14.5 80 14 78 Z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        </svg>
      </div>

      {/* instruction — above the waterline (reads blue on white) */}
      <div style={{ position: 'absolute', top: 388, left: 0, right: 0, textAlign: 'center', padding: '0 36px' }}>
        <div style={{ fontSize: 18, fontWeight: 400, color, opacity: 0.82 }}>Popij čašu. Polako.</div>
      </div>

      {/* main affirmation — below the waterline (reads white on blue) */}
      <div style={{ position: 'absolute', top: 462, left: 0, right: 0, textAlign: 'center', padding: '0 36px' }}>
        <div style={{ fontSize: 23, fontWeight: 500, color, lineHeight: 1.34 }}>Telo traži vodu,</div>
        <div style={{ fontSize: 23, fontWeight: 600, color, lineHeight: 1.34 }}>ne cigaretu.</div>
      </div>

      {/* timer */}
      <div style={{ position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 34, fontWeight: 300, color, letterSpacing: 1 }}>{mm}:{ss}</div>
      </div>
    </div>
  );
}

function WaterScreen({ onClose = () => {}, level }) {
  const TOTAL = 45;
  const [secs, setSecs] = React.useState(TOTAL);
  const [pressed, setPressed] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: WS.white, fontFamily: '"Manrope", system-ui, sans-serif' }}>
      <style>{`
        @keyframes wsDrift { from { transform: translateX(0); } to { transform: translateX(-402px); } }
        @keyframes wsRise { from { height: 0%; } to { height: 100%; } }
        @media (prefers-reduced-motion: reduce) {
          .ws-wave { animation: none !important; }
          .ws-water { animation: none !important; height: 50% !important; }
        }
      `}</style>

      {/* ── BASE LAYER: everything in blue, on white ── */}
      <WaterContent color={WS.blue} mm={mm} ss={ss} />

      {/* ── WATER LAYER: blue fill rising bottom → top over the full timer; white clone clipped inside ── */}
      <div className="ws-water" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%',
        background: WS.blue, overflow: 'hidden', pointerEvents: 'none',
        animation: `wsRise ${TOTAL}s linear forwards`,
      }}>
        {/* wave crest sitting just above the water rectangle */}
        <svg className="ws-wave" width="804" height="26" viewBox="0 0 804 26" preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'translateY(-99%)', animation: 'wsDrift 7s linear infinite' }}>
          <path d="M0 14 Q100.5 4 201 14 T402 14 T603 14 T804 14 L804 26 L0 26 Z" fill={WS.blue} />
          <path d="M0 14 Q100.5 4 201 14 T402 14 T603 14 T804 14" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="3" fill="none" />
        </svg>
        {/* clone of content, full-screen height, anchored to the screen bottom so it lines up exactly */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 402, height: 874 }}>
          <WaterContent color={WS.white} mm={mm} ss={ss} />
        </div>
      </div>

      {/* ── X button (top-left, always interactive) ── */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 56, left: 22, width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={WS.blue} strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      {/* ── bottom action (over blue zone) ── */}
      <button onClick={onClose}
        onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
        style={{
          position: 'absolute', bottom: 46, left: 0, right: 0, margin: '0 auto', width: 'fit-content',
          background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 5,
          color: WS.white, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
          padding: '12px 28px', borderRadius: 14, opacity: pressed ? 0.6 : 1,
          WebkitTapHighlightColor: 'transparent', transition: 'opacity 0.12s ease',
        }}>
        Završio/la sam
      </button>
    </div>
  );
}

Object.assign(window, { WaterScreen });
})();
