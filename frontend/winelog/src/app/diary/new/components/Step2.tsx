import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';
import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step2Props {
  diaryData: DiaryFormData;
  onUpdateDiary: (data: Partial<DiaryFormData>) => void;
  onUpdateWine: (wineData: Partial<WineData>) => void;
}

export default function Step2({ diaryData, onUpdateDiary, onUpdateWine }: Step2Props) {
  const [isSearching, setIsSearching] = useState(false);
  const hasSearchedRef = useRef(false);

  // 와인 검색
  useEffect(() => {
    const searchWineData = async () => {
      // 이미 테이스팅 노트 데이터가 있으면 리턴
      if (diaryData.wineData.aromaNote || diaryData.wineData.tasteNote || diaryData.wineData.finishNote) {
        return;
      }

      // name이 없으면 검색하지 않음 (필수값)
      if (!diaryData.wineData.name) {
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
            name: diaryData.wineData.name,
            origin: diaryData.wineData.origin,
            grape: diaryData.wineData.grape,
            year: diaryData.wineData.year,
            type: diaryData.wineData.type,
          }),
        });

        if (!response.ok) {
          throw new Error('검색 중 오류가 발생했습니다');
        }

        const result = await response.json();

        // 검색 결과가 있으면 테이스팅 노트 데이터 업데이트
        if (result.taste_result?.tastingNote) {
          const tastingNote = result.taste_result.tastingNote;
          onUpdateWine({
            aromaNote: tastingNote.aroma || '',
            tasteNote: tastingNote.taste || '',
            finishNote: tastingNote.finish || '',
            sweetness: tastingNote.sweetness || 1,
            acidity: tastingNote.acidity || 1,
            tannin: tastingNote.tannin || 1,
            body: tastingNote.body || 1,
          });
          hasSearchedRef.current = true;
        }

      } catch (error) {
        console.error('와인 검색 중 오류:', error);
      } finally {
        setIsSearching(false);
      }
    };

    // 와인 이름이 있을 때만 검색 실행
    if (diaryData.wineData.name) {
      searchWineData();
    }
  }, [diaryData.wineData.name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateWine({ [name]: value } as Partial<WineData>);
  };

  const handleSliderChange = (name: string, value: number[]) => {
    onUpdateWine({ [name]: value[0] } as Partial<WineData>);
  };

  return (
    <main className="flex flex-col px-6 pt-0 pb-6">
      {/* Tasting Notes Container */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800 font-rhodium-libre">Tasting Notes</h2>
            {isSearching && (
              <div className="flex items-center text-wine-dark">
                <span className="animate-pulse">검색중...</span>
              </div>
            )}
          </div>
        </div>

        {isSearching ? (
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wine-dark"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Aroma */}
            <div>
              <Label htmlFor="aromaNote" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                Aroma
              </Label>
              <Input
                type="text"
                id="aromaNote"
                name="aromaNote"
                value={diaryData.wineData.aromaNote || ''}
                onChange={handleInputChange}
                placeholder="와인의 향을 설명해주세요"
              />
            </div>

            {/* Taste */}
            <div>
              <Label htmlFor="tasteNote" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                Taste
              </Label>
              <Input
                type="text"
                id="tasteNote"
                name="tasteNote"
                value={diaryData.wineData.tasteNote || ''}
                onChange={handleInputChange}
                placeholder="와인의 맛을 설명해주세요"
              />
            </div>

            {/* Finish */}
            <div>
              <Label htmlFor="finishNote" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                Finish
              </Label>
              <Input
                type="text"
                id="finishNote"
                name="finishNote"
                value={diaryData.wineData.finishNote || ''}
                onChange={handleInputChange}
                placeholder="와인의 여운을 설명해주세요"
              />
            </div>
          </div>
        )}
      </div>

      {/* Taste Profile Container */}
      {!isSearching && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-rhodium-libre">Taste Profile</h2>

          <div className="space-y-6">
            {/* Body Slider */}
            <div>
              <div className="mb-3">
                <span className="text-sm font-rhodium-libre text-gray-700">바디감 (Body)</span>
              </div>
              <Slider
                value={[diaryData.wineData.body || 1]}
                onValueChange={(value) => handleSliderChange('body', value)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Light</span>
                <span>Full</span>
              </div>
            </div>

            {/* Tannin Slider */}
            <div>
              <div className="mb-3">
                <span className="text-sm font-rhodium-libre text-gray-700">타닌 (Tannin)</span>
              </div>
              <Slider
                value={[diaryData.wineData.tannin || 1]}
                onValueChange={(value) => handleSliderChange('tannin', value)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Soft</span>
                <span>Firm</span>
              </div>
            </div>

            {/* Acidity Slider */}
            <div>
              <div className="mb-3">
                <span className="text-sm font-rhodium-libre text-gray-700">산도 (Acidity)</span>
              </div>
              <Slider
                value={[diaryData.wineData.acidity || 1]}
                onValueChange={(value) => handleSliderChange('acidity', value)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Sweetness Slider */}
            <div>
              <div className="mb-3">
                <span className="text-sm font-rhodium-libre text-gray-700">단맛 (Sweetness)</span>
              </div>
              <Slider
                value={[diaryData.wineData.sweetness || 1]}
                onValueChange={(value) => handleSliderChange('sweetness', value)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Dry</span>
                <span>Sweet</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
