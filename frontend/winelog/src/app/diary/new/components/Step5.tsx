'use client';

import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useState } from 'react';

interface Step5Props {
  diaryData: DiaryFormData;
  onUpdateDiary: (data: Partial<DiaryFormData>) => void;
  onUpdateWine: (wineData: Partial<WineData>) => void;
}

export default function Step5({ diaryData, onUpdateDiary, onUpdateWine }: Step5Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleRatingChange = (value: number) => {
    onUpdateDiary({ rating: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateDiary({ price: e.target.value });
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateDiary({ review: e.target.value });
  };

  const handlePublicChange = (checked: boolean) => {
    onUpdateDiary({ isPublic: checked });
  };

  const handleTooltipClick = () => {
    setShowTooltip(!showTooltip);
  };

  const handleDownloadImage = async () => {
    if (!diaryData.downloadImage || isDownloading) return;

    setIsDownloading(true);

    try {
      // 짧은 딜레이를 추가해서 UX 개선
      await new Promise(resolve => setTimeout(resolve, 300));

      const link = document.createElement('a');
      link.href = diaryData.downloadImage;
      link.download = `wine-card-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
    } finally {
      // 1초 후에 다시 활성화 (디바운싱)
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white">
      {/* Generated Wine Card Image */}
      <div className="px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 font-rhodium-libre mb-2">Image</h2>
          <button
            onClick={handleDownloadImage}
            disabled={!diaryData.downloadImage || isDownloading}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
      <div className="relative w-64 aspect-[3/4] mx-auto mb-4">
        {(diaryData.downloadImage || diaryData.thumbnailImage) && (
          <Image
            src={diaryData.downloadImage || ''}
            alt="Wine"
            fill
            className="object-contain rounded-lg"
          />
        )}
      </div>

      {/* Rating */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-900 font-rhodium-libre">Rate This Wine</h2>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={diaryData.isPublic || false}
              onCheckedChange={handlePublicChange}
            />
            <span className="text-sm text-gray-700">전체공개</span>
            <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleTooltipClick}
                  className="cursor-pointer"
                >
                  <Image
                    src="/images/diary/information.svg"
                    alt="Information"
                    width={20}
                    height={20}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-64">
                <p className="text-xs">
                  전체공개 시, 와인의 정보·가격·평점만 노출됩니다. 작성한 다이어리는 공개되지 않으니 안심하세요.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-between mb-6 px-15">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className="p-1"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.1625 3.38755L18.3625 7.78755C18.6625 8.40005 19.4625 8.98755 20.1375 9.10005L24.125 9.76255C26.675 10.1875 27.275 12.0375 25.4375 13.8625L22.3375 16.9625C21.8125 17.4875 21.525 18.5 21.6875 19.225L22.575 23.0625C23.275 26.1 21.6625 27.275 18.975 25.6875L15.2375 23.475C14.5625 23.075 13.45 23.075 12.7625 23.475L9.02498 25.6875C6.34998 27.275 4.72498 26.0875 5.42498 23.0625L6.31248 19.225C6.47498 18.5 6.18748 17.4875 5.66248 16.9625L2.56248 13.8625C0.737478 12.0375 1.32498 10.1875 3.87498 9.76255L7.86248 9.10005C8.52498 8.98755 9.32498 8.40005 9.62498 7.78755L11.825 3.38755C13.025 1.00005 14.975 1.00005 16.1625 3.38755Z"
                  fill={star <= (diaryData.rating || 0) ? "#171717" : "none"}
                  stroke="#171717"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="mb-4">
          <h3 className="text-lg font-rhodium-libre font-medium text-gray-900 mb-2">Price</h3>
          <Input
            type="text"
            value={diaryData.price || ''}
            onChange={handlePriceChange}
            placeholder="Enter price"
          />
        </div>

        {/* Diary */}
        <div className="mb-4">
          <h2 className="text-lg font-rhodium-libre font-medium text-gray-900 mb-2">Diary</h2>
          <Textarea
            value={diaryData.review || ''}
            onChange={handleReviewChange}
            rows={4}
            className="resize-none h-24 overflow-y-auto"
            placeholder="Write your thoughts..."
          />
        </div>
      </div>
    </div>
  );
} 