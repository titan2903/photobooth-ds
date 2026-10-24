export type LayoutId = 'strip-4' | 'strip-3' | 'strip-2' | 'grid-4';

export interface LayoutConfig {
  id: LayoutId;
  name: string;
  tagline: string;
  photoCount: number;
  canvasWidth: number;
  canvasHeight: number;
  borderWidth: number;
  spacing: number;
  bottomPadding: number;
  gridColumns: number;
  previewAspect: string; // e.g. "aspect-[624/1800]"
}

export type FilterId = 
  | 'normal'
  | 'bw'
  | 'sepia'
  | 'warm'
  | 'noir'
  | 'retro-film'
  | 'cyber-scanlines';

export interface FilterConfig {
  id: FilterId;
  name: string;
  previewColor: string;
  cssFilter: string;
  hasScanlines?: boolean;
  hasFilmScratches?: boolean;
  hasGrain?: boolean;
}

export interface FrameTheme {
  id: string;
  name: string;
  bgValue: string;
  textColor: string;
  accentColor?: string;
  isCustom?: boolean;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  filter: FilterId;
}

export type AppStep = 'select-layout' | 'capture' | 'customize' | 'export';
