/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingSummary.jsx — Iskra onboarding: full scrollable journey summary.

const SUM = {
  bg: '#E8621A', accent: '#E8621A', track: '#E8E8E8',
  card: '#FFFFFF', border: '#F0E4DA', text: '#1A1A1A', sub: '#999999', fine: '#BBBBBB',
};

function SmIcon({ size = 20, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const Cal = (p) => <SmIcon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></SmIcon>;
const Heart = (p) => <SmIcon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" /></SmIcon>;
const Coin = (p) => <SmIcon {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></SmIcon>;
const CigOff = (p) => <SmIcon {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" /><line x1="3" y1="4" x2="21" y2="20.5" /></SmIcon>;
const Flame = (p) => <SmIcon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" /></SmIcon>;
const People = (p) => <SmIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></SmIcon>;
const Bird = (p) => <SmIcon {...p}><path d="M4 13 Q 8 7 12 13 Q 16 7 20 13" /></SmIcon>;

// ── Savings area chart ───────────────────────────────────────
function SavingsChart() {
  const W = 300, H = 140, padB = 22, padT = 10;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
  const n = months.length;
  const pts = months.map((_, i) => {
    const x = (i / (n - 1)) * W;
    const frac = i / (n - 1);
    const y = padT + (1 - frac) * (H - padB - padT);
    return [x, y];
  });
  // smooth path
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  const area = d + ` L ${W} ${H - padB} L 0 ${H - padB} Z`;
  const end = pts[pts.length - 1];

  return (
    <div style={{ position: 'relative', marginTop: 14 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="sumFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAD9C4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FEF0E8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sumFill)" />
        <path d={d} fill="none" stroke={SUM.accent} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={end[0]} cy={end[1]} r="4.5" fill={SUM.accent} stroke="#fff" strokeWidth="2" />
        {months.map((m, i) => (
          <text key={m} x={(i / (n - 1)) * W} y={H - 6} fontSize="8" fill={SUM.sub}
            textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontFamily="Manrope, sans-serif">{m}</text>
        ))}
      </svg>
      {/* end tooltip */}
      <div style={{
        position: 'absolute', top: -2, right: 0, transform: 'translate(6px, -50%)',
        background: SUM.accent, color: '#fff', fontSize: 10.5, fontWeight: 700,
        padding: '3px 8px', borderRadius: 7, whiteSpace: 'nowrap',
        boxShadow: '0 4px 10px rgba(232,98,26,0.3)',
      }}>146.000 RSD</div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: SUM.card, border: `1px solid ${SUM.border}`, borderRadius: 18, padding: 20,
      boxShadow: '0 4px 14px rgba(120,44,0,0.05)', ...style,
    }}>{children}</div>
  );
}

const STATS = [
  { value: '31. maj', label: 'Datum prestanka', color: '#E8621A', chip: '#FBEAE0', Icon: Cal },
  { value: '20', label: 'Cigareta dnevno', color: '#4A6080', chip: '#EDF2F8', Icon: CigOff },
  { value: '400 RSD', label: 'Cena kutije', color: '#3A7A3A', chip: '#EDF7ED', Icon: Coin },
  { value: '7.300', label: 'Cigareta godišnje', color: '#E8621A', chip: '#FBEAE0', Icon: Flame },
];

const MILESTONES = [
  { time: '20 min', text: 'Krvni pritisak se normalizuje', color: '#3A7A3A' },
  { time: '8 sati', text: 'Kiseonik u krvi se vraća', color: '#3A7A3A' },
  { time: '48 sati', text: 'Ukus i miris se vraćaju', color: '#2E8B80' },
  { time: '1 nedelja', text: 'Disanje postaje lakše', color: '#2E8B80' },
  { time: '1 mesec', text: 'Pluća rade bolje', color: '#6B52A8' },
  { time: '1 godina', text: 'Rizik od srčanog prepolovljen', color: '#E8621A' },
];

const REASONS = [
  { label: 'Zdravlje', color: '#D4547E', Icon: Heart },
  { label: 'Porodica', color: '#4A6080', Icon: People },
  { label: 'Sloboda', color: '#6B52A8', Icon: Bird },
];

function OnboardingSummary({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: SUM.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: SUM.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.3)', marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(16 / 18) * 100}%`, height: '100%', background: '#fff' }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.16)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 22px 8px' }}>
        {/* header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', opacity: 0.85, letterSpacing: '2px', marginBottom: 12, whiteSpace: 'nowrap' }}>TVOJ PLAN</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Pavle, spreman/na si.
          </h1>
          <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, textWrap: 'balance' }}>
            Na osnovu svega što si nam rekao/la, ovo je tvoje putovanje.
          </p>
        </div>

        {/* savings chart */}
        <Card style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: SUM.text }}>Uštedine tokom godine</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#3A7A3A', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>146.000 RSD</div>
          </div>
          <SavingsChart />
          <div style={{ fontSize: 12, fontWeight: 400, color: SUM.fine, marginTop: 8 }}>= 10 dana odmora na moru</div>
        </Card>

        {/* quick stats 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: SUM.card, border: `1px solid ${SUM.border}`, borderRadius: 14, padding: 16,
              boxShadow: '0 4px 14px rgba(120,44,0,0.05)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: s.chip,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <s.Icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 500, color: SUM.text, letterSpacing: '-0.01em' }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: SUM.sub, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* health milestones */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: SUM.text, marginBottom: 4 }}>Šta te čeka</div>
          {MILESTONES.map((m, i) => (
            <div key={m.time} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${SUM.border}`,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: SUM.sub, width: 70, flexShrink: 0 }}>{m.time}</span>
              <span style={{ fontSize: 14, fontWeight: 400, color: SUM.text, flex: 1, lineHeight: 1.3 }}>{m.text}</span>
            </div>
          ))}
        </Card>

        {/* reasons */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: SUM.text, marginBottom: 4 }}>Tvoji razlozi</div>
          {REASONS.map((r, i) => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${SUM.border}`,
            }}>
              <r.Icon size={20} color={r.color} />
              <span style={{ fontSize: 15, fontWeight: 500, color: SUM.text }}>{r.label}</span>
            </div>
          ))}
        </Card>

        {/* final statement */}
        <p style={{ margin: '22px 0 4px', fontSize: 16, fontWeight: 500, color: '#fff', textAlign: 'center', lineHeight: 1.45, textWrap: 'balance' }}>
          Iskra je tu svaki put kad bude teško.
        </p>
      </div>

      {/* button */}
      <div style={{ flexShrink: 0, padding: '10px 22px 30px' }}>
        <button
          onClick={onNext}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: '#fff',
            color: SUM.accent, fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(120,44,0,0.25)' : '0 8px 22px rgba(120,44,0,0.26)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Počinjemo
        </button>
        <p style={{ margin: '12px 0 0', fontSize: 11.5, fontWeight: 400, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
          Možeš promeniti sve podatke u podešavanjima.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingSummary });

})();
