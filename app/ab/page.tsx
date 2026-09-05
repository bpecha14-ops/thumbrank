'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function ABTestDashboard() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ab?id=${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [id]);

  if (!id) return <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden"><Nebula /><div className="relative z-10">No test ID provided</div></div>;
  if (loading) return <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden"><Nebula /><div className="relative z-10">Loading...</div></div>;
  if (data?.error) return <div className="min-h-screen bg-black text-red-400 p-8 relative overflow-hidden"><Nebula /><div className="relative z-10">{data.error}</div></div>;

  const total = data.total_clicks || 0;
  const winner = data.winner;

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      <Nebula />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">A/B Test Results</h1>
        <p className="text-zinc-400 mb-8">Test ID: {id}</p>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-300 mb-2">Variant A</h2>
            <p className="text-5xl font-bold text-purple-400">{data.clicks_a || 0}</p>
            <p className="text-zinc-500 mt-1">{data.ctr_a || '0.0'}% CTR</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-300 mb-2">Variant B</h2>
            <p className="text-5xl font-bold text-purple-400">{data.clicks_b || 0}</p>
            <p className="text-zinc-500 mt-1">{data.ctr_b || '0.0'}% CTR</p>
          </div>
        </div>

        {winner && winner !== 'Tie' && (
          <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 text-center">
            <p className="text-2xl font-bold text-purple-300">🏆 Winner: Variant {winner}</p>
            <p className="text-zinc-400 mt-2">Total clicks: {total}</p>
          </div>
        )}
        {winner === 'Tie' && (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 text-center">
            <p className="text-xl text-zinc-300">🤝 It&apos;s a tie</p>
            <p className="text-zinc-500 mt-2">Total clicks: {total}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Nebula() {
  return (
    <>
      <div className="nebula-blob nebula-1" />
      <div className="nebula-blob nebula-2" />
      <div className="nebula-blob nebula-3" />
      <div className="nebula-blob nebula-4" />
      <div className="nebula-blob nebula-5" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8 relative overflow-hidden"><Nebula /><div className="relative z-10">Loading...</div></div>}>
      <ABTestDashboard />
    </Suspense>
  );
}
