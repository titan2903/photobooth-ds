import React, { useEffect, useState } from 'react';
import { AnimationSettings, HeadAnchor } from '../types/photobooth';
import { AnimatedOverlay } from './AnimatedOverlay';
import { isHeadAnimation } from '../config/animations';

export const HeadPhotoOverlay: React.FC<{photo:string;settings:AnimationSettings;time:number}> = ({photo,settings,time}) => {
  const [detected,setDetected]=useState<{heads:HeadAnchor[];width:number;height:number}>({heads:[],width:1,height:1});
  const isHead=isHeadAnimation(settings.id);
  useEffect(()=>{
    if(!isHead)return;
    let cancelled=false;
    setDetected({heads:[],width:1,height:1});
    const image=new Image();
    image.onload=async()=>{
      try {
        const {detectPhotoHeads}=await import('../utils/headTracking');
        const heads=await detectPhotoHeads(photo,image);
        if(!cancelled)setDetected({heads,width:image.width,height:image.height});
      }catch { /* The live tracker displays loading failures and retry controls. */ }
    };
    image.src=photo;
    return()=>{cancelled=true;image.onload=null;};
  },[photo,isHead]);
  return <AnimatedOverlay settings={settings} time={time} heads={isHead ? detected.heads : undefined} sourceWidth={detected.width} sourceHeight={detected.height} />;
};
