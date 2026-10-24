import { AnimationId, AnimationSettings } from '../types/photobooth';

export const ANIMATIONS: { id: AnimationId; name: string; description: string; color: string }[] = [
  { id: 'none', name: 'Tanpa efek', description: 'Preview kamera tanpa efek gerak.', color: '#cbd5e1' },
  { id: 'head-crown', name: 'Royal Crown', description: 'Mahkota emas yang mengikuti kepala.', color: '#facc15' },
  { id: 'head-halo', name: 'Angel Halo', description: 'Halo bercahaya tepat di atas kepala.', color: '#fde68a' },
  { id: 'head-hearts', name: 'Love Crown', description: 'Hati berdenyut mengelilingi bagian atas kepala.', color: '#fb7185' },
  { id: 'head-butterflies', name: 'Butterfly Halo', description: 'Kupu-kupu mengepak di atas kepala.', color: '#c4b5fd' },
  { id: 'head-cat', name: 'Kitty Ears', description: 'Sepasang telinga kucing mengikuti kepala.', color: '#f9a8d4' },
  { id: 'head-bunny', name: 'Bunny Ears', description: 'Telinga kelinci dengan gerakan lembut.', color: '#e9d5ff' },
  { id: 'hearts', name: 'Love Float', description: 'Hati merah muda melayang perlahan ke atas.', color: '#fb7185' },
  { id: 'sparkles', name: 'Golden Sparkle', description: 'Kilau emas yang berpendar lembut.', color: '#f6cf72' },
  { id: 'confetti', name: 'Party Confetti', description: 'Potongan warna-warni berputar dan jatuh.', color: '#c4b5fd' },
  { id: 'bubbles', name: 'Dream Bubbles', description: 'Gelembung transparan dengan kilau pastel.', color: '#7dd3fc' },
  { id: 'petals', name: 'Sakura Breeze', description: 'Kelopak sakura berayun tertiup angin.', color: '#f9a8d4' },
  { id: 'snow', name: 'Snow Globe', description: 'Butiran salju lembut turun di sekelilingmu.', color: '#dbeafe' },
  { id: 'shooting-stars', name: 'Meteor Shower', description: 'Bintang meluncur dengan jejak cahaya.', color: '#fde68a' },
  { id: 'neon-orbit', name: 'Neon Orbit', description: 'Partikel neon mengorbit dengan jejak cahaya.', color: '#a5b4fc' },
];

export const DEFAULT_ANIMATION: AnimationSettings = { id: 'none', intensity: 1, speed: 1 };

export const isHeadAnimation = (id: AnimationId) => id.startsWith('head-');
