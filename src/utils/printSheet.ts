/** A4 print sheet planning, all values in millimetres. */
export const A4 = { width: 210, height: 297 };
export const PRINT_DPI = 300;
const PRINTER_MARGIN = 5; // typical non-borderless margin of home/office printers
const DESIGN_GAP = 6;
const DESIGN_COPIES = 5;
const STRIP_LENGTH = A4.height / 2; // 148.5mm, close to the classic 2x6" strip

export type SheetMode = 'design' | 'save';

export interface SheetItem { x: number; y: number; width: number; height: number; rotated: boolean }
export interface SheetPlan { items: SheetItem[]; cutsX: number[]; cutsY: number[] }

/** Tall strips (e.g. 4-cut) can use the stacked "design" sheet; cards cannot. */
export const isStripRatio = (ratio: number) => ratio < 0.5;

/**
 * design: copies rotated sideways and stacked in one column (the event's Canva layout).
 * save: A4 cut into equal cells with no leftover paper — 4×2 strips or 2×2 A6 cards.
 * Items are in sheet coordinates; a rotated item shows the image turned 90° clockwise.
 */
export function planA4Sheet(imageWidth: number, imageHeight: number, mode: SheetMode, borderless: boolean): SheetPlan {
  const ratio = imageWidth / imageHeight;
  const margin = borderless ? 0 : PRINTER_MARGIN;
  const usableW = A4.width - margin * 2;
  const usableH = A4.height - margin * 2;
  const items: SheetItem[] = [];

  if (mode === 'design' && isStripRatio(ratio)) {
    // Rotated strip: its length runs across the page, its width is the row height.
    let length = Math.min(STRIP_LENGTH, usableW);
    const fits = (len: number) => DESIGN_COPIES * len * ratio + (DESIGN_COPIES - 1) * DESIGN_GAP <= usableH;
    if (!fits(length)) length = (usableH - (DESIGN_COPIES - 1) * DESIGN_GAP) / (DESIGN_COPIES * ratio);
    const thickness = length * ratio;
    const blockH = DESIGN_COPIES * thickness + (DESIGN_COPIES - 1) * DESIGN_GAP;
    const x = (A4.width - length) / 2;
    const top = (A4.height - blockH) / 2;
    for (let i = 0; i < DESIGN_COPIES; i++) items.push({ x, y: top + i * (thickness + DESIGN_GAP), width: length, height: thickness, rotated: true });
    const cutsY = items.flatMap(item => [item.y, item.y + item.height]);
    return { items, cutsX: [x, x + length], cutsY };
  }

  const cols = isStripRatio(ratio) ? 4 : 2;
  const rows = 2;
  const cellW = usableW / cols;
  const cellH = usableH / rows;
  // Cells are portrait, so landscape images are turned to fill them.
  const rotated = ratio > 1;
  const sheetRatio = rotated ? 1 / ratio : ratio;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    // Contain the image in its cell, centered.
    const width = Math.min(cellW, cellH * sheetRatio);
    const height = width / sheetRatio;
    items.push({ x: margin + c * cellW + (cellW - width) / 2, y: margin + r * cellH + (cellH - height) / 2, width, height, rotated });
  }
  return {
    items,
    cutsX: Array.from({ length: cols + 1 }, (_, i) => margin + i * cellW),
    cutsY: Array.from({ length: rows + 1 }, (_, i) => margin + i * cellH),
  };
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
