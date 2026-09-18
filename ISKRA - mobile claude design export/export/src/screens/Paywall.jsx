/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// Paywall.jsx — Iskra paywall (long scrollable).

const PW = {
  bg: '#FDFCFA', accent: '#E8621A', accentDeep: '#C9530F',
  card: '#FFFFFF', border: '#ECE9E3', text: '#1A1A1A', sub: '#999999',
  body: '#555555', fine: '#BBBBBB', tint: '#FEF0E8', green: '#3A7A3A', greenBg: '#EDF7ED',
  pill: '#F1EEE9',
  // two-paths
  redText: '#CC3333', redBorder: '#FFDDDD', redBg: '#FFF8F8',
  goodText: '#2E8B2E', goodBorder: '#DDEECC', goodBg: '#F8FFF5',
};

function PwIcon({ size = 20, color = '#1A1A1A', sw = 1.9, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const Flame = (p) => <PwIcon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" /></PwIcon>;
const CigOff = (p) => <PwIcon {...p}><rect x="2.5" y="13" width="13.5" height="4" rx="1.4" /><line x1="11.5" y1="13" x2="11.5" y2="17" /><path d="M18 8.5c.9.7.9 1.8 0 2.5" /><path d="M20.5 7c1.3 1 1.3 2.6 0 3.6" /><line x1="3" y1="4" x2="21" y2="20.5" /></PwIcon>;
const Coin = (p) => <PwIcon {...p}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></PwIcon>;
const Shield = (p) => <PwIcon {...p}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" /><path d="m9 12 2 2 4-4" /></PwIcon>;

const BENEFITS = [
  'Panic button — dostupan 24/7',
  'Health milestones i live countdown',
  'RSD brojač u realnom vremenu',
  'Quote dana + edukativni sadržaj',
  'Personalizovani plan prestanka',
  'Slip flow — bez osude, bez reseta',
];

const WITHOUT = [
  'Porivi te savladavaju bez alata',
  'Svaki pad deluje kao kraj',
  'Niko ne razume tvoj kontekst',
  'Para odlazi na cigarete i dalje',
  'Još jedna godina bez promene',
];
const WITH = [
  'Panic button za svaki poriv',
  'Pad nije kraj — nastavljaš dalje',
  'Aplikacija napravljena za naš život',
  'Svaki dan bez cigarete štediš pare',
  'Streak koji raste dan po dan',
];

const REVIEWS = [
  { initial: 'M', name: 'Marija, 34', quote: 'Nisam verovala da mogu. Posle prvog meseca, cigareta mi više nije ni na umu.' },
  { initial: 'N', name: 'Nikola, 29', quote: 'Panic button me spasio u kafani tri puta za prvu nedelju. Radi.' },
  { initial: 'J', name: 'Jelena, 41', quote: 'Konačno aplikacija koja govori našim jezikom i razume naš život.' },
];

const FAQS = [
  { q: 'Šta ako posrnem?', a: 'Ništa strašno. Slip flow te vraća na pravi put bez osude i bez resetovanja tvog streaka — jedan korak unazad nije poraz.' },
  { q: 'Šta ako su porivi prejaki?', a: 'Panic button te vodi kroz svaki poriv korak po korak. Većina prolazi za 3 do 5 minuta — Iskra je tu celo vreme.' },
  { q: 'Šta ako ne izdržim u kafani?', a: 'Imaćeš gotovu skriptu za društvene situacije i brzi pristup panic button-u kad pritisak postane jak.' },
];

function Check({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#FEF0E8" />
      <path d="M7.5 12.2l3 3 6-6.5" stroke="#E8621A" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Stars({ size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#E8621A">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17l-6 3.4 1.4-6.8L2.3 9l6.9-.7L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
function XMark({ size = 19, color = '#CC3333' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#FBE4E4" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function CheckGreen({ size = 19, color = '#2E8B2E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#E4F3E0" />
      <path d="M7.5 12.2l3 3 6-6.5" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Radio({ on }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
      border: on ? `7px solid ${PW.accent}` : `2px solid #D8D4CD`,
      background: '#fff', boxSizing: 'border-box',
      transition: 'border 0.15s ease',
    }} />
  );
}

function TierBody({ on, title, priceLine, strike, badge, perDay, perDayLabel, rightText, big }) {
  return (
    <React.Fragment>
      <Radio on={on} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 500, color: PW.text, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 400, color: PW.sub, marginTop: 2 }}>
          {priceLine}{strike && <span style={{ textDecoration: 'line-through', color: '#CCC', marginLeft: 7 }}>{strike}</span>}
        </div>
        {badge && (
          <div style={{
            display: 'inline-block', marginTop: 9, fontSize: 11.5, fontWeight: 600,
            color: PW.green, background: PW.greenBg, padding: '4px 12px', borderRadius: 20,
          }}>{badge}</div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 64 }}>
        {rightText
          ? <div style={{ fontSize: 13, fontWeight: 500, color: PW.body }}>{rightText}</div>
          : <div>
              <span style={{ fontSize: big ? 28 : 20, fontWeight: big ? 700 : 600, color: big ? PW.accent : PW.text, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{perDay}</span>
              <div style={{ fontSize: 12, fontWeight: 500, color: PW.sub, marginTop: 1 }}>{perDayLabel}</div>
            </div>}
      </div>
    </React.Fragment>
  );
}

// Popular tier — full-width banner header attached seamlessly to the card.
function PopularTier({ id, sel, onSel, ...rest }) {
  const on = sel === id;
  return (
    <div style={{ borderRadius: 16, boxShadow: on ? '0 8px 22px rgba(232,98,26,0.18)' : '0 4px 14px rgba(232,98,26,0.10)' }}>
      <div style={{
        background: `linear-gradient(180deg, #F0701F 0%, ${PW.accent} 100%)`, color: '#fff',
        borderRadius: '14px 14px 0 0', padding: '8px 0', textAlign: 'center',
        fontSize: 12.5, fontWeight: 700, letterSpacing: '0.02em',
      }}>★ Najpopularnije</div>
      <button onClick={() => onSel(id)} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        background: '#fff', border: `2px solid ${PW.accent}`, borderTop: 'none',
        borderRadius: '0 0 14px 14px', padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 14, boxSizing: 'border-box',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <TierBody on={on} big {...rest} />
      </button>
    </div>
  );
}

function PriceTier({ id, sel, onSel, ...rest }) {
  const on = sel === id;
  return (
    <button onClick={() => onSel(id)} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      background: '#fff', border: on ? `2px solid ${PW.accent}` : `1.5px solid ${PW.border}`,
      borderRadius: 16, padding: on ? '19px 23px' : '19.5px 23.5px',
      display: 'flex', alignItems: 'center', gap: 14, boxSizing: 'border-box',
      boxShadow: on ? '0 6px 18px rgba(232,98,26,0.14)' : 'none',
      transition: 'border 0.15s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <TierBody on={on} {...rest} />
    </button>
  );
}

function ComparePath({ good, header, items }) {
  const Icon = good ? CheckGreen : XMark;
  return (
    <div style={{
      background: good ? PW.goodBg : PW.redBg,
      border: `1px solid ${good ? PW.goodBorder : PW.redBorder}`,
      borderRadius: 16, padding: 20,
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: good ? PW.goodText : PW.redText, marginBottom: 4 }}>
        {good ? '✓' : '✕'} {header}
      </div>
      {items.map((t, i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: i === 0 ? 'none' : `1px solid ${good ? PW.goodBorder : PW.redBorder}` }}>
          <Icon size={19} />
          <span style={{ fontSize: 14, fontWeight: 500, color: PW.text, lineHeight: 1.3 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function FaqRow({ q, a, open, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${PW.border}` }}>
      <button onClick={onToggle} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 12, padding: '16px 4px', textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: PW.text }}>{q}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0ACA5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <p style={{ margin: '0 4px', padding: '0 0 16px', fontSize: 13.5, fontWeight: 400, color: PW.body, lineHeight: 1.5 }}>{a}</p>
      )}
    </div>
  );
}

function SectionCard({ children, style }) {
  return (
    <div style={{
      background: PW.card, border: `1px solid ${PW.border}`, borderRadius: 18, padding: 20,
      boxShadow: '0 4px 14px rgba(26,22,15,0.04)', ...style,
    }}>{children}</div>
  );
}

function Paywall({ onBuy = () => {}, onFree = () => {} }) {
  const [sel, setSel] = React.useState('godisnje');
  const [openFaq, setOpenFaq] = React.useState(null);
  const [pressed, setPressed] = React.useState(false);
  const [secs, setSecs] = React.useState(9 * 60 + 47);
  React.useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: PW.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: PW.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* close */}
        <div style={{ padding: '52px 22px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onFree} style={{
            width: 34, height: 34, borderRadius: '50%', background: '#ECE8E2', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A867F" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div style={{ padding: '8px 22px 0' }}>
          {/* 1 — header */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: PW.text, letterSpacing: '-0.02em', lineHeight: 1.25, textWrap: 'balance' }}>
              Pavle, tvoj plan je spreman.
            </h1>
            <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 400, color: '#888' }}>Manje od jedne cigarete dnevno.</p>
          </div>

          {/* 2 — countdown */}
          <SectionCard style={{ borderRadius: 16, padding: 16, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: PW.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flame size={20} color={PW.accent} sw={2} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: PW.text, lineHeight: 1.3, maxWidth: 140 }}>Specijalna cena ističe za:</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: PW.accent, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>{mm} : {ss}</div>
              <div style={{ fontSize: 12, fontWeight: 400, color: PW.sub, marginTop: 1 }}>minuta : sekundi</div>
            </div>
          </SectionCard>

          {/* 3 — user data pills */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {[{ Icon: CigOff, t: '20 cigareta dnevno' }, { Icon: Coin, t: '146.000 RSD godišnje' }].map((p) => (
              <div key={p.t} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                background: PW.pill, borderRadius: 20, padding: '10px 14px',
              }}>
                <p.Icon size={17} color={PW.accent} sw={2} />
                <span style={{ fontSize: 13, fontWeight: 600, color: PW.text, whiteSpace: 'nowrap' }}>{p.t}</span>
              </div>
            ))}
          </div>

          {/* 4 — pricing tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 20 }}>
            <PriceTier id="mesecno" sel={sel} onSel={setSel} title="Mesečno" priceLine="590 RSD/mesečno" perDay="20 RSD" perDayLabel="/dnevno" />
            <PopularTier id="godisnje" sel={sel} onSel={setSel} title="Godišnje" priceLine="2.990 RSD" strike="7.080 RSD"
              badge="Manje od jedne cigarete dnevno" perDay="8 RSD" perDayLabel="/dnevno" />
            <PriceTier id="dozivotno" sel={sel} onSel={setSel} title="Doživotno" priceLine="4.990 RSD jednokratno" rightText="Bez pretplate" />
          </div>

          {/* 5 — CTA */}
          <button
            onClick={onBuy}
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
            style={{
              width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer', marginTop: 20,
              background: `linear-gradient(180deg, #F0701F 0%, ${PW.accent} 100%)`,
              color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
              boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.3), 0 2px 5px rgba(232,98,26,0.22)',
              transform: pressed ? 'scale(0.99)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            }}>
            Uzmi moj plan
          </button>
          <p style={{ margin: '12px 0 0', fontSize: 12, fontWeight: 400, color: PW.fine, textAlign: 'center' }}>Otkazuješ kad hoćeš. Bez obaveza.</p>

          {/* 6 — payment trust */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 18, color: '#A8A5A0' }}>
            {['Apple Pay', 'Visa', 'Mastercard', 'PayPal'].map((p, i) => (
              <React.Fragment key={p}>
                {i > 0 && <span style={{ color: '#D8D4CD' }}>·</span>}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p}</span>
              </React.Fragment>
            ))}
          </div>

          {/* 7 — what you get */}
          <SectionCard style={{ marginTop: 26 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: PW.text, marginBottom: 4 }}>Šta dobijaš</div>
            {BENEFITS.map((b, i) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${PW.border}` }}>
                <Check size={19} />
                <span style={{ fontSize: 14, fontWeight: 500, color: PW.text, lineHeight: 1.3 }}>{b}</span>
              </div>
            ))}
          </SectionCard>

          {/* 8 — money back */}
          <SectionCard style={{ borderRadius: 16, marginTop: 18, display: 'flex', alignItems: 'flex-start', gap: 15 }}>
            <Shield size={32} color={PW.green} sw={1.8} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: PW.text, letterSpacing: '-0.01em' }}>30 dana garancija povraćaja</div>
              <p style={{ margin: '5px 0 0', fontSize: 13, fontWeight: 400, color: '#888', lineHeight: 1.5 }}>Ako nisi zadovoljan/na, vraćamo novac. Bez pitanja.</p>
            </div>
          </SectionCard>

          {/* 9 — two paths */}
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, color: PW.text, marginTop: 30, letterSpacing: '-0.01em' }}>Dva puta napred</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            <ComparePath good={false} header="Bez Iskre" items={WITHOUT} />
            <ComparePath good={true} header="Sa Iskrom" items={WITH} />
          </div>

          {/* 10 — reviews */}
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, color: PW.text, marginTop: 30, letterSpacing: '-0.01em' }}>Šta kažu korisnici</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {REVIEWS.map((r) => (
              <SectionCard key={r.name} style={{ borderRadius: 16, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: PW.tint, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: PW.accent,
                  }}>{r.initial}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: PW.text }}>{r.name}</div>
                    <div style={{ marginTop: 4 }}><Stars size={13} /></div>
                  </div>
                </div>
                <p style={{ margin: '13px 0 0', fontSize: 13, fontStyle: 'italic', color: PW.body, lineHeight: 1.55 }}>„{r.quote}”</p>
              </SectionCard>
            ))}
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 11, fontWeight: 400, color: PW.fine, textAlign: 'center' }}>Recenzije su od verifikovanih korisnika.</p>

          {/* 11 — FAQ */}
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, color: PW.text, marginTop: 30, letterSpacing: '-0.01em' }}>Često pitaju</div>
          <SectionCard style={{ borderRadius: 16, padding: '4px 16px', marginTop: 16 }}>
            {FAQS.map((f, i) => (
              <FaqRow key={f.q} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </SectionCard>

          {/* 12 — secondary link */}
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <button onClick={onFree} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 500, color: PW.sub, WebkitTapHighlightColor: 'transparent',
            }}>Nastavi sa besplatnom verzijom</button>
          </div>

          {/* 13 — legal */}
          <p style={{ margin: '14px 0 0', paddingBottom: 36, fontSize: 11, fontWeight: 400, color: '#CCC', textAlign: 'center', lineHeight: 1.5 }}>
            Uslovi korišćenja · Politika privatnosti · Obnovi kupovinu
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Paywall });

})();
