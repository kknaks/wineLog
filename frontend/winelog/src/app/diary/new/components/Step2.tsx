import { WineFormData } from '@/lib/types/diary';
import { useState, useEffect, useRef } from 'react';

interface Step2Props {
  wineData: WineFormData;
  onUpdate: (data: Partial<WineFormData>) => void;
}

export default function Step2({ wineData, onUpdate }: Step2Props) {
  const [isSearching, setIsSearching] = useState(false);
  const hasSearchedRef = useRef(false);

  // 와인 검색
  useEffect(() => {
    const searchWineData = async () => {
      // 이미 테이스팅 노트 데이터가 있으면 리턴
      if (wineData.aromaNote || wineData.tasteNote || wineData.finishNote || wineData.taste) {
        return;
      }

      // 검색할 데이터가 없으면 리턴
      if (!wineData.name && !wineData.origin && !wineData.grape && !wineData.year && !wineData.type) {
        return;
      }

      // 이미 검색 중이면 리턴
      if (isSearching) {
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/diary/wine-taste', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: wineData.name,
            origin: wineData.origin,
            grape: wineData.grape,
            year: wineData.year,
            type: wineData.type,
          }),
        });

        if (!response.ok) {
          throw new Error('검색 중 오류가 발생했습니다');
        }

        const result = await response.json();

        // 검색 결과가 있으면 테이스팅 노트 데이터 업데이트
        if (result.taste_result?.tastingNote) {
          const tastingNote = result.taste_result.tastingNote;
          onUpdate({
            aromaNote: tastingNote.aroma || '',
            tasteNote: tastingNote.taste || '',
            finishNote: tastingNote.finish || '',
            taste: {
              sweetness: tastingNote.sweetness || 1,
              acidity: tastingNote.acidity || 1,
              tannin: tastingNote.tannin || 1,
              body: tastingNote.body || 1,
              alcohol: tastingNote.alcohol || 1
            }
          });
          hasSearchedRef.current = true;
        }

      } catch (error) {
        console.error('와인 검색 중 오류:', error);
      } finally {
        setIsSearching(false);
      }
    };

    // 와인 기본 정보가 변경될 때만 검색 실행
    if (wineData.name || wineData.origin || wineData.grape || wineData.year || wineData.type) {
      searchWineData();
    }
  }, [wineData.name, wineData.origin, wineData.grape, wineData.year, wineData.type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const currentTaste = wineData.taste || {
      sweetness: 50,
      acidity: 50,
      tannin: 50,
      body: 50,
      alcohol: 50
    };

    onUpdate({
      taste: {
        ...currentTaste,
        [name]: parseInt(value)
      }
    });
  };

  return (
    <main className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">테이스팅 노트 (2/6)</h1>
        <p className="text-gray-600 mt-2">와인의 맛과 향을 기록해주세요.</p>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wine-dark"></div>
          <span className="ml-3 text-gray-600">와인 정보 검색 중...</span>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 space-y-6 shadow-sm">
          {/* Aroma */}
          <div>
            <label htmlFor="aromaNote" className="block text-sm font-medium text-gray-700 mb-2">
              Aroma
            </label>
            <textarea
              id="aromaNote"
              name="aromaNote"
              value={wineData.aromaNote || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black h-24"
              placeholder="와인의 향을 설명해주세요"
            />
          </div>

          {/* Taste */}
          <div>
            <label htmlFor="tasteNote" className="block text-sm font-medium text-gray-700 mb-2">
              Taste
            </label>
            <textarea
              id="tasteNote"
              name="tasteNote"
              value={wineData.tasteNote || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black h-24"
              placeholder="와인의 맛을 설명해주세요"
            />
          </div>

          {/* Finish */}
          <div>
            <label htmlFor="finishNote" className="block text-sm font-medium text-gray-700 mb-2">
              Finish
            </label>
            <textarea
              id="finishNote"
              name="finishNote"
              value={wineData.finishNote || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black h-24"
              placeholder="와인의 여운을 설명해주세요"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Taste</h2>

            {/* Sweetness Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>당도 (Sweetness)</span>
                <div className="flex justify-between w-32">
                  <span>Dry</span>
                  <span>Sweet</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSliderChange({
                      target: { name: 'sweetness', value: value.toString() }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    className={`flex-1 h-8 rounded-lg transition-colors ${(wineData.taste?.sweetness || 0) >= value
                      ? 'bg-wine-dark'
                      : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Acidity Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>산도 (Acidity)</span>
                <div className="flex justify-between w-32">
                  <span>Soft</span>
                  <span>Crisp</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSliderChange({
                      target: { name: 'acidity', value: value.toString() }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    className={`flex-1 h-8 rounded-lg transition-colors ${(wineData.taste?.acidity || 0) >= value
                      ? 'bg-wine-dark'
                      : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Tannin Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>탄닌 (Tanin)</span>
                <div className="flex justify-between w-32">
                  <span>Smooth</span>
                  <span>Firm</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSliderChange({
                      target: { name: 'tannin', value: value.toString() }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    className={`flex-1 h-8 rounded-lg transition-colors ${(wineData.taste?.tannin || 0) >= value
                      ? 'bg-wine-dark'
                      : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Body Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>바디감 (Body)</span>
                <div className="flex justify-between w-32">
                  <span>Light</span>
                  <span>Full</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSliderChange({
                      target: { name: 'body', value: value.toString() }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    className={`flex-1 h-8 rounded-lg transition-colors ${(wineData.taste?.body || 0) >= value
                      ? 'bg-wine-dark'
                      : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Alcohol Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>알코올 (Alcohol)</span>
                <div className="flex justify-between w-32">
                  <span>Light</span>
                  <span>Strong</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSliderChange({
                      target: { name: 'alcohol', value: value.toString() }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    className={`flex-1 h-8 rounded-lg transition-colors ${(wineData.taste?.alcohol || 0) >= value
                      ? 'bg-wine-dark'
                      : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
