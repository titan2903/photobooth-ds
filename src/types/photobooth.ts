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
  /** A finished image frame (e.g. exported from Canva) made for one layout. */
  artwork?: FrameImageArtwork;
}

/**
 * A finished image frame stacked from three slices of one image: header, sky middle, footer.
 * The middle is cropped to fit 2, 3 or 4 photos, so the design is never stretched.
 * All numbers are in the image's own pixels.
 */
export interface FrameImageArtwork {
  src: string;
  /** Picker thumbnail (the original design). */
  preview: string;
  layouts: LayoutId[];
  width: number;
  height: number;
  headerBottom: number;
  footerTop: number;
  photo: { x: number; width: number; height: number };
  gap: number;
  padding: number;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  filter: FilterId;
  animation: AnimationSettings;
  animationTime: number;
}

export type AppStep = 'select-layout' | 'capture' | 'customize' | 'export';

export type AnimationId = 'none' | 'hearts' | 'sparkles' | 'confetti' | 'bubbles' | 'petals' | 'snow' | 'shooting-stars' | 'neon-orbit' | 'head-crown' | 'head-halo' | 'head-hearts' | 'head-butterflies' | 'head-cat' | 'head-bunny' | 'head-mustache' | 'head-beard' | 'head-hat' | 'head-cowboy'
  | 'head-glasses' | 'head-sunglasses' | 'head-heart-glasses' | 'head-blush'
  | 'head-freckles' | 'head-clown' | 'head-cat-whiskers' | 'head-pirate'
  | 'head-cyber-visor' | 'head-star-cheeks' | 'head-mustache-pencil' | 'head-goatee';
export interface AnimationSettings {
  id: AnimationId;
  intensity: number;
  speed: number;
}

/** Position and size normalized to the source image; angle is in degrees. */
export interface HeadAnchor {
  x: number; y: number; width: number; angle: number;
  eyes?: { x: number; y: number };
  nose?: { x: number; y: number };
  mouth?: { x: number; y: number };
  chin?: { x: number; y: number };
}
