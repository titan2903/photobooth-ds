import React, { useId, useMemo, useState } from 'react';
import { Check, Clapperboard, CircleOff } from 'lucide-react';
import { ANIMATIONS, isHeadAnimation, isFacialAnimation } from '../config/animations';
import { AnimationSettings } from '../types/photobooth';
import { createAnimationArtwork } from '../utils/animatedEffects';
import { svgDataUrl } from '../utils/frameArtwork';
import { AnimatedOverlay } from './AnimatedOverlay';

interface AnimationPickerProps { settings: AnimationSettings; onChange: (settings: AnimationSettings) => void }
export const AnimationPicker: React.FC<AnimationPickerProps> = ({ settings, onChange }) => {
  const controlId = useId();
  const [group,setGroup]=useState<'head'|'face'|'scene'>(isFacialAnimation(settings.id) ? 'face' : settings.id === 'none' || isHeadAnimation(settings.id) ? 'head' : 'scene');
  const visible=ANIMATIONS.filter(item=>item.id==='none' || (group==='face' ? isFacialAnimation(item.id) : group==='head' ? isHeadAnimation(item.id) && !isFacialAnimation(item.id) : !isHeadAnimation(item.id)));
  const isHead=isHeadAnimation(settings.id);
  const thumbnails = useMemo(() => new Map(ANIMATIONS.filter(item => item.id !== 'none').map(item => [item.id,svgDataUrl(createAnimationArtwork({id:item.id,intensity:1,speed:1},200,140,2.4))])),[]);
  const active = ANIMATIONS.find(item => item.id === settings.id)!;
  return (
    <section className="animation-picker" aria-label="Efek kepala, wajah, dan animasi kamera">
      <div className="animation-picker-heading"><h3><Clapperboard size={16} /> Efek Kepala & Wajah</h3><span>{visible.length-1} {group === 'head' ? 'efek kepala' : group === 'face' ? 'efek wajah' : 'efek suasana'}</span></div>
      <p className="animation-picker-intro">Kumis, janggut, topi, dan aksesori mengikuti wajah secara otomatis. Bisa digabungkan dengan semua filter warna.</p>
      <div className="frame-tabs" role="group" aria-label="Jenis efek animasi">
        <button type="button" aria-pressed={group==='head'} className={group==='head' ? 'is-active' : ''} onClick={()=>setGroup('head')}>Di Atas Kepala</button>
        <button type="button" aria-pressed={group==='face'} className={group==='face' ? 'is-active' : ''} onClick={()=>setGroup('face')}>Wajah</button>
        <button type="button" aria-pressed={group==='scene'} className={group==='scene' ? 'is-active' : ''} onClick={()=>setGroup('scene')}>Efek Suasana</button>
      </div>
      <div className="animation-picker-grid">{visible.map(item => <button type="button" key={item.id} onClick={() => onChange({...settings,id:item.id})} aria-pressed={settings.id === item.id} className={`animation-option ${settings.id === item.id ? 'is-selected' : ''}`} title={item.description}>
        <span className="animation-option-preview" style={{'--animation-color':item.color} as React.CSSProperties}>
          {isHeadAnimation(item.id) && <img className="head-effect-demo" src="/filter-preview.svg" alt="" />}
          {item.id === 'none' ? <CircleOff size={22} /> : settings.id === item.id ? <AnimatedOverlay settings={settings} /> : <img src={thumbnails.get(item.id)} alt="" loading="lazy" />}
          {settings.id === item.id && <span className="animation-option-check"><Check size={12} /></span>}
        </span><span className="animation-option-name">{item.name}</span>
      </button>)}</div>
      {settings.id !== 'none' && <div className="animation-controls">
        <label htmlFor={`${controlId}-intensity`}>{isHead ? 'Ukuran' : 'Kepadatan'} <output>{Math.round(settings.intensity*100)}%</output><input id={`${controlId}-intensity`} type="range" min="0.3" max="1.5" step="0.1" value={settings.intensity} onChange={event => onChange({...settings,intensity:Number(event.target.value)})} /></label>
        <label htmlFor={`${controlId}-speed`}>Kecepatan <output>{settings.speed.toFixed(1)}×</output><input id={`${controlId}-speed`} type="range" min="0.5" max="2" step="0.1" value={settings.speed} onChange={event => onChange({...settings,speed:Number(event.target.value)})} /></label>
      </div>}
      <p className="animation-active" aria-live="polite"><strong>{active.name}</strong> · {active.description}</p>
      <p className="animation-export-note">Aksesori muncul setelah wajah terdeteksi di kamera. Unduh GIF untuk efek bergerak. PNG dan hasil cetak menyimpan gambar diam.</p>
    </section>
  );
};
