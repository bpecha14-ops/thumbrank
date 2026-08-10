'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { validateImage, fileToDataUrl } from '@/lib/image-utils';
import { cn } from '@/lib/utils';

interface ThumbnailUploadProps {
  label: string;
  dataUrl: string | null;
  onChange: (dataUrl: string | null) => void;
  compact?: boolean;
}

export function ThumbnailUpload({ label, dataUrl, onChange, compact = false }: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const err = validateImage(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const url = await fileToDataUrl(file);
      onChange(url);
    } catch {
      setError('Failed to read the image.');
    }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'mt-2 relative rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden',
          compact ? 'aspect-video' : 'aspect-video',
          dragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-[#0f0f0f] hover:border-white/20',
          error && 'border-red-500/50'
        )}
        onClick={() => inputRef.current?.click()}
      >
        {dataUrl ? (
          <div className="relative w-full h-full group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt={label} className="w-full h-full object-cover" crossOrigin="anonymous" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-4">
            {dragging ? <Upload className="h-6 w-6 mb-2 text-violet-400" /> : <ImageIcon className="h-6 w-6 mb-2" />}
            <span className="text-xs text-center">Click or drag to upload</span>
            <span className="text-[10px] text-neutral-600 mt-1">PNG/JPG · max 5MB</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
