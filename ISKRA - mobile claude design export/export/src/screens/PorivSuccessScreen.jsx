/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// PorivSuccessScreen.jsx — shown after completing any craving tool. Calm celebration.

const PSU = {
  bg: '#F7F6F3', accent: '#E8621A', glow: '#FEF0E8',
  card: '#FFFFFF', border: '#ECE9E3', text: '#1A1A1A', sub: '#888888', muted: '#999999', body: '#555555',
  purple: '#6B52A8', purpleChip: '#F0EDF8',
};

function PorivSuccessScreen({ onHome = () => {}, count = 2 }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, #F0701F 0%, ${PSU.accent} 100%)`, fontFamily: '"Manrope", system-ui, sans-serif',
    }}>
      <style>{`
        @keyframes psuFlame { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes psuGlow { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { .psu-flame, .psu-glow { animation: none !important; } }
      `}</style>

      {/* scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ flex: 1, minHeight: 64 }} />

        {/* illustration */}
        <div style={{ width: 148, height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div className="psu-glow" style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', opacity: 0.9, animation: 'psuGlow 3.2s ease-in-out infinite' }} />
          <div className="psu-glow" style={{ position: 'absolute', width: 76, height: 76, borderRadius: '50%', background: 'rgba(255,255,255,0.28)', opacity: 0.7, animation: 'psuGlow 3.2s ease-in-out infinite', animationDelay: '0.4s' }} />
          <svg className="psu-flame" width="64" height="64" viewBox="0 0 24 24" fill="#fff" style={{ position: 'relative', animation: 'psuFlame 2.6s ease-in-out infinite', transformOrigin: 'center bottom' }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
          </svg>
        </div>

        {/* thin line */}
        <div style={{ width: 40, height: 2, borderRadius: 2, background: '#fff', opacity: 0.5, marginTop: 6 }} />

        {/* headline */}
        <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginTop: 32, textAlign: 'center' }}>Izdržao/la si.</div>

        {/* subtext */}
        <div style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, marginTop: 16, textAlign: 'center' }}>
          Poriv traje 3–5 minuta.<br />Tvoj je upravo prošao.
        </div>

        {/* micro stat card */}
        <div style={{
          width: '100%', boxSizing: 'border-box', background: PSU.card, border: 'none',
          borderRadius: 16, padding: '16px 20px', marginTop: 32, display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 10px 26px rgba(120,40,0,0.16)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={PSU.accent} style={{ flexShrink: 0 }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 400, color: PSU.muted }}>Danas si odoleo/la već</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: PSU.accent, marginTop: 1 }}>{count} puta</div>
          </div>
        </div>

        {/* fact card */}
        <div style={{
          width: '100%', boxSizing: 'border-box', background: PSU.card, border: 'none',
          borderRadius: 16, padding: '16px 20px', marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 13,
          boxShadow: '0 10px 26px rgba(120,40,0,0.16)',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: PSU.purpleChip, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PSU.purple} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A2.5 2.5 0 0 0 9 18a2.5 2.5 0 0 0 3 .5 2.5 2.5 0 0 0 3-.5 2.5 2.5 0 0 0 1.5-4.4A3 3 0 0 0 15 8a3 3 0 0 0-3-3Z" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: PSU.body, lineHeight: 1.5, paddingTop: 4 }}>
            Svaki put kad odolevaš, mozak uči da porivi prolaze.
          </div>
        </div>

        {/* milestone card */}
        <div style={{
          width: '100%', boxSizing: 'border-box', background: PSU.card, border: 'none',
          borderRadius: 16, padding: '16px 20px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 13,
          boxShadow: '0 10px 26px rgba(120,40,0,0.16)',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FEF3E2', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4" /><path d="M17 6h2.5a2.5 2.5 0 0 1-2.5 4" /><path d="M10 14.5V18" /><path d="M14 14.5V18" /><path d="M8 20h8" /><path d="M9 18h6" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 400, color: PSU.muted }}>Do sledećeg milestonea</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: PSU.text, marginTop: 1 }}>Dan 50 — još 2 dana</div>
          </div>
        </div>

        <div style={{ flex: 1.4, minHeight: 28 }} />
      </div>

      {/* fixed bottom button */}
      <div style={{ flexShrink: 0, padding: '12px 26px 38px' }}>
        <button
          onClick={onHome}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: '#fff', color: PSU.accent,
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(120,40,0,0.2)' : '0 8px 20px rgba(120,40,0,0.18)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            WebkitTapHighlightColor: 'transparent',
          }}>
          Nazad na početnu
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PorivSuccessScreen });
})();
