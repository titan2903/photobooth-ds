import { HeadAnchor } from '../types/photobooth';
import { getCoverCrop } from './cameraZoom';

/** Apply the same centered object-cover crop used by the camera and photo renderer. */
export function projectHeadAnchors(heads: HeadAnchor[], sourceWidth: number, sourceHeight: number, width: number, height: number, mirrored = false, zoom = 1): HeadAnchor[] {
  const crop=getCoverCrop(sourceWidth,sourceHeight,width,height,zoom);
  if(!crop)return [];
  const scale=crop.scale;
  const offsetX=crop.x*scale;
  const offsetY=crop.y*scale;
  return heads.map(head => {
    const x = (head.x*sourceWidth*scale-offsetX)/width;
    const point = (value?: {x:number;y:number}) => {
      if(!value)return undefined;
      const projectedX=(value.x*sourceWidth*scale-offsetX)/width;
      return {x:mirrored ? 1-projectedX : projectedX,y:(value.y*sourceHeight*scale-offsetY)/height};
    };
    return { x: mirrored ? 1-x : x, y: (head.y*sourceHeight*scale-offsetY)/height, width: head.width*sourceWidth*scale/width, angle: mirrored ? -head.angle : head.angle, eyes:point(head.eyes),nose:point(head.nose),mouth:point(head.mouth),chin:point(head.chin) };
  }).filter(head => Number.isFinite(head.x+head.y+head.width+head.angle) && head.width > 0 && head.x > -.3 && head.x < 1.3);
}

export function faceToHead(box: {originX:number;originY:number;width:number;height:number}, points: {x:number;y:number}[], width:number,height:number): HeadAnchor {
  const eyes = points.slice(0,2).sort((a,b)=>a.x-b.x);
  const angle = eyes.length===2 ? Math.atan2((eyes[1].y-eyes[0].y)*height,(eyes[1].x-eyes[0].x)*width)*180/Math.PI : 0;
  return {x:(box.originX+box.width/2)/width,y:(box.originY-box.height*.25)/height,width:box.width/width,angle:Math.max(-40,Math.min(40,angle)),eyes:eyes.length===2 ? {x:(eyes[0].x+eyes[1].x)/2,y:(eyes[0].y+eyes[1].y)/2} : undefined,nose:points[2],mouth:points[3],chin:{x:(box.originX+box.width/2)/width,y:(box.originY+box.height)/height}};
}
