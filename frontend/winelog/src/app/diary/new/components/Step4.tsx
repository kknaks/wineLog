'use client';

import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { domToPng } from 'modern-screenshot';

interface Step4Props {
  diaryData: DiaryFormData;
  onUpdateDiary: (data: Partial<DiaryFormData>) => void;
  onUpdateWine: (wineData: Partial<WineData>) => void;
}

type LayoutTemplate = 'left-bottom-right-top' | 'right-bottom-left-top' | 'left-top-right-bottom' | 'right-top-left-bottom';

export default function Step4({ diaryData, onUpdateDiary, onUpdateWine }: Step4Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>('left-bottom-right-top');
  const previewRef = useRef<HTMLDivElement>(null);

  const generateDownloadImage = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await domToPng(previewRef.current, {
        scale: 2, // 고해상도
        quality: 1,
        backgroundColor: '#ffffff',
      });

      // downloadImage에 저장
      onUpdateDiary({ downloadImage: dataUrl });
    } catch (error) {
      console.error('이미지 생성 중 오류 발생:', error);
    }
  };

  // 프리뷰가 변경될 때마다 downloadImage 생성
  useEffect(() => {
    const timer = setTimeout(() => {
      generateDownloadImage();
    }, 500); // 디바운스 - 변경 후 0.5초 뒤에 실행

    return () => clearTimeout(timer);
  }, [selectedTemplate, diaryData.thumbnailImage, diaryData.wineData.name, diaryData.createdAt, diaryData.wineData.sweetness, diaryData.wineData.acidity, diaryData.wineData.tannin, diaryData.wineData.body]);

  const renderTasteInfo = () => (
    <div className="space-y-1.5">
      {/* BODY */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium w-12 font-rhodium-libre">BODY</span>
        <div className="flex-1 mx-2 relative">
          <div className="h-0.5 bg-white rounded-full"></div>
          {/* 눈금 표시 */}
          <div className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((tick) => (
              <div
                key={tick}
                className="absolute w-px h-2 bg-white top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${((tick - 1) / 4) * 100}%` }}
              />
            ))}
          </div>
          <div
            className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${((diaryData.wineData.body - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* TANNIN */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium w-12 font-rhodium-libre">TANNIN</span>
        <div className="flex-1 mx-2 relative">
          <div className="h-0.5 bg-white rounded-full"></div>
          {/* 눈금 표시 */}
          <div className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((tick) => (
              <div
                key={tick}
                className="absolute w-px h-2 bg-white top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${((tick - 1) / 4) * 100}%` }}
              />
            ))}
          </div>
          <div
            className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${((diaryData.wineData.tannin - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ACIDITY */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium w-12 font-rhodium-libre">ACIDITY</span>
        <div className="flex-1 mx-2 relative">
          <div className="h-0.5 bg-white rounded-full"></div>
          {/* 눈금 표시 */}
          <div className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((tick) => (
              <div
                key={tick}
                className="absolute w-px h-2 bg-white top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${((tick - 1) / 4) * 100}%` }}
              />
            ))}
          </div>
          <div
            className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${((diaryData.wineData.acidity - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* SWEETNESS */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium w-12 font-rhodium-libre">SWEET</span>
        <div className="flex-1 mx-2 relative">
          <div className="h-0.5 bg-white rounded-full"></div>
          {/* 눈금 표시 */}
          <div className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((tick) => (
              <div
                key={tick}
                className="absolute w-px h-2 bg-white top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${((tick - 1) / 4) * 100}%` }}
              />
            ))}
          </div>
          <div
            className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${((diaryData.wineData.sweetness - 1) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col px-6 pt-0 pb-6">
      {/* Preview */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 font-rhodium-libre">Preview</h2>

        <div ref={previewRef} className="relative aspect-[3/4] max-w-sm mx-auto rounded-lg overflow-hidden">
          {/* Wine Image */}
          {diaryData.thumbnailImage && (
            <Image
              src={diaryData.thumbnailImage}
              alt="Wine"
              fill
              className="object-cover brightness-[0.85]"
            />
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 p-4 text-white">
            {/* 날짜 표시 */}
            <div
              className={`absolute ${selectedTemplate === 'left-bottom-right-top' || selectedTemplate === 'left-top-right-bottom'
                ? 'left-4' : 'right-4'
                } ${selectedTemplate === 'left-top-right-bottom' || selectedTemplate === 'right-top-left-bottom'
                  ? 'top-4' : 'bottom-4'
                }`}
            >
              <div className="rounded-lg px-2 py-1 text-white text-xs ">
                {diaryData.createdAt ? diaryData.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              </div>
            </div>

            {/* 바텀 섹션 */}
            <div
              className={`absolute w-2/3 ${selectedTemplate === 'left-bottom-right-top' || selectedTemplate === 'left-top-right-bottom'
                ? 'right-4' : 'left-4'
                } ${selectedTemplate === 'left-bottom-right-top' || selectedTemplate === 'right-bottom-left-top'
                  ? 'top-4' : 'bottom-4'
                }`}
            >
              <div className="rounded-lg p-2">
                {/* Wine Name */}
                <div className="text-center mb-2">
                  <h3 className="text-base font-medium text-white font-rhodium-libre">
                    {diaryData.wineData.name || 'Wine Name'}
                  </h3>
                </div>

                {renderTasteInfo()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 font-rhodium-libre">Layout</h2>

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {/* 1. 날짜 왼쪽아래, 바텀섹션 오른쪽 위 */}
          <button
            onClick={() => setSelectedTemplate('left-bottom-right-top')}
            className={`w-20 h-20 border-2 rounded-lg relative p-2 ${selectedTemplate === 'left-bottom-right-top' ? 'border-black bg-gray-300' : 'border-gray-300'
              }`}
          >
            <div className="absolute top-2 right-2 w-8 h-6 bg-gray-400 rounded text-xs"></div>
            <div className="absolute bottom-2 left-2 w-4 h-3 bg-gray-600 rounded text-xs"></div>
          </button>

          {/* 2. 날짜 오른쪽아래, 바텀섹션 왼쪽 위 */}
          <button
            onClick={() => setSelectedTemplate('right-bottom-left-top')}
            className={`w-20 h-20 border-2 rounded-lg relative p-2 ${selectedTemplate === 'right-bottom-left-top' ? 'border-black bg-gray-300' : 'border-gray-300'
              }`}
          >
            <div className="absolute top-2 left-2 w-8 h-6 bg-gray-400 rounded text-xs"></div>
            <div className="absolute bottom-2 right-2 w-4 h-3 bg-gray-600 rounded text-xs"></div>
          </button>

          {/* 3. 날짜 왼쪽 위, 바텀섹션 오른쪽 아래 */}
          <button
            onClick={() => setSelectedTemplate('left-top-right-bottom')}
            className={`w-20 h-20 border-2 rounded-lg relative p-2 ${selectedTemplate === 'left-top-right-bottom' ? 'border-black bg-gray-300' : 'border-gray-300'
              }`}
          >
            <div className="absolute bottom-2 right-2 w-8 h-6 bg-gray-400 rounded text-xs"></div>
            <div className="absolute top-2 left-2 w-4 h-3 bg-gray-600 rounded text-xs"></div>
          </button>

          {/* 4. 날짜 오른쪽 위, 바텀섹션 왼쪽 아래 */}
          <button
            onClick={() => setSelectedTemplate('right-top-left-bottom')}
            className={`w-20 h-20 border-2 rounded-lg relative p-2 ${selectedTemplate === 'right-top-left-bottom' ? 'border-black bg-gray-300' : 'border-gray-300'
              }`}
          >
            <div className="absolute bottom-2 left-2 w-8 h-6 bg-gray-400 rounded text-xs"></div>
            <div className="absolute top-2 right-2 w-4 h-3 bg-gray-600 rounded text-xs"></div>
          </button>
        </div>
      </div>
    </main>
  );
} 