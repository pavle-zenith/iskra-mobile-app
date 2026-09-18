/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// TimeScreen.jsx — Iskra "Tvoje vreme" timeline detail (scrollable).

const TS = {
  bg: '#FFFFFF', amber: '#BA7517', accent: '#E8621A', green: '#3A7A3A', rose: '#D4547E',
  card: '#FFFFFF', border: '#ECE9E3', line: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', body: '#555555', fine: '#BBBBBB',
};

function TsIcon({ size = 22, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const Hourglass = (p) => <TsIcon {...p}><path d="M6 2h12M6 22h12" /><path d="M6 2c0 4 3 5.5 6 8 3-2.5 6-4 6-8" /><path d="M6 22c0-4 3-5.5 6-8 3 2.5 6 4 6 8" /></TsIcon>;
const Cal = (p) => <TsIcon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></TsIcon>;
const Share = (p) => <TsIcon {...p}><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></TsIcon>;
const Plane = (p) => <TsIcon {...p}><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.2 4-2 2-2-.5a.5.5 0 0 0-.5.8l2 2 2 2 .8-.5a.5.5 0 0 0 .8-.5l-.5-2 2-2 4 3.2a.5.5 0 0 0 .8-.5Z" /></TsIcon>;
const Rocket = (p) => <TsIcon {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></TsIcon>;
const Wave = (p) => <TsIcon {...p}><path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></TsIcon>;
const Moon = (p) => <TsIcon {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></TsIcon>;
const Brain = (p) => <TsIcon {...p}><path d="M12 5a3 3 0 0 0-5.6-1.5A2.5 2.5 0 0 0 4 6.5 2.5 2.5 0 0 0 4 11a2.5 2.5 0 0 0 2 4 3 3 0 0 0 6 0V5Z" /><path d="M12 5a3 3 0 0 1 5.6-1.5A2.5 2.5 0 0 1 20 6.5 2.5 2.5 0 0 1 20 11a2.5 2.5 0 0 1-2 4 3 3 0 0 1-6 0" /></TsIcon>;

const PAST = [
  { d: 'Dan 1', t: 'Let Beograd—Njujork i nazad', Icon: Plane },
  { d: 'Dan 3', t: 'Astronauti stignu do ISS', Icon: Rocket },
  { d: 'Dan 7', t: 'Prosečan odmor na moru', Icon: Wave },
  { d: 'Dan 10', t: 'Artemis 2 orbita oko Meseca', Icon: Moon },
  { d: 'Dan 14', t: 'Mozak počinje da gradi novu naviku', Icon: Brain },
];
const UPCOMING = [
  { d: 'Dan 66', t: 'Navika postaje automatska' },
  { d: 'Dan 90', t: 'Fizička zavisnost od nikotina nestaje' },
  { d: 'Dan 100', t: 'Sto dana slobode' },
  { d: 'Dan 365', t: 'Jedna godina' },
];

function Card({ children, style }) {
  return (
    <div style={{
      background: TS.card, border: `1px solid ${TS.border}`, borderRadius: 18, padding: 24,
      boxShadow: '0 4px 14px rgba(26,22,15,0.04)', ...style,
    }}>{children}</div>
  );
}

// timeline row
function TLRow({ d, t, kind }) {
  // kind: 'past' | 'current' | 'future'
  const color = kind === 'past' ? TS.green : kind === 'current' ? TS.accent : '#CCC';
  return (
    <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
      {/* dot column */}
      <div style={{ width: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {kind === 'current' ? (
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(232,98,26,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: TS.accent }} />
          </div>
        ) : (
          <div style={{
            width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0,
            background: kind === 'past' ? TS.green : '#fff',
            border: kind === 'future' ? `2px solid #CCC` : 'none',
            boxSizing: 'border-box',
          }} />
        )}
      </div>
      {/* content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 20 }}>
        {kind === 'current' ? (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TS.accent }}>{d} — Ti si ovde</div>
            <div style={{ fontSize: 13, fontWeight: 400, fontStyle: 'italic', color: TS.accent, marginTop: 3 }}>{t}</div>
          </div>
        ) : (
          <div style={{ fontSize: 13, fontWeight: 400, color: kind === 'past' ? TS.body : '#CCC', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600 }}>{d}</span> · {t}
          </div>
        )}
      </div>
    </div>
  );
}

function TimeScreen({ onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: TS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: TS.text,
    }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 22px 10px', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7', border: `1px solid ${TS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: TS.text }}>Tvoje vreme</span>
        <button style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7', border: `1px solid ${TS.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Share size={19} color="#999" sw={1.9} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>
        {/* hero — ember card */}
        <div style={{
          background: TS.accent, borderRadius: 20, padding: 28, marginTop: 8,
          boxShadow: '0 10px 26px rgba(232,98,26,0.24)',
        }}>
          <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', marginBottom: 18 }}>SLOBODAN/NA VEĆ</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[{ v: '47', l: 'DANA' }, { v: '06', l: 'SATI' }, { v: '18', l: 'MINUTA' }, { v: '32', l: 'SEKUNDE' }].map((c) => (
              <div key={c.l} style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 16, textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, fontWeight: 500, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{c.v}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', marginTop: 8 }}>{c.l}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '20px 0 14px' }} />
          <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>od poslednje cigarete</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: '20px 0 8px' }}>
          {/* timeline — full milestone cards connected by a dotted road */}
          <div style={{ fontSize: 14, fontWeight: 500, color: TS.text, marginBottom: 4 }}>Šta si sve preživeo/la</div>

          {PAST.map((m) => (
            <React.Fragment key={m.d}>
              <div style={{
                background: TS.card, border: `1px solid ${TS.border}`, borderRadius: 16, padding: 20,
                boxShadow: '0 4px 14px rgba(26,22,15,0.04)', display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 400, color: TS.sub }}>{m.d}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: TS.text, marginTop: 3, letterSpacing: '-0.01em' }}>{m.t}</div>
                </div>
                <m.Icon size={24} color={TS.green} sw={1.8} />
              </div>
              <div style={{ height: 22, borderLeft: `2px dotted #D8D4CD`, margin: '0 auto', width: 0 }} />
            </React.Fragment>
          ))}

          {/* current */}
          <div style={{
            background: '#FEF0E8', border: `2px solid ${TS.accent}`, borderRadius: 16, padding: 20,
          }}>
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 700, color: TS.accent, letterSpacing: '0.06em',
              background: '#FEF0E8', border: `1px solid ${TS.accent}`, padding: '3px 9px', borderRadius: 999,
            }}>TI SI OVDE</span>
            <div style={{ fontSize: 13, fontWeight: 500, color: TS.accent, marginTop: 11 }}>Dan 47</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: TS.text, marginTop: 3, letterSpacing: '-0.01em' }}>Duže od Artemis misije.</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: TS.sub, marginTop: 6 }}>Samo još 19 dana do sledećeg.</div>
          </div>

          {/* upcoming */}
          {UPCOMING.map((m) => (
            <React.Fragment key={m.d}>
              <div style={{ height: 22, borderLeft: `2px dotted #D8D4CD`, margin: '0 auto', width: 0 }} />
              <div style={{
                background: TS.card, border: `1px solid #EEEEEE`, borderRadius: 16, padding: 20, opacity: 0.5,
              }}>
                <div style={{ fontSize: 13, fontWeight: 400, color: TS.sub }}>{m.d}</div>
                <div style={{ fontSize: 18, fontWeight: 400, color: TS.sub, marginTop: 3 }}>{m.t}</div>
              </div>
            </React.Fragment>
          ))}

          <div style={{ height: 8 }} />

          {/* last relapse */}
          <Card style={{ borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Cal size={24} color={TS.rose} sw={1.9} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: TS.sub }}>Prethodni pad</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: TS.text, marginTop: 1 }}>12. april 2026.</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: TS.fine, marginTop: 2 }}>35 dana bez pada pre toga</div>
            </div>
          </Card>

          {/* time saved */}
          <Card style={{ borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: TS.text, marginBottom: 14 }}>Vreme koje si povratio/la</div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 500, color: TS.amber, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>109 sati</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: TS.sub, marginTop: 4 }}>provedenih na paljenju</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: TS.border }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 500, color: TS.amber, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>4.5 dana</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: TS.sub, marginTop: 4 }}>čistog vremena</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 400, fontStyle: 'italic', color: TS.fine, marginTop: 14, textAlign: 'center' }}>Svaka cigareta = ~7 minuta</div>
          </Card>

          {/* share */}
          <button
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
            style={{
              width: '100%', height: 52, borderRadius: 16, background: '#fff', border: `1.5px solid ${TS.amber}`,
              cursor: 'pointer', fontFamily: 'inherit', color: TS.amber, fontSize: 15, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 4,
              transform: pressed ? 'scale(0.99)' : 'scale(1)', transition: 'transform 0.12s ease',
              WebkitTapHighlightColor: 'transparent',
            }}>
            <Share size={18} color={TS.amber} sw={2} />
            Podeli svoju pobedu
          </button>

          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TimeScreen });

})();
