export interface CtrBreakdown {
  score: number;
  contrast: number;
  textSize: number;
  brightness: number;
  clutter: number;
  variance: number;
}

export function analyzeThumbnail(imageData: ImageData): CtrBreakdown {
  // Stub — реальная логика в tool/page.tsx (Canvas fallback)
  return {
    score: 50,
    contrast: 50,
    textSize: 50,
    brightness: 50,
    clutter: 50,
    variance: 50,
  };
}
