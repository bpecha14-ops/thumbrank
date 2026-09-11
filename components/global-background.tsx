'use client';

import { useEffect, useRef } from 'react';

/* ─── Cursor Glow (pink-blue, slow follow) ─── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    let raf: number;
    let tx = -1000, ty = -1000, cx = -1000, cy = -1000;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (ref.current) ref.current.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[3] hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, rgba(59,130,246,0.06) 35%, transparent 60%)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        willChange: 'transform',
        animation: 'cursorGlowPulse 6s ease-in-out infinite',
      }}
    />
  );
}

export default function GlobalBackground() {
  return (
    <>
      {/* Deep base */}
      <div className="fixed inset-0 bg-[#07060F] -z-50" />

      {/* Aurora field 1 — PINK (left) */}
      <div
        className="fixed w-[130vw] h-[130vw] max-w-[1400px] max-h-[1400px] rounded-full pointer-events-none z-0"
        style={{
          top: '-25%',
          left: '-25%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.28) 0%, rgba(219,39,119,0.12) 40%, transparent 70%)',
          filter: 'blur(130px)',
          animation: 'auroraDrift1 42s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Aurora field 2 — BLUE (right) */}
      <div
        className="fixed w-[130vw] h-[130vw] max-w-[1400px] max-h-[1400px] rounded-full pointer-events-none z-0"
        style={{
          bottom: '-25%',
          right: '-25%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.26) 0%, rgba(37,99,235,0.11) 40%, transparent 70%)',
          filter: 'blur(130px)',
          animation: 'auroraDrift2 46s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Aurora field 3 — ROSE accent (center, subtle) */}
      <div
        className="fixed w-[900px] h-[900px] rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          top: '30%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(244,114,182,0.14) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)',
          filter: 'blur(110px)',
          animation: 'auroraDrift3 38s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Vignette — keeps focus on content */}
      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,4,10,0.55) 100%)',
        }}
      />

      {/* Film grain — the "expensive" layer */}
      <div
        className="fixed inset-0 pointer-events-none z-[4] opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
        }}
      />

      <CursorGlow />
    </>
  );
}
