/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// KnowledgeScreen.jsx — Iskra "Saznaj" knowledge base (scrollable).

const KB = {
  bg: '#F7F6F3', accent: '#E8621A', card: '#FFFFFF', border: '#ECE9E3',
  text: '#1A1A1A', sub: '#999999', body: '#888888', fine: '#CCCCCC',
};

function KbIcon({ size = 24, color = '#fff', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const Brain = (p) => <KbIcon {...p}><path d="M12 5a3 3 0 0 0-5.6-1.5A2.5 2.5 0 0 0 4 6.5 2.5 2.5 0 0 0 4 11a2.5 2.5 0 0 0 2 4 3 3 0 0 0 6 0V5Z" /><path d="M12 5a3 3 0 0 1 5.6-1.5A2.5 2.5 0 0 1 20 6.5 2.5 2.5 0 0 1 20 11a2.5 2.5 0 0 1-2 4 3 3 0 0 1-6 0" /></KbIcon>;
const Bolt = (p) => <KbIcon {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></KbIcon>;
const People = (p) => <KbIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></KbIcon>;
const Leaf = (p) => <KbIcon {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></KbIcon>;
const Wind = (p) => <KbIcon {...p}><path d="M12.8 19.6A2 2 0 1 0 14 16H2" /><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" /><path d="M9.8 4.4A2 2 0 1 1 11 8H2" /></KbIcon>;
const Heart = (p) => <KbIcon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" /></KbIcon>;
const Flask = (p) => <KbIcon {...p}><path d="M9 3h6" /><path d="M10 3v6.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V3" /><path d="M7.5 14h9" /></KbIcon>;
const Lock = (p) => <KbIcon {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></KbIcon>;

const CATS = [
  { label: 'Razumeti zavisnost', n: '5 članaka', bg: '#6B52A8', Icon: Brain },
  { label: 'Nositi se sa porivima', n: '6 članaka', bg: '#E8621A', Icon: Bolt },
  { label: 'Kafana i društvo', n: '4 članka', bg: '#4A6080', Icon: People },
  { label: 'Ishrana i gojenje', n: '4 članka', bg: '#3A7A3A', Icon: Leaf },
  { label: 'Stres bez cigarete', n: '5 članaka', bg: '#4A8AC4', Icon: Wind },
  { label: 'Priče iz prve ruke', n: '6 članaka', bg: '#D4547E', Icon: Heart },
];

const POPULAR = [
  { tag: 'Porivi', color: '#E8621A', title: 'Šta zaista radi mozak tokom poriva', min: '4 min', lock: true },
  { tag: 'Kafana', color: '#4A6080', title: 'Skripta za odbijanje cigarete bez nelagode', min: '3 min', lock: false },
  { tag: 'Zavisnost', color: '#6B52A8', title: 'Mit o nikotinu kao leku za stres', min: '5 min', lock: true },
];

const NEW = [
  { tag: 'Ishrana', color: '#3A7A3A', min: '5 min', title: 'Kako izbeći gojenje posle prestanka', desc: 'Praktični saveti za apetit u prvim nedeljama.' },
  { tag: 'Zdravlje', color: '#D4547E', min: '6 min', title: 'Šta se dešava u telu prvih 30 dana', desc: 'Dan po dan kroz oporavak organizma.' },
];

function SectionLabel({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 500, color: KB.sub, textTransform: 'uppercase', letterSpacing: '1px', margin: '26px 0 14px' }}>{children}</div>;
}
function Tag({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, fontWeight: 600, color,
      background: color + '1A', padding: '4px 10px', borderRadius: 999,
    }}>{label}</span>
  );
}

// nav icons
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

function KnowledgeScreen({ onHome = () => {} }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: KB.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: KB.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '58px 22px 8px' }}>
        {/* header */}
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: KB.text, letterSpacing: '-0.02em' }}>Saznaj</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 400, color: KB.sub }}>Sve što treba da znaš o prestanku</p>

        {/* featured */}
        <button style={{
          position: 'relative', overflow: 'hidden',
          width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', border: 'none',
          background: `linear-gradient(150deg, #F0701F 0%, ${KB.accent} 100%)`, borderRadius: 20,
          minHeight: 160, padding: 24, marginTop: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: '0 10px 26px rgba(232,98,26,0.26)', WebkitTapHighlightColor: 'transparent',
        }}>
          {/* photo texture, blended into the ember surface */}
          <div style={{
            position: 'absolute', inset: 0, backgroundImage: 'url("assets/canyon-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center 45%',
            opacity: 0.6, mixBlendMode: 'soft-light', filter: 'saturate(0.8)', pointerEvents: 'none',
          }} />
          <span style={{
            position: 'relative', alignSelf: 'flex-start', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.04em',
            background: 'rgba(255,255,255,0.2)', padding: '5px 11px', borderRadius: 999,
          }}>PREPORUČENO</span>
          <div style={{ position: 'relative', marginTop: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>Zašto porivi traju samo 5 minuta — nauka iza toga</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginTop: 12 }}>6 min čitanja</div>
          </div>
        </button>

        {/* categories */}
        <SectionLabel>Kategorije</SectionLabel>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -22px', padding: '0 22px 4px', WebkitOverflowScrolling: 'touch' }}>
          {[...CATS, { label: 'Naučni fakti', n: '8 članaka', bg: '#2E8B80', Icon: Flask }].map((c) => (
            <button key={c.label} style={{
              flexShrink: 0, width: 176, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', border: 'none',
              background: c.bg, borderRadius: 16, padding: 16, minHeight: 150,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14,
              WebkitTapHighlightColor: 'transparent',
            }}>
              <c.Icon size={24} color="#fff" sw={1.9} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.25 }}>{c.label}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{c.n}</div>
              </div>
            </button>
          ))}
        </div>

        {/* popular */}
        <SectionLabel>Popularno</SectionLabel>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -22px', padding: '0 22px 4px', WebkitOverflowScrolling: 'touch' }}>
          {POPULAR.map((p) => (
            <button key={p.title} style={{
              flexShrink: 0, width: 176, minHeight: 150, boxSizing: 'border-box', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              background: KB.card, border: `1px solid ${KB.border}`, borderRadius: 16, padding: 16,
              boxShadow: '0 4px 14px rgba(26,22,15,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <div><Tag label={p.tag} color={p.color} /></div>
              <div style={{ fontSize: 14, fontWeight: 500, color: KB.text, lineHeight: 1.35, marginTop: 12, flex: 1 }}>{p.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: KB.sub }}>{p.min}</span>
                {p.lock && <Lock size={15} color={KB.fine} sw={2} />}
              </div>
            </button>
          ))}
        </div>

        {/* new */}
        <SectionLabel>Novo</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {NEW.map((a) => (
            <button key={a.title} style={{
              width: '100%', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              background: KB.card, border: `1px solid ${KB.border}`, borderRadius: 16, padding: 16,
              boxShadow: '0 4px 14px rgba(26,22,15,0.04)', WebkitTapHighlightColor: 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tag label={a.tag} color={a.color} />
                <span style={{ fontSize: 12, fontWeight: 500, color: KB.sub }}>{a.min}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: KB.text, marginTop: 11, letterSpacing: '-0.01em' }}>{a.title}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: KB.body, marginTop: 4, lineHeight: 1.45 }}>{a.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* bottom nav */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '11px 12px 28px', borderTop: `1px solid ${KB.border}`, background: KB.bg,
      }}>
        {[
          { key: 'home', name: 'home', label: 'Početna', active: false, onClick: onHome },
          { key: 'ms', name: 'flag', label: 'Milestoni', active: false, onClick: onHome },
          { key: 'kb', name: 'book', label: 'Saznaj', active: true, onClick: () => {} },
          { key: 'prof', name: 'user', label: 'Profil', active: false, onClick: onHome },
        ].map((n) => (
          <button key={n.key} onClick={n.onClick} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 0',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <NavI name={n.name} color={n.active ? KB.accent : '#BDBAB3'} active={n.active} />
            <span style={{ fontSize: 10.5, fontWeight: n.active ? 700 : 500, color: n.active ? '#C9530F' : '#999999' }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { KnowledgeScreen });

})();
