/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingReflection.jsx — Iskra onboarding: reflection + reassurance (informative).

const REF = {
  bg: '#E8621A', accent: '#E8621A', track: '#E8E8E8',
  card: '#FFFFFF', border: '#F0E4DA', text: '#1A1A1A', sub: '#888888',
};

function FIcon({ size = 28, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const Heart = (p) => <FIcon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" /></FIcon>;
const People = (p) => <FIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></FIcon>;
const Bird = (p) => <FIcon {...p}><path d="M4 13 Q 8 7 12 13 Q 16 7 20 13" /></FIcon>;

const CARDS = [
  {
    label: 'Zdravlje', color: '#D4547E', Icon: Heart,
    body: 'Već 20 minuta nakon poslednje cigarete, krvni pritisak počinje da se normalizuje.',
    bold: 'Tvoje telo je već spremno da počne.',
  },
  {
    label: 'Porodica', color: '#4A6080', Icon: People,
    body: 'Pasivno pušenje utiče na ljude oko tebe — posebno decu.',
    bold: 'Oni su tvoj razlog broj jedan.',
  },
  {
    label: 'Sloboda', color: '#6B52A8', Icon: Bird,
    body: 'Nikotin stvara iluziju opuštanja. Bez njega, stres se zapravo lakše podnosi.',
    bold: 'Sloboda počinje prvim danom.',
  },
];

function ReassureCard({ c }) {
  return (
    <div style={{
      background: REF.card, border: `1px solid ${REF.border}`, borderRadius: 16, padding: 20,
      boxShadow: '0 4px 14px rgba(120,44,0,0.05)',
    }}>
      <c.Icon size={28} color={c.color} />
      <div style={{ fontSize: 16, fontWeight: 600, color: REF.text, marginTop: 12 }}>{c.label}</div>
      <p style={{ margin: '7px 0 0', fontSize: 14, fontWeight: 400, color: REF.sub, lineHeight: 1.5 }}>{c.body}</p>
      <div style={{ fontSize: 14, fontWeight: 700, color: REF.accent, marginTop: 12, lineHeight: 1.4 }}>{c.bold}</div>
    </div>
  );
}

function OnboardingReflection({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: REF.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: REF.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.3)', marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(8 / 18) * 100}%`, height: '100%', background: '#fff' }} />
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
          Znamo da prestanak nije lako.
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
          Ali tvoji razlozi su jači od navike.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
          {CARDS.map((c) => <ReassureCard key={c.label} c={c} />)}
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
            color: REF.accent, fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(120,44,0,0.25)' : '0 8px 22px rgba(120,44,0,0.26)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Razumem
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingReflection });

})();
