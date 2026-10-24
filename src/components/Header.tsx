import React from 'react';
import { Camera, Sparkles, RefreshCw, Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';
import { AppStep } from '../types/photobooth';

interface HeaderProps {
  currentStep: AppStep;
  onReset: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onReset, theme, onToggleTheme }) => {
  const steps: { id: AppStep; label: string; num: string }[] = [
    { id: 'select-layout', label: 'Layout', num: '01' },
    { id: 'capture', label: 'Studio', num: '02' },
    { id: 'customize', label: 'Customize', num: '03' },
  ];

  return (
    <header className="border-b border-studio-800/80 bg-studio-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-studio-950 rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold tracking-tight text-lg text-studio-strong">
                PHOTOBOOTH DS
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold font-mono">
                STUDIO
              </span>
            </div>
            <p className="text-[11px] text-studio-400 hidden sm:block">Korean Style Photo Strip Studio</p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-1 sm:gap-2">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.id;
            const isPassed = 
              (currentStep === 'capture' && s.id === 'select-layout') ||
              (currentStep === 'customize' && (s.id === 'select-layout' || s.id === 'capture'));

            return (
              <React.Fragment key={s.id}>
                <div 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 font-semibold' 
                      : isPassed
                      ? 'bg-studio-800/80 text-studio-300'
                      : 'text-studio-500 hidden sm:flex'
                  }`}
                >
                  <span className={`text-[10px] opacity-80 font-mono-custom`}>{s.num}</span>
                  <span>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-3 h-[1px] bg-studio-800 hidden sm:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
            title={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
            className="flex items-center justify-center gap-2 min-w-10 min-h-10 px-3 rounded-lg border border-studio-800 bg-studio-900 text-studio-strong hover:bg-studio-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden lg:inline text-xs">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          {currentStep !== 'select-layout' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-studio-400 hover:text-studio-strong bg-studio-900 hover:bg-studio-800 border border-studio-800 rounded-lg transition-colors"
              title="Reset Session"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ulangi</span>
            </button>
          )}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pure Client-Side • Tanpa Iklan</span>
          </div>
        </div>
      </div>
    </header>
  );
};
