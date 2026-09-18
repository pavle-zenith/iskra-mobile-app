/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// SetamScreen.jsx — Iskra "Šetam" craving tool. Forest green, get up and walk.

const ST = {
  bg: '#1A3A20',
};

function SetamScreen({ onClose = () => {}, level }) {
  const TOTAL = 5 * 60;
  const [secs, setSecs] = React.useState(TOTAL);
  React.useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');

  // trail dots sitting exactly on the curve
  const trail = 'M-10 60 Q 100 18 200 60 T 412 60';
  const dots = [ [44, 44], [98, 39], [149, 44], [251, 76], [303, 81], [357, 76] ];

  return (
    <div style={{
      position: 'relative', height: '100%', overflow: 'hidden',
      background: ST.bg, fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <style>{`
        @keyframes stPulse { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
        @media (prefers-reduced-motion: reduce) { .st-dot { animation: none !important; opacity: 0.6 !important; } }
      `}</style>

      {/* faint diagonal texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 12px)',
      }} />

      {/* top bar */}
      <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 22px 0', position: 'relative', flexShrink: 0, zIndex: 1 }}>
        <button onClick={onClose} style={{
          position: 'absolute', left: 22, top: 52, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>ŠETAM</span>
      </div>

      {/* center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        {/* headline */}
        <div style={{ fontSize: 32, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', textAlign: 'center' }}>Izađi napolje.</div>

        {/* trail */}
        <div style={{ position: 'relative', width: '100%', height: 110, margin: '30px 0 4px' }}>
          <svg width="100%" height="110" viewBox="0 0 402 110" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <path d={trail} stroke="#fff" strokeOpacity="0.25" strokeWidth="2.5" fill="none" strokeDasharray="2 10" strokeLinecap="round" />
          </svg>
          <svg width="100%" height="110" viewBox="0 0 402 110" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            {dots.map(([x, y], i) => (
              <circle key={i} className="st-dot" cx={x} cy={y} r="3.4" fill="#A8E6B0"
                style={{ animation: `stPulse 2.4s ease-in-out infinite`, animationDelay: `${i * 0.32}s`, transformOrigin: `${x}px ${y}px` }} />
            ))}
          </svg>
        </div>

        {/* body */}
        <div style={{ textAlign: 'center', fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 20 }}>
          Svaki korak je korak<br />dalje od cigarete.
        </div>

        {/* step counter pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '8px 16px', marginTop: 32, whiteSpace: 'nowrap' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13" cy="4" r="1.6" /><path d="M11 8l-2 4 3 2 1 6" /><path d="M9 12l-3 1-1 4" /><path d="M14 14l4 1" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>0 koraka</span>
        </div>

        {/* timer */}
        <div style={{ fontSize: 28, fontWeight: 200, color: 'rgba(255,255,255,0.5)', marginTop: 16, letterSpacing: 1 }}>{mm}:{ss}</div>
      </div>

      {/* bottom */}
      <div style={{ flexShrink: 0, paddingBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Ostavi telefon. Telo zna šta mu treba.</div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)',
          WebkitTapHighlightColor: 'transparent',
        }}>Završio/la sam</button>
      </div>
    </div>
  );
}

Object.assign(window, { SetamScreen });
})();
