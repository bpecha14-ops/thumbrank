'use client';

import { forwardRef } from 'react';

/**
 * YouTube search results mockup.
 * Renders a pixel-accurate recreation of a YouTube search results page
 * with the user's thumbnail and two competitor slots.
 *
 * All data is passed in as props so this component is pure/presentational.
 */

export interface MockupVideo {
  thumbnailUrl: string | null;
  title: string;
  channelName: string;
  channelVerified: boolean;
  viewCount: string;
  uploadDate: string;
  duration: string;
  isUser?: boolean; // highlight the user's row
}

export interface YouTubeMockupProps {
  keyword: string;
  videos: MockupVideo[];
  // Optional: render compact (used in A/B side-by-side)
  compact?: boolean;
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline-block text-neutral-400" aria-label="Verified">
      <path d="M12 2l2.4 1.8 3 .3.3 3L19.5 9 18 11.4l1.5 2.4-1.8 2.4-.3 3-3 .3L12 21l-2.4-1.8-3-.3-.3-3L4.5 12.6 6 10.2 4.5 7.8l1.8-2.4.3-3 3-.3L12 2z" />
      <path d="M10.6 14.8l-2.2-2.2-1.1 1.1 3.3 3.3 5.5-5.5-1.1-1.1z" fill="#0a0a0a" />
    </svg>
  );
}

export const YouTubeMockup = forwardRef<HTMLDivElement, YouTubeMockupProps>(
  ({ keyword, videos, compact = false }, ref) => {
    const thumbW = compact ? 240 : 360;
    const thumbH = compact ? 135 : 202;

    return (
      <div ref={ref} className="w-full bg-[#0f0f0f] text-white font-roboto" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        {/* YouTube top bar */}
        <div className="flex items-center justify-between border-b border-[#272727] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <svg width="28" height="20" viewBox="0 0 28 20" aria-hidden>
                <path d="M27.4 3.1c-.3-1.2-1.3-2.2-2.5-2.5C22.8 0 14 0 14 0S5.2 0 3.1.6C1.9.9.9 1.9.6 3.1 0 5.2 0 10 0 10s0 4.8.6 6.9c.3 1.2 1.3 2.2 2.5 2.5C5.2 20 14 20 14 20s8.8 0 10.9-.6c1.2-.3 2.2-1.3 2.5-2.5.6-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z" fill="#FF0000" />
                <path d="M11.2 14.3l7.2-4.3-7.2-4.3z" fill="#fff" />
              </svg>
            </div>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-2 bg-[#121212] border border-[#272727] rounded-l-full px-4 py-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <span className="text-sm text-white truncate">{keyword || 'how to grow on youtube'}</span>
              </div>
              <button className="bg-[#272727] border border-l-0 border-[#272727] rounded-r-full px-4 py-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-medium">
              U
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 py-3 overflow-hidden border-b border-[#272727]">
          {['All', 'Videos', 'Shorts', 'Channels', 'Playlists'].map((chip, i) => (
            <span
              key={chip}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${i === 0 ? 'bg-white text-black' : 'bg-[#272727] text-white'}`}
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Search results */}
        <div className="px-4 py-4 space-y-4">
          {videos.map((video, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${video.isUser ? 'ring-2 ring-violet-500 rounded-xl p-2 -m-2' : ''}`}
            >
              {/* Thumbnail */}
              <div className="relative shrink-0" style={{ width: thumbW, height: thumbH }}>
                {video.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-lg"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-[#272727] flex items-center justify-center text-neutral-500 text-xs">
                    No image
                  </div>
                )}
                {/* Duration badge */}
                <span className="absolute bottom-1 right-1 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  {video.duration}
                </span>
                {video.isUser && (
                  <span className="absolute top-1 left-1 bg-violet-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                    Your video
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-base font-medium leading-snug line-clamp-2 text-white">
                  {video.title}
                </h3>
                <div className="mt-1 text-xs text-neutral-400">
                  {video.viewCount} views · {video.uploadDate}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-[#272727] flex items-center justify-center text-xs text-white">
                    {video.channelName.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-xs text-neutral-300">{video.channelName}</span>
                  {video.channelVerified && <VerifiedBadge />}
                </div>
                <p className="mt-2 text-xs text-neutral-400 line-clamp-2 hidden sm:block">
                  {video.title} — watch this video to learn more.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

YouTubeMockup.displayName = 'YouTubeMockup';
