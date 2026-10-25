export const MIN_CAMERA_ZOOM = 1;
export const MAX_CAMERA_ZOOM = 3;
export const CAMERA_ZOOM_STEP = 0.1;

export function clampCameraZoom(value:number):number {
  return Number.isFinite(value) ? Math.round(Math.min(MAX_CAMERA_ZOOM,Math.max(MIN_CAMERA_ZOOM,value))*10)/10 : MIN_CAMERA_ZOOM;
}

/** The same centered crop is used for preview projection and captured pixels. */
export function getCoverCrop(sourceWidth:number,sourceHeight:number,width:number,height:number,zoom=1) {
  if(![sourceWidth,sourceHeight,width,height].every(value=>Number.isFinite(value)&&value>0))return null;
  const scale=Math.max(width/sourceWidth,height/sourceHeight)*clampCameraZoom(zoom);
  const cropWidth=width/scale;
  const cropHeight=height/scale;
  return {x:(sourceWidth-cropWidth)/2,y:(sourceHeight-cropHeight)/2,width:cropWidth,height:cropHeight,scale};
}
