import { FilterConfig, FilterId } from '../types/photobooth';

export const FILTERS: Record<FilterId, FilterConfig> = {
  normal: {
    id: 'normal',
    name: 'Natural',
    previewColor: 'from-amber-100 to-rose-100',
    cssFilter: 'none',
  },
  bw: {
    id: 'bw',
    name: 'Classic B&W',
    previewColor: 'from-neutral-200 to-neutral-800',
    cssFilter: 'grayscale(100%) contrast(115%)',
  },
  sepia: {
    id: 'sepia',
    name: 'Sepia Nostalgia',
    previewColor: 'from-amber-200 to-amber-700',
    cssFilter: 'sepia(75%) contrast(105%) saturate(110%)',
  },
  warm: {
    id: 'warm',
    name: 'Golden Hour',
    previewColor: 'from-orange-300 to-rose-400',
    cssFilter: 'sepia(25%) saturate(140%) brightness(104%) contrast(105%)',
  },
  noir: {
    id: 'noir',
    name: 'High Noir',
    previewColor: 'from-neutral-400 to-black',
    cssFilter: 'grayscale(100%) contrast(150%) brightness(95%)',
  },
  'retro-film': {
    id: 'retro-film',
    name: 'Film Grain',
    previewColor: 'from-stone-300 to-stone-600',
    cssFilter: 'contrast(108%) brightness(102%) saturate(90%)',
    hasFilmScratches: true,
    hasGrain: true,
  },
  'cyber-scanlines': {
    id: 'cyber-scanlines',
    name: 'Y2K Scanline',
    previewColor: 'from-cyan-300 to-purple-500',
    cssFilter: 'contrast(120%) saturate(130%) hue-rotate(10deg)',
    hasScanlines: true,
  },
};

export const DEFAULT_FILTER: FilterId = 'normal';
