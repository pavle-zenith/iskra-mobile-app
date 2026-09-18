/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// PosmatramScreen.jsx — Iskra "Posmatram" craving tool (ACT urge-surfing). Deep indigo, still.

const PM = {
  bg: '#1C1B35', wave: '#6B7FD4',
};

function PosmatramScreen({ onClose = () => {}, level }) {
  const TOTAL = 5 * 60;
  const [secs, setSecs] = React.useState(4 * 60 + 12);
  React.useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');

  const wavePath = 'M0 40 Q 100 8 201 40 T 402 40 T 603 40 T 804 40';

  return (
    <div style={{
      position: 'relative', height: '100%', overflow: 'hidden',
      background: PM.bg, fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <style>{`
        @keyframes pmDrift { from { transform: translateX(0); } to { transform: translateX(-402px); } }
        @keyframes pmDriftR { from { transform: translateX(-402px); } to { transform: translateX(0); } }
        @keyframes pmBob { 0%,100% { transform: translateY(-4px); } 50% { transform: translateY(4px); } }
        @media (prefers-reduced-motion: reduce) { .pm-wave, .pm-bob { animation: none !important; } }
      `}</style>

      {/* top bar */}
      <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 22px 0', position: 'relative', flexShrink: 0 }}>
        <button onClick={onClose} style={{
          position: 'absolute', left: 22, top: 52, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>POSMATRAM</span>
      </div>

      {/* center block */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 32px' }}>
        {/* guiding text above wave */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 300, color: '#fff' }}>Posmatraj poriv.</div>
          <div style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>Ne boriš se. Samo gledaš.</div>
        </div>

        {/* wave element */}
        <div className="pm-bob" style={{ position: 'relative', width: '100%', height: 120, margin: '38px 0 8px', animation: 'pmBob 7s ease-in-out infinite' }}>
          <svg width="804" height="80" viewBox="0 0 804 80" preserveAspectRatio="none"
            className="pm-wave"
            style={{ position: 'absolute', top: 0, left: 0, width: 804, height: 80, opacity: 0.4, filter: 'blur(2px)', animation: 'pmDrift 9s linear infinite' }}>
            <path d={wavePath} stroke={PM.wave} strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
          {/* mirrored reflection */}
          <svg width="804" height="80" viewBox="0 0 804 80" preserveAspectRatio="none"
            className="pm-wave"
            style={{ position: 'absolute', top: 44, left: 0, width: 804, height: 80, opacity: 0.2, filter: 'blur(2px)', transform: 'scaleY(-1)', animation: 'pmDriftR 11s linear infinite' }}>
            <path d={wavePath} stroke={PM.wave} strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* italic body below wave */}
        <div style={{ textAlign: 'center', fontSize: 15, fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginTop: 32 }}>
          Poriv je kao talas.<br />Dolazi. I prolazi.<br />Ti si obala.
        </div>

        {/* timer */}
        <div style={{ fontSize: 28, fontWeight: 200, color: 'rgba(255,255,255,0.5)', marginTop: 40, letterSpacing: 1 }}>{mm}:{ss}</div>
      </div>

      {/* bottom skip */}
      <div style={{ flexShrink: 0, paddingBottom: 40 }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.35)',
          WebkitTapHighlightColor: 'transparent',
        }}>Završio/la sam</button>
      </div>
    </div>
  );
}

Object.assign(window, { PosmatramScreen });
})();
