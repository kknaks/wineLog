import Image from 'next/image';
import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { isNativeApp, requestCameraPermissions } from '@/lib/utils/mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import client from '@/lib/backend/client';
import { httpFormDataRequest } from '@/lib/utils/http';

interface Step1Props {
  diaryData: DiaryFormData;
  isAnalyzing: boolean;
  onUpdateDiary: (data: Partial<DiaryFormData>) => void;
  onUpdateWine: (wineData: Partial<WineData>) => void;
  onStartAnalyzing: () => void;
}

export default function Step1({ diaryData, isAnalyzing, onUpdateDiary, onUpdateWine, onStartAnalyzing }: Step1Props) {
  const [isManualInput, setIsManualInput] = useState(false);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  // 네이티브 앱에서 권한 미리 요청
  useEffect(() => {
    if (isNativeApp()) {
      requestCameraPermissions()
        .then((permissions) => {
          console.log('Step1 - 카메라 권한 요청 성공:', permissions);
        })
        .catch((error) => {
          console.error('Step1 - 카메라 권한 요청 실패:', error);
        });
    }
  }, []);

  // API 호출 함수
  const analyzeWineImages = async (frontFile: File, backFile: File) => {
    try {
      onStartAnalyzing(); // 분석 시작 상태로 설정

      const formData = new FormData();
      formData.append('image_files', frontFile);
      formData.append('image_files', backFile);

      // 기존 openapi-fetch 클라이언트 사용
      const { data: result, error } = await client.POST('/api/v1/diary/wine-analysis', {
        body: formData as any, // FormData 타입 우회
      });

      if (error) {
        throw new Error(`API 오류: ${error}`);
      }

      console.log('API 응답:', result);

      // 새로운 API 응답 형식에 맞게 처리
      if (result?.analysis_result?.success && result.analysis_result?.analysis?.wine_analysis) {
        const wineAnalysisData = result.analysis_result.analysis.wine_analysis;

        const analysisResult = {
          name: wineAnalysisData.name || '',
          grape: wineAnalysisData.grape || '',
          origin: wineAnalysisData.origin || '',
          year: wineAnalysisData.year || '',
          type: wineAnalysisData.type || 'red',
          description: wineAnalysisData.description || '',
          alcohol: wineAnalysisData.alcohol ? wineAnalysisData.alcohol.toString().replace('%', '') : ''
        };

        setAnalysisResult(analysisResult);
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
        const updatedDiaryData = isFront ? { frontImage: imageUrl } : { backImage: imageUrl };
        onUpdateDiary(updatedDiaryData);

        // 파일 객체도 별도로 저장하고 부모에게 전달
        if (isFront) {
          setFrontImageFile(file);
          onUpdateDiary({ frontImageFile: file });
        } else {
          setBackImageFile(file);
          onUpdateDiary({ backImageFile: file });
        }

        // 두 이미지가 모두 있을 때만 분석 시작 (직접입력 모드가 아닐 때만)
        const bothImagesPresent = isFront
          ? (imageUrl && diaryData.backImage)
          : (diaryData.frontImage && imageUrl);

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
    if (analysisResult && !diaryData.wineData.name && !diaryData.wineData.grape && !diaryData.wineData.origin && !isManualInput) {
      const updateData = {
        name: analysisResult.name || '',
        grape: analysisResult.grape || '',
        origin: analysisResult.origin || '',
        year: analysisResult.year || '',
        type: (analysisResult.type === 'red' || analysisResult.type === 'white' ||
          analysisResult.type === 'sparkling' || analysisResult.type === 'rose' ||
          analysisResult.type === 'icewine' || analysisResult.type === 'natural' ||
          analysisResult.type === 'dessert') ? analysisResult.type : 'red',
        alcohol: analysisResult.alcohol || ''
      };
      onUpdateWine(updateData);
    }
  }, [analysisResult, diaryData.wineData.name, diaryData.wineData.grape, diaryData.wineData.origin, isManualInput, onUpdateWine]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateWine({ [name]: value } as Partial<WineData>);
  };

  const handleSelectChange = (value: string) => {
    onUpdateWine({ type: value as WineData['type'] });
  };

  const handleManualInputChange = (checked: boolean) => {
    setIsManualInput(checked);
    if (checked) {
      // 직접입력 모드로 전환 시 기존 데이터 초기화
      onUpdateWine({
        name: '',
        grape: '',
        origin: '',
        year: '',
        type: 'red',
        alcohol: ''
      });
    }
  };

  // 폼을 표시할 조건: 두 이미지가 모두 있거나, 직접입력 모드일 때
  const shouldShowForm = (diaryData.frontImage && diaryData.backImage) || isManualInput;

  return (
    <main className="flex flex-col px-6 pt-0 pb-6">
      {/* Image Upload Container */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 font-rhodium-libre">Label Image</h2>
        <div className="flex gap-4">
          {/* Front Label Upload */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-sm font-rhodium-libre text-gray-700 mb-2">Front Label</p>
            <label className="relative block w-full aspect-[4/5] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="hidden"
              />
              <div className={`w-full h-full rounded-lg border-2 border-dashed
                ${diaryData.frontImage ? 'border-wine-dark' : 'border-gray-300'}
                hover:border-wine-dark transition-colors relative overflow-hidden`}
              >
                {diaryData.frontImage ? (
                  <Image
                    src={diaryData.frontImage}
                    alt="Front label preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <Plus size={32} />
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Back Label Upload */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-sm font-rhodium-libre text-gray-700 mb-2">Back Label</p>
            <label className="relative block w-full aspect-[4/5] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="hidden"
              />
              <div className={`w-full h-full rounded-lg border-2 border-dashed
                ${diaryData.backImage ? 'border-wine-dark' : 'border-gray-300'}
                hover:border-wine-dark transition-colors relative overflow-hidden`}
              >
                {diaryData.backImage ? (
                  <Image
                    src={diaryData.backImage}
                    alt="Back label preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <Plus size={32} />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Wine Information Form */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800 font-rhodium-libre">Information</h2>
            {isAnalyzing && (
              <div className="flex items-center text-wine-dark">
                <span className="animate-pulse">분석중...</span>
              </div>
            )}
            {analysisResult && !isManualInput && (
              <div className="flex items-center text-blue-600">
                <span className="text-sm">🤖 AI 분석 완료</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="manual-input"
              checked={isManualInput}
              onCheckedChange={handleManualInputChange}
            />
            <Label
              htmlFor="manual-input"
              className="text-sm font-medium text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              직접입력
            </Label>
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
                  <Label htmlFor="name" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                    Wine Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={diaryData.wineData.name || ''}
                    onChange={handleInputChange}
                    placeholder="와인 이름을 입력하세요"
                  />
                </div>

                {/* 원산지 */}
                <div>
                  <Label htmlFor="origin" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                    Origin
                  </Label>
                  <Input
                    type="text"
                    id="origin"
                    name="origin"
                    value={diaryData.wineData.origin || ''}
                    onChange={handleInputChange}
                    placeholder="원산지를 입력하세요"
                  />
                </div>

                {/* 와인 타입과 품종을 한 줄에 */}
                <div className="flex gap-4">
                  {/* 와인 타입 */}
                  <div className="flex-1">
                    <Label htmlFor="type" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                      Wine Type
                    </Label>
                    <Select
                      value={diaryData.wineData.type || ''}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="red">red</SelectItem>
                        <SelectItem value="white">white</SelectItem>
                        <SelectItem value="sparkling">sparkling</SelectItem>
                        <SelectItem value="rose">rose</SelectItem>
                        <SelectItem value="icewine">icewine</SelectItem>
                        <SelectItem value="natural">natural</SelectItem>
                        <SelectItem value="dessert">dessert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 품종 */}
                  <div className="flex-1">
                    <Label htmlFor="grape" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                      Grape
                    </Label>
                    <Input
                      type="text"
                      id="grape"
                      name="grape"
                      value={diaryData.wineData.grape || ''}
                      onChange={handleInputChange}
                      placeholder="품종을 입력하세요"
                    />
                  </div>
                </div>

                {/* 연도와 알코올 도수를 한 줄에 */}
                <div className="flex gap-4">
                  {/* 연도 */}
                  <div className="flex-1">
                    <Label htmlFor="year" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                      Year
                    </Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      value={diaryData.wineData.year || ''}
                      onChange={handleInputChange}
                      placeholder="예: 2020"
                    />
                  </div>

                  {/* 알코올 도수 */}
                  <div className="flex-1">
                    <Label htmlFor="alcohol" className="text-sm font-rhodium-libre text-gray-700 mb-2">
                      Alcohol (%)
                    </Label>
                    <Input
                      type="number"
                      id="alcohol"
                      name="alcohol"
                      value={diaryData.wineData.alcohol || ''}
                      onChange={handleInputChange}
                      placeholder="13.5"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>와인 라벨 이미지를 업로드하거나</p>
            <p>직접입력을 선택하여 정보를 입력해주세요.</p>
          </div>
        )}
      </div>
    </main>
  );
} 