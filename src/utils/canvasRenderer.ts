import { CapturedPhoto, FrameTheme, LayoutConfig } from '../types/photobooth';
import { FILTERS } from '../config/filters';
import { getCoverCrop } from './cameraZoom';
import { createAnimationArtwork } from './animatedEffects';
import { isHeadAnimation } from '../config/animations';
import { projectHeadAnchors } from './headGeometry';
import { createFrameArtwork, getFrameGeometry, svgDataUrl } from './frameArtwork';

/**
 * Draws an image fitted to a container rectangle using cover (center cropped).
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  x: number,
  y: number,
  targetWidth: number,
  targetHeight: number,
  isMirrored = false,
  zoom = 1
) {
  const imgWidth = (img instanceof HTMLVideoElement) ? img.videoWidth : img.width;
  const imgHeight = (img instanceof HTMLVideoElement) ? img.videoHeight : img.height;

  const crop=getCoverCrop(imgWidth,imgHeight,targetWidth,targetHeight,zoom);
  if(!crop)return;
  const {x:sx,y:sy,width:sWidth,height:sHeight}=crop;

  ctx.save();
  if (isMirrored) {
    ctx.translate(x + targetWidth, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
  } else {
    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, targetWidth, targetHeight);
  }
  ctx.restore();
}

/**
 * Procedural retro scanlines shader
 */
export function drawScanlines(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  const step = 4;
  for (let y = 0; y < height; y += step) {
    ctx.fillRect(0, y, width, 1.5);
  }
  ctx.restore();
}

/**
 * Procedural subtle analog film scratches
 */
export function drawFilmScratches(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1;

  // Vertical light scratches
  for (let i = 0; i < 4; i++) {
    const startX = Math.random() * width;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + (Math.random() * 8 - 4), height);
    ctx.stroke();
  }

  // Dust specks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 15; i++) {
    const px = Math.random() * width;
    const py = Math.random() * height;
    ctx.fillRect(px, py, 1.5, 1.5);
  }
  ctx.restore();
}

/**
 * Procedural grain tile
 */
export function drawGrain(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 64;
  grainCanvas.height = 64;
  const gCtx = grainCanvas.getContext('2d');
  if (gCtx) {
    const imgData = gCtx.createImageData(64, 64);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 16; // soft opacity
    }
    gCtx.putImageData(imgData, 0, 0);

    const pattern = ctx.createPattern(grainCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    }
  }
  ctx.restore();
}

export interface RenderStripOptions {
  layout: LayoutConfig;
  theme: FrameTheme;
  photos: CapturedPhoto[];
  caption: string;
  showDate: boolean;
  showTime: boolean;
  dateStr?: string;
  timeStr?: string;
  animationOffset?: number;
}

/**
 * Compiles the entire photo strip with high precision math matching the reverse-engineered formulas
 */
export async function renderPhotoStrip(options: RenderStripOptions): Promise<HTMLCanvasElement> {
  const render = await preparePhotoStripRenderer(options);
  return render();
}

export async function preparePhotoStripRenderer(options: RenderStripOptions) {
  const entries = await Promise.all(options.photos.map(photo => new Promise<[string, HTMLImageElement]>((resolve,reject)=>{
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve([photo.dataUrl,image]);
    image.onerror = () => reject(new Error('Foto tidak dapat dimuat.'));
    image.src = photo.dataUrl;
  })));
  const images = new Map(entries);
  return (photos = options.photos, animationOffset = options.animationOffset ?? 0) =>
    renderPreparedPhotoStrip({...options,photos,animationOffset},photos.map(photo=>{
      const image=images.get(photo.dataUrl);
      if(!image)throw new Error('Foto berubah selama ekspor.');
      return image;
    }));
}

async function renderPreparedPhotoStrip(options:RenderStripOptions, loadedImages:HTMLImageElement[]):Promise<HTMLCanvasElement> {
  const {
    layout,
    theme,
    photos,
    caption,
    showDate,
    showTime,
    dateStr,
    timeStr,
    animationOffset = 0,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Draw Background
  ctx.fillStyle = theme.bgValue;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { unit, windows } = getFrameGeometry(layout, theme);
  if (theme.design) {
    const background = await loadArtwork(createFrameArtwork(layout, theme, 'background'));
    ctx.drawImage(background, 0, 0);
  }
  for (let index = 0; index < Math.min(loadedImages.length, windows.length); index++) {
    const window = windows[index];
    const photo=photos[index];
    const filterConfig=FILTERS[photo.filter] || FILTERS.normal;
    const animation=photo.animation;
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = Math.ceil(window.width);
    photoCanvas.height = Math.ceil(window.height);
    const photoContext = photoCanvas.getContext('2d');
    if (!photoContext) continue;
    photoContext.filter = filterConfig.cssFilter;
    drawImageCover(photoContext, loadedImages[index], 0, 0, photoCanvas.width, photoCanvas.height);
    photoContext.filter = 'none';
    if (filterConfig.hasScanlines) drawScanlines(photoContext, photoCanvas.width, photoCanvas.height);
    if (filterConfig.hasFilmScratches) drawFilmScratches(photoContext, photoCanvas.width, photoCanvas.height);
    if (filterConfig.hasGrain) drawGrain(photoContext, photoCanvas.width, photoCanvas.height);
    if (animation && animation.id !== 'none') {
      let heads;
      if (isHeadAnimation(animation.id)) {
        const {detectPhotoHeads}=await import('./headTracking');
        const detected=await detectPhotoHeads(photo.dataUrl,loadedImages[index]);
        heads=projectHeadAnchors(detected,loadedImages[index].width,loadedImages[index].height,photoCanvas.width,photoCanvas.height);
      }
      const artwork = createAnimationArtwork(animation, photoCanvas.width, photoCanvas.height, photo.animationTime + animationOffset, heads);
      const effectImage = await loadArtwork(artwork);
      photoContext.drawImage(effectImage, 0, 0);
    }
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(window.x, window.y, window.width, window.height, window.radius);
    ctx.clip();
    ctx.drawImage(photoCanvas, window.x, window.y, window.width, window.height);
    ctx.restore();
  }
  if (theme.design) {
    const overlay = await loadArtwork(createFrameArtwork(layout, theme, 'overlay'));
    ctx.drawImage(overlay, 0, 0);
  }

  // 4. Draw Bottom Branding & Date/Time Stamp
  const bottomY = theme.design ? layout.canvasHeight - 56 * unit : layout.canvasHeight - layout.bottomPadding / 2;

  ctx.fillStyle = theme.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Custom Caption or Studio Brand
  const mainCaption = caption.trim() || 'PHOTOBOOTH STUDIO';
  const captionSize = theme.design ? 20 * unit : 24;
  ctx.font = `700 ${captionSize}px "Syne", "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = `${theme.design ? 2 * unit : 3}px`;
  ctx.fillText(mainCaption.toUpperCase(), layout.canvasWidth / 2, bottomY - 14 * (theme.design ? unit : 1), layout.canvasWidth - 100 * unit);

  // Date & Time
  const now = new Date();
  const dText = dateStr || now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const tText = timeStr || now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const dateParts: string[] = [];
  if (showDate) dateParts.push(dText);
  if (showTime) dateParts.push(tText);

  if (dateParts.length > 0) {
    ctx.font = `500 ${theme.design ? 12 * unit : 15}px "Space Grotesk", monospace`;
    ctx.letterSpacing = '1px';
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.8;
    ctx.fillText(dateParts.join(' • '), layout.canvasWidth / 2, bottomY + 16 * (theme.design ? unit : 1));
    ctx.globalAlpha = 1.0;
  }

  return canvas;
}

function loadArtwork(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Frame artwork could not be loaded'));
    image.src = svgDataUrl(svg);
  });
}
