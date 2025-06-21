interface Step6Props {
  wineData: any;
  onUpdate: (data: any) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function Step6({ wineData, onUpdate, onSave, isSaving }: Step6Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = wineData.price && wineData.purchaseLocation && wineData.drinkDate;

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">와인 정보 입력 (6/6)</h1>
        <p className="text-gray-600 mt-2">와인 구매 정보를 입력해주세요.</p>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            구매 가격
          </label>
          <div className="relative">
            <input
              type="text"
              name="price"
              value={wineData.price || ''}
              onChange={handleInputChange}
              placeholder="예) 35000"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₩</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            구매처
          </label>
          <input
            type="text"
            name="purchaseLocation"
            value={wineData.purchaseLocation || ''}
            onChange={handleInputChange}
            placeholder="예) 와인샵 이름, 온라인몰 등"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시음 날짜
          </label>
          <input
            type="date"
            name="drinkDate"
            value={wineData.drinkDate || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onSave}
            disabled={!isFormValid || isSaving}
            className={`px-12 py-3 rounded-full text-lg font-semibold transition-colors ${!isFormValid || isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-wine-dark text-white hover:bg-wine-hover shadow-lg'
              }`}
          >
            {isSaving ? '저장 중...' : '🍷 와인 일기 저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
} 