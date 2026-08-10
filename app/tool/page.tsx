'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
import { Download, Loader2, Lock, Sparkles, AlertCircle, Check } from 'lucide-react';

export default function ToolPage() {
  const { user, profile, loading, isPro, refreshProfile } = useAuth();
  const mockupRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState('');
  const [userThumb, setUserThumb] = useState<string | null>(null);
  const [comp1Thumb, setComp1Thumb] = useState<string | null>(null);
  const [comp2Thumb, setComp2Thumb] = useState<string | null>(null);

  const [userTitle, setUserTitle] = useState('Your Amazing YouTube Video Title Here');
  const [userChannel, setUserChannel] = useState('Your Channel');
  const [userViews, setUserViews] = useState('1.2M');
  const [userDate, setUserDate] = useState('3 days ago');
  const [userDuration, setUserDuration] = useState('12:45');

  const [comp1Title, setComp1Title] = useState('Competitor Video Title — How They Did It');
  const [comp1Channel, setComp1Channel] = useState('Competitor Channel');
  const [comp1Views, setComp1Views] = useState('847K');
  const [comp1Date, setComp1Date] = useState('1 week ago');
  const [comp1Duration, setComp1Duration] = useState('15:32');

  const [comp2Title, setComp2Title] = useState('Another Competitor — The Full Breakdown');
  const [comp2Channel, setComp2Channel] = useState('Another Channel');
  const [comp2Views, setComp2Views] = useState('2.1M');
  const [comp2Date, setComp2Date] = useState('2 weeks ago');
  const [comp2Duration, setComp2Duration] = useState('10:12');

  const [rendering, setRendering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ctrScore, setCtrScore] = useState<CtrBreakdown | null>(null);
  const [scoring, setScoring] = useState(false);
  const [canPreview, setCanPreview] = useState(true);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { setCanPreview(true); setRemaining(null); return; }
    if (isPro) { setCanPreview(true); setRemaining(null); return; }
    getSupabase()
      .rpc('can_preview')
      .then(({ data }: any) => {
        if (data) { setCanPreview(data.allowed); setRemaining(data.remaining); }
      });
  }, [user, isPro, loading]);

  useEffect(() => {
    if (!isPro || !userThumb) { setCtrScore(null); return; }
    setScoring(true);
    let cancelled = false;
    calculateCtrScore(userThumb)
      .then((b) => { if (!cancelled) setCtrScore(b); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setScoring(false); });
    return () => { cancelled = true; };
  }, [isPro, userThumb]);

  const videos: MockupVideo[] = [
    { thumbnailUrl: userThumb, title: userTitle, channelName: userChannel, channelVerified: true, viewCount: userViews, uploadDate: userDate, duration: userDuration, isUser: true },
    { thumbnailUrl: comp1Thumb, title: comp1Title, channelName: comp1Channel, channelVerified: true, viewCount: comp1Views, uploadDate: comp1Date, duration: comp1Duration },
    { thumbnailUrl: comp2Thumb, title: comp2Title, channelName: comp2Channel, channelVerified: true, viewCount: comp2Views, uploadDate: comp2Date, duration: comp2Duration },
  ];

  const handleRender = useCallback(async () => {
    if (!userThumb) { setError('Please upload your thumbnail first.'); return; }
    setError(null);
    setRendering(true);
    if (user && !isPro) {
      const supabase = getSupabase();
      const { data: canData }: any = await supabase.rpc('can_preview');
      if (canData && !canData.allowed) {
        setCanPreview(false); setRemaining(0); setRendering(false);
        setError('You have used all 3 free previews this month. Upgrade to Pro for unlimited previews.');
        return;
      }
      const { data: recData }: any = await supabase.rpc('record_preview');
      if (recData) { setRemaining(recData.remaining); }
      await refreshProfile();
    }
    setTimeout(() => setRendering(false), 600);
  }, [userThumb, user, isPro, refreshProfile]);

  const handleExport = useCallback(async () => {
    if (!mockupRef.current) return;
    setExporting(true);
    setError(null);
    try {
      const dataUrl = await toPng(mockupRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#0f0f0f' });
      const link = document.createElement('a');
      link.download = `thumbrank-${keyword || 'preview'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError('Failed to export PNG. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [keyword]);

  const showLimitBanner = !!(user && !isPro && !canPreview);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Thumbnail Preview Tool</h1>
          <p className="mt-2 text-sm text-neutral-400">Upload your thumbnail, add competitors, and see how you look in a real YouTube search page.</p>
        </div>

        {user && !isPro && canPreview && remaining !== null && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm">
            <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
            <span className="text-neutral-300">You have <span className="text-white font-medium">{remaining}</span> free preview{remaining !== 1 ? 's' : ''} left this month.</span>
            <Link href="/redeem" className="ml-auto text-violet-400 hover:text-violet-300 font-medium">Upgrade to Pro →</Link>
          </div>
        )}

        {showLimitBanner && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span className="text-neutral-300">You have used all 3 free previews this month.</span>
            <Link href="/redeem" className="ml-auto"><Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">Upgrade to Pro</Button></Link>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111] p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white">Your Thumbnail</h2>
              <ThumbnailUpload label="Your thumbnail" dataUrl={userThumb} onChange={setUserThumb} />
              <div className="space-y-3">
                <div>
                  <Label className="text-neutral-400 text-xs">Search keyword</Label>
                  <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. how to grow on youtube" className="mt-1 bg-[#0a0a0a] border-white/10 text-white placeholder:text-neutral-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-neutral-400 text-xs">Video title</Label><Input value={userTitle} onChange={(e) => setUserTitle(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
                  <div><Label className="text-neutral-400 text-xs">Channel name</Label><Input value={userChannel} onChange={(e) => setUserChannel(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
                  <div><Label className="text-neutral-400 text-xs">View count</Label><Input value={userViews} onChange={(e) => setUserViews(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
                  <div><Label className="text-neutral-400 text-xs">Upload date</Label><Input value={userDate} onChange={(e) => setUserDate(e.target.value)} className="mt-1 bg-[#0a0a0a] border-white/10 text-white" /></div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white">Competitor 1</h2>
              <ThumbnailUpload label="Competitor 1 thumbnail" dataUrl={comp1Thumb} onChange={setComp1Thumb} />
              <div className="grid grid-cols-2 gap-3">
                <Input value={comp1Title} onChange={(e) => setComp1Title(e.target.value)} placeholder="Title" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
                <Input value={comp1Channel} onChange={(e) => setComp1Channel(e.target.value)} placeholder="Channel" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
                <Input value={comp1Views} onChange={(e) => setComp1Views(e.target.value)} placeholder="Views" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
                <Input value={comp1Date} onChange={(e) => setComp1Date(e.target.value)} placeholder="Date" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white">Competitor 2</h2>
              <ThumbnailUpload label="Competitor 2 thumbnail" dataUrl={comp2Thumb} onChange={setComp2Thumb} />
              <div className="grid grid-cols-2 gap-3">
                <Input value={comp2Title} onChange={(e) => setComp2Title(e.target.value)} placeholder="Title" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
                <Input value={comp2Channel} onChange={(e) => setComp2Channel(e.target.value)} placeholder="Channel" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
                <Input value={comp2Views} onChange={(e) => setComp2Views(e.target.value)} placeholder="Views" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
                <Input value={comp2Date} onChange={(e) => setComp2Date(e.target.value)} placeholder="Date" className="bg-[#0a0a0a] border-white/10 text-white text-xs" />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center gap-3">
              <Button onClick={handleRender} disabled={!userThumb || rendering || showLimitBanner} className="bg-violet-600 hover:bg-violet-500 text-white">
                {rendering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Render preview
              </Button>
              <Button onClick={handleExport} disabled={!userThumb || exporting} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export PNG
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              {rendering ? (
                <div className="flex items-center justify-center h-96 bg-[#0f0f0f]"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>
              ) : (
                <div ref={mockupRef}><YouTubeMockup keyword={keyword} videos={videos} /></div>
              )}
            </div>

            {isPro && userThumb && (
              <div>
                {scoring ? (
                  <div className="rounded-xl border border-white/10 bg-[#111] p-5 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                    <span className="text-sm text-neutral-400">Calculating CTR score…</span>
                  </div>
                ) : ctrScore ? (
                  <CtrScoreCard breakdown={ctrScore} />
                ) : null}
              </div>
            )}

            {user && !isPro && (
              <div className="rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-600/10 to-[#111] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">Unlock CTR Score & A/B Testing</h3>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Get an instant 0-100 score for your thumbnail and test multiple variants side-by-side.</p>
                <Link href="/redeem"><Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-white">Upgrade to Pro — $12/month</Button></Link>
              </div>
            )}

            {!user && !loading && (
              <div className="rounded-xl border border-white/10 bg-[#111] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">You're using the free tool</h3>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Sign up to track your 3 free monthly previews and unlock A/B testing, CTR scores, and unlimited previews with Pro.</p>
                <Link href="/login?mode=signup"><Button size="sm" variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">Create a free account</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
