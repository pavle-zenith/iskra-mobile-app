/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// SlipReflectScreen.jsx — Iskra "Šta me je nateralo?" reflection (single-select + inline response).

const RF = {
  bg: '#FDFCFA', accent: '#E8621A', track: '#EEEEEE', tint: '#FEF0E8',
  text: '#1A1A1A', sub: '#999999', body: '#555555',
};

function RfIcon({ size = 18, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const CoffeeI = (p) => <RfIcon {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M6 2v2M10 2v2M14 2v2" /></RfIcon>;
const SunI = (p) => <RfIcon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></RfIcon>;
const PeopleI = (p) => <RfIcon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></RfIcon>;
const StormI = (p) => <RfIcon {...p}><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></RfIcon>;
const ForkI = (p) => <RfIcon {...p}><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" /><path d="M5 11v11" /><path d="M19 2v20" /><path d="M19 14c2 0 2.5-2 2.5-5 0-4-1-7-2.5-7s-2.5 3-2.5 7c0 3 .5 5 2.5 5Z" /></RfIcon>;
const BeerI = (p) => <RfIcon {...p}><path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6M13 12v6" /><path d="M14 7.5c1.5 0 3 .8 3 2.5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.7 1.5-2.5 3-2.5" /><path d="M7 7.5a2.5 2.5 0 0 1 .5-4.5A3 3 0 0 1 13 3a2.5 2.5 0 0 1 1 4.5" /></RfIcon>;
const ClockI = (p) => <RfIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5l3.5 2" /></RfIcon>;
const QI = (p) => <RfIcon {...p}><circle cx="12" cy="12" r="9.5" /><path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.6-2.8 2.6" /><path d="M12 17h.01" /></RfIcon>;

const TRIGGERS = [
  { key: 'kafa', label: 'Trenutno sam pio/la kafu', chip: '#FEF3E2', color: '#BA7517', Icon: CoffeeI, resp: 'Kafa i cigareta su jedan od najjačih uslovnih refleksa. Sad znaš gde da paziš.' },
  { key: 'budjenje', label: 'Upravo sam se probudio/la', chip: '#FEF0E8', color: '#E8621A', Icon: SunI, resp: 'Jutarnji poriv je najjači jer je nivo nikotina najniži. Prođe za par minuta.' },
  { key: 'okolina', label: 'Svi oko mene su pušili', chip: '#EDF2F8', color: '#4A6080', Icon: PeopleI, resp: 'Društveni okidač je stvaran. Sledeći put — voda u ruci, korak u stranu.' },
  { key: 'stres', label: 'Bio/la sam jako pod stresom', chip: '#EDF2F8', color: '#4A6080', Icon: StormI, resp: 'Nikotin ne smanjuje stres — samo gasi apstinenciju. Disanje radi bolje.' },
  { key: 'jelo', label: 'Upravo sam završio/la sa jelom', chip: '#EDF7ED', color: '#3A7A3A', Icon: ForkI, resp: 'Cigareta posle jela je navika, ne potreba. Probaj šetnju ili čaj.' },
  { key: 'alkohol', label: 'Pio/la sam alkohol', chip: '#F0EDF8', color: '#6B52A8', Icon: BeerI, resp: 'Alkohol ruši odbranu i pojačava poriv. Dobro je znati svoj okidač.' },
  { key: 'dosada', label: 'Bilo mi je dosadno', chip: '#F1EEE9', color: '#999999', Icon: ClockI, resp: 'Dosada traži stimulaciju. Telefon, voda, pokret — sve radi umesto dima.' },
  { key: 'drugo', label: 'Nešto drugo', chip: '#F1EEE9', color: '#999999', Icon: QI, resp: 'Svaki okidač koji prepoznaš je jedan manje koji te iznenadi.' },
];

function SlipReflectScreen({ onClose = () => {}, onContinue = () => {} }) {
  const [sel, setSel] = React.useState(null);
  const [pressed, setPressed] = React.useState(false);
  const selected = TRIGGERS.find((t) => t.key === sel);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: RF.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: RF.text,
    }}>
      {/* top bar */}
      <div style={{ padding: '56px 22px 0', flexShrink: 0 }}>
        <button onClick={onClose} style={{
          width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '20px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: RF.text, letterSpacing: '-0.01em' }}>Šta te je nateralo?</h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, fontWeight: 400, color: RF.sub }}>Tapni — razumećemo zajedno.</p>
      </div>

      {/* list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 26px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TRIGGERS.map((t) => {
            const on = sel === t.key;
            return (
              <button key={t.key} onClick={() => setSel(t.key)} style={{
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                display: 'flex', alignItems: 'center', gap: 13,
                borderRadius: 12, padding: on ? '13px 15px' : '13.5px 15.5px',
                border: on ? `1.5px solid ${RF.accent}` : `1px solid ${RF.track}`,
                background: on ? `linear-gradient(180deg, #F0701F 0%, ${RF.accent} 100%)` : '#fff',
                boxShadow: on ? '0 4px 12px rgba(232,98,26,0.24)' : 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'background 0.13s ease, border-color 0.13s ease, box-shadow 0.13s ease',
              }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: on ? '#fff' : t.chip, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <t.Icon size={18} color={on ? RF.accent : t.color} sw={1.9} />
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: on ? '#fff' : RF.text }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* fixed bottom: inline response + button */}
      {selected && (
        <div style={{ flexShrink: 0, padding: '10px 26px 38px', animation: 'rfIn 0.22s ease both' }}>
          <div style={{
            background: '#FEF6F0', borderRadius: 16, padding: '16px 16px 16px 14px', marginBottom: 14,
            border: '1px solid #F7D9C5', display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#FEF0E8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RF.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="M12 16v-5" /><path d="M12 8h.01" /></svg>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 400, color: RF.body, lineHeight: 1.55, paddingTop: 1 }}>{selected.resp}</div>
          </div>
          <button
            onClick={onContinue}
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
            style={{
              width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
              background: `linear-gradient(180deg, #F0701F 0%, ${RF.accent} 100%)`, color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
              boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.26), 0 2px 5px rgba(232,98,26,0.2)',
              transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            }}>
            Razumem
          </button>
        </div>
      )}

      <style>{`@keyframes rfIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

Object.assign(window, { SlipReflectScreen });

})();
