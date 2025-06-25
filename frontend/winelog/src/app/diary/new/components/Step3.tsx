'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';
import { takeWinePhoto, pickWinePhoto, isNativeApp, triggerHaptic } from '@/lib/utils/mobile';
import { ImpactStyle } from '@capacitor/haptics';

interface Step3Props {
  diaryData: DiaryFormData;
  onUpdateDiary: (data: Partial<DiaryFormData>) => void;
  onUpdateWine: (wineData: Partial<WineData>) => void;
}

export default function Step3({ diaryData, onUpdateDiary, onUpdateWine }: Step3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // 후면 카메라가 기본

  useEffect(() => {
    // 네이티브 앱인지 확인
    setIsNative(isNativeApp());

    // 모든 플랫폼에서 카메라 스트림 시작
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]); // facingMode가 변경될 때마다 카메라 재시작

  const startCamera = async () => {
    try {
      // 기존 스트림이 있으면 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        setIsCameraReady(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          aspectRatio: { ideal: 16 / 9 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('카메라를 시작할 수 없습니다:', err);

      // 고해상도 실패 시 기본 설정으로 재시도
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          streamRef.current = fallbackStream;
          setIsCameraReady(true);
        }
      } catch (fallbackErr) {
        console.error('기본 카메라 설정도 실패:', fallbackErr);
      }
    }
  };

  // 웹용 캡처 함수
  const handleWebCapture = () => {
    if (!videoRef.current || !isCameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0);
      // 고화질 JPEG로 저장 (품질 0.95)
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);

      // File 객체로도 변환
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `thumbnail-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onUpdateDiary({ thumbnailImage: imageDataUrl, thumbnailImageFile: file });
        }
      }, 'image/jpeg', 0.95);

      // Stop the camera after capturing
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        setIsCameraReady(false);
      }
    }
  };

  // 모바일용 촬영 함수 - 웹 캡처 방식 사용
  const handleMobileCapture = async () => {
    if (isNative) {
      await triggerHaptic(ImpactStyle.Medium);
    }

    // 모든 플랫폼에서 웹캠 스트림 캡처 방식 사용
    handleWebCapture();
  };

  // 갤러리에서 선택
  const handlePickFromGallery = async () => {
    if (isNative) {
      await triggerHaptic(ImpactStyle.Light);
      try {
        const photoUrl = await pickWinePhoto();
        if (photoUrl) {
          onUpdateDiary({ thumbnailImage: photoUrl });
        } else {
          console.log('사진 선택이 취소되었습니다.');
        }
      } catch (error) {
        // 사용자 취소는 정상 동작이므로 에러로 처리하지 않음
        if (error instanceof Error && error.message && error.message.includes('cancelled')) {
          console.log('사용자가 갤러리 선택을 취소했습니다.');
          return;
        }

        console.error('갤러리 접근 중 오류 발생:', error);
        alert('갤러리에 접근할 수 없습니다. 설정에서 사진 라이브러리 권한을 확인해주세요.');
      }
    } else {
      // 웹에서는 파일 input 사용
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              onUpdateDiary({
                thumbnailImage: reader.result as string,
                thumbnailImageFile: file
              });
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleRetake = async () => {
    if (isNative) {
      await triggerHaptic(ImpactStyle.Light);
    }
    onUpdateDiary({ thumbnailImage: null });

    // 모든 플랫폼에서 카메라 재시작
    startCamera();
  };

  // 카메라 전/후면 전환
  const handleCameraFlip = async () => {
    if (isNative) {
      await triggerHaptic(ImpactStyle.Light);
    }

    // 전면/후면 카메라 전환
    setFacingMode(prevMode => prevMode === 'environment' ? 'user' : 'environment');
    console.log('카메라 전환:', facingMode === 'environment' ? '전면으로' : '후면으로');
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
              // 모든 플랫폼에서 비디오 스트림 표시
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
          {/* 갤러리/파일 선택 버튼 */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            onClick={handlePickFromGallery}
          >
            <Image
              src="/images/diary/gallery.svg"
              alt="Gallery"
              width={24}
              height={24}
            />
          </button>

          {/* 메인 촬영/재촬영 버튼 */}
          {diaryData.thumbnailImage ? (
            <button
              onClick={handleRetake}
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center text-white text-sm">
                재촬영
              </div>
            </button>
          ) : (
            <button
              onClick={isNative ? handleMobileCapture : handleWebCapture}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              disabled={!isCameraReady}
            >
              <div className="w-14 h-14 border-2 border-white rounded-full"></div>
            </button>
          )}

          {/* 카메라 전환/설정 버튼 */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            onClick={handleCameraFlip}
          >
            <Image
              src="/images/diary/switch.svg"
              alt="Switch Camera"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* 플랫폼 정보 (개발용) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          플랫폼: {isNative ? '모바일 앱' : '웹 브라우저'}
        </div>
      )}
    </main>
  );
}