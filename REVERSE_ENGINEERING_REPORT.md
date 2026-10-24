# Laporan Reverse Engineering: photobooth-io.cc

Laporan ini disusun menggunakan tools analisis REA (*Reverse Engineer Anything*) terhadap aplikasi web **https://photobooth-io.cc/**. Semua aset skrip dan halaman asli telah diunduh ke direktori [`target_app/`](./target_app/).

---

## 1. Arsitektur & Siklus Hidup Aplikasi (Lifecycle)

Aplikasi ini dibangun menggunakan arsitektur **Client-Side SPA / Multi-Page Vanilla JavaScript** yang beroperasi sepenuhnya di browser pengguna tanpa dependensi backend untuk pemrosesan gambar atau penyimpanan foto.

```mermaid
flowchart LR
    A["index.html<br/>(main.js)"] -->|"Klik Mulai"| B["chooseLayout.html<br/>(layout.js)"]
    B -->|"Pilih Grid (1, 2, 4, 6, Studio)"| C["canvas.html / canvas4.html<br/>(canvas.js)"]
    C -->|"Capture Webcam & Filter"| D["IndexedDB: PhotoboothDB<br/>(Store: images)"]
    D -->|"Selesai Ambil Foto"| E["customize.html<br/>(customize.js)"]
    E -->|"Render Strip / GIF"| F["Download / Export<br/>(PNG / GIF)"]
```

---

## 2. Rincian Modul & Komponen Kunci

### A. Navigasi & Pemilihan Layout (`layout.js`, `chooseLayout.html`)
1. **Inisialisasi Database:**
   * Membuka IndexedDB `PhotoboothDB` versi `1`.
   * Memastikan Object Store bernama `images` (`keyPath: "id", autoIncrement: true`) siap digunakan.
2. **State Reset Antar Sesi (`clearDBAndNavigate`):**
   * Sebelum berpindah ke halaman pemotretan, aplikasi mengeksekusi `store.clear()` agar foto dari sesi sebelumnya tidak bercampur.
3. **Peta Routing Layout:**
   * `#layout1Btn` $\rightarrow$ `canvas.html` (Single / 3-shot classic)
   * `#layout2Btn` $\rightarrow$ `canvas4.html` (4-grid strip)
   * `#layout3Btn` $\rightarrow$ `canvas2.html` (2-grid vertical)
   * `#layout4Btn` $\rightarrow$ `canvas6.html` (6-grid)
   * `#studioModeL5Btn` $\rightarrow$ `studio-mode.html`

---

### B. Pengambilan Foto & Pemrosesan Kamera (`canvas.js`, `canvas.html`)
1. **Manajemen Stream Kamera (`startCamera`, `stopCameraStream`):**
   * Memeriksa `navigator.mediaDevices.getUserMedia`.
   * Mendukung pemilihan perangkat input (`enumerateDevices` $\rightarrow$ `cameraOptions`).
   * Tombol Mirror / Invert: Mengubah orientasi horizontal kamera menggunakan CSS transform `scaleX(-1)`.
2. **Siklus Pemotretan (`startPhotobooth`, `showCountdown`):**
   * Menjalankan timer countdown visual di layar (3, 2, 1).
   * Animasi lampu kilat (*shutter flash*) dengan memanipulasi opasitas elemen `#flash`.
   * Mengambil cuplikan frame video langsung ke elemen `<canvas>` internal.
3. **Filter Efek Visual Realtime & Post-Capture:**
   * Filter bawaan: B&W, Sepia, Smooth, Vintage, Old Film, VHS.
   * Efek shader prosedural di atas canvas 2D:
     * `drawFilmScratches`: Garis goresan film analog acak.
     * `applyChromaticAberration`: Efek glitch warna RGB split.
     * `drawScanlines`: Efek scanline monitor tabung / CRT.
     * `applyToneCurve`: Transformasi tone warna & kontras.
     * Integrasi CamanJS (`caman.full.min.js`) sebagai mesin filter sekunder.
4. **Penyimpanan Frame Sementara:**
   * Foto disimpan ke IndexedDB `PhotoboothDB` (store `images`).
   * Menyimpan rute kembali: `sessionStorage.setItem('returnLayout', 'canvas.html')`.
   * Melakukan navigasi otomatis ke `customize.html`.

---

### C. Studio Kustomisasi & Ekspor Final (`customize.js`, `customize.html`)
1. **Layout Switcher & Photo Re-Order:**
   * Memuat modul `js/layout-switcher.js`, `js/layout-catalog.js`, dan `js/photo-reorder.js`.
   * Memungkinkan pengguna menukar urutan foto (drag/reorder) atau mengganti rasio strip tanpa mengulang pemotretan.
2. **Kalkulasi & Geometri Canvas Strip (`buildPhotoStripCanvas`):**
   * **Ukuran Strip 4-Foto:** Lebar `624 px`, Tinggi `1800 px`.
   * **Ukuran Strip 3-Foto:** Lebar `592 px`, Tinggi `1352 px`.
   * **Margin & Padding:**
     * `borderWidth = 30 px`
     * `spacing = 12 px`
     * `bottomPadding = 100 px`
   * **Rumus Posisi Gambar:**
     $$\text{availableHeight} = \text{canvasHeight} - (2 \times \text{borderWidth}) - (2 \times \text{spacing}) - \text{bottomPadding}$$
     $$\text{photoHeight} = \frac{\text{availableHeight}}{\text{imageArrayLength}}$$
     $$\text{photoWidth} = \text{canvasWidth} - (2 \times \text{borderWidth})$$
3. **Pewarnaan & Background Frame:**
   * Mendukung warna solid (menggunakan picker `vanilla-picker.min.js`) atau latar belakang motif gambar (`backgroundImage` via `drawImageCover`).
   * Stempel Waktu (Date/Time): Otomatis mendeteksi kontras warna background untuk memilih warna teks (`#ffffff` vs `#000000`).
4. **Generator Animasi GIF:**
   * Menggunakan pustaka `gif.js` untuk menggabungkan frame-frame foto menjadi animasi looping bergerak.
5. **Ekspor & Download (`downloadCanvasCopy`):**
   * Mengonversi canvas hasil tumpukan ke PNG DataURL (`stackedCanvas.toDataURL('image/png')`).
   * Menggunakan fallback Blob URL untuk kompatibilitas iOS Safari.
   * Memicu download otomatis dengan nama file default `photobooth.png`.

---

## 3. Struktur Berkas yang Telah Diunduh

```
target_app/
├── index.html                  # Landing page
├── chooseLayout.html           # Menu pilihan layout & grid
├── canvas.html                 # Studio pemotretan 1/3-foto
├── canvas2.html                # Studio pemotretan 2-foto
├── canvas4.html                # Studio pemotretan 4-foto
├── canvas6.html                # Studio pemotretan 6-foto
├── studio-mode.html            # Studio mode lanjutan
├── customize.html              # Studio editing frame, stiker & download
├── main.js                     # Handler UI global & navigasi
├── layout.js                   # State IndexedDB & routing layout
├── canvas.js                   # Engine kamera, countdown & filter
├── customize.js                # Engine kompilasi canvas strip & ekspor
├── download.js                 # Helper trigger download
└── js/
    ├── ad-gate.js
    ├── collapsible-sections.js
    ├── crop-modal.js           # Modal crop review foto
    ├── crop-preview.js         # Preview crop frame
    ├── frame-color-marker.js
    ├── layout-catalog.js       # Katalog variasi template
    ├── layout-switcher.js      # Handler pergantian layout dinamis
    ├── photo-adjust.js         # Tool zoom/pan foto di frame
    ├── photo-reorder.js        # Urutan foto
    └── studio-worker-config.js
```
