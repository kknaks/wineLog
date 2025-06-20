import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './navbar';
import Topbar from './topbar';

interface StepLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
}

export default function StepLayout({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  onNext,
  onPrev,
  isNextDisabled = false,
}: StepLayoutProps) {
  const router = useRouter();

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-white pt-14 pb-20">
      <Topbar />

      {/* Progress Indicator */}
      <div className="w-full bg-gray-200 h-2 fixed top-14">
        <div
          className="bg-wine-dark h-2 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <main className="flex flex-col h-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>

        {/* Form Content */}
        <div className="flex-1 space-y-6">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            이전
          </button>
          {onNext && (
            <button
              onClick={onNext}
              disabled={isNextDisabled}
              className={`px-6 py-2 rounded-full transition-colors ${isNextDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-wine-dark text-white hover:bg-wine-hover'
                }`}
            >
              다음
            </button>
          )}
        </div>
      </main>

      <Navbar />
    </div>
  );
} 