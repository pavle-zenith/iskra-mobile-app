/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// IgramScreen.jsx — Iskra "Igram se" craving tool. Bubble-popping; smoke disappears.

const IG = {
  bg: '#2D1F5E', frag: '#A594D4',
};

// floating bubble — glassy
function Bubble({ x, y, size, dur, delay }) {
  return (
    <div className="ig-float" style={{
      position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
      border: '1.5px solid rgba(255,255,255,0.4)',
      background: 'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0.02) 70%)',
      animation: `igFloat ${dur}s ease-in-out ${delay}s infinite`,
    }}>
      <div style={{ position: 'absolute', top: '18%', left: '20%', width: '26%', height: '26%', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', filter: 'blur(1px)' }} />
    </div>
  );
}

function IgramScreen({ onClose = () => {}, level }) {
  const TOTAL = 5 * 60;
  const [secs, setSecs] = React.useState(3 * 60 + 24);
  React.useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');

  // scattered bubbles (design coords inside 402×~760 play area)
  const bubbles = [
    { x: 36, y: 150, size: 64, dur: 7, delay: 0 },
    { x: 250, y: 130, size: 90, dur: 9, delay: 1.2 },
    { x: 150, y: 210, size: 44, dur: 6, delay: 0.5 },
    { x: 300, y: 250, size: 52, dur: 8, delay: 2 },
    { x: 70, y: 300, size: 88, dur: 10, delay: 0.8 },
    { x: 200, y: 350, size: 60, dur: 7.5, delay: 1.6 },
    { x: 320, y: 380, size: 40, dur: 6.5, delay: 0.3 },
    { x: 110, y: 430, size: 66, dur: 8.5, delay: 2.4 },
    { x: 250, y: 470, size: 48, dur: 7, delay: 1 },
    { x: 40, y: 500, size: 54, dur: 9, delay: 0.6 },
  ];

  // burst pieces for the just-popped bubble (center-right)
  const burstCx = 300, burstCy = 320;
  const fragAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const smoke = [
    { dx: -4, dy: -30, s: 10, o: 0.32, d: 0 },
    { dx: 8, dy: -42, s: 8, o: 0.26, d: 0.2 },
    { dx: -14, dy: -52, s: 12, o: 0.2, d: 0.1 },
    { dx: 16, dy: -60, s: 9, o: 0.16, d: 0.35 },
    { dx: 2, dy: -70, s: 13, o: 0.12, d: 0.25 },
    { dx: -10, dy: -80, s: 8, o: 0.1, d: 0.45 },
  ];

  return (
    <div style={{
      position: 'relative', height: '100%', overflow: 'hidden',
      background: IG.bg, fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <style>{`
        @keyframes igFloat {
          0% { transform: translate(0,0); }
          33% { transform: translate(10px,-16px); }
          66% { transform: translate(-8px,-26px); }
          100% { transform: translate(0,0); }
        }
        @keyframes igSmoke {
          0% { transform: translateY(0) scale(0.7); opacity: var(--o); }
          100% { transform: translateY(-26px) scale(1.3); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .ig-float, .ig-smoke { animation: none !important; } }
      `}</style>

      {/* center radial glow */}
      <div style={{ position: 'absolute', top: '46%', left: '50%', width: 420, height: 420, transform: 'translate(-50%,-50%)', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(107,82,168,0.32) 0%, rgba(107,82,168,0) 70%)' }} />

      {/* bubbles layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {bubbles.map((b, i) => <Bubble key={i} {...b} />)}

        {/* just-popped burst */}
        <svg width="402" height="760" viewBox="0 0 402 760" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {fragAngles.map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const r1 = 26, r2 = 40;
            const x1 = burstCx + r1 * Math.cos(rad), y1 = burstCy + r1 * Math.sin(rad);
            const x2 = burstCx + r2 * Math.cos(rad), y2 = burstCy + r2 * Math.sin(rad);
            const perp = rad + Math.PI / 2, aw = 7;
            const mx = (x1 + x2) / 2 + aw * Math.cos(perp), my = (y1 + y2) / 2 + aw * Math.sin(perp);
            return <path key={i} d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke={IG.frag} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />;
          })}
        </svg>

        {/* rising smoke from burst */}
        {smoke.map((p, i) => (
          <div key={i} className="ig-smoke" style={{
            position: 'absolute', left: burstCx + p.dx, top: burstCy + p.dy, width: p.s, height: p.s,
            borderRadius: '50%', background: '#fff', '--o': p.o,
            animation: `igSmoke 2.4s ease-out ${p.d}s infinite`,
          }} />
        ))}
      </div>

      {/* top bar */}
      <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 22px 0', position: 'relative', flexShrink: 0, zIndex: 2 }}>
        <button onClick={onClose} style={{
          position: 'absolute', left: 22, top: 52, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>IGRAM SE</span>
      </div>

      {/* score row */}
      <div style={{ textAlign: 'center', marginTop: 12, zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16h9a3 3 0 1 0-2.8-4" /><path d="M5 11h6a2.5 2.5 0 1 0-2.4-3.2" /></svg>
          23 puklo
        </div>
        <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Pusti ih sve.</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* timer */}
      <div style={{ fontSize: 28, fontWeight: 200, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, zIndex: 2 }}>{mm}:{ss}</div>

      {/* bottom skip */}
      <div style={{ flexShrink: 0, padding: '20px 0 40px', zIndex: 2 }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.35)',
          WebkitTapHighlightColor: 'transparent',
        }}>Završio/la sam</button>
      </div>
    </div>
  );
}

Object.assign(window, { IgramScreen });
})();
