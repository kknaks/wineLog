'use client';

import { useState, useRef } from 'react';
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

  // 터치 이벤트를 위한 ref와 상태
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < totalSteps) {
      handleNext();
    }
    if (isRightSwipe && currentStep > 1) {
      handlePrev();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      {/* Progress Indicator */}
      <div className="w-full bg-gray-200 h-2 fixed top-14 z-10">
        <div
          className="bg-wine-dark h-2 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div
        ref={containerRef}
        className="pt-14 pb-24 min-h-screen"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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

      {/* Page Dots Indicator */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-2 pb-4">
        {Array.from({ length: totalSteps }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index + 1)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === index + 1
              ? 'bg-wine-dark scale-125'
              : 'bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="fixed bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-gray-400">좌우로 스와이프하여 페이지 이동</p>
      </div>

      <Navbar />
    </div>
  );
}
