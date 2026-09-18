/* Iskra app UI kit — clean, reusable components extracted from the canonical
   screens (Home v3-1). Cosmetic recreations, not production logic.
   Load after React + Babel. Tokens mirror colors_and_type.css. */

const ISK = {
  bg: '#FDFCFA', bgWarm: '#FEF6F0', card: '#FFFFFF', border: '#ECE9E3',
  ember: '#E8621A', emberTop: '#F0701F', emberDeep: '#C9530F', emberTint: '#FEF0E8', emberSoft: '#FBEAE0',
  text: '#1A1A1A', sub: '#999999', faint: '#F1EDE6',
  emberGrad: 'linear-gradient(180deg, #F0701F 0%, #E8621A 100%)',
  shadowCard: '0 4px 14px rgba(26,22,15,0.04), 0 1px 2px rgba(26,22,15,0.022)',
  shadowSm: '0 2px 8px rgba(26,22,15,0.035)',
  shadowEmber: '0 8px 20px rgba(232,98,26,0.28)',
};
const CAT = {
  money: { fg: '#3A7A3A', chip: '#E1F1E1' },
  cig:   { fg: '#C24A43', chip: '#FBE9E7' },
  health:{ fg: '#3A7A3A', chip: '#E1F1E1' },
};
const GOAL = {
  zdravlje: '#D4547E', pluca: '#4A8AC4', ekologija: '#3A7A3A',
  finansije: '#2E8B80', telo: '#C4724A', nikotin: '#6B52A8',
};

// ── 24×24 line icon wrapper (the brand icon language) ──
function Ico({ size = 24, stroke = ISK.text, sw = 1.9, fill = 'none', children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
  );
}
const Flame = (p) => <Ico {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" /></Ico>;
const Spark = (p) => <Ico {...p} sw={p.sw || 1.8}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></Ico>;
const Coin = (p) => <Ico {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /></Ico>;
const CigOff = (p) => <Ico {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><line x1="3" y1="4" x2="21" y2="20.5" /></Ico>;

// ── Eyebrow label ──
function Eyebrow({ children, color = ISK.ember, style }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color, ...style }}>{children}</div>;
}

// ── Primary / secondary / text button ──
function Button({ children, variant = 'primary', icon, onClick, disabled }) {
  const [pressed, setPressed] = React.useState(false);
  const base = {
    width: '100%', height: 56, borderRadius: 16, cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    transition: 'transform 0.12s ease, box-shadow 0.12s ease', transform: pressed ? 'scale(0.985)' : 'scale(1)',
    WebkitTapHighlightColor: 'transparent', fontSize: 16, whiteSpace: 'nowrap',
  };
  const styles = {
    primary: { ...base, border: 'none', background: disabled ? '#F0D6C6' : ISK.emberGrad, color: '#fff', fontWeight: 700, boxShadow: (disabled || pressed) ? 'none' : ISK.shadowEmber },
    secondary: { ...base, background: '#fff', border: `1.5px solid #E8E8E8`, color: ISK.sub, fontWeight: 400 },
    text: { ...base, height: 40, background: 'none', border: 'none', color: ISK.sub, fontWeight: 400 },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={styles[variant]}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}>
      {icon}{children}
    </button>
  );
}

// ── Stat card (white, category icon chip + number) ──
function StatCard({ cat = 'money', icon, value, label, sub, onClick }) {
  const c = CAT[cat] || CAT.money;
  return (
    <button onClick={onClick} style={{
      flex: 1, textAlign: 'left', cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit',
      background: '#fff', border: `1px solid ${ISK.border}`, borderRadius: 18, padding: 18, boxShadow: ISK.shadowCard,
      WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{ width: 38, height: 38, borderRadius: '50%', background: c.chip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon ? icon(c.fg) : <Coin size={20} stroke={c.fg} sw={2} />}
      </span>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: c.fg, marginTop: 12 }}>{value}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: ISK.text, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, fontWeight: 500, color: '#BBB', marginTop: 3 }}>{sub}</div>}
    </button>
  );
}

// ── Option pill with the signature inverted selected state ──
function OptionPill({ label, icon, chip = '#FEF3E2', iconColor = '#BA7517', selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, borderRadius: 14, padding: 16, cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      background: selected ? ISK.emberGrad : '#fff',
      border: selected ? `1.5px solid ${ISK.ember}` : '1.5px solid #E8E8E8',
      boxShadow: selected ? '0 4px 12px rgba(232,98,26,0.24)' : 'none',
      transition: 'background 0.13s ease, border-color 0.13s ease', WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{ width: 40, height: 40, borderRadius: 10, background: selected ? '#fff' : chip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon ? icon(selected ? ISK.ember : iconColor) : null}
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: selected ? '#fff' : ISK.text }}>{label}</span>
    </button>
  );
}

// ── Progress bar ──
function ProgressBar({ pct, color = ISK.ember }) {
  return (
    <div style={{ width: '100%', height: 6, borderRadius: 999, background: ISK.faint, overflow: 'hidden' }}>
      <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: color }} />
    </div>
  );
}

// ── Bottom nav ──
function BottomNav({ active = 'home', onNav = () => {} }) {
  const items = [
    { key: 'home', label: 'Početna', d: <g><path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" /><path d="M9 21.5V13h6v8.5" /></g> },
    { key: 'ms', label: 'Milestoni', d: <g><path d="M4 22V4" /><path d="M4 4h11l-1.5 3.5L15 11H4" /></g> },
    { key: 'kb', label: 'Saznaj', d: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z" /> },
    { key: 'prof', label: 'Profil', d: <g><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></g> },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 12px 28px', borderTop: `1px solid ${ISK.border}`, background: ISK.bg }}>
      {items.map((n) => {
        const on = n.key === active;
        return (
          <button key={n.key} onClick={() => onNav(n.key)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, WebkitTapHighlightColor: 'transparent' }}>
            <Ico size={23} stroke={on ? ISK.ember : '#BDBAB3'} sw={on ? 2.1 : 1.9}>{n.d}</Ico>
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, color: on ? ISK.emberDeep : ISK.sub }}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { ISK, CAT, GOAL, Ico, Flame, Spark, Coin, CigOff, Eyebrow, Button, StatCard, OptionPill, ProgressBar, BottomNav });
