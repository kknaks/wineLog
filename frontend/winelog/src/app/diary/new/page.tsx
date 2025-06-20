'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import { mockWineAnalysis } from '@/lib/mock/diary/mock';

interface WineFormData {
  frontImage: string | null;
  backImage: string | null;
  name: string;
  origin: string;
  grape: string;
  year: string;
  type: 'red' | 'white' | '';
  description: string;
  analysisResult: typeof mockWineAnalysis | null;
  taste?: {
    sweetness: number;
    acidity: number;
    tannin: number;
    body: number;
    alcohol: number;
  };
  aroma?: string[];
  pairings?: string[];
  rating?: number;
  review?: string;
  price?: string;
  purchaseLocation?: string;
  drinkDate?: string;
}

export default function NewWineDiary() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wineData, setWineData] = useState<WineFormData>({
    frontImage: null,
    backImage: null,
    name: '',
    origin: '',
    grape: '',
    year: '',
    type: '',
    description: '',
    analysisResult: null,
    pairings: []
  });

  // 터치 이벤트를 위한 ref와 상태
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleUpdateWineData = (data: Partial<WineFormData>) => {
    setWineData(prev => ({ ...prev, ...data }));
  };

  const startAnalyzing = () => {
    setIsAnalyzing(true);
    // 1초 후에 분석 결과 표시
    setTimeout(() => {
      setIsAnalyzing(false);
      handleUpdateWineData({ analysisResult: mockWineAnalysis });
    }, 1000);
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
            onStartAnalyzing={startAnalyzing}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Step2
            wineData={wineData}
            onUpdate={handleUpdateWineData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 3 && (
          <Step3
            wineData={wineData}
            onUpdate={handleUpdateWineData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 4 && (
          <Step4
            wineData={wineData}
            onUpdate={handleUpdateWineData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 5 && (
          <Step5
            wineData={wineData}
            onUpdate={handleUpdateWineData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 6 && (
          <Step6
            wineData={wineData}
            onUpdate={handleUpdateWineData}
            onNext={handleNext}
            onPrev={handlePrev}
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
