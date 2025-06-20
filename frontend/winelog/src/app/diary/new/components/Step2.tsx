import { WineFormData } from '@/lib/types/diary';
import { useEffect } from 'react';

interface Step2Props {
  wineData: WineFormData;
  onUpdate: (data: Partial<WineFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2({ wineData, onUpdate }: Step2Props) {
  // 컴포넌트가 렌더링될 때마다 wineData 확인
  console.log('Step2 렌더링 - wineData:', wineData);
  console.log('Step2 렌더링 - analysisResult:', wineData.analysisResult);
  console.log('Step2 렌더링 - grape:', wineData.grape);
  console.log('Step2 렌더링 - origin:', wineData.origin);

  // AI 분석 결과가 있으면 자동으로 폼에 채우기
  useEffect(() => {
    console.log('useEffect 실행 - analysisResult:', wineData.analysisResult);
    console.log('useEffect 실행 - 현재 name:', wineData.name);
    console.log('useEffect 실행 - 현재 grape:', wineData.grape);
    console.log('useEffect 실행 - 현재 origin:', wineData.origin);

    // AI 분석 결과가 있고, 아직 폼이 비어있을 때만 채우기
    if (wineData.analysisResult && !wineData.name && !wineData.grape && !wineData.origin) {
      console.log('AI 분석 결과로 폼 채우기 시작');
      const updateData = {
        name: wineData.analysisResult.name || '',
        grape: wineData.analysisResult.grape || '',
        origin: wineData.analysisResult.origin || '',
        year: wineData.analysisResult.year || '',
        type: (wineData.analysisResult.type === 'red' || wineData.analysisResult.type === 'white')
          ? wineData.analysisResult.type
          : '' as 'red' | 'white' | '',
        description: wineData.analysisResult.description || ''
      };
      console.log('업데이트할 데이터:', updateData);
      onUpdate(updateData);
    }
  }, [wineData.analysisResult, wineData.name, wineData.grape, wineData.origin, onUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('입력 변경:', name, '=', value);
    onUpdate({ [name]: value });
  };

  return (
    <main className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">와인 정보 입력 (2/6)</h1>
        <p className="text-gray-600 mt-2">와인의 기본 정보를 입력해주세요.</p>
      </div>

      {/* AI 분석 결과 표시 */}
      {wineData.analysisResult && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">🤖</span>
            <h3 className="text-sm font-medium text-blue-800">AI 분석 결과를 자동으로 채웠습니다</h3>
          </div>
          <p className="text-xs text-blue-600">필요시 아래에서 수정하실 수 있습니다.</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6 space-y-6 shadow-sm">
        {/* 와인 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            와인 이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={wineData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
            placeholder="와인 이름을 입력하세요"
          />
        </div>

        {/* 원산지 */}
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
            원산지
          </label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={wineData.origin}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
            placeholder="원산지를 입력하세요"
          />
        </div>

        {/* 품종 */}
        <div>
          <label htmlFor="grape" className="block text-sm font-medium text-gray-700 mb-2">
            품종
          </label>
          <input
            type="text"
            id="grape"
            name="grape"
            value={wineData.grape}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
            placeholder="품종을 입력하세요"
          />
        </div>

        {/* 연도 */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            연도
          </label>
          <input
            type="text"
            id="year"
            name="year"
            value={wineData.year}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
            placeholder="연도를 입력하세요 (예: 2020)"
          />
        </div>

        {/* 와인 타입 */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            와인 타입
          </label>
          <select
            id="type"
            name="type"
            value={wineData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
          >
            <option value="">선택해주세요</option>
            <option value="red">레드 와인</option>
            <option value="white">화이트 와인</option>
          </select>
        </div>
      </div>
    </main>
  );
}
