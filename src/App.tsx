import React, { useState } from 'react';
import { AppStep, FilterId, LayoutId } from './types/photobooth';
import { LAYOUTS, DEFAULT_LAYOUT } from './config/layouts';
import { DEFAULT_FILTER } from './config/filters';
import { Header } from './components/Header';
import { LayoutSelector } from './components/LayoutSelector';
import { CaptureStudio } from './components/CaptureStudio';
import { CustomizeStudio } from './components/CustomizeStudio';
import { ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('select-layout');
  const [selectedLayoutId, setSelectedLayoutId] = useState<LayoutId>(DEFAULT_LAYOUT);
  const [selectedFilter, setSelectedFilter] = useState<FilterId>(DEFAULT_FILTER);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  const activeLayout = LAYOUTS[selectedLayoutId];

  // Reset to initial layout selection
  const handleReset = () => {
    setCapturedPhotos([]);
    setStep('select-layout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Top Navbar */}
      <Header currentStep={step} onReset={handleReset} />

      {/* Main Studio Canvas / Steps */}
      <main className="flex-1">
        {step === 'select-layout' && (
          <LayoutSelector
            selectedLayout={selectedLayoutId}
            onSelectLayout={(id) => setSelectedLayoutId(id)}
            onConfirm={() => setStep('capture')}
          />
        )}

        {step === 'capture' && (
          <CaptureStudio
            layout={activeLayout}
            selectedFilter={selectedFilter}
            onFilterChange={(f) => setSelectedFilter(f)}
            onPhotosComplete={(photos) => {
              setCapturedPhotos(photos);
              setStep('customize');
            }}
            onBackToLayout={() => setStep('select-layout')}
          />
        )}

        {step === 'customize' && (
          <CustomizeStudio
            layout={activeLayout}
            photos={capturedPhotos}
            initialFilter={selectedFilter}
            onBackToCapture={() => setStep('capture')}
            onNewSession={handleReset}
          />
        )}
      </main>

      {/* Modern Footer with Privacy Notice */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              100% Client-Side Privacy: Foto tidak pernah diunggah ke server pihak manapun.
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Photobooth Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
