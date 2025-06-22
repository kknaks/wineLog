'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import { WineFormData } from '@/lib/types/diary';

export default function NewWineDiary() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wineData, setWineData] = useState<WineFormData>({
    frontImage: null,
    backImage: null,
    thumbnailImage: null,
    name: '',
    origin: '',
    grape: '',
    year: '',
    type: '',
    description: '',
    analysisResult: null,
    pairings: [],
    aromaNote: '',
    tasteNote: '',
    finishNote: '',
    taste: {
      sweetness: 50,
      acidity: 50,
      tannin: 50,
      body: 50,
      alcohol: 50
    }
  });



  const handleUpdateWineData = (data: Partial<WineFormData>) => {
    setWineData(prev => ({ ...prev, ...data }));
    // 분석 결과가 포함된 업데이트인 경우 분석 상태를 false로 변경
    if ('analysisResult' in data) {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: 실제 API 호출로 변경
      console.log('와인 데이터 저장:', wineData);

      // Mock API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

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
            wineData={wineData}
            isAnalyzing={isAnalyzing}
            onUpdate={handleUpdateWineData}
            onStartAnalyzing={() => setIsAnalyzing(true)}
          />
        )}
        {currentStep === 2 && (
          <Step2
            wineData={wineData}
            onUpdate={handleUpdateWineData}
          />
        )}
        {currentStep === 3 && (
          <Step3
            wineData={wineData}
            onUpdate={handleUpdateWineData}
          />
        )}
        {currentStep === 4 && (
          <Step4
            wineData={wineData}
            onUpdate={handleUpdateWineData}
          />
        )}
        {currentStep === 5 && (
          <Step5
            wineData={wineData}
            onUpdate={handleUpdateWineData}
          />
        )}
        {currentStep === 6 && (
          <Step6
            wineData={wineData}
            onUpdate={handleUpdateWineData}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
              }`}
          >
            이전
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === totalSteps
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-wine-dark text-white hover:bg-wine-darker active:bg-wine-darkest'
              }`}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
