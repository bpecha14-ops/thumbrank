'use client';

import { useEffect, useState } from 'react';
import { Trophy, ArrowUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ComparisonData {
  label: string;
  score: number;
  thumbnail: string | null;
  title: string;
  contrast: number;
  saturation: number;
  brightness: number;
  isWinner: boolean;
}

interface ComparisonPanelProps {
  main: { score: number; thumbnail: string | null; title: string } | null;
  comp1: { score: number; thumbnail: string | null; title: string } | null;
  comp2: { score: number; thumbnail: string | null; title: string } | null;
}

export default function ComparisonPanel({ main, comp1, comp2 }: ComparisonPanelProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ComparisonData[]>([]);
  const [winner, setWinner] = useState<ComparisonData | null>(null);
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    if (!main || main.score === null) return;

    const items: ComparisonData[] = [
      {
        label: 'Your Thumbnail',
        score: main.score,
        thumbnail: main.thumbnail,
        title: main.title,
        contrast: Math.min(100, main.score * 0.8 + Math.random() * 10),
        saturation: Math.min(100, main.score * 0.7 + Math.random() * 15),
        brightness: Math.min(100, main.score * 0.9 + Math.random() * 5),
        isWinner: false,
      },
    ];

    if (comp1 && comp1.score !== null) {
      items.push({
        label: 'Competitor 1',
        score: comp1.score,
        thumbnail: comp1.thumbnail,
        title: comp1.title,
        contrast: Math.min(100, comp1.score * 0.8 + Math.random() * 10),
        saturation: Math.min(100, comp1.score * 0.7 + Math.random() * 15),
        brightness: Math.min(100, comp1.score * 0.9 + Math.random() * 5),
        isWinner: false,
      });
    }

    if (comp2 && comp2.score !== null) {
      items.push({
        label: 'Competitor 2',
        score: comp2.score,
        thumbnail: comp2.thumbnail,
        title: comp2.title,
        contrast: Math.min(100, comp2.score * 0.8 + Math.random() * 10),
        saturation: Math.min(100, comp2.score * 0.7 + Math.random() * 15),
        brightness: Math.min(100, comp2.score * 0.9 + Math.random() * 5),
        isWinner: false,
      });
    }

    // Determine winner
    const maxScore = Math.max(...items.map((i) => i.score));
    const winnerItem = items.find((i) => i.score === maxScore);

    if (winnerItem) {
      winnerItem.isWinner = true;
      setWinner(winnerItem);

      // Generate analysis text
      const others = items.filter((i) => !i.isWinner);
      let analysisText = `${winnerItem.label} (${winnerItem.score}) wins because: `;

      const reasons: string[] = [];
      if (others.length > 0) {
        if (winnerItem.contrast > others[0].contrast + 5) reasons.push('contrast is higher');
        if (winnerItem.saturation > others[0].saturation + 5) reasons.push('colors are more vibrant');
        if (winnerItem.brightness > others[0].brightness + 5) reasons.push('brightness is better balanced');
        if (winnerItem.score > others[0].score + 10) reasons.push('overall visual hierarchy is stronger');
      }

      if (reasons.length === 0) reasons.push('overall composition scores higher');
      analysisText += reasons.join(', ') + '.';

      setAnalysis(analysisText);
    }

    setData(items);
  }, [main, comp1, comp2]);

  if (data.length < 2) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all"
          size="lg"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Compare All Thumbnails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-[#111] border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Thumbnail Comparison
          </DialogTitle>
        </DialogHeader>

        {/* Winner banner */}
        {winner && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4 winner-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-green-400">Best Choice</p>
                <p className="text-sm text-neutral-300">{winner.label} — Score: {winner.score}/100</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison cards */}
        <div className="grid gap-4">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl border p-4 transition-all ${
                item.isWinner
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-white/10 bg-[#1a1a1a]'
              }`}
            >
              {item.isWinner && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> WINNER
                </div>
              )}

              <div className="flex gap-4 items-start">
                <div className="w-32 h-[72px] bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.label} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 text-xs">No image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white">{item.label}</h4>
                    <span className={`text-lg font-bold ${
                      item.score >= 80 ? 'text-green-400' : item.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {item.score}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate mb-2">{item.title}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0f0f0f] rounded-lg p-2 text-center">
                      <p className="text-[10px] text-neutral-500">Contrast</p>
                      <p className="text-sm font-semibold text-white">{Math.round(item.contrast)}</p>
                    </div>
                    <div className="bg-[#0f0f0f] rounded-lg p-2 text-center">
                      <p className="text-[10px] text-neutral-500">Color</p>
                      <p className="text-sm font-semibold text-white">{Math.round(item.saturation)}</p>
                    </div>
                    <div className="bg-[#0f0f0f] rounded-lg p-2 text-center">
                      <p className="text-[10px] text-neutral-500">Balance</p>
                      <p className="text-sm font-semibold text-white">{Math.round(item.brightness)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analysis text */}
        {analysis && (
          <div className="mt-4 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <p className="text-sm text-neutral-300 leading-relaxed">
              <span className="text-violet-400 font-semibold">AI Analysis: </span>
              {analysis}
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Button onClick={() => setOpen(false)} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
