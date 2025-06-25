'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import { DiaryFormData } from '@/lib/types/diary';
import { WineData } from '@/lib/types/wine';
import { Button } from '@/components/ui/button';
import client from '@/lib/backend/client';
import { httpFormDataRequest } from '@/lib/utils/http';

export default function NewWineDiary() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [diaryData, setDiaryData] = useState<DiaryFormData>({
    wineData: {
      id: 0,
      name: '',
      origin: '',
      grape: '',
      year: '',
      alcohol: '',
      type: 'red',
      aromaNote: '',
      tasteNote: '',
      finishNote: '',
      sweetness: 50,
      acidity: 50,
      tannin: 50,
      body: 50,
    },
    frontImage: null,
    backImage: null,
    thumbnailImage: null,
    downloadImage: null,
    drinkDate: new Date().toISOString().split('T')[0],
    rating: 0,
    review: '',
    price: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
  });

  const handleUpdateDiaryData = (data: Partial<DiaryFormData>) => {
    setDiaryData(prev => ({ ...prev, ...data }));
    // 분석 결과가 포함된 업데이트인 경우 분석 상태를 false로 변경
    if ('wineData' in data) {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateWineData = (wineData: Partial<WineData>) => {
    setDiaryData(prev => ({
      ...prev,
      wineData: { ...prev.wineData, ...wineData }
    }));
    // AI 분석으로 와인 데이터가 업데이트되면 분석 상태를 false로 변경
    if (isAnalyzing) {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('와인 일기 데이터 저장:', diaryData);

      // FormData 생성 (이미지 파일 포함)
      const formData = new FormData();

      // 와인 데이터를 JSON으로 추가
      formData.append('wineData', JSON.stringify(diaryData.wineData));
      formData.append('drinkDate', diaryData.drinkDate || new Date().toISOString().split('T')[0]);
      formData.append('rating', (diaryData.rating || 0).toString());
      formData.append('review', diaryData.review || '');
      formData.append('price', diaryData.price || '');
      formData.append('isPublic', (diaryData.isPublic || false).toString());

      // 이미지 파일들 추가 (File 객체 사용)
      if (diaryData.frontImageFile) {
        formData.append('frontImage', diaryData.frontImageFile);
      }
      if (diaryData.backImageFile) {
        formData.append('backImage', diaryData.backImageFile);
      }
      if (diaryData.thumbnailImageFile) {
        formData.append('thumbnailImage', diaryData.thumbnailImageFile);
      }
      if (diaryData.downloadImageFile) {
        formData.append('downloadImage', diaryData.downloadImageFile);
      }

      console.log('전송할 FormData:', {
        wineData: diaryData.wineData,
        drinkDate: diaryData.drinkDate,
        rating: diaryData.rating,
        review: diaryData.review,
        price: diaryData.price,
        isPublic: diaryData.isPublic,
        hasImages: {
          frontImage: !!diaryData.frontImageFile,
          backImage: !!diaryData.backImageFile,
          thumbnailImage: !!diaryData.thumbnailImageFile,
          downloadImage: !!diaryData.downloadImageFile,
        }
      });

      // 기존 openapi-fetch 클라이언트 사용
      const { data, error } = await client.POST('/api/v1/diary/save', {
        body: formData as any, // FormData 타입 우회
      });

      if (error) {
        throw new Error(`API 요청 실패: ${error}`);
      }

      console.log('저장 결과:', data);

      // 저장 성공 시 홈으로 이동 또는 성공 메시지 표시
      alert('와인 일기가 성공적으로 저장되었습니다!');

    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 1 && (
          <Step1
            diaryData={diaryData}
            isAnalyzing={isAnalyzing}
            onUpdateDiary={handleUpdateDiaryData}
            onUpdateWine={handleUpdateWineData}
            onStartAnalyzing={() => setIsAnalyzing(true)}
          />
        )}
        {currentStep === 2 && (
          <Step2
            diaryData={diaryData}
            onUpdateDiary={handleUpdateDiaryData}
            onUpdateWine={handleUpdateWineData}
          />
        )}
        {currentStep === 3 && (
          <Step3
            diaryData={diaryData}
            onUpdateDiary={handleUpdateDiaryData}
            onUpdateWine={handleUpdateWineData}
          />
        )}
        {currentStep === 4 && (
          <Step4
            diaryData={diaryData}
            onUpdateDiary={handleUpdateDiaryData}
            onUpdateWine={handleUpdateWineData}
          />
        )}
        {currentStep === 5 && (
          <Step5
            diaryData={diaryData}
            onUpdateDiary={handleUpdateDiaryData}
            onUpdateWine={handleUpdateWineData}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-4 py-2 bg-white">
        <div className="flex justify-between">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
            size="lg"
          >
            Prev
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="default"
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="default"
              size="lg"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
