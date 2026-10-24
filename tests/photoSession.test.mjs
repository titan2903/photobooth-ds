import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// This pure module has no runtime imports; use the existing TypeScript compiler.
const source = await readFile(new URL('../src/utils/photoSession.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
const { createCapturedPhoto, updatePhotoEffects, rotatePhotos } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const effects = { id: 'hearts', intensity: 1, speed: 1 };
const capture = (filter, time = 1) => createCapturedPhoto('data:image/jpeg;base64,raw', filter, effects, time);

test('taking a later pose with another filter preserves the first pose', () => {
  const settings = { ...effects };
  const first = createCapturedPhoto('first-photo', 'bw', settings, 1.25);
  settings.id = 'confetti';
  settings.intensity = 0.5;
  const second = createCapturedPhoto('second-photo', 'warm', settings, 2.5);
  assert.equal(first.filter, 'bw');
  assert.equal(first.animation.id, 'hearts');
  assert.equal(first.animation.intensity, 1);
  assert.equal(first.animationTime, 1.25);
  assert.equal(second.filter, 'warm');
  assert.equal(second.animation.id, 'confetti');
  assert.notEqual(first.id, second.id);
});

test('editing a chosen photo leaves other photos and source pixels intact', () => {
  const photos = [capture('bw'), capture('warm')];
  const changed = updatePhotoEffects(photos, photos[1].id, { filter: 'sepia' });
  assert.equal(changed[0], photos[0]);
  assert.equal(changed[1].filter, 'sepia');
  assert.equal(photos[1].filter, 'warm');
  assert.equal(changed[1].dataUrl, photos[1].dataUrl);
  assert.deepEqual(changed[1].animation, photos[1].animation);
});

test('editing face effects preserves the selected photo color filter', () => {
  const photos = [capture('bw'), capture('warm')];
  const selected = { id: 'head-mustache', intensity: 0.8, speed: 1 };
  const changed = updatePhotoEffects(photos, photos[0].id, { animation: selected });
  selected.id = 'head-beard';
  assert.equal(changed[0].animation.id, 'head-mustache');
  assert.equal(changed[0].filter, 'bw');
  assert.equal(changed[1].animation.id, 'hearts');
});

test('reordering keeps the filter, effect, and timestamp attached to each photo', () => {
  const photos = [capture('bw', 1), capture('warm', 2), capture('normal', 3)];
  const reordered = rotatePhotos(photos);
  assert.deepEqual(reordered.map(photo => [photo.id, photo.filter, photo.animationTime]), [
    [photos[1].id, 'warm', 2], [photos[2].id, 'normal', 3], [photos[0].id, 'bw', 1],
  ]);
  assert.equal(photos[0].filter, 'bw');
});

test('retaking a pose replaces its settings without changing retained poses', () => {
  const photos = [capture('bw', 1), capture('warm', 2)];
  const retaken = [...photos.slice(0, -1), capture('infrared', 3)];
  assert.equal(retaken[0], photos[0]);
  assert.equal(retaken[1].filter, 'infrared');
  assert.equal(retaken[1].animationTime, 3);
});

test('empty and single-photo sessions can be reordered safely', () => {
  assert.deepEqual(rotatePhotos([]), []);
  const photos = [capture('bw')];
  assert.deepEqual(rotatePhotos(photos), photos);
});


test('PNG renderer uses each pose filter, animation, and timestamp after reordering', async () => {
  const { createServer } = await import('vite');
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false, watch: null }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
  const previous = { Image: globalThis.Image, HTMLVideoElement: globalThis.HTMLVideoElement, document: globalThis.document };
  class TestImage {
    width = 1000; height = 1250;
    set src(value) { this.value = value; queueMicrotask(() => this.onload()); }
  }
  class TestCanvas {
    width = 0; height = 0; draws = [];
    getContext() {
      const state = { filter: 'none' };
      return new Proxy(state, {
        get: (target, method) => method in target ? target[method] : (...args) => {
          if (method === 'drawImage') this.draws.push({ image: args[0], filter: target.filter });
        },
        set: (target, key, value) => { target[key] = value; return true; },
      });
    }
  }
  try {
    globalThis.Image = TestImage;
    globalThis.HTMLVideoElement = class {};
    globalThis.document = { createElement: () => new TestCanvas() };
    const { renderPhotoStrip } = await server.ssrLoadModule('/src/utils/canvasRenderer.ts');
    const { LAYOUTS } = await server.ssrLoadModule('/src/config/layouts.ts');
    const { FILTERS } = await server.ssrLoadModule('/src/config/filters.ts');
    const { createAnimationArtwork } = await server.ssrLoadModule('/src/utils/animatedEffects.ts');
    for (const layout of Object.values(LAYOUTS)) {
      const filters = ['bw', 'warm', 'normal'];
      const animations = ['none', 'hearts', 'confetti'];
      const photos = Array.from({ length: layout.photoCount }, (_, index) => createCapturedPhoto(
        `pose-${index}`, filters[index % 3], { id: animations[index % 3], intensity: 1, speed: 1 }, index + 0.25,
      ));
      for (const ordered of [photos, rotatePhotos(photos)]) {
        const canvas = await renderPhotoStrip({ layout, theme: { id: 'test', tier: 'standard', bgValue: '#fff', textColor: '#000' }, photos: ordered, caption: 'TEST', showDate: false, showTime: false });
        const rendered = canvas.draws.filter(draw => draw.image instanceof TestCanvas);
        assert.equal(rendered.length, layout.photoCount);
        rendered.forEach((draw, index) => {
          const photo = ordered[index];
          const photoCanvas = draw.image;
          assert.equal(photoCanvas.draws[0].image.value, photo.dataUrl);
          assert.equal(photoCanvas.draws[0].filter, FILTERS[photo.filter].cssFilter);
          assert.equal(photoCanvas.draws.length, photo.animation.id === 'none' ? 1 : 2);
          if (photo.animation.id !== 'none') {
            const artwork = decodeURIComponent(photoCanvas.draws[1].image.value.split(',')[1]);
            assert.equal(artwork, createAnimationArtwork(photo.animation, photoCanvas.width, photoCanvas.height, photo.animationTime));
          }
        });
      }
    }
  } finally {
    Object.assign(globalThis, previous);
    await server.close();
  }
});
