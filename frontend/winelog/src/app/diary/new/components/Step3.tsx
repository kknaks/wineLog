const AROMA_OPTIONS = [
  '꽃향', '과일향', '베리향', '시트러스향', '허브향', '스파이시향',
  '나무향', '흙향', '가죽향', '커피향', '초콜릿향', '바닐라향',
  '견과류향', '버터향', '꿀향', '카라멜향', '토스트향', '연기향'
];

interface TasteData {
  sweetness: number;
  acidity: number;
  tannin: number;
  body: number;
  alcohol: number;
}

interface Step3Props {
  wineData: {
    taste?: TasteData;
    aroma?: string[];
  };
  onUpdate: (data: { taste?: TasteData; aroma?: string[] }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3({ wineData, onUpdate }: Step3Props) {
  const handleTasteChange = (name: string, value: number) => {
    onUpdate({
      taste: {
        ...wineData.taste,
        [name]: value
      }
    });
  };

  const handleAromaToggle = (aroma: string) => {
    const currentAroma = wineData.aroma || [];
    const newAroma = currentAroma.includes(aroma)
      ? currentAroma.filter((a: string) => a !== aroma)
      : [...currentAroma, aroma];

    onUpdate({
      aroma: newAroma
    });
  };

  // 기본값 설정
  const taste = wineData.taste || {
    sweetness: 0,
    acidity: 0,
    tannin: 0,
    body: 0,
    alcohol: 0
  };

  const aroma = wineData.aroma || [];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">와인 정보 입력 (3/6)</h1>
        <p className="text-gray-600 mt-2">와인의 맛과 향을 평가해주세요.</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Taste Sliders */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">맛 평가</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              당도 (Sweetness)
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={taste.sweetness}
              onChange={(e) => handleTasteChange('sweetness', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Dry</span>
              <span>Sweet</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              산도 (Acidity)
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={taste.acidity}
              onChange={(e) => handleTasteChange('acidity', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Soft</span>
              <span>Crisp</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              탄닌 (Tannin)
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={taste.tannin}
              onChange={(e) => handleTasteChange('tannin', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Smooth</span>
              <span>Firm</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              바디감 (Body)
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={taste.body}
              onChange={(e) => handleTasteChange('body', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Light</span>
              <span>Full</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              알코올 (Alcohol)
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={taste.alcohol}
              onChange={(e) => handleTasteChange('alcohol', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Aroma Selection */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">향 선택</h3>
          <div className="flex flex-wrap gap-2">
            {AROMA_OPTIONS.map((aromaOption) => (
              <button
                key={aromaOption}
                onClick={() => handleAromaToggle(aromaOption)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${aroma.includes(aromaOption)
                  ? 'bg-wine-dark text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {aromaOption}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrev}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            이전
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-wine-dark text-white rounded-full hover:bg-wine-hover transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
} 