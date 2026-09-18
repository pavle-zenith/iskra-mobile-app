/* __IIFE_WRAPPED__ — helpers kept file-local to avoid global collisions in the combined prototype */
;(function () {
// OnboardingCommitment.jsx — Iskra onboarding: ceremonial signature / contract (full ember).

const CMT = {
  bg: '#E8621A', accent: '#E8621A', text: '#FFFFFF',
};

const PLEDGES = [
  'Prestane da pušim, dan po dan',
  'Otvori Iskru kad bude teško',
  'Ne odustajem posle pada',
  'Biram zdravlje, porodicu i slobodu',
];

function CheckW({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <path d="M7.5 12.3l3 3 6-6.4" stroke="#E8621A" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SignaturePad({ signed, setSigned }) {
  const canvasRef = React.useRef(null);
  const drawing = React.useRef(false);
  const last = React.useRef(null);

  const ctxOf = () => {
    const c = canvasRef.current;
    if (!c) return null;
    const ctx = c.getContext('2d');
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    return ctx;
  };

  // Pre-draw a sample cursive signature so the box looks already signed.
  const drawSample = React.useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const y = c.height * 0.6;
    ctx.moveTo(40, y);
    ctx.bezierCurveTo(50, y - 55, 70, y - 60, 72, y - 10);
    ctx.bezierCurveTo(74, y + 18, 60, y + 22, 66, y - 5);
    ctx.bezierCurveTo(72, y - 30, 92, y - 28, 96, y);
    ctx.bezierCurveTo(99, y + 14, 110, y + 10, 116, y - 8);
    ctx.bezierCurveTo(126, y - 40, 140, y - 30, 138, y + 4);
    ctx.bezierCurveTo(150, y - 18, 168, y - 16, 176, y - 2);
    ctx.bezierCurveTo(184, y + 10, 196, y + 6, 206, y - 14);
    ctx.bezierCurveTo(214, y - 30, 226, y - 24, 232, y - 4);
    ctx.stroke();
    // underline flourish
    ctx.beginPath();
    ctx.moveTo(34, y + 26);
    ctx.bezierCurveTo(120, y + 36, 180, y + 14, 250, y + 24);
    ctx.stroke();
  }, []);

  React.useEffect(() => {
    if (signed) drawSample();
    else { const c = canvasRef.current; if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); }
  }, [signed, drawSample]);

  const pos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const sx = c.width / rect.width, sy = c.height / rect.height;
    return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
  };
  const start = (e) => {
    e.preventDefault();
    if (signed) { // first new stroke clears the sample
      const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height);
    }
    drawing.current = true; last.current = pos(e); setSigned(true);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = ctxOf(); if (!ctx) return;
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last.current = p;
  };
  const end = () => { drawing.current = false; };

  return (
    <div style={{ position: 'relative', marginTop: 18 }}>
      <div style={{
        position: 'relative', height: 160, borderRadius: 16,
        background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)',
        overflow: 'hidden',
      }}>
        <canvas
          ref={canvasRef} width={300} height={160}
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'crosshair' }}
        />
        {!signed && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)',
          }}>Potpiši se ovde</div>
        )}
        {signed && (
          <button onClick={() => setSigned(false)} style={{
            position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function OnboardingCommitment({ onNext = () => {}, onBack = () => {} }) {
  const [signed, setSigned] = React.useState(true);
  const [pressed, setPressed] = React.useState(false);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: CMT.bg, fontFamily: '"Manrope", system-ui, sans-serif', color: CMT.text,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '58px 26px 8px' }}>
        {/* wordmark */}
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '3px', color: '#fff', opacity: 0.92 }}>ISKRA</div>

        {/* headline */}
        <h1 style={{ margin: '26px 0 0', fontSize: 30, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.22 }}>
          Pavle, sklapamo dogovor.
        </h1>

        {/* section label */}
        <div style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginTop: 24, marginBottom: 4 }}>Od danas, obavezujem se da:</div>

        {/* pledges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 14 }}>
          {PLEDGES.map((p) => (
            <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
              <div style={{ marginTop: 1 }}><CheckW size={22} /></div>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* belief line */}
        <p style={{ margin: '20px 0 0', fontSize: 15, fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
          I verujem da će me Iskra voditi svakog koraka.
        </p>

        {/* signature */}
        <SignaturePad signed={signed} setSigned={setSigned} />
        <p style={{ margin: '12px 0 0', fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
          * Potpis se ne čuva. Samo za tebe.
        </p>
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0, padding: '12px 26px 38px' }}>
        <button
          disabled={!signed}
          onClick={() => { if (signed) onNext(); }}
          onMouseDown={() => signed && setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
          style={{
            width: '100%', height: 56, borderRadius: 16, border: 'none',
            cursor: signed ? 'pointer' : 'default',
            background: '#fff', color: CMT.accent, opacity: signed ? 1 : 0.55,
            fontSize: 17, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit',
            boxShadow: signed && !pressed ? '0 8px 22px rgba(120,44,0,0.26)' : 'none',
            transform: pressed ? 'scale(0.985)' : 'scale(1)', transition: 'transform 0.12s ease, box-shadow 0.12s ease, opacity 0.15s ease',
          }}>
          Potpisujem
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingCommitment });

})();
