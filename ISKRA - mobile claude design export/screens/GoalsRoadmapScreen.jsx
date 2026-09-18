/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// GoalsRoadmapScreen.jsx — Iskra "Svi ciljevi" combined chronological roadmap.

const GR = {
  bg: '#FDFCFA', card: '#FFFFFF', border: '#ECE9E3', accent: '#E8621A',
  text: '#1A1A1A', sub: '#999999', body: '#888888', fine: '#BBBBBB',
};

const CAT = {
  zdravlje:  { name: 'Zdravlje',  color: '#D4547E', done: 7, total: 12 },
  pluca:     { name: 'Pluća',     color: '#4A8AC4', done: 3, total: 8 },
  ekologija: { name: 'Ekologija', color: '#2E8B80', done: 2, total: 6 },
  finansije: { name: 'Finansije', color: '#3A7A3A', done: 4, total: 8 },
  telo:      { name: 'Telo',      color: '#C4724A', done: 3, total: 10 },
  nikotin:   { name: 'Nikotin',   color: '#6B52A8', done: 2, total: 6 },
};

const ACHIEVED = [
  { cat: 'zdravlje', t: 'Pluća rade bolje', d: '30. jun' },
  { cat: 'finansije', t: '10.000 RSD uštedeno', d: '28. jun' },
  { cat: 'telo', t: 'Cirkulacija se poboljšala', d: '14. jun' },
  { cat: 'zdravlje', t: 'Disanje postaje lakše', d: '3. jun' },
  { cat: 'zdravlje', t: 'Ukus i miris se vraćaju', d: '2. jun' },
];

const CURRENT = { cat: 'zdravlje', t: 'Kašalj i kratkoća daha se smanjuju', pct: 52, r: 'Za 43 dana · Dan 90' };

const UPCOMING = [
  { cat: 'nikotin', t: 'Nikotinski receptori se resetuju', r: 'Za 19 dana · Dan 66' },
  { cat: 'finansije', t: '25.000 RSD uštedeno', r: 'Za 21 dan' },
  { cat: 'pluca', t: 'Kapacitet pluća povećan za 10%', r: 'Za 43 dana · Dan 90' },
  { cat: 'telo', t: 'Koža počinje da se obnavlja', r: 'Za 53 dana · Dan 100' },
  { cat: 'ekologija', t: 'Spasio/la si 47 stabala od dima', r: 'Za 53 dana · Dan 100' },
  { cat: 'zdravlje', t: 'Rizik od srčanog prepolovljen', r: 'Za 318 dana · 1 godina' },
  { cat: 'finansije', t: '100.000 RSD uštedeno', r: 'Za 204 dana' },
  { cat: 'pluca', t: 'Pluća skoro potpuno čista', r: 'Za 223 dana · 9 meseci' },
  { cat: 'nikotin', t: 'Potpuno slobodan od nikotinske zavisnosti', r: 'Za 318 dana · 1 godina' },
];

function Badge({ cat, small }) {
  const C = CAT[cat];
  return (
    <span style={{
      display: 'inline-block', background: C.color, color: '#fff',
      fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: '0.03em',
      padding: small ? '3px 8px' : '4px 10px', borderRadius: 999, textTransform: 'uppercase',
    }}>{C.name}</span>
  );
}

function GoalsRoadmapScreen({ onBack = () => {} }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: GR.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: GR.text,
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 22px 10px', flexShrink: 0, position: 'relative' }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: GR.card, border: `1px solid ${GR.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 17, fontWeight: 500, color: GR.text, pointerEvents: 'none' }}>Moj napredak</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 0' }}>
        <div>
          {/* achieved — muted rows */}
          {ACHIEVED.map((m, i) => (
            <div key={'a' + i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: CAT[m.cat].color, opacity: 0.5, flexShrink: 0, marginTop: 3 }} />
                <div style={{ flex: 1, width: 2, background: '#EEE9E3', marginTop: 4, minHeight: 16 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10, paddingBottom: 18 }}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 400, color: GR.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.t}</span>
                <span style={{ fontSize: 13, fontWeight: 400, color: GR.fine, flexShrink: 0 }}>{m.d}</span>
              </div>
            </div>
          ))}

          {/* current — highlighted card */}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: `3px solid ${GR.accent}`, background: '#fff', boxSizing: 'border-box', flexShrink: 0, marginTop: 3 }} />
              <div style={{ flex: 1, width: 2, background: '#EEE9E3', marginTop: 4, minHeight: 16 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 18 }}>
              <div style={{
                background: '#fff', borderRadius: 16, borderLeft: `3px solid ${GR.accent}`,
                border: `1px solid ${GR.border}`, padding: 16, boxShadow: '0 4px 14px rgba(26,22,15,0.06)',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: GR.accent, letterSpacing: '0.06em' }}>SLEDEĆE</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: GR.sub, marginTop: 7 }}>{CAT[CURRENT.cat].name}</div>
                <div style={{ fontSize: 17, fontWeight: 500, color: GR.text, marginTop: 2, letterSpacing: '-0.01em' }}>{CURRENT.t}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#F0F0F0', overflow: 'hidden' }}>
                    <div style={{ width: `${CURRENT.pct}%`, height: '100%', background: GR.accent, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: GR.accent, flexShrink: 0 }}>{CURRENT.pct}%</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 400, color: GR.sub, marginTop: 10 }}>{CURRENT.r}</div>
              </div>
            </div>
          </div>

          {/* upcoming — clean rows */}
          {UPCOMING.map((m, i) => (
            <div key={'u' + i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2.5px solid ${CAT[m.cat].color}`, background: '#fff', boxSizing: 'border-box', flexShrink: 0, marginTop: 3 }} />
                {i < UPCOMING.length - 1 && <div style={{ flex: 1, width: 2, background: '#EEE9E3', marginTop: 4, minHeight: 16 }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: GR.sub }}>{CAT[m.cat].name}</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: GR.text, marginTop: 2, letterSpacing: '-0.01em' }}>{m.t}</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: GR.sub, marginTop: 3 }}>{m.r}</div>
              </div>
            </div>
          ))}
        </div>

        {/* motivational note */}
        <div style={{ fontSize: 14, fontWeight: 400, fontStyle: 'italic', color: GR.body, textAlign: 'center', padding: '8px 20px 36px' }}>
          Svaki dan dodaje novi cilj na listu.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GoalsRoadmapScreen });

})();
