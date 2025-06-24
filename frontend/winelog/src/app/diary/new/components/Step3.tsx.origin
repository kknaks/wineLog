'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';

interface Step3Props {
  diaryData: DiaryFormData;
  onUpdateDiary: (data: Partial<DiaryFormData>) => void;
  onUpdateWine: (wineData: Partial<WineData>) => void;
}

export default function Step3({ diaryData, onUpdateDiary, onUpdateWine }: Step3Props) {
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
      onUpdateDiary({ thumbnailImage: imageDataUrl });

      // Stop the camera after capturing
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        setIsCameraReady(false);
      }
    }
  };

  const handleRetake = () => {
    onUpdateDiary({ thumbnailImage: null });
    startCamera();
  };

  return (
    <main className="flex flex-col px-6 pt-0 pb-6">
      {/* Camera Container */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 font-rhodium-libre">Photo</h2>

        <div className="flex justify-center">
          <div className="w-full max-w-sm aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
            {diaryData.thumbnailImage ? (
              <Image
                src={diaryData.thumbnailImage}
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

      {/* Camera Controls */}
      <div className="flex justify-center">
        <div className="flex justify-between items-center w-full max-w-sm">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200"
            onClick={() => { }}
          >
            <Image src="/images/samples/sample_image.jpg" alt="Gallery" width={24} height={24} />
          </button>

          {diaryData.thumbnailImage ? (
            <button
              onClick={handleRetake}
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center text-white text-sm">
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
    </main>
  );
}
