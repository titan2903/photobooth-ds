import { FilterId, FrameTheme, LayoutConfig } from '../types/photobooth';
import { FILTERS } from '../config/filters';

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
  isMirrored = false
) {
  const imgWidth = (img instanceof HTMLVideoElement) ? img.videoWidth : img.width;
  const imgHeight = (img instanceof HTMLVideoElement) ? img.videoHeight : img.height;

  if (!imgWidth || !imgHeight) return;

  const targetRatio = targetWidth / targetHeight;
  const imgRatio = imgWidth / imgHeight;

  let sWidth = imgWidth;
  let sHeight = imgHeight;
  let sx = 0;
  let sy = 0;

  if (imgRatio > targetRatio) {
    sWidth = imgHeight * targetRatio;
    sx = (imgWidth - sWidth) / 2;
  } else {
    sHeight = imgWidth / targetRatio;
    sy = (imgHeight - sHeight) / 2;
  }

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
  photoDataUrls: string[];
  filter: FilterId;
  caption: string;
  showDate: boolean;
  showTime: boolean;
  dateStr?: string;
  timeStr?: string;
}

/**
 * Compiles the entire photo strip with high precision math matching the reverse-engineered formulas
 */
export async function renderPhotoStrip(options: RenderStripOptions): Promise<HTMLCanvasElement> {
  const {
    layout,
    theme,
    photoDataUrls,
    filter,
    caption,
    showDate,
    showTime,
    dateStr,
    timeStr,
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

  // 2. Pre-load all photos into Image objects
  const loadedImages: HTMLImageElement[] = await Promise.all(
    photoDataUrls.map((url) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    })
  );

  // 3. Compute Photo Grid Geometry
  const { borderWidth, spacing, bottomPadding, gridColumns, photoCount } = layout;
  const filterConfig = FILTERS[filter] || FILTERS.normal;

  if (gridColumns === 1) {
    // Vertical Strip
    const availableHeight = layout.canvasHeight - (borderWidth * 2) - (spacing * (photoCount - 1)) - bottomPadding;
    const photoHeight = availableHeight / photoCount;
    const photoWidth = layout.canvasWidth - (borderWidth * 2);

    for (let i = 0; i < loadedImages.length; i++) {
      const img = loadedImages[i];
      const x = borderWidth;
      const y = borderWidth + i * (photoHeight + spacing);

      // Render photo on an isolated canvas to apply CSS filter and post-shaders
      const photoCanvas = document.createElement('canvas');
      photoCanvas.width = photoWidth;
      photoCanvas.height = photoHeight;
      const pCtx = photoCanvas.getContext('2d');

      if (pCtx) {
        pCtx.filter = filterConfig.cssFilter;
        drawImageCover(pCtx, img, 0, 0, photoWidth, photoHeight, false);
        pCtx.filter = 'none';

        if (filterConfig.hasScanlines) {
          drawScanlines(pCtx, photoWidth, photoHeight);
        }
        if (filterConfig.hasFilmScratches) {
          drawFilmScratches(pCtx, photoWidth, photoHeight);
        }
        if (filterConfig.hasGrain) {
          drawGrain(pCtx, photoWidth, photoHeight);
        }

        // Draw onto the master strip
        ctx.drawImage(photoCanvas, x, y);
      }
    }
  } else {
    // 2x2 Postcard Grid
    const rows = Math.ceil(photoCount / gridColumns);
    const availableWidth = layout.canvasWidth - (borderWidth * 2) - spacing;
    const availableHeight = layout.canvasHeight - (borderWidth * 2) - (spacing * (rows - 1)) - bottomPadding;
    const photoWidth = availableWidth / gridColumns;
    const photoHeight = availableHeight / rows;

    for (let i = 0; i < loadedImages.length; i++) {
      const img = loadedImages[i];
      const col = i % gridColumns;
      const row = Math.floor(i / gridColumns);
      const x = borderWidth + col * (photoWidth + spacing);
      const y = borderWidth + row * (photoHeight + spacing);

      const photoCanvas = document.createElement('canvas');
      photoCanvas.width = photoWidth;
      photoCanvas.height = photoHeight;
      const pCtx = photoCanvas.getContext('2d');

      if (pCtx) {
        pCtx.filter = filterConfig.cssFilter;
        drawImageCover(pCtx, img, 0, 0, photoWidth, photoHeight, false);
        pCtx.filter = 'none';

        if (filterConfig.hasScanlines) {
          drawScanlines(pCtx, photoWidth, photoHeight);
        }
        if (filterConfig.hasFilmScratches) {
          drawFilmScratches(pCtx, photoWidth, photoHeight);
        }
        if (filterConfig.hasGrain) {
          drawGrain(pCtx, photoWidth, photoHeight);
        }

        ctx.drawImage(photoCanvas, x, y);
      }
    }
  }

  // 4. Draw Bottom Branding & Date/Time Stamp
  const bottomY = layout.canvasHeight - (bottomPadding / 2);

  ctx.fillStyle = theme.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Custom Caption or Studio Brand
  const mainCaption = caption.trim() || 'PHOTOBOOTH STUDIO';
  ctx.font = '700 24px "Syne", "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(mainCaption.toUpperCase(), layout.canvasWidth / 2, bottomY - 14);

  // Date & Time
  const now = new Date();
  const dText = dateStr || now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const tText = timeStr || now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const dateParts: string[] = [];
  if (showDate) dateParts.push(dText);
  if (showTime) dateParts.push(tText);

  if (dateParts.length > 0) {
    ctx.font = '500 15px "Space Grotesk", monospace';
    ctx.letterSpacing = '1px';
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.8;
    ctx.fillText(dateParts.join(' • '), layout.canvasWidth / 2, bottomY + 16);
    ctx.globalAlpha = 1.0;
  }

  return canvas;
}
