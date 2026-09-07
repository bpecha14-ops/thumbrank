'use client';

import { useEffect, useRef } from 'react';

/* ─── Cursor Spotlight ─── */
function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    let raf: number;
    let tx = -1000, ty = -1000, cx = -1000, cy = -1000;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (ref.current) ref.current.style.transform = `translate(${cx - 250}px, ${cy - 250}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none z-[5] hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, rgba(168,85,247,0.07) 40%, transparent 70%)',
        filter: 'blur(60px)',
        borderRadius: '50%',
        willChange: 'transform',
      }}
    />
  );
}

/* ─── Nebula Blobs ─── */
const blobs = [
  { style: { width: 900, height: 900, top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(236,72,153,0.40) 0%, transparent 70%)', animation: 'nebula-drift-1 55s ease-in-out infinite' } },
  { style: { width: 800, height: 800, top: '25%', right: '-20%', background: 'radial-gradient(circle, rgba(244,114,182,0.35) 0%, transparent 70%)', animation: 'nebula-drift-2 70s ease-in-out infinite' } },
  { style: { width: 850, height: 850, bottom: '-25%', left: '15%', background: 'radial-gradient(circle, rgba(219,39,119,0.32) 0%, transparent 70%)', animation: 'nebula-drift-3 45s ease-in-out infinite' } },
  { style: { width: 700, height: 700, top: '55%', left: '45%', background: 'radial-gradient(circle, rgba(251,113,133,0.28) 0%, transparent 70%)', animation: 'nebula-drift-4 80s ease-in-out infinite' } },
  { style: { width: 650, height: 650, bottom: '0%', right: '5%', background: 'radial-gradient(circle, rgba(190,24,93,0.25) 0%, transparent 70%)', animation: 'nebula-drift-5 60s ease-in-out infinite' } },
  { style: { width: 1000, height: 1000, top: '5%', left: '55%', background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)', animation: 'nebula-drift-6 85s ease-in-out infinite' } },
];

export default function GlobalBackground() {
  return (
    <>
      {/* Base dark layer */}
      <div className="fixed inset-0 bg-[#0a0a12] -z-50" />
      
      {/* Nebula blobs */}
      {blobs.map((b, i) => (
        <div
          key={i}
          className="fixed rounded-full pointer-events-none will-change-transform z-0"
          style={{ ...b.style, filter: 'blur(140px)' }}
        />
      ))}
      
      {/* Noise grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* Cursor spotlight */}
      <SpotlightCursor />
    </>
  );
}
