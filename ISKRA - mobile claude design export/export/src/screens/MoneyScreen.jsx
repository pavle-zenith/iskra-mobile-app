/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// MoneyScreen.jsx — Iskra "Uštedine" money-saved detail (scrollable).

const MS = {
  bg: '#FFFFFF', green: '#3A7A3A', greenBg: '#EDF7ED', accent: '#E8621A',
  card: '#FFFFFF', border: '#ECE9E3', text: '#1A1A1A', sub: '#999999', body: '#555555', fine: '#CCCCCC',
};

function MsIcon({ size = 22, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const Coin = (p) => <MsIcon {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></MsIcon>;
const Fork = (p) => <MsIcon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" /><path d="M5 11v11" /><path d="M19 2v20" /><path d="M19 14c2 0 2.5-2 2.5-5 0-4-1-7-2.5-7s-2.5 3-2.5 7c0 3 .5 5 2.5 5Z" /></MsIcon>;
const Bed = (p) => <MsIcon {...p}><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /></MsIcon>;
const Tv = (p) => <MsIcon {...p}><rect x="2" y="7" width="20" height="13" rx="2" /><path d="m17 2-5 5-5-5" /></MsIcon>;
const Share = (p) => <MsIcon {...p}><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></MsIcon>;
const CigOff = (p) => <MsIcon {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" /><line x1="3" y1="4" x2="21" y2="20.5" /></MsIcon>;
const Trophy = (p) => <MsIcon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></MsIcon>;

const EQUIV = [
  { Icon: Fork, t: '47 ćevaba u kafani' },
  { Icon: Bed, t: '1 vikend u Beogradu' },
  { Icon: Tv, t: '10 meseci Netflix pretplate' },
];
const PROJ = [
  { n: '400 RSD', l: 'dnevno' },
  { n: '2.800 RSD', l: 'nedeljno' },
  { n: '12.000 RSD', l: 'mesečno' },
  { n: '146.000 RSD', l: 'godišnje' },
];

function Card({ children, style }) {
  return (
    <div style={{
      background: MS.card, border: `1px solid ${MS.border}`, borderRadius: 18, padding: 20,
      boxShadow: '0 4px 14px rgba(26,22,15,0.04)', ...style,
    }}>{children}</div>
  );
}
function CardTitle({ children }) {
  return <div style={{ fontSize: 14, fontWeight: 500, color: MS.text, marginBottom: 14 }}>{children}</div>;
}

// Smooth area chart
function AreaChart() {
  const W = 320, H = 120, pad = 6;
  const pts = [0, 0.08, 0.2, 0.34, 0.52, 0.72, 1].map((v, i, a) => ({
    x: pad + (i / (a.length - 1)) * (W - pad * 2),
    y: H - pad - v * (H - pad * 2),
  }));
  const path = pts.reduce((d, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cx = (prev.x + p.x) / 2;
    return d + ` C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
  }, '');
  const last = pts[pts.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120, display: 'block' }}>
        <path d={`${path} L ${last.x} ${H} L ${pts[0].x} ${H} Z`} fill={MS.greenBg} />
        <path d={path} fill="none" stroke={MS.green} strokeWidth="2" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="4.5" fill={MS.green} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {['Dan 1', 'Dan 10', 'Dan 20', 'Dan 47'].map((d) => (
          <span key={d} style={{ fontSize: 11, fontWeight: 500, color: MS.sub }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function MoneyScreen({ onBack = () => {}, onCigarettes }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: MS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: MS.text,
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 22px 10px', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7', border: `1px solid ${MS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: MS.text }}>Uštedine</span>
        <button style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7', border: `1px solid ${MS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Share size={19} color="#999" sw={1.9} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>
        {/* hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0 26px' }}>
          <Coin size={40} color="#D9A227" sw={1.7} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 56, fontWeight: 700, color: MS.green, letterSpacing: '-0.03em', lineHeight: 1 }}>18.800</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: MS.green }}>RSD</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: MS.sub, marginTop: 12 }}>u 47 dana slobode</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, paddingBottom: 8 }}>
          {/* area chart */}
          <Card>
            <CardTitle>Rast uštedina</CardTitle>
            <AreaChart />
          </Card>

          {/* projections */}
          <Card>
            <CardTitle>Ako nastaviš</CardTitle>
            {PROJ.map((p, i) => (
              <div key={p.l} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '13px 0', borderTop: i === 0 ? 'none' : `1px solid ${MS.border}` }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: MS.green, letterSpacing: '-0.01em' }}>{p.n}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: MS.sub }}>{p.l}</span>
              </div>
            ))}
          </Card>

          {/* real-world */}
          <Card>
            <CardTitle>To je kao...</CardTitle>
            {EQUIV.map((e, i) => (
              <div key={e.t} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderTop: i === 0 ? 'none' : `1px solid ${MS.border}` }}>
                <e.Icon size={20} color={MS.green} sw={1.9} />
                <span style={{ fontSize: 14, fontWeight: 500, color: MS.body }}>{e.t}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, fontWeight: 400, color: MS.fine, marginTop: 10 }}>Ekvivalenti se menjaju kako rasteš.</div>
          </Card>

          {/* milestone */}
          <Card style={{ border: `1.5px solid #E8E8E8` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Trophy size={24} color={MS.accent} sw={1.9} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: MS.text }}>Sledeći cilj: 20.000 RSD</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: MS.sub, marginTop: 2 }}>još 1.200 RSD</div>
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: '#F0F0F0', overflow: 'hidden', marginTop: 16 }}>
              <div style={{ width: '94%', height: '100%', background: MS.accent, borderRadius: 3 }} />
            </div>
          </Card>

          {/* cigarettes crosslink */}
          <button onClick={() => onCigarettes && onCigarettes()} style={{
            width: '100%', background: '#fff', border: `1.5px solid #E8E8E8`, borderRadius: 18, padding: 18,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 14, WebkitTapHighlightColor: 'transparent',
          }}>
            <CigOff size={24} color="#C24A43" sw={1.9} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 400, color: MS.sub }}>Odbio/la si i</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#C24A43', marginTop: 1 }}>940 cigareta</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
              <path d="M1 1l6 6-6 6" stroke="#CCC" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* share button */}
          <button
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
            style={{
              width: '100%', height: 52, borderRadius: 16, background: '#fff', border: `1.5px solid ${MS.accent}`,
              cursor: 'pointer', fontFamily: 'inherit', color: MS.accent, fontSize: 15, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 4,
              transform: pressed ? 'scale(0.99)' : 'scale(1)', transition: 'transform 0.12s ease',
              WebkitTapHighlightColor: 'transparent',
            }}>
            <Share size={18} color={MS.accent} sw={2} />
            Podeli svoju pobedu
          </button>

          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MoneyScreen });

})();
