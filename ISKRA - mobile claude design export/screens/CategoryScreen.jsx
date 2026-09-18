/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// CategoryScreen.jsx — Iskra category detail (roadmap/timeline). Zdravlje = template.

const CGS = {
  bg: '#FDFCFA', card: '#FFFFFF', border: '#ECE9E3',
  text: '#1A1A1A', sub: '#999999', body: '#555555', fine: '#BBBBBB',
  amber: '#BA7517', amberBg: '#FEF3E2',
};

// Per-category config (color + milestones). Zdravlje built out; others share layout.
const CATEGORIES = {
  zdravlje: {
    title: 'Zdravlje', color: '#D4547E', lineColor: '#F0C0CC',
    achievedCount: 7, total: 12, nextIn: 'Za 23:14:33',
    achieved: [
      { t: 'Krvni pritisak se normalizovao', d: '31. maj 2026., 06:31' },
      { t: 'Kiseonik u krvi se vratio na normalu', d: '31. maj 2026., 14:11' },
      { t: 'Rizik od srčanog počeo da opada', d: '1. jun 2026., 06:11' },
      { t: 'Ukus i miris se vraćaju', d: '2. jun 2026., 06:11' },
      { t: 'Disanje postaje lakše', d: '3. jun 2026., 06:11' },
      { t: 'Cirkulacija se poboljšala', d: '14. jun 2026., 06:11' },
      { t: 'Funkcija pluća poboljšana za 30%', d: '30. jun 2026., 06:11' },
    ],
    current: { t: 'Kašalj i kratkoća daha se smanjuju', pct: 52 },
    upcoming: [
      { t: 'Pluća skoro potpuno čista', r: 'Za 223 dana' },
      { t: 'Rizik od srčanog prepolovljen', r: 'Za 318 dana' },
      { t: 'Rizik od moždanog kao nepušač', r: 'Za 5 godina' },
      { t: 'Rizik od raka pluća prepolovljen', r: 'Za 10 godina' },
    ],
  },
};

function Dot({ kind, color }) {
  if (kind === 'achieved') return <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, flexShrink: 0 }} />;
  if (kind === 'current') return <div style={{ width: 16, height: 16, borderRadius: '50%', border: `3px solid ${color}`, background: '#fff', boxSizing: 'border-box', flexShrink: 0, marginLeft: -1 }} />;
  return <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid #CCC`, background: '#fff', boxSizing: 'border-box', flexShrink: 0 }} />;
}

function Row({ kind, color, lineColor, last, children }) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 }}>
        <Dot kind={kind} color={color} />
        {!last && <div style={{ flex: 1, width: 2, background: lineColor, marginTop: 4, minHeight: 24 }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 22 }}>{children}</div>
    </div>
  );
}

function HeartMini({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

function CategoryScreen({ cat = 'zdravlje', onBack = () => {} }) {
  const C = CATEGORIES[cat] || CATEGORIES.zdravlje;
  const items = [
    ...C.achieved.map((m) => ({ kind: 'achieved', ...m })),
    { kind: 'current', ...C.current },
    ...C.upcoming.map((m) => ({ kind: 'upcoming', ...m })),
  ];

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: CGS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: CGS.text,
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 22px 8px', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: CGS.card, border: `1px solid ${CGS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{
          background: CGS.amberBg, color: CGS.amber, fontSize: 13, fontWeight: 500,
          padding: '8px 14px', borderRadius: 999,
        }}>{C.nextIn}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>
        {/* header */}
        <h1 style={{ margin: '14px 0 0', fontSize: 32, fontWeight: 600, color: C.color, letterSpacing: '-0.02em' }}>{C.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, marginBottom: 24 }}>
          <HeartMini color={C.color} />
          <span style={{ fontSize: 16, fontWeight: 500, color: CGS.text }}>{C.achievedCount} / {C.total} postignuto</span>
        </div>

        {/* timeline */}
        <div>
          {items.map((m, i) => (
            <Row key={i} kind={m.kind} color={C.color} lineColor={C.lineColor} last={i === items.length - 1}>
              {m.kind === 'achieved' && (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: CGS.text, lineHeight: 1.3 }}>{m.t}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: CGS.sub, marginTop: 3 }}>{m.d}</div>
                </div>
              )}
              {m.kind === 'current' && (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: CGS.text, lineHeight: 1.3 }}>{m.t}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#F0F0F0', overflow: 'hidden' }}>
                      <div style={{ width: `${m.pct}%`, height: '100%', background: C.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.color, flexShrink: 0 }}>{m.pct}%</span>
                  </div>
                </div>
              )}
              {m.kind === 'upcoming' && (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 400, color: CGS.sub, lineHeight: 1.3 }}>{m.t}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: CGS.fine, marginTop: 3 }}>{m.r}</div>
                </div>
              )}
            </Row>
          ))}
        </div>

        {/* info card */}
        <div style={{
          background: CGS.card, border: `1px solid ${CGS.border}`, borderRadius: 16, padding: 16, marginTop: 4, marginBottom: 30,
          display: 'flex', gap: 12,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9.5" /><path d="M12 16v-5" /><path d="M12 8h.01" />
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 400, color: CGS.body, lineHeight: 1.5 }}>Podaci su zasnovani na istraživanjima WHO i CDC. Precizan napredak zavisi od individualnih faktora.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CategoryScreen });

})();
