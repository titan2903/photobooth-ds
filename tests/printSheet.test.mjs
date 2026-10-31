import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {planA4Sheet,getSheetOptions,MIN_COVERAGE,A4,SHEET_COPIES}=await server.ssrLoadModule('/src/utils/printSheet.ts');

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

test('neighbouring copies share one cut line, and every copy edge has one',()=>{
  const plan=planA4Sheet(624,1800,8,true);
  assert.equal(plan.cutsX.length,5); assert.equal(plan.cutsY.length,3);
  const on=(lines,v)=>lines.some(l=>Math.abs(l-v)<1e-9);
  for(const i of plan.items){
    assert.ok(on(plan.cutsX,i.x)&&on(plan.cutsX,i.x+i.width));
    assert.ok(on(plan.cutsY,i.y)&&on(plan.cutsY,i.y+i.height));
  }
});

test('only options that fill enough paper are offered, and the fullest one is recommended',()=>{
  for(const [w,h] of SHAPES) for(const borderless of [true,false]){
    const options=getSheetOptions(w,h,borderless);
    const where=`${w}x${h} borderless=${borderless}`;
    const recommended=options.filter(o=>o.recommended);
    assert.equal(recommended.length,1,where);
    const all=SHEET_COPIES.map(n=>{const i=planA4Sheet(w,h,n,borderless).items[0];return n*i.width*i.height/(A4.width*A4.height);});
    assert.ok(recommended[0].coverage>=Math.max(...all)-0.02-1e-9,where);
    assert.ok(options.every(o=>o.recommended||o.coverage>=MIN_COVERAGE),where);
  }
  // Classic 4-Cut: 2 and 8 fill the sheet equally, so 8 copies is recommended.
  assert.equal(getSheetOptions(624,1800,false).find(o=>o.recommended).copies,8);
  // Single column of 5 wastes most of the sheet for Duo Mini and cards, so it is not offered.
  for(const [w,h] of [[592,960],[800,1000],[1200,1800]]) assert.ok(!getSheetOptions(w,h,false).some(o=>o.copies===5),`${w}x${h}`);
});
