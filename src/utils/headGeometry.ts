import { HeadAnchor } from '../types/photobooth';

/** Apply the same centered object-cover crop used by the camera and photo renderer. */
export function projectHeadAnchors(heads: HeadAnchor[], sourceWidth: number, sourceHeight: number, width: number, height: number, mirrored = false): HeadAnchor[] {
  if (Math.min(sourceWidth,sourceHeight,width,height) <= 0) return [];
  const scale = Math.max(width/sourceWidth,height/sourceHeight);
  const offsetX = (sourceWidth*scale-width)/2;
  const offsetY = (sourceHeight*scale-height)/2;
  return heads.map(head => {
    const x = (head.x*sourceWidth*scale-offsetX)/width;
    return { x: mirrored ? 1-x : x, y: (head.y*sourceHeight*scale-offsetY)/height, width: head.width*sourceWidth*scale/width, angle: mirrored ? -head.angle : head.angle };
  }).filter(head => Number.isFinite(head.x+head.y+head.width+head.angle) && head.width > 0 && head.x > -.3 && head.x < 1.3);
}

export function faceToHead(box: {originX:number;originY:number;width:number;height:number}, points: {x:number;y:number}[], width:number,height:number): HeadAnchor {
  const eyes = points.slice(0,2).sort((a,b)=>a.x-b.x);
  const angle = eyes.length===2 ? Math.atan2((eyes[1].y-eyes[0].y)*height,(eyes[1].x-eyes[0].x)*width)*180/Math.PI : 0;
  return {x:(box.originX+box.width/2)/width,y:(box.originY-box.height*.25)/height,width:box.width/width,angle:Math.max(-40,Math.min(40,angle))};
}
