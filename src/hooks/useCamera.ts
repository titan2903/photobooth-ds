import { useState, useEffect, useRef, useCallback } from 'react';
import { drawImageCover } from '../utils/canvasRenderer';
import { clampCameraZoom } from '../utils/cameraZoom';

export interface UseCameraOptions {
  idealWidth?: number;
  idealHeight?: number;
}

export function useCamera(options: UseCameraOptions = {}) {
  const { idealWidth = 1280, idealHeight = 720 } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const zoomRef=useRef(1);
  const [zoom,setZoomState]=useState(1);
  const setZoom=useCallback((value:number)=>{
    const next=clampCameraZoom(value);
    zoomRef.current=next;
    setZoomState(next);
  },[]);

  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // List available video devices
  const refreshDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch {
      // Permission might not be granted yet
    }
  }, [selectedDeviceId]);

  // Stop current stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, []);

  // Start stream with selected device
  const startStream = useCallback(async (deviceId?: string) => {
    stopStream();
    setError(null);
    setZoom(1);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: idealWidth },
          height: { ideal: idealHeight },
          facingMode: deviceId ? undefined : 'user',
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsReady(true);
          }).catch((err) => {
            console.error('Video play error:', err);
          });
        };
      }

      await refreshDevices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to access camera.';
      setError(message);
      setIsReady(false);
    }
  }, [idealWidth, idealHeight, stopStream, refreshDevices, setZoom]);

  // Capture the full camera frame (only zoom crops it); the print layout crops once to its photo window.
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !isReady || !video.videoWidth || !video.videoHeight) return null;
    const targetWidth = video.videoWidth;
    const targetHeight = video.videoHeight;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    drawImageCover(ctx, video, 0, 0, targetWidth, targetHeight, isMirrored, zoomRef.current);
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isReady, isMirrored]);

  // Auto clean-up
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    zoom,
    setZoom,
    isReady,
    error,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isMirrored,
    setIsMirrored,
    startStream,
    stopStream,
    captureFrame,
  };
}
