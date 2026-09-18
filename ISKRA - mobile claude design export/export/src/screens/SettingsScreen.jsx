/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// SettingsScreen.jsx — Iskra settings / profile (long scrollable).

const ST = {
  bg: '#FDFCFA', accent: '#E8621A', card: '#FFFFFF', border: '#ECE9E3',
  text: '#1A1A1A', sub: '#999999', tint: '#FEF0E8', red: '#CC3333',
  rowDiv: '#F0EDE7',
};

function StIcon({ size = 20, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const PersonI = (p) => <StIcon {...p}><circle cx="12" cy="8" r="4" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></StIcon>;
const CalI = (p) => <StIcon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></StIcon>;
const CigOffI = (p) => <StIcon {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" /><line x1="3" y1="4" x2="21" y2="20.5" /></StIcon>;
const BellI = (p) => <StIcon {...p}><path d="M10.27 21a2 2 0 0 0 3.46 0" /><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33" /></StIcon>;
const GlobeI = (p) => <StIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19" /><path d="M12 2.5c2.6 2.7 4 6 4 9.5s-1.4 6.8-4 9.5c-2.6-2.7-4-6-4-9.5s1.4-6.8 4-9.5Z" /></StIcon>;
const StarI = (p) => <StIcon {...p}><path d="M12 2.5l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17l-6 3.4 1.4-6.8L2.3 9.5l6.9-.7L12 2.5Z" /></StIcon>;
const RefreshI = (p) => <StIcon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></StIcon>;
const DocI = (p) => <StIcon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h6" /></StIcon>;
const LockI = (p) => <StIcon {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></StIcon>;
const FlaskI = (p) => <StIcon {...p}><path d="M9 3h6" /><path d="M10 3v6.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V3" /><path d="M7.5 14h9" /></StIcon>;
const IgI = (p) => <StIcon {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></StIcon>;
const InI = (p) => <StIcon {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10v7" /><path d="M7 7v.01" /><path d="M11 17v-4a2 2 0 0 1 4 0v4" /><path d="M11 17v-7" /></StIcon>;
const ChatI = (p) => <StIcon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></StIcon>;
const MailI = (p) => <StIcon {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></StIcon>;
const QI = (p) => <StIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.6-2.8 2.6" /><path d="M12 17h.01" /></StIcon>;

function Chevron() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
      <path d="M1 1l6 6-6 6" stroke="#CFCBC4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: ST.sub, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 4px 8px', marginTop: 26 }}>{children}</div>
  );
}

function Card({ children }) {
  return (
    <div style={{ background: ST.card, border: `1px solid ${ST.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 14px rgba(26,22,15,0.04)' }}>
      {children}
    </div>
  );
}

function Row({ Icon, color, label, value, toggle, on, onToggle, first, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px',
      borderTop: first ? 'none' : `1px solid ${ST.rowDiv}`, WebkitTapHighlightColor: 'transparent',
    }}>
      {Icon && <Icon size={20} color={color} sw={1.9} />}
      <span style={{ flex: 1, fontSize: 15.5, fontWeight: 500, color: ST.text }}>{label}</span>
      {value && <span style={{ fontSize: 14, fontWeight: 500, color: value.ember ? ST.accent : ST.sub, whiteSpace: 'nowrap' }}>{value.text}</span>}
      {toggle
        ? <span onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }} style={{
            width: 46, height: 28, borderRadius: 999, flexShrink: 0, position: 'relative',
            background: on ? ST.accent : '#D8D4CD', transition: 'background 0.2s ease', cursor: 'pointer',
          }}>
            <span style={{
              position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%',
              background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s ease',
            }} />
          </span>
        : <Chevron />}
    </button>
  );
}

function SettingsScreen({ onBack = () => {} }) {
  const [notif, setNotif] = React.useState(true);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: ST.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: ST.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '56px 22px 0' }}>
        {/* header */}
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: ST.card, border: `1px solid ${ST.border}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <h1 style={{ margin: '0 0 18px', fontSize: 28, fontWeight: 600, color: ST.text, letterSpacing: '-0.02em' }}>Podešavanja</h1>

        {/* profile card */}
        <div style={{
          background: ST.card, border: `1px solid ${ST.border}`, borderRadius: 18, padding: 20,
          display: 'flex', alignItems: 'center', gap: 15, boxShadow: '0 4px 14px rgba(26,22,15,0.04)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: ST.tint, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600, color: ST.accent,
          }}>P</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: ST.text }}>Pavle</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: ST.accent, marginTop: 2 }}>Slobodan 47 dana</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: ST.sub, marginTop: 2 }}>Član od maja 2026.</div>
          </div>
          <Chevron />
        </div>

        {/* Moj profil */}
        <SectionLabel>Moj profil</SectionLabel>
        <Card>
          <Row first Icon={PersonI} color={ST.accent} label="Ime i pol" />
          <Row Icon={CalI} color="#4A6080" label="Datum prestanka" value={{ text: '31. maj 2026.' }} />
          <Row Icon={CigOffI} color="#4A6080" label="Stare navike" value={{ text: '20 cig · 400 RSD' }} />
        </Card>

        {/* Podešavanja */}
        <SectionLabel>Podešavanja</SectionLabel>
        <Card>
          <Row first Icon={BellI} color="#6B52A8" label="Notifikacije" toggle on={notif} onToggle={() => setNotif(!notif)} />
          <Row Icon={GlobeI} color="#3A7A3A" label="Jezik" value={{ text: 'Srpski' }} />
        </Card>

        {/* Premium */}
        <SectionLabel>Premium</SectionLabel>
        <Card>
          <Row first Icon={StarI} color={ST.accent} label="Moj plan" value={{ text: 'Godišnje', ember: true }} />
          <Row Icon={RefreshI} color="#4A6080" label="Obnovi kupovinu" />
        </Card>

        {/* O Iskri */}
        <SectionLabel>O Iskri</SectionLabel>
        <Card>
          <Row first Icon={DocI} color="#4A6080" label="Uslovi korišćenja" />
          <Row Icon={LockI} color="#4A6080" label="Politika privatnosti" />
          <Row Icon={FlaskI} color="#3A7A3A" label="Naučna osnova" />
          <Row Icon={IgI} color="#6B52A8" label="Iskra na Instagramu" />
          <Row Icon={InI} color="#4A6080" label="Iskra na LinkedIn-u" />
        </Card>

        {/* Moje iskustvo */}
        <SectionLabel>Moje iskustvo</SectionLabel>
        <Card>
          <Row first Icon={StarI} color={ST.accent} label="Oceni aplikaciju" />
          <Row Icon={ChatI} color="#4A6080" label="Predloži funkciju" />
          <Row Icon={MailI} color="#4A6080" label="Problem? Kontaktiraj nas" />
          <Row Icon={QI} color="#6B52A8" label="FAQ" />
        </Card>

        {/* Danger zone */}
        <div style={{ marginTop: 26 }}>
          <Card>
            <Row first Icon={RefreshI} color="#999" label="Počni iznova" />
            <button style={{
              width: '100%', background: 'none', border: 'none', borderTop: `1px solid ${ST.rowDiv}`,
              cursor: 'pointer', fontFamily: 'inherit', padding: '15px 16px',
              fontSize: 15.5, fontWeight: 600, color: ST.red, textAlign: 'center', WebkitTapHighlightColor: 'transparent',
            }}>Odjava</button>
          </Card>
        </div>

        {/* version */}
        <p style={{ margin: '22px 0 0', paddingBottom: 36, fontSize: 11, fontWeight: 400, color: '#CCC', textAlign: 'center' }}>
          Iskra v1.0.0 · Napravljeno u Srbiji 🇷🇸
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen });

})();
