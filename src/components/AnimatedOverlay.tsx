import React, { useEffect, useRef } from 'react';
import { AnimationSettings, HeadAnchor } from '../types/photobooth';
import { createAnimationArtwork } from '../utils/animatedEffects';
import { projectHeadAnchors } from '../utils/headGeometry';

export const AnimatedOverlay: React.FC<{ settings: AnimationSettings; time?: number; heads?: HeadAnchor[]; sourceWidth?: number; sourceHeight?: number; mirrored?: boolean; zoom?: number }> = ({ settings, time, heads, sourceWidth, sourceHeight, mirrored, zoom = 1 }) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const inputs = useRef({heads,sourceWidth,sourceHeight,mirrored,zoom});
  const redraw = useRef<() => void>();
  useEffect(() => { inputs.current={heads,sourceWidth,sourceHeight,mirrored,zoom}; redraw.current?.(); },[heads,sourceWidth,sourceHeight,mirrored,zoom]);
  useEffect(() => {
    const host = hostRef.current;
    if (!host || settings.id === 'none') return;
    let frame = 0;
    let lastDraw = -Infinity;
    let width = host.clientWidth;
    let height = host.clientHeight;
    let visible = true;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const draw = (seconds: number) => {
      const input=inputs.current;
      const anchors=input.heads && input.sourceWidth && input.sourceHeight ? projectHeadAnchors(input.heads,input.sourceWidth,input.sourceHeight,width,height,input.mirrored,input.zoom) : input.heads;
      host.innerHTML = createAnimationArtwork(settings, width, height, seconds,anchors);
    };
    redraw.current=()=>draw(time ?? (motion.matches ? 2.4 : performance.now()/1000));
    const resize = new ResizeObserver(entries => {
      width = entries[0].contentRect.width;
      height = entries[0].contentRect.height;
      draw(time ?? (motion.matches ? 2.4 : performance.now()/1000));
    });
    resize.observe(host);
    const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting;});
    observer.observe(host);
    const tick = (now: number) => {
      if (visible && !document.hidden && now-lastDraw >= 50) {
        draw(time ?? (motion.matches ? 2.4 : now/1000));
        lastDraw = now;
      }
      if (time === undefined && !motion.matches) frame = requestAnimationFrame(tick);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      draw(time ?? (motion.matches ? 2.4 : performance.now()/1000));
      if (time === undefined && !motion.matches) frame = requestAnimationFrame(tick);
    };
    motion.addEventListener('change',restart);
    restart();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); motion.removeEventListener('change',restart); host.innerHTML = ''; redraw.current=undefined; };
  }, [settings, time]);
  return settings.id === 'none' ? null : <span ref={hostRef} className="animated-photo-overlay" aria-hidden="true" />;
};
