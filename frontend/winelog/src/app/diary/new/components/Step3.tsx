'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { WineFormData } from '@/lib/types/diary';

interface Step3Props {
  wineData: WineFormData;
  onUpdate: (data: Partial<WineFormData>) => void;
}

export default function Step3({ wineData, onUpdate }: Step3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('카메라를 시작할 수 없습니다:', err);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !isCameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      onUpdate({ thumbnailImage: imageDataUrl });

      // Stop the camera after capturing
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        setIsCameraReady(false);
      }
    }
  };

  const handleRetake = () => {
    onUpdate({ thumbnailImage: null });
    startCamera();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white relative">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
            {wineData.thumbnailImage ? (
              <Image
                src={wineData.thumbnailImage}
                alt="Captured wine"
                fill
                className="object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-4 px-4 border-t">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200"
            onClick={() => { }}
          >
            <Image src="/images/samples/sample_image.jpg" alt="Gallery" width={24} height={24} />
          </button>

          {wineData.thumbnailImage ? (
            <button
              onClick={handleRetake}
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center text-white">
                재촬영
              </div>
            </button>
          ) : (
            <button
              onClick={handleCapture}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
              disabled={!isCameraReady}
            >
              <div className="w-14 h-14 border-2 border-white rounded-full"></div>
            </button>
          )}

          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200"
            onClick={() => { }}
          >
            <Image src="/window.svg" alt="Rotate" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
