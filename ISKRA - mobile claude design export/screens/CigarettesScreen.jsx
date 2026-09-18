/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// CigarettesScreen.jsx — Iskra "Odbijene cigarete" detail (scrollable, health focus).

const CS = {
  bg: '#FFFFFF', blue: '#C24A43', blueBg: '#FBE9E7', green: '#3A7A3A', accent: '#E8621A',
  card: '#FFFFFF', border: '#ECE9E3', text: '#1A1A1A', sub: '#999999', body: '#555555', fine: '#CCCCCC',
};

function CsIcon({ size = 22, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const CigOff = (p) => <CsIcon {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" /><line x1="3" y1="4" x2="21" y2="20.5" /></CsIcon>;
const Lungs = (p) => <CsIcon {...p}><path d="M12 4v8" /><path d="M9.5 9.5c-2 0-4 2-4 6 0 2 .5 4 2.2 4 1.3 0 1.8-1.1 1.8-2.6V11c0-.85-.7-1.5-1.5-1.5Z" /><path d="M14.5 9.5c2 0 4 2 4 6 0 2-.5 4-2.2 4-1.3 0-1.8-1.1-1.8-2.6V11c0-.85.7-1.5 1.5-1.5Z" /></CsIcon>;
const Molecule = (p) => <CsIcon {...p}><circle cx="5" cy="6" r="2.2" /><circle cx="19" cy="8" r="2.2" /><circle cx="12" cy="17" r="2.2" /><path d="M6.8 7.2 10.5 15M17.2 9.4 13.4 15.6M7 6.6l9.8 1" /></CsIcon>;
const Clock = (p) => <CsIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3.5 2" /></CsIcon>;
const Coin = (p) => <CsIcon {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></CsIcon>;
const Share = (p) => <CsIcon {...p}><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></CsIcon>;

const IMPACT = [
  { Icon: Lungs, color: '#C24A43', big: '470g katrana', sub: 'nije ušlo u tvoja pluća' },
  { Icon: Molecule, color: '#6B52A8', big: '940mg nikotina', sub: 'nisi uneo/la u krv' },
  { Icon: Clock, color: '#3A7A3A', big: '109 sati', sub: 'uštedeo/la si na paljenju', fine: '(7 min × 940 cigareta)' },
];
const PROJ = [
  { n: '140', l: 'nedeljno' },
  { n: '600', l: 'mesečno' },
  { n: '7.300', l: 'godišnje' },
  { n: '36.500', l: 'za 5 godina' },
];

function Card({ children, style }) {
  return (
    <div style={{
      background: CS.card, border: `1px solid ${CS.border}`, borderRadius: 18, padding: 20,
      boxShadow: '0 4px 14px rgba(26,22,15,0.04)', ...style,
    }}>{children}</div>
  );
}
function CardTitle({ children }) {
  return <div style={{ fontSize: 14, fontWeight: 500, color: CS.text, marginBottom: 14 }}>{children}</div>;
}

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
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 120, display: 'block', overflow: 'visible' }}>
        <path d={`${path} L ${last.x} ${H} L ${pts[0].x} ${H} Z`} fill={CS.blueBg} />
        <path d={path} fill="none" stroke={CS.blue} strokeWidth="2" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="4.5" fill={CS.blue} />
        <text x={last.x} y={last.y - 12} textAnchor="end" fontSize="13" fontWeight="700" fill={CS.blue} fontFamily="Manrope, sans-serif">940</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {['Dan 1', 'Dan 10', 'Dan 20', 'Dan 30', 'Dan 47'].map((d) => (
          <span key={d} style={{ fontSize: 11, fontWeight: 500, color: CS.fine }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function CigarettesScreen({ onBack = () => {}, onMoney }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: CS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: CS.text,
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 22px 10px', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7', border: `1px solid ${CS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: CS.text }}>Odbijene cigarete</span>
        <button style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7', border: `1px solid ${CS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Share size={19} color="#999" sw={1.9} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>
        {/* hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0 26px' }}>
          <CigOff size={40} color={CS.blue} sw={1.7} />
          <div style={{ fontSize: 56, fontWeight: 600, color: CS.blue, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 16 }}>940</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: CS.blue, marginTop: 8 }}>cigareta odbijeno</div>
          <div style={{ fontSize: 14, fontWeight: 400, color: CS.sub, marginTop: 10 }}>u 47 dana slobode</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, paddingBottom: 8 }}>
          {/* bar chart */}
          <Card>
            <CardTitle>Ukupno odbijeno</CardTitle>
            <AreaChart />
            <div style={{ fontSize: 12, fontWeight: 400, color: CS.sub, marginTop: 12 }}>20 cigareta dnevno nisi zapalio/la</div>
          </Card>

          {/* health impact */}
          <Card>
            <CardTitle>Šta nisi uneo/la u sebe</CardTitle>
            {IMPACT.map((m, i) => (
              <div key={m.big} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '14px 0', borderTop: i === 0 ? 'none' : `1px solid ${CS.border}` }}>
                <div style={{ marginTop: 1 }}><m.Icon size={22} color={m.color} sw={1.9} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: CS.text, letterSpacing: '-0.01em' }}>{m.big}</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: CS.sub, marginTop: 2 }}>{m.sub}</div>
                  {m.fine && <div style={{ fontSize: 11, fontWeight: 400, color: CS.fine, marginTop: 2 }}>{m.fine}</div>}
                </div>
              </div>
            ))}
          </Card>

          {/* pack count */}
          <Card style={{ display: 'flex', alignItems: 'center' }}>
            {[{ n: '940', l: 'cigareta' }, { n: '47', l: 'kutija' }, { n: '4 dana', l: 'pušenja' }].map((s, i) => (
              <React.Fragment key={s.l}>
                {i > 0 && <div style={{ width: 1, alignSelf: 'stretch', background: CS.border }} />}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 500, color: CS.text, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{s.n}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: CS.sub, marginTop: 4 }}>{s.l}</div>
                </div>
              </React.Fragment>
            ))}
          </Card>

          {/* projections */}
          <Card>
            <CardTitle>Ako nastaviš</CardTitle>
            {PROJ.map((p, i) => (
              <div key={p.l} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '13px 0', borderTop: i === 0 ? 'none' : `1px solid ${CS.border}` }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: CS.blue, letterSpacing: '-0.01em' }}>{p.n}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: CS.sub }}>{p.l}</span>
              </div>
            ))}
          </Card>

          {/* money crosslink */}
          <button onClick={() => onMoney && onMoney()} style={{
            width: '100%', background: '#fff', border: `1.5px solid #E8E8E8`, borderRadius: 18, padding: 18,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 14, WebkitTapHighlightColor: 'transparent',
          }}>
            <Coin size={24} color={CS.green} sw={1.9} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 400, color: CS.sub }}>Uštedeo/la si i</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: CS.green, marginTop: 1 }}>18.800 RSD</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
              <path d="M1 1l6 6-6 6" stroke="#CCC" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* share button */}
          <button
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
            style={{
              width: '100%', height: 52, borderRadius: 16, background: '#fff', border: `1.5px solid ${CS.blue}`,
              cursor: 'pointer', fontFamily: 'inherit', color: CS.blue, fontSize: 15, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 4,
              transform: pressed ? 'scale(0.99)' : 'scale(1)', transition: 'transform 0.12s ease',
              WebkitTapHighlightColor: 'transparent',
            }}>
            <Share size={18} color={CS.blue} sw={2} />
            Podeli svoju pobedu
          </button>

          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CigarettesScreen });

})();
