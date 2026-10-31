import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {getFrameGeometry,getFrameCanvasSize,getArtworkSlices}=await server.ssrLoadModule('/src/utils/frameArtwork.ts');
const {FRAME_THEMES}=await server.ssrLoadModule('/src/config/themes.ts');
const {LAYOUTS}=await server.ssrLoadModule('/src/config/layouts.ts');
const theme=FRAME_THEMES.find(t=>t.id==='cross-the-world');
const art=theme.artwork;

for(const id of ['strip-2','strip-3','strip-4']) test(`${id}: header, photos and footer (with logo) all fit, nothing stretched`,()=>{
  const layout=LAYOUTS[id];
  const size=getFrameCanvasSize(layout,theme);
  const scale=size.width/art.width;
  const slices=getArtworkSlices(layout,art);
  // Footer is copied whole and ends at the canvas bottom, so the logo is never cut.
  const footer=slices[2];
  assert.equal(footer.sy,art.footerTop);
  assert.equal(footer.sh,art.height-art.footerTop);
  assert.ok(Math.abs(footer.dy+footer.dh-size.height)<1);
  // Middle crop stays inside the sky band.
  assert.ok(slices[1].sy>=art.headerBottom&&slices[1].sy+slices[1].sh<=art.footerTop+1e-9);
  const {windows}=getFrameGeometry(layout,theme);
  assert.equal(windows.length,layout.photoCount);
  for(const w of windows){
    assert.ok(w.y>=slices[1].dy&&w.y+w.height<=footer.dy+1e-9,'photo inside the sky slice');
    assert.ok(Math.abs(w.width/w.height-art.photo.width/art.photo.height)<1e-9,'photo keeps design ratio');
    assert.ok(Math.abs(w.width-art.photo.width*scale)<1e-9);
  }
});

test('image frame falls back to a plain frame on other layouts',()=>{
  const layout=LAYOUTS['grid-4'];
  assert.deepEqual(getFrameCanvasSize(layout,theme),{width:layout.canvasWidth,height:layout.canvasHeight});
  assert.equal(getFrameGeometry(layout,theme).windows[0].x,layout.borderWidth);
});
