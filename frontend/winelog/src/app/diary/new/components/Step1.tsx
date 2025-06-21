import Image from 'next/image';
import { WineFormData } from '@/lib/types/diary';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Step1Props {
  wineData: WineFormData;
  isAnalyzing: boolean;
  onUpdate: (data: Partial<WineFormData>) => void;
  onStartAnalyzing: () => void;
}

export default function Step1({ wineData, isAnalyzing, onUpdate, onStartAnalyzing }: Step1Props) {
  const [isManualInput, setIsManualInput] = useState(false);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);

  // API 호출 함수
  const analyzeWineImages = async (frontFile: File, backFile: File) => {
    try {
      onStartAnalyzing(); // 분석 시작 상태로 설정

      const formData = new FormData();
      formData.append('image_files', frontFile);
      formData.append('image_files', backFile);

      const response = await fetch('http://localhost:8000/api/v1/diary/wine-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log('API 응답:', result);

      // 새로운 API 응답 형식에 맞게 처리
      if (result.analysis_result?.success && result.analysis_result?.analysis?.wine_analysis) {
        const wineData = result.analysis_result.analysis.wine_analysis;

        const analysisResult = {
          name: wineData.name || '',
          grape: wineData.grape || '',
          origin: wineData.origin || '',
          year: wineData.year || '',
          type: wineData.type === 'red' ? 'red' as const :
            wineData.type === 'white' ? 'white' as const : '' as const,
          description: wineData.description || '',
        };

        onUpdate({ analysisResult });
      }

    } catch (error) {
      console.error('와인 분석 중 오류:', error);
      // 에러 발생 시 사용자에게 알림 (나중에 toast 등으로 개선 가능)
      alert('와인 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isFront: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const updatedData = isFront ? { frontImage: imageUrl } : { backImage: imageUrl };
        onUpdate(updatedData);

        // 파일 객체도 별도로 저장
        if (isFront) {
          setFrontImageFile(file);
        } else {
          setBackImageFile(file);
        }

        // 두 이미지가 모두 있을 때만 분석 시작 (직접입력 모드가 아닐 때만)
        const bothImagesPresent = isFront
          ? (imageUrl && wineData.backImage)
          : (wineData.frontImage && imageUrl);

        const bothFilesPresent = isFront
          ? (file && backImageFile)
          : (frontImageFile && file);

        if (bothImagesPresent && bothFilesPresent && !isManualInput) {
          // API 호출
          const frontFile = isFront ? file : frontImageFile!;
          const backFile = isFront ? backImageFile! : file;
          analyzeWineImages(frontFile, backFile);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI 분석 결과가 있으면 자동으로 폼에 채우기 (직접입력 모드가 아닐 때만)
  useEffect(() => {
    if (wineData.analysisResult && !wineData.name && !wineData.grape && !wineData.origin && !isManualInput) {
      const updateData = {
        name: wineData.analysisResult.name || '',
        grape: wineData.analysisResult.grape || '',
        origin: wineData.analysisResult.origin || '',
        year: wineData.analysisResult.year || '',
        type: (wineData.analysisResult.type === 'red' || wineData.analysisResult.type === 'white')
          ? wineData.analysisResult.type as 'red' | 'white'
          : '' as 'red' | 'white' | '',
        description: wineData.analysisResult.description || ''
      };
      onUpdate(updateData);
    }
  }, [wineData.analysisResult, wineData.name, wineData.grape, wineData.origin, isManualInput, onUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  const handleManualInputChange = (checked: boolean) => {
    setIsManualInput(checked);
    if (checked) {
      // 직접입력 모드로 전환 시 기존 데이터 초기화
      onUpdate({
        name: '',
        grape: '',
        origin: '',
        year: '',
        type: '',
        description: ''
      });
    }
  };

  // 폼을 표시할 조건: 두 이미지가 모두 있거나, 직접입력 모드일 때
  const shouldShowForm = (wineData.frontImage && wineData.backImage) || isManualInput;

  return (
    <main className="flex flex-col h-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">와인 정보 입력 (1/6)</h1>
        <p className="text-gray-600 mt-2">와인 라벨 사진을 업로드하고 정보를 입력해주세요.</p>
      </div>

      {/* Image Upload Container */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">라벨 이미지 업로드</h2>
        <div className="flex gap-4">
          {/* Front Label Upload */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">앞면 라벨</p>
            <label className="relative block w-full aspect-[3/4] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="hidden"
              />
              <div className={`w-full h-full rounded-lg border-2 border-dashed
                ${wineData.frontImage ? 'border-wine-dark' : 'border-gray-300'}
                hover:border-wine-dark transition-colors relative overflow-hidden`}
              >
                {wineData.frontImage ? (
                  <Image
                    src={wineData.frontImage}
                    alt="Front label preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-sm">앞면 라벨 추가</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Back Label Upload */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">뒷면 라벨</p>
            <label className="relative block w-full aspect-[3/4] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="hidden"
              />
              <div className={`w-full h-full rounded-lg border-2 border-dashed
                ${wineData.backImage ? 'border-wine-dark' : 'border-gray-300'}
                hover:border-wine-dark transition-colors relative overflow-hidden`}
              >
                {wineData.backImage ? (
                  <Image
                    src={wineData.backImage}
                    alt="Back label preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-sm">뒷면 라벨 추가</span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Wine Information Form */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">와인 정보</h2>
            {isAnalyzing && (
              <div className="flex items-center text-wine-dark">
                <span className="animate-pulse">분석중...</span>
              </div>
            )}
            {wineData.analysisResult && !isManualInput && (
              <div className="flex items-center text-blue-600">
                <span className="text-sm">🤖 AI가 자동으로 입력했습니다</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="manual-input"
              checked={isManualInput}
              onCheckedChange={handleManualInputChange}
              className="border-gray-400 data-[state=checked]:bg-wine-dark data-[state=checked]:border-wine-dark"
            />
            <label
              htmlFor="manual-input"
              className="text-sm font-medium text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              직접입력
            </label>
          </div>
        </div>

        {shouldShowForm ? (
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wine-dark"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 와인 이름 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    와인 이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={wineData.name || ''}
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
                    value={wineData.origin || ''}
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
                    value={wineData.grape || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
                    placeholder="품종을 입력하세요"
                  />
                </div>

                {/* 연도와 타입을 한 줄에 */}
                <div className="flex gap-4">
                  {/* 연도 */}
                  <div className="flex-1">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      연도
                    </label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      value={wineData.year || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
                      placeholder="예: 2020"
                    />
                  </div>

                  {/* 와인 타입 */}
                  <div className="flex-1">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      와인 타입
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={wineData.type || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black"
                    >
                      <option value="">선택해주세요</option>
                      <option value="red">레드 와인</option>
                      <option value="white">화이트 와인</option>
                    </select>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    상세 정보
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={wineData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-dark focus:border-transparent text-black resize-none"
                    placeholder="와인에 대한 상세 정보를 입력하세요"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>와인 라벨 이미지를 업로드하거나 직접입력을 선택하여 정보를 입력해주세요.</p>
          </div>
        )}
      </div>
    </main>
  );
} 