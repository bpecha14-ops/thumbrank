'use client';

import { useEffect, useRef } from 'react';

/* ─── Cursor Glow ─── */
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
        background: 'radial-gradient(circle, rgba(255,160,160,0.12) 0%, rgba(255,120,120,0.06) 30%, transparent 60%)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        willChange: 'transform',
      }}
    />
  );
}

export default function GlobalBackground() {
  return (
    <>
      {/* Deep dark base */}
      <div className="fixed inset-0 bg-[#050508] -z-50" />

      {/* Aurora Blob 1 — Coral (top-right) */}
      <div
        className="fixed w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          top: '-15%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(255,120,100,0.35) 0%, rgba(255,100,100,0.15) 40%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'aurora1 25s ease-in-out infinite',
        }}
      />

      {/* Aurora Blob 2 — Peach (bottom-left) */}
      <div
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          bottom: '-20%',
          left: '-15%',
          background: 'radial-gradient(circle, rgba(255,180,140,0.30) 0%, rgba(255,160,120,0.12) 40%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'aurora2 30s ease-in-out infinite',
        }}
      />

      {/* Aurora Blob 3 — Soft Pink (center, subtle) */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          top: '35%',
          left: '45%',
          background: 'radial-gradient(circle, rgba(255,200,180,0.20) 0%, rgba(255,180,160,0.08) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora3 22s ease-in-out infinite',
        }}
      />

      {/* Noise Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[4] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
        }}
      />

      {/* Cursor Glow */}
      <CursorGlow />
    </>
  );
}
