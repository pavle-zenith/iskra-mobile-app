/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingPreview.jsx — Iskra onboarding: 3-month preview (benefits + social proof).

const PRV = {
  bg: '#E8621A', accent: '#E8621A', track: '#E8E8E8',
  card: '#FFFFFF', border: '#F0E4DA', text: '#1A1A1A', sub: '#999999',
};

function PvIcon({ size = 24, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const Coin = (p) => <PvIcon {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></PvIcon>;
const Lungs = (p) => <PvIcon {...p}><path d="M12 4v8" /><path d="M9.5 9.5c-2 0-4 2-4 6 0 2 .5 4 2.2 4 1.3 0 1.8-1.1 1.8-2.6V11c0-.85-.7-1.5-1.5-1.5Z" /><path d="M14.5 9.5c2 0 4 2 4 6 0 2-.5 4-2.2 4-1.3 0-1.8-1.1-1.8-2.6V11c0-.85.7-1.5 1.5-1.5Z" /></PvIcon>;
const Bird = (p) => <PvIcon {...p}><path d="M4 13 Q 8 7 12 13 Q 16 7 20 13" /></PvIcon>;

const BENEFITS = [
  { title: '146.000 RSD', titleSize: 20, sub: 'uštedeno za godinu dana', color: '#3A7A3A', chip: '#EDF7ED', Icon: Coin },
  { title: 'Plućna funkcija +30%', titleSize: 18, sub: 'u prvih 90 dana bez cigarete', color: '#2E8B80', chip: '#EBF6F5', Icon: Lungs },
  { title: 'Slobodan/na od nikotina', titleSize: 18, sub: 'mozak se vraća u prirodno stanje', color: '#6B52A8', chip: '#F0EDF8', Icon: Bird },
];

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#E8621A">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17l-6 3.4 1.4-6.8L2.3 9l6.9-.7L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

function OnboardingPreview({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: PRV.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: PRV.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.3)', marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(13 / 18) * 100}%`, height: '100%', background: '#fff' }} />
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 26px 8px' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Za 3 meseca, ovo te čeka.
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
          Na osnovu tvojih podataka.
        </p>

        {/* benefit cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
          {BENEFITS.map((b) => (
            <div key={b.title} style={{
              display: 'flex', alignItems: 'center', gap: 15,
              background: PRV.card, border: `1px solid ${PRV.border}`, borderRadius: 16, padding: 18,
              boxShadow: '0 4px 14px rgba(120,44,0,0.05)',
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, background: b.chip, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <b.Icon size={24} color={b.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: b.titleSize, fontWeight: 600, color: b.color, letterSpacing: '-0.01em' }}>{b.title}</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: PRV.sub, marginTop: 3 }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* social proof */}
        <div style={{
          background: PRV.card, border: `1px solid ${PRV.border}`, borderRadius: 16, padding: 18, marginTop: 12,
          boxShadow: '0 4px 14px rgba(120,44,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', background: '#FBEAE0', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: PRV.accent,
            }}>M</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: PRV.text }}>Marija, 34</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#E8621A">
                <circle cx="12" cy="12" r="10" />
                <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Stars />
          </div>
          <p style={{ margin: '13px 0 0', fontSize: 14, fontStyle: 'italic', color: '#555', lineHeight: 1.55 }}>
            „Nisam verovala da mogu. Ali posle prvog meseca, cigareta mi više nije ni na umu. Iskra me drži.”
          </p>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#BBB', marginTop: 12 }}>Verified Iskra korisnik</div>
        </div>
      </div>

      {/* button */}
      <div style={{ flexShrink: 0, padding: '10px 26px 38px' }}>
        <button
          onClick={onNext}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: '#fff',
            color: PRV.accent, fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(120,44,0,0.25)' : '0 8px 22px rgba(120,44,0,0.26)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Jedva čekam
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingPreview });

})();
