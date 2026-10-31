/** A4 print sheet planning, all values in millimetres. */
export const A4 = { width: 210, height: 297 };
export const PRINT_DPI = 300;
const PRINTER_MARGIN = 5; // typical non-borderless margin of home/office printers

/** Copies per A4 sheet offered to the user. */
export const SHEET_COPIES = [2, 4, 5, 6, 8] as const;
export type SheetCopies = typeof SHEET_COPIES[number];

export interface SheetItem { x: number; y: number; width: number; height: number; rotated: boolean }
export interface SheetPlan { items: SheetItem[]; cutsX: number[]; cutsY: number[] }

/**
 * Lays out `copies` equal copies on A4 as large as possible: tries every columns × rows split,
 * upright and turned 90°, and keeps the biggest copy. E.g. a 4-cut strip gives
 * 2 → two tall strips, 4/5 → stacked sideways (5 is the event's Canva layout), 6/8 → upright grid.
 * Items are in sheet coordinates; a rotated item shows the image turned 90° clockwise.
 */
export function planA4Sheet(imageWidth: number, imageHeight: number, copies: number, borderless: boolean): SheetPlan {
  const ratio = imageWidth / imageHeight;
  const margin = borderless ? 0 : PRINTER_MARGIN;
  const usableW = A4.width - margin * 2;
  const usableH = A4.height - margin * 2;

  let best = { cols: 1, rows: copies, width: 0, height: 0, rotated: false };
  for (let cols = 1; cols <= copies; cols++) {
    if (copies % cols) continue;
    const rows = copies / cols;
    const cellW = usableW / cols;
    const cellH = usableH / rows;
    for (const rotated of [false, true]) {
      const sheetRatio = rotated ? 1 / ratio : ratio;
      const width = Math.min(cellW, cellH * sheetRatio);
      const height = width / sheetRatio;
      if (width * height > best.width * best.height + 1e-9) best = { cols, rows, width, height, rotated };
    }
  }

  // Copies touch in one centered block: neighbours share a single straight cut (the usual photobooth sheet).
  const { cols, rows, width, height, rotated } = best;
  const left = (A4.width - cols * width) / 2;
  const top = (A4.height - rows * height) / 2;
  const items: SheetItem[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    items.push({ x: left + c * width, y: top + r * height, width, height, rotated });
  }
  return {
    items,
    cutsX: Array.from({ length: cols + 1 }, (_, c) => left + c * width),
    cutsY: Array.from({ length: rows + 1 }, (_, r) => top + r * height),
  };
}

/** Options below this share of the sheet waste too much paper to offer. */
export const MIN_COVERAGE = 0.6;
const TIE = 0.02;

export interface SheetOption { copies: SheetCopies; plan: SheetPlan; coverage: number; recommended: boolean }

/**
 * The copy counts worth offering for this image: those that fill at least MIN_COVERAGE of A4
 * (the best one is always kept), with the fullest sheet marked as recommended.
 */
export function getSheetOptions(imageWidth: number, imageHeight: number, borderless: boolean): SheetOption[] {
  const all = SHEET_COPIES.map(copies => {
    const plan = planA4Sheet(imageWidth, imageHeight, copies, borderless);
    const { width, height } = plan.items[0];
    return { copies, plan, coverage: copies * width * height / (A4.width * A4.height), recommended: false };
  });
  // Near-equal paper use (within TIE): more copies per sheet wins, so a group gets one each.
  const top = Math.max(...all.map(option => option.coverage));
  const close = all.filter(option => option.coverage >= top - TIE);
  const best = close[close.length - 1];
  best.recommended = true;
  return all.filter(option => option === best || option.coverage >= MIN_COVERAGE);
}

/** Draws the plan onto a 300 DPI A4 canvas. Cut lines go first so photos cover them. */
export function renderA4Sheet(image: CanvasImageSource, plan: SheetPlan): HTMLCanvasElement {
  const scale = PRINT_DPI / 25.4;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(A4.width * scale);
  canvas.height = Math.round(A4.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#c4c4c4';
  ctx.lineWidth = 2;
  ctx.setLineDash([18, 14]);
  for (const x of plan.cutsX) { ctx.beginPath(); ctx.moveTo(x * scale, 0); ctx.lineTo(x * scale, canvas.height); ctx.stroke(); }
  for (const y of plan.cutsY) { ctx.beginPath(); ctx.moveTo(0, y * scale); ctx.lineTo(canvas.width, y * scale); ctx.stroke(); }
  for (const item of plan.items) {
    const x = item.x * scale, y = item.y * scale, w = item.width * scale, h = item.height * scale;
    if (!item.rotated) { ctx.drawImage(image, x, y, w, h); continue; }
    ctx.save();
    // Rotate clockwise: the strip's top (header) ends up on the right, like the event design.
    ctx.translate(x + w, y);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(image, 0, 0, h, w);
    ctx.restore();
  }
  return canvas;
}
