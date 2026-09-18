/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// ProgressSheet.jsx — Iskra progress-update bottom sheet after slip "Nastavljam dalje".

const PS = {
  accent: '#E8621A', glow: '#FEF0E8', green: '#3A7A3A',
  text: '#1A1A1A', sub: '#999999',
};

function ProgressSheet({ onClose = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.3)', animation: 'psFade 0.2s ease both',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '14px 28px 40px',
        animation: 'psUp 0.28s cubic-bezier(0.2,0.9,0.3,1) both',
      }}>
        {/* drag handle */}
        <div style={{ width: 32, height: 4, borderRadius: 999, background: '#E8E8E8', margin: '0 auto 22px' }} />

        {/* icon */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: PS.glow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={PS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" />
            </svg>
          </div>
        </div>

        {/* headline */}
        <div style={{ fontSize: 20, fontWeight: 600, color: PS.text, textAlign: 'center', marginTop: 16, letterSpacing: '-0.01em' }}>
          Ažurirali smo tvoj napredak.
        </div>

        {/* rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M6 6l12 12M18 6L6 18" /></svg>
            <span style={{ fontSize: 15, fontWeight: 400, color: PS.text }}>Dnevni streak resetovan na Dan 1</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PS.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 12l5 5L20 6" /></svg>
            <span style={{ fontSize: 15, fontWeight: 400, color: PS.text }}><span style={{ fontWeight: 700, color: PS.green }}>47 dana</span> ukupno — ostaje tvoje zauvek</span>
          </div>
        </div>

        {/* support card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: '#FEF6F0', borderRadius: 14, padding: '14px 16px', marginTop: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={PS.accent} style={{ flexShrink: 0 }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 400, fontStyle: 'italic', color: '#888', lineHeight: 1.45 }}>Iskra je tu za svaki korak — uključujući i ovaj.</span>
        </div>

        {/* button */}
        <button
          onClick={onClose}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer', marginTop: 24,
            background: `linear-gradient(180deg, #F0701F 0%, ${PS.accent} 100%)`, color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.26), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Razumem
        </button>
      </div>
      <style>{`
        @keyframes psFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes psUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

Object.assign(window, { ProgressSheet });

})();
