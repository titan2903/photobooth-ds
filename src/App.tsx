import React, { useState } from 'react';
import { AnimationSettings, AppStep, CapturedPhoto, FilterId, FrameTheme, LayoutId } from './types/photobooth';
import { LAYOUTS, DEFAULT_LAYOUT } from './config/layouts';
import { DEFAULT_FILTER } from './config/filters';
import { DEFAULT_ANIMATION } from './config/animations';
import { DEFAULT_THEME } from './config/themes';
import { Header } from './components/Header';
import { LayoutSelector } from './components/LayoutSelector';
import { CaptureStudio } from './components/CaptureStudio';
import { CustomizeStudio } from './components/CustomizeStudio';
import { ShieldCheck, Heart } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState<AppStep>('select-layout');
  const [selectedLayoutId, setSelectedLayoutId] = useState<LayoutId>(DEFAULT_LAYOUT);
  const [selectedFrame, setSelectedFrame] = useState<FrameTheme>(DEFAULT_THEME);
  const [selectedFilter, setSelectedFilter] = useState<FilterId>(DEFAULT_FILTER);
  const [animation, setAnimation] = useState<AnimationSettings>(DEFAULT_ANIMATION);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);

  const activeLayout = LAYOUTS[selectedLayoutId];

  // Reset to initial layout selection
  const handleReset = () => {
    setCapturedPhotos([]);
    setStep('select-layout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-950 text-studio-100">
      {/* Top Navbar */}
      <Header currentStep={step} onReset={handleReset} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Studio Canvas / Steps */}
      <main className="flex-1">
        {step === 'select-layout' && (
          <LayoutSelector
            selectedLayout={selectedLayoutId}
            selectedFrame={selectedFrame}
            onSelectFrame={setSelectedFrame}
            onSelectLayout={(id) => setSelectedLayoutId(id)}
            onConfirm={() => setStep('capture')}
          />
        )}

        {step === 'capture' && (
          <CaptureStudio
            layout={activeLayout}
            selectedFilter={selectedFilter}
            animation={animation}
            onAnimationChange={setAnimation}
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
            initialTheme={selectedFrame}
            onBackToCapture={() => setStep('capture')}
            onNewSession={handleReset}
          />
        )}
      </main>

      {/* Modern Footer with Privacy Notice */}
      <footer className="border-t border-studio-900 bg-studio-950/80 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-studio-500">
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
