import { FrameTheme } from '../types/photobooth';

export const FRAME_THEMES: FrameTheme[] = [
  {
    id: 'pure-white',
    name: 'Pure White',
    bgValue: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#e5e5e5',
  },
  {
    id: 'matte-black',
    name: 'Matte Black',
    bgValue: '#121212',
    textColor: '#ffffff',
    accentColor: '#2a2a2a',
  },
  {
    id: 'blush-pink',
    name: 'Blush Pink',
    bgValue: '#ffe0e6',
    textColor: '#571827',
    accentColor: '#f7b9c7',
  },
  {
    id: 'lavender',
    name: 'Soft Lavender',
    bgValue: '#e6deff',
    textColor: '#2f2059',
    accentColor: '#c5b4ff',
  },
  {
    id: 'matcha',
    name: 'Matcha Sage',
    bgValue: '#deedd6',
    textColor: '#23381a',
    accentColor: '#bcd6af',
  },
  {
    id: 'buttercream',
    name: 'Butter Cream',
    bgValue: '#fdf3d8',
    textColor: '#423313',
    accentColor: '#edd8a4',
  },
  {
    id: 'deep-cherry',
    name: 'Deep Cherry',
    bgValue: '#4a0e17',
    textColor: '#ffccd4',
    accentColor: '#7a1b29',
  },
  {
    id: 'sky-blue',
    name: 'Vintage Sky',
    bgValue: '#d4e8fc',
    textColor: '#15324d',
    accentColor: '#a7cefa',
  },
];

export const DEFAULT_THEME = FRAME_THEMES[0];
