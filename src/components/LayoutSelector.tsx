import React from 'react';
import { LayoutId } from '../types/photobooth';
import { LAYOUTS } from '../config/layouts';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: LayoutId;
  onSelectLayout: (id: LayoutId) => void;
  onConfirm: () => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onSelectLayout,
  onConfirm,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Hero Headline */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pilih Format Photo Strip Favoritmu</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Capture Your Memories
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Pilih template photo strip bergaya photobooth studio Korea. Ambil pose terbaikmu langsung dari kamera peramban.
        </p>
      </div>

      {/* Grid of Layout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full mb-10">
        {Object.values(LAYOUTS).map((layout) => {
          const isSelected = selectedLayout === layout.id;

          return (
            <div
              key={layout.id}
              onClick={() => onSelectLayout(layout.id)}
              className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col items-center border ${
                isSelected
                  ? 'bg-neutral-900 border-rose-500 ring-2 ring-rose-500/30 shadow-xl shadow-rose-500/10 -translate-y-1'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              {/* Active Selection Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}

              {/* Strip Mockup Representation */}
              <div className="w-full flex items-center justify-center py-6">
                <div 
                  className={`bg-neutral-800/90 rounded-lg p-2.5 shadow-md flex flex-col items-center justify-between border border-neutral-700/50 transition-transform group-hover:scale-105 ${
                    layout.id === 'grid-4' 
                      ? 'w-36 h-44' 
                      : layout.id === 'strip-4'
                      ? 'w-24 h-56'
                      : layout.id === 'strip-3'
                      ? 'w-24 h-48'
                      : 'w-24 h-40'
                  }`}
                >
                  {/* Photo Boxes */}
                  <div className={`w-full flex-1 gap-1.5 ${layout.gridColumns === 2 ? 'grid grid-cols-2' : 'flex flex-col'}`}>
                    {Array.from({ length: layout.photoCount }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className="bg-neutral-950/70 rounded border border-neutral-700/30 flex-1 flex items-center justify-center"
                      >
                        <Camera className="w-3 h-3 text-neutral-600" />
                      </div>
                    ))}
                  </div>
                  {/* Bottom Text Line */}
                  <div className="w-10 h-1 bg-neutral-700 rounded-full mt-2" />
                </div>
              </div>

              {/* Layout Details */}
              <div className="w-full text-center mt-2">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h3 className="font-heading font-bold text-white text-base">
                    {layout.name}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono-custom font-semibold">
                    {layout.photoCount} Foto
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {layout.tagline}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Button */}
      <button
        onClick={onConfirm}
        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-heading font-bold text-base shadow-lg shadow-rose-500/25 transition-all duration-200 active:scale-95 group"
      >
        <span>Mulai Sesi Pemotretan</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
