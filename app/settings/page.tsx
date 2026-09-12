"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Youtube, Trash2 } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

async function getAuthHeaders() {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token || '';
  return { Authorization: `Bearer ${token}` };
}

export default function SettingsPage() {
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    (async () => {
      const headers = await getAuthHeaders();
      const r = await fetch('/api/user/channel', { headers });
      const data = await r.json().catch(() => ({}));
      setChannel(data.connected ? data : null);
      setLoading(false);
    })();
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers.Authorization.replace('Bearer ', '')) {
        alert('Please log in first');
        setConnecting(false);
        return;
      }
      const res = await fetch('/api/auth/youtube', { headers });
      if (res.redirected) { window.location.href = res.url; return; }
      const j = await res.json().catch(() => ({}));
      if (j.url) { window.location.href = j.url; return; }
      alert(j.error || 'Could not start connection');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    const headers = await getAuthHeaders();
    await fetch('/api/user/channel', { method: 'DELETE', headers });
    setChannel(null);
  };

  return (
    <main className="min-h-screen text-white selection:bg-pink-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07060F]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">ThumbRank</span>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-12 px-4 sm:px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" /> YouTube Channel
          </h2>

          {loading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : channel ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{channel.channel_title}</p>
                  <p className="text-emerald-400 text-xs">Connected — CTR calibration active</p>
                </div>
              </div>
              <button
                onClick={disconnect}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/50 text-sm">Connect your YouTube channel to enable CTR calibration and Rescue Scanner.</p>
              <button
                onClick={connect}
                disabled={connecting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-blue-600 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Youtube className="w-4 h-4" /> {connecting ? 'Connecting…' : 'Connect YouTube Channel'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
