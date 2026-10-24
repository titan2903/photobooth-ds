document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const blackScreen = document.getElementById('blackScreen');
    const countdownText = document.getElementById('countdownText');
    const progressCounter = document.getElementById('progressCounter');
    const startBtn = document.getElementById('startBtn');
    const invertBtn = document.getElementById('mirrorControlBtn') || document.getElementById('invertBtn');
    // const downloadBtn = document.getElementById('downloadBtn');
    const doneBtn = document.getElementById('doneBtn');
    const flash = document.getElementById('flash');
    const flashToggleBtn = document.getElementById('flashToggleBtn');
    const photoContainer = document.getElementById('photoContainer');

    const bnwFilter = document.getElementById('bnwFilterId');
    const sepiaFilter = document.getElementById('sepiaFilterId');
    const smoothFilter = document.getElementById('smoothFilterId');
    const grayFilter = document.getElementById('grayFilterId');
    const vintageFilter = document.getElementById('vintageFilterId');
    const normalFilter = document.getElementById('normalFilterId');
    const oldfilmFilter = document.getElementById('oldfilmFilterId');
    const vhsFilter = document.getElementById('vhsFilterId');

    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const videoContainer = document.getElementById("videoContainer");
    const filterVignetteEl = document.getElementById('filterVignette');
    const filterOverlay1El = document.getElementById('filterOverlay1');
    const filterOverlay2El = document.getElementById('filterOverlay2');
    const filterGrainEl = document.getElementById('filterGrain');
    const filterScratchesEl = document.getElementById('filterScratches');
    const filterScanlinesEl = document.getElementById('filterScanlines');

    const fullscreenMessage = document.getElementById("fullscreenMessage");
    const filterMessage = document.getElementById("filterMessage");

    const fullscreenImg = fullscreenBtn.querySelector("img");

    const uploadInput = document.getElementById('uploadInput');
    const uploadBtn = document.getElementById('uploadBtn');

    const cameraOptions = document.getElementById('cameraOptions');
    let currentDeviceId = null;

    if (cameraOptions) {
        cameraOptions.addEventListener('change', (e) => {
            currentDeviceId = e.target.value;
            startCamera();
        });
    }
    
    // New UI elements for improved UX
    const uploadModal = document.getElementById('uploadModal');
    const uploadProgress = document.getElementById('uploadProgress');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const cameraPermissionUI = document.getElementById('cameraPermissionUI');
    const cameraStatus = document.getElementById('cameraStatus');
    const retryCamera = document.getElementById('retryCamera');

    // ============================================
    // POPUP IMPORTS
    // ============================================
    const menuBtn = document.getElementById("menuBtn")
    const closeBtn = document.getElementById("closeBtn")
    const filterPopup = document.getElementById("filterPopup")
    const modalOverlay = document.getElementById("modalOverlay")
    const filterOptions = document.querySelectorAll(".filter-option")
    const toolbarFilters = document.querySelectorAll(".filter-btn")
    
    // Upload cancellation state
    let isUploadInProgress = false;
    let uploadAbort = false;
    let cropReviewGateInFlight = false;
    let cropReviewDependenciesPromise = null;

    function loadScriptOnce(scriptId, scriptSrc) {
        return new Promise((resolve, reject) => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = scriptId;
            script.src = scriptSrc;
            script.async = false;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${scriptSrc}`));
            document.head.appendChild(script);
        });
    }

    function ensureCropReviewDependencies() {
        if (typeof CropModal !== 'undefined' && typeof CropPreview !== 'undefined') {
            return Promise.resolve();
        }

        if (!cropReviewDependenciesPromise) {
            cropReviewDependenciesPromise = Promise.all([
                loadScriptOnce('crop-modal-script', 'js/crop-modal.js'),
                loadScriptOnce('crop-preview-script', 'js/crop-preview.js')
            ]).then(() => {
                if (typeof CropModal === 'undefined' || typeof CropPreview === 'undefined') {
                    throw new Error('Crop review modules failed to initialize');
                }
            });
        }

        return cropReviewDependenciesPromise;
    }

    function renderCropReviewPreview() {
        if (typeof CropModal === 'undefined' || typeof CropPreview === 'undefined') {
            return Promise.resolve({ success: false, error: 'Crop review modules are not available' });
        }

        const previewCanvas = document.getElementById('crop-preview-canvas');
        if (!previewCanvas) {
            return Promise.resolve({ success: false, error: 'Crop preview canvas not found' });
        }

        if (!Array.isArray(images) || images.length === 0) {
            return Promise.resolve({ success: false, error: 'No images available for crop review' });
        }

        const cropState = typeof CropModal.getCropState === 'function'
            ? CropModal.getCropState()
            : {
                cropX: 0,
                cropY: 0,
                cropWidth: 600,
                cropHeight: 600
            };

        return CropPreview.renderPreview(previewCanvas, images[0], cropState);
    }

    function openCropReviewGate() {
        return ensureCropReviewDependencies().then(() => {
            return new Promise((resolve) => {
                if (typeof CropModal === 'undefined') {
                    resolve({ status: 'confirmed', reason: 'crop-modal-unavailable' });
                    return;
                }

                CropModal.open({
                    imageCount: Array.isArray(originalImages) ? originalImages.length : 0,
                    images: Array.isArray(originalImages) ? originalImages : [],
                    onConfirm: (cropData) => {
                        if (typeof CropModal.close === 'function') {
                            CropModal.close();
                        }

                        if (cropData && Array.isArray(cropData.croppedImages) && cropData.croppedImages.length > 0) {
                            images = cropData.croppedImages;
                        }

                        resolve({
                            status: 'confirmed',
                            cropData
                        });
                    },
                    onCancel: () => {
                        resolve({ status: 'cancelled' });
                    }
                });
            });
        }).catch((error) => {
            console.warn('Crop review gate unavailable, continuing original save flow:', error.message);
            return { status: 'confirmed', reason: 'dependency-load-failed' };
        });
    }

    async function handleDoneWithCropReview() {
        if (cropReviewGateInFlight) {
            return;
        }

        cropReviewGateInFlight = true;

        try {
            const reviewResult = await openCropReviewGate();
            if (reviewResult && reviewResult.status === 'cancelled') {
                return;
            }

            storeImageArray();
        } finally {
            cropReviewGateInFlight = false;
        }
    }

    document.getElementById("timerOptions").addEventListener("change", updateCountdown);


    window.addEventListener("beforeunload", () => {
        let stream = document.querySelector("video")?.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
    });

    function toggleFullscreen() {
        if (!document.fullscreenElement && 
            !document.mozFullScreenElement && 
            !document.webkitFullscreenElement && 
            !document.msFullscreenElement) {
            
            // Enter fullscreen
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) { // Firefox
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) { // IE/Edge
                videoContainer.msRequestFullscreen();
            }
            
            fullscreenMessage.style.opacity = "1";
            fullscreenImg.src = "assets/fullScreen2.png";
            
            setTimeout(() => {
                fullscreenMessage.style.opacity = "0"; // Fade out
            }, 1000);

        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            
            fullscreenMessage.style.opacity = "0";
            fullscreenImg.src = "assets/fullScreen3.png";
        }
    }
    
    // Attach event listener to the button
    fullscreenBtn.addEventListener("click", toggleFullscreen);

    function clearIndexedDB() {
        const tx = db.transaction(["images"], "readwrite");
        const store = tx.objectStore("images");
        store.clear();
    }

    let db;
    const request = indexedDB.open("PhotoboothDB", 1);

    request.onupgradeneeded = function (e) {
        db = e.target.result;
        if (!db.objectStoreNames.contains("images")) {
            db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function (e) {
        db = e.target.result;
        // clearIndexedDB();  // 🔹 RESET on page load
        loadStoredImages(); // Load images at startup
    };

    request.onerror = function (e) {
        console.error("IndexedDB error:", e.target.errorCode);
    };

    
    // Photobooth Filter → CamanJS Preset
    const FILTER_RECIPES = {
        grayscale: {
            baseFilter: 'grayscale(1) contrast(1.3) brightness(1.05)',
            overlays: [],
            grain: 0.06,
        },
        gray: {
            baseFilter: 'grayscale(1) contrast(1.05) brightness(1.15)',
            overlays: [],
            grain: 0.03,
        },
        sepia: {
            baseFilter: 'sepia(0.55) contrast(1.05) brightness(1.05)',
            overlays: [{ color: 'rgba(112,66,20,0.15)', blend: 'overlay' }],
            grain: 0.04,
        },
        smooth: {
            baseFilter: 'brightness(1.3) contrast(0.9) saturate(1.05) blur(0.5px)',
            overlays: [{
                gradient: { type: 'radial', cx: 0.5, cy: 0.4, r0: 0, r1: 0.9, stops: [[0, 'rgba(255,255,255,0.45)'], [1, 'rgba(255,255,255,0.05)']] },
                blend: 'soft-light',
            }],
            grain: 0,
        },
        vintage: {
            baseFilter: 'sepia(0.3) contrast(0.92) brightness(1.08) saturate(0.85)',
            overlays: [{
                gradient: { type: 'linear', x2: 0, y2: 1, stops: [[0, 'rgba(255,196,120,0.22)'], [1, 'rgba(255,196,120,0.05)']] },
                blend: 'soft-light',
            }],
            vignette: 0.35,
            grain: 0.05,
        },
        ogvintage: {
            baseFilter: 'sepia(0.45) contrast(0.95) brightness(1.05) saturate(0.9) hue-rotate(-5deg)',
            overlays: [{ color: 'rgba(140,70,30,0.14)', blend: 'multiply' }],
            vignette: 0.45,
            grain: 0.06,
        },
        bittersweet: {
            baseFilter: 'contrast(1.05) brightness(1.02) saturate(0.75)',
            overlays: [
                { color: 'rgba(20,60,70,0.16)', blend: 'multiply' },
                { color: 'rgba(255,200,150,0.12)', blend: 'screen' },
            ],
            grain: 0.05,
        },
        fresh: {
            baseFilter: 'contrast(1.1) brightness(1.35) saturate(1.15)',
            overlays: [{ color: 'rgba(180,230,220,0.12)', blend: 'screen' }],
            grain: 0.02,
        },
        citrus: {
            baseFilter: 'saturate(1.5) contrast(1.15) brightness(1.05) sepia(0.15)',
            overlays: [{
                gradient: { type: 'radial', cx: 0.5, cy: 0.5, r0: 0, r1: 0.9, stops: [[0, 'rgba(255,170,40,0.28)'], [1, 'rgba(255,170,40,0)']] },
                blend: 'overlay',
            }],
            grain: 0.03,
        },
        'twenty-fifteen': {
            baseFilter: 'contrast(1.3) brightness(1.0) saturate(1.1)',
            overlays: [
                { color: 'rgba(10,40,60,0.18)', blend: 'multiply' },
                { color: 'rgba(255,120,150,0.12)', blend: 'screen' },
            ],
            vignette: 0.25,
            grain: 0.04,
        },
        focus: {
            baseFilter: 'contrast(1.2) brightness(1.25) saturate(0.85)',
            overlays: [{ color: 'rgba(140,160,190,0.08)', blend: 'soft-light' }],
            grain: 0.02,
        },
        candy: {
            baseFilter: 'saturate(1.3) brightness(1.08) contrast(0.95)',
            overlays: [{
                gradient: { type: 'radial', cx: 0.5, cy: 0.5, r0: 0, r1: 0.9, stops: [[0, 'rgba(255,105,180,0.25)'], [1, 'rgba(255,105,180,0)']] },
                blend: 'screen',
            }],
            grain: 0.02,
        },
        eighties: {
            baseFilter: 'contrast(1.1) brightness(1.0) saturate(1.2)',
            overlays: [
                { color: 'rgba(60,20,80,0.18)', blend: 'multiply' },
                { color: 'rgba(255,140,60,0.15)', blend: 'screen' },
            ],
            vignette: 0.3,
            grain: 0.07,
        },
        nostalgia: {
            baseFilter: 'sepia(0.25) contrast(0.9) brightness(1.0) saturate(0.75)',
            overlays: [{ color: 'rgba(120,90,60,0.15)', blend: 'soft-light' }],
            vignette: 0.3,
            grain: 0.06,
        },
        // Old-school photobooth strip: heavily desaturated warm tone,
        // strong vignette and grain, plus `scratches` - moving vertical
        // streaks live (see .filter-scratches in canvas4.html), and a
        // randomly-generated static set of scratches baked into the
        // actual captured photo (see drawFilmScratches below).
        oldfilm: {
            baseFilter: 'sepia(0.35) contrast(1.15) brightness(0.95) saturate(0.35)',
            overlays: [{ color: 'rgba(80,60,40,0.12)', blend: 'multiply' }],
            vignette: 0.42,
            grain: 0.08,
            scratches: true,
        },
        // Analog tape look: punchy oversaturated colour, a magenta/cyan
        // colour-bleed cast, rolling horizontal scanlines, heavier static,
        // and real per-channel chromatic aberration - applyChromaticAberration
        // below shifts the red/blue channels on the actual captured photo.
        // The live preview does NOT replicate this channel shift (it used
        // to, via the #vhsChromaticAberration SVG filter applied through
        // #video's CSS filter, but WebKit doesn't reliably support an SVG
        // url() filter combined with CSS filter functions on a non-SVG
        // element - see the comment in applyFilterPreview). The SVG
        // <filter> definition has been removed from the HTML.
        vhs: {
            baseFilter: 'contrast(1.25) saturate(1.5) brightness(1.05) hue-rotate(-3deg)',
            overlays: [
                { color: 'rgba(255,0,150,0.06)', blend: 'screen' },
                { color: 'rgba(0,200,255,0.05)', blend: 'screen' },
            ],
            vignette: 0.25,
            grain: 0.1,
            scanlines: true,
            chromaticAberration: true,
        },
    };

    function gradientToCss(gradient) {
        const stops = gradient.stops.map(([pos, color]) => `${color} ${pos * 100}%`).join(', ');
        if (gradient.type === 'radial') {
            return `radial-gradient(circle at ${gradient.cx * 100}% ${gradient.cy * 100}%, ${stops})`;
        }
        return `linear-gradient(to ${gradient.y2 ? 'bottom' : 'right'}, ${stops})`;
    }

    function gradientToCanvas(ctx, gradient, width, height) {
        let g;
        if (gradient.type === 'radial') {
            const cx = width * gradient.cx, cy = height * gradient.cy;
            g = ctx.createRadialGradient(cx, cy, width * gradient.r0, cx, cy, width * gradient.r1);
        } else {
            g = ctx.createLinearGradient(0, 0, (gradient.x2 || 0) * width, (gradient.y2 || 0) * height);
        }
        gradient.stops.forEach(([pos, color]) => g.addColorStop(pos, color));
        return g;
    }

    // A small static noise texture, generated once and reused as both the
    // live preview's CSS background-image (tiled) and the capture's
    // canvas fill pattern - same grain, same source, everywhere.
    let noiseTileCanvas = null;
    let noiseTileUrl = null;
    function getNoiseTile() {
        if (noiseTileCanvas) return noiseTileCanvas;
        const size = 128;
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        const id = ctx.createImageData(size, size);
        for (let i = 0; i < id.data.length; i += 4) {
            const v = Math.random() * 255;
            id.data[i] = v; id.data[i + 1] = v; id.data[i + 2] = v; id.data[i + 3] = 255;
        }
        ctx.putImageData(id, 0, 0);
        noiseTileCanvas = c;
        noiseTileUrl = c.toDataURL('image/png');
        return c;
    }

    // Styles the live video + its overlay layers to match a recipe -
    // this is an approximation (CSS can't run the exact canvas
    // compositing), but uses the same colours/blend modes so it reads as
    // the same filter.
    function applyFilterPreview(filterKey) {
        const recipe = FILTER_RECIPES[filterKey];
        // Live preview intentionally uses ONLY the plain CSS filter() tone
        // curve - no SVG url() filter, no mix-blend-mode. Both were tried
        // for a closer live approximation of the graded look, but WebKit
        // (desktop and iOS Safari, plus every iOS browser - all WebKit
        // under Apple's rules) does not reliably support either technique:
        // filter: url(#id) mixed with CSS filter functions on a non-SVG
        // element is a long-standing WebKit gap (sometimes the whole
        // filter value gets dropped, not just the unsupported part), and
        // mix-blend-mode on elements layered over a live <video> doesn't
        // composite correctly either - <video> renders in its own
        // hardware-decoded layer that WebKit's blend compositing doesn't
        // participate in. Both broke the live preview on iPhone while
        // working fine on Chrome/Firefox, which is why they're gone here.
        // This only affects the live approximation; the actual captured
        // photo still gets the full treatment (color overlays, vignette,
        // grain, scratches/scanlines, real per-channel chromatic
        // aberration) via Canvas2D compositing in renderFilteredCanvas,
        // which doesn't share either limitation and renders identically
        // on every browser/device.
        video.style.filter = recipe ? recipe.baseFilter : 'none';

        const [ov1, ov2] = (recipe && recipe.overlays) || [];
        [[filterOverlay1El, ov1], [filterOverlay2El, ov2]].forEach(([el, ov]) => {
            if (!el) return;
            if (!ov) {
                el.style.opacity = 0;
                el.style.background = 'none';
                return;
            }
            el.style.background = ov.gradient ? gradientToCss(ov.gradient) : ov.color;
            el.style.opacity = 1;
        });

        if (filterVignetteEl) {
            if (recipe && recipe.vignette) {
                filterVignetteEl.style.background = `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,${recipe.vignette}) 100%)`;
                filterVignetteEl.style.opacity = 1;
            } else {
                filterVignetteEl.style.opacity = 0;
            }
        }

        if (filterGrainEl) {
            if (recipe && recipe.grain) {
                getNoiseTile();
                filterGrainEl.style.background = `url(${noiseTileUrl})`;
                filterGrainEl.style.backgroundSize = '128px 128px';
                filterGrainEl.style.opacity = recipe.grain;
            } else {
                filterGrainEl.style.opacity = 0;
            }
        }

        if (filterScratchesEl) {
            filterScratchesEl.style.opacity = recipe && recipe.scratches ? 0.9 : 0;
        }

        if (filterScanlinesEl) {
            filterScanlinesEl.style.opacity = recipe && recipe.scanlines ? 1 : 0;
        }
    }

    // Bakes a one-off set of random film scratches into the captured
    // photo - a still photo can't literally move the way the live
    // preview's animated overlay does, so instead each capture gets its
    // own random scratch pattern, same as a real damaged film strip would
    // never scratch identically twice.
    function drawFilmScratches(ctx, width, height) {
        ctx.save();

        ctx.globalCompositeOperation = 'screen';
        const lightCount = 6 + Math.floor(Math.random() * 5);
        for (let i = 0; i < lightCount; i++) {
            const x = Math.random() * width;
            const segHeight = height * (0.25 + Math.random() * 0.75);
            const y = Math.random() * (height - segHeight);
            ctx.strokeStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.35})`;
            ctx.lineWidth = 0.75 + Math.random() * 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + (Math.random() - 0.5) * 4, y + segHeight);
            ctx.stroke();
        }

        ctx.globalCompositeOperation = 'multiply';
        const darkCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < darkCount; i++) {
            const x = Math.random() * width;
            const segHeight = height * (0.2 + Math.random() * 0.5);
            const y = Math.random() * (height - segHeight);
            ctx.strokeStyle = `rgba(20,15,10,${0.2 + Math.random() * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + segHeight);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Real per-channel chromatic aberration for the captured photo: shifts
    // the red channel one way and the blue channel the other, sampling
    // directly from pixel data (cheap enough for a one-off still frame;
    // this is what the live preview's SVG-filtered video clones
    // approximate in real time without per-frame JS work).
    function applyChromaticAberration(ctx, width, height) {
        const offset = Math.min(8, Math.max(2, Math.round(width * 0.006)));
        const src = ctx.getImageData(0, 0, width, height);
        const out = ctx.createImageData(width, height);
        const s = src.data, d = out.data;
        for (let y = 0; y < height; y++) {
            const row = y * width;
            for (let x = 0; x < width; x++) {
                const i = (row + x) * 4;
                const rx = Math.min(width - 1, x + offset);
                const bx = Math.max(0, x - offset);
                const ri = (row + rx) * 4;
                const bi = (row + bx) * 4;
                d[i] = s[ri];
                d[i + 1] = s[i + 1];
                d[i + 2] = s[bi + 2];
                d[i + 3] = s[i + 3];
            }
        }
        ctx.putImageData(out, 0, 0);
    }

    // Horizontal scanlines, same 1px-on/3px-period rhythm as the live
    // preview's .filter-scanlines CSS pattern.
    function drawScanlines(ctx, width, height) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        for (let y = 0; y < height; y += 3) {
            ctx.fillRect(0, y, width, 1);
        }
        ctx.restore();
    }

    // ---------------------------------------------------------------
    // ctx.filter replacement
    //
    // CanvasRenderingContext2D.filter is an experimental feature that
    // ships OFF BY DEFAULT in every shipping Safari, desktop and iOS
    // alike (WebKit bug 246697: "it will be available on all platforms
    // and it should be off by default for now" - confirmed still the
    // case as of Safari 26.6/TP 27 per MDN's and caniuse's compat
    // tables). With the flag off, `ctx.filter = '...'` silently no-ops -
    // it was never actually baking the tone curve into captured photos
    // on Safari at all, on any platform, not just iOS specifically.
    // These functions reimplement the handful of CSS filter functions
    // FILTER_RECIPES actually uses (sepia/grayscale/saturate/contrast/
    // brightness/hue-rotate) as direct pixel math instead, using the
    // same formulas the CSS Filter Effects spec defines them with, via
    // getImageData/putImageData - universally-supported, unflagged
    // Canvas2D APIs with no engine-specific gaps. blur() (only used by
    // 'smooth', a barely-visible 0.5px softening) is intentionally not
    // reproduced - not worth a convolution pass for an effect this
    // subtle.
    //
    // This pixel-math path is used for every non-Safari browser. Safari
    // itself (desktop and iOS, plus every other iOS browser - Chrome,
    // Firefox, etc on iOS all run on WebKit under Apple's rules, so they
    // share the exact same ctx.filter gap) instead uses the CamanJS
    // branch further below (applyToneCurveCaman / renderFilteredCanvas):
    // real-device testing showed the hand-rolled pixel math still didn't
    // look right on iOS, so Safari now gets the same CamanJS-based
    // rendering already proven correct elsewhere in this codebase (the
    // oldfilm/vhs capture filters and the older seia-event/
    // sehun-day-event pages), rather than more tuning of custom math.
    function parseFilterFunctions(filterStr) {
        const funcs = [];
        const re = /([a-z-]+)\(([-\d.]+)(?:deg|px)?\)/g;
        let m;
        while ((m = re.exec(filterStr))) {
            if (m[1] === 'blur') continue;
            funcs.push({ name: m[1], value: parseFloat(m[2]) });
        }
        return funcs;
    }

    function clamp255(v) {
        return v < 0 ? 0 : v > 255 ? 255 : v;
    }

    // Small-angle approximation via RGB<->HSL hue rotation - the recipes
    // here only ever use -3deg/-5deg, where this and the CSS spec's exact
    // linear-matrix hue-rotate are visually indistinguishable.
    function rotateHue(r, g, b, deg) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        h = ((h + deg / 360) % 1 + 1) % 1;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [r * 255, g * 255, b * 255];
    }

    // Applies every function parsed out of a CSS filter() string, in
    // order, to each pixel - same tone curve as the live preview's CSS
    // filter, computed by hand instead of relying on ctx.filter. Used for
    // every non-Safari browser; see applyToneCurveCaman for Safari.
    function applyToneCurve(imageData, filterStr) {
        const funcs = parseFilterFunctions(filterStr);
        if (!funcs.length) return imageData;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];
            for (let f = 0; f < funcs.length; f++) {
                const name = funcs[f].name;
                const value = funcs[f].value;
                if (name === 'grayscale') {
                    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    r += (gray - r) * value;
                    g += (gray - g) * value;
                    b += (gray - b) * value;
                } else if (name === 'sepia') {
                    const sr = 0.393 * r + 0.769 * g + 0.189 * b;
                    const sg = 0.349 * r + 0.686 * g + 0.168 * b;
                    const sb = 0.272 * r + 0.534 * g + 0.131 * b;
                    r += (sr - r) * value;
                    g += (sg - g) * value;
                    b += (sb - b) * value;
                } else if (name === 'saturate') {
                    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    r = gray + (r - gray) * value;
                    g = gray + (g - gray) * value;
                    b = gray + (b - gray) * value;
                } else if (name === 'contrast') {
                    r = (r - 128) * value + 128;
                    g = (g - 128) * value + 128;
                    b = (b - 128) * value + 128;
                } else if (name === 'brightness') {
                    r *= value;
                    g *= value;
                    b *= value;
                } else if (name === 'hue-rotate') {
                    const rotated = rotateHue(r, g, b, value);
                    r = rotated[0]; g = rotated[1]; b = rotated[2];
                }
            }
            data[i] = clamp255(r);
            data[i + 1] = clamp255(g);
            data[i + 2] = clamp255(b);
        }
        return imageData;
    }

    // Safari (desktop and iOS, plus every other iOS browser - they're all
    // WebKit under Apple's rules) - detected by platform for iOS since an
    // in-app/third-party browser's UA may not say "Safari" even though it
    // shares the same WebKit engine and the same ctx.filter limitation,
    // and by UA for desktop (excluding Chrome/Chromium/Edge/Firefox, which
    // all include "Safari" in their UA string for legacy reasons but are
    // not WebKit).
    function isSafariBrowser() {
        const ua = navigator.userAgent;
        const isIOSDevice = /iPad|iPhone|iPod/.test(ua) ||
            (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
        if (isIOSDevice) return true;
        return /^((?!chrome|chromium|crios|fxios|edg|android).)*safari/i.test(ua);
    }

    // Translates the same CSS filter() string FILTER_RECIPES already uses
    // into the equivalent CamanJS chain, for Safari's capture path. Uses
    // the exact scale conversion already established and proven for the
    // oldfilm/vhs filters elsewhere in this codebase: Caman's sepia/
    // contrast/brightness/saturation take a -100..100 adjustment, so a
    // CSS multiplier `v` becomes `(v - 1) * 100` (contrast/brightness/
    // saturate), a CSS 0..1 amount becomes `v * 100` (sepia), and
    // hue-rotate's degrees pass straight through to Caman's hue().
    function applyToneCurveCaman(c, filterStr) {
        parseFilterFunctions(filterStr).forEach(({ name, value }) => {
            if (name === 'grayscale') {
                if (value >= 0.999) c.greyscale();
                else c.saturation(-value * 100);
            } else if (name === 'sepia') {
                c.sepia(value * 100);
            } else if (name === 'saturate') {
                c.saturation((value - 1) * 100);
            } else if (name === 'contrast') {
                c.contrast((value - 1) * 100);
            } else if (name === 'brightness') {
                c.brightness((value - 1) * 100);
            } else if (name === 'hue-rotate') {
                c.hue(value);
            }
        });
    }

    // Bakes a recipe onto a copy of `sourceCanvas` for the actual saved
    // photo - the real thing, not an approximation, since this runs on a
    // static frame rather than a live video stream. Safari gets its base
    // tone curve from CamanJS (applyToneCurveCaman); every other browser
    // keeps the getImageData/putImageData pixel math (applyToneCurve),
    // unchanged.
    async function renderFilteredCanvas(sourceCanvas, filterKey) {
        const recipe = FILTER_RECIPES[filterKey];
        if (!recipe) return sourceCanvas;

        const out = document.createElement('canvas');
        out.width = sourceCanvas.width;
        out.height = sourceCanvas.height;
        const ctx = out.getContext('2d');

        ctx.drawImage(sourceCanvas, 0, 0);

        if (isSafariBrowser() && typeof Caman !== 'undefined') {
            await new Promise((resolve) => {
                Caman(out, function () {
                    this.reloadCanvasData();
                    applyToneCurveCaman(this, recipe.baseFilter);
                    this.render(resolve);
                });
            });
        } else {
            const baseImageData = ctx.getImageData(0, 0, out.width, out.height);
            applyToneCurve(baseImageData, recipe.baseFilter);
            ctx.putImageData(baseImageData, 0, 0);
        }

        (recipe.overlays || []).forEach((ov) => {
            ctx.globalCompositeOperation = ov.blend;
            ctx.fillStyle = ov.gradient ? gradientToCanvas(ctx, ov.gradient, out.width, out.height) : ov.color;
            ctx.fillRect(0, 0, out.width, out.height);
        });
        ctx.globalCompositeOperation = 'source-over';

        if (recipe.chromaticAberration) {
            applyChromaticAberration(ctx, out.width, out.height);
        }

        if (recipe.vignette) {
            const cx = out.width / 2, cy = out.height / 2;
            const g = ctx.createRadialGradient(cx, cy, out.width * 0.35, cx, cy, out.width * 0.8);
            g.addColorStop(0, 'rgba(0,0,0,0)');
            g.addColorStop(1, `rgba(0,0,0,${recipe.vignette})`);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, out.width, out.height);
            ctx.globalCompositeOperation = 'source-over';
        }

        if (recipe.grain) {
            const pattern = ctx.createPattern(getNoiseTile(), 'repeat');
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = recipe.grain;
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, out.width, out.height);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
        }

        if (recipe.scratches) {
            drawFilmScratches(ctx, out.width, out.height);
        }

        if (recipe.scanlines) {
            drawScanlines(ctx, out.width, out.height);
        }

        return out;
    }



    let currentFilter = "none";
    // State to track which filter is active
    let activeFilter = null;

    if(bnwFilter) {
        bnwFilter.addEventListener('click', () => {
            applyFilter("grayscale");
            filterText("BNW")
        });
    }

    if(sepiaFilter) {
        sepiaFilter.addEventListener('click', () => {
            applyFilter("sepia");
            filterText("sepia")
        });
    }

    if(smoothFilter) {
        smoothFilter.addEventListener('click', () => {
            applyFilter("smooth");
            filterText("smooth")
        });
    }

    if(grayFilter) {
        grayFilter.addEventListener('click', () => {
            applyFilter("gray");
            filterText("grayscale")
        });
    }

    if(vintageFilter) {
        vintageFilter.addEventListener('click', () => {
            applyFilter("vintage");
            filterText("vintage")
        });
    }

    if(normalFilter) {
        normalFilter.addEventListener('click', () => {
            applyFilter("none");
            filterText("none")
        });
    }

    if (oldfilmFilter) {
        oldfilmFilter.addEventListener('click', () => {
            applyFilter("oldfilm");
            filterText("old film")
        });
    }

    if (vhsFilter) {
        vhsFilter.addEventListener('click', () => {
            applyFilter("vhs");
            filterText("vhs")
        });
    }


    function applyFilter(filterKey) {
        // "none" (toolbar Normal button) and "normal" (popup Normal
        // option) both mean "no filter" - applyFilterPreview already
        // treats any key with no matching recipe as a no-op.
        applyFilterPreview(filterKey);
        currentFilter = filterKey; // <-- Save for canvas use
        console.log("Current filter:", currentFilter);
    }

    // ============================================
    // MODAL OPEN/CLOSE FUNCTIONALITY
    // ============================================

    function openModal() {
        filterPopup.classList.add("open")
        modalOverlay.classList.add("open")
        document.body.style.overflow = "hidden"
    }

    function closeModal() {
        filterPopup.classList.remove("open")
        modalOverlay.classList.remove("open")
        document.body.style.overflow = ""
    }

    // Event listeners for opening/closing
    menuBtn.addEventListener("click", openModal)
    closeBtn.addEventListener("click", closeModal)
    modalOverlay.addEventListener("click", closeModal)

    // Close popup when pressing Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal()
        }
    })

    // ============================================
    // FILTER SELECTION FUNCTIONALITY
    // ============================================

    filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        const filterName = option.getAttribute("data-filter")

        // Remove active class from all popup filter options
        filterOptions.forEach((opt) => opt.classList.remove("active"))

        // Remove active class from all toolbar filters
        toolbarFilters.forEach((filter) => filter.classList.remove("active"))

        // Add active class to clicked option
        option.classList.add("active")

        // Find and highlight corresponding toolbar filter if it exists
        const correspondingToolbarFilter = document.getElementById(`${filterName}FilterId`)
        if (correspondingToolbarFilter) {
        correspondingToolbarFilter.classList.add("active")
        }

        // Update active filter state
        activeFilter = filterName;
        applyFilter(filterName);
        filterText(filterName);


        console.log(`Filter applied: ${filterName}`)

        // Add a small delay before closing for better UX
        setTimeout(() => {
        closeModal()
        }, 300)
    })
    })

    // toolbarFilters.forEach((filter) => {
    // filter.addEventListener("click", () => {
    //     const filterName = filter.id.replace("FilterId", "")

    //     // Remove active class from all filters
    //     filterOptions.forEach((opt) => opt.classList.remove("active"))
    //     toolbarFilters.forEach((f) => f.classList.remove("active"))

    //     // Add active class to clicked toolbar filter
    //     filter.classList.add("active")

    //     // Find and highlight corresponding popup filter if it exists
    //     const correspondingPopupFilter = document.querySelector(`[data-filter="${filterName}"]`)
    //     if (correspondingPopupFilter) {
    //     correspondingPopupFilter.classList.add("active")
    //     }

    //     activeFilter = filterName;
    //     applyFilter(filterName);
    //     filterText(filterName);


    //     console.log(`Filter applied: ${filterName}`)
    // })
    // })

    function getCanvasFilter(filter) {
        switch (filter) {
            case "grayscale":
                return "grayscale(100%) contrast(1.5)";
            case "sepia":
                return "sepia(70%) hue-rotate(-15deg) brightness(1.2) contrast(1.3) blur(0.9px) saturate(1.8)";
            case "smooth":
                return "brightness(1) contrast(1.3) blur(0.9px)";
            case "gray":
                return "grayscale(80%) brightness(1) contrast(1.2) blur(0.9px)";
            case "vintage":
                return "sepia(100%) contrast(1)";
            case "none":
            default:
                return "none";
        }
    }


    function filterText(chosenFilter) {
        filterMessage.style.opacity = "1";
        filterMessage.innerHTML = chosenFilter;
            
        setTimeout(() => {
            filterMessage.style.opacity = "0"; // Fade out
        }, 1000);
    }

    const canvas = document.createElement('canvas');
    let images = [];
    let originalImages = [];

    let invertBtnState = false;
    let flashEnabled = true;

    if(invertBtn) {
        invertBtn.addEventListener('click', () => {
            invertBtnState = !invertBtnState;
            cameraInvertSwitch();

            if (invertBtn.id === 'mirrorControlBtn') {
                invertBtn.classList.toggle('active', invertBtnState);
                invertBtn.textContent = invertBtnState ? 'Mirror: On' : 'Mirror: Off';
            }

            filterText(invertBtnState ? "mirror on" : "mirror off");
        });
    }

    if (flashToggleBtn) {
        flashToggleBtn.addEventListener('click', () => {
            flashEnabled = !flashEnabled;
            flashToggleBtn.classList.toggle('active', flashEnabled);
            flashToggleBtn.textContent = flashEnabled ? 'Flash: On' : 'Flash: Off';
            filterText(flashEnabled ? 'flash on' : 'flash off');
        });
    }

    function cameraInvertSwitch() {
        if (invertBtnState == true) {
            // photoContainer.style.transform = 'scaleX(-1)'
            video.style.transform = 'scaleX(-1)'
        }
        else {
            // photoContainer.style.transform = 'scaleX(1)'
            video.style.transform = 'scaleX(1)'
        }
    }

    async function startCamera() {
        stopCameraStream(); 
        
        try {
            if (!window.isSecureContext || typeof navigator.mediaDevices?.getUserMedia !== 'function') {
                const secureUrl = window.location.href.replace(/^http:/i, 'https:');
                cameraPermissionUI.style.display = 'block';
                cameraStatus.innerHTML = `Camera requires HTTPS on this network.<br/>Open <a href="${secureUrl}">${secureUrl}</a>.`;
                retryCamera.style.display = 'block';
                return;
            }

            cameraPermissionUI.style.display = 'block';
            cameraStatus.textContent = 'Requesting camera access...';
            retryCamera.style.display = 'none';
            
            let constraints = { video: { facingMode: 'user' } };

            if (currentDeviceId) {
                constraints = { video: { deviceId: { exact: currentDeviceId } } };
            } else if (isOldIOS()) {
                constraints = {
                    video: {
                        facingMode: { ideal: 'user' },   // iOS-safe
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                };
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            
            cameraPermissionUI.style.display = 'none';

            if (cameraOptions && cameraOptions.options.length <= 1) {
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    
                    cameraOptions.innerHTML = '';
                    videoDevices.forEach((device, index) => {
                        const option = document.createElement('option');
                        option.value = device.deviceId;
                        option.text = device.label || `Camera ${index + 1}`;
                        cameraOptions.appendChild(option);
                    });

                    if (stream.getVideoTracks().length > 0) {
                        const activeTrack = stream.getVideoTracks()[0];
                        const activeDevice = videoDevices.find(d => d.label === activeTrack.label);
                        if (activeDevice) {
                            cameraOptions.value = activeDevice.deviceId;
                            currentDeviceId = activeDevice.deviceId;
                        } else if (videoDevices.length > 0 && currentDeviceId) {
                            cameraOptions.value = currentDeviceId;
                        }
                    }
                }).catch(err => {
                    console.error("Camera enumerate error:", err);
                    cameraOptions.innerHTML = '<option value="">Cameras Unavailable</option>';
                });
            }
    
            // Ensure video is playing before hiding black screen
            video.onloadedmetadata = () => {
                video.play();
                setTimeout(() => {
                    blackScreen.style.opacity = 0;
                    setTimeout(() => blackScreen.style.display = 'none', 1000);
                }, 500);
            };
        } catch (err) {
            console.error("Camera Access Error:", err.name, err.message);
            
            cameraPermissionUI.style.display = 'block';
            retryCamera.style.display = 'block';
            
            // Provide specific error messages based on error type
            if (err.name === 'NotAllowedError') {
                cameraStatus.textContent = 'Camera permission denied. Please enable camera access in settings.';
            } else if (err.name === 'NotFoundError') {
                cameraStatus.textContent = 'No camera found. Please connect a camera device.';
            } else if (err.name === 'NotReadableError') {
                cameraStatus.textContent = 'Camera is busy or in use. Try closing other apps using the camera.';
            } else if (err.name === 'SecurityError') {
                cameraStatus.textContent = 'Camera access blocked for security reasons. Use HTTPS.';
            } else if (isOldIOS()) {
                cameraStatus.innerHTML = 'Camera not working on your device.<br/>Try: Disable Private Browsing, Check HTTPS, Reload page.';
            } else {
                const errText = String(err?.message || err || 'Unknown error');
                if (errText.includes('getUserMedia')) {
                    const secureUrl = window.location.href.replace(/^http:/i, 'https:');
                    cameraStatus.innerHTML = `Camera requires HTTPS on this network.<br/>Open <a href="${secureUrl}">${secureUrl}</a>.`;
                } else {
                    cameraStatus.textContent = 'Camera error: ' + errText;
                }
            }
        }
    }

    function isOldIOS() {
        const ua = navigator.userAgent;
        const match = ua.match(/OS (\d+)_/);
        if (!match) return false;
        const version = parseInt(match[1], 10);
        return version <= 14; // adjust if needed
    }
    
    function stopCameraStream() {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    }
    
    // Start camera if on canvas.html
    if (window.location.pathname.endsWith("canvas.html") || window.location.pathname === "canvas.html") {
        startCamera();
    }

    async function startPhotobooth() {
        if (images.length === 3) {
            const confirmReset = confirm("You already have 3 pictures. Do you want to retake them?");
            if (!confirmReset) return;

            images = [];
            originalImages = [];
            photoContainer.innerHTML = '';
            progressCounter.textContent = "0/3";
            doneBtn.style.display = 'none';
            
            // Clear DB once
            const tx = db.transaction(["images"], "readwrite");
            tx.objectStore("images").clear();
        }

        // Disable buttons to prevent multiple actions
        startBtn.disabled = true;
        uploadBtn.disabled = true;
        startBtn.innerHTML = 'Capturing...';

        // Get the selected timer value
        const timerOptions = document.getElementById("timerOptions");
        const selectedValue = parseInt(timerOptions.value) || 3; // Default to 3 if no value is selected

        const remainingPhotos = 3 - images.length;
        for (let i = 0; i < remainingPhotos; i++) {
            await showCountdown(selectedValue);

            if (flashEnabled && flash) {
                flash.style.opacity = 1;
                setTimeout(() => flash.style.opacity = 0, 200);
            }

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.error("Video not ready yet.");
                alert("Camera not ready. Please try again.");
                return;
            }

            // Draw fresh video frame to canvas
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEAR canvas

            // 🔥 Mirror the actual SAVED photo, not just preview
            if (invertBtnState) {
                ctx.save();
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            await new Promise(res => setTimeout(res, 100)); // iOS delay

            const gradedCanvas = await renderFilteredCanvas(canvas, currentFilter);
            const imageData = gradedCanvas.toDataURL('image/png');
            console.log("Captured Image:", imageData);
            images.push(imageData);
            originalImages.push(imageData);

            // Save to IndexedDB incrementally
            const tx = db.transaction(["images"], "readwrite");
            tx.objectStore("images").add({ data: imageData, originalData: imageData });

            const imgElement = document.createElement('img');
            imgElement.src = imageData;
            imgElement.classList.add('photo');
            photoContainer.appendChild(imgElement);


            progressCounter.textContent = `${images.length}/3`;
            if (i < remainingPhotos - 1) await new Promise(res => setTimeout(res, 500));
        }

        // Reset buttons
        if (images.length === 3) {
            startBtn.disabled = false;
            uploadBtn.disabled = false;
            startBtn.innerHTML = 'Retake';
            doneBtn.style.display = 'block';
        }
    }

    async function showCountdown(selectedValue) {
        countdownText.style.display = "flex";
        for (let countdown = selectedValue; countdown > 0; countdown--) {
            countdownText.textContent = countdown;
            countdownText.classList.remove("bounce");
            void countdownText.offsetWidth; // Trigger reflow for animation
            countdownText.classList.add("bounce");
            await new Promise(res => setTimeout(res, 1000));
        }
        countdownText.style.display = "none";
    }
    
    // Automatically trigger the countdown when option changes
    function updateCountdown() {
        showCountdown();
    }

    function loadStoredImages() {
        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");

        const request = store.getAll();
        request.onsuccess = function () {
            const storedImages = request.result;

            storedImages.forEach(item => {
                images.push(item.data);
                originalImages.push(item.originalData || item.data);

                const img = document.createElement('img');
                img.src = item.data;
                img.classList.add('photo');
                photoContainer.appendChild(img);
            });

            progressCounter.textContent = `${images.length}/3`;

            if (images.length === 3) {
                startBtn.innerHTML = "Retake";
                doneBtn.style.display = "block";
            }
        };
    }


    // Updated Image Upload for Users to choose multiple images at once
    function handleImageUpload(event) {
        let files = Array.from(event.target.files);

        if (!files.length) {
            alert("Please upload a valid image file.");
            return;
        }

        // Check if there are existing images
        const replacing = images.length >= 3;

        if (replacing) {
            const confirmReplace = confirm(
                "You already have 3 pictures. Uploading new images will replace all current pictures. Continue?"
            );
            if (!confirmReplace) {
                event.target.value = "";
                return;
            }

            // Reset UI once, not inside loop
            images = [];
            originalImages = [];
            photoContainer.innerHTML = "";
            progressCounter.textContent = "0/3";
            doneBtn.style.display = "none";
            startBtn.innerHTML = "START";

            // Clear DB once
            const tx = db.transaction(["images"], "readwrite");
            tx.objectStore("images").clear();
        }

        // Only take up to the remaining slots
        const slotsLeft = 3 - images.length;
        if (files.length > slotsLeft) {
            alert(`You can only add ${slotsLeft} more photo(s). Only the first ${slotsLeft} will be uploaded.`);
            files = files.slice(0, slotsLeft);
        }

        // Show upload progress modal and disable buttons
        isUploadInProgress = true;
        uploadAbort = false;
        uploadModal.style.display = 'flex';
        uploadBtn.disabled = true;
        startBtn.disabled = true;

        // Store count of how many files were fully saved
        let processed = 0;

        files.forEach((file, index) => {
            if (!file.type.startsWith("image/")) return;
            
            // Check if upload is cancelled
            if (uploadAbort) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                if (uploadAbort) return;
                
                const imageData = e.target.result;

                // Save to memory
                images.push(imageData);
                originalImages.push(imageData);

                // Save to IndexedDB
                const tx = db.transaction(["images"], "readwrite");
                tx.objectStore("images").add({ data: imageData, originalData: imageData });

                // Add to UI
                const imgEl = document.createElement("img");
                imgEl.src = imageData;
                imgEl.classList.add("photo");
                photoContainer.appendChild(imgEl);

                progressCounter.textContent = `${images.length}/3`;
                
                // Update progress bar
                const progress = Math.round(((index + 1) / files.length) * 100);
                uploadProgress.textContent = progress + '%';
                uploadProgress.parentElement.style.width = progress + '%';

                processed++;

                // When ALL uploaded files are processed
                if (processed === files.length) {
                    if (!uploadAbort) {
                        setTimeout(() => {
                            uploadModal.style.display = 'none';
                            uploadBtn.disabled = false;
                            startBtn.disabled = false;
                            if (images.length === 3) {
                                startBtn.innerHTML = "Retake";
                                doneBtn.style.display = "block";
                            } else {
                                startBtn.innerHTML = "Take Next Photo";
                            }
                        }, 500);
                    }
                }
            };

            reader.readAsDataURL(file);
        });

        event.target.value = "";
    }



    function storeImageArray() {
        const request = indexedDB.open("PhotoboothDB", 1);

        request.onsuccess = function (e) {
            const db = e.target.result;

            // FIRST transaction: clear old data
            const clearTx = db.transaction(["images"], "readwrite");
            const clearStore = clearTx.objectStore("images");

            clearStore.clear();

            clearTx.oncomplete = function () {
                console.log("Old images cleared!");

                // SECOND transaction: save new images
                const saveTx = db.transaction(["images"], "readwrite");
                const saveStore = saveTx.objectStore("images");

                let loaded = 0;

                images.forEach((imgData, index) => {
                    saveStore.add({ data: imgData, originalData: originalImages[index] || imgData });
                    loaded++;
                });

                saveTx.oncomplete = function () {
                    console.log("All images saved!");
                    sessionStorage.setItem('returnLayout', 'canvas.html');
                    window.location.href = "customize.html";
                };
            };

            clearTx.onerror = (err) => {
                console.error("Failed to clear DB", err);
            };
        };
    }

    if(startBtn) {
        startBtn.addEventListener('click', () => startPhotobooth());
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === "Space") {
            event.preventDefault(); // Prevents scrolling when spacebar is pressed
            startPhotobooth();
        }
    });

    if (doneBtn) {
        doneBtn.addEventListener('click', () => handleDoneWithCropReview());
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            // alert("Note: Please make sure your total photo size does not exceed 5MB.\nLarge images may cause saving issues.");
            uploadInput.click();
        });
    }
    
    // Cancel upload functionality
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', () => {
            uploadAbort = true;
            isUploadInProgress = false;
            uploadModal.style.display = 'none';
            uploadBtn.disabled = false;
            startBtn.disabled = false;
            uploadInput.value = '';
            
            // Show notification
            alert('Upload cancelled. Your previous photos are preserved.');
        });
    }
    
    // Retry camera access
    if (retryCamera) {
        retryCamera.addEventListener('click', () => {
            startCamera();
        });
    }
    
    if(uploadInput) {
        uploadInput.addEventListener('change', handleImageUpload);
    }
    // downloadBtn.addEventListener('click', () => downloadStackedImages());
})