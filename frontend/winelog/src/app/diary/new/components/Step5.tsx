'use client';

import { WineFormData } from '@/lib/types/diary';
import Image from 'next/image';

interface Step5Props {
  wineData: WineFormData;
  onUpdate: (data: Partial<WineFormData>) => void;
}

export default function Step5({ wineData, onUpdate }: Step5Props) {
  const handleRatingChange = (value: number) => {
    onUpdate({ rating: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ price: e.target.value });
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ review: e.target.value });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white">
      {/* Thumbnail Image */}
      <div className="relative w-full aspect-square mb-4">
        {wineData.thumbnailImage && (
          <Image
            src={wineData.thumbnailImage}
            alt="Wine"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Rating */}
      <div className="px-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Rate This Wine</h3>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className="text-2xl"
            >
              {star <= (wineData.rating || 0) ? '★' : '☆'}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Price</h3>
          <input
            type="text"
            value={wineData.price || ''}
            onChange={handlePriceChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            placeholder="Enter price"
          />
        </div>

        {/* Diary */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Diary</h3>
          <textarea
            value={wineData.review || ''}
            onChange={handleReviewChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
            placeholder="Write your thoughts..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-auto px-6 pb-6">
        <button className="w-full bg-black text-white py-3 rounded-lg font-medium">
          SAVE
        </button>
      </div>
    </div>
  );
} 