import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {planA4Sheet,A4,SHEET_COPIES}=await server.ssrLoadModule('/src/utils/printSheet.ts');

const insideA4=(plan,margin)=>plan.items.every(i=>i.x>=margin-1e-9&&i.y>=margin-1e-9&&i.x+i.width<=A4.width-margin+1e-9&&i.y+i.height<=A4.height-margin+1e-9);
const noOverlap=plan=>plan.items.every((a,i)=>plan.items.every((b,j)=>i===j||a.x+a.width<=b.x+1e-9||b.x+b.width<=a.x+1e-9||a.y+a.height<=b.y+1e-9||b.y+b.height<=a.y+1e-9));
const keepsRatio=(plan,w,h)=>plan.items.every(i=>Math.abs(i.width/i.height-(i.rotated?h/w:w/h))<1e-9);
// Strips (4-cut plain, Cross The World 2/3/4) and cards (2x2 grid, big strip, wide strip).
const SHAPES=[[624,1800],[624,1878],[592,1457],[592,1132],[800,1000],[1200,1800],[1800,1200]];

test('every option gives exactly that many copies, inside A4, unstretched, not overlapping',()=>{
  assert.deepEqual([...SHEET_COPIES],[2,4,5,6,8]);
  for(const [w,h] of SHAPES) for(const copies of SHEET_COPIES) for(const borderless of [true,false]){
    const plan=planA4Sheet(w,h,copies,borderless);
    const where=`${w}x${h} x${copies} borderless=${borderless}`;
    assert.equal(plan.items.length,copies,where);
    assert.ok(insideA4(plan,borderless?0:5),where);
    assert.ok(noOverlap(plan),where);
    assert.ok(keepsRatio(plan,w,h),where);
  }
});

test('4-cut strip picks the arrangement that makes each copy biggest',()=>{
  const plan=n=>planA4Sheet(624,1800,n,false);
  const long=p=>Math.max(p.items[0].width,p.items[0].height);
  // 2: two tall upright strips, nearly page height.
  assert.ok(!plan(2).items[0].rotated&&long(plan(2))>280);
  // 4 and 5: stacked sideways in one column (5 = the event's Canva layout).
  for(const n of [4,5]){ assert.ok(plan(n).items.every(i=>i.rotated)); assert.equal(new Set(plan(n).items.map(i=>i.x)).size,1); }
  // 6 and 8: upright grid, about the classic 2x6" strip length.
  for(const n of [6,8]){ assert.ok(plan(n).items.every(i=>!i.rotated)); assert.ok(long(plan(n))>135); }
});

test('cut lines run along every copy edge',()=>{
  const plan=planA4Sheet(624,1800,8,true);
  const on=(lines,v)=>lines.some(l=>Math.abs(l-v)<1e-9);
  for(const i of plan.items){
    assert.ok(on(plan.cutsX,i.x)&&on(plan.cutsX,i.x+i.width));
    assert.ok(on(plan.cutsY,i.y)&&on(plan.cutsY,i.y+i.height));
  }
});
