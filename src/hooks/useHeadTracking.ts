import { RefObject, useEffect, useState } from 'react';
import { HeadAnchor } from '../types/photobooth';

export function useHeadTracking(videoRef:RefObject<HTMLVideoElement>,enabled:boolean) {
  const [heads,setHeads]=useState<HeadAnchor[]>([]);
  const [status,setStatus]=useState<'loading'|'searching'|'tracking'|'error'>('loading');
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    if(!enabled){setHeads([]);return;}
    let disposed=false;
    let timer:number|undefined;
    setStatus('loading');
    setHeads([]);
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    let lastTime=-1;
    let misses=0;
    const start=async()=>{
      try {
        const {getHeadDetector,detectHeads}=await import('../utils/headTracking');
        const detector=await getHeadDetector();
        if(disposed)return;
        setStatus('searching');
        const tick=()=>{
          if(disposed)return;
          try {
            const video=videoRef.current;
            if(ctx && video && video.readyState>=2 && video.videoWidth && video.currentTime!==lastTime && !document.hidden){
              lastTime=video.currentTime;
              canvas.width=320;canvas.height=Math.round(320*video.videoHeight/video.videoWidth);
              ctx.drawImage(video,0,0,canvas.width,canvas.height);
              const found=detectHeads(detector,canvas);
              if(found.length){misses=0;setHeads(found);setStatus('tracking');}
              else if(++misses>=3){setHeads([]);setStatus('searching');}
            }
            timer=window.setTimeout(tick,100);
          } catch {setHeads([]);setStatus('error');}
        };
        tick();
      } catch {if(!disposed){setHeads([]);setStatus('error');}}
    };
    start();
    return()=>{disposed=true;if(timer!==undefined)clearTimeout(timer);};
  },[enabled,videoRef,retry]);
  return {heads,status,retry:()=>setRetry(value=>value+1)};
}
