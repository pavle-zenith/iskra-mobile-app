/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// MilestoniScreen.jsx — Iskra Milestoni tab. Achievement card collection.

const MS = {
  bg: '#FCFBF9', accent: '#E8621A', card: '#FFFFFF', border: '#ECE9E3',
  text: '#1A1A1A', sub: '#999999', lockText: '#CCCCCC',
};

// ── bottom-nav icon (identical to Home / Knowledge) ──
function NavI({ name, color, active }) {
  const paths = {
    home: <g><path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" /><path d="M9 21.5V13h6v8.5" /></g>,
    flag: <g><path d="M4 22V4" /><path d="M4 4h11l-1.5 3.5L15 11H4" /></g>,
    book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z" />,
    user: <g><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></g>,
  };
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2.1 : 1.9} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
  );
}

// ── achievement icons ──
function AchIcon({ kind, size = 28, color = '#fff' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'flame') return <svg {...common}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" /></svg>;
  if (kind === 'cal') return <svg {...common}><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>;
  if (kind === 'star') return <svg {...common}><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.8 6.7 19.6l1.1-6L3.4 9.4l6-.8Z" /></svg>;
  if (kind === 'drop') return <svg {...common}><path d="M12 3s6 6.4 6 10.5A6 6 0 0 1 6 13.5C6 9.4 12 3 12 3Z" /></svg>;
  if (kind === 'lock') return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
  return null;
}

function ShareRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)' }}>PODELI</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 3v13M7 8l5-5 5 5" />
      </svg>
    </div>
  );
}

function UnlockedCard({ icon, value, label, bg }) {
  return (
    <div style={{
      background: bg, borderRadius: 20, padding: 20, aspectRatio: '1 / 1.15',
      display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(120,80,40,0.10)',
    }}>
      <AchIcon kind={icon} size={28} color="#fff" />
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.82)', marginTop: 2, lineHeight: 1.3 }}>{label}</div>
      <div style={{ marginTop: 14 }}><ShareRow /></div>
    </div>
  );
}

function LockedCard({ value, remaining, cat, catColor, catBg }) {
  return (
    <div style={{
      background: MS.card, border: `1.5px solid #EEEEEE`, borderRadius: 20, padding: 20, aspectRatio: '1 / 1.15',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: catColor, background: catBg, padding: '4px 9px', borderRadius: 20, textTransform: 'uppercase' }}>{cat}</span>
        <AchIcon kind="lock" size={22} color={MS.lockText} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 20, fontWeight: 600, color: MS.lockText, letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: MS.accent, marginTop: 4 }}>{remaining}</div>
    </div>
  );
}

function MilestoniScreen({ onHome = () => {}, onKnowledge = () => {} }) {
  const unlocked = [
    { icon: 'flame', value: 'Dan 1', label: 'Slobode.', bg: 'linear-gradient(155deg, #F0701F 0%, #E8621A 100%)' },
    { icon: 'cal', value: '7 dana', label: 'Prva nedelja.', bg: 'linear-gradient(155deg, #C8821C 0%, #BA7517 100%)' },
    { icon: 'star', value: '30 dana', label: 'Mesec slobode.', bg: 'linear-gradient(155deg, #34795A 0%, #2D6A4F 100%)' },
    { icon: 'drop', value: 'Čist', label: 'Nikotin izašao iz krvi.', bg: 'linear-gradient(155deg, #347FBE 0%, #2D6FA8 100%)' },
  ];
  const locked = [
    { value: '50 dana', remaining: 'još 3 dana', cat: 'Vreme', catColor: '#C9530F', catBg: '#FEF0E8' },
    { value: '10.000 RSD', remaining: 'još 1.200 RSD', cat: 'Finansije', catColor: '#2E8B80', catBg: '#E6F4F1' },
    { value: '100 poriva', remaining: 'još 77 poriva', cat: 'Porivi', catColor: '#6B52A8', catBg: '#F0EDF8' },
    { value: '1 godina', remaining: 'još 318 dana', cat: 'Vreme', catColor: '#C9530F', catBg: '#FEF0E8' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: MS.bg, fontFamily: '"Manrope", system-ui, sans-serif' }}>
      {/* scroll body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '68px 16px 0' }}>
        {/* hero card */}
        <div style={{
          position: 'relative', borderRadius: 26, overflow: 'hidden', minHeight: 188,
          backgroundImage: 'url("assets/sky-bg.webp")', backgroundSize: 'cover', backgroundPosition: 'center 28%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '22px 22px 20px', boxShadow: '0 10px 26px rgba(70,110,150,0.18)',
        }}>
          {/* legibility scrim */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(40,70,110,0) 32%, rgba(40,70,110,0.22) 70%, rgba(40,70,110,0.42) 100%)', pointerEvents: 'none' }} />
          <h1 style={{ position: 'relative', margin: 0, fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 1px 12px rgba(30,60,100,0.28)' }}>Milestoni</h1>
          <div style={{ position: 'relative', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.92)', marginTop: 5, textShadow: '0 1px 10px rgba(30,60,100,0.3)' }}>12 otključano · 8 čeka</div>
        </div>

        {/* unlocked */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: MS.sub, marginTop: 24, paddingLeft: 6 }}>OTKLJUČANO</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12, padding: '0 6px' }}>
          {unlocked.map((c, i) => <UnlockedCard key={i} {...c} />)}
        </div>

        {/* locked */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: MS.sub, marginTop: 28, paddingLeft: 6 }}>ČEKA TE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12, padding: '0 6px' }}>
          {locked.map((c, i) => <LockedCard key={i} {...c} />)}
        </div>

        <div style={{ height: 20 }} />
      </div>

      {/* bottom nav */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '11px 12px 28px', borderTop: `1px solid ${MS.border}`, background: MS.bg,
      }}>
        {[
          { key: 'home', name: 'home', label: 'Početna', active: false, onClick: onHome },
          { key: 'ms', name: 'flag', label: 'Milestoni', active: true, onClick: () => {} },
          { key: 'kb', name: 'book', label: 'Saznaj', active: false, onClick: onKnowledge },
          { key: 'prof', name: 'user', label: 'Profil', active: false, onClick: onHome },
        ].map((n) => (
          <button key={n.key} onClick={n.onClick} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 0',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <NavI name={n.name} color={n.active ? MS.accent : '#BDBAB3'} active={n.active} />
            <span style={{ fontSize: 10.5, fontWeight: n.active ? 700 : 500, color: n.active ? '#C9530F' : '#999999' }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MilestoniScreen });
})();
