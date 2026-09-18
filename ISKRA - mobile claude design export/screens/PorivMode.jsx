/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// PorivMode.jsx — Iskra craving-management hub (dark immersive takeover).

const PV = {
  bg: '#1A1410', accent: '#E8621A', text: '#FFFFFF',
};

function PvIcon({ size = 22, color = '#fff', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const Lungs = (p) => <PvIcon {...p}><path d="M12 4v8" /><path d="M9.5 9.5c-2 0-4 2-4 6 0 2 .5 4 2.2 4 1.3 0 1.8-1.1 1.8-2.6V11c0-.85-.7-1.5-1.5-1.5Z" /><path d="M14.5 9.5c2 0 4 2 4 6 0 2-.5 4-2.2 4-1.3 0-1.8-1.1-1.8-2.6V11c0-.85.7-1.5 1.5-1.5Z" /></PvIcon>;
const Puzzle = (p) => <PvIcon {...p}><path d="M19.4 13a2 2 0 0 0 0-2.8 2 2 0 0 0-2.4-.3 1.5 1.5 0 0 1-2-2 2 2 0 0 0-.3-2.4 2 2 0 0 0-2.8 0 2 2 0 0 0-.3 2.4 1.5 1.5 0 0 1-2 2 2 2 0 0 0-2.4.3 2 2 0 0 0 0 2.8 1.5 1.5 0 0 1 0 2.8 2 2 0 0 0 0 2.8 2 2 0 0 0 2.4.3 1.5 1.5 0 0 1 2 2 2 2 0 0 0 .3 2.4h0" /></PvIcon>;
const Heart = (p) => <PvIcon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" /></PvIcon>;
const Drop = (p) => <PvIcon {...p}><path d="M12 2.5s6 6.3 6 10.5a6 6 0 0 1-12 0c0-4.2 6-10.5 6-10.5Z" /></PvIcon>;
const Walk = (p) => <PvIcon {...p}><circle cx="13" cy="4.5" r="1.8" /><path d="M11 21l1.5-6-2.5-2 1-5 3 2 2 1.5" /><path d="M10 13l-2 3-2 1" /><path d="M12.5 15l1.5 2.5" /></PvIcon>;
const Eye = (p) => <PvIcon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></PvIcon>;

const TOOLS = [
  { key: 'disem', label: 'Dišem', bg: '#2E8B80', Icon: Lungs },
  { key: 'igram', label: 'Igram se', bg: '#6B52A8', Icon: Puzzle },
  { key: 'razlozi', label: 'Moji razlozi', bg: '#E8621A', Icon: Heart },
  { key: 'voda', label: 'Pijem vodu', bg: '#4A8AC4', Icon: Drop },
  { key: 'setam', label: 'Šetam', bg: '#3A7A3A', Icon: Walk },
  { key: 'posmatram', label: 'Posmatram', bg: '#3D3830', Icon: Eye },
];

const TOTAL = 5 * 60; // 5 min

function PorivMode({ onClose = () => {}, onSlip, onTool = () => {}, level = 7 }) {
  const [secs, setSecs] = React.useState(4 * 60 + 23);
  React.useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, '0');
  const frac = secs / TOTAL;
  const slip = onSlip || onClose;

  const R = 92, C = 2 * Math.PI * R;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#FFFFFF', fontFamily: '"Manrope", system-ui, sans-serif', color: PV.text,
    }}>
      {/* ── EMBER TOP HALF ── */}
      <div style={{ background: PV.accent, flexShrink: 0, paddingBottom: 30 }}>
        {/* top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '56px 22px 0', position: 'relative' }}>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '2px', pointerEvents: 'none' }}>PORIV MODE</div>
          <div style={{
            background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700,
            padding: '6px 11px', borderRadius: 999, zIndex: 1, whiteSpace: 'nowrap',
          }}>Nivo {level}</div>
        </div>

        {/* timer ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
              <circle cx="100" cy="100" r={R} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 52, fontWeight: 300, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginTop: 7 }}>minuta</div>
            </div>
          </div>
        </div>

        {/* breathing hint */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pvBreathe 3.2s ease-in-out infinite' }} />
          <span style={{ fontSize: 13, fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>Udahni...</span>
        </div>
      </div>

      {/* ── WHITE BOTTOM HALF ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 0', display: 'flex', flexDirection: 'column' }}>
        {/* section label */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '1px', marginBottom: 13 }}>IZABERI ALAT</div>

        {/* tools grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TOOLS.map((t) => (
            <button key={t.key} onClick={() => onTool(t.key)} style={{
              height: 88, borderRadius: 14, border: 'none', cursor: 'pointer', background: t.bg,
              padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between',
              fontFamily: 'inherit', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
            }}>
              <t.Icon size={22} color="#fff" sw={1.9} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{t.label}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 22 }} />

        {/* bottom progress + footer */}
        <div style={{ paddingBottom: 30 }}>
          <div style={{ height: 2, borderRadius: 999, background: '#EDEAE4', overflow: 'hidden' }}>
            <div style={{ width: `${frac * 100}%`, height: '100%', background: PV.accent, borderRadius: 999, transition: 'width 1s linear' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 400, color: '#BBB' }}>Porivi traju 3 do 5 minuta.</span>
            <button onClick={slip} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 400, color: '#999',
              textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent',
            }}>Ipak sam zapalio/la</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pvBreathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { PorivMode });

})();
