/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// QuoteScreen.jsx — Iskra "Quote dana" detail (editorial). Standalone; opened from Home.

const QS = {
  bg: '#FDFCFA', card: '#FFFFFF', border: '#ECE9E3', brand: '#E8621A', brandSoft: '#FEF0E8',
  text: '#1A1A1A', sub: '#999999',
};

const QUOTE = {
  n: 47,
  tag: 'Humor',
  full: 'Lako je prestati pušiti. Prestajao sam stotinu puta.',
  author: 'Mark Twain',
  desc: 'Američki književnik, 1835–1910',
  comment: 'Mark Twain je pušio čibuke ceo život. Ali je ovo razumeo. Ti si na danu 47 — streak koji on nikad nije dostigao.',
};

function QuoteScreen({ onBack = () => {} }) {
  const [pressed, setPressed] = React.useState(false);
  const [fav, setFav] = React.useState(false);
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: QS.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: QS.text,
    }}>
      {/* top bar */}
      <div style={{ flexShrink: 0, padding: '56px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: QS.card, border: `1px solid ${QS.border}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 15, fontWeight: 500, color: QS.sub, pointerEvents: 'none' }}>Quote dana #{QUOTE.n}</div>
        <button onClick={() => setFav(!fav)} style={{
          width: 40, height: 40, borderRadius: 13, background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? QS.brand : 'none'} stroke={fav ? QS.brand : '#999'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* category tag — centered under title */}
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
        <span style={{
          display: 'inline-block', background: QS.brandSoft, color: QS.brand,
          fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 20,
        }}>{QUOTE.tag}</span>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px' }}>
        <span style={{ fontSize: 48, lineHeight: 0.7, color: QS.brand, opacity: 0.3, fontFamily: 'Georgia, "Times New Roman", serif', display: 'block' }}>“</span>
        <div style={{ fontSize: 26, fontWeight: 500, color: QS.text, lineHeight: 1.5, letterSpacing: '-0.01em', marginTop: 4 }}>{QUOTE.full}</div>
        <div style={{ height: 1, background: '#E8E8E8', margin: '24px 0 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: QS.brandSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(232,98,26,0.18)',
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: QS.brand, letterSpacing: '0.02em' }}>{QUOTE.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: QS.text }}>{QUOTE.author}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: QS.sub, marginTop: 3 }}>{QUOTE.desc}</div>
          </div>
        </div>

        {/* pagination dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{
              width: i === 0 ? 8 : 6, height: i === 0 ? 8 : 6, borderRadius: '50%',
              background: i === 0 ? QS.brand : '#DDDDDD',
            }} />
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 400, color: '#CCC', textAlign: 'center', marginTop: 10 }}>Prevuci za sledeći quote</div>
      </div>

      {/* bottom: fun fact + share */}
      <div style={{ flexShrink: 0, padding: '8px 26px 40px' }}>
        <div style={{
          background: QS.card, border: `1px solid #EEEEEE`, borderRadius: 14, padding: 16, marginBottom: 14,
          display: 'flex', gap: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={QS.brand} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
          </svg>
          <div style={{ fontSize: 13, fontWeight: 400, color: '#555', lineHeight: 1.6 }}>{QUOTE.comment}</div>
        </div>
        <button
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${QS.brand} 100%)`, color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
          Podeli quote
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { QuoteScreen });

})();
