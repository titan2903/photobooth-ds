import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Download, 
  Printer, 
  Type, 
  Calendar, 
  ArrowLeft, 
  Check, 
  Shuffle, 
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FilterId, FrameTheme, LayoutConfig } from '../types/photobooth';
import { renderPhotoStrip } from '../utils/canvasRenderer';
import { FramePicker } from './FramePicker';
import { FilterPicker } from './FilterPicker';

interface CustomizeStudioProps {
  layout: LayoutConfig;
  photos: string[];
  initialFilter: FilterId;
  initialTheme: FrameTheme;
  onBackToCapture: () => void;
  onNewSession: () => void;
}

export const CustomizeStudio: React.FC<CustomizeStudioProps> = ({
  layout,
  photos,
  initialFilter,
  initialTheme,
  onBackToCapture,
  onNewSession,
}) => {
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(photos);
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(initialTheme);
  const [customHex, setCustomHex] = useState<string>(initialTheme.bgValue);
  const [selectedFilter, setSelectedFilter] = useState<FilterId>(initialFilter);
  const [caption, setCaption] = useState<string>('PHOTOBOOTH STUDIO');
  const [showDate, setShowDate] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const renderGeneration = useRef(0);
  const [renderError, setRenderError] = useState<string | null>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger master canvas re-render
  const updateMasterRender = useCallback(async () => {
    const generation = ++renderGeneration.current;
    setIsRendering(true);
    setRenderError(null);
    activeCanvasRef.current = null;
    try {
      await document.fonts.ready;
      const themeToUse: FrameTheme = selectedTheme.isCustom
        ? {
            id: 'custom', tier: 'standard',
            name: 'Custom',
            bgValue: customHex,
            textColor: getContrastColor(customHex),
            isCustom: true,
          }
        : selectedTheme;

      const renderedCanvas = await renderPhotoStrip({
        layout,
        theme: themeToUse,
        photoDataUrls: currentPhotos,
        filter: selectedFilter,
        caption,
        showDate,
        showTime,
      });

      if (generation !== renderGeneration.current) return;
      activeCanvasRef.current = renderedCanvas;
      setPreviewDataUrl(renderedCanvas.toDataURL('image/png'));
    } catch (err) {
      if (generation === renderGeneration.current) setRenderError('Frame belum berhasil dirender. Pilih frame lagi untuk mencoba kembali.');
      console.error('Rendering error:', err);
    } finally {
      if (generation === renderGeneration.current) setIsRendering(false);
    }
  }, [layout, currentPhotos, selectedTheme, customHex, selectedFilter, caption, showDate, showTime]);

  useEffect(() => {
    updateMasterRender();
    return () => { renderGeneration.current += 1; };
  }, [updateMasterRender]);

  // Download high-resolution PNG
  const handleDownload = () => {
    if (!activeCanvasRef.current) return;

    // Trigger celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a', '#38bdf8'],
    });

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const link = document.createElement('a');
    link.download = `photobooth-${timestamp}.png`;
    link.href = activeCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!activeCanvasRef.current) return;
    try {
      activeCanvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2000);
      });
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  // Print layout directly
  const handlePrint = () => {
    if (!previewDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photobooth Strip</title>
          <style>
            @page { margin: 0; }
            body { 
              margin: 0; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh;
              background: #fff;
            }
            img { 
              max-height: 98vh; 
              max-width: 98vw; 
              object-fit: contain; 
            }
          </style>
        </head>
        <body>
          <img src="${previewDataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Shuffle / rotate photo order
  const handleRotateOrder = () => {
    if (currentPhotos.length <= 1) return;
    setCurrentPhotos((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToCapture}
          className="text-xs text-studio-400 hover:text-studio-strong flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Pemotretan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewSession}
            className="text-xs text-studio-400 hover:text-rose-400 transition-colors"
          >
            Sesi Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Live Photo Strip Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full flex flex-col items-center">
            {/* The Photo Strip Paper Card */}
            <div className="relative p-2 rounded-2xl bg-studio-900 border border-studio-800 shadow-2xl flex items-center justify-center max-h-[75vh]">
              {isRendering && (
                <div className="absolute inset-0 bg-studio-950/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {renderError && <p role="alert" className="absolute inset-0 z-20 flex items-center justify-center bg-studio-950/90 p-6 text-center text-xs text-rose-400">{renderError}</p>}
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Photobooth Strip Preview"
                  className="max-h-[72vh] w-auto rounded-lg object-contain shadow-md"
                />
              ) : (
                <div className="w-48 h-96 flex items-center justify-center text-studio-500 text-xs">
                  Memuat render...
                </div>
              )}
            </div>

            {/* Quick Strip Actions under preview */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleRotateOrder}
                className="disabled:opacity-50 disabled:cursor-wait px-3 py-1.5 rounded-lg bg-studio-900 hover:bg-studio-800 border border-studio-800 text-studio-300 text-xs flex items-center gap-1.5 transition-colors"
                title="Tukar Urutan Pose"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Tukar Urutan</span>
              </button>
              <button
                onClick={handleCopyToClipboard}
                disabled={isRendering || Boolean(renderError)}
                className="disabled:opacity-50 disabled:cursor-wait px-3 py-1.5 rounded-lg bg-studio-900 hover:bg-studio-800 border border-studio-800 text-studio-300 text-xs flex items-center gap-1.5 transition-colors"
                title="Salin ke Clipboard"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Gambar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Customization Studio Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Header Action Card */}
          <div className="bg-gradient-to-r from-studio-900 via-studio-900 to-studio-900/60 border border-studio-800 rounded-3xl p-6">
            <h2 className="text-2xl font-heading font-extrabold text-studio-strong mb-2">
              Kustomisasi Frame & Ekspor
            </h2>
            <p className="text-xs text-studio-400 mb-6">
              Pilih desain frame, atur filter foto, dan tuliskan cerita di balik momenmu.
            </p>

            {/* Big Download Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isRendering || Boolean(renderError)}
                className="disabled:opacity-50 disabled:cursor-wait flex-1 min-w-[200px] flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-heading font-bold text-sm shadow-xl shadow-rose-500/25 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={isRendering || Boolean(renderError)}
                className="disabled:opacity-50 disabled:cursor-wait flex items-center gap-2 px-5 py-3.5 rounded-xl bg-studio-800 hover:bg-studio-700 border border-studio-700 text-studio-strong font-heading font-semibold text-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          <FramePicker
            layout={layout}
            selectedTheme={selectedTheme}
            customHex={customHex}
            onSelect={(theme) => { setSelectedTheme(theme); setCustomHex(theme.bgValue); }}
            onCustomColor={(color) => {
              setCustomHex(color);
              setSelectedTheme({ id: 'custom', tier: 'standard', name: 'Custom Hex', bgValue: color, textColor: getContrastColor(color), isCustom: true });
            }}
          />

          <FilterPicker selectedFilter={selectedFilter} onSelect={setSelectedFilter} previewPhoto={currentPhotos[0]} />

          {/* Typography & Caption Settings */}
          <div className="bg-studio-900/70 border border-studio-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-purple-400" />
              <h3 className="font-heading font-bold text-sm text-studio-strong">Teks & Stempel Waktu</h3>
            </div>

            <div className="flex flex-col gap-3">
              {/* Custom Caption Input */}
              <div>
                <label className="text-xs text-studio-400 block mb-1.5">
                  Teks Keterangan Bawah (Judul Strip):
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: BESTIE FOREVER • 2026"
                  maxLength={32}
                  className="w-full bg-studio-950 border border-studio-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-studio-strong focus:outline-none transition-colors"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-studio-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="rounded border-studio-700 bg-studio-950 text-rose-500 focus:ring-0"
                  />
                  <Calendar className="w-3.5 h-3.5 text-studio-400" />
                  <span>Sertakan Tanggal</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-studio-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTime}
                    onChange={(e) => setShowTime(e.target.checked)}
                    className="rounded border-studio-700 bg-studio-950 text-rose-500 focus:ring-0"
                  />
                  <span>Sertakan Jam</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for contrast text color
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#111111';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#111111' : '#ffffff';
}
