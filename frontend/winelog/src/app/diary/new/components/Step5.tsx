import type { WineAnalysis } from '@/lib/types/diary';

interface Step5Props {
  wineData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5({ wineData, onUpdate, onNext, onPrev }: Step5Props) {
  const handleRatingChange = (value: number) => {
    onUpdate({
      rating: value
    });
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      review: e.target.value
    });
  };

  return (
    <main className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">와인 정보 입력 (5/6)</h1>
        <p className="text-gray-600 mt-2">와인에 대한 평가를 입력해주세요.</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Rating */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">평점</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-colors ${wineData.rating === rating
                  ? 'bg-wine-dark text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            1: 별로예요 / 2: 그저 그래요 / 3: 괜찮아요 / 4: 맛있어요 / 5: 최고예요
          </p>
        </div>

        {/* Review */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">리뷰</h3>
          <textarea
            value={wineData.review || ''}
            onChange={handleReviewChange}
            rows={6}
            placeholder="와인에 대한 전반적인 평가와 감상을 자유롭게 작성해주세요."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
          />
        </div>
      </div>
    </main>
  );
} 