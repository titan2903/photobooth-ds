/**
 * Crop Preview Editor
 *
 * Interactive crop controller for the review modal. It owns canvas rendering,
 * drag / resize handling, photo switching, preset selection, and crop state.
 */

const CropPreview = (() => {
  const DEFAULT_CANVAS_WIDTH = 960;
  const MAX_CANVAS_SIDE = 8192;
  const DEFAULT_CANVAS_HEIGHT = 720;
  const MIN_CROP_SIZE = 72;
  const HANDLE_SIZE = 24; /* larger visual handles for touch */
  const HANDLE_HIT_SIZE = 44; /* wider hit area for touch */
  const MOVE_HIT_PADDING = 18;
  const BG_COLOR = '#fbfbfc';
  const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.36)';
  const GRID_COLOR = 'rgba(0, 0, 0, 0.12)';
  const FRAME_COLOR = '#ffffff';
  const ACCENT_COLOR = '#ff4f95';
  const SELECTED_BG = 'rgba(255, 79, 149, 0.12)';
  const ROTATE_HANDLE_OFFSET = 42;

  const PRESETS = {
    original: { label: 'Freeform', ratio: null },
    square: { label: '1:1 Square', ratio: 1 },
    portrait43: { label: '4:3 Portrait', ratio: 3 / 4 },
    portrait34: { label: '3:4 Portrait', ratio: 4 / 3 },
    portrait23: { label: '2:3 Portrait', ratio: 2 / 3 },
    strip14: { label: '1:4 Strip', ratio: 1 / 4 }
  };

    const CROP_PREVIEW_DEBUG = !!(window && window.__CROP_PREVIEW_DEBUG);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function cloneCropState(state) {
    return {
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
      photoIndex: state.photoIndex,
      rotation: isFiniteNumber(state.rotation) ? state.rotation : 0,
      presetKey: PRESETS[state.presetKey] ? state.presetKey : 'original'
    };
  }

  function normalizeCropState(state) {
    if (!state || typeof state !== 'object') {
      return null;
    }

    if (isFiniteNumber(state.x) && isFiniteNumber(state.y) && isFiniteNumber(state.width) && isFiniteNumber(state.height)) {
      return {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        photoIndex: isFiniteNumber(state.photoIndex) ? state.photoIndex : 0,
        rotation: isFiniteNumber(state.rotation) ? state.rotation : 0,
        presetKey: PRESETS[state.presetKey] ? state.presetKey : 'original'
      };
    }

    if (isFiniteNumber(state.cropX) && isFiniteNumber(state.cropY) && isFiniteNumber(state.cropWidth) && isFiniteNumber(state.cropHeight)) {
      return {
        x: state.cropX,
        y: state.cropY,
        width: state.cropWidth,
        height: state.cropHeight,
        photoIndex: isFiniteNumber(state.photoIndex) ? state.photoIndex : 0,
        rotation: isFiniteNumber(state.rotation) ? state.rotation : 0,
        presetKey: PRESETS[state.presetKey] ? state.presetKey : 'original'
      };
    }

    return null;
  }

  function validateCropState(state) {
    const normalized = normalizeCropState(state);
    if (!normalized) {
      return { valid: false, error: 'Crop state must include x, y, width, and height' };
    }

    if (normalized.width <= 0 || normalized.height <= 0) {
      return { valid: false, error: 'Crop dimensions must be positive' };
    }

    if (normalized.x < 0 || normalized.y < 0) {
      return { valid: false, error: 'Crop position must be non-negative' };
    }

    return { valid: true, data: normalized };
  }

  function getPresetDefinitions() {
    return Object.keys(PRESETS).map((key) => ({ key, ...PRESETS[key] }));
  }

  function getPresetRatio(presetKey) {
    return PRESETS[presetKey] ? PRESETS[presetKey].ratio : PRESETS.original.ratio;
  }

  function fitImageRect(imageWidth, imageHeight, canvasWidth, canvasHeight) {
    if (!isFiniteNumber(imageWidth) || !isFiniteNumber(imageHeight) || imageWidth <= 0 || imageHeight <= 0 || !isFiniteNumber(canvasWidth) || !isFiniteNumber(canvasHeight) || canvasWidth <= 0 || canvasHeight <= 0) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    const imageRatio = imageWidth / imageHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let width;
    let height;

    if (imageRatio > canvasRatio) {
      width = canvasWidth;
      height = canvasWidth / imageRatio;
    } else {
      height = canvasHeight;
      width = canvasHeight * imageRatio;
    }

    return {
      x: (canvasWidth - width) / 2,
      y: (canvasHeight - height) / 2,
      width,
      height
    };
  }

  function scaleCropStateForBounds(state, previousBounds, nextBounds) {
    const normalized = normalizeCropState(state);
    if (!normalized) {
      return null;
    }

    if (!previousBounds || previousBounds.width <= 0 || previousBounds.height <= 0) {
      return clampCropToBounds(normalized, nextBounds, getPresetRatio(normalized.presetKey));
    }

    const scaleX = nextBounds.width / previousBounds.width;
    const scaleY = nextBounds.height / previousBounds.height;
    return clampCropToBounds({
      ...normalized,
      x: nextBounds.x + ((normalized.x - previousBounds.x) * scaleX),
      y: nextBounds.y + ((normalized.y - previousBounds.y) * scaleY),
      width: normalized.width * scaleX,
      height: normalized.height * scaleY
    }, nextBounds, getPresetRatio(normalized.presetKey));
  }


  function fitCropToBounds(bounds, ratio, centerX, centerY) {
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
      return {
        x: 0,
        y: 0,
        width: MIN_CROP_SIZE,
        height: MIN_CROP_SIZE
      };
    }

    if (!ratio) {
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      };
    }

    let width = bounds.width * 0.84;
    let height = width / ratio;

    if (height > bounds.height * 0.84) {
      height = bounds.height * 0.84;
      width = height * ratio;
    }

    if (width < MIN_CROP_SIZE) {
      width = MIN_CROP_SIZE;
      height = width / ratio;
    }

    if (height < MIN_CROP_SIZE) {
      height = MIN_CROP_SIZE;
      width = height * ratio;
    }

    if (width > bounds.width) {
      width = bounds.width;
      height = width / ratio;
    }

    if (height > bounds.height) {
      height = bounds.height;
      width = height * ratio;
    }

    const x = clamp((centerX ?? bounds.x + bounds.width / 2) - width / 2, bounds.x, bounds.x + bounds.width - width);
    const y = clamp((centerY ?? bounds.y + bounds.height / 2) - height / 2, bounds.y, bounds.y + bounds.height - height);

    return { x, y, width, height };
  }

  function clampCropToBounds(cropState, bounds, ratio) {
    const normalized = normalizeCropState(cropState) || {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      photoIndex: 0
    };

    let width = normalized.width;
    let height = normalized.height;

    if (ratio) {
      if (width / height > ratio) {
        width = height * ratio;
      } else {
        height = width / ratio;
      }
    }

    width = clamp(width, MIN_CROP_SIZE, bounds.width);
    height = clamp(height, MIN_CROP_SIZE, bounds.height);

    if (ratio) {
      if (width / height > ratio) {
        width = height * ratio;
      } else {
        height = width / ratio;
      }
    }

    width = clamp(width, MIN_CROP_SIZE, bounds.width);
    height = clamp(height, MIN_CROP_SIZE, bounds.height);

    const x = clamp(normalized.x, bounds.x, bounds.x + bounds.width - width);
    const y = clamp(normalized.y, bounds.y, bounds.y + bounds.height - height);

    return {
      x,
      y,
      width,
      height,
      photoIndex: normalized.photoIndex,
      rotation: isFiniteNumber(normalized.rotation) ? normalized.rotation : 0,
      presetKey: PRESETS[normalized.presetKey] ? normalized.presetKey : 'original'
    };
  }

  function createDefaultCropState(bounds, presetKey, photoIndex) {
    const ratio = getPresetRatio(presetKey);
    const crop = fitCropToBounds(bounds, ratio, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

    return {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
      photoIndex: isFiniteNumber(photoIndex) ? photoIndex : 0,
      rotation: 0,
      presetKey: PRESETS[presetKey] ? presetKey : 'original'
    };
  }

  function createController(canvas, options = {}) {
    if (!canvas) {
      throw new Error('A canvas element is required');
    }

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('2D canvas context is not available');
    }

    const imageSources = Array.isArray(options.images) ? options.images.slice() : [];
    const photoCount = imageSources.length;
    const initialPhotoIndex = clamp(isFiniteNumber(options.photoIndex) ? options.photoIndex : 0, 0, Math.max(photoCount - 1, 0));
    const initialPresetKey = PRESETS[options.presetKey] ? options.presetKey : 'original';

    let destroyed = false;
    let renderQueued = false;
    let rafId = 0;
    let image = null;
    let imageBounds = { x: 0, y: 0, width: DEFAULT_CANVAS_WIDTH, height: DEFAULT_CANVAS_HEIGHT };

    function updateImageBoundsFromSource(sourceImage, renderCanvas, shouldReflowCropStates = false) {
      if (!sourceImage || !renderCanvas) {
        return;
      }

      const previousBounds = imageBounds;
      const sourceWidth = isFiniteNumber(sourceImage.naturalWidth) && sourceImage.naturalWidth > 0
        ? sourceImage.naturalWidth
        : sourceImage.width;
      const sourceHeight = isFiniteNumber(sourceImage.naturalHeight) && sourceImage.naturalHeight > 0
        ? sourceImage.naturalHeight
        : sourceImage.height;
      const rect = renderCanvas.getBoundingClientRect();
      const displayWidth = rect.width || DEFAULT_CANVAS_WIDTH;
      const displayHeight = rect.height || DEFAULT_CANVAS_HEIGHT;
      const fittedRect = fitImageRect(sourceWidth, sourceHeight, displayWidth, displayHeight);
      const nextBounds = fittedRect.width > 0 && fittedRect.height > 0
        ? fittedRect
        : { x: 0, y: 0, width: displayWidth, height: displayHeight };
      const boundsChanged = !previousBounds
        || previousBounds.x !== nextBounds.x
        || previousBounds.y !== nextBounds.y
        || previousBounds.width !== nextBounds.width
        || previousBounds.height !== nextBounds.height;

      imageBounds = nextBounds;

      if (shouldReflowCropStates && boundsChanged) {
        const snapshot = new Map(photoCropStates);
        snapshot.forEach((state, index) => {
          const scaledState = scaleCropStateForBounds(state, previousBounds, nextBounds);
          if (scaledState) {
            photoCropStates.set(index, scaledState);
          }
        });

        if (currentCropState) {
          const scaledCurrentState = scaleCropStateForBounds(currentCropState, previousBounds, nextBounds);
          if (scaledCurrentState) {
            currentCropState = scaledCurrentState;
            currentCropState.photoIndex = currentPhotoIndex;
            currentCropState.presetKey = currentPresetKey;
          }
        }

        const persistedState = photoCropStates.get(currentPhotoIndex);
        if (persistedState) {
          persistedState.photoIndex = currentPhotoIndex;
          persistedState.presetKey = currentPresetKey;
          photoCropStates.set(currentPhotoIndex, cloneCropState(persistedState));
        } else if (currentCropState) {
          photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
        }
      }

      if (CROP_PREVIEW_DEBUG) {
        try {
          console.debug('CropPreview:updateImageBounds', { photoIndex: currentPhotoIndex, sourceWidth, sourceHeight, displayWidth, displayHeight, imageBounds });
        } catch (e) { /* ignore logging errors */ }
      }
    }

    let currentPhotoIndex = initialPhotoIndex;
    let currentPresetKey = initialPresetKey;
    let currentCropState = {
      x: 0,
      y: 0,
      width: DEFAULT_CANVAS_WIDTH,
      height: DEFAULT_CANVAS_HEIGHT,
      photoIndex: initialPhotoIndex,
      rotation: 0,
      presetKey: initialPresetKey
    };
    let isDragging = false;
    let activeHandle = null;
    let dragStartPoint = null;
    let dragStartState = null;
    let dragPointerId = null;

    canvas.tabIndex = canvas.tabIndex >= 0 ? canvas.tabIndex : 0;
    canvas.style.touchAction = 'none';

    const imageCache = new Map();
    const loadPromises = new Map();
    const photoCropStates = new Map();
    const photoPresetKeys = new Map();

    function emitChange(reason) {
      if (typeof options.onChange === 'function') {
        options.onChange({
          cropState: cloneCropState(currentCropState),
          photoIndex: currentPhotoIndex,
          presetKey: currentPresetKey,
          reason
        });
      }
    }

    function emitPhotoChange(reason) {
      if (typeof options.onPhotoChange === 'function') {
        options.onPhotoChange({
          photoIndex: currentPhotoIndex,
          photoCount,
          photoSrc: imageSources[currentPhotoIndex] || null,
          reason,
          cropState: cloneCropState(currentCropState),
          presetKey: currentPresetKey
        });
      }
    }

    function emitReady() {
      if (typeof options.onReady === 'function') {
        if (CROP_PREVIEW_DEBUG) {
          try {
            console.debug('CropPreview:ready', { photoCount, photoIndex: currentPhotoIndex, cropState: cloneCropState(currentCropState) });
          } catch (e) { /* ignore */ }
        }
        options.onReady({
          photoCount,
          photoIndex: currentPhotoIndex,
          cropState: cloneCropState(currentCropState)
        });
      }
    }

    function emitBusy(isBusy) {
      if (typeof options.onBusyChange === 'function') {
        options.onBusyChange(isBusy);
      }
    }

    function scheduleRender() {
      if (destroyed || renderQueued) {
        return;
      }

      renderQueued = true;
      rafId = window.requestAnimationFrame(() => {
        renderQueued = false;
        rafId = 0;
        render();
      });
    }

    function resizeCanvas(shouldReflowCropStates = true) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return false;
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      const nextWidth = Math.max(1, Math.round(rect.width * devicePixelRatio));
      const nextHeight = Math.max(1, Math.round(rect.height * devicePixelRatio));

      // Without its stylesheet the canvas's CSS size follows its bitmap, so
      // each resize would grow it by devicePixelRatio. Stop resizing past any
      // real screen size rather than feed that loop.
      const withinLimit = nextWidth <= MAX_CANVAS_SIDE && nextHeight <= MAX_CANVAS_SIDE;

      if (withinLimit && (canvas.width !== nextWidth || canvas.height !== nextHeight)) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      if (image) {
        updateImageBoundsFromSource(image, canvas, shouldReflowCropStates);
      }

      return true;
    }

    function setCanvasSourceImage(nextImage) {
      image = nextImage;
      updateImageBoundsFromSource(image, canvas, false);
    }

    function getImageSource(photoIndex = currentPhotoIndex) {
      return imageSources[photoIndex] || null;
    }

    function loadImage(photoIndex) {
      const src = getImageSource(photoIndex);
      if (!src) {
        return Promise.reject(new Error('No image source available'));
      }

      if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src));
      }

      if (loadPromises.has(src)) {
        return loadPromises.get(src);
      }

      emitBusy(true);
      const loader = new Promise((resolve, reject) => {
        const nextImage = new Image();
        nextImage.onload = () => {
          imageCache.set(src, nextImage);
          if (CROP_PREVIEW_DEBUG) {
            try {
              console.debug('CropPreview:loaded image', { photoIndex, src, naturalWidth: nextImage.naturalWidth, naturalHeight: nextImage.naturalHeight });
            } catch (e) { /* ignore */ }
          }
          resolve(nextImage);
        };
        nextImage.onerror = () => {
          reject(new Error(`Failed to load image at index ${photoIndex}`));
        };
        nextImage.src = src;
      }).finally(() => {
        loadPromises.delete(src);
      });

      loadPromises.set(src, loader);
      return loader;
    }

    function ensureCurrentPhotoState() {
      if (!currentCropState || currentCropState.photoIndex !== currentPhotoIndex) {
        currentCropState = createDefaultCropState(imageBounds, currentPresetKey, currentPhotoIndex);
      }
    }

    function setCropState(nextState) {
      const validation = validateCropState(nextState);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const normalized = validation.data;
      currentCropState = clampCropToBounds(normalized, imageBounds, getPresetRatio(currentPresetKey));
      currentCropState.photoIndex = isFiniteNumber(normalized.photoIndex) ? normalized.photoIndex : currentPhotoIndex;
      currentCropState.rotation = isFiniteNumber(normalized.rotation) ? normalized.rotation : currentCropState.rotation || 0;
      currentCropState.presetKey = PRESETS[normalized.presetKey] ? normalized.presetKey : currentPresetKey;
      currentPresetKey = currentCropState.presetKey;
      photoPresetKeys.set(currentPhotoIndex, currentPresetKey);
      photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
      scheduleRender();
      emitChange('setCropState');
      return { success: true, data: cloneCropState(currentCropState) };
    }

    function setPhotoIndex(photoIndex) {
      if (!Number.isInteger(photoIndex) || photoIndex < 0 || photoIndex >= photoCount) {
        return { success: false, error: 'Photo index out of range' };
      }

      photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
      photoPresetKeys.set(currentPhotoIndex, currentPresetKey);
      currentPhotoIndex = photoIndex;
      currentPresetKey = photoPresetKeys.get(currentPhotoIndex) || initialPresetKey;
      const savedState = photoCropStates.get(currentPhotoIndex);
      currentCropState = savedState
        ? clampCropToBounds(savedState, imageBounds, getPresetRatio(currentPresetKey))
        : createDefaultCropState(imageBounds, currentPresetKey, currentPhotoIndex);
      currentCropState.presetKey = currentPresetKey;
      scheduleRender();
      emitPhotoChange('photo-change');
      return loadCurrentPhoto().then(() => ({ success: true, data: getCropState() }));
    }

    function setAspectPreset(presetKey) {
      if (!PRESETS[presetKey]) {
        return { success: false, error: `Unknown preset: ${presetKey}` };
      }

      currentPresetKey = presetKey;
      photoPresetKeys.set(currentPhotoIndex, currentPresetKey);
      currentCropState = clampCropToBounds(createDefaultCropState(imageBounds, presetKey, currentPhotoIndex), imageBounds, getPresetRatio(presetKey));
      currentCropState.rotation = currentCropState.rotation || 0;
      currentCropState.presetKey = currentPresetKey;
      photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
      scheduleRender();
      emitChange('preset-change');
      return { success: true, data: getCropState() };
    }

    function getCropState() {
      return {
        ...cloneCropState(currentCropState),
        presetKey: currentPresetKey
      };
    }

    function getCropStates() {
      const states = {};
      for (let index = 0; index < photoCount; index += 1) {
        const savedState = photoCropStates.get(index);
        states[index] = savedState ? cloneCropState(savedState) : {
          x: imageBounds.x,
          y: imageBounds.y,
          width: imageBounds.width,
          height: imageBounds.height,
          photoIndex: index,
          rotation: 0,
          presetKey: photoPresetKeys.get(index) || initialPresetKey
        };
      }
      return states;
    }

    function getPhotoIndex() {
      return currentPhotoIndex;
    }

    function getPhotoCount() {
      return photoCount;
    }

    function getCurrentPreset() {
      return currentPresetKey;
    }

    function getPhotoSource() {
      return getImageSource(currentPhotoIndex);
    }

    function getPhotoStatus() {
      return isLoaded() ? 'ready' : 'loading';
    }

    function isLoaded() {
      return !!image;
    }

    function hitTest(point) {
      const crop = currentCropState;
      const handles = {
        nw: { x: crop.x, y: crop.y },
        n: { x: crop.x + crop.width / 2, y: crop.y },
        ne: { x: crop.x + crop.width, y: crop.y },
        e: { x: crop.x + crop.width, y: crop.y + crop.height / 2 },
        se: { x: crop.x + crop.width, y: crop.y + crop.height },
        s: { x: crop.x + crop.width / 2, y: crop.y + crop.height },
        sw: { x: crop.x, y: crop.y + crop.height },
        w: { x: crop.x, y: crop.y + crop.height / 2 }
      };

      for (const [name, handle] of Object.entries(handles)) {
        const distance = Math.hypot(point.x - handle.x, point.y - handle.y);
        const hitRadius = name === 'n' || name === 'e' || name === 's' || name === 'w'
          ? HANDLE_HIT_SIZE + 10
          : HANDLE_HIT_SIZE;

        if (distance <= hitRadius) {
          return name;
        }
      }

      const insideMoveZone =
        point.x >= crop.x + MOVE_HIT_PADDING &&
        point.x <= crop.x + crop.width - MOVE_HIT_PADDING &&
        point.y >= crop.y + MOVE_HIT_PADDING &&
        point.y <= crop.y + crop.height - MOVE_HIT_PADDING;

      if (insideMoveZone) {
        return 'move';
      }

      return null;
    }

    function cursorForHandle(handle) {
      if (handle === 'move') {
        return 'grab';
      }
      if (handle === 'nw' || handle === 'se') {
        return 'nwse-resize';
      }
      if (handle === 'ne' || handle === 'sw') {
        return 'nesw-resize';
      }
      if (handle === 'n' || handle === 's') {
        return 'ns-resize';
      }
      if (handle === 'e' || handle === 'w') {
        return 'ew-resize';
      }
      return 'default';
    }

    function canvasPointFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * canvas.width / (window.devicePixelRatio || 1);
      const y = ((event.clientY - rect.top) / rect.height) * canvas.height / (window.devicePixelRatio || 1);
      return { x, y };
    }

    function touchPointFromEvent(event, identifier) {
      const rect = canvas.getBoundingClientRect();
      const touchList = event.touches && event.touches.length ? event.touches : event.changedTouches;
      let touch = touchList[0];

      if (isFiniteNumber(identifier)) {
        for (const candidate of touchList) {
          if (candidate.identifier === identifier) {
            touch = candidate;
            break;
          }
        }
      }

      const x = ((touch.clientX - rect.left) / rect.width) * canvas.width / (window.devicePixelRatio || 1);
      const y = ((touch.clientY - rect.top) / rect.height) * canvas.height / (window.devicePixelRatio || 1);
      return { x, y };
    }

    function clampMoveState(startState, dx, dy) {
      const maxX = imageBounds.x + imageBounds.width - startState.width;
      const maxY = imageBounds.y + imageBounds.height - startState.height;

      return {
        ...startState,
        x: clamp(startState.x + dx, imageBounds.x, maxX),
        y: clamp(startState.y + dy, imageBounds.y, maxY)
      };
    }

    function clampResizeState(startState, dx, dy, handle) {
      const ratio = getPresetRatio(currentPresetKey);
      const boundsRight = imageBounds.x + imageBounds.width;
      const boundsBottom = imageBounds.y + imageBounds.height;
      const left = startState.x;
      const top = startState.y;
      const right = startState.x + startState.width;
      const bottom = startState.y + startState.height;

      let x = startState.x;
      let y = startState.y;
      let width = startState.width;
      let height = startState.height;

      if (!ratio) {
        if (handle === 'nw') {
          x = clamp(left + dx, imageBounds.x, right - MIN_CROP_SIZE);
          y = clamp(top + dy, imageBounds.y, bottom - MIN_CROP_SIZE);
          width = right - x;
          height = bottom - y;
        } else if (handle === 'n') {
          y = clamp(top + dy, imageBounds.y, bottom - MIN_CROP_SIZE);
          height = bottom - y;
        } else if (handle === 'ne') {
          y = clamp(top + dy, imageBounds.y, bottom - MIN_CROP_SIZE);
          width = clamp(startState.width + dx, MIN_CROP_SIZE, boundsRight - left);
          height = bottom - y;
        } else if (handle === 'e') {
          width = clamp(startState.width + dx, MIN_CROP_SIZE, boundsRight - left);
        } else if (handle === 'se') {
          width = clamp(startState.width + dx, MIN_CROP_SIZE, boundsRight - left);
          height = clamp(startState.height + dy, MIN_CROP_SIZE, boundsBottom - top);
        } else if (handle === 's') {
          height = clamp(startState.height + dy, MIN_CROP_SIZE, boundsBottom - top);
        } else if (handle === 'sw') {
          x = clamp(left + dx, imageBounds.x, right - MIN_CROP_SIZE);
          width = right - x;
          height = clamp(startState.height + dy, MIN_CROP_SIZE, boundsBottom - top);
        } else if (handle === 'w') {
          x = clamp(left + dx, imageBounds.x, right - MIN_CROP_SIZE);
          width = right - x;
        }
      } else {
        if (handle === 'nw') {
          width = clamp(startState.width - dx, MIN_CROP_SIZE, right - imageBounds.x);
          height = width / ratio;
          x = right - width;
          y = bottom - height;
        } else if (handle === 'n') {
          height = clamp(startState.height - dy, MIN_CROP_SIZE, bottom - imageBounds.y);
          width = height * ratio;
          x = left + (startState.width - width) / 2;
          y = bottom - height;
        } else if (handle === 'ne') {
          width = clamp(startState.width + dx, MIN_CROP_SIZE, boundsRight - left);
          height = width / ratio;
          x = left;
          y = bottom - height;
        } else if (handle === 'e') {
          width = clamp(startState.width + dx, MIN_CROP_SIZE, boundsRight - left);
          height = width / ratio;
          x = left;
          y = top + (startState.height - height) / 2;
        } else if (handle === 'se') {
          width = clamp(startState.width + dx, MIN_CROP_SIZE, boundsRight - left);
          height = width / ratio;
          x = left;
          y = top;
        } else if (handle === 's') {
          height = clamp(startState.height + dy, MIN_CROP_SIZE, boundsBottom - top);
          width = height * ratio;
          x = left + (startState.width - width) / 2;
          y = top;
        } else if (handle === 'sw') {
          width = clamp(startState.width - dx, MIN_CROP_SIZE, right - imageBounds.x);
          height = width / ratio;
          x = right - width;
          y = top;
        } else if (handle === 'w') {
          width = clamp(startState.width - dx, MIN_CROP_SIZE, right - imageBounds.x);
          height = width / ratio;
          x = right - width;
          y = top + (startState.height - height) / 2;
        }
      }

      width = clamp(width, MIN_CROP_SIZE, imageBounds.width);
      height = clamp(height, MIN_CROP_SIZE, imageBounds.height);

      if (x < imageBounds.x) {
        x = imageBounds.x;
      }
      if (y < imageBounds.y) {
        y = imageBounds.y;
      }
      if (x + width > boundsRight) {
        x = boundsRight - width;
      }
      if (y + height > boundsBottom) {
        y = boundsBottom - height;
      }

      return {
        x,
        y,
        width,
        height,
        photoIndex: startState.photoIndex,
        rotation: startState.rotation || 0
      };
    }

    function applyPointer(point) {
      if (!activeHandle || !dragStartState || !dragStartPoint) {
        return;
      }

      const dx = point.x - dragStartPoint.x;
      const dy = point.y - dragStartPoint.y;

      if (activeHandle === 'move') {
        currentCropState = clampMoveState(dragStartState, dx, dy);
      } else {
        currentCropState = clampResizeState(dragStartState, dx, dy, activeHandle);
      }

      currentCropState.photoIndex = dragStartState.photoIndex;
      photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
      scheduleRender();
      emitChange('interaction');
    }

    function beginInteraction(handle, point, pointerId = null) {
      isDragging = true;
      activeHandle = handle;
      dragStartPoint = point;
      dragStartState = cloneCropState(currentCropState);
      dragPointerId = pointerId;
      canvas.classList.add('is-dragging');
      canvas.style.cursor = handle === 'move' ? 'grabbing' : cursorForHandle(handle);
      scheduleRender();
    }

    function endInteraction() {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      activeHandle = null;
      dragStartPoint = null;
      dragStartState = null;
      dragPointerId = null;
      canvas.classList.remove('is-dragging');
      canvas.style.cursor = 'default';
      emitChange('interaction-end');
      scheduleRender();
    }

    function handleMouseDown(event) {
      if (event.button !== 0) {
        return;
      }

      const point = canvasPointFromEvent(event);
      const handle = hitTest(point);
      if (!handle) {
        return;
      }

      event.preventDefault();
      beginInteraction(handle, point, null);
    }

    function handleMouseMove(event) {
      const point = canvasPointFromEvent(event);
      if (!isDragging) {
        canvas.style.cursor = cursorForHandle(hitTest(point));
        return;
      }

      event.preventDefault();
      applyPointer(point);
    }

    function handleMouseUp(event) {
      if (isDragging) {
        event.preventDefault();
        endInteraction();
      }
    }

    function handleTouchStart(event) {
      if (!event.touches || !event.touches.length) {
        return;
      }

      const touch = event.touches[0];
      const point = touchPointFromEvent(event, touch.identifier);
      const handle = hitTest(point);
      if (!handle) {
        return;
      }

      event.preventDefault();
      beginInteraction(handle, point, touch.identifier);
    }

    function handleTouchMove(event) {
      if (!isDragging) {
        return;
      }

      const point = touchPointFromEvent(event, dragPointerId);
      event.preventDefault();
      applyPointer(point);
    }

    function handleTouchEnd(event) {
      if (!isDragging) {
        return;
      }

      const touches = event.changedTouches || [];
      for (const touch of touches) {
        if (touch.identifier === dragPointerId) {
          event.preventDefault();
          endInteraction();
          break;
        }
      }
    }

    function handleKeyDown(event) {
      if (document.activeElement !== canvas) {
        return;
      }

      const step = event.shiftKey ? 10 : 1;
      let handled = true;
      let nextState = cloneCropState(currentCropState);

      if (event.key === 'ArrowLeft') {
        nextState.x = clamp(nextState.x - step, imageBounds.x, imageBounds.x + imageBounds.width - nextState.width);
      } else if (event.key === 'ArrowRight') {
        nextState.x = clamp(nextState.x + step, imageBounds.x, imageBounds.x + imageBounds.width - nextState.width);
      } else if (event.key === 'ArrowUp') {
        nextState.y = clamp(nextState.y - step, imageBounds.y, imageBounds.y + imageBounds.height - nextState.height);
      } else if (event.key === 'ArrowDown') {
        nextState.y = clamp(nextState.y + step, imageBounds.y, imageBounds.y + imageBounds.height - nextState.height);
      } else {
        handled = false;
      }

      if (handled) {
        event.preventDefault();
        currentCropState = nextState;
        photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
        emitChange('keyboard');
        scheduleRender();
      }
    }

    // Re-render whenever the canvas's box changes size (window resize,
    // split-screen snap, rotation, layout breakpoints). Otherwise the bitmap
    // keeps its old size and the browser stretches the photo to fit.
    let resizeObserver = null;
    function handleCanvasResize() {
      scheduleRender();
    }

    function bindEvents() {
      if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(handleCanvasResize);
        resizeObserver.observe(canvas);
      } else {
        window.addEventListener('resize', handleCanvasResize);
        window.addEventListener('orientationchange', handleCanvasResize);
      }
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
      canvas.addEventListener('keydown', handleKeyDown);
    }

    function unbindEvents() {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      } else {
        window.removeEventListener('resize', handleCanvasResize);
        window.removeEventListener('orientationchange', handleCanvasResize);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      canvas.removeEventListener('keydown', handleKeyDown);
    }

    function drawImage() {
      context.fillStyle = BG_COLOR;
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (!image) {
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.font = '600 16px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Loading photo...', canvas.width / 2, canvas.height / 2);
        return;
      }

      if (!isFiniteNumber(imageBounds.width) || !isFiniteNumber(imageBounds.height) || imageBounds.width <= 0 || imageBounds.height <= 0) {
        updateImageBoundsFromSource(image, canvas);
      }

      if (!isFiniteNumber(imageBounds.width) || !isFiniteNumber(imageBounds.height) || imageBounds.width <= 0 || imageBounds.height <= 0) {
        return;
      }

      const centerX = imageBounds.x + imageBounds.width / 2;
      const centerY = imageBounds.y + imageBounds.height / 2;
      const angle = (currentCropState.rotation || 0) * (Math.PI / 180);

      context.save();
      context.translate(centerX, centerY);
      context.rotate(angle);
      context.drawImage(image, -imageBounds.width / 2, -imageBounds.height / 2, imageBounds.width, imageBounds.height);
      context.restore();
    }

    function drawOverlay(cropState) {
      context.save();
      context.fillStyle = OVERLAY_COLOR;
      const dpr = window.devicePixelRatio || 1;
      const renderWidth = canvas.width / dpr;
      const renderHeight = canvas.height / dpr;

      context.beginPath();
      context.rect(0, 0, renderWidth, renderHeight);
      context.rect(cropState.x, cropState.y, cropState.width, cropState.height);
      context.fill('evenodd');
      context.restore();
    }

    function drawGrid(cropState) {
      context.save();
      context.strokeStyle = GRID_COLOR;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(cropState.x + cropState.width / 3, cropState.y);
      context.lineTo(cropState.x + cropState.width / 3, cropState.y + cropState.height);
      context.stroke();

      context.beginPath();
      context.moveTo(cropState.x + (cropState.width * 2) / 3, cropState.y);
      context.lineTo(cropState.x + (cropState.width * 2) / 3, cropState.y + cropState.height);
      context.stroke();

      context.beginPath();
      context.moveTo(cropState.x, cropState.y + cropState.height / 3);
      context.lineTo(cropState.x + cropState.width, cropState.y + cropState.height / 3);
      context.stroke();

      context.beginPath();
      context.moveTo(cropState.x, cropState.y + (cropState.height * 2) / 3);
      context.lineTo(cropState.x + cropState.width, cropState.y + (cropState.height * 2) / 3);
      context.stroke();
      context.restore();
    }

    function drawFrame(cropState) {
      const corners = [
        { x: cropState.x, y: cropState.y },
        { x: cropState.x + cropState.width / 2, y: cropState.y },
        { x: cropState.x + cropState.width, y: cropState.y },
        { x: cropState.x + cropState.width, y: cropState.y + cropState.height / 2 },
        { x: cropState.x + cropState.width, y: cropState.y + cropState.height },
        { x: cropState.x + cropState.width / 2, y: cropState.y + cropState.height },
        { x: cropState.x, y: cropState.y + cropState.height },
        { x: cropState.x, y: cropState.y + cropState.height / 2 }
      ];

      context.save();
      context.strokeStyle = FRAME_COLOR;
      context.lineWidth = 2;
      context.strokeRect(cropState.x, cropState.y, cropState.width, cropState.height);
      drawGrid(cropState);

      corners.forEach((handle) => {
        context.save();
        context.fillStyle = '#ffffff';
        context.strokeStyle = ACCENT_COLOR;
        context.lineWidth = 2;
        context.shadowColor = 'rgba(16,24,40,0.06)';
        context.shadowBlur = 8;
        context.beginPath();
        context.rect(handle.x - HANDLE_SIZE / 2, handle.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
        context.fill();
        context.stroke();
        context.restore();
      });

      context.restore();
    }

    function drawPhotoLabel() {
      context.save();
      context.fillStyle = 'rgba(0, 0, 0, 0.56)';
      context.fillRect(12, 12, 138, 30);
      context.fillStyle = '#ffffff';
      context.font = '600 13px Arial, sans-serif';
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(`Photo ${currentPhotoIndex + 1} / ${Math.max(photoCount, 1)}`, 22, 27);
      context.restore();
    }

    function render() {
      if (destroyed) {
        return;
      }

      if (!resizeCanvas(true)) {
        window.requestAnimationFrame(() => {
          if (!destroyed) {
            scheduleRender();
          }
        });
        return;
      }

      drawImage();

      if (!image) {
        return;
      }

      ensureCurrentPhotoState();
      drawOverlay(currentCropState);
      drawFrame(currentCropState);
      drawPhotoLabel();
    }

    function loadCurrentPhoto() {
      const src = getImageSource(currentPhotoIndex);
      if (!src) {
        return Promise.resolve(null);
      }

      emitBusy(true);
      return loadImage(currentPhotoIndex)
        .then((nextImage) => {
          if (destroyed) {
            return null;
          }

          setCanvasSourceImage(nextImage);
          // Ensure canvas sizing and image bounds are computed before creating crop state
          try {
            resizeCanvas(false);
          } catch (e) {
            // ignore sizing errors and continue
          }
          currentPresetKey = photoPresetKeys.get(currentPhotoIndex) || currentPresetKey || initialPresetKey;
          const savedState = photoCropStates.get(currentPhotoIndex);
          currentCropState = savedState
            ? clampCropToBounds(savedState, imageBounds, getPresetRatio(currentPresetKey))
            : createDefaultCropState(imageBounds, currentPresetKey, currentPhotoIndex);
          currentCropState.presetKey = currentPresetKey;
          photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
          scheduleRender();
          emitReady();
          emitPhotoChange('load');
          emitBusy(false);
          return nextImage;
        })
        .catch((error) => {
          emitBusy(false);
          throw error;
        });
    }

    function setImage(imageSource, nextCropState) {
      if (typeof imageSource === 'string') {
        imageSources[currentPhotoIndex] = imageSource;
      }

      if (nextCropState) {
        const normalized = normalizeCropState(nextCropState);
        if (normalized) {
          currentCropState = normalized;
          currentPresetKey = PRESETS[normalized.presetKey] ? normalized.presetKey : currentPresetKey;
          currentCropState.presetKey = currentPresetKey;
          photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
          photoPresetKeys.set(currentPhotoIndex, currentPresetKey);
        }
      }

      return loadCurrentPhoto();
    }

    function setRotation(rotationDegrees) {
      if (!isFiniteNumber(rotationDegrees)) {
        return { success: false, error: 'Rotation must be a finite number' };
      }

      currentCropState.rotation = rotationDegrees;
      currentCropState.presetKey = currentPresetKey;
      photoCropStates.set(currentPhotoIndex, cloneCropState(currentCropState));
      scheduleRender();
      emitChange('rotation-change');
      return { success: true, data: getCropState() };
    }

    function rotateBy(deltaDegrees) {
      if (!isFiniteNumber(deltaDegrees)) {
        return { success: false, error: 'Rotation delta must be a finite number' };
      }

      return setRotation((currentCropState.rotation || 0) + deltaDegrees);
    }

    function nextPhoto() {
      if (photoCount === 0) {
        return { success: false, error: 'No photos available' };
      }

      if (currentPhotoIndex >= photoCount - 1) {
        return { success: false, error: 'Already on the last photo' };
      }

      currentPhotoIndex += 1;
      return loadCurrentPhoto().then(() => ({ success: true, data: getCropState() }));
    }

    function prevPhoto() {
      if (photoCount === 0) {
        return { success: false, error: 'No photos available' };
      }

      if (currentPhotoIndex <= 0) {
        return { success: false, error: 'Already on the first photo' };
      }

      currentPhotoIndex -= 1;
      return loadCurrentPhoto().then(() => ({ success: true, data: getCropState() }));
    }

    function refresh() {
      scheduleRender();
    }

    function focus() {
      if (typeof canvas.focus === 'function') {
        canvas.focus();
      }
    }

    function destroy() {
      destroyed = true;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      unbindEvents();
    }

    bindEvents();
    loadCurrentPhoto().catch(() => {
      currentCropState = createDefaultCropState(imageBounds, currentPresetKey, currentPhotoIndex);
      scheduleRender();
      emitBusy(false);
    });

    async function exportCroppedImages() {
      const croppedResults = [];
      const rect = canvas.getBoundingClientRect();
      const displayWidth = rect.width || DEFAULT_CANVAS_WIDTH;
      const displayHeight = rect.height || DEFAULT_CANVAS_HEIGHT;

      for (let index = 0; index < photoCount; index++) {
        const src = imageSources[index];
        let img = imageCache.get(src);
        if (!img) {
          img = await loadImage(index);
        }

        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;

        const fittedRect = fitImageRect(naturalWidth, naturalHeight, displayWidth, displayHeight);
        const currentBounds = fittedRect.width > 0 && fittedRect.height > 0
          ? fittedRect
          : { x: 0, y: 0, width: displayWidth, height: displayHeight };

        let state = photoCropStates.get(index);
        if (!state) {
          const preset = photoPresetKeys.get(index) || initialPresetKey;
          state = createDefaultCropState(currentBounds, preset, index);
        }

        const scale = naturalWidth / currentBounds.width;
        const exportWidth = Math.round(state.width * scale);
        const exportHeight = Math.round(state.height * scale);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = exportWidth;
        tempCanvas.height = exportHeight;
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          const centerX = (currentBounds.x + currentBounds.width / 2 - state.x) * scale;
          const centerY = (currentBounds.y + currentBounds.height / 2 - state.y) * scale;
          const angle = (state.rotation || 0) * (Math.PI / 180);

          tempCtx.save();
          tempCtx.translate(centerX, centerY);
          tempCtx.rotate(angle);
          tempCtx.drawImage(img, -naturalWidth / 2, -naturalHeight / 2, naturalWidth, naturalHeight);
          tempCtx.restore();
        }

        croppedResults.push(tempCanvas.toDataURL('image/png'));
      }

      return croppedResults;
    }

    return {
      setImage,
      setCropState,
      setRotation,
      rotateBy,
      getCropState,
      getCropStates,
      setAspectPreset,
      getCurrentPreset: () => currentPresetKey,
      getPresetDefinitions,
      getPresetRatio,
      setPhotoIndex,
      getPhotoIndex,
      getPhotoCount,
      getPhotoSource,
      getPhotoStatus,
      nextPhoto,
      prevPhoto,
      refresh,
      focus,
      destroy,
      validateCropState,
      createDefaultCropState,
      clampCropToBounds,
      fitImageRect,
      exportCroppedImages
    };
  }

  function renderPreview(canvas, imageSource, cropState) {
    const controller = createController(canvas, { images: imageSource ? [imageSource] : [] });
    if (cropState) {
      return Promise.resolve(controller.setCropState(cropState));
    }
    return Promise.resolve({ success: true, data: controller.getCropState() });
  }

  function renderCropFrame(canvas, context, cropState) {
    const validation = validateCropState(cropState);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    context.save();
    context.strokeStyle = ACCENT_COLOR;
    context.lineWidth = 2;
    context.strokeRect(cropState.x, cropState.y, cropState.width, cropState.height);
    context.restore();

    return { success: true };
  }

  return {
    createController,
    renderPreview,
    renderCropFrame,
    validateCropState,
    getPresetDefinitions,
    getPresetRatio,
    createDefaultCropState,
    clampCropToBounds,
    fitImageRect,
    normalizeCropState
  };
})();
