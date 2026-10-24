import type { AnimationSettings, CapturedPhoto, FilterId } from '../types/photobooth';

/** Snapshot the settings, keeping raw pixels available for later per-photo edits. */
export function createCapturedPhoto(dataUrl:string,filter:FilterId,animation:AnimationSettings,animationTime:number):CapturedPhoto {
  return {id:crypto.randomUUID(),dataUrl,timestamp:Date.now(),filter,animation:{...animation},animationTime};
}

export function updatePhotoEffects(photos:CapturedPhoto[],id:string,patch:{filter?:FilterId;animation?:AnimationSettings}):CapturedPhoto[] {
  return photos.map(photo=>photo.id===id ? {...photo,...patch,animation:{...(patch.animation ?? photo.animation)}} : photo);
}

export function rotatePhotos(photos:CapturedPhoto[]):CapturedPhoto[] {
  return photos.length>1 ? [...photos.slice(1),photos[0]] : photos;
}
