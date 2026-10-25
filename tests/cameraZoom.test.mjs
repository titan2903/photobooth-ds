import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {clampCameraZoom,getCoverCrop}=await server.ssrLoadModule('/src/utils/cameraZoom.ts');
const {projectHeadAnchors}=await server.ssrLoadModule('/src/utils/headGeometry.ts');
const {drawImageCover}=await server.ssrLoadModule('/src/utils/canvasRenderer.ts');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('zoom limits, steps, and invalid values are safe',()=>{
  assert.equal(clampCameraZoom(.5),1);assert.equal(clampCameraZoom(9),3);
  assert.equal(clampCameraZoom(1.2000000001),1.2);
  assert.equal(clampCameraZoom(NaN),1);assert.equal(clampCameraZoom(Infinity),1);
});

test('zoom crops the center while preserving the photo aspect ratio',()=>{
  const original=getCoverCrop(1280,960,1000,1250,1);
  const zoomed=getCoverCrop(1280,960,1000,1250,2);
  near(original.width,768);near(original.height,960);
  near(zoomed.width,384);near(zoomed.height,480);
  near(zoomed.x+zoomed.width/2,640);near(zoomed.y+zoomed.height/2,480);
  near(zoomed.width/zoomed.height,1000/1250);
});

test('face and eye positions use exactly the same zoomed crop as captured pixels',()=>{
  const head={x:.6,y:.4,width:.2,angle:12,eyes:{x:.6,y:.5},nose:{x:.6,y:.6},mouth:{x:.6,y:.7}};
  const crop=getCoverCrop(1280,960,1000,1250,2);
  const projected=projectHeadAnchors([head],1280,960,1000,1250,false,2)[0];
  near(projected.x,(head.x*1280-crop.x)/crop.width);
  near(projected.y,(head.y*960-crop.y)/crop.height);
  near(projected.width,head.width*1280/crop.width);
  near(projected.eyes.y,(head.eyes.y*960-crop.y)/crop.height);
  const mirrored=projectHeadAnchors([head],1280,960,1000,1250,true,2)[0];
  near(mirrored.x,1-projected.x);near(mirrored.eyes.x,1-projected.eyes.x);
  near(mirrored.angle,-12);
});

test('pixel capture applies zoom together with mirror',()=>{
  const previous=globalThis.HTMLVideoElement;
  class Video {videoWidth=1280;videoHeight=960;}
  globalThis.HTMLVideoElement=Video;
  try{
    const calls=[];
    const ctx=new Proxy({}, {get:(_,method)=>(...args)=>calls.push([method,...args])});
    const video=new Video();
    drawImageCover(ctx,video,0,0,1000,1250,true,2);
    assert.deepEqual(calls.find(call=>call[0]==='scale'),['scale',-1,1]);
    const draw=calls.find(call=>call[0]==='drawImage');
    assert.deepEqual(draw.slice(2),[448,240,384,480,0,0,1000,1250]);
  }finally{globalThis.HTMLVideoElement=previous;}
});

test('invalid camera dimensions cannot produce a crop or face positions',()=>{
  assert.equal(getCoverCrop(0,960,1000,1250,2),null);
  assert.equal(getCoverCrop(NaN,960,1000,1250,2),null);
  assert.deepEqual(projectHeadAnchors([{x:.5,y:.5,width:.2,angle:0}],0,960,1000,1250,false,2),[]);
});
