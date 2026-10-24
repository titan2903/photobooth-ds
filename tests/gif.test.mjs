import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server=await createServer({configFile:false,ssr:{noExternal:['gifenc']},server:{middlewareMode:true,hmr:false,ws:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {createGifStream}=await server.ssrLoadModule('/src/utils/gifEncoding.ts');
const {getGifFramePlan,exportPhotoGif}=await server.ssrLoadModule('/src/utils/gifExport.ts');

function inspectGif(bytes){
  const width=bytes[6]|bytes[7]<<8, height=bytes[8]|bytes[9]<<8;
  let cursor=13+((bytes[10]&128)?3*2**((bytes[10]&7)+1):0);
  const delays=[];let frames=0,loop;
  const skipBlocks=()=>{while(bytes[cursor]){cursor+=1+bytes[cursor];}cursor++;};
  while(cursor<bytes.length && bytes[cursor]!==0x3b){
    const marker=bytes[cursor++];
    if(marker===0x21){
      const label=bytes[cursor++];
      if(label===0xf9)delays.push((bytes[cursor+2]|bytes[cursor+3]<<8)*10);
      if(label===0xff && new TextDecoder().decode(bytes.slice(cursor+1,cursor+12))==='NETSCAPE2.0')loop=bytes[cursor+14]|bytes[cursor+15]<<8;
      skipBlocks();
    }else if(marker===0x2c){
      const packed=bytes[cursor+8];cursor+=9;
      if(packed&128)cursor+=3*2**((packed&7)+1);
      cursor++;skipBlocks();frames++;
    }else throw new Error('Invalid GIF block');
  }
  assert.equal(bytes[cursor],0x3b);
  return {width,height,frames,delays,loop};
}
const rgba=(r,g,b)=>new Uint8Array(Array.from({length:16*12},()=>[r,g,b,255]).flat());

test('encodes a real looping GIF with two full frames and correct delays',()=>{
  const stream=createGifStream();
  stream.addFrame(rgba(255,0,0),16,12,400);
  stream.addFrame(rgba(0,0,255),16,12,800);
  const bytes=stream.finish();
  assert.equal(new TextDecoder().decode(bytes.slice(0,6)),'GIF89a');
  assert.deepEqual(inspectGif(bytes),{width:16,height:12,frames:2,delays:[400,800],loop:0});
});

test('rejects empty GIFs, invalid RGBA, and mismatched frame sizes',()=>{
  const stream=createGifStream();
  assert.throws(()=>stream.finish());
  assert.throws(()=>stream.addFrame(new Uint8Array(2),16,12,100));
  stream.addFrame(rgba(1,2,3),16,12,100);
  assert.throws(()=>stream.addFrame(new Uint8Array(4),1,1,100));
});

test('pose sequence respects photo order and playback speed',()=>{
  assert.deepEqual(getGifFramePlan(3,'poses',2),[
    {rotation:0,offset:0,delay:400},{rotation:1,offset:0,delay:400},{rotation:2,offset:0,delay:400},
  ]);
});

test('effect sequence advances time while keeping each pose in its slot',()=>{
  const plan=getGifFramePlan(4,'effects',1);
  assert.equal(plan.length,24);
  assert.ok(plan.every(frame=>frame.rotation===0 && frame.delay===100));
  assert.equal(plan[0].offset,0);assert.equal(plan.at(-1).offset,2.3);
});

test('invalid export input is rejected',()=>{
  assert.throws(()=>getGifFramePlan(0,'poses',1));
  assert.throws(()=>getGifFramePlan(3,'poses',0));
});

test('cancellation stops export before starting rendering or encoding',async()=>{
  const controller=new AbortController();controller.abort();
  await assert.rejects(()=>exportPhotoGif({}, {mode:'poses',speed:1,signal:controller.signal,onProgress:()=>assert.fail('Progress after cancellation')}),{name:'AbortError'});
});
