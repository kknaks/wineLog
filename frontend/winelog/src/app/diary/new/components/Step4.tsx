import { useState } from 'react';

const PAIRING_OPTIONS = [
  '소고기', '돼지고기', '양고기', '닭고기', '오리고기',
  '생선회', '해산물', '조개류', '치즈', '샐러드',
  '파스타', '피자', '디저트', '과일', '초콜릿',
  '한식', '중식', '일식', '양식', '기타'
];

interface Step4Props {
  wineData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4({ wineData, onUpdate, onNext, onPrev }: Step4Props) {
  const [customPairing, setCustomPairing] = useState('');

  const pairings = wineData.pairings || [];

  const handlePairingToggle = (pairing: string) => {
    const newPairings = pairings.includes(pairing)
      ? pairings.filter((p: string) => p !== pairing)
      : [...pairings, pairing];

    onUpdate({
      pairings: newPairings
    });
  };

  const handleAddCustomPairing = () => {
    if (!customPairing.trim()) return;

    onUpdate({
      pairings: [...pairings, customPairing.trim()]
    });
    setCustomPairing('');
  };

  const handleRemovePairing = (pairing: string) => {
    onUpdate({
      pairings: pairings.filter((p: string) => p !== pairing)
    });
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">와인 정보 입력 (4/6)</h1>
        <p className="text-gray-600 mt-2">와인과 어울리는 음식을 선택해주세요.</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Pairing Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">추천 페어링</h3>
          <div className="flex flex-wrap gap-2">
            {PAIRING_OPTIONS.map((pairing) => (
              <button
                key={pairing}
                onClick={() => handlePairingToggle(pairing)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${pairings.includes(pairing)
                  ? 'bg-wine-dark text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {pairing}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Pairing Input */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">직접 입력</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPairing}
              onChange={(e) => setCustomPairing(e.target.value)}
              placeholder="페어링할 음식을 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
            />
            <button
              onClick={handleAddCustomPairing}
              disabled={!customPairing.trim()}
              className={`px-4 py-2 rounded-lg transition-colors ${customPairing.trim()
                ? 'bg-wine-dark text-white hover:bg-wine-hover'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              추가
            </button>
          </div>
        </div>

        {/* Selected Pairings */}
        {pairings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">선택된 페어링</h3>
            <div className="flex flex-wrap gap-2">
              {pairings.map((pairing: string) => (
                <div
                  key={pairing}
                  className="px-4 py-2 bg-wine-dark text-white rounded-full flex items-center gap-2"
                >
                  <span>{pairing}</span>
                  <button
                    onClick={() => handleRemovePairing(pairing)}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 