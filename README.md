# Photobooth Studio (Modern Rebuild)

A high-performance, ad-free, 100% client-side photobooth web application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.
---

## Features

- **Korean Studio Style Layouts:**
  - **Classic 4-Cut:** Signature 4-frame vertical strip (`624 x 1800 px`)
  - **Trio Strip:** Balanced 3-frame vertical strip (`592 x 1352 px`)
  - **Duo Mini:** 2-frame close-up strip (`592 x 960 px`)
  - **2x2 Studio Grid:** Modern 4-panel postcard layout (`800 x 1000 px`)
- **WebRTC Camera Viewfinder:**
  - Front / Back camera device switching
  - Horizontal mirror flip (`scaleX(-1)`)
  - Synthesized Web Audio mechanical shutter clicks and countdown beeps (no external audio assets required)
  - Configurable countdown timer (3s or 5s) with live visual flash effect
  - Multi-shot queue with individual retake support
- **Procedural Canvas Shader Filters:**
  - Natural
  - Classic B&W (contrast monochrome)
  - Sepia Nostalgia
  - Golden Hour (warm retro tone)
  - High Noir (deep black & white)
  - Analog Film Grain (with procedural dust & scratches)
  - Y2K Scanlines (CRT monitor scanlines)
- **Studio Customization:**
  - Palette presets (Blush Pink, Soft Lavender, Matcha Sage, Buttercream, Matte Black, Pure White, Deep Cherry, Vintage Sky)
  - Free custom hex color picker
  - Custom strip header caption input
  - Timestamp & date stamp badges
  - One-click photo order shuffle/reorder
- **High-Res Export & Privacy:**
  - Pixel-perfect PNG download
  - Copy directly to clipboard
  - 1-click photo paper print layout
  - Confetti celebration
  - **100% Client-Side Privacy:** No photos are ever sent to any remote server.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## Reverse Engineering Documentation
See [`REVERSE_ENGINEERING_REPORT.md`](./REVERSE_ENGINEERING_REPORT.md) for detailed mathematical formulas, reverse-engineered dimensions, and file-by-file analysis of the original target app.

---

## License
Distributed under the [MIT License](LICENSE).

