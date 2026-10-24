import React, { useMemo, useState } from 'react';
import { Check, Layers, Palette } from 'lucide-react';
import { FrameTheme, LayoutConfig } from '../types/photobooth';
import { FRAME_THEMES, SOLID_THEMES } from '../config/themes';
import { createFrameThumbnail } from '../utils/frameArtwork';
import { FrameBadge } from './FrameBadge';

interface FramePickerProps {
  layout: LayoutConfig;
  selectedTheme: FrameTheme;
  onSelect: (theme: FrameTheme) => void;
  customHex: string;
  onCustomColor: (color: string) => void;
}

export const FramePicker: React.FC<FramePickerProps> = ({ layout, selectedTheme, onSelect, customHex, onCustomColor }) => {
  const [tier, setTier] = useState('all');
  const [category, setCategory] = useState('Semua');
  const thumbnails = useMemo(() => new Map(FRAME_THEMES.map(theme => [theme.id, createFrameThumbnail(layout, theme)])), [layout]);
  const themes = FRAME_THEMES.filter(theme => (category === 'Semua' || theme.category === category) && (tier === 'all' || theme.tier === tier));
  return (
    <section className="frame-picker bg-studio-900/70 border border-studio-800 rounded-2xl p-5" aria-labelledby="frame-picker-title">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 id="frame-picker-title" className="flex items-center gap-2 font-heading font-bold text-sm text-studio-strong"><Layers size={16} className="text-rose-400" /> Koleksi Frame</h3>
        <span className="text-[10px] text-studio-400">{FRAME_THEMES.length} desain original</span>
      </div>
      <p className="text-xs text-studio-400 leading-relaxed mb-4">Pilih cerita di balik fotomu. Ornamen dan desain ikut tersimpan pada hasil akhir.</p>
      <div className="frame-tier-tabs" role="group" aria-label="Jenis koleksi frame">
        {[{id:'all',label:'Semua Frame'}, {id:'standard',label:'Standar'}, {id:'exclusive',label:'Eksklusif'}].map(item => <button type="button" key={item.id} aria-pressed={tier === item.id} className={tier === item.id ? 'is-active' : ''} onClick={() => setTier(item.id)}>{item.label} <span>{FRAME_THEMES.filter(theme => item.id === 'all' || theme.tier === item.id).length}</span></button>)}
      </div>
      <div className="frame-tabs" role="group" aria-label="Kategori frame">
        {['Semua', 'Romantic', 'Playful', 'Minimal'].map(item => <button type="button" key={item} aria-pressed={category === item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <p className="frame-results" aria-live="polite">{themes.length} frame sesuai pilihanmu</p>
      <div className="frame-design-grid">
        {themes.map(theme => <button type="button" key={theme.id} onClick={() => onSelect(theme)} aria-pressed={selectedTheme.id === theme.id} className={`frame-design-card ${selectedTheme.id === theme.id ? 'is-selected' : ''}`}>
          <span className="frame-design-art" style={{ backgroundColor: theme.bgValue }}>
            <img src={thumbnails.get(theme.id)} alt="" loading="lazy" />
            {selectedTheme.id === theme.id && <span className="frame-design-check"><Check size={13} /></span>}
          </span>
          <span className="frame-design-name">{theme.name}</span>
          <span className="frame-card-tier"><FrameBadge tier={theme.tier} /></span>
          <span className="frame-design-description">{theme.description}</span>
        </button>)}
      </div>
      {themes.length === 0 && <div className="frame-empty"><p>Belum ada frame untuk kombinasi ini.</p><button type="button" onClick={() => {setTier('all');setCategory('Semua');}}>Tampilkan semua frame</button></div>}
      <div className="frame-selection-label" aria-live="polite"><Check size={13} /> Frame pilihan: <strong>{selectedTheme.name}</strong><FrameBadge tier={selectedTheme.tier} /></div>
      <details className="frame-solids">
        <summary><Palette size={14} /> Warna polos & custom <FrameBadge tier="standard" /></summary>
        <div className="flex flex-wrap gap-2 pt-4 pb-3">
          {SOLID_THEMES.map(theme => <button type="button" key={theme.id} title={theme.name} aria-label={theme.name} aria-pressed={selectedTheme.id === theme.id} onClick={() => onSelect(theme)} className="w-8 h-8 rounded-full border border-studio-700 flex items-center justify-center" style={{ backgroundColor: theme.bgValue }}>{selectedTheme.id === theme.id && <Check size={14} style={{ color: theme.textColor }} />}</button>)}
        </div>
        <label className="flex flex-wrap items-center gap-3 text-xs text-studio-400">Warna custom
          <input aria-label="Pilih warna frame custom" type="color" value={customHex} onChange={event => onCustomColor(event.target.value)} className="w-8 h-8 cursor-pointer bg-transparent border-0" />
          <span className="font-mono-custom uppercase">{customHex}</span>
        </label>
      </details>
    </section>
  );
};
