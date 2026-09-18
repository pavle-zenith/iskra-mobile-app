/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingNotifications.jsx — Iskra onboarding: notification permission request.

const NTF = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  card: '#FFFFFF', border: '#EFEAE3', text: '#1A1A1A', sub: '#999999', body: '#555555', tint: '#FEF0E8',
};

const FlameMini = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
  </svg>
);

const NOTIFS = [
  { title: 'Dan 8 — streak ide dalje', body: 'Već 8 dana bez cigarete. Pluća ti se zahvaljuju.' },
  { title: 'Za 2 sata: novi milestone', body: 'Cirkulacija se poboljšava. Oseti razliku.' },
  { title: 'Vuče te? Otvori Iskru.', body: 'Poriv prolazi za 5 minuta. Klikni i prođi kroz njega.' },
];

function OnboardingNotifications({ onNext = () => {}, onSkip = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: NTF.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: NTF.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: NTF.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(17 / 18) * 100}%`, height: '100%', background: NTF.accent }} />
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '38px 26px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* bell icon */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%', background: NTF.tint,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={NTF.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </div>

        {/* statement */}
        <h1 style={{ margin: '24px 0 0', fontSize: 26, fontWeight: 600, color: NTF.text, textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.25, textWrap: 'balance' }}>
          Iskra je najkorisnija kad si tu.
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: '#888', textAlign: 'center', lineHeight: 1.6, textWrap: 'balance' }}>
          Šaljemo ti samo ono što je važno — nikad spam.
        </p>

        {/* notification examples */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 11, marginTop: 28 }}>
          {NOTIFS.map((n) => (
            <div key={n.title} style={{
              display: 'flex', gap: 13, background: NTF.card, border: `1px solid ${NTF.border}`,
              borderRadius: 14, padding: 16, boxShadow: '0 4px 14px rgba(26,22,15,0.05)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: `linear-gradient(180deg, #F0701F 0%, ${NTF.accent} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(232,98,26,0.28)',
              }}>
                <FlameMini size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: NTF.text, letterSpacing: '-0.01em' }}>{n.title}</div>
                <div style={{ fontSize: 13, fontWeight: 400, color: NTF.body, marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* actions */}
      <div style={{ flexShrink: 0, padding: '12px 26px 34px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={onNext}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${NTF.accent} 100%)`,
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Dozvoli obaveštenja
        </button>
        <button onClick={onSkip} style={{
          marginTop: 16, background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: NTF.sub,
          WebkitTapHighlightColor: 'transparent',
        }}>Možda kasnije</button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingNotifications });

})();
