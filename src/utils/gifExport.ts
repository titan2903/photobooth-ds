import { preparePhotoStripRenderer, RenderStripOptions } from './canvasRenderer';

export type GifMode = 'poses' | 'effects';
export interface GifExportOptions {
  mode:GifMode;
  speed:number;
  signal:AbortSignal;
  onProgress:(progress:number)=>void;
}

export function getGifFramePlan(photoCount:number,mode:GifMode,speed:number) {
  if(!photoCount)throw new Error('Ambil foto terlebih dahulu.');
  if(!Number.isFinite(speed)||speed<=0)throw new Error('Kecepatan GIF tidak valid.');
  return mode==='poses' ? Array.from({length:photoCount},(_,index)=>({rotation:index,offset:0,delay:800/speed})) : Array.from({length:24},(_,index)=>({rotation:0,offset:index/10,delay:100/speed}));
}

export async function exportPhotoGif(options:RenderStripOptions,settings:GifExportOptions):Promise<Blob> {
  const {signal,onProgress}=settings;
  signal.throwIfAborted();
  const plan=getGifFramePlan(options.photos.length,settings.mode,settings.speed);
  const now=new Date();
  const snapshot={...options,photos:options.photos.map(photo=>({...photo,animation:{...photo.animation}})),dateStr:now.toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}),timeStr:now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})};
  const worker=new Worker(new URL('./gif.worker.ts',import.meta.url),{type:'module'});
  let pending:{resolve:(data:{type:string;bytes?:Uint8Array})=>void;reject:(error:Error)=>void}|undefined;
  let workerError:Error|undefined;
  worker.onmessage=event=>{
    const data=event.data;
    if(data.type==='error'){workerError=new Error(data.message);pending?.reject(workerError);}
    else pending?.resolve(data);
    pending=undefined;
  };
  worker.onerror=event=>{workerError=new Error(event.message||'Encoder GIF gagal dimuat.');pending?.reject(workerError);pending=undefined;};
  const abort=()=>{pending?.reject(new DOMException('Ekspor dibatalkan.','AbortError'));pending=undefined;worker.terminate();};
  signal.addEventListener('abort',abort,{once:true});
  const send=(message:unknown,transfer:Transferable[]=[])=>new Promise<{type:string;bytes?:Uint8Array}>((resolve,reject)=>{
    if(signal.aborted)return reject(new DOMException('Ekspor dibatalkan.','AbortError'));
    if(workerError)return reject(workerError);
    pending={resolve,reject};
    worker.postMessage(message,transfer);
  });
  try{
    await document.fonts.ready;
    const render=await preparePhotoStripRenderer(snapshot);
    const output=document.createElement('canvas');
    const scale=Math.min(1,800/Math.max(options.layout.canvasWidth,options.layout.canvasHeight));
    output.width=Math.max(1,Math.round(options.layout.canvasWidth*scale));
    output.height=Math.max(1,Math.round(options.layout.canvasHeight*scale));
    const ctx=output.getContext('2d',{willReadFrequently:true});
    if(!ctx)throw new Error('Browser tidak mendukung ekspor gambar.');
    for(let index=0;index<plan.length;index++){
      signal.throwIfAborted();
      const frame=plan[index];
      const photos=[...snapshot.photos.slice(frame.rotation),...snapshot.photos.slice(0,frame.rotation)];
      const canvas=await render(photos,frame.offset);
      signal.throwIfAborted();
      ctx.fillStyle=snapshot.theme.bgValue;
      ctx.fillRect(0,0,output.width,output.height);
      ctx.drawImage(canvas,0,0,output.width,output.height);
      const rgba=ctx.getImageData(0,0,output.width,output.height).data;
      await send({type:'frame',rgba:rgba.buffer,width:output.width,height:output.height,delay:frame.delay},[rgba.buffer]);
      onProgress(Math.round((index+1)/plan.length*95));
    }
    const result=await send({type:'finish'});
    signal.throwIfAborted();
    if(!result.bytes)throw new Error('GIF tidak berhasil dibuat.');
    onProgress(100);
    return new Blob([new Uint8Array(result.bytes)],{type:'image/gif'});
  }finally{
    signal.removeEventListener('abort',abort);
    worker.terminate();
  }
}
