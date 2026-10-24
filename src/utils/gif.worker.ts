import { createGifStream } from './gifEncoding';

const encoder=createGifStream();
const scope=self as unknown as {postMessage:(message:unknown,transfer?:Transferable[])=>void};
self.onmessage=(event:MessageEvent<{type:'frame';rgba:ArrayBuffer;width:number;height:number;delay:number}|{type:'finish'}>)=>{
  try{
    const message=event.data;
    if(message.type==='frame'){
      encoder.addFrame(new Uint8Array(message.rgba),message.width,message.height,message.delay);
      scope.postMessage({type:'ready'});
    }else{
      const bytes=encoder.finish();
      scope.postMessage({type:'done',bytes},[bytes.buffer as ArrayBuffer]);
    }
  }catch(error){scope.postMessage({type:'error',message:error instanceof Error ? error.message : 'GIF gagal dibuat.'});}
};
