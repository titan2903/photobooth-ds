import React, { useState } from 'react';
import { FrameTheme, LayoutConfig, LayoutId } from '../types/photobooth';
import { LAYOUTS } from '../config/layouts';
import { FRAME_THEMES, SOLID_THEMES } from '../config/themes';
import { getFrameCanvasSize, getFrameGeometry, getImageArtwork } from '../utils/frameArtwork';
import { FramePicker } from './FramePicker';
import { FrameBadge } from './FrameBadge';
import { ArrowRight, Check, Camera, Earth, Waypoints, Handshake } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: LayoutId;
  selectedFrame: FrameTheme;
  onSelectFrame: (theme: FrameTheme) => void;
  onSelectLayout: (id: LayoutId) => void;
  onConfirm: () => void;
}

type Category = 'all' | 'classic' | 'studio' | 'special';
const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Semua Layout' },
  { id: 'classic', label: 'Classic Strips' },
  { id: 'studio', label: 'Studio' },
  { id: 'special', label: 'Special Formats' },
];
const gallery: { id: LayoutId; category: Category; tone: string; label?: string }[] = [
  { id: 'strip-3', category: 'classic', tone: 'peach', label: 'FAVORIT' },
  { id: 'strip-4', category: 'classic', tone: 'lavender' },
  { id: 'grid-4', category: 'studio', tone: 'sage', label: 'STUDIO' },
  { id: 'strip-2', category: 'classic', tone: 'rose' },
  { id: 'grid-6', category: 'special', tone: 'butter', label: 'BARU' },
  { id: 'wide-4', category: 'special', tone: 'blue', label: 'BARU' },
];

// Use the export geometry so the thumbnail matches the final photo arrangement.
// An image frame changes the strip's height and photo slots, so preview it with that frame; otherwise a plain frame.
function StripPreview({ layout, frame }: { layout: LayoutConfig; frame: FrameTheme }) {
  const theme = getImageArtwork(layout, frame) ? frame : SOLID_THEMES[0];
  const size = getFrameCanvasSize(layout, theme);
  const { windows } = getFrameGeometry(layout, theme);
  return (
    <div className="layout-paper" style={{ aspectRatio: `${size.width} / ${size.height}` }}>
      {windows.map((slot, index) => (
        <div key={index} className={`layout-photo layout-photo-${index % 3}`} style={{
          left: `${slot.x / size.width * 100}%`,
          top: `${slot.y / size.height * 100}%`,
          width: `${slot.width / size.width * 100}%`,
          height: `${slot.height / size.height * 100}%`,
        }}>
          <svg viewBox="0 0 120 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="95" cy="18" r="12" fill="white" opacity=".35" />
            <path d="M0 85 Q30 48 60 83 T130 67 V110 H0Z" fill="white" opacity=".22" />
            <path d="M27 102 Q25 59 57 59 Q88 58 92 102" fill="var(--portrait-shirt)" />
            <path d="M38 46 Q32 10 59 12 Q88 13 80 49 L78 64 H39Z" fill="#443b40" />
            <ellipse cx="59" cy="41" rx="18" ry="22" fill="#e9bb9f" />
            <path d="M39 35 Q39 11 59 13 Q78 13 80 34 Q64 34 55 22 Q50 32 39 35" fill="#443b40" />
            <circle cx="53" cy="41" r="1.4" fill="#443b40" /><circle cx="66" cy="41" r="1.4" fill="#443b40" />
            <path d="M55 51 Q60 55 65 50" fill="none" stroke="#ac6863" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      ))}
      <span className="layout-paper-caption">DATA SCIENCE<br /><small>GATHERING 2026</small></span>
    </div>
  );
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ selectedLayout, selectedFrame, onSelectFrame, onSelectLayout, onConfirm }) => {
  const [customHex, setCustomHex] = useState(selectedFrame.bgValue);
  const [category, setCategory] = useState<Category>('all');
  const visibleLayouts = gallery.filter((item) => category === 'all' || item.category === category);
  const activeLayout = LAYOUTS[selectedLayout];

  return (
    <section className="layout-gallery mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="layout-title">
      <div className="layout-heading text-center">
        <span className="layout-eyebrow"><Earth size={14} /> CROSS THE WORLD!!!</span>
        <h1 id="layout-title">choose your <span>layout</span><span className="layout-heading-star" aria-hidden="true">✳</span></h1>
        <p className="layout-slogan"><span><Waypoints size={16} aria-hidden="true" /> Connecting The Dots</span><span><Handshake size={16} aria-hidden="true" /> Connecting People</span></p>
        <p>Pilih layout favoritmu. Buat setiap momen jadi kenangan.</p>
      </div>

      <div className="layout-categories" role="group" aria-label="Kategori layout">
        {categories.map((item) => (
          <button key={item.id} type="button" aria-pressed={category === item.id}
            className={`layout-category ${category === item.id ? 'is-active' : ''}`}
            onClick={() => setCategory(item.id)}>{item.label}</button>
        ))}
      </div>

      <div className="layout-gallery-meta">
        <span>{visibleLayouts.length} layout untuk ceritamu</span>
        <span><Camera size={14} /> Gratis & tanpa iklan</span>
      </div>

      <div className="layout-grid">
        {visibleLayouts.map((item) => {
          const layout = LAYOUTS[item.id];
          const isSelected = selectedLayout === item.id;
          return (
            <button key={item.id} type="button" className={`layout-card ${isSelected ? 'is-selected' : ''}`}
              aria-pressed={isSelected} onClick={() => {
                onSelectLayout(item.id);
                // An image frame only fits its own layout, so drop it rather than print a plain fallback.
                if (selectedFrame.artwork && !selectedFrame.artwork.layouts.includes(item.id)) {
                  const fallback = FRAME_THEMES.find(theme => !theme.artwork)!;
                  onSelectFrame(fallback);
                  setCustomHex(fallback.bgValue);
                }
              }}>
              <div className={`layout-card-art tone-${item.tone}`}>
                {item.label && <span className="layout-card-badge">{item.label}</span>}
                <span className={`layout-selection ${isSelected ? 'is-selected' : ''}`} aria-hidden="true">{isSelected && <Check size={14} strokeWidth={3} />}</span>
                <div className={`layout-preview layout-preview-${layout.id}`}><StripPreview layout={layout} frame={selectedFrame} /></div>
                <span className="layout-art-star" aria-hidden="true">✧</span>
                <span className="layout-art-note" aria-hidden="true">make it a memory</span>
              </div>
              <div className="layout-card-info">
                <div className="layout-card-title"><h2>{layout.name}</h2><span>{layout.photoCount} foto</span></div>
                <p>{layout.tagline}</p>
                <div className="layout-card-bottom"><span>{layout.gridColumns === 1 ? 'Vertical strip' : layout.id === 'wide-4' ? 'Landscape grid' : `${layout.gridColumns} × ${layout.photoCount / layout.gridColumns} grid`}</span><span className="layout-card-link">{isSelected ? 'Terpilih' : 'Pilih layout'} {isSelected ? <Check size={14} /> : <ArrowRight size={14} />}</span></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="layout-frame-collection">
        <FramePicker layout={activeLayout} selectedTheme={selectedFrame} customHex={customHex} onSelectLayout={onSelectLayout}
          onSelect={(theme) => { onSelectFrame(theme); setCustomHex(theme.bgValue); }}
          onCustomColor={(color) => {
            setCustomHex(color);
            const rgb = color.slice(1).match(/.{2}/g)!.map(value => parseInt(value, 16));
            const luminance = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            onSelectFrame({ id: 'custom', tier: 'standard', name: 'Custom Hex', bgValue: color, textColor: luminance >= 128 ? '#111111' : '#ffffff', isCustom: true });
          }} />
      </div>
      <div className="layout-continue">
        <div><span className="layout-continue-label">LAYOUT PILIHANMU</span><p aria-live="polite">{activeLayout.name} <span>· {activeLayout.photoCount} foto · {selectedFrame.name}</span></p><FrameBadge tier={selectedFrame.tier} /></div>
        <button type="button" onClick={onConfirm}>Mulai Foto <ArrowRight size={18} /></button>
      </div>
      <p className="layout-bottom-note">Pose sesukamu. Kenangan milikmu. <span aria-hidden="true">♡</span></p>
    </section>
  );
};
