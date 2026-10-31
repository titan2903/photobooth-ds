import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {planA4Sheet,A4}=await server.ssrLoadModule('/src/utils/printSheet.ts');

const insideA4=(plan,margin)=>plan.items.every(i=>i.x>=margin-1e-9&&i.y>=margin-1e-9&&i.x+i.width<=A4.width-margin+1e-9&&i.y+i.height<=A4.height-margin+1e-9);
const noOverlap=plan=>plan.items.every((a,i)=>plan.items.every((b,j)=>i===j||a.x+a.width<=b.x+1e-9||b.x+b.width<=a.x+1e-9||a.y+a.height<=b.y+1e-9||b.y+b.height<=a.y+1e-9));

test('design mode stacks 5 rotated 4-cut strips like the event layout',()=>{
  for(const borderless of [true,false]){
    const plan=planA4Sheet(624,1800,'design',borderless);
    assert.equal(plan.items.length,5);
    assert.ok(plan.items.every(i=>i.rotated));
    assert.ok(Math.abs(plan.items[0].width/plan.items[0].height-1800/624)<1e-9,'keeps strip ratio');
    assert.ok(insideA4(plan,borderless?0:5)&&noOverlap(plan));
  }
});

test('save mode fits 8 strips or 4 cards per A4 without overlap',()=>{
  assert.equal(planA4Sheet(624,1800,'save',true).items.length,8);
  const borderlessStrip=planA4Sheet(624,1800,'save',true).items[0];
  assert.ok(borderlessStrip.height>145,'near classic 2x6" strip size');
  for(const [w,h] of [[624,1800],[800,1000],[1800,1200],[592,960]]) for(const borderless of [true,false]){
    const plan=planA4Sheet(w,h,'save',borderless);
    assert.equal(plan.items.length,h/w>2?8:4);
    assert.ok(insideA4(plan,borderless?0:5)&&noOverlap(plan),`${w}x${h}`);
    assert.ok(plan.items.every(i=>Math.abs(i.width/i.height-(i.rotated?h/w:w/h))<1e-9),'keeps photo ratio');
  }
});

test('landscape cards are turned to fill portrait A6 cells',()=>{
  const card=planA4Sheet(1800,1200,'save',false).items[0];
  assert.ok(card.rotated);
  assert.ok(card.height>140,`wide strip prints ${card.width}x${card.height}mm`);
});

test('design mode keeps full strip length and fits as many copies as A4 allows',()=>{
  // Cross The World strips: 3 photos 592x1457, 2 photos 592x1132 (wider than a classic strip).
  for(const [w,h,copies] of [[592,1457,4],[592,1132,3]]){
    const plan=planA4Sheet(w,h,'design',false);
    assert.equal(plan.items.length,copies,`${w}x${h}`);
    assert.ok(plan.items.every(i=>i.rotated&&Math.abs(i.width-148.5)<1e-9));
    assert.ok(insideA4(plan,5)&&noOverlap(plan));
  }
});

