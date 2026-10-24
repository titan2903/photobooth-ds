import type { FaceDetector } from '@mediapipe/tasks-vision';
import { HeadAnchor } from '../types/photobooth';
import { faceToHead } from './headGeometry';
import simdLoader from '../../node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js?url';
import simdBinary from '../../node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.wasm?url';
import plainLoader from '../../node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_nosimd_internal.js?url';
import plainBinary from '../../node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_nosimd_internal.wasm?url';

let detectorPromise: Promise<FaceDetector> | undefined;
export function getHeadDetector() {
  if (!detectorPromise) detectorPromise = (async () => {
    const {FaceDetector, FilesetResolver} = await import('@mediapipe/tasks-vision');
    const simd = await FilesetResolver.isSimdSupported();
    return FaceDetector.createFromOptions({wasmLoaderPath:simd ? simdLoader : plainLoader,wasmBinaryPath:simd ? simdBinary : plainBinary},{
      baseOptions:{modelAssetPath:`${import.meta.env.BASE_URL}models/blaze_face_short_range.tflite`,delegate:'CPU'},
      runningMode:'IMAGE',minDetectionConfidence:.55,
    });
  })().catch(error=>{detectorPromise=undefined;throw error;});
  return detectorPromise;
}

export function detectHeads(detector: FaceDetector, source: HTMLCanvasElement | HTMLImageElement): HeadAnchor[] {
  return detector.detect(source).detections.flatMap(face=>face.boundingBox ? [faceToHead(face.boundingBox,face.keypoints,source.width,source.height)] : []).slice(0,4);
}

const photoCache = new Map<string, Promise<HeadAnchor[]>>();
export function detectPhotoHeads(url:string,image:HTMLImageElement):Promise<HeadAnchor[]> {
  const cached=photoCache.get(url);
  if(cached)return cached;
  const task=getHeadDetector().then(detector=>detectHeads(detector,image)).catch(error=>{photoCache.delete(url);throw error;});
  photoCache.set(url,task);
  if(photoCache.size>16)photoCache.delete(photoCache.keys().next().value!);
  return task;
}
