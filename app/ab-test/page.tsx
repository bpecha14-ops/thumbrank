'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThumbnailUpload } from '@/components/thumbnail-upload';
import { YouTubeMockup, MockupVideo } from '@/components/youtube-mockup';
import { CtrScoreCard } from '@/components/ctr-score-card';
import { calculateCtrScore, CtrBreakdown } from '@/lib/ctr-score';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { toPng } from 'html-to-image';
import { Download, Loader2, Lock, Sparkles, AlertCircle, Plus, Trash2, Trophy } from 'lucide-react';

interface Variant {
  id: string;
  thumb: string | null;
  title: string;
  ctr: CtrBreakdown | null;
  scoring: boolean;
}

export default function ABTestPage() {
  const { user, isPro, loading } = useAuth();

  const [keyword, setKeyword] = useState('how to grow on youtube');
  const [channelName, setChannelName] = useState('Your Channel');
  const [viewCount, setViewCount] = useState('1.2M');
  const [uploadDate, setUploadDate] = useState('3 days ago');
  const [duration, setDuration] = useState('12:45');

  const [variants, setVariants] = useState<Variant[]>([
    { id: 'v1', thumb: null, title: 'Variant A — My YouTube Video Title', ctr: null, scoring: false },
    { id: 'v2', thumb: null, title: 'Variant B — Alternative Title Here', ctr: null, scoring: false },
  ]);
  const [competitorThumb, setCompetitorThumb] = useState<string | null>(null);
  const [compTitle, setCompTitle] = useState('Top Competitor — How They Got 1M Views');
  const [compChannel, setCompChannel] = useState('Top Channel');
  const [compViews, setCompViews] = useState('847K');
  const [compDate, setCompDate] = useState('1 week ago');
  const [compDuration, setCompDuration] = useState('15:32');

  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!loading && user && !isPro) {}
  }, [user, isPro, loading]);

  useEffect(() => {
    if (!isPro) return;
    variants.forEach((v) => {
      if (!v.thumb || v.ctr || v.scoring) return;
      setVariants((prev) => prev.map((p) => (p.id === v.id ? { ...p, scoring: true } : p)));
      calculateCtrScore(v.thumb)
        .then((b) => {
          setVariants((prev) => prev.map((p) => (p.id === v.id ? { ...p, ctr: b, scoring: false } : p)));
        })
        .catch(() => {
          setVariants((prev) => prev.map((p) => (p.id === v.id ? { ...p, scoring: false } : p)));
        });
    });
  }, [isPro, variants]);

  const updateVariant = (id: string, patch: Partial<Variant>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const addVariant = () => {
    if (variants.length >= 3) return;
    const id = `v${variants.length + 1}`;
    setVariants([...variants, { id, thumb: null, title: `Variant ${String.fromCharCode(64 + variants.length + 1)} — New Title`, ctr: null, scoring: false }]);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 2) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const buildVideos = (v: Variant): MockupVideo[] => [
    { thumbnailUrl: v.thumb, title: v.title, channelName: channelName, channelVerified: true, viewCount: viewCount, uploadDate: uploadDate, duration: duration, isUser: true },
    { thumbnailUrl: competitorThumb, title: compTitle, channelName: compChannel, channelVerified: true, viewCount: compViews, uploadDate: compDate, duration: compDuration },
  ];

  const handleExport = useCallback(async (id: string) => {
    const node = mockupRefs.current[id];
    if (!node) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2, backgroundColor: '#0f0f0f' });
      const link = document.createElement('a');
      link.download = `thumbrank-abtest-${id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError('Failed to export PNG.');
    } finally {
      setExporting(false);
    }
  }, []);

  const scored = variants.filter((v) => v.ctr);
  const bestVariant = scored.length > 0 ? scored.reduce((best, v) => (v.ctr!.score > best.ctr!.score ? v : best)) : null;

  if (!loading && user && !isPro) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <SiteNav />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/15">
            <Lock className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">A/B Testing is a Pro feature</h1>
          <p className="mt-4 text-neutral-400 text-lg">Upload 2-3 thumbnail variants and compare them side-by-side in a real YouTube search mockup with CTR scores.</p>
          <Link href="/redeem" className="inline-block mt-8"><Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white glow-purple">Upgrade to Pro — $12/month</Button></Link>
          <Link href="/tool" className="block mt-4"><Button variant="link" className="text-neutral-400">Use the free tool instead →</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">A/B Test Thumbnails</h1>
          <p className="mt-2 text-sm text-neutral-400">Compare up to 3 thumbnail variants side-by-side in a real YouTube search mockup. CTR scores update automatically.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {bestVariant && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm">
            <Trophy className="h-5 w-5 text-green-400 shrink-0" />
            <span className="text-neutral-200"><span className="text-white font-medium">Variant {bestVariant.id.toUpperCase()}</span> is winning with a CTR score of <span className="text-green-400 font-medium">{bestVariant.ctr!.score}/100</span></span>
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111] p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Shared settings (applied to all variants)</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div><Label className="text-neutral-400 text-xs">Search keyword</Label><Input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
            <div><Label className="text-neutral-400 text-xs">Channel name</Label><Input value={channelName} onChange={(e) => setChannelName(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
            <div><Label className="text-neutral-400 text-xs">View count</Label><Input value={viewCount} onChange={(e) => setViewCount(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
            <div><Label className="text-neutral-400 text-xs">Upload date</Label><Input value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
            <div><Label className="text-neutral-400 text-xs">Duration</Label><Input value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111] p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Competitor (shown next to each variant)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ThumbnailUpload label="Competitor thumbnail" dataUrl={competitorThumb} onChange={setCompetitorThumb} />
            <div className="grid grid-cols-2 gap-3 content-start">
              <div className="col-span-2"><Label className="text-neutral-400 text-xs">Title</Label><Input value={compTitle} onChange={(e) => setCompTitle(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
              <div><Label className="text-neutral-400 text-xs">Channel</Label><Input value={compChannel} onChange={(e) => setCompChannel(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
              <div><Label className="text-neutral-400 text-xs">Views</Label><Input value={compViews} onChange={(e) => setCompViews(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {variants.map((v, idx) => (
            <div key={v.id} className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs text-white">{String.fromCharCode(65 + idx)}</span>
                  Variant {String.fromCharCode(65 + idx)}
                </h3>
                {variants.length > 2 && (
                  <button onClick={() => removeVariant(v.id)} className="text-neutral-500 hover:text-red-400 transition-colors" aria-label="Remove variant"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
              <ThumbnailUpload label="Thumbnail" dataUrl={v.thumb} onChange={(url) => updateVariant(v.id, { thumb: url, ctr: null })} compact />
              <div className="mt-3"><Input value={v.title} onChange={(e) => updateVariant(v.id, { title: e.target.value })} placeholder="Video title" className="bg-[#0a0a0a] border-white/10 text-white text-xs" /></div>
              <div className="mt-4">
                {v.scoring ? (
                  <div className="flex items-center gap-2 text-sm text-neutral-400"><Loader2 className="h-4 w-4 animate-spin text-violet-400" /> Scoring…</div>
                ) : v.ctr ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-1">
                      <span className={`text-3xl font-bold ${v.ctr.score >= 80 ? 'text-green-400' : v.ctr.score >= 65 ? 'text-violet-400' : v.ctr.score >= 45 ? 'text-yellow-400' : 'text-red-400'}`}>{v.ctr.score}</span>
                      <span className="text-sm text-neutral-500 mb-1">/100</span>
                    </div>
                    <span className="text-xs text-neutral-400 ml-auto">{v.ctr.label}</span>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500">Upload a thumbnail to see CTR score</p>
                )}
              </div>
              {v.thumb && (
                <div className="mt-4">
                  <div ref={(el) => { mockupRefs.current[v.id] = el; }} className="rounded-xl border border-white/10 overflow-hidden">
                    <YouTubeMockup keyword={keyword} videos={buildVideos(v)} compact />
                  </div>
                  <Button onClick={() => handleExport(v.id)} disabled={exporting} variant="outline" size="sm" className="mt-3 w-full border-white/10 text-white hover:bg-white/5">
                    {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Export PNG
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {variants.length < 3 && (
          <button onClick={addVariant} className="mt-6 w-full rounded-2xl border-2 border-dashed border-white/10 py-6 text-neutral-400 hover:border-violet-500/40 hover:text-violet-400 transition-colors flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" /> Add variant {variants.length + 1}/3
          </button>
        )}

        {scored.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-white mb-4">Detailed CTR breakdown</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {variants.filter((v) => v.ctr).map((v, idx) => (
                <CtrScoreCard key={v.id} breakdown={v.ctr!} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
