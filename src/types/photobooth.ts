export type LayoutId = 'strip-4' | 'strip-3' | 'strip-2' | 'grid-4' | 'grid-6' | 'wide-4';

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
  | 'cyber-scanlines'
  | 'porcelain' | 'blush' | 'peach' | 'ice' | 'lavender-haze'
  | 'faded' | 'honey-film' | 'instant' | 'soft-bw' | 'silver'
  | 'teal-orange' | 'sunset' | 'vivid' | 'infrared';

export type FilterCategory = 'Natural' | 'Portrait' | 'Vintage' | 'Monochrome' | 'Creative';

export interface FilterConfig {
  id: FilterId;
  name: string;
  previewColor: string;
  category: FilterCategory;
  description: string;
  cssFilter: string;
  hasScanlines?: boolean;
  hasFilmScratches?: boolean;
  hasGrain?: boolean;
}

export type FrameTier = 'standard' | 'exclusive';

export interface FrameTheme {
  tier: FrameTier;
  id: string;
  name: string;
  bgValue: string;
  textColor: string;
  accentColor?: string;
  isCustom?: boolean;
  design?: 'ribbon' | 'chrome' | 'botanical' | 'editorial' | 'scrapbook' | 'checker' | 'postcard' | 'celestial' | 'cinema' | 'ocean' | 'confetti' | 'gallery';
  category?: 'Romantic' | 'Playful' | 'Minimal';
  description?: string;
  headline?: string;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  filter: FilterId;
}

export type AppStep = 'select-layout' | 'capture' | 'customize' | 'export';

export type AnimationId = 'none' | 'hearts' | 'sparkles' | 'confetti' | 'bubbles' | 'petals' | 'snow' | 'shooting-stars' | 'neon-orbit' | 'head-crown' | 'head-halo' | 'head-hearts' | 'head-butterflies' | 'head-cat' | 'head-bunny';
export interface AnimationSettings {
  id: AnimationId;
  intensity: number;
  speed: number;
}

/** Position and size normalized to the source image; angle is in degrees. */
export interface HeadAnchor { x: number; y: number; width: number; angle: number }
