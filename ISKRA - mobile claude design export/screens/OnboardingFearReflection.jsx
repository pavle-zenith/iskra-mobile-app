/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingFearReflection.jsx — Iskra onboarding: fear reflection + reassurance (warm).

const FRF = {
  bg: '#E8621A', accent: '#E8621A', track: '#E8E8E8',
  card: '#FFFFFF', border: '#F0E4DA', text: '#1A1A1A', sub: '#888888',
};

function FrfIcon({ size = 28, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const Bolt = (p) => <FrfIcon {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></FrfIcon>;
const Storm = (p) => <FrfIcon {...p}><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></FrfIcon>;
const People = (p) => <FrfIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></FrfIcon>;

const CARDS = [
  {
    label: 'Jaki porivi', color: '#E8621A', Icon: Bolt,
    body: 'Svaki poriv traje između 3 i 5 minuta. Posle toga prolazi sam — uvek.',
    bold: 'Iskra ima alat tačno za taj trenutak.',
  },
  {
    label: 'Stres bez cigarete', color: '#4A6080', Icon: Storm,
    body: 'Nikotin ne smanjuje stres — samo privremeno gasi apstinencijalni sindrom koji je on sam izazvao.',
    bold: 'Pravi oprez dolazi posle 3 nedelje.',
  },
  {
    label: 'Kafana i društvo', color: '#6B52A8', Icon: People,
    body: 'Društveni pritisak je jedan od glavnih razloga pada. Imaćeš skriptu za svaki takav trenutak.',
    bold: 'Nisi sam/a u tome.',
  },
];

function ReassureCard({ c }) {
  return (
    <div style={{
      background: FRF.card, border: `1px solid ${FRF.border}`, borderRadius: 16, padding: 20,
      boxShadow: '0 4px 14px rgba(120,44,0,0.05)',
    }}>
      <c.Icon size={28} color={c.color} />
      <div style={{ fontSize: 16, fontWeight: 600, color: FRF.text, marginTop: 12 }}>{c.label}</div>
      <p style={{ margin: '7px 0 0', fontSize: 14, fontWeight: 400, color: FRF.sub, lineHeight: 1.5 }}>{c.body}</p>
      <div style={{ fontSize: 14, fontWeight: 700, color: FRF.accent, marginTop: 12, lineHeight: 1.4 }}>{c.bold}</div>
    </div>
  );
}

function OnboardingFearReflection({ onNext = () => {}, onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: FRF.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: FRF.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.3)', marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(10 / 18) * 100}%`, height: '100%', background: '#fff' }} />
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
          Ove brige su normalne. Svi ih imaju.
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
          Iskra je napravljena tačno za ove trenutke.
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
            color: FRF.accent, fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(120,44,0,0.25)' : '0 8px 22px rgba(120,44,0,0.26)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Spreman/na sam
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingFearReflection });

})();
