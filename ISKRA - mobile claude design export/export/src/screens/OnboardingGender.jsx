/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingGender.jsx — Iskra onboarding: gender / address selection.

const GEN = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', tint: '#FEF0E8',
};

function MaleSil({ size = 48, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="6.2" r="3.4" />
      <path d="M7 21v-6a5 5 0 0 1 10 0v6Z" />
    </svg>
  );
}
function FemaleSil({ size = 48, color = '#1A1A1A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="12" cy="6.2" r="3.4" />
      <path d="M12 11c2.3 0 3.6 1.4 4.4 3.8L18 21H6l1.6-6.2C8.4 12.4 9.7 11 12 11Z" />
    </svg>
  );
}

function GenderCard({ slotId, placeholder, label, selected, onClick }) {
  return (
    <div onClick={onClick} role="button" style={{
      flex: 1, cursor: 'pointer', position: 'relative', overflow: 'hidden',
      borderRadius: 20, height: 248,
      background: '#E9E5E0',
      border: selected ? `2.5px solid ${GEN.accent}` : '2.5px solid transparent',
      boxShadow: selected ? '0 10px 24px rgba(232,98,26,0.30)' : '0 4px 14px rgba(120,80,40,0.10)',
      transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <image-slot
        id={slotId}
        shape="rect"
        fit="cover"
        placeholder={placeholder}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '86%', display: 'block' }}
      ></image-slot>
      {/* gradient fade into the ember base */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%', background: 'linear-gradient(180deg, rgba(232,98,26,0) 0%, rgba(232,98,26,0.55) 55%, rgba(232,98,26,0.92) 100%)', pointerEvents: 'none' }} />
      {/* label pill */}
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 14, height: 48, borderRadius: 999,
        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: selected ? GEN.accent : GEN.text }}>{label}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selected ? GEN.accent : GEN.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}

function OnboardingGender({ onNext = () => {}, onBack = () => {} }) {
  const [sel, setSel] = React.useState(null);
  const [pressed, setPressed] = React.useState(false);
  const ready = sel !== null;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: GEN.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: GEN.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: GEN.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(3 / 18) * 100}%`, height: '100%', background: GEN.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${GEN.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: GEN.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Kako da te oslovljavamo?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: GEN.sub, lineHeight: 1.45 }}>
          Personalizujemo tvoj zdravstveni napredak na osnovu ovoga.
        </p>
      </div>

      {/* selection */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <GenderCard slotId="iskra-gender-male" placeholder="Dodaj fotografiju" label="Muško" selected={sel === 'male'} onClick={() => setSel('male')} />
          <GenderCard slotId="iskra-gender-female" placeholder="Dodaj fotografiju" label="Žensko" selected={sel === 'female'} onClick={() => setSel('female')} />
        </div>
        <button onClick={() => setSel('na')} style={{
          marginTop: 22, background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'center',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
          color: sel === 'na' ? GEN.accent : GEN.sub,
          textDecoration: 'underline', textUnderlineOffset: 3, WebkitTapHighlightColor: 'transparent',
        }}>Preferiram da ne kažem</button>
      </div>

      {/* button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          disabled={!ready}
          onClick={() => { if (ready) onNext(); }}
          onMouseDown={() => ready && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${GEN.accent} 100%)` : '#F0D6C6',
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: ready && !pressed ? '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)' : 'none',
            transform: pressed ? 'scale(0.985)' : 'scale(1)',
            transition: 'transform 0.12s ease, box-shadow 0.15s ease, background 0.2s ease',
          }}>
          Nastavi
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingGender });

})();
