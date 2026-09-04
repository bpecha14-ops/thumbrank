'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ABTestDashboard() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ab/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;
  if (data?.error) return <div className="min-h-screen bg-black text-red-400 p-8">{data.error}</div>;

  const total = data.total_clicks || 0;
  const winner = data.winner;

  return (
    <div className="min-h-screen bg-black text-white p-8">
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
  );
}
