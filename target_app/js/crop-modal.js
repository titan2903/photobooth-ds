/**
 * Crop Review Modal
 *
 * Interactive review shell that coordinates CropPreview, preserves crop state
 * per photo, and exposes confirm/cancel/reset actions.
 */

const CropModal = (() => {
  const DEFAULT_PRESET = 'original';
  const DEFAULT_INFO_TEXT = 'Drag the frame to reposition it. Use the edge or corner handles to resize. Freeform keeps the crop unlocked so it is easier to adjust.';
  const DEFAULT_CANCEL_TEXT = 'Cancel';
  const DEFAULT_CONFIRM_TEXT = 'Confirm Crop';
  const STYLESHEET_URL = (() => {
    const scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
    return new URL('../css/crop-modal.css', scriptUrl).href;
  })();

  const STYLES_TIMEOUT_MS = 4000;

  let stylesReady = false;
  let stylesApplied = false;
  let openedWithoutStyles = false;
  let stylesReadyPromise = null;
  let pendingOpenConfig = null;
  let isOpen = false;
  let containerElement = null;
  let backdropElement = null;
  let modalElement = null;
  let controller = null;
  let previewCanvasElement = null;
  let currentImages = [];
  let currentPhotoIndex = 0;
  let cropStates = new Map();
  let photoStatuses = new Map();
  let onConfirm = null;
  let onCancel = null;
  let modalTitle = 'Review & Adjust Photos';
  let infoText = DEFAULT_INFO_TEXT;
  let currentPresetKey = DEFAULT_PRESET;
  let isBusy = false;
  let isConfirming = false;
  let returnFocusElement = null;

  // Resolves once crop-modal.css has applied (or failed / timed out). The
  // preview canvas must not be measured before then: unstyled, its CSS size
  // follows its own bitmap size, so each resize grows it by devicePixelRatio
  // and the first crop box is computed against a huge, wrong canvas.
  function ensureStylesLoaded() {
    if (stylesReadyPromise) {
      return stylesReadyPromise;
    }

    let link = document.getElementById('crop-modal-styles');
    if (!link) {
      link = document.createElement('link');
      link.id = 'crop-modal-styles';
      link.rel = 'stylesheet';
      link.href = STYLESHEET_URL;
      document.head.appendChild(link);
    }

    stylesReadyPromise = new Promise((resolve) => {
      if (link.sheet) {
        stylesApplied = true;
        resolve();
        return;
      }
      const onSettled = () => {
        stylesApplied = true;
        // We stopped waiting (timeout) and opened unstyled: the crop session
        // was sized against the wrong layout, so rebuild it on the real one.
        if (isOpen && openedWithoutStyles) {
          openedWithoutStyles = false;
          cropStates = new Map();
          ensureController();
          loadPhoto(currentPhotoIndex);
        }
        resolve();
      };
      link.addEventListener('load', onSettled, { once: true });
      link.addEventListener('error', onSettled, { once: true });
      window.setTimeout(resolve, STYLES_TIMEOUT_MS);
    }).then(() => {
      stylesReady = true;
    });

    return stylesReadyPromise;
  }

  function createButton(className, id, label, ariaLabel) {
    return `<button id="${id}" class="${className}" type="button" aria-label="${ariaLabel}">${label}</button>`;
  }

  function createPresetButton(presetKey, label, active) {
    return `
      <button
        type="button"
        class="crop-preset-chip${active ? ' is-active' : ''}"
        data-crop-preset="${presetKey}"
      >
        ${label}
      </button>
    `;
  }

  function createThumbnail(index, imageSrc, status) {
    const isActive = index === currentPhotoIndex;
    const statusClass = status === 'confirmed' ? 'is-confirmed' : status === 'edited' ? 'is-edited' : 'is-empty';
    return `
      <button
        type="button"
        class="crop-thumb${isActive ? ' is-active' : ''} ${statusClass}"
        data-crop-photo-index="${index}"
        aria-label="Review photo ${index + 1}"
      >
        <span class="crop-thumb-frame">
          <img src="${imageSrc}" alt="Photo ${index + 1}" />
        </span>
        <span class="crop-thumb-label">${index + 1}</span>
      </button>
    `;
  }

  function createRotationCard() {
    return `
      <section class="crop-modal-panel crop-modal-panel--rotation">
        <div class="crop-panel-header">
          <h3>Rotation</h3>
          <span id="crop-rotation-value" class="crop-panel-badge">0°</span>
        </div>
        <div class="crop-rotation-row">
          <input
            id="crop-rotation-slider"
            class="crop-rotation-slider"
            type="range"
            min="-45"
            max="45"
            step="1"
            value="0"
            aria-label="Rotate crop"
          />
          <div class="crop-rotation-actions">
            <button id="crop-rotate-left-btn" class="crop-modal-btn crop-modal-btn-secondary crop-modal-btn-small" type="button">-15°</button>
            <button id="crop-rotate-reset-btn" class="crop-modal-btn crop-modal-btn-secondary crop-modal-btn-small" type="button">Reset</button>
            <button id="crop-rotate-right-btn" class="crop-modal-btn crop-modal-btn-secondary crop-modal-btn-small" type="button">+15°</button>
          </div>
        </div>
      </section>
    `;
  }

  function createModalDOM() {
    const container = document.createElement('div');
    container.id = 'crop-modal-container';
    container.className = 'crop-modal-backdrop';
    container.setAttribute('role', 'presentation');
    container.innerHTML = `
      <div class="crop-modal-overlay" id="crop-modal-overlay" role="presentation">
        <section class="crop-modal" id="crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-modal-header">
          <header class="crop-modal-header">
            <div class="crop-modal-heading-group">
              <p class="crop-modal-eyebrow">Crop Review</p>
              <h2 id="crop-modal-header" class="crop-modal-title">${modalTitle}</h2>
            </div>
            <button id="crop-modal-close-btn" class="crop-modal-close-btn" type="button" aria-label="Close crop modal">&times;</button>
          </header>

          <div class="crop-modal-layout">
            <aside class="crop-modal-sidebar">
              <div class="crop-modal-panel crop-modal-panel--thumbs">
                <div class="crop-panel-header">
                  <h3>Photos</h3>
                  <span id="crop-photo-count" class="crop-panel-count">0</span>
                </div>
                <div id="crop-thumb-strip" class="crop-thumb-strip" aria-label="Photo review thumbnails"></div>
              </div>

              <div class="crop-modal-panel crop-modal-panel--status">
                <div class="crop-panel-header">
                  <h3>Selection</h3>
                  <span id="crop-photo-status" class="crop-panel-badge">Idle</span>
                </div>
                <div id="crop-modal-info" class="crop-modal-info">${infoText}</div>
              </div>
            </aside>

            <main class="crop-modal-main">
              <div class="crop-modal-editor-shell">
                <div class="crop-modal-canvas-container">
                  <canvas
                    id="crop-preview-canvas"
                    class="crop-preview-canvas"
                    width="960"
                    height="720"
                    aria-label="Crop preview editor"
                  ></canvas>
                  <div id="crop-modal-loading" class="crop-modal-loading" hidden>
                    <div class="crop-modal-spinner"></div>
                    <p id="crop-modal-loading-text">Loading preview...</p>
                  </div>
                </div>

                <div class="crop-modal-toolbar">
                  <div class="crop-preset-group" id="crop-preset-group" aria-label="Crop aspect presets">
                    ${Object.entries(CropPreview.getPresetDefinitions().reduce((acc, preset) => {
                      acc[preset.key] = preset.label;
                      return acc;
                    }, {})).map(([presetKey, presetLabel]) => createPresetButton(presetKey, presetLabel, presetKey === currentPresetKey)).join('')}
                  </div>

                  <div class="crop-nav-group">
                    <button id="crop-modal-prev-btn" class="crop-modal-btn crop-modal-btn-secondary" type="button">Previous</button>
                    <button id="crop-modal-next-btn" class="crop-modal-btn crop-modal-btn-secondary" type="button">Next</button>
                  </div>
                </div>

                ${createRotationCard()}
              </div>
            </main>
          </div>

          <footer class="crop-modal-footer">
            <div class="crop-modal-footer-group">
              <button id="crop-modal-reset-btn" class="crop-modal-btn crop-modal-btn-secondary" type="button" aria-label="Reset crop to default">Reset</button>
            </div>
            <div class="crop-modal-footer-spacer"></div>
            <div class="crop-modal-footer-group crop-modal-footer-group--actions">
              <button id="crop-modal-cancel-btn" class="crop-modal-btn crop-modal-btn-secondary" type="button" aria-label="${DEFAULT_CANCEL_TEXT}">${DEFAULT_CANCEL_TEXT}</button>
              <button id="crop-modal-confirm-btn" class="crop-modal-btn crop-modal-btn-primary" type="button" aria-label="${DEFAULT_CONFIRM_TEXT}">${DEFAULT_CONFIRM_TEXT}</button>
            </div>
          </footer>
        </section>
      </div>
    `;

    return container;
  }

  function attachEventListeners() {
    const closeBtn = document.getElementById('crop-modal-close-btn');
    const resetBtn = document.getElementById('crop-modal-reset-btn');
    const cancelBtn = document.getElementById('crop-modal-cancel-btn');
    const confirmBtn = document.getElementById('crop-modal-confirm-btn');
    const prevBtn = document.getElementById('crop-modal-prev-btn');
    const nextBtn = document.getElementById('crop-modal-next-btn');
    const overlay = document.getElementById('crop-modal-overlay');
    const thumbStrip = document.getElementById('crop-thumb-strip');
    const presetGroup = document.getElementById('crop-preset-group');
    const rotationSlider = document.getElementById('crop-rotation-slider');
    const rotateLeftBtn = document.getElementById('crop-rotate-left-btn');
    const rotateRightBtn = document.getElementById('crop-rotate-right-btn');
    const rotateResetBtn = document.getElementById('crop-rotate-reset-btn');

    if (closeBtn) closeBtn.addEventListener('click', handleCancel);
    if (resetBtn) resetBtn.addEventListener('click', handleReset);
    if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
    if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);
    if (prevBtn) prevBtn.addEventListener('click', handlePrevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', handleNextPhoto);
    if (overlay) overlay.addEventListener('click', handleBackdropClick);
    if (thumbStrip) thumbStrip.addEventListener('click', handleThumbClick);
    if (presetGroup) presetGroup.addEventListener('click', handlePresetClick);
    if (rotationSlider) rotationSlider.addEventListener('input', handleRotationInput);
    if (rotateLeftBtn) rotateLeftBtn.addEventListener('click', handleRotateStepLeft);
    if (rotateRightBtn) rotateRightBtn.addEventListener('click', handleRotateStepRight);
    if (rotateResetBtn) rotateResetBtn.addEventListener('click', handleRotateReset);

    if (!document._cropModalKeydownHandler) {
      document._cropModalKeydownHandler = handleKeydown;
    }
    document.addEventListener('keydown', document._cropModalKeydownHandler);
  }

  function detachEventListeners() {
    const closeBtn = document.getElementById('crop-modal-close-btn');
    const resetBtn = document.getElementById('crop-modal-reset-btn');
    const cancelBtn = document.getElementById('crop-modal-cancel-btn');
    const confirmBtn = document.getElementById('crop-modal-confirm-btn');
    const prevBtn = document.getElementById('crop-modal-prev-btn');
    const nextBtn = document.getElementById('crop-modal-next-btn');
    const overlay = document.getElementById('crop-modal-overlay');
    const thumbStrip = document.getElementById('crop-thumb-strip');
    const presetGroup = document.getElementById('crop-preset-group');
    const rotationSlider = document.getElementById('crop-rotation-slider');
    const rotateLeftBtn = document.getElementById('crop-rotate-left-btn');
    const rotateRightBtn = document.getElementById('crop-rotate-right-btn');
    const rotateResetBtn = document.getElementById('crop-rotate-reset-btn');

    if (closeBtn) closeBtn.removeEventListener('click', handleCancel);
    if (resetBtn) resetBtn.removeEventListener('click', handleReset);
    if (cancelBtn) cancelBtn.removeEventListener('click', handleCancel);
    if (confirmBtn) confirmBtn.removeEventListener('click', handleConfirm);
    if (prevBtn) prevBtn.removeEventListener('click', handlePrevPhoto);
    if (nextBtn) nextBtn.removeEventListener('click', handleNextPhoto);
    if (overlay) overlay.removeEventListener('click', handleBackdropClick);
    if (thumbStrip) thumbStrip.removeEventListener('click', handleThumbClick);
    if (presetGroup) presetGroup.removeEventListener('click', handlePresetClick);
    if (rotationSlider) rotationSlider.removeEventListener('input', handleRotationInput);
    if (rotateLeftBtn) rotateLeftBtn.removeEventListener('click', handleRotateStepLeft);
    if (rotateRightBtn) rotateRightBtn.removeEventListener('click', handleRotateStepRight);
    if (rotateResetBtn) rotateResetBtn.removeEventListener('click', handleRotateReset);

    if (document._cropModalKeydownHandler) {
      document.removeEventListener('keydown', document._cropModalKeydownHandler);
      delete document._cropModalKeydownHandler;
    }
  }

  function buildStateFromController(cropState) {
    if (!cropState) {
      return null;
    }

    return { ...cropState };
  }

  function syncThumbnailStrip() {
    const thumbStrip = document.getElementById('crop-thumb-strip');
    const photoCount = currentImages.length;
    const photoCountLabel = document.getElementById('crop-photo-count');

    if (photoCountLabel) {
      photoCountLabel.textContent = String(photoCount);
    }

    if (!thumbStrip) {
      return;
    }

    thumbStrip.innerHTML = currentImages.map((imageSrc, index) => createThumbnail(index, imageSrc, photoStatuses.get(index) || 'idle')).join('');
  }

  function setBusyState(isLoading, label = 'Loading preview...') {
    const loading = document.getElementById('crop-modal-loading');
    const loadingText = document.getElementById('crop-modal-loading-text');
    const modal = document.getElementById('crop-modal');

    isBusy = isLoading;
    if (loading) {
      loading.hidden = !isLoading;
      loading.style.display = isLoading ? 'grid' : 'none';
    }

    if (modal) {
      modal.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    }

    if (loadingText) {
      loadingText.textContent = label;
    }
  }

  function updateStatusBadge() {
    const statusBadge = document.getElementById('crop-photo-status');
    const status = photoStatuses.get(currentPhotoIndex) || 'idle';

    if (statusBadge) {
      statusBadge.textContent = status === 'confirmed' ? 'Confirmed' : status === 'edited' ? 'Edited' : status === 'loading' ? 'Loading' : 'Ready';
      statusBadge.dataset.status = status;
    }

    const info = document.getElementById('crop-modal-info');
    if (info) {
      info.textContent = currentImages.length > 1
        ? `${infoText} Use Previous and Next to review all photos.`
        : infoText;
    }
  }

  function updatePresetButtons() {
    const buttons = document.querySelectorAll('[data-crop-preset]');
    buttons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.cropPreset === currentPresetKey);
    });
  }

  function updateNavigationButtons() {
    const prevBtn = document.getElementById('crop-modal-prev-btn');
    const nextBtn = document.getElementById('crop-modal-next-btn');

    if (prevBtn) {
      prevBtn.disabled = currentPhotoIndex <= 0;
    }

    if (nextBtn) {
      nextBtn.disabled = currentPhotoIndex >= currentImages.length - 1;
    }
  }

  function updateRotationControls() {
    const rotationSlider = document.getElementById('crop-rotation-slider');
    const rotationValue = document.getElementById('crop-rotation-value');
    const cropState = controller ? controller.getCropState() : null;
    const rotation = cropState && typeof cropState.rotation === 'number' ? cropState.rotation : 0;

    if (rotationSlider) {
      rotationSlider.value = String(Math.max(-45, Math.min(45, Math.round(rotation))));
    }

    if (rotationValue) {
      rotationValue.textContent = `${Math.round(rotation)}°`;
    }
  }

  function renderModalChrome() {
    syncThumbnailStrip();
    updateStatusBadge();
    updatePresetButtons();
    updateNavigationButtons();
    updateRotationControls();

    const thumbnailButtons = document.querySelectorAll('[data-crop-photo-index]');
    thumbnailButtons.forEach((button) => {
      button.classList.toggle('is-active', Number(button.dataset.cropPhotoIndex) === currentPhotoIndex);
    });
  }

  function applyRotation(rotationDegrees) {
    if (!controller) {
      return;
    }

    const result = controller.setRotation(rotationDegrees);
    if (result && result.success) {
      cropStates.set(currentPhotoIndex, controller.getCropState());
      photoStatuses.set(currentPhotoIndex, 'edited');
      renderModalChrome();
    }
  }

  function handleRotationInput(event) {
    applyRotation(Number(event.target.value));
  }

  function handleRotateStep(deltaDegrees) {
    const currentState = controller ? controller.getCropState() : null;
    const rotation = currentState && typeof currentState.rotation === 'number' ? currentState.rotation : 0;
    applyRotation(rotation + deltaDegrees);
  }

  function handleRotateStepLeft() {
    handleRotateStep(-15);
  }

  function handleRotateStepRight() {
    handleRotateStep(15);
  }

  function handleRotateReset() {
    applyRotation(0);
  }

  function ensureController() {
    if (!previewCanvasElement) {
      previewCanvasElement = document.getElementById('crop-preview-canvas');
    }

    if (!previewCanvasElement) {
      throw new Error('Crop preview canvas is missing');
    }

    if (controller) {
      controller.destroy();
      controller = null;
    }

    controller = CropPreview.createController(previewCanvasElement, {
      images: currentImages,
      photoIndex: currentPhotoIndex,
      presetKey: currentPresetKey,
      onBusyChange: setBusyState,
      onPhotoChange: ({ photoIndex, presetKey }) => {
        currentPhotoIndex = photoIndex;
        currentPresetKey = presetKey || currentPresetKey;
        renderModalChrome();
      },
      onChange: ({ cropState, photoIndex, presetKey, reason }) => {
        cropStates.set(photoIndex, buildStateFromController(cropState));
        photoStatuses.set(photoIndex, reason === 'preset-change' || reason === 'setCropState' || reason === 'interaction' || reason === 'keyboard' ? 'edited' : 'ready');
        currentPresetKey = presetKey;
        renderModalChrome();
      },
      onReady: () => {
        setBusyState(false);
      }
    });

    return controller;
  }

  function loadPhoto(index) {
    if (!controller || index < 0 || index >= currentImages.length) {
      return;
    }

    currentPhotoIndex = index;
    photoStatuses.set(index, photoStatuses.get(index) || 'loading');
    renderModalChrome();

    const savedState = cropStates.get(index);
    const loadResult = controller.setPhotoIndex(index);
    Promise.resolve(loadResult).then(() => {
      if (savedState) {
        cropStates.set(index, buildStateFromController(controller.getCropState()));
      } else {
        cropStates.set(index, buildStateFromController(controller.getCropState()));
      }
      photoStatuses.set(index, 'ready');
      renderModalChrome();
    });
  }

  function handleThumbClick(event) {
    const button = event.target.closest('[data-crop-photo-index]');
    if (!button || !controller) {
      return;
    }

    loadPhoto(Number(button.dataset.cropPhotoIndex));
  }

  function handlePresetClick(event) {
    const button = event.target.closest('[data-crop-preset]');
    if (!button || !controller) {
      return;
    }

    const presetKey = button.dataset.cropPreset;
    const result = controller.setAspectPreset(presetKey);
    if (result && result.success) {
      currentPresetKey = presetKey;
      cropStates.set(currentPhotoIndex, controller.getCropState());
      photoStatuses.set(currentPhotoIndex, 'edited');
      renderModalChrome();
    }
  }

  function handlePrevPhoto() {
    if (currentPhotoIndex > 0) {
      loadPhoto(currentPhotoIndex - 1);
    }
  }

  function handleNextPhoto() {
    if (currentPhotoIndex < currentImages.length - 1) {
      loadPhoto(currentPhotoIndex + 1);
    }
  }

  function handleBackdropClick(event) {
    if (event.target === backdropElement) {
      handleCancel();
    }
  }

  function handleKeydown(event) {
    if (!isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
      return;
    }

    if (event.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.id === 'crop-modal-confirm-btn') {
        event.preventDefault();
        handleConfirm();
      }
    }
  }

  function markAllPhotosConfirmed() {
    currentImages.forEach((_, index) => {
      photoStatuses.set(index, 'confirmed');
      if (!cropStates.has(index) && controller && index === currentPhotoIndex) {
        cropStates.set(index, controller.getCropState());
      }
    });
  }

  function handleConfirm() {
    if (!isOpen || isConfirming) {
      return;
    }

    isConfirming = true;
    setBusyState(true, 'Saving crop selection...');

    // Take every reviewed photo's state from the controller: it rescales them
    // when the canvas is resized, so the copies kept here may be stale.
    if (controller) {
      const liveStates = controller.getCropStates();
      cropStates.forEach((_, index) => {
        if (liveStates[index]) {
          cropStates.set(index, buildStateFromController(liveStates[index]));
        }
      });
    }

    const currentState = controller ? controller.getCropState() : null;
    if (currentState) {
      cropStates.set(currentPhotoIndex, buildStateFromController(currentState));
    }

    markAllPhotosConfirmed();

    Promise.resolve(controller ? controller.exportCroppedImages() : []).then((croppedImages) => {
      const cropData = {
        imageCount: currentImages.length,
        cropStates: Array.from(cropStates.entries()).reduce((result, [index, state]) => {
          if (state) {
            result[index] = state;
          }
          return result;
        }, {}),
        currentPhotoIndex,
        currentCropState: cropStates.get(currentPhotoIndex) || currentState || null,
        presetKey: currentPresetKey,
        croppedImages: croppedImages
      };

      try {
        if (typeof onConfirm === 'function') {
          onConfirm(cropData);
        }
      } finally {
        isConfirming = false;
        setBusyState(false);
        close();
      }
    }).catch((error) => {
      console.error('Failed to export cropped images:', error);
      isConfirming = false;
      setBusyState(false);
    });
  }

  function handleCancel() {
    if (!isOpen) {
      return;
    }

    if (typeof onCancel === 'function') {
      onCancel();
    }

    close();
  }

  function handleReset() {
    if (!isOpen || !controller) {
      return;
    }

    const presetState = controller.setAspectPreset(DEFAULT_PRESET);
    if (presetState && presetState.success) {
      cropStates.set(currentPhotoIndex, controller.getCropState());
      photoStatuses.set(currentPhotoIndex, 'edited');
      renderModalChrome();
    }
  }

  function open(config = {}) {
    if (isOpen) {
      return;
    }

    if (!stylesReady) {
      // First open on this page: finish opening once the stylesheet applies.
      const isAlreadyPending = pendingOpenConfig !== null;
      pendingOpenConfig = config;
      if (!isAlreadyPending) {
        ensureStylesLoaded().then(() => {
          const nextConfig = pendingOpenConfig;
          pendingOpenConfig = null;
          if (nextConfig) {
            open(nextConfig);
          }
        });
      }
      return;
    }

    openedWithoutStyles = !stylesApplied;
    currentImages = Array.isArray(config.images) ? config.images.slice() : [];
    currentPhotoIndex = 0;
    cropStates = new Map();
    photoStatuses = new Map();
    onConfirm = typeof config.onConfirm === 'function' ? config.onConfirm : null;
    onCancel = typeof config.onCancel === 'function' ? config.onCancel : null;
    modalTitle = config.title || 'Review & Adjust Photos';
    infoText = config.infoText || DEFAULT_INFO_TEXT;
    currentPresetKey = config.presetKey && CropPreview.getPresetDefinitions().some((preset) => preset.key === config.presetKey)
      ? config.presetKey
      : DEFAULT_PRESET;
    returnFocusElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (!containerElement) {
      containerElement = createModalDOM();
      document.body.appendChild(containerElement);
      modalElement = document.getElementById('crop-modal');
      backdropElement = document.getElementById('crop-modal-overlay');
      previewCanvasElement = document.getElementById('crop-preview-canvas');
    }

    attachEventListeners();
    containerElement.classList.add('crop-modal-open');
    containerElement.style.display = 'flex';
    modalElement?.setAttribute('aria-busy', 'true');

    currentImages.forEach((_, index) => {
      photoStatuses.set(index, 'loading');
    });

    ensureController();
    renderModalChrome();
    isOpen = true;

    window.requestAnimationFrame(() => {
      if (controller && isOpen) {
        controller.refresh();
      }
    });

    async function waitForControllerReady(retries = 10, delay = 60) {
      for (let i = 0; i < retries; i++) {
        try {
          const status = typeof controller.getPhotoStatus === 'function' ? controller.getPhotoStatus() : 'ready';
          const crop = typeof controller.getCropState === 'function' ? controller.getCropState() : null;
          if (status === 'ready' && crop && crop.width > 0 && crop.height > 0) {
            return true;
          }
        } catch (e) {
          // ignore and retry
        }
        // small pause to allow image load / layout
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, delay));
      }
      return false;
    }

    if (controller && currentImages.length) {
      Promise.resolve(controller.setPhotoIndex(0)).then(async () => {
        // Ensure the controller has computed image bounds / loaded the photo
        await waitForControllerReady(12, 60);

        const savedState = cropStates.get(0);
        if (savedState) {
          try {
            controller.setCropState(savedState);
          } catch (e) {
            // fallback: capture whatever state controller currently has
            cropStates.set(0, controller.getCropState());
          }
        } else {
          cropStates.set(0, controller.getCropState());
        }
        photoStatuses.set(0, 'ready');
        renderModalChrome();
        try { controller.refresh(); } catch (e) { /* ignore */ }
      }).catch(() => {
        // ignore failures here; modal will show a loading state or fallback
      });
    }

    window.setTimeout(() => {
      const confirmBtn = document.getElementById('crop-modal-confirm-btn');
      if (confirmBtn) {
        confirmBtn.focus();
      } else if (previewCanvasElement) {
        previewCanvasElement.focus();
      }
    }, 50);

    if (currentImages.length === 0) {
      setBusyState(false, 'No photos available');
    }
  }

  function close() {
    pendingOpenConfig = null;
    if (!isOpen) {
      return;
    }

    isOpen = false;
    isConfirming = false;
    setBusyState(false);

    detachEventListeners();

    if (controller) {
      controller.destroy();
      controller = null;
    }

    if (containerElement) {
      containerElement.classList.remove('crop-modal-open');
      containerElement.style.display = 'none';
    }

    if (returnFocusElement && typeof returnFocusElement.focus === 'function') {
      window.setTimeout(() => returnFocusElement.focus(), 0);
    }
  }

  function destroy() {
    pendingOpenConfig = null;
    detachEventListeners();

    if (controller) {
      controller.destroy();
      controller = null;
    }

    if (containerElement) {
      containerElement.remove();
      containerElement = null;
      backdropElement = null;
      modalElement = null;
      previewCanvasElement = null;
    }

    currentImages = [];
    cropStates = new Map();
    photoStatuses = new Map();
    isOpen = false;
    isConfirming = false;
    onConfirm = null;
    onCancel = null;
  }

  function setCropState(newCropState) {
    if (!controller) {
      return { success: false, error: 'Crop modal is not open' };
    }

    const result = controller.setCropState(newCropState);
    if (result && result.success) {
      cropStates.set(currentPhotoIndex, controller.getCropState());
      photoStatuses.set(currentPhotoIndex, 'edited');
      renderModalChrome();
    }

    return result;
  }

  function getCropState(photoIndex = currentPhotoIndex) {
    if (cropStates.has(photoIndex)) {
      return { ...cropStates.get(photoIndex) };
    }

    if (controller && photoIndex === currentPhotoIndex) {
      return controller.getCropState();
    }

    return null;
  }

  function getCropStates() {
    const result = {};
    cropStates.forEach((state, index) => {
      if (state) {
        result[index] = { ...state };
      }
    });
    return result;
  }

  function loadMockImages(mockImages) {
    currentImages = Array.isArray(mockImages) ? mockImages.slice() : [];
    photoStatuses = new Map();
    currentImages.forEach((_, index) => {
      photoStatuses.set(index, 'ready');
    });
    if (isOpen) {
      renderModalChrome();
    }
  }

  // Start fetching the stylesheet now so the first open rarely has to wait.
  ensureStylesLoaded();

  return {
    open,
    close,
    destroy,
    setCropState,
    getCropState,
    getCropStates,
    loadMockImages,
    _isOpen: () => isOpen,
    _getState: () => ({
      photoIndex: currentPhotoIndex,
      presetKey: currentPresetKey,
      imageCount: currentImages.length,
      cropStates: getCropStates()
    }),
    _hasBeenEdited: () => cropStates.size > 0
  };
})();
