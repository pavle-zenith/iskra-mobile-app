/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// BreathingScreen.jsx — Iskra "Dišem" craving tool. The only dark screen in the app.
// Real 4-4-4 breathing cycle, 4 rounds; peak-inhale visuals are the base style.

const BR = {
  bg: '#1A1714', accent: '#E8621A', amber: '#F0A500',
};

const PHASES = [
  { label: 'Udahni', d: 4, s: 1 },     // inhale — grow
  { label: 'Zadrži', d: 4, s: 1 },     // hold — stay expanded
  { label: 'Izdahni', d: 4, s: 0.62 }, // exhale — shrink
];
const ROUNDS = 4;

function BreathingScreen({ onClose = () => {}, onDone }) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [mounted, setMounted] = React.useState(false);
  const phaseRef = React.useRef(0);
  const countRef = React.useRef(PHASES[0].d);
  const roundRef = React.useRef(0);
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    const startT = setTimeout(() => setMounted(true), 40);
    const t = setInterval(() => {
      if (doneRef.current) return;
      if (countRef.current > 1) {
        countRef.current -= 1;
      } else {
        const next = (phaseRef.current + 1) % PHASES.length;
        if (next === 0) {
          if (roundRef.current >= ROUNDS - 1) {
            doneRef.current = true;
            if (onDone) onDone();
          } else {
            roundRef.current += 1;
          }
        }
        phaseRef.current = next;
        countRef.current = PHASES[next].d;
      }
      force();
    }, 1000);
    return () => { clearInterval(t); clearTimeout(startT); };
  }, []);

  const phase = PHASES[phaseRef.current];
  const scale = mounted ? phase.s : 0.62;
  const trans = mounted ? `transform ${phase.d}s ease-in-out` : 'none';

  return (
    <div style={{
      position: 'relative', height: '100%', overflow: 'hidden',
      background: BR.bg, fontFamily: '"Manrope", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* faint warm radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 300, height: 300,
        transform: 'translate(-50%, -50%)', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(232,98,26,0.12) 0%, rgba(232,98,26,0) 70%)',
      }} />

      {/* top bar */}
      <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 22px 0', position: 'relative', flexShrink: 0 }}>
        <button onClick={onClose} style={{
          position: 'absolute', left: 22, top: 52, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.6)' }}>DIŠEM</span>
      </div>

      {/* center circle */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div style={{
          width: 290, height: 290, borderRadius: '50%',
          background: `radial-gradient(circle at 50% 45%, ${BR.amber} 0%, ${BR.accent} 70%)`,
          boxShadow: '0 0 60px rgba(232,98,26,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${scale})`, transition: trans,
        }}>
          {/* inner ring */}
          <div style={{ position: 'absolute', width: 262, height: 262, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
          {/* label + count */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{phase.label.toUpperCase()}</div>
            <div style={{ fontSize: 64, fontWeight: 300, color: '#fff', lineHeight: 1 }}>{countRef.current}</div>
          </div>
        </div>
      </div>

      {/* bottom: dots + meta + skip */}
      <div style={{ flexShrink: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          {Array.from({ length: ROUNDS }).map((_, i) => {
            const on = i === roundRef.current;
            return <div key={i} style={{ width: on ? 8 : 6, height: on ? 8 : 6, borderRadius: '50%', background: `rgba(255,255,255,${on ? 0.9 : 0.25})` }} />;
          })}
        </div>
        <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>4 runde · ~60 sekundi</div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginTop: 28,
          WebkitTapHighlightColor: 'transparent',
        }}>Završio/la sam</button>
      </div>
    </div>
  );
}

Object.assign(window, { BreathingScreen });
})();
