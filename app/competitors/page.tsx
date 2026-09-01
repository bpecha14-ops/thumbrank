"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Plus, Trash2, Users } from "lucide-react";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/competitors")
      .then((r) => r.json())
      .then((d) => {
        setCompetitors(d.competitors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const add = async () => {
    if (!handle) return;
    const res = await fetch("/api/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle }),
    });
    if (res.ok) {
      const data = await res.json();
      setCompetitors([data, ...competitors]);
      setHandle("");
    }
  };

  const remove = async (id: string) => {
    await fetch("/api/competitors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCompetitors(competitors.filter((c) => c.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#030305] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030305]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">ThumbRank</span>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Competitors</h1>
        </div>
        <p className="text-white/50 mb-8">Track what works in your niche.</p>

        <div className="flex gap-2 mb-6">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@channelname or channel URL"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={add}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : competitors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No competitors yet. Add your first to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {competitors.map((c: any) => (
              <div
                key={c.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-4"
              >
                <img src={c.channel_avatar} alt="" className="w-10 h-10 rounded-full bg-white/5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium">{c.channel_title}</div>
                  <div className="text-xs text-white/40">{c.avg_views?.toLocaleString()} avg views</div>
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
