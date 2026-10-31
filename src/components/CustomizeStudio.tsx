import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { CapturedPhoto, FrameTheme, LayoutConfig } from '../types/photobooth';
import { renderPhotoStrip } from '../utils/canvasRenderer';
import { FramePicker } from './FramePicker';
import { FilterPicker } from './FilterPicker';
import { AnimationPicker } from './AnimationPicker';
import { GifExportPanel } from './GifExportPanel';
import { FILTERS } from '../config/filters';
import { FilterEffects } from './FilterEffects';
import { HeadPhotoOverlay } from './HeadPhotoOverlay';
import { rotatePhotos, updatePhotoEffects } from '../utils/photoSession';
import { planA4Sheet, renderA4Sheet, SHEET_COPIES, SheetCopies } from '../utils/printSheet';
import { getFrameCanvasSize, getImageArtwork } from '../utils/frameArtwork';

interface CustomizeStudioProps {
  layout: LayoutConfig;
  photos: CapturedPhoto[];
  initialTheme: FrameTheme;
  onBackToCapture: () => void;
  onNewSession: () => void;
}

export const CustomizeStudio: React.FC<CustomizeStudioProps> = ({
  layout,
  photos,
  initialTheme,
  onBackToCapture,
  onNewSession,
}) => {
  const [currentPhotos, setCurrentPhotos] = useState<CapturedPhoto[]>(photos);
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(initialTheme);
  const frameSize = getFrameCanvasSize(layout, selectedTheme);
  const isStrip = layout.gridColumns === 1;
  const [copies, setCopies] = useState<SheetCopies>(isStrip ? 5 : 4);
  const [borderless, setBorderless] = useState(false);
  const copyUnit = isStrip ? 'strip' : 'kartu';
  // Real printed size of one copy per option, so people pick by size, not by guess.
  const sheetOptions = SHEET_COPIES.map(count => {
    const item = planA4Sheet(frameSize.width, frameSize.height, count, borderless).items[0];
    const cm = (mm: number) => (mm / 10).toFixed(1).replace('.', ',');
    const [short, long] = [Math.min(item.width, item.height), Math.max(item.width, item.height)];
    const used = Math.round(count * item.width * item.height / (210 * 297) * 100);
    return { count, label: `${count} ${copyUnit} · ${cm(short)} × ${cm(long)} cm`, used };
  });
  const activeOption = sheetOptions.find(option => option.count === copies)!;
  const [customHex, setCustomHex] = useState<string>(initialTheme.bgValue);
  const [selectedPhotoId,setSelectedPhotoId]=useState(photos[0]?.id);
  const activePhoto=currentPhotos.find(photo=>photo.id===selectedPhotoId) ?? currentPhotos[0];
  const [caption, setCaption] = useState<string>('DATA SCIENCE GATHERING 2026');
  const [showDate, setShowDate] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const renderGeneration = useRef(0);
  const [renderError, setRenderError] = useState<string | null>(null);
  const activeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderOptions=useMemo(()=>({
    layout,
    theme:selectedTheme.isCustom ? {...selectedTheme,bgValue:customHex,textColor:getContrastColor(customHex)} : selectedTheme,
    photos:currentPhotos,caption,showDate,showTime,
  }),[layout,selectedTheme,customHex,currentPhotos,caption,showDate,showTime]);

  // Trigger master canvas re-render
  const updateMasterRender = useCallback(async () => {
    const generation = ++renderGeneration.current;
    setIsRendering(true);
    setRenderError(null);
    activeCanvasRef.current = null;
    try {
      await document.fonts.ready;
      const renderedCanvas = await renderPhotoStrip(renderOptions);

      if (generation !== renderGeneration.current) return;
      activeCanvasRef.current = renderedCanvas;
      setPreviewDataUrl(renderedCanvas.toDataURL('image/png'));
    } catch (err) {
      if (generation === renderGeneration.current) setRenderError('Foto atau efek belum berhasil dirender. Pilih efek lagi untuk mencoba kembali.');
      console.error('Rendering error:', err);
    } finally {
      if (generation === renderGeneration.current) setIsRendering(false);
    }
  }, [renderOptions]);

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

  // Print several copies on one A4 sheet at real size (300 DPI), with cut lines.
  const handlePrint = () => {
    const strip = activeCanvasRef.current;
    if (!strip) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const sheet = renderA4Sheet(strip, planA4Sheet(strip.width, strip.height, copies, borderless));
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak A4 Photobooth</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            html, body { margin: 0; padding: 0; background: #fff; }
            img { display: block; width: 210mm; height: 297mm; }
          </style>
        </head>
        <body>
          <img src="${sheet.toDataURL('image/png')}" onload="window.print()" />
          <script>window.onafterprint = () => window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Shuffle / rotate photo order
  const handleRotateOrder = () => {
    if (currentPhotos.length <= 1) return;
    setCurrentPhotos(rotatePhotos);
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
                <span>Cetak A4</span>
              </button>
            </div>
            <div className="print-sheet-options" role="group" aria-label="Pengaturan cetak A4">
              <label>
                <span>Jumlah per lembar A4</span>
                <select value={copies} onChange={event => setCopies(Number(event.target.value) as SheetCopies)}>
                  {sheetOptions.map(option => <option key={option.count} value={option.count}>{option.label}{isStrip && option.count === 5 ? ' (seperti desain)' : ''}</option>)}
                </select>
              </label>
              <label className="print-sheet-check">
                <input type="checkbox" checked={borderless} onChange={event => setBorderless(event.target.checked)} />
                <span>Printer borderless</span>
              </label>
              <small>{copies} {copyUnit} per lembar A4 · {activeOption.used}% kertas terpakai · ukuran asli, potong di garis putus-putus. Di dialog cetak pilih kertas A4, skala 100% (matikan "Fit to page").</small>
            </div>
            <GifExportPanel options={renderOptions} disabled={isRendering || Boolean(renderError)} />
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

          {activePhoto && <>
            <section className="per-photo-editor" aria-label="Pilih foto untuk mengedit efek">
              <h3>Edit filter per foto</h3>
              <p>Pilih foto yang ingin diubah. Foto lain tetap memakai efek saat diambil.</p>
              <div className="per-photo-options" role="group" aria-label="Foto yang diedit">
                {currentPhotos.map((photo,index)=><button type="button" key={photo.id} aria-pressed={activePhoto.id===photo.id} className={activePhoto.id===photo.id ? 'is-active' : ''} onClick={()=>setSelectedPhotoId(photo.id)}>
                  <span className="per-photo-thumbnail"><img src={photo.dataUrl} alt={`Pose ${index+1}`} style={{filter:FILTERS[photo.filter].cssFilter}} /><FilterEffects filter={FILTERS[photo.filter]} /><HeadPhotoOverlay photo={photo.dataUrl} settings={photo.animation} time={photo.animationTime} /></span>
                  <span>Foto {index+1}</span><small>{FILTERS[photo.filter].name}</small>
                </button>)}
              </div>
              <div className="per-photo-edit-actions"><span role="status">Mengedit Foto {currentPhotos.indexOf(activePhoto)+1}</span><button type="button" onClick={()=>setCurrentPhotos(prev=>prev.map(photo=>({...photo,filter:activePhoto.filter,animation:{...activePhoto.animation}})))}>Terapkan efek ke semua foto</button></div>
            </section>
            <AnimationPicker settings={activePhoto.animation} onChange={animation=>setCurrentPhotos(prev=>updatePhotoEffects(prev,activePhoto.id,{animation}))} />
            <FilterPicker selectedFilter={activePhoto.filter} onSelect={filter=>setCurrentPhotos(prev=>updatePhotoEffects(prev,activePhoto.id,{filter}))} previewPhoto={activePhoto.dataUrl} />
          </>}

          {/* Typography & Caption Settings (image frames carry their own text) */}
          {!getImageArtwork(layout, selectedTheme) && <div className="bg-studio-900/70 border border-studio-800 rounded-2xl p-5">
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
          </div>}
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
