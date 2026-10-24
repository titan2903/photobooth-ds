import { AnimationId, AnimationSettings } from '../types/photobooth';

export const ANIMATIONS: { id: AnimationId; name: string; description: string; color: string }[] = [
  { id: 'none', name: 'Tanpa efek', description: 'Preview kamera tanpa efek gerak.', color: '#cbd5e1' },
  { id: 'head-crown', name: 'Royal Crown', description: 'Mahkota emas yang mengikuti kepala.', color: '#facc15' },
  { id: 'head-halo', name: 'Angel Halo', description: 'Halo bercahaya tepat di atas kepala.', color: '#fde68a' },
  { id: 'head-hearts', name: 'Love Crown', description: 'Hati berdenyut mengelilingi bagian atas kepala.', color: '#fb7185' },
  { id: 'head-butterflies', name: 'Butterfly Halo', description: 'Kupu-kupu mengepak di atas kepala.', color: '#c4b5fd' },
  { id: 'head-cat', name: 'Kitty Ears', description: 'Sepasang telinga kucing mengikuti kepala.', color: '#f9a8d4' },
  { id: 'head-bunny', name: 'Bunny Ears', description: 'Telinga kelinci dengan gerakan lembut.', color: '#e9d5ff' },
  { id: 'head-hat', name: 'Topi Klasik', description: 'Topi fedora dengan pita yang mengikuti kepala.', color: '#64748b' },
  { id: 'head-cowboy', name: 'Topi Koboi', description: 'Topi koboi dengan pinggiran lebar dan aksen kulit.', color: '#c4945a' },
  { id: 'head-mustache', name: 'Kumis', description: 'Kumis melengkung yang mengikuti posisi hidung dan mulut.', color: '#604533' },
  { id: 'head-beard', name: 'Janggut', description: 'Janggut lebat yang mengikuti mulut dan dagu.', color: '#79563e' },
  { id: 'head-glasses', name: 'Kacamata Bulat', description: 'Bingkai bulat transparan mengikuti posisi mata.', color: '#bda068' },
  { id: 'head-sunglasses', name: 'Cool Shades', description: 'Kacamata hitam dengan kilau biru.', color: '#475569' },
  { id: 'head-heart-glasses', name: 'Love Glasses', description: 'Kacamata berbentuk hati berwarna pink.', color: '#f472b6' },
  { id: 'head-blush', name: 'Rosy Cheeks', description: 'Blush merah muda lembut di kedua pipi.', color: '#fda4af' },
  { id: 'head-freckles', name: 'Sun Freckles', description: 'Bintik freckles alami pada pipi dan hidung.', color: '#b48460' },
  { id: 'head-clown', name: 'Hidung Badut', description: 'Hidung merah mengilap yang berdenyut lembut.', color: '#ef4444' },
  { id: 'head-cat-whiskers', name: 'Kitty Face', description: 'Hidung kucing dan kumis di kedua pipi.', color: '#f9a8d4' },
  { id: 'head-pirate', name: 'Pirate Patch', description: 'Penutup mata bajak laut dengan emblem tengkorak.', color: '#64748b' },
  { id: 'head-cyber-visor', name: 'Cyber Visor', description: 'Visor neon dengan garis cahaya bergerak.', color: '#67e8f9' },
  { id: 'head-star-cheeks', name: 'Star Cheeks', description: 'Stiker bintang berkilau di kedua pipi.', color: '#fde68a' },
  { id: 'head-mustache-pencil', name: 'Kumis Tipis', description: 'Kumis tipis bergaya retro mengikuti bibir atas.', color: '#6b4935' },
  { id: 'head-goatee', name: 'Goatee', description: 'Janggut pendek dengan aksen rambut di bawah bibir.', color: '#79563e' },
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

export const FACE_EFFECT_ANCHORS: Partial<Record<AnimationId, 'eyes' | 'nose' | 'cheeks' | 'mouth' | 'upper-lip'>> = {
  'head-mustache':'upper-lip', 'head-beard':'mouth',
  'head-glasses':'eyes', 'head-sunglasses':'eyes', 'head-heart-glasses':'eyes',
  'head-blush':'cheeks', 'head-freckles':'cheeks', 'head-clown':'nose',
  'head-cat-whiskers':'nose', 'head-pirate':'eyes', 'head-cyber-visor':'eyes',
  'head-star-cheeks':'cheeks', 'head-mustache-pencil':'upper-lip', 'head-goatee':'mouth',
};
export const isFacialAnimation = (id: AnimationId) => FACE_EFFECT_ANCHORS[id] !== undefined;
