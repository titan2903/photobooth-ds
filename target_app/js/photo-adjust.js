// Per-photo pan (drag) and zoom (pinch/scroll) directly on the live preview
// canvas, shared across every customize page the same way
// js/layout-switcher.js and js/photo-reorder.js are. State lives in memory
// only, for the lifetime of the customize session (same as frame color or
// sticker picks) - no IndexedDB persistence.
//
// This does NOT replace each page's own object-fit:cover crop math (the
// imgAspect > targetAspect sx/sy/sWidth/sHeight block every customize page
// already has, once per draw function). Instead, applyToSourceRect()
// composes on top of whatever source rect that math already produced, so
// every page keeps its own cropping logic and just runs the result through
// this one extra step before calling drawImage. attachCanvasInteraction()
// is the other half: it turns pointer drags and pinch/wheel gestures on the
// rendered canvas into calls into that same state.
const PhotoAdjust = (() => {
  const DEFAULT_ADJUSTMENT = { offsetX: 0, offsetY: 0, zoom: 1 };
  const WHEEL_ZOOM_STEP = 1.08;
  const MIN_ZOOM = 1; // 1 = exactly the page's normal auto-fit crop
  const MAX_ZOOM = 3;

  let adjustments = new Map();

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function get(photoIndex) {
    const stored = adjustments.get(photoIndex);
    return stored ? { ...stored } : { ...DEFAULT_ADJUSTMENT };
  }

  function set(photoIndex, partial) {
    const next = { ...get(photoIndex), ...partial };
    next.zoom = clamp(next.zoom, MIN_ZOOM, MAX_ZOOM);
    next.offsetX = clamp(next.offsetX, -0.5, 0.5);
    next.offsetY = clamp(next.offsetY, -0.5, 0.5);
    adjustments.set(photoIndex, next);
    return next;
  }

  function reset(photoIndex) {
    adjustments.delete(photoIndex);
  }

  function resetAll() {
    adjustments = new Map();
  }

  function nudge(photoIndex, dx, dy) {
    const current = get(photoIndex);
    return set(photoIndex, { offsetX: current.offsetX + dx, offsetY: current.offsetY + dy });
  }

  function zoomBy(photoIndex, factor) {
    const current = get(photoIndex);
    return set(photoIndex, { zoom: current.zoom * factor });
  }

  // rect: { sx, sy, sWidth, sHeight } - the source rect the caller already
  // computed (in the original image's own pixel space) to crop it to the
  // target slot's aspect ratio. imgWidth/imgHeight are the full source
  // image's natural dimensions, used to keep the result from sampling
  // outside the actual photo.
  function applyToSourceRect(rect, imgWidth, imgHeight, photoIndex) {
    const { offsetX, offsetY, zoom } = get(photoIndex);
    let { sx, sy, sWidth, sHeight } = rect;

    if (zoom !== 1) {
      const nextWidth = sWidth / zoom;
      const nextHeight = sHeight / zoom;
      sx += (sWidth - nextWidth) / 2;
      sy += (sHeight - nextHeight) / 2;
      sWidth = nextWidth;
      sHeight = nextHeight;
    }

    sx += offsetX * sWidth;
    sy += offsetY * sHeight;

    sx = clamp(sx, 0, Math.max(0, imgWidth - sWidth));
    sy = clamp(sy, 0, Math.max(0, imgHeight - sHeight));

    return { sx, sy, sWidth, sHeight };
  }

  function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  // Wires drag-to-pan, pinch-to-zoom (touch), and scroll-to-zoom (mouse)
  // directly on the live preview canvas - no separate button UI.
  //
  // `containerEl` is the stable element the canvas gets (re)appended into
  // on every redraw (e.g. #photoPreview); listeners are attached here once,
  // via delegation, rather than on the canvas itself, since every redraw
  // throws the old canvas away and appends a new one.
  //
  // `getSlots()` must return the CURRENT photo rects in canvas-pixel space
  // (the same coordinate system as the destination args each page already
  // passes to drawImage/clipAndDrawImage): [{ index, x, y, width, height }].
  // Called fresh on every interaction since layout can change between
  // redraws (reordering, photo count, etc).
  //
  // `onAdjust` is called after every change so the host page re-runs its
  // own redraw with the new pan/zoom applied.
  function attachCanvasInteraction(containerEl, { getSlots, onAdjust } = {}) {
    if (!containerEl || typeof getSlots !== 'function') return;

    function getCanvas() {
      return containerEl.querySelector('canvas');
    }

    function toCanvasPoint(canvas, clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function findSlot(point) {
      const slots = getSlots() || [];
      return slots.find((slot) => point.x >= slot.x && point.x <= slot.x + slot.width && point.y >= slot.y && point.y <= slot.y + slot.height) || null;
    }

    function notify() {
      if (typeof onAdjust === 'function') onAdjust();
    }

    const activePointers = new Map(); // pointerId -> { x, y } in client space
    let dragState = null; // { index, slot, startClientX, startClientY, startOffsetX, startOffsetY }
    let pinchState = null; // { index, startDistance, startZoom }

    function beginPinch(canvas) {
      const points = Array.from(activePointers.values()).map((p) => toCanvasPoint(canvas, p.x, p.y));
      const midpoint = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      const slot = findSlot(midpoint);
      if (!slot) return;
      const current = get(slot.index);
      dragState = null;
      pinchState = { index: slot.index, startDistance: distance(points[0], points[1]) || 1, startZoom: current.zoom };
    }

    containerEl.addEventListener('pointerdown', (e) => {
      const canvas = getCanvas();
      if (!canvas) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 1) {
        const point = toCanvasPoint(canvas, e.clientX, e.clientY);
        const slot = findSlot(point);
        if (!slot) return;
        const current = get(slot.index);
        dragState = {
          index: slot.index,
          slot,
          startClientX: e.clientX,
          startClientY: e.clientY,
          startOffsetX: current.offsetX,
          startOffsetY: current.offsetY
        };
        if (canvas.setPointerCapture) {
          try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      } else if (activePointers.size === 2) {
        beginPinch(canvas);
      }
    });

    containerEl.addEventListener('pointermove', (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const canvas = getCanvas();
      if (!canvas) return;

      if (pinchState && activePointers.size === 2) {
        const points = Array.from(activePointers.values()).map((p) => toCanvasPoint(canvas, p.x, p.y));
        const newDistance = distance(points[0], points[1]);
        if (newDistance > 0) {
          // Fingers spreading apart (newDistance > start) should zoom in,
          // i.e. shrink the crop - scaleFactor < 1 - so it's startDistance
          // over newDistance, not the other way around.
          const scaleFactor = pinchState.startDistance / newDistance;
          set(pinchState.index, { zoom: pinchState.startZoom / scaleFactor });
          notify();
        }
        return;
      }

      if (dragState) {
        const canvasRect = canvas.getBoundingClientRect();
        if (canvasRect.width === 0 || canvasRect.height === 0) return;
        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;
        const dxCanvas = (e.clientX - dragState.startClientX) * scaleX;
        const dyCanvas = (e.clientY - dragState.startClientY) * scaleY;
        // Dragging the photo right should make its content visibly follow
        // the pointer (grab-the-photo feel, same convention as
        // student-id-card-customize's canvas drag) - offsetX decreases as
        // the pointer moves right, since that's what shifts the sampled
        // source rect left (revealing more of the photo's left edge).
        const nextOffsetX = dragState.startOffsetX - (dxCanvas / dragState.slot.width);
        const nextOffsetY = dragState.startOffsetY - (dyCanvas / dragState.slot.height);
        set(dragState.index, { offsetX: nextOffsetX, offsetY: nextOffsetY });
        notify();
      }
    });

    function endPointer(e) {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) pinchState = null;
      if (activePointers.size === 0) dragState = null;
    }
    containerEl.addEventListener('pointerup', endPointer);
    containerEl.addEventListener('pointercancel', endPointer);
    containerEl.addEventListener('pointerleave', (e) => {
      // Only a mouse realistically fires this mid-drag (touch gives
      // pointercancel instead); a real mouse has exactly one active pointer.
      if (activePointers.size <= 1) endPointer(e);
    });

    containerEl.addEventListener('wheel', (e) => {
      const canvas = getCanvas();
      if (!canvas) return;
      const point = toCanvasPoint(canvas, e.clientX, e.clientY);
      const slot = findSlot(point);
      if (!slot) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
      zoomBy(slot.index, factor);
      notify();
    }, { passive: false });
  }

  return { get, set, reset, resetAll, nudge, zoomBy, applyToSourceRect, attachCanvasInteraction };
})();
