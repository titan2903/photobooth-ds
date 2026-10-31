import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  Timer, 
  RotateCcw, 
  Check, 
  ArrowRight,
  AlertCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AnimationSettings, CapturedPhoto, FilterId, LayoutConfig } from '../types/photobooth';
import { FILTERS } from '../config/filters';
import { FilterPicker } from './FilterPicker';
import { FilterEffects } from './FilterEffects';
import { AnimationPicker } from './AnimationPicker';
import { AnimatedOverlay } from './AnimatedOverlay';
import { HeadPhotoOverlay } from './HeadPhotoOverlay';
import { useHeadTracking } from '../hooks/useHeadTracking';
import { isHeadAnimation } from '../config/animations';
import { useCamera } from '../hooks/useCamera';
import { MIN_CAMERA_ZOOM, MAX_CAMERA_ZOOM, CAMERA_ZOOM_STEP } from '../utils/cameraZoom';
import { createCapturedPhoto } from '../utils/photoSession';
import { playCountdownBeep, playShutterSound } from '../utils/audio';

interface CaptureStudioProps {
  layout: LayoutConfig;
  selectedFilter: FilterId;
  animation: AnimationSettings;
  onAnimationChange: (animation: AnimationSettings) => void;
  onFilterChange: (filter: FilterId) => void;
  onPhotosComplete: (photos: CapturedPhoto[]) => void;
  onBackToLayout: () => void;
}

export const CaptureStudio: React.FC<CaptureStudioProps> = ({
  layout,
  selectedFilter,
  animation,
  onAnimationChange,
  onFilterChange,
  onPhotosComplete,
  onBackToLayout,
}) => {
  const {
    videoRef,
    zoom,
    setZoom,
    isReady,
    error,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isMirrored,
    setIsMirrored,
    startStream,
    captureFrame,
  } = useCamera({ idealWidth: 1280, idealHeight: 960 });

  const headEffect = isHeadAnimation(animation.id);
  const tracking = useHeadTracking(videoRef, headEffect && isReady);

  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3); // 3 or 5
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState<boolean>(false);

  const effectsRef = useRef({filter:selectedFilter,animation});
  useEffect(()=>{effectsRef.current={filter:selectedFilter,animation};},[selectedFilter,animation]);

  const countdownIntervalRef = useRef<number | null>(null);

  // Initialize camera stream on mount
  useEffect(() => {
    startStream();
  }, [startStream]);

  // Clean up interval
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handle Shutter Trigger
  const takeSnapshot = useCallback(() => {
    setShowFlash(true);
    playShutterSound();
    setTimeout(() => setShowFlash(false), 350);

    const frameData = captureFrame();
    if (frameData) {
      const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const effects=effectsRef.current;
      const photo=createCapturedPhoto(frameData,effects.filter,effects.animation,motionReduced ? 2.4 : performance.now()/1000);
      setCapturedPhotos(prev => prev.length < layout.photoCount ? [...prev,photo] : prev);
    }
  }, [captureFrame,layout.photoCount]);

  // Trigger countdown then snapshot
  const startCountdown = useCallback(() => {
    if (isCountingDown || !isReady) return;

    setIsCountingDown(true);
    setCurrentCount(countdownSeconds);
    playCountdownBeep(false);

    let count = countdownSeconds;

    countdownIntervalRef.current = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCurrentCount(count);
        playCountdownBeep(false);
      } else {
        // Shutter time!
        if (countdownIntervalRef.current) {
          window.clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setCurrentCount(null);
        setIsCountingDown(false);
        takeSnapshot();
      }
    }, 1000);
  }, [isCountingDown, isReady, countdownSeconds, takeSnapshot]);

  // Check if session completed
  const isFinished = capturedPhotos.length >= layout.photoCount;

  // Retake last photo
  const retakeLast = () => {
    setCapturedPhotos((prev) => prev.slice(0, prev.length - 1));
  };

  // Retake all photos
  const retakeAll = () => {
    setCapturedPhotos([]);
  };

  const activeFilterConfig = FILTERS[selectedFilter] || FILTERS.normal;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToLayout}
          className="text-xs text-studio-400 hover:text-studio-strong flex items-center gap-1.5 transition-colors"
        >
          ← Ganti Layout ({layout.name})
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-custom bg-studio-900 border border-studio-800 px-3 py-1 rounded-full text-rose-400 font-semibold">
            Pose {Math.min(capturedPhotos.length + 1, layout.photoCount)} dari {layout.photoCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Viewfinder (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div style={videoRef.current?.videoWidth ? { aspectRatio: `${videoRef.current.videoWidth} / ${videoRef.current.videoHeight}` } : undefined} className="camera-preview relative aspect-[4/3] bg-studio-900 rounded-3xl overflow-hidden border border-studio-800 shadow-2xl flex items-center justify-center">
            {/* Live Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                filter: activeFilterConfig.cssFilter,
                transform: `scale(${isMirrored ? -zoom : zoom}, ${zoom})`,
              }}
              className="w-full h-full object-cover"
            />

            <FilterEffects filter={activeFilterConfig} />
            <AnimatedOverlay settings={animation} heads={headEffect ? tracking.heads : undefined} sourceWidth={videoRef.current?.videoWidth} sourceHeight={videoRef.current?.videoHeight} mirrored={isMirrored} zoom={zoom} />

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 bg-studio-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
                <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
                <h3 className="font-heading font-bold text-lg text-studio-strong mb-1">Akses Kamera Diperlukan</h3>
                <p className="text-sm text-studio-400 max-w-sm mb-4">{error}</p>
                <button
                  onClick={() => startStream(selectedDeviceId)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Camera Flash Overlay */}
            {showFlash && (
              <div className="absolute inset-0 bg-white animate-flash z-30 pointer-events-none" />
            )}

            {/* Countdown Overlay */}
            {currentCount !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-20 pointer-events-none">
                <span className="text-8xl sm:text-9xl font-heading font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] scale-125 animate-ping duration-700">
                  {currentCount}
                </span>
              </div>
            )}

            {/* Floating Top Control Pills */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
              {/* Mirror Toggle */}
              <button
                onClick={() => setIsMirrored((prev) => !prev)}
                className={`p-2.5 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isMirrored 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                    : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
                }`}
                title="Mirror Camera"
              >
                <FlipHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Mirror</span>
              </button>

              {/* Timer Duration Selector */}
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1">
                {[3, 5].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setCountdownSeconds(sec)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-custom font-semibold transition-all ${
                      countdownSeconds === sec
                        ? 'bg-white text-black'
                        : 'text-studio-400 hover:text-studio-strong'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {/* Device Selector (if multiple) */}
              {devices.length > 1 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    startStream(e.target.value);
                  }}
                  className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs rounded-full px-3 py-1.5 focus:outline-none"
                >
                  {devices.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId} className="bg-studio-900 text-studio-strong">
                      {d.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Shutter Action Bar */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center z-10">
              {!isFinished ? (
                <button
                  onClick={startCountdown}
                  disabled={isCountingDown || !isReady}
                  className="group relative w-18 h-18 rounded-full bg-white/20 backdrop-blur-md p-1.5 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-lg group-hover:bg-rose-100 transition-colors">
                    {isCountingDown ? (
                      <Timer className="w-7 h-7 text-rose-600 animate-spin" />
                    ) : (
                      <Camera className="w-7 h-7 text-studio-900 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => onPhotosComplete(capturedPhotos)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                >
                  <Check className="w-5 h-5" />
                  <span>Lanjut ke Kustomisasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="camera-zoom-controls" role="group" aria-label="Zoom kamera">
            <button type="button" onClick={()=>setZoom(zoom-CAMERA_ZOOM_STEP)} disabled={!isReady||zoom<=MIN_CAMERA_ZOOM} aria-label="Zoom out kamera"><ZoomOut size={17}/></button>
            <label className="camera-zoom-slider"><span>Zoom kamera</span><input type="range" aria-label="Tingkat zoom kamera" min={MIN_CAMERA_ZOOM} max={MAX_CAMERA_ZOOM} step={CAMERA_ZOOM_STEP} value={zoom} onChange={event=>setZoom(Number(event.target.value))} disabled={!isReady}/></label>
            <output aria-label="Zoom saat ini">{zoom.toFixed(1)}×</output>
            <button type="button" onClick={()=>setZoom(zoom+CAMERA_ZOOM_STEP)} disabled={!isReady||zoom>=MAX_CAMERA_ZOOM} aria-label="Zoom in kamera"><ZoomIn size={17}/></button>
            <button type="button" className="camera-zoom-reset" onClick={()=>setZoom(1)} disabled={!isReady||zoom===1}>Reset</button>
            <small>Zoom digital · zoom out hingga 1×</small>
          </div>

          {headEffect && isReady && <div className={`head-tracking-status head-tracking-${tracking.status}`} role="status">
            <span className="head-tracking-dot" />
            {tracking.status === 'loading' ? 'Menyiapkan pelacakan kepala…' : tracking.status === 'tracking' ? `Efek mengikuti ${tracking.heads.length} wajah` : tracking.status === 'searching' ? 'Arahkan wajah ke kamera agar efek muncul di atas kepala.' : 'Pelacakan kepala belum tersedia. Coba muat ulang model.'}
            {tracking.status === 'error' && <button type="button" onClick={tracking.retry}>Coba lagi</button>}
          </div>}
          <AnimationPicker settings={animation} onChange={onAnimationChange} />
          <FilterPicker selectedFilter={selectedFilter} onSelect={onFilterChange} previewPhoto={capturedPhotos[0]?.dataUrl} compact />
        </div>

        {/* Right Strip Queue (1 col) */}
        <div className="bg-studio-900/70 border border-studio-800 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-studio-800">
            <h4 className="font-heading font-bold text-sm text-studio-strong">Hasil Pose</h4>
            {capturedPhotos.length > 0 && (
              <button
                onClick={retakeAll}
                className="text-[11px] text-studio-400 hover:text-rose-400 flex items-center gap-1"
                title="Retake all"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Queue Boxes */}
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: layout.photoCount }).map((_, idx) => {
              const photo = capturedPhotos[idx];
              const photoFilter=photo ? FILTERS[photo.filter] : activeFilterConfig;
              return (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden bg-studio-950 border border-studio-800 flex items-center justify-center group"
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.dataUrl}
                        alt={`Pose ${idx + 1}`}
                        style={{ filter: photoFilter.cssFilter }}
                        className="w-full h-full object-cover"
                      />
                      <FilterEffects filter={photoFilter} />
                      <HeadPhotoOverlay photo={photo.dataUrl} settings={photo.animation} time={photo.animationTime} />
                      <span className="captured-photo-filter">{photoFilter.name}</span>
                      {idx === capturedPhotos.length - 1 && (
                        <button
                          onClick={retakeLast}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-white text-xs font-semibold transition-opacity"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Foto Ulang
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-3">
                      <span className="text-studio-600 font-mono-custom text-xs">
                        #{idx + 1}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isFinished && (
            <button
              onClick={() => onPhotosComplete(capturedPhotos)}
              className="mt-2 w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-transform active:scale-95"
            >
              <span>Lanjut ({capturedPhotos.length}/{layout.photoCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
