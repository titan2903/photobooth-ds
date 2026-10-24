# Photobooth Studio (Modern Rebuild)

[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Netlify Status](https://img.shields.io/badge/Netlify-Ready-00C7B7.svg)](https://www.netlify.com/)

A modern, ad-free, 100% client-side photobooth studio web application inspired by Korean self-photo studios (인생네컷). Built from the ground up using **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

---

## Key Features

### 1. Photo Strip & Grid Layouts
- **Classic 4-Cut:** Signature vertical photo strip with 4 poses (`624 x 1800 px`).
- **Trio Strip:** Balanced 3-frame vertical strip for close-up portraits (`592 x 1352 px`).
- **Duo Mini:** 2-frame minimal vertical strip (`592 x 960 px`).
- **2x2 Studio Grid:** 4-panel postcard layout (`800 x 1000 px`).
- **Big Strip (6-Grid):** 6-pose double-column vertical strip for groups (`1200 x 1800 px`).
- **Wide Strip (4-Horizontal):** Landscape widescreen format for friends & couples (`1800 x 1200 px`).

### 2. AR Head & Facial Tracking (Interactive Accessories)
Real-time face & head detection directly in the browser viewfinder:
- **Headwear:** Royal Crown, Angel Halo, Love Crown, Butterfly Halo, Kitty Ears, Bunny Ears, Classic Fedora, Cowboy Hat.
- **Eyewear:** Round Glasses, Cool Shades, Heart Glasses, Cyber Visor, Pirate Eyepatch.
- **Facial Accents & Stickers:** Rosy Cheeks Blush, Sun Freckles, Clown Nose, Kitty Face Whiskers, Star Cheeks.
- **Facial Hair:** Classic Mustache, Thin Pencil Mustache, Full Beard, Goatee.
- **Ambient Floating Particles:** Love Float (drifting hearts), Golden Sparkle, Party Confetti, Dream Bubbles, Sakura Breeze, Snow Globe, Meteor Shower, Neon Orbit.

### 3. 20+ Aesthetic Color & Art Filters
- **Natural:** Natural (clean), Golden Hour (warm sunlight), Ice Blue (crisp cool), Color Pop (vibrant saturation).
- **Monochrome:** Classic B&W (sharp contrast), High Noir (dramatic shadows), Soft Mono (delicate tones), Silver Screen (textured 35mm monochrome).
- **Vintage & Film:** Sepia Nostalgia, Analog Film Grain (with procedural dust & scratches), Faded Sunday, Honey Film, Instant 90s.
- **Portrait:** Porcelain (soft glow), Rosy Blush, Peach Glow, Lavender Haze.
- **Creative:** Y2K CRT Scanlines, Teal & Orange, Sunset Pop, Infrared Dream.

### 4. Designer Vector Frame Themes
12 unique thematic vector artworks that automatically adapt to your chosen layout dimensions:
- **Ribbon Diary:** Romantic satin bows, lace borders, and pastel pink textures.
- **After Hours:** Futuristic Y2K metallic chrome, planetary orbits, and sparkle stars.
- **Flower Market:** Botanical garden daisies and vintage floral borders.
- **The Editorial:** High-fashion magazine cover typography and clean framing.
- **Weekend Notes:** Scrapbook journal paper, washi tape, and hand-drawn doodles.
- **Checkmate Club:** Retro cobalt checkerboard and playful club emblems.
- **Airmail Memories:** Vintage postmark stamps, airmail stripes, and postal badges.
- **Midnight Wishes:** Crescent moon, golden celestial constellations, and night sky.
- **Cinema Club:** 35mm film reel sprockets, frame numbers, and movie clapperboard style.
- **Ocean Postcards:** Coastal sea waves, pastel water droplets, and seashell accents.
- **Party Parade:** Celebratory ribbons, confetti bursts, and festive streamers.
- **Gallery No. 01:** Contemporary art museum exhibition layout.
- *Plus Solid Color Palettes & Free Hex Color Picker for unlimited custom styles.*

### 5. WebRTC Camera Studio Experience
- **Device Management:** Switch between front-facing and rear cameras.
- **Mirror Mode:** Instant horizontal flip (`scaleX(-1)`) toggle.
- **Synthesized Audio Effects:** Realistic mechanical camera shutter clicks and countdown beeps generated natively via Web Audio API (zero audio file downloads required).
- **Interactive Shutter:** Configurable countdown timer (3s or 5s) with screen flash pulse.
- **Pose Queue:** Live thumbnail strip on the side with individual single-photo retake or full session reset.
- **Theme Mode:** Integrated Dark / Light mode toggle for the studio interface.

### 6. High-Precision Canvas Rendering & Export
- **Exact Pixel Geometry:** Pixel-perfect calculations for margins, padding, and photo spacing.
- **Customizable Badges:** Edit custom caption headlines (e.g. `BESTIES • 2026`) and toggle date/time stamps.
- **Photo Reorder:** 1-click photo order shuffle and rotation.
- **Multi-Format Export:**
  - High-resolution lossless **PNG download**.
  - Direct **Copy to Clipboard** (`image/png`).
  - **1-Click Print Layout** formatted for standard photo paper.
  - Celebratory confetti particle explosion on download!
- **100% Client-Side Privacy:** All video streams and images are processed strictly in local browser memory. No photos are ever uploaded or transmitted to any server.

---

## Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/) (Sub-second HMR & instant production builds)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visuals:** HTML5 2D Canvas API + SVG Vector Artwork Engine
- **Audio:** Web Audio API (Synthesized Oscillators & White Noise Burst)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 20 & 26)
- npm 9+

### 1. Installation
```bash
git clone https://github.com/titan/photoboth-ds.git
cd photoboth-ds
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Production Build
```bash
npm run build
```
The optimized static production files will be output to the `dist/` folder.

---

## Deployment (Netlify)

This project includes [`netlify.toml`](./netlify.toml) configured for zero-setup deployment.

### Automatic Deployment via GitHub
1. Push your repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
3. Select your GitHub repository. Netlify will auto-detect settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Click **Deploy**. Any future `git push` will automatically trigger a new deployment.

### Manual Drag & Drop
1. Run `npm run build`.
2. Drag and drop the `dist/` directory into [app.netlify.com/drop](https://app.netlify.com/drop).

---

## Architecture & Reverse Engineering
This clean-room rebuild was engineered using the **REA (*Reverse Engineer Anything*)** framework to study layout formulas, canvas shaders, and user flows from early photobooth prototypes. All third-party trackers, ad scripts, and proprietary assets were completely purged.

For architectural details, mathematical canvas formulas, and reverse engineering documentation, refer to [`REVERSE_ENGINEERING_REPORT.md`](./REVERSE_ENGINEERING_REPORT.md).

---

## License

Distributed under the [MIT License](LICENSE).
Copyright (c) 2026 titan.
