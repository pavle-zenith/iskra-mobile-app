/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingDate.jsx — Iskra onboarding: quit date picker (interactive calendar).

const DTE = {
  bg: '#FFFFFF', accent: '#E8621A', track: '#E8E8E8',
  text: '#1A1A1A', sub: '#999999', fine: '#BBBBBB', past: '#CCCCCC',
};

const MONTHS = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
const DOW = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
const TODAY = new Date(2026, 4, 31); // 31 May 2026
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function OnboardingDate({ onNext = () => {}, onBack = () => {} }) {
  const [view, setView] = React.useState({ y: 2026, m: 5 }); // June 2026
  const [sel, setSel] = React.useState(new Date(2026, 5, 15));
  const [pressed, setPressed] = React.useState(false);

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Mon-first
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const atMin = view.y < TODAY.getFullYear() || (view.y === TODAY.getFullYear() && view.m <= TODAY.getMonth());
  const step = (dir) => setView((v) => {
    let m = v.m + dir, y = v.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    return { y, m };
  });

  const arrow = (dir, disabled) => (
    <button onClick={() => !disabled && step(dir)} disabled={disabled} style={{
      width: 36, height: 36, borderRadius: 10, background: disabled ? 'transparent' : '#FAF8F5',
      border: 'none', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="9" height="15" viewBox="0 0 9 15" style={{ transform: dir < 0 ? 'none' : 'scaleX(-1)' }}>
        <path d="M7 1.5l-6 6 6 6" stroke="#7A766F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: DTE.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: DTE.text,
    }}>
      {/* progress */}
      <div style={{ height: 2, background: DTE.track, marginTop: 54, flexShrink: 0 }}>
        <div style={{ width: `${(12 / 18) * 100}%`, height: '100%', background: DTE.accent }} />
      </div>

      {/* back */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 13, background: '#FAF9F7',
          border: `1px solid ${DTE.track}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* question */}
      <div style={{ padding: '34px 26px 0', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: DTE.text, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Koji datum si izabrao/la?
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 400, color: DTE.sub, lineHeight: 1.45 }}>
          Možeš ga promeniti kasnije.
        </p>
      </div>

      {/* calendar card */}
      <div style={{ flex: 1, padding: '24px 26px 0' }}>
        <div style={{
          background: '#fff', border: `1.5px solid ${DTE.track}`, borderRadius: 18, padding: 22,
          boxShadow: '0 4px 14px rgba(26,22,15,0.04)',
        }}>
          {/* month row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            {arrow(-1, atMin)}
            <div style={{ fontSize: 18, fontWeight: 600, color: DTE.text, letterSpacing: '-0.01em' }}>{MONTHS[view.m]} {view.y}</div>
            {arrow(1, false)}
          </div>

          {/* day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
            {DOW.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: DTE.sub }}>{d}</div>
            ))}
          </div>

          {/* date grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4 }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={'e' + i} />;
              const date = new Date(view.y, view.m, d);
              const isPast = date < TODAY && !sameDay(date, TODAY);
              const isToday = sameDay(date, TODAY);
              const isSel = sameDay(date, sel);
              return (
                <div key={d} style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                  <button
                    onClick={() => !isPast && setSel(date)}
                    disabled={isPast}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', border: 'none',
                      cursor: isPast ? 'default' : 'pointer', fontFamily: 'inherit',
                      fontSize: 15, fontWeight: isSel ? 700 : 500,
                      color: isSel ? '#fff' : isPast ? DTE.past : DTE.text,
                      background: isSel ? `linear-gradient(180deg, #F0701F 0%, ${DTE.accent} 100%)` : 'transparent',
                      boxShadow: isSel ? '0 3px 8px rgba(232,98,26,0.32)' : isToday ? `inset 0 0 0 1.5px ${DTE.track}` : 'none',
                      WebkitTapHighlightColor: 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{d}</button>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ margin: '16px 6px 0', fontSize: 13, fontWeight: 400, color: DTE.fine, textAlign: 'center', lineHeight: 1.5 }}>
          Istraživanja pokazuju da postavljanje konkretnog datuma povećava šanse uspeha.<sup style={{ fontSize: 9 }}>1</sup>
          <br />
          <span style={{ fontStyle: 'italic' }}>West &amp; Sohal, BMJ 2006</span>
        </p>
      </div>

      {/* button */}
      <div style={{ flexShrink: 0, padding: '12px 26px 38px' }}>
        <button
          onClick={() => onNext(sel)}
          onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg, #F0701F 0%, ${DTE.accent} 100%)`,
            color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: pressed ? '0 1px 3px rgba(232,98,26,0.3)' : '0 8px 20px rgba(232,98,26,0.28), 0 2px 5px rgba(232,98,26,0.2)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
          Potvrdi datum
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingDate });

})();
