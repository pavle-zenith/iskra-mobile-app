/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// RazloziScreen.jsx — Iskra "Moji razlozi" craving tool. Warm, quiet, personal.

const RZ = {
  bg: '#FFFFFF', accent: '#E8621A', quoteBg: '#FEF6F0',
  card: '#FFFFFF', border: '#EEEEEE', divider: '#EDEAE5', text: '#1A1A1A', muted: '#999999',
};

const REASONS = [
  { label: 'Zdravlje', chip: '#FFF0F4', color: '#D4547E', icon: 'heart' },
  { label: 'Porodica', chip: '#EDF2F8', color: '#4A6080', icon: 'people' },
  { label: 'Sloboda', chip: '#F0EDF8', color: '#6B52A8', icon: 'bird' },
];

function RzIcon({ kind, color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'people' ? (<g><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></g>)
        : kind === 'bird' ? (<path d="M4 13 Q 8 7 12 13 Q 16 7 20 13" />)
        : (<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />)}
    </svg>
  );
}

function RazloziScreen({ onClose = () => {}, onStay = () => {}, name = 'Pavle', reason = 'Hoću da vidim decu kako odrastaju.' }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: RZ.bg, fontFamily: '"Manrope", system-ui, sans-serif',
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 22px 0', position: 'relative', flexShrink: 0 }}>
        <button onClick={onClose} style={{
          position: 'absolute', left: 22, top: 52, width: 36, height: 36, borderRadius: '50%',
          background: '#EEEBE6', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: RZ.accent }}>MOJI RAZLOZI</span>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 26px' }}>
        {/* personal note */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, fontWeight: 400, color: RZ.muted, lineHeight: 1.5 }}>
          {name}, ovo si napisao/la<br />kad si bio/la spreman/na.
        </div>

        {/* quote card */}
        <div style={{ position: 'relative', background: RZ.quoteBg, borderRadius: 20, padding: 32, marginTop: 20, border: '1.5px solid rgba(232,98,26,0.3)' }}>
          <div style={{ position: 'absolute', top: 8, left: 20, fontSize: 56, fontWeight: 700, color: RZ.accent, opacity: 0.25, lineHeight: 1, fontFamily: 'Georgia, serif' }}>“</div>
          <div style={{ fontSize: 26, fontWeight: 600, fontStyle: 'italic', color: RZ.text, lineHeight: 1.45, textAlign: 'center', padding: '22px 4px 6px' }}>{reason}</div>
          <div style={{ position: 'absolute', bottom: 4, right: 20, fontSize: 56, fontWeight: 700, color: RZ.accent, opacity: 0.25, lineHeight: 1, fontFamily: 'Georgia, serif' }}>”</div>
          {/* signature */}
          <div style={{ height: 1, background: '#F0E8E0', marginTop: 20 }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: '#CCC', letterSpacing: '1px', marginTop: 14 }}>TVOJ POTPIS</div>
          <svg width="200" height="48" viewBox="0 0 200 52" fill="none" style={{ display: 'block', marginTop: 2, marginLeft: 4 }}>
            <path d="M6 34 C 14 8, 24 6, 26 28 C 27 40, 19 42, 23 30 C 29 12, 44 14, 48 34 C 51 46, 60 42, 66 28 C 74 8, 86 14, 84 36 C 96 18, 112 18, 120 32 C 128 44, 140 40, 150 24 C 158 11, 172 14, 180 30"
              stroke="#D4547E" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 44 C 80 50, 130 40, 184 46" stroke="#D4547E" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: RZ.divider, margin: '24px 0' }} />

        {/* reason rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REASONS.map((r) => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', gap: 13,
              background: RZ.card, border: `1px solid ${RZ.border}`, borderRadius: 12, padding: '14px 16px',
            }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: r.chip, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RzIcon kind={r.icon} color={r.color} />
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: RZ.text }}>{r.label}</span>
            </div>
          ))}
        </div>

        {/* day fact card */}
        <div style={{ background: RZ.card, border: `1px solid ${RZ.border}`, borderLeft: `3px solid ${RZ.accent}`, borderRadius: 16, padding: '16px 20px', marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: RZ.accent, letterSpacing: '1px' }}>DAN 47</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: RZ.text, marginTop: 6, lineHeight: 1.4 }}>Tvoja plućna funkcija je već 30% bolja.</div>
          <div style={{ fontSize: 13, fontWeight: 400, color: RZ.muted, marginTop: 3 }}>Jedna cigareta to ne menja.</div>
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* fixed bottom button */}
      <div style={{ flexShrink: 0, padding: '12px 26px 38px' }}>
        <button
          onClick={onStay}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${RZ.accent} 100%)`, color: '#fff',
            fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.26), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            WebkitTapHighlightColor: 'transparent',
          }}>
          Ostajem na putu
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { RazloziScreen });
})();
