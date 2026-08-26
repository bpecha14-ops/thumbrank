export interface CtrBreakdown {
  score: number;
  contrast: number;
  textSize: number;
  brightness: number;
  clutter: number;
  variance: number;
  colorfulness: number;
  edgeDensity: number;
}

export function analyzeThumbnail(imageData: ImageData): CtrBreakdown {
  return {
    score: 50,
    contrast: 50,
    textSize: 50,
    brightness: 50,
    clutter: 50,
    variance: 50,
    colorfulness: 50,
    edgeDensity: 50,
  };
}
