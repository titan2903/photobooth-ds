# Modern Photobooth Implementation Plan

> **Goal:** Reconstruct the extracted photobooth application into a modern, responsive, ad-free Web App using React 19, TypeScript, Vite, and Tailwind CSS.
> **Architecture:** Pure client-side state machine with React hooks for WebRTC camera stream management, HTML5 2D Canvas rendering engine with pixel-accurate layout calculation, and high-performance image filter shaders.
> **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas API.

---

### Task 1: Scaffolding & Base Tooling
- **Files:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/index.css`, `src/main.tsx`
- Setup Vite with React + TypeScript, Tailwind CSS, and Lucide Icons.

### Task 2: Core Domain Types & Config Constants
- **Files:** `src/types/photobooth.ts`, `src/config/layouts.ts`, `src/config/filters.ts`
- Define layout specifications (dimensions, photo count, aspect ratios) and filter presets.

### Task 3: Camera Hook & Stream Service
- **Files:** `src/hooks/useCamera.ts`, `src/utils/audio.ts`
- Manage webcam lifecycle, device switching, horizontal mirror mode, countdown timer, and shutter capture to ImageData.

### Task 4: Layout Selector Component
- **Files:** `src/components/LayoutSelector.tsx`
- Interactive visual cards for selecting photo strip templates (3-strip, 4-strip, 2-vertical, 2x2 grid).

### Task 5: Capture Studio Component
- **Files:** `src/components/CaptureStudio.tsx`
- Live viewfinder with countdown overlay, flash pulse, retake option, and multi-shot queue.

### Task 6: Canvas Strip Rendering Engine
- **Files:** `src/utils/canvasRenderer.ts`, `src/hooks/useCanvasRenderer.ts`
- Implement exact coordinate and layout rendering extracted from `customize.js`:
  - 4-photo strip: 624 x 1800 px
  - 3-photo strip: 592 x 1352 px
  - Borders (30px), spacing (12px), bottom padding (100px)
  - Color filters, grain, date/time stamp, and custom branding caption.

### Task 7: Customize & Export Studio
- **Files:** `src/components/CustomizeStudio.tsx`, `src/components/ExportModal.tsx`
- Live customization controls (palette picker, date toggle, custom text) and 1-click PNG high-res download.

### Task 8: Main App Integration & Responsive Polish
- **Files:** `src/App.tsx`
- Connect state machine transitions (`select` -> `capture` -> `customize` -> `export`) with clean minimalist Korean photobooth UI design.
