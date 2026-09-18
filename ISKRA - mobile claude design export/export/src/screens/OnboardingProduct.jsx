/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingProduct.jsx — Iskra onboarding: what do you use (cigarettes / IQOS). After Gender.

const PRD = {
  bg: '#F7F6F3', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', selBg: '#FEF8F5',
};

function CigaretteIcon({ size = 32, color = '#E8621A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="13" width="16" height="5" rx="1" />
      <path d="M14 13v5" />
      <path d="M20 6c0 1.2-1 1.6-1 2.8s1 1.6 1 2.8" />
      <path d="M17 7.5c0 1-0.8 1.3-0.8 2.3" />
    </svg>
  );
}

function IqosIcon({ size = 32, color = '#4A6080' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2.5" width="8" height="19" rx="2.4" />
      <path d="M8 7h8" />
      <path d="M12 11.5v4" />
    </svg>
  );
}

function ProductCard({ Icon, iconColor, chipBg, title, sub, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      background: selected ? `linear-gradient(180deg, #F0701F 0%, ${PRD.accent} 100%)` : '#fff',
      border: selected ? `2px solid ${PRD.accent}` : `1.5px solid ${PRD.track}`,
      borderRadius: 20, padding: selected ? 23 : 23.5, minHeight: 120,
      display: 'flex', alignItems: 'center', gap: 18,
      boxShadow: selected ? '0 8px 22px rgba(232,98,26,0.26)' : 'none',
      transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{ width: 64, height: 64, borderRadius: 14, background: selected ? '#fff' : chipBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={32} color={selected ? PRD.accent : iconColor} />
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 18, fontWeight: 600, color: selected ? '#fff' : PRD.text }}>{title}</span>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 400, color: selected ? 'rgba(255,255,255,0.82)' : PRD.sub, marginTop: 4 }}>{sub}</span>
      </span>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: selected ? 'none' : `2px solid ${PRD.track}`,
        background: selected ? '#fff' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={PRD.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>}
      </span>
    </button>
  );
}

function OnboardingProduct({ onNext = () => {}, onBack = () => {} }) {
  const [sel, setSel] = React.useState('cigarete');
  const [pressed, setPressed] = React.useState(false);
  const ready = sel !== null;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: PRD.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: PRD.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: PRD.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(4 / 18) * 100}%`, height: '100%', background: PRD.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${PRD.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: PRD.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Šta koristiš?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 16, fontWeight: 400, color: PRD.sub, lineHeight: 1.45 }}>
          Prilagodićemo Iskru tebi.
        </p>
      </div>

      {/* cards */}
      <div style={{ padding: '32px 26px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ProductCard Icon={CigaretteIcon} iconColor={PRD.accent} chipBg="#FEF0E8" title="Cigarete" sub="Klasično pušenje" selected={sel === 'cigarete'} onClick={() => setSel('cigarete')} />
        <ProductCard Icon={IqosIcon} iconColor="#4A6080" chipBg="#EDF2F8" title="IQOS" sub="Zagrevani duvan" selected={sel === 'iqos'} onClick={() => setSel('iqos')} />
      </div>

      <div style={{ flex: 1 }} />

      {/* button */}
      <div style={{ flexShrink: 0, padding: '0 26px 42px' }}>
        <button
          disabled={!ready}
          onClick={() => { if (ready) onNext(); }}
          onMouseDown={() => ready && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? `linear-gradient(180deg, #F0701F 0%, ${PRD.accent} 100%)` : '#F0D6C6',
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: ready && !pressed ? '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)' : 'none',
            transform: pressed ? 'scale(0.985)' : 'scale(1)',
            transition: 'transform 0.12s ease, box-shadow 0.15s ease, background 0.2s ease',
          }}>
          Nastavljam
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingProduct });

})();
