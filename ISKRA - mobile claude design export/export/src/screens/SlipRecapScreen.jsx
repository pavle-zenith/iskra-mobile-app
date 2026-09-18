/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// SlipRecapScreen.jsx — Iskra achievement recap after slip "Nastavljam".

const SR = {
  bg: '#FEF6F0', accent: '#E8621A', blue: '#4A8AC4', rose: '#D4547E',
  card: '#FFFFFF', border: '#ECE9E3', text: '#1A1A1A', sub: '#999999',
};

function SlipRecapScreen({ onContinue = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: SR.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: SR.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 26px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 12 }} />
        {/* headline */}
        <div style={{ fontSize: 11, fontWeight: 700, color: SR.accent, letterSpacing: '1px' }}>TVOJE</div>
        <h1 style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 600, color: SR.text, letterSpacing: '-0.02em', lineHeight: 1.25, textWrap: 'balance' }}>
          47 dana su tvoja zauvek.
        </h1>

        {/* health milestone */}
        <div style={{ background: SR.card, border: `1px solid ${SR.border}`, borderRadius: 18, padding: 20, marginTop: 28, boxShadow: '0 4px 14px rgba(120,44,0,0.05)', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SR.blue} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v8" /><path d="M9.5 9.5c-2 0-4 2-4 6 0 2 .5 4 2.2 4 1.3 0 1.8-1.1 1.8-2.6V11c0-.85-.7-1.5-1.5-1.5Z" /><path d="M14.5 9.5c2 0 4 2 4 6 0 2-.5 4-2.2 4-1.3 0-1.8-1.1-1.8-2.6V11c0-.85.7-1.5 1.5-1.5Z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: SR.blue, letterSpacing: '0.06em' }}>ZDRAVLJE</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, color: SR.text, marginTop: 8, letterSpacing: '-0.01em' }}>Tvoja plućna funkcija je već 30% bolja.</div>
          <div style={{ fontSize: 13, fontWeight: 400, color: SR.sub, marginTop: 6 }}>Jedna cigareta to ne menja.</div>
        </div>

        {/* personal reason */}
        <div style={{ position: 'relative', overflow: 'hidden', background: SR.card, border: `1.5px solid #F3C3A6`, borderRadius: 18, padding: 20, marginTop: 12, boxShadow: '0 8px 22px rgba(232,98,26,0.16)', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SR.rose} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: SR.rose, letterSpacing: '0.06em' }}>ZAŠTO SI POČEO/LA</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, fontStyle: 'italic', color: SR.text, lineHeight: 1.5, marginTop: 14, position: 'relative', zIndex: 1 }}>Hoću da vidim decu kako odrastaju.</div>
          <div style={{ height: 1, background: '#F0E8E0', marginTop: 16, position: 'relative', zIndex: 1 }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: '#CCC', letterSpacing: '1px', marginTop: 14, position: 'relative', zIndex: 1 }}>TVOJ POTPIS</div>
          <svg width="200" height="52" viewBox="0 0 200 52" fill="none" style={{ display: 'block', marginTop: 4, marginLeft: 6, position: 'relative', zIndex: 1 }}>
            <path d="M6 34 C 14 8, 24 6, 26 28 C 27 40, 19 42, 23 30 C 29 12, 44 14, 48 34 C 51 46, 60 42, 66 28 C 74 8, 86 14, 84 36 C 96 18, 112 18, 120 32 C 128 44, 140 40, 150 24 C 158 11, 172 14, 180 30"
              stroke="#D4547E" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 44 C 80 50, 130 40, 184 46" stroke="#D4547E" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ position: 'absolute', right: 14, top: -18, fontSize: 120, lineHeight: 1, color: SR.accent, opacity: 0.1, fontFamily: 'Georgia, "Times New Roman", serif', pointerEvents: 'none' }}>”</span>
        </div>

        <div style={{ flex: 1, minHeight: 16 }} />
        {/* bridge line */}
        <div style={{ fontSize: 15, fontWeight: 400, color: SR.sub, paddingBottom: 4 }}>Dan 1 počinje upravo sad.</div>
      </div>

      {/* primary */}
      <div style={{ flexShrink: 0, padding: '12px 26px 40px' }}>
        <button
          onClick={onContinue}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${SR.accent} 100%)`, color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.26), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Nastavljam dalje
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { SlipRecapScreen });

})();
